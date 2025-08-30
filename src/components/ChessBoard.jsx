import React, { useEffect, useMemo, useState } from 'react';

const FILES = ['a','b','c','d','e','f','g','h'];

const PIECE_POINTS = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 20 };

function deepCloneBoard(board) {
  return board.map((row) => row.map((p) => p ? { ...p, abilities: { ...(p.abilities || {}) } } : null));
}

function initialBoard() {
  const b = Array.from({ length: 8 }, () => Array(8).fill(null));
  // Place pawns
  for (let f = 0; f < 8; f++) {
    b[6][f] = { id: `w-p-${f}`, color: 'w', type: 'pawn', abilities: {}, hasMoved: false };
    b[1][f] = { id: `b-p-${f}`, color: 'b', type: 'pawn', abilities: {}, hasMoved: false };
  }
  // Rooks
  b[7][0] = { id: 'w-r-a1', color: 'w', type: 'rook', abilities: {}, hasMoved: false };
  b[7][7] = { id: 'w-r-h1', color: 'w', type: 'rook', abilities: {}, hasMoved: false };
  b[0][0] = { id: 'b-r-a8', color: 'b', type: 'rook', abilities: {}, hasMoved: false };
  b[0][7] = { id: 'b-r-h8', color: 'b', type: 'rook', abilities: {}, hasMoved: false };
  // Knights
  b[7][1] = { id: 'w-n-b1', color: 'w', type: 'knight', abilities: {}, hasMoved: false };
  b[7][6] = { id: 'w-n-g1', color: 'w', type: 'knight', abilities: {}, hasMoved: false };
  b[0][1] = { id: 'b-n-b8', color: 'b', type: 'knight', abilities: {}, hasMoved: false };
  b[0][6] = { id: 'b-n-g8', color: 'b', type: 'knight', abilities: {}, hasMoved: false };
  // Bishops
  b[7][2] = { id: 'w-b-c1', color: 'w', type: 'bishop', abilities: {}, hasMoved: false };
  b[7][5] = { id: 'w-b-f1', color: 'w', type: 'bishop', abilities: {}, hasMoved: false };
  b[0][2] = { id: 'b-b-c8', color: 'b', type: 'bishop', abilities: {}, hasMoved: false };
  b[0][5] = { id: 'b-b-f8', color: 'b', type: 'bishop', abilities: {}, hasMoved: false };
  // Queens
  b[7][3] = { id: 'w-q-d1', color: 'w', type: 'queen', abilities: {}, hasMoved: false };
  b[0][3] = { id: 'b-q-d8', color: 'b', type: 'queen', abilities: {}, hasMoved: false };
  // Kings
  b[7][4] = { id: 'w-k-e1', color: 'w', type: 'king', abilities: {}, hasMoved: false };
  b[0][4] = { id: 'b-k-e8', color: 'b', type: 'king', abilities: {}, hasMoved: false };
  return b;
}

function inBounds(r, c) { return r >= 0 && c >= 0 && r < 8 && c < 8; }

function getMoves(board, r, c) {
  const p = board[r][c];
  if (!p) return [];
  const color = p.color;
  const enemy = color === 'w' ? 'b' : 'w';
  const result = [];

  const add = (rr, cc) => { if (inBounds(rr, cc)) result.push([rr, cc]); };
  const addSlide = (dr, dc) => {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const occ = board[rr][cc];
      if (!occ) {
        result.push([rr, cc]);
      } else {
        if (occ.color !== color) result.push([rr, cc]);
        break;
      }
      rr += dr; cc += dc;
    }
  };

  // Base moves
  switch (p.type) {
    case 'pawn': {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // forward 1
      if (inBounds(r + dir, c) && !board[r + dir][c]) add(r + dir, c);
      // forward 2 from start if clear
      if (r === startRow && !board[r + dir][c] && inBounds(r + 2*dir, c) && !board[r + 2*dir][c]) add(r + 2*dir, c);
      // captures
      for (const dc of [-1, 1]) {
        const rr = r + dir, cc = c + dc;
        if (inBounds(rr, cc) && board[rr][cc] && board[rr][cc].color === enemy) add(rr, cc);
      }
      break;
    }
    case 'knight': {
      const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of deltas) {
        const rr = r + dr, cc = c + dc;
        if (!inBounds(rr, cc)) continue;
        const occ = board[rr][cc];
        if (!occ || occ.color !== color) add(rr, cc);
      }
      break;
    }
    case 'bishop': {
      addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1);
      break;
    }
    case 'rook': {
      addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1);
      break;
    }
    case 'queen': {
      addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1);
      addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1);
      break;
    }
    case 'king': {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const rr = r + dr, cc = c + dc;
          if (!inBounds(rr, cc)) continue;
          const occ = board[rr][cc];
          if (!occ || occ.color !== color) add(rr, cc);
        }
      }
      break;
    }
    default: break;
  }

  // Abilities: add movement on top of base
  if (p.abilities?.addKnight) {
    const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of deltas) {
      const rr = r + dr, cc = c + dc;
      if (!inBounds(rr, cc)) continue;
      const occ = board[rr][cc];
      if (!occ || occ.color !== color) result.push([rr, cc]);
    }
  }
  if (p.abilities?.addRook) {
    addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1);
  }
  if (p.abilities?.addBishop) {
    addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1);
  }

  // De-duplicate moves
  const key = (m) => `${m[0]}-${m[1]}`;
  const uniq = new Map();
  for (const m of result) uniq.set(key(m), m);
  return Array.from(uniq.values());
}

