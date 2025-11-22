import Hero from './components/Hero';
import Chat from './components/Chat';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.08),transparent_40%)]" />
      <div className="relative">
        <Hero />
        <Chat />
        <Footer />
      </div>
    </div>
  );
}

export default App;
