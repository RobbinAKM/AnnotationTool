import { useEffect, useState } from "react";
import { MediaContainer } from "./components/media/MediaContainer";
import { Toolbar } from "./components/ui/Toolbar";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useKeyboardShortcuts();

  useEffect(() => {
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
        <p className="animate-pulse tracking-widest uppercase text-sm font-semibold">
          Initializing Workspace...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans selection:bg-cyan-900">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="w-3 h-3 bg-slate-900 rounded-sm"></div>
            </div>
            {/* BRANDING HEADER */}
            <div className=" p-6 bg-slate-900/50 flex flex-col items-center justify-center gap-2">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5d10d6a6efadae00013bbedb/1581533561827-42Y7IZP7K7E8BPURB0FF/LogoTransparent_webchange_6.png?format=750w"
                alt="Avida Security"
                className="h-[100px] w-[100px]object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">
                Annotation Workspace
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Toolbar />
        </div>
      </aside>

      <main className="flex-1 relative flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-950">
        <MediaContainer />
      </main>
    </div>
  );
}

export default App;
