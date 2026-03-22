import { useEffect, useState } from "react";
import { MediaContainer } from "./components/media/MediaContainer";
import { Toolbar } from "./components/ui/Toolbar";

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        <p className="animate-pulse">Loading workspace...</p>
      </div>
    );

  return (
    <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col gap-4 z-20 shadow-xl">
        <h1 className="text-xl font-bold text-gray-100">Annotator Pro</h1>
        <div className="flex-1 overflow-y-auto">
          <Toolbar />
        </div>
      </aside>

      <main className="flex-1 relative flex items-center justify-center p-8 bg-gray-950">
        <MediaContainer />
      </main>
    </div>
  );
}

export default App;
