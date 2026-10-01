# 🎰 High-Performance HTML5 Slot Game Engine
A production-grade, modular HTML5 Slot Game Engine built with **TypeScript**, **PixiJS v8**, and **Vite**. Designed with clean architecture principles (MVVM/MVC) and event-driven patterns to ensure high performance, testability, and zero Garbage Collection (GC) pauses during animation loops.

## 🏛️ Engine Architecture

The architecture decouples the core math/state engine from the rendering layer using an asynchronous EventBus.

``src/
├── assets/                  # Texture manifests and AssetLoader service
│   └── AssetLoader.ts
├── core/                    # Engine core utilities
│   ├── EventBus.ts          # Strongly-typed Event Emitter
│   └── ObjectPool.ts        # Generic High-Performance Object Pool
├── models/                  # Business logic & Data layer
│   └── GameStateModel.ts    # FSM State machine implementation
├── views/                   # PixiJS Rendering components
│   ├── GridView.ts          # 3x5 Grid container manager
│   ├── ReelView.ts          # Individual reel column rendering
│   └── HUDView.ts           # Spin button & UI overlays
├── managers/                # Resource and pooling managers
│   └── SymbolManager.ts     # Sprite allocation & recycling
├── services/                # External APIs
│   └── NetworkService.ts    # Server RNG payload simulation
├── Controller.ts            # Main Mediator binding Model, View & Services
└── main.ts                  # App Entry Point & PixiJS Canvas Bootstrap''

# Prerequisites
Node.js: v18.x or higher

npm: v9.x or higher

# Installation
Clone the repository:

Bash
git clone [https://github.com/YOUR_USERNAME/slot-game-engine.git](https://github.com/YOUR_USERNAME/slot-game-engine.git)
cd slot-game-engine
Install dependencies:

Bash
npm install
Start the Vite local development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.
