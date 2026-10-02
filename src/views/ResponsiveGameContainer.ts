import * as PIXI from 'pixi.js';

export class ResponsiveGameContainer extends PIXI.Container {
    constructor(
        public readonly designWidth: number = 1280,
        public readonly designHeight: number = 720
    ) {
        super();
    }

    public resize(viewportWidth: number, viewportHeight: number): void {
        const scale = Math.min(
            viewportWidth / this.designWidth,
            viewportHeight / this.designHeight
        );

        this.scale.set(scale);
        this.position.set(
            (viewportWidth - this.designWidth * scale) / 2,
            (viewportHeight - this.designHeight * scale) / 2
        );
    }
}
