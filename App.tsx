
import React, { useState } from 'react';
import { Participant, AppTab } from './types';
import { ParticipantManager } from './components/ParticipantManager';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupingTool } from './components/GroupingTool';
import { Users, Trophy, LayoutDashboard, Settings2, Github } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);

  return (
    <div className="min-h-screen bg-[#fdfdff]">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Settings2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                HR Pro Toolkit
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <NavButton 
                active={activeTab === AppTab.INPUT} 
                onClick={() => setActiveTab(AppTab.INPUT)}
                icon={<Users className="w-4 h-4" />}
                label="Manage List"
              />
              <NavButton 
                active={activeTab === AppTab.DRAW} 
                onClick={() => setActiveTab(AppTab.DRAW)}
                icon={<Trophy className="w-4 h-4" />}
                label="Lucky Draw"
                disabled={participants.length === 0}
              />
              <NavButton 
                active={activeTab === AppTab.GROUPING} 
                onClick={() => setActiveTab(AppTab.GROUPING)}
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Grouping"
                disabled={participants.length === 0}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Navigation (Tabs) */}
        <div className="md:hidden grid grid-cols-3 gap-2 mb-8 p-1 bg-slate-100 rounded-2xl">
          <MobileNavButton 
            active={activeTab === AppTab.INPUT} 
            onClick={() => setActiveTab(AppTab.INPUT)}
            icon={<Users className="w-5 h-5" />}
          />
          <MobileNavButton 
            active={activeTab === AppTab.DRAW} 
            onClick={() => setActiveTab(AppTab.DRAW)}
            icon={<Trophy className="w-5 h-5" />}
            disabled={participants.length === 0}
          />
          <MobileNavButton 
            active={activeTab === AppTab.GROUPING} 
            onClick={() => setActiveTab(AppTab.GROUPING)}
            icon={<LayoutDashboard className="w-5 h-5" />}
            disabled={participants.length === 0}
          />
        </div>

        {/* Dynamic Views */}
        <div className="transition-all duration-300">
          {activeTab === AppTab.INPUT && (
            <section>
               <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Manage Participant List</h1>
                <p className="text-slate-500 mt-2">Add names manually or upload a CSV file to get started.</p>
              </header>
              <ParticipantManager participants={participants} setParticipants={setParticipants} />
            </section>
          )}

          {activeTab === AppTab.DRAW && (
            <section>
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Prize Lucky Draw</h1>
                <p className="text-slate-500 mt-2">Fairly select winners with real-time animations.</p>
              </header>
              <LuckyDraw 
                participants={participants} 
                onWinnerSelected={(p) => console.log('Winner:', p.name)} 
              />
            </section>
          )}

          {activeTab === AppTab.GROUPING && (
            <section>
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Team Grouping</h1>
                <p className="text-slate-500 mt-2">Automatically distribute participants into balanced teams.</p>
              </header>
              <GroupingTool participants={participants} />
            </section>
          )}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
             Built for HR Professionals <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 
             Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
};

// UI Helper Components
const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, disabled?: boolean }> = ({ active, onClick, icon, label, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, disabled?: boolean }> = ({ active, onClick, icon, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center p-3 rounded-xl transition-all ${
      active ? 'bg-white text-indigo-600 shadow-md shadow-slate-200' : 'text-slate-400'
    } ${disabled ? 'opacity-30' : ''}`}
  >
    {icon}
  </button>
);

export default App;
