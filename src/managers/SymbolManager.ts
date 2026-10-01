import * as PIXI from 'pixi.js';
import { ObjectPool } from '../core/ObjectPool';

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
                sprite.position.set(0, 0);
            },
            initialPoolSize
        );
    }

    public getSymbol(colorHex: number = 0xff0000): PIXI.Sprite {
        const sprite = this.pool.get();
        sprite.tint = colorHex;
        sprite.visible = true;
        return sprite;
    }

    public recycleSymbol(sprite: PIXI.Sprite): void {
        this.pool.release(sprite);
    }
}