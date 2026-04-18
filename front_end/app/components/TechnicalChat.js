import { useState } from "react";
import { sendTechnicalQuery } from "../api/client";

export default function TechnicalChat({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendTechnicalQuery(userMsg, context);
      setMessages((prev) => [...prev, { role: "ai", content: res.answer }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error de conexión." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">
        Chat Residente de Obra
      </h2>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-blue-400" : "text-slate-300"}
          >
            <span className="font-bold">
              {m.role === "user" ? "Tú: " : "Ingeniero: "}
            </span>
            {m.content}
          </div>
        ))}
        {loading && (
          <p className="text-slate-500 italic">Evaluando parámetros...</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-slate-800 text-white rounded px-3 py-2 border border-slate-700 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Consultar sobre factibilidad o riesgos..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold"
        >
          Consultar
        </button>
      </div>
    </div>
  );
}
