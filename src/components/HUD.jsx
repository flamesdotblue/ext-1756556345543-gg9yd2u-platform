import React from 'react';

export default function HUD({ preGame, onStartGame, onNewGame, points, turn, winner }) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-400">White Points</div>
          <div className="text-xl font-semibold">{points.w}</div>
        </div>
        <div className="text-neutral-600">|</div>
        <div>
          <div className="text-sm text-neutral-400">Black Points</div>
          <div className="text-xl font-semibold">{points.b}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          {winner ? (
            <div className="text-green-400 font-semibold">{winner === 'w' ? 'White' : 'Black'} wins! +15 points</div>
          ) : (
            <div className="text-neutral-300">Turn: <span className={turn === 'w' ? 'text-indigo-400' : 'text-rose-400'}>{turn === 'w' ? 'White' : 'Black'}</span></div>
          )}
        </div>
        <div className="flex gap-2">
          {preGame ? (
            <button
              onClick={onStartGame}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition text-sm"
            >
              Start Game
            </button>
          ) : null}
          <button
            onClick={onNewGame}
            className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 transition text-sm"
          >
            New Game
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral-400 leading-relaxed">
        Capture pieces to earn points (P:1, N/B:3, R:5, Q:9, K:20). Win the game by capturing the king for +15.
        Spend points to add movement abilities to your pieces. Upgrades are allowed during pre-game, and on your turn mid-game.
      </p>
    </div>
  );
}
