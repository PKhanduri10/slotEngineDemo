import * as PIXI from 'pixi.js';
import { AssetLoader } from './assets/AssetLoader';
import { ResponsiveGameContainer } from './views/ResponsiveGameContainer';

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

    const gameRoot = new ResponsiveGameContainer();
    app.stage.addChild(gameRoot);

    const resizeGame = () => {
        const width = Math.max(1, container?.clientWidth ?? window.innerWidth);
        const height = Math.max(1, container?.clientHeight ?? window.innerHeight);
        app.renderer.resize(width, height);
        gameRoot.resize(width, height);
    };

    window.addEventListener('resize', resizeGame);
    if (container) {
        new ResizeObserver(resizeGame).observe(container);
    }
    resizeGame();

    console.log('[Engine Bootstrapped]: PixiJS Canvas Attached successfully.');

    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingTrack = document.getElementById('loading-bar-track');
    const loadingMessage = document.getElementById('loading-message');

    const updateProgress = (progress: number) => {
        const percentage = Math.round(Math.max(0, Math.min(progress, 1)) * 100);
        if (loadingBar) loadingBar.style.width = `${percentage}%`;
        if (loadingProgress) loadingProgress.textContent = `${percentage}%`;
        loadingTrack?.setAttribute('aria-valuenow', String(percentage));
    };

    try {
        await AssetLoader.loadIfAvailable((progress) => {
            if (loadingScreen) loadingScreen.style.display = 'flex';
            updateProgress(progress);
        });

        // Symbol definitions capture textures at import time, so import after asset loading.
        const { GameController } = await import('./GameController');
        const controller = new GameController(gameRoot);
        controller.init();

        loadingScreen?.remove();
    } catch (error) {
        console.error('[Game Startup Error]:', error);
        if (loadingMessage) loadingMessage.textContent = 'Unable to load game. Please refresh to try again.';
        if (loadingProgress) loadingProgress.textContent = '';
        if (loadingBar) loadingBar.style.background = '#ff5c5c';
    }
}

bootstrap().catch(console.error);