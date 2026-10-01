import * as PIXI from 'pixi.js';

export class AssetLoader {
    public static async init(manifestPath: string, onProgress?: (progress: number) => void): Promise<void> {
        await PIXI.Assets.init({ manifest: manifestPath });
        await PIXI.Assets.loadBundle('game-assets', onProgress);
    }

    public static getTexture(alias: string): PIXI.Texture {
        return PIXI.Assets.get(alias);
    }
}