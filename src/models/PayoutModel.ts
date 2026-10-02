export type MatchCount = 3 | 4 | 5;

export type SymbolPayoutTable = Record<number, Record<MatchCount, number>>;

/** Payout multipliers by symbol ID and matching count. */
export const SYMBOL_PAYOUT_MULTIPLIERS: SymbolPayoutTable = {
    0: { 3: 1, 4: 2, 5: 5 },
    1: { 3: 2, 4: 5, 5: 12 },
    2: { 3: 3, 4: 8, 5: 20 },
    3: { 3: 5, 4: 12, 5: 30 },
    4: { 3: 8, 4: 20, 5: 50 },
    5: { 3: 12, 4: 30, 5: 80 },
    6: { 3: 0, 4: 0, 5: 0 },
    7: { 3: 0, 4: 0, 5: 0 },
};

export class PayoutModel {
    public static getWinAmount(symbolId: number, matchCount: MatchCount, bet = 1): number {
        const multiplier = SYMBOL_PAYOUT_MULTIPLIERS[symbolId]?.[matchCount] ?? 0;
        return multiplier * bet;
    }
}
