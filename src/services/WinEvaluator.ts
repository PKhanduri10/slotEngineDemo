import { MatchCount, PayoutModel } from '../models/PayoutModel';

export interface WinPattern {
    id: number;
    cells: Array<[number, number]>;
}

export interface WinEvaluation {
    totalWin: number;
    winningLines: number[];
}

const WIN_PATTERNS: WinPattern[] = [
    { id: 0, cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
    { id: 1, cells: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]] },
    { id: 2, cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
    { id: 3, cells: [[0, 0], [1, 1], [2, 2]] },
    { id: 4, cells: [[0, 4], [1, 3], [2, 2], [1, 1], [0, 0]] },
    { id: 5, cells: [[0, 0], [1, 0], [2, 0]] },
    { id: 6, cells: [[0, 1], [1, 1], [2, 1]] },
    { id: 7, cells: [[0, 2], [1, 2], [2, 2]] },
    { id: 8, cells: [[0, 3], [1, 3], [2, 3]] },
    { id: 9, cells: [[0, 4], [1, 4], [2, 4]] },
];

export class WinEvaluator {
    public static evaluate(matrix: number[][]): WinEvaluation {
        const winningLines: number[] = [];
        let totalWin = 0;

        for (const pattern of WIN_PATTERNS) {
            const firstCell = pattern.cells[0];
            const firstValue = matrix[firstCell[0]]?.[firstCell[1]];

            if (firstValue === undefined) {
                continue;
            }

            let matchCount = 0;
            for (const [row, col] of pattern.cells) {
                if (matrix[row]?.[col] !== firstValue) {
                    break;
                }
                matchCount += 1;
            }

            if (matchCount < 3) {
                continue;
            }

            winningLines.push(pattern.id);
            totalWin += PayoutModel.getWinAmount(firstValue, matchCount as MatchCount);
        }

        return { totalWin, winningLines };
    }
}
