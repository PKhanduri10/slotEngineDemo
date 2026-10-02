export interface SpinResponse {
    matrix: number[][]; // 3x5 Grid
}

export class NetworkService {
    public createDummyResult(): SpinResponse {
        const matrix: number[][] = [
            [0, 1, 2, 3, 4],
            [5, 6, 7, 0, 1],
            [2, 3, 4, 5, 6],
        ];

        return { matrix };
    }

    public async fetchRNGResult(): Promise<SpinResponse> {
        // Simulating 1 second network latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const rows = 3;
        const cols = 5;
        const symbolPool = [0, 1, 2, 3, 4, 5, 6, 7];

        const matrix = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () =>
                symbolPool[Math.floor(Math.random() * symbolPool.length)]
            )
        );

        return { matrix };
    }
}