import reactLogo from "./assets/react.svg";
import { JsonBlobs } from "./components/jsonblobs";

const TopNav = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between bg-slate-800 px-4">
      <div className="flex items-center">
        <img src={reactLogo} />
        <h1 className="ml-2 text-2xl font-bold">Captain CLI</h1>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="flex h-full w-full flex-col">
      <TopNav />
      <div className="p-4">
        <JsonBlobs />
      </div>
    </div>
  );
}

export default App;
