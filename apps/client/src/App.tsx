import Nav from "./components/nav";
import SelectFile from "./components/select-file";

function App() {
  return (
    <>
      <Nav />
      <main className="flex items-center justify-center h-full mt-12">
        <SelectFile />
      </main>
    </>
  );
}

export default App;
