import Hero from "./components/Hero";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Hero />

      <section className="z-0 h-screen bg-blue-500"></section>
    </main>
  );
};

export default App;
