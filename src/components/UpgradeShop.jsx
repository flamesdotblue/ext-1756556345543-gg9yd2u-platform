import React from 'react';

const ABILITIES = [
  { key: 'addKnight', name: 'Knight Jump', desc: 'Adds knight L-jumps to this piece.', cost: 5 },
  { key: 'addRook', name: 'Ortho Slide', desc: 'Adds rook-like orthogonal sliding.', cost: 6 },
  { key: 'addBishop', name: 'Diagonal Slide', desc: 'Adds bishop-like diagonal sliding.', cost: 6 },
];

export default function UpgradeShop({ preGame, turn, points, setPoints, selectedPiece }) {
  const canEdit = (piece) => {
    if (!piece) return false;
    if (preGame) return true;
    return piece.color === turn; // mid-game only upgrade your pieces during your turn
  };

  const handleBuy = (ability) => {
    if (!selectedPiece) return;
    if (!canEdit(selectedPiece)) return;
    if (selectedPiece.abilities?.[ability.key]) return; // already owned
    const payer = selectedPiece.color;
    if (points[payer] < ability.cost) return;
    // Mutate piece inline by flag; ChessBoard owns the piece objects in state so this will reflect
    selectedPiece.abilities = { ...(selectedPiece.abilities || {}), [ability.key]: true };
    setPoints({ ...points, [payer]: points[payer] - ability.cost });
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{preGame ? 'Pre-game Upgrades' : 'Upgrade Shop'}</h3>
        <div className="text-xs text-neutral-400">Select a piece on the board</div>
      </div>
      <div className="mb-3 text-sm">
        {selectedPiece ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-neutral-300">Selected: {selectedPiece.color === 'w' ? 'White' : 'Black'} {selectedPiece.type.toUpperCase()}</div>
              <div className="text-xs text-neutral-500">Abilities: {Object.keys(selectedPiece.abilities || {}).length ? Object.keys(selectedPiece.abilities).join(', ') : 'None'}</div>
            </div>
            <div className="text-xs px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700">
              {canEdit(selectedPiece) ? 'Upgradeable' : 'Locked'}
            </div>
          </div>
        ) : (
          <div className="text-neutral-500">No piece selected</div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {ABILITIES.map((ab) => {
          const owned = selectedPiece?.abilities?.[ab.key];
          const afford = selectedPiece ? points[selectedPiece.color] >= ab.cost : false;
          const disabled = !selectedPiece || owned || !canEdit(selectedPiece) || (!afford);
          return (
            <div key={ab.key} className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{ab.name}</div>
                  <div className="text-xs text-neutral-400">{ab.desc}</div>
                </div>
                <div className="text-sm">
                  <span className="text-neutral-300">{ab.cost}</span>
                </div>
              </div>
              <button
                onClick={() => handleBuy(ab)}
                disabled={disabled}
                className={`mt-2 w-full text-sm px-3 py-2 rounded-md transition ${disabled ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
              >
                {owned ? 'Owned' : 'Buy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
