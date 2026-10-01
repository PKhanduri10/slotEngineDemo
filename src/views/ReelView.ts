import * as PIXI from 'pixi.js';
import { SymbolManager } from '../managers/SymbolManager';

export class ReelView extends PIXI.Container {
    private symbolManager: SymbolManager;
    public symbolSprites: PIXI.Sprite[] = [];
    private readonly symbolIds: number[] = [0, 1, 2, 3, 4];

    public reelIndex: number;
    public rows: number;
    public symbolHeight: number = 140;
    public blurFilter: PIXI.BlurFilter;
    private stopSymbols: number[] | null = null;

    constructor(symbolManager: SymbolManager, reelIndex: number, rows: number = 3) {
        super();
        this.symbolManager = symbolManager;
        this.reelIndex = reelIndex;
        this.rows = rows;

        // Blur Filter create karein high speed spin effect ke liye
        this.blurFilter = new PIXI.BlurFilter();
        this.blurFilter.blurX = 0;
        this.blurFilter.blurY = 0;
        this.filters = [this.blurFilter];

        this.createReelMask();
        this.createReel();
    }

    // Clip/Hide symbols outside reel view
    private createReelMask(): void {
        const maskGraphics = new PIXI.Graphics();
        maskGraphics.rect(0, 0, 130, this.rows * this.symbolHeight);
        maskGraphics.fill(0xffffff);
        this.addChild(maskGraphics);
        this.mask = maskGraphics;
    }

    private createReel(): void {
        // Visible rows + 2 extra buffer symbols top and bottom looping ke liye
        for (let r = -1; r <= this.rows; r++) {
            const randomValue = this.symbolIds[Math.floor(Math.random() * this.symbolIds.length)];
            const sprite = this.symbolManager.getSymbol(randomValue);
            const label = new PIXI.Text({
                text: String(randomValue),
                style: {
                    fontSize: 28,
                    fill: 0x000000,
                    fontWeight: '700',
                },
            });
            label.anchor.set(0.5);
            label.position.set(sprite.width / 2, sprite.height / 2);
            sprite.addChild(label);

            (sprite as PIXI.Sprite & { symbolValue?: number; symbolLabel?: PIXI.Text }).symbolValue = randomValue;
            (sprite as PIXI.Sprite & { symbolValue?: number; symbolLabel?: PIXI.Text }).symbolLabel = label;

            sprite.x = 10;
            sprite.y = r * this.symbolHeight;
            this.addChild(sprite);
            this.symbolSprites.push(sprite);
        }
    }

    private applySymbolValue(sprite: PIXI.Sprite, value: number): void {
        const symbolValue = value % this.symbolIds.length;
        const meta = sprite as PIXI.Sprite & { symbolValue?: number; symbolLabel?: PIXI.Text };

        this.symbolManager.applySymbol(sprite, symbolValue);
        meta.symbolValue = symbolValue;

        if (meta.symbolLabel) {
            meta.symbolLabel.text = String(symbolValue);
        }
    }

    public prepareStopSymbols(values: number[]): void {
        // Symbols enter from the top, so queue the final column bottom-to-top.
        this.stopSymbols = values.slice(0, this.rows).reverse();
    }

    public getDistanceToNextRowBoundary(): number {
        const topSprite = this.symbolSprites.reduce((top, sprite) => sprite.y < top.y ? sprite : top);
        const offset = ((topSprite.y + this.symbolHeight) % this.symbolHeight + this.symbolHeight) % this.symbolHeight;
        return offset === 0 ? this.symbolHeight : this.symbolHeight - offset;
    }

    public clearStopSymbols(): void {
        this.stopSymbols = null;
    }

    // Scroll continuously and report when all queued final symbols have entered.
    public scrollSymbols(speed: number): boolean {
        const totalHeight = (this.rows + 2) * this.symbolHeight;
        let stopSequenceReady = false;

        this.symbolSprites.forEach((sprite) => {
            sprite.y += speed;

            // Threshold check: jab symbol bottom viewport ke bahar nikal jaye
            if (sprite.y >= (this.rows + 1) * this.symbolHeight) {
                sprite.y -= totalHeight; // Send back to top
                if (this.stopSymbols !== null) {
                    const nextValue = this.stopSymbols.shift();
                    if (nextValue !== undefined) {
                        this.applySymbolValue(sprite, nextValue);
                        stopSequenceReady = this.stopSymbols.length === 0;
                    }
                } else {
                    const nextValue = this.symbolIds[Math.floor(Math.random() * this.symbolIds.length)];
                    this.applySymbolValue(sprite, nextValue);
                }
            }
        });

        return stopSequenceReady;
    }

    public updateSymbols(values: number[]): void {
        // Map every visible slot to the correct matrix value and keep the extra
        // buffer rows randomised so the reel still feels live.
        console.log("target matrix",values)
        this.symbolSprites.forEach((sprite, index) => {
            sprite.y = (index - 1) * this.symbolHeight;

            if (index === 0 || index === this.rows + 1) {
                const fallbackValue = this.symbolIds[Math.floor(Math.random() * this.symbolIds.length)];
                this.applySymbolValue(sprite, fallbackValue);
                return;
            }

            const visibleIndex = index - 1;
            const value = values[visibleIndex];

            if (value !== undefined) {
                this.applySymbolValue(sprite, value);
            }
        });
    }
}