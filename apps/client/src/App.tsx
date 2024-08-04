import Nav from "./components/nav";
import SelectFile from "./components/select-file";
import ServerStatus from "./components/server-status";

function App() {
  return (
    <>
      <Nav />
      <main className="relative flex items-center justify-center h-full mt-12">
        <SelectFile />
      </main>
      <ServerStatus />
    </>
  );
}

export default App;
