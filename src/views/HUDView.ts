import * as PIXI from 'pixi.js';
import { EventBus, GameEvents } from '../core/EventBus';

export class HUDView extends PIXI.Container {
    private spinButton!: PIXI.Container;
    private statusText!: PIXI.Text;
    private eventBus = EventBus.getInstance();

    constructor() {
        super();
        this.createStatusText();
        this.createSpinButton();
        this.listenToEvents();
    }

    private createStatusText(): void {
        this.statusText = new PIXI.Text({
            text: 'Status: IDLE',
            style: new PIXI.TextStyle({
                fill: '#ffffff',
                fontSize: 22,
                fontWeight: 'bold'
            })
        });
        this.statusText.position.set(0, -50);
        this.addChild(this.statusText);
    }

    private createSpinButton(): void {
        this.spinButton = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.roundRect(0, 0, 140, 50, 8);
        bg.fill({ color: 0x00b894 });

        const txt = new PIXI.Text({
            text: 'SPIN',
            style: new PIXI.TextStyle({
                fill: '#ffffff',
                fontSize: 20,
                fontWeight: 'bold'
            })
        });
        txt.position.set(42, 12);

        this.spinButton.addChild(bg, txt);
        this.spinButton.eventMode = 'static';
        this.spinButton.cursor = 'pointer';

        this.spinButton.on('pointerdown', () => {
            this.eventBus.emit(GameEvents.USER_CLICK_SPIN);
        });

        this.addChild(this.spinButton);
    }

    private listenToEvents(): void {
        this.eventBus.on(GameEvents.STATE_CHANGED, (state: string) => {
            this.statusText.text = `Status: ${state}`;
        });
    }
}