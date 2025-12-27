
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { Users2, Shuffle, Sparkles, LayoutGrid, Download } from 'lucide-react';
import { generateTeamNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

export const GroupingTool: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNamingWithAI, setIsNamingWithAI] = useState(false);

  const shuffleArray = <T extends any>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  };

  const handleGroup = () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    setTimeout(() => {
      const shuffled: Participant[] = shuffleArray<Participant>(participants);
      const newGroups: Group[] = [];
      const numGroups = Math.ceil(shuffled.length / groupSize);

      for (let i = 0; i < numGroups; i++) {
        newGroups.push({
          id: Math.random().toString(36).substr(2, 9),
          name: `第 ${i + 1} 組`,
          members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
        });
      }

      setGroups(newGroups);
      setIsGenerating(false);
    }, 800);
  };

  const handleAINaming = async () => {
    if (groups.length === 0) return;
    setIsNamingWithAI(true);
    const names = await generateTeamNames(groups.length, "fun and energetic");
    setGroups(prev => prev.map((g, i) => ({ ...g, name: names[i] || g.name })));
    setIsNamingWithAI(false);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // 建立 CSV 內容，包含 BOM 以支援 Excel 開啟中文不亂碼
    const headers = ["組別", "成員姓名"];
    const rows = groups.flatMap(group => 
      group.members.map(member => [group.name, member.name])
    );
    
    const csvContent = "\uFEFF" + [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Control Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600 block">每組人數</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-40 md:w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="font-bold text-indigo-600 w-8">{groupSize}</span>
            </div>
          </div>
          
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">預計組數</div>
            <div className="text-xl font-bold text-slate-800">
              {Math.ceil(participants.length / groupSize)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGroup}
            disabled={isGenerating || participants.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            {isGenerating ? <Shuffle className="w-5 h-5 animate-spin" /> : <Users2 className="w-5 h-5" />}
            開始分組
          </button>
          
          {groups.length > 0 && (
            <>
              <button
                onClick={handleAINaming}
                disabled={isNamingWithAI}
                className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl transition-all flex items-center gap-2"
              >
                <Sparkles className={`w-5 h-5 ${isNamingWithAI ? 'animate-pulse' : ''}`} />
                AI 創意命名
              </button>
              <button
                onClick={downloadCSV}
                className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 font-bold py-3 px-6 rounded-2xl transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                下載 CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
             <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
             <p className="text-lg">點擊「開始分組」來分配 {participants.length} 位成員。</p>
          </div>
        ) : (
          groups.map((group, idx) => (
            <div 
              key={group.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center">{idx + 1}</span>
                  {group.name}
                </h4>
                <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-lg shadow-sm">
                  {group.members.length} 人
                </span>
              </div>
              <ul className="p-4 space-y-2 flex-1">
                {group.members.map((m, i) => (
                  <li key={m.id} className="text-slate-600 text-sm flex items-center gap-3 py-1 px-2 rounded hover:bg-slate-50 transition-colors">
                     <span className="text-slate-300 font-mono text-xs">{i + 1}</span>
                     {m.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
