// pages/index.jsx
import { useState } from "react";
import { generateOutline, generateSection } from "../utils/api";

export default function HomePage() {
  const [seed, setSeed] = useState("");
  const [outline, setOutline] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerateOutline() {
    setLoading(true);
    const out = await generateOutline(seed);
    setOutline(out);
    setSections([]); // Reset sections when new outline generated
    setLoading(false);
  }

  async function handleGenerateNextSection() {
    setLoading(true);
    const priorText = sections.join("\n\n");
    const nextSection = await generateSection(outline, sections.length + 1, priorText);
    setSections([...sections, nextSection]);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Flesh & Fable</h1>

      <textarea
        rows="3"
        placeholder="Enter your seed quote or idea..."
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={handleGenerateOutline} disabled={loading || !seed}>
        {loading ? "Generating..." : "Generate Outline"}
      </button>

      {outline && (
        <div style={{ marginTop: 20 }}>
          <h2>Outline</h2>
          <pre style={{ background: "#eee", padding: 10, whiteSpace: "pre-wrap" }}>{outline}</pre>

          <button onClick={handleGenerateNextSection} disabled={loading}>
            {loading ? "Generating Section..." : "Generate Next Section"}
          </button>

          {sections.map((sec, idx) => (
            <div key={idx} style={{ marginTop: 20 }}>
              <h3>Section {idx + 1}</h3>
              <pre style={{ background: "#f9f9f9", padding: 10, whiteSpace: "pre-wrap" }}>{sec}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
