import * as PIXI from 'pixi.js';
import { GameController } from './GameController';

async function bootstrap() {
    const app = new PIXI.Application();

    await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x1a1a2e,
    });

    const container = document.getElementById('game-container');
    if (container) {
        container.appendChild(app.canvas);
    } else {
        document.body.appendChild(app.canvas);
    }

    console.log('[Engine Bootstrapped]: PixiJS Canvas Attached successfully.');

    const controller = new GameController(app.stage);
    controller.init();
}

bootstrap().catch(console.error);