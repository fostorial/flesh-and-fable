
// utils/api.js

const API_BASE = "http://localhost:8000";

export async function generateOutline(seed) {
  const res = await fetch(`${API_BASE}/generate-outline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seed }),
  });
  const data = await res.json();
  console.log("Received outline data:", data);  // Log the response data
  return data.outline;
}

export async function generateSection(outline, sectionNumber, priorSections = "") {
  const res = await fetch(`${API_BASE}/generate-section`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      outline,
      section_number: sectionNumber,
      prior_sections: priorSections,
    }),
  });
  const data = await res.json();
  return data.section_text;
}
