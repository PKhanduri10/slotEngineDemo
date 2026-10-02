import * as PIXI from 'pixi.js';
import { EventBus, GameEvents } from '../core/EventBus';

export class ButtonPanel extends PIXI.Container {
    private spinButton!: PIXI.Container;
    private statusText!: PIXI.Text;
    private balanceText!: PIXI.Text;
    private betText!: PIXI.Text;
    private eventBus = EventBus.getInstance();

    constructor() {
        super();
        this.balanceText = this.createValuePanel('BALANCE', '$1,000.00', 0);
        this.betText = this.createValuePanel('BET', '$1.00', 330);
        this.createStatusText();
        this.createSpinButton();
        this.listenToEvents();
    }

    public setBalance(value: number): void {
        this.balanceText.text = `$${value.toFixed(2)}`;
    }

    public setBet(value: number): void {
        this.betText.text = `$${value.toFixed(2)}`;
    }

    private createValuePanel(title: string, initialValue: string, x: number): PIXI.Text {
        const panel = new PIXI.Container();
        const background = new PIXI.Graphics();
        background.roundRect(0, 0, 150, 60, 10);
        background.fill({ color: 0x252b48 });
        background.stroke({ color: 0x596080, width: 1 });

        const titleText = new PIXI.Text({
            text: title,
            style: new PIXI.TextStyle({
                fill: '#aeb8d8',
                fontSize: 12,
                fontWeight: 'bold'
            })
        });
        titleText.position.set(12, 6);

        const valueText = new PIXI.Text({
            text: initialValue,
            style: new PIXI.TextStyle({
                fill: '#ffffff',
                fontSize: 19,
                fontWeight: 'bold'
            })
        });
        valueText.position.set(12, 27);

        panel.addChild(background, titleText, valueText);
        panel.position.set(x, 0);
        this.addChild(panel);
        return valueText;
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
        this.statusText.anchor.set(0.5, 0);
        this.statusText.position.set(240, -38);
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

        this.spinButton.position.set(170, 5);
        this.spinButton.addChild(bg, txt);
        this.setSpinEnabled(false);

        this.spinButton.on('pointerdown', () => {
            this.setSpinEnabled(false);
            this.eventBus.emit(GameEvents.USER_CLICK_SPIN);
        });

        this.addChild(this.spinButton);
    }

    private listenToEvents(): void {
        this.eventBus.on(GameEvents.STATE_CHANGED, (state: string) => {
            this.statusText.text = `Status: ${state}`;
            this.setSpinEnabled(state === 'IDLE');
        });
    }

    private setSpinEnabled(enabled: boolean): void {
        this.spinButton.eventMode = enabled ? 'static' : 'none';
        this.spinButton.cursor = enabled ? 'pointer' : 'default';
        this.spinButton.alpha = enabled ? 1 : 0.55;
    }
}