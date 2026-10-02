export type AssetEntry = {
    alias: string;
    spritePath: string;
    atlasPath: string;
};

export const GAME_ASSET_MANIFEST: AssetEntry[] = [
    { alias: 'symbols-sheet', spritePath: '/graphics/symbols.png', atlasPath: '/graphics/symbols.json' },
];
