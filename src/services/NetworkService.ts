import { WinEvaluator } from './WinEvaluator';

export interface SpinResponse {
    matrix: number[][]; // 3x5 Grid
    totalWin: number;
    winningLines: number[];
}

export class NetworkService {
    public createDummyResult(): SpinResponse {
        const matrix: number[][] = [
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4],
            [0, 1, 2, 3, 4],
        ];

        const { totalWin, winningLines } = WinEvaluator.evaluate(matrix);

        return {
            matrix,
            totalWin,
            winningLines,
        };
    }

    public async fetchRNGResult(): Promise<SpinResponse> {
        // Simulating 1 second network latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const rows = 3;
        const cols = 5;
        const symbolPool = [0, 1, 2, 3, 4];

        const matrix = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () =>
                symbolPool[Math.floor(Math.random() * symbolPool.length)]
            )
        );

        const { totalWin, winningLines } = WinEvaluator.evaluate(matrix);

        return {
            matrix,
            totalWin,
            winningLines,
        };
    }
}