import { EventBus } from '../core/EventBus';

export enum GameState {
    BOOT = 'BOOT',
    IDLE = 'IDLE',
    SPINNING = 'SPINNING',
    EVALUATING = 'EVALUATING',
    WIN_CELEBRATION = 'WIN_CELEBRATION'
}

export class GameStateModel {
    private _currentState: GameState = GameState.BOOT;
    private eventBus = EventBus.getInstance();

    public get currentState(): GameState {
        return this._currentState;
    }

    public transitionTo(newState: GameState): boolean {
        console.log(`[State Transition]: ${this._currentState} ➔ ${newState}`);
        this._currentState = newState;
        this.eventBus.emit('STATE_CHANGED', this._currentState);
        return true;
    }

    public canSpin(): boolean {
        return this._currentState === GameState.IDLE;
    }
}