
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Trophy, RefreshCcw, PartyPopper } from 'lucide-react';

interface Props {
  participants: Participant[];
  onWinnerSelected: (p: Participant) => void;
}

export const LuckyDraw: React.FC<Props> = ({ participants, onWinnerSelected }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('???');
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<Participant[]>([]);
  
  const timerRef = useRef<number | null>(null);

  // Filter available participants based on repeat setting
  const availableParticipants = allowRepeat 
    ? participants 
    : participants.filter(p => !history.some(h => h.id === p.id));

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      alert("No more eligible participants!");
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    let speed = 50;
    let count = 0;
    const maxCount = 40;

    const animate = () => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setCurrentDisplay(availableParticipants[randomIndex].name);
      
      count++;
      if (count < maxCount) {
        timerRef.current = window.setTimeout(animate, speed);
        if (count > 30) speed += 30; // Slow down
      } else {
        const finalWinner = availableParticipants[randomIndex];
        setWinner(finalWinner);
        setHistory(prev => [...prev, finalWinner]);
        onWinnerSelected(finalWinner);
        setIsDrawing(false);
      }
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Settings & Draw Control */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <input
              type="checkbox"
              id="repeat"
              checked={allowRepeat}
              onChange={(e) => setAllowRepeat(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="repeat" className="text-slate-700 font-medium">Allow Repeats</label>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Available: {availableParticipants.length} / {participants.length}
          </div>
          <button
            onClick={startDraw}
            disabled={isDrawing || availableParticipants.length === 0}
            className={`w-full mt-6 py-4 px-6 rounded-2xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              isDrawing || availableParticipants.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-200 hover:shadow-indigo-300'
            }`}
          >
            {isDrawing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
            {isDrawing ? 'Drawing...' : 'Start Draw!'}
          </button>
        </div>

        {/* Display Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-2 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          {winner && !isDrawing && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
               <PartyPopper className="w-64 h-64 text-yellow-400" />
            </div>
          )}
          
          <div className={`text-5xl md:text-7xl font-bold text-center transition-all ${
            isDrawing ? 'scale-110 text-indigo-600 blur-[1px]' : 'text-slate-800'
          }`}>
            {currentDisplay}
          </div>
          
          {winner && !isDrawing && (
            <div className="mt-8 text-indigo-600 font-semibold animate-bounce flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Congratulations to {winner.name}!
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
           <RefreshCcw className="w-5 h-5 text-indigo-500" />
           Draw History
        </h3>
        <div className="flex flex-wrap gap-3">
          {history.length === 0 ? (
            <div className="text-slate-400 text-sm">No winners yet.</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100 flex items-center gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] text-indigo-400">{i+1}</span>
                {h.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
