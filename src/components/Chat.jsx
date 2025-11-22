import { useEffect, useRef, useState } from 'react';
import { Send, Mic, Image as ImageIcon, Volume2, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function Chat() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! I am DOLPHIN AI. Ask me anything or try generating an image.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Try to pick a female-sounding English voice
    const preferred = voices.find(v => /female|women|samantha|victoria|google uk english female|zira/i.test(v.name + ' ' + v.voiceURI))
      || voices.find(v => /en/i.test(v.lang));
    if (preferred) utter.voice = preferred;
    utter.pitch = 1.05;
    utter.rate = 1.0;
    utter.volume = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;
    setInput('');
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: next.slice(-8) }),
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not respond.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'There was an error reaching the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const genImage = async () => {
    const prompt = input.trim() || 'a photorealistic dolphin jumping through neon waves, futuristic, 4k';
    setImgLoading(true);
    setImageUrl('');
    try {
      const res = await fetch(`${API_BASE}/api/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImageUrl(data.image_url);
      setMessages(m => [...m, { role: 'assistant', content: `I created an image for: ${prompt}` }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Image generation failed.' }]);
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <section id="studio" className="relative z-10 max-w-6xl mx-auto px-6 py-12">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐬</span>
            <div>
              <p className="text-white font-semibold leading-5">DOLPHIN AI Studio</p>
              <p className="text-white/60 text-xs">Chat • Images • Voice</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Volume2 className="w-4 h-4" />
            <span>Voice Enabled</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-6 h-[420px] overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${m.role === 'user' ? 'bg-white text-slate-900' : 'bg-white/10 text-white border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="space-y-3">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything... or type an image idea"
                  className="flex-1 resize-none rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button onClick={sendMessage} className="h-12 self-end px-4 rounded-xl bg-white text-slate-900 font-semibold shadow hover:shadow-lg disabled:opacity-50" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={genImage} className="px-4 py-2 rounded-xl bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600">
                  {imgLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  Generate Image
                </button>
                <button onClick={() => speak(messages.filter(m=>m.role==='assistant').slice(-1)[0]?.content || 'Hello!')} className="px-4 py-2 rounded-xl bg-purple-500 text-white flex items-center gap-2 hover:bg-purple-600">
                  <Mic className="w-4 h-4" />
                  Voice Reply
                </button>
              </div>
            </div>

            {imageUrl && (
              <div className="mt-6">
                <img src={imageUrl} alt="AI generated" className="rounded-xl border border-white/10 shadow" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
