import * as PIXI from 'pixi.js';
import { GameStateModel, GameState } from './models/GameStateModel';
import { NetworkService } from './services/NetworkService';
import { SymbolManager } from './managers/SymbolManager';
import { ReelAnimationManager } from './managers/ReelAnimationManager';
import { GridView } from './views/GridView';
import { HUDView } from './views/HUDView';
import { EventBus, GameEvents } from './core/EventBus';

export class GameController {
    private stage: PIXI.Container;
    private stateModel: GameStateModel;
    private networkService: NetworkService;
    private symbolManager: SymbolManager;
    private animationManager!: ReelAnimationManager;
    private gridView!: GridView;
    private hudView!: HUDView;
    private eventBus = EventBus.getInstance();

    constructor(stage: PIXI.Container) {
        this.stage = stage;
        this.stateModel = new GameStateModel();
        this.networkService = new NetworkService();
        this.symbolManager = new SymbolManager(30);

        this.setupUI();
        this.animationManager = new ReelAnimationManager(this.gridView);
        this.setupListeners();
    }

    private setupUI(): void {
        this.gridView = new GridView(this.symbolManager, 5, 3);
        this.gridView.position.set(320, 180);
        this.stage.addChild(this.gridView);

        this.hudView = new HUDView();
        this.hudView.position.set(570, 600);
        this.stage.addChild(this.hudView);
    }

    public init(): void {
        this.stateModel.transitionTo(GameState.IDLE);
    }

    private setupListeners(): void {
        this.eventBus.on(GameEvents.USER_CLICK_SPIN, () => {
            this.onSpinButtonClick();
        });
    }

    public async onSpinButtonClick(): Promise<void> {
        if (!this.stateModel.canSpin()) {
            console.warn('[Guard]: Game is currently busy!');
            return;
        }

        this.stateModel.transitionTo(GameState.SPINNING);

        try {
            // Fetch RNG Data from Network
            const rngData = await this.networkService.fetchRNGResult();

            // Run GSAP Sequential Reel Spin Animation
            await this.animationManager.spinReels(rngData.matrix);

            this.stateModel.transitionTo(GameState.EVALUATING);

            if (rngData.totalWin > 0) {
                this.stateModel.transitionTo(GameState.WIN_CELEBRATION);
                await new Promise((res) => setTimeout(res, 1500));
            }
        } catch (error) {
            console.error('[Spin Error]:', error);
        } finally {
            this.stateModel.transitionTo(GameState.IDLE);
        }
    }
}