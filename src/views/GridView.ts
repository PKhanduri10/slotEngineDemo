import * as PIXI from 'pixi.js';
import { REEL_WIDTH, SYMBOL_ROW_HEIGHT } from '../config/SymbolConfig';
import { ReelView } from './ReelView';
import { SymbolManager } from '../managers/SymbolManager';

export class GridView extends PIXI.Container {
    public reels: ReelView[] = [];

    constructor(
        symbolManager: SymbolManager,
        cols: number = 5,
        rows: number = 3,
        symbolHeight: number = SYMBOL_ROW_HEIGHT,
        reelWidth: number = REEL_WIDTH
    ) {
        super();
        this.initGrid(symbolManager, cols, rows, symbolHeight, reelWidth);
    }

    private initGrid(
        symbolManager: SymbolManager,
        cols: number,
        rows: number,
        symbolHeight: number,
        reelWidth: number
    ): void {
        this.removeChildren();
        this.reels = [];

        for (let c = 0; c < cols; c++) {
            // Updated: c ko as 'reelIndex' pass kar rahe hain
            const reel = new ReelView(symbolManager, c, rows, symbolHeight, reelWidth);
            reel.x = c * reelWidth;
            this.addChild(reel);
            this.reels.push(reel);
        }
    }

    public updateGrid(matrix: number[][]): void {
        this.reels.forEach((reel, colIndex) => {
            const columnValues = matrix.map((row) => row[colIndex]);
            reel.updateSymbols(columnValues);
        });
    }
}