export default function ChessBoard({ preGame, turn, setTurn, points, setPoints, setWinner, selectedPiece, setSelectedPiece }) {
  const [board, setBoard] = useState(initialBoard);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    // Clear selection if preGame toggles on/off
    setMoves([]);
    setSelectedPiece(null);
  }, [preGame]);

  const handleSelect = (r, c) => {
    const p = board[r][c];
    if (!p) {
      setSelectedPiece(null);
      setMoves([]);
      return;
    }
    setSelectedPiece(p);
    setMoves(getMoves(board, r, c).map(([rr, cc]) => ({ r: rr, c: cc })));
  };

  const tryMove = (fromR, fromC, toR, toC) => {
    const p = board[fromR][fromC];
    if (!p) return;
    if (!preGame && p.color !== turn) return;

    const legal = getMoves(board, fromR, fromC).some(([rr, cc]) => rr === toR && cc === toC);
    if (!legal) return;

    const next = deepCloneBoard(board);
    const target = next[toR][toC];

    // Capture points
    if (target && target.color !== p.color) {
      const gain = PIECE_POINTS[target.type] || 0;
      const newPts = { ...points };
      newPts[p.color] += gain;
      setPoints(newPts);
    }

    // Move
    next[toR][toC] = { ...p, hasMoved: true };
    next[fromR][fromC] = null;

    setBoard(next);
    setSelectedPiece(next[toR][toC]);
    setMoves(getMoves(next, toR, toC).map(([rr, cc]) => ({ r: rr, c: cc })));

    // Win if king captured
    if (target?.type === 'king') {
      setWinner(p.color);
      const newPts = { ...points };
      newPts[p.color] += 15; // win bonus
      setPoints(newPts);
      return; // stop switching turns
    }

    if (!preGame) setTurn(turn === 'w' ? 'b' : 'w');
  };

  const handleSquareClick = (r, c) => {
    if (selectedPiece) {
      // If clicking on a move square, execute move; else reselect
      const selLoc = findPiece(board, selectedPiece.id);
      if (selLoc) {
        const isMove = moves.some((m) => m.r === r && m.c === c);
        if (isMove) {
          tryMove(selLoc.r, selLoc.c, r, c);
          return;
        }
      }
    }
    // Otherwise select
    handleSelect(r, c);
  };

  const findPiece = (b, id) => {
    for (let rr = 0; rr < 8; rr++) {
      for (let cc = 0; cc < 8; cc++) {
        if (b[rr][cc]?.id === id) return { r: rr, c: cc };
      }
    }
    return null;
  };

  const isMoveSquare = (r, c) => moves.some((m) => m.r === r && m.c === c);

  const headers = useMemo(() => FILES.map((f, i) => (
    <div key={f} className="text-xs text-neutral-500 text-center">{f}</div>
  )), []);

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{preGame ? 'Board (Pre-game: apply upgrades before starting)' : 'Board'}</h3>
        <div className="text-xs text-neutral-400">Click a piece to see its moves. Click a highlighted square to move.</div>
      </div>
      <div className="grid grid-cols-8 gap-1 select-none">
        {board.map((row, r) => (
          <React.Fragment key={r}>
            {row.map((cell, c) => {
              const dark = (r + c) % 2 === 1;
              const isMove = isMoveSquare(r, c);
              const sel = selectedPiece && board[r][c]?.id === selectedPiece.id;
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`relative aspect-square rounded-md cursor-pointer flex items-center justify-center ${dark ? 'bg-neutral-800' : 'bg-neutral-700'} ${isMove ? 'ring-2 ring-emerald-500' : ''} ${sel ? 'outline outline-2 outline-indigo-400' : ''}`}
                >
                  {cell ? (
                    <PieceIcon piece={cell} />
                  ) : null}
                  <div className="absolute bottom-1 left-1 text-[10px] text-neutral-500">{8 - r}{FILES[c]}</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PieceIcon({ piece }) {
  const colorCls = piece.color === 'w' ? 'text-white' : 'text-rose-300';
  const base = piece.type;
  const label = base.charAt(0).toUpperCase();
  const extras = [];
  if (piece.abilities?.addKnight) extras.push('N');
  if (piece.abilities?.addRook) extras.push('R');
  if (piece.abilities?.addBishop) extras.push('B');

  return (
    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-neutral-950/60 border border-neutral-700 ${colorCls} grid place-items-center font-bold shadow-xl`}>
      <span>{symbolForPiece(base, piece.color)}</span>
      {extras.length ? (
        <div className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5 rounded bg-emerald-600 text-white border border-emerald-400">{extras.join('')}</div>
      ) : null}
    </div>
  );
}

function symbolForPiece(type, color) {
  // Simple letters to avoid external assets; differentiate color via tint
  switch (type) {
    case 'king': return 'K';
    case 'queen': return 'Q';
    case 'rook': return 'R';
    case 'bishop': return 'B';
    case 'knight': return 'N';
    case 'pawn': return 'P';
    default: return '?';
  }
}
