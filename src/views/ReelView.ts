import * as PIXI from 'pixi.js';
import { SymbolManager } from '../managers/SymbolManager';

export class ReelView extends PIXI.Container {
    private symbolManager: SymbolManager;
    public symbolSprites: PIXI.Sprite[] = [];
    private symbolColors: number[] = [0xff5733, 0x33ff57, 0x3357ff, 0xf3ff33, 0xff33f3];
    
    public reelIndex: number;
    public rows: number;
    public symbolHeight: number = 130;

    constructor(symbolManager: SymbolManager, reelIndex: number, rows: number = 3) {
        super();
        this.symbolManager = symbolManager;
        this.reelIndex = reelIndex;
        this.rows = rows;

        this.createReel();
    }

    private createReel(): void {
        this.symbolSprites = [];

        for (let r = 0; r < this.rows + 1; r++) {
            const randomColor = this.symbolColors[Math.floor(Math.random() * this.symbolColors.length)];
            
            // Get symbol safely from manager
            const sprite: PIXI.Sprite = this.symbolManager.getSymbol(randomColor);
            
            sprite.y = r * this.symbolHeight;
            this.addChild(sprite);
            this.symbolSprites.push(sprite);
        }
    }

    public updateSymbols(colors: number[]): void {
        this.symbolSprites.forEach((sprite, index) => {
            if (colors[index] !== undefined && sprite) {
                sprite.tint = colors[index];
            }
        });
    }
}