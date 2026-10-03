export type AssetEntry = {
    alias: string;
    spritePath: string;
    atlasPath: string;
};

export const GAME_ASSET_MANIFEST: AssetEntry[] = [
    {
        alias: 'symbols-sheet',
        spritePath: `${import.meta.env.BASE_URL}graphics/symbols.png`,
        atlasPath: `${import.meta.env.BASE_URL}graphics/symbols.json`,
    },
];
