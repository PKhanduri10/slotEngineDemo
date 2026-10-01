import { describe, expect, it } from 'vitest';
import { WinEvaluator } from './WinEvaluator';
import { PayoutModel, SYMBOL_PAYOUT_MULTIPLIERS } from '../models/PayoutModel';

describe('PayoutModel', () => {
    it('returns a symbol-specific win amount for 3, 4, and 5 matches', () => {
        for (const [symbolId, payouts] of Object.entries(SYMBOL_PAYOUT_MULTIPLIERS)) {
            expect(PayoutModel.getWinAmount(Number(symbolId), 3)).toBe(payouts[3]);
            expect(PayoutModel.getWinAmount(Number(symbolId), 4)).toBe(payouts[4]);
            expect(PayoutModel.getWinAmount(Number(symbolId), 5)).toBe(payouts[5]);
        }
    });

    it('scales the payout by the bet', () => {
        expect(PayoutModel.getWinAmount(4, 5, 2)).toBe(100);
    });
});

describe('WinEvaluator', () => {
    it.each([
        { matchCount: 3, row: [4, 4, 4, 1, 0], expectedWin: 8 },
        { matchCount: 4, row: [4, 4, 4, 4, 0], expectedWin: 20 },
        { matchCount: 5, row: [4, 4, 4, 4, 4], expectedWin: 50 },
    ])('pays the $matchCount-match multiplier', ({ row, expectedWin }) => {
        const result = WinEvaluator.evaluate([
            row,
            [0, 1, 2, 3, 4],
            [1, 2, 3, 4, 0],
        ]);

        expect(result.winningLines).toContain(0);
        expect(result.totalWin).toBe(expectedWin);
    });
});
