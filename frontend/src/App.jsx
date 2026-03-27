import { useState } from "react"
import jayleenImg from "./assets/jayleen.png"

function App() {
  const [messages, setMessages] = useState([
    { role: "jayleen", text: "Hola! I'm Jayleen, your Languiana tutor. What language are you practicing today — Moroccan Darija or Spanish?" }
  ])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState("Moroccan Darija")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: "user", text: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, language })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "jayleen", text: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: "jayleen", text: "Oops, something went wrong. Try again!" }])
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#7F77DD" }}>Languiana</h1>
      <p style={{ textAlign: "center", color: "#888", marginTop: -12 }}>with Jayleen</p>

      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 16, borderRadius: 8, border: "1px solid #ccc" }}
      >
        <option>Moroccan Darija</option>
        <option>Spanish</option>
      </select>

      <div style={{ height: 400, overflowY: "auto", border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end",
            gap: 8,
            marginBottom: 16
          }}>
            {msg.role === "jayleen" && (
              <img src={jayleenImg} alt="Jayleen" style={{
                width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0
              }} />
            )}
            <div style={{
              background: msg.role === "user" ? "#7F77DD" : "#f0f0f0",
              color: msg.role === "user" ? "white" : "#333",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              maxWidth: "75%",
              lineHeight: 1.5
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <img src={jayleenImg} alt="Jayleen" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ background: "#f0f0f0", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", color: "#aaa", fontStyle: "italic" }}>
              Jayleen is typing...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a message or ask Jayleen something..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 20px", background: "#7F77DD", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App