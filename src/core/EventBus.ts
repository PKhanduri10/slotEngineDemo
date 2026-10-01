import { EventEmitter } from 'eventemitter3';

export enum GameEvents {
    STATE_CHANGED = 'STATE_CHANGED',
    USER_CLICK_SPIN = 'USER_CLICK_SPIN',
    GRID_UPDATED = 'GRID_UPDATED'
}

export class EventBus extends EventEmitter {
    private static instance: EventBus;

    private constructor() {
        super();
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
}