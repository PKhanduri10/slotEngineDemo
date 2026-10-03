import * as PIXI from 'pixi.js';
import { GridView } from '../views/GridView';
import { ReelView } from '../views/ReelView';

export class ReelAnimationManager {
    private static readonly MAX_SPIN_SPEED = 25;

    private gridView: GridView;

    constructor(gridView: GridView) {
        this.gridView = gridView;
    }

    public async spinReels(targetMatrix: number[][]): Promise<void> {
        const spinPromises = this.gridView.reels.map((reel, index) => {
            return this.spinSingleReel(reel, index, targetMatrix.map((row) => row[index]));
        });

        await Promise.all(spinPromises);
    }
  

    private spinSingleReel(reel: ReelView, reelIndex: number, finalColumnValues: number[]): Promise<void> {
        return new Promise((resolve) => {
            const spinState = {
                elapsed: 0,
                speed: 0,
                
            };

            const staggerDelay = reelIndex * 0.2;
            const accelerateDuration = 0.3;
            const coastDuration = 1.5 + staggerDelay;
            const stopQueueStart = accelerateDuration + coastDuration;
            let stopQueueStarted = false;
            let decelerationStarted = false;
            let decelerationElapsed = 0;
            let decelerationDuration = 0;
            let remainingStopDistance = 0;

            const tick = (ticker: PIXI.Ticker) => {
                spinState.elapsed += ticker.deltaMS / 1000;

                if (spinState.elapsed <= accelerateDuration) {
                    const t = spinState.elapsed / accelerateDuration;
                    spinState.speed = ReelAnimationManager.MAX_SPIN_SPEED * t;
                } else {
                    spinState.speed = ReelAnimationManager.MAX_SPIN_SPEED;
                }

                if (!stopQueueStarted && spinState.elapsed >= stopQueueStart) {
                    reel.prepareStopSymbols(finalColumnValues);
                    stopQueueStarted = true;
                }

                let scrollStep = (spinState.speed * ticker.deltaMS) / 16.67;
                if (decelerationStarted) {
                    const previousProgress = decelerationElapsed / decelerationDuration;
                    decelerationElapsed += ticker.deltaMS / 1000;
                    const progress = Math.min(decelerationElapsed / decelerationDuration, 1);
                    const averageSpeed = ReelAnimationManager.MAX_SPIN_SPEED *
                        (1 - (Math.min(previousProgress, 1) + progress) / 2);
                    spinState.speed = ReelAnimationManager.MAX_SPIN_SPEED * (1 - progress);
                    scrollStep = progress >= 1
                        ? remainingStopDistance
                        : Math.min((averageSpeed * ticker.deltaMS) / 16.67, remainingStopDistance);
                }

                const stopSequenceReady = reel.scrollSymbols(scrollStep);
                if (decelerationStarted) {
                    remainingStopDistance -= scrollStep;
                    if (decelerationElapsed >= decelerationDuration || remainingStopDistance <= 0.001) {
                        reel.clearStopSymbols();
                        reel.blurFilter.strengthY = 0;
                        PIXI.Ticker.shared.remove(tick);
                        resolve();
                        return;
                    }
                } else if (stopSequenceReady) {
                    remainingStopDistance = reel.getDistanceToNextRowBoundary();
                    decelerationDuration = remainingStopDistance /
                        (ReelAnimationManager.MAX_SPIN_SPEED * 30);
                    decelerationStarted = true;
                }

                reel.blurFilter.strengthY = spinState.speed * 0.2;
            };

            PIXI.Ticker.shared.add(tick);
        });
    }
}