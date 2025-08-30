import React, { useState } from 'react';
import Hero from './components/Hero';
import ChessBoard from './components/ChessBoard';
import HUD from './components/HUD';
import UpgradeShop from './components/UpgradeShop';

export default function App() {
  const [preGame, setPreGame] = useState(true);
  const [points, setPoints] = useState({ w: 10, b: 10 });
  const [winner, setWinner] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('w');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStartGame = () => {
    setPreGame(false);
  };

  const handleNewGame = () => {
    setPreGame(true);
    setPoints({ w: 10, b: 10 });
    setWinner(null);
    setSelectedPiece(null);
    setTurn('w');
    setRefreshKey((k) => k + 1); // re-mount ChessBoard to reset its state
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Hero />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 grow">
        <div className="lg:col-span-8">
          <ChessBoard
            key={refreshKey}
            preGame={preGame}
            turn={turn}
            setTurn={setTurn}
            points={points}
            setPoints={setPoints}
            setWinner={setWinner}
            selectedPiece={selectedPiece}
            setSelectedPiece={setSelectedPiece}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <HUD
            preGame={preGame}
            onStartGame={handleStartGame}
            onNewGame={handleNewGame}
            points={points}
            turn={turn}
            winner={winner}
          />
          <UpgradeShop
            preGame={preGame}
            turn={turn}
            points={points}
            setPoints={setPoints}
            selectedPiece={selectedPiece}
          />
        </div>
      </div>
      <footer className="text-center text-sm text-neutral-400 py-6">
        Build custom chess pieces with special movement. Capture to earn points. Upgrade pre-game or mid-game.
      </footer>
    </div>
  );
}
