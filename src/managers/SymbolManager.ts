import * as PIXI from 'pixi.js';
import { ObjectPool } from '../core/ObjectPool';
import { SYMBOL_BY_ID } from '../config/SymbolConfig';

export class SymbolManager {
    private pool: ObjectPool<PIXI.Sprite>;
    private activeSprites: Set<PIXI.Sprite> = new Set();

    constructor(initialPoolSize: number = 30) {
        this.pool = new ObjectPool<PIXI.Sprite>(
            () => {
                const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
                sprite.width = 110;
                sprite.height = 110;
                return sprite;
            },
            (sprite) => {
                sprite.visible = false;
                sprite.texture = PIXI.Texture.WHITE;
                sprite.tint = 0xffffff;
                sprite.position.set(0, 0);
            },
            initialPoolSize
        );
    }

    public getSymbol(symbolId: number = 0): PIXI.Sprite {
        const sprite = this.pool.get();
        this.applySymbol(sprite, symbolId);
        this.activeSprites.add(sprite);
        return sprite;
    }

    public applySymbol(sprite: PIXI.Sprite, symbolId: number): void {
        const definition = SYMBOL_BY_ID.get(symbolId) ?? SYMBOL_BY_ID.get(0)!;
        const isFallbackTexture = definition.texture === PIXI.Texture.WHITE;

        sprite.texture = definition.texture;
        sprite.tint = isFallbackTexture ? definition.fallbackColor : 0xffffff;
        sprite.visible = true;
        (sprite as PIXI.Sprite & { symbolId?: number }).symbolId = symbolId;
    }

    public recycleSymbol(sprite: PIXI.Sprite): void {
        this.activeSprites.delete(sprite);
        this.pool.release(sprite);
    }
}