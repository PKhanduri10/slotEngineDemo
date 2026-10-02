import * as PIXI from 'pixi.js';
import { GameStateModel, GameState } from './models/GameStateModel';
import { NetworkService } from './services/NetworkService';
import { WinEvaluator } from './services/WinEvaluator';
import { SymbolManager } from './managers/SymbolManager';
import { ReelAnimationManager } from './managers/ReelAnimationManager';
import { GridView } from './views/GridView';
import { ButtonPanel } from './views/ButtonPanel';
import { EventBus, GameEvents } from './core/EventBus';
import { WinPanel } from './views/WinPanel';

export class GameController {
    private stage: PIXI.Container;
    private stateModel: GameStateModel;
    private networkService: NetworkService;
    private symbolManager: SymbolManager;
    private animationManager!: ReelAnimationManager;
    private gridView!: GridView;
    private hudView!: ButtonPanel;
    private winPanel!: WinPanel;
    private balance = 1000;
    private bet = 1;
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

        this.winPanel = new WinPanel();
        this.winPanel.position.set(640, 360);
        this.stage.addChild(this.winPanel);

        this.hudView = new ButtonPanel();
        this.hudView.position.set(400, 610);
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
        this.balance -= this.bet;
        this.hudView.setBalance(this.balance);
        this.winPanel.hide();

        try {
            // Fetch RNG Data from Network
            const rngData = await this.networkService.fetchRNGResult();

            // Run GSAP Sequential Reel Spin Animation
            await this.animationManager.spinReels(rngData.matrix);

            this.stateModel.transitionTo(GameState.EVALUATING);
            const { totalWin } = WinEvaluator.evaluate(rngData.matrix);
            this.balance += totalWin;
            this.hudView.setBalance(this.balance);

            if (totalWin > 0) {
                this.winPanel.showWin(totalWin);
            }
        } catch (error) {
            console.error('[Spin Error]:', error);
        } finally {
            this.stateModel.transitionTo(GameState.IDLE);
        }
    }
}