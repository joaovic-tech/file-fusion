import Nav from "./components/nav";
import SelectFile from "./components/select-file";

function App() {
  return (
    <>
      <Nav />
      <main className="mx-24 mt-12">
        <SelectFile />
      </main>
    </>
  );
}

export default App;
