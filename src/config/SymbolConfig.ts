import * as PIXI from 'pixi.js';
import { AssetLoader } from '../assets/AssetLoader';

export interface SymbolDefinition {
    id: number;
    alias: string;
    texture: PIXI.Texture;
    fallbackColor: number;
}

const fallbackTexture = PIXI.Texture.WHITE;

export const SYMBOL_DEFINITIONS: SymbolDefinition[] = [
    { id: 0, alias: 'sym_low1', texture: AssetLoader.getTexture('sym_low1') ?? fallbackTexture, fallbackColor: 0xff5733 },
    { id: 1, alias: 'sym_high1', texture: AssetLoader.getTexture('sym_high1') ?? fallbackTexture, fallbackColor: 0x33ff57 },
    { id: 2, alias: 'sym_scatter', texture: AssetLoader.getTexture('sym_scatter') ?? fallbackTexture, fallbackColor: 0x3357ff },
    { id: 3, alias: 'sym_wild', texture: AssetLoader.getTexture('sym_wild') ?? fallbackTexture, fallbackColor: 0xf3ff33 },
    { id: 4, alias: 'sym_low1', texture: AssetLoader.getTexture('sym_low1') ?? fallbackTexture, fallbackColor: 0xff33f3 },
];

export const SYMBOL_BY_ID = new Map<number, SymbolDefinition>(
    SYMBOL_DEFINITIONS.map((symbol) => [symbol.id, symbol])
);
