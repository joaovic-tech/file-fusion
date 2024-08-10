import Nav from "./components/nav";
import SelectFile from "./components/SelectFile";

function App() {
  return (
    <>
      <Nav />
      <main className="relative flex items-center justify-center h-full mt-12">
        <SelectFile />
      </main>
    </>
  );
}

export default App;
