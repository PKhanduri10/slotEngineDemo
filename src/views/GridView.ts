import * as PIXI from 'pixi.js';
import { ReelView } from './ReelView';
import { SymbolManager } from '../managers/SymbolManager';

export class GridView extends PIXI.Container {
    public reels: ReelView[] = [];

    constructor(symbolManager: SymbolManager, cols: number = 5, rows: number = 3) {
        super();
        this.initGrid(symbolManager, cols, rows);
    }

    private initGrid(symbolManager: SymbolManager, cols: number, rows: number): void {
        this.removeChildren();
        this.reels = [];

        for (let c = 0; c < cols; c++) {
            // Updated: c ko as 'reelIndex' pass kar rahe hain
            const reel = new ReelView(symbolManager, c, rows);
            reel.x = c * 130;
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