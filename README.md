# 🎰 High-Performance HTML5 Slot Game Engine
A production-grade, modular HTML5 Slot Game Engine built with **TypeScript**, **PixiJS v8**, and **Vite**. Designed with clean architecture principles (MVVM/MVC) and event-driven patterns to ensure high performance, testability, and zero Garbage Collection (GC) pauses during animation loops.

## 🏛️ Engine Architecture

The architecture decouples the core math/state engine from the rendering layer using an asynchronous EventBus.

```text
                       ┌─────────────────────────┐
                       │     GAME CONTROLLER     │
                       │   (Mediator / Engine)   │
                       └────────────┬────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
  ┌────────▼────────┐      ┌────────▼────────┐      ┌────────▼────────┐
  │   MODEL LAYER   │      │   VIEW LAYER    │      │    MANAGERS     │
  │                 │      │                 │      │                 │
  │ • GameState FSM │      │ • PixiJS Stage  │      │ • SymbolManager │
  │ • Paytable/Math │      │ • Grid & Reels  │      │ • AssetLoader   │
  │ • Wallet Model  │      │ • HUD Controls  │      │ • Audio/Effects │
  └─────────────────┘      └─────────────────┘      └─────────────────┘
  ``
# Prerequisites
Node.js: v18.x or higher

npm: v9.x or higher

# Installation
Clone the repository:

Bash
git clone https://github.com/PKhanduri10/slotEngineDemo.git
cd slotEngineDemo
Install dependencies:

Bash
npm install
Start the Vite local development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.
