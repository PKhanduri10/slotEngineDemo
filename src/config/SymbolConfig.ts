import * as PIXI from 'pixi.js';
import { AssetLoader } from '../assets/AssetLoader';

export const SYMBOL_WIDTH = 110;
export const SYMBOL_HEIGHT = 110;
export const SYMBOL_ROW_HEIGHT = 110;
export const REEL_WIDTH = 130;

export interface SymbolDefinition {
    id: number;
    alias: string;
    frameName: string;
    texture: PIXI.Texture;
    fallbackColor: number;
}

const fallbackTexture = PIXI.Texture.WHITE;

export const SYMBOL_DEFINITIONS: SymbolDefinition[] = [];
export const SYMBOL_BY_ID = new Map<number, SymbolDefinition>();

export function registerSymbol(id: number, alias: string, frameName: string, fallbackColor: number): SymbolDefinition {
    const definition: SymbolDefinition = {
        id,
        alias,
        frameName,
        texture: AssetLoader.getTexture(alias, frameName) ?? fallbackTexture,
        fallbackColor,
    };

    SYMBOL_BY_ID.set(id, definition);
    const existingIndex = SYMBOL_DEFINITIONS.findIndex((symbol) => symbol.id === id);
    if (existingIndex >= 0) {
        SYMBOL_DEFINITIONS[existingIndex] = definition;
    } else {
        SYMBOL_DEFINITIONS.push(definition);
    }

    return definition;
}

const SYMBOL_FRAMES = [
    { id: 0, frameName: 'symbol_santa_hat', fallbackColor: 0xe0c3ff },
    { id: 1, frameName: 'symbol_candy_cane', fallbackColor: 0xffb84d },
    { id: 2, frameName: 'symbol_bauble', fallbackColor: 0x73d2ff },
    { id: 3, frameName: 'symbol_gingerbread', fallbackColor: 0xff7b7b },
    { id: 4, frameName: 'symbol_stocking', fallbackColor: 0xb9ff7b },
    { id: 5, frameName: 'symbol_bell', fallbackColor: 0xffdf71 },
    { id: 6, frameName: 'symbol_snow_globe', fallbackColor: 0x8ef0d4 },
    { id: 7, frameName: 'symbol_star_tree', fallbackColor: 0xff99cc },
] as const;

for (const { id, frameName, fallbackColor } of SYMBOL_FRAMES) {
    registerSymbol(id, 'symbols-sheet', frameName, fallbackColor);
}
