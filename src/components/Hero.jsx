import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/UGnf9D1Hp3OG8vSG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end px-4 sm:px-6 lg:px-8 pb-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Custom Chess Lab</h1>
          <p className="mt-2 text-neutral-300 max-w-2xl">
            Design your own pieces with special movement abilities. Earn points by capturing and winning, then upgrade mid-game or pre-game.
          </p>
        </div>
      </div>
    </section>
  );
}
