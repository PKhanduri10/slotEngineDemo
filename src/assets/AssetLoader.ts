import * as PIXI from 'pixi.js';
import { GAME_ASSET_MANIFEST } from './AssetManifest';

type SpriteSheetFrame = {
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
};

export class AssetLoader {
    private static readonly TEXTURES = new Map<string, PIXI.Texture>();

    private static getTextureKey(alias: string, frameName: string): string {
        return `${alias}:${frameName}`;
    }

    public static async loadIfAvailable(onProgress?: (progress: number) => void): Promise<boolean> {
        onProgress?.(0);

        try {
            const uniqueAssets = GAME_ASSET_MANIFEST;
            AssetLoader.TEXTURES.clear();

            for (let i = 0; i < uniqueAssets.length; i += 1) {
                const asset = uniqueAssets[i];
                const atlasResponse = await fetch(asset.atlasPath);
                if (!atlasResponse.ok) {
                    throw new Error(`Atlas not found: ${asset.atlasPath}`);
                }

                const atlas = (await atlasResponse.json()) as {
                    frames?: Record<string, SpriteSheetFrame>;
                };

                const sheetTexture = await PIXI.Assets.load(asset.spritePath);
                for (const [frameName, frameData] of Object.entries(atlas.frames ?? {})) {
                    const sourceFrame = frameData.frame;
                    const texture = new PIXI.Texture({
                        source: sheetTexture.source,
                        frame: new PIXI.Rectangle(sourceFrame.x, sourceFrame.y, sourceFrame.w, sourceFrame.h),
                        orig: new PIXI.Rectangle(sourceFrame.x, sourceFrame.y, sourceFrame.w, sourceFrame.h),
                        label: `${asset.alias}:${frameName}`,
                    });

                    AssetLoader.TEXTURES.set(AssetLoader.getTextureKey(asset.alias, frameName), texture);
                }

                onProgress?.((i + 1) / uniqueAssets.length);
            }

            onProgress?.(1);
            return AssetLoader.TEXTURES.size > 0;
        } catch (error) {
            console.warn('[AssetLoader] Sprite atlas not found; using fallback textures.', error);
            onProgress?.(1);
            return false;
        }
    }

    public static async init(manifestPath: string, onProgress?: (progress: number) => void): Promise<void> {
        const loaded = await AssetLoader.loadIfAvailable(onProgress);

        if (!loaded) {
            try {
                await PIXI.Assets.init({ manifest: manifestPath });
                await PIXI.Assets.loadBundle('game-assets', onProgress);
            } catch (error) {
                console.warn('[AssetLoader] One or more game assets could not be loaded; using fallbacks.', error);
            }
        }
    }

    public static getTexture(alias: string, frameName: string): PIXI.Texture {
        const loadedTexture = AssetLoader.TEXTURES.get(AssetLoader.getTextureKey(alias, frameName));
        if (loadedTexture) {
            return loadedTexture;
        }

        return PIXI.Texture.WHITE;
    }
}