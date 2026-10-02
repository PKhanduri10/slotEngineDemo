import * as PIXI from 'pixi.js';

export class WinPanel extends PIXI.Container {
    private amountText: PIXI.Text;

    constructor() {
        super();
        this.visible = false;

        const background = new PIXI.Graphics();
        background.roundRect(-130, -65, 260, 130, 16);
        background.fill({ color: 0x171b31, alpha: 0.94 });
        background.stroke({ color: 0xffd166, width: 3 });

        const title = new PIXI.Text({
            text: 'WIN',
            style: new PIXI.TextStyle({
                fill: '#ffd166',
                fontSize: 24,
                fontWeight: 'bold',
                align: 'center'
            })
        });
        title.anchor.set(0.5);
        title.position.set(0, -24);

        this.amountText = new PIXI.Text({
            text: '$0.00',
            style: new PIXI.TextStyle({
                fill: '#ffffff',
                fontSize: 30,
                fontWeight: 'bold',
                align: 'center'
            })
        });
        this.amountText.anchor.set(0.5);
        this.amountText.position.set(0, 20);

        this.addChild(background, title, this.amountText);
    }

    public showWin(amount: number): void {
        this.amountText.text = `$${amount.toFixed(2)}`;
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }
}
