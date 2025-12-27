
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { Upload, Users, ListPlus, Trash2, UserCheck, AlertCircle, Wand2 } from 'lucide-react';

interface Props {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
}

const MOCK_NAMES = [
  "王小明", "李美玲", "張大華", "林志強", "陳雅婷", 
  "黃裕翔", "周杰倫", "蔡依林", "郭台銘", "張忠謀",
  "劉德華", "張學友", "金城武", "林青霞", "王菲",
  "周星馳", "梁朝偉", "舒淇", "彭于晏", "桂綸鎂"
];

export const ParticipantManager: React.FC<Props> = ({ participants, setParticipants }) => {
  const [textInput, setTextInput] = useState('');

  // 偵測哪些名字是重複的
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0);
      const newParticipants: Participant[] = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      setParticipants([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
  };

  const handleManualAdd = () => {
    const names = textInput.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0);
    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    setParticipants([...participants, ...newParticipants]);
    setTextInput('');
  };

  const handleLoadMockData = () => {
    const mockParticipants: Participant[] = MOCK_NAMES.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    setParticipants(mockParticipants);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    setParticipants(uniqueList);
  };

  const clearList = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-indigo-500" />
              新增姓名
            </h3>
            <button
              onClick={handleLoadMockData}
              className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              生成模擬名單
            </button>
          </div>
          <textarea
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="請輸入姓名（一行一個）..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleManualAdd}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-200"
            >
              加入名單
            </button>
            <label className="flex-1 border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-600 font-medium py-2 px-4 rounded-xl text-center transition-colors">
              <Upload className="w-4 h-4 inline mr-2" />
              匯入 CSV
              <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* List View Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              目前名單 ({participants.length})
            </h3>
            <div className="flex gap-2">
              {duplicateNames.size > 0 && (
                <button
                  onClick={removeDuplicates}
                  className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  title="移除所有重複的姓名"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  移除重複
                </button>
              )}
              {participants.length > 0 && (
                <button
                  onClick={clearList}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="清空全部"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[300px] border border-slate-100 rounded-xl p-2 bg-slate-50">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <Users className="w-8 h-8 opacity-20" />
                尚未加入任何姓名
              </div>
            ) : (
              <ul className="space-y-1">
                {participants.map((p, idx) => {
                  const isDuplicate = duplicateNames.has(p.name);
                  return (
                    <li key={p.id} className={`bg-white px-3 py-2 rounded-lg text-sm border flex justify-between items-center group transition-all ${isDuplicate ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
                      <span className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-xs w-6">{idx + 1}.</span>
                        <span className={isDuplicate ? 'font-medium text-amber-900' : 'text-slate-700'}>{p.name}</span>
                        {isDuplicate && (
                          <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                            <AlertCircle className="w-2.5 h-2.5" />
                            重複
                          </span>
                        )}
                      </span>
                      <button 
                        onClick={() => setParticipants(participants.filter(item => item.id !== p.id))}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
