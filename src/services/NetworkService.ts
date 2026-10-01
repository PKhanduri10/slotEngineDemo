export interface SpinResponse {
    matrix: number[][]; // 3x5 Grid
    totalWin: number;
    winningLines: number[];
}

export class NetworkService {
    public async fetchRNGResult(): Promise<SpinResponse> {
        // Simulating 1 second network latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock 3x5 Reel Matrix
        return {
            matrix: [
                [1, 2, 0, 4, 1],
                [0, 1, 1, 2, 3],
                [2, 0, 4, 1, 0]
            ],
            totalWin: 50,
            winningLines: [1, 3]
        };
    }
}