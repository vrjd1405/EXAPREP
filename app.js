// Simple EXAPREP front-end logic
// - Generates a structured template answer for any topic
// - CRUD operations on saved topics using localStorage

const subjectEl = document.getElementById("subject");
const topicEl = document.getElementById("topic");
const generateBtn = document.getElementById("generateBtn");
const outputEl = document.getElementById("output");
const loadingEl = document.getElementById("loading");
const saveTopicBtn = document.getElementById("saveTopicBtn");
const savedListEl = document.getElementById("savedList");
const noSavedEl = document.getElementById("noSaved");

const STORAGE_KEY = "exaprep_saved_topics_v1";

function getSavedTopics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setSavedTopics(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderSavedTopics() {
  const items = getSavedTopics();
  savedListEl.innerHTML = "";
  if (!items.length) {
    noSavedEl.classList.remove("hidden");
    return;
  }
  noSavedEl.classList.add("hidden");

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";

    const title = document.createElement("div");
    title.className = "saved-title";
    title.textContent = `${item.subject || "Topic"} – ${item.topic}`;

    const meta = document.createElement("div");
    meta.className = "saved-meta";
    meta.textContent = `Last updated: ${new Date(item.updatedAt).toLocaleString()}`;

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    const chip = document.createElement("div");
    chip.className = "chip";
    const dot = document.createElement("span");
    dot.className = "chip-dot";
    const chipText = document.createElement("span");
    chipText.textContent = "Structured notes";
    chip.appendChild(dot);
    chip.appendChild(chipText);

    const viewBtn = document.createElement("button");
    viewBtn.className = "pill-btn";
    viewBtn.textContent = "View";
    viewBtn.onclick = () => {
      subjectEl.value = item.subject;
      topicEl.value = item.topic;
      outputEl.innerHTML = item.html;
      saveTopicBtn.disabled = false;
    };

    const editBtn = document.createElement("button");
    editBtn.className = "pill-btn";
    editBtn.textContent = "Update with new answer";
    editBtn.onclick = async () => {
      subjectEl.value = item.subject;
      topicEl.value = item.topic;
      await handleGenerate(true, item.id);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "pill-btn danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      const confirmDelete = window.confirm(
        `Delete saved topic "${item.topic}" for ${item.subject || "Topic"}?`
      );
      if (!confirmDelete) return;
      const remaining = getSavedTopics().filter((t) => t.id !== item.id);
      setSavedTopics(remaining);
      renderSavedTopics();
    };

    actions.appendChild(chip);
    actions.appendChild(viewBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(title);
    li.appendChild(meta);
    li.appendChild(actions);
    savedListEl.appendChild(li);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildExplanationHtml(subject, topic) {
  const safeSubject = escapeHtml(subject || "Subject");
  const safeTopic = escapeHtml(topic || "Topic");

  return `
    <h3>${safeSubject} – ${safeTopic}</h3>
    <p><strong>Goal:</strong> Understand this topic from zero level to advanced, with formulas, tricks, mistakes, and exam-focused practice for JEE / VITEEE.</p>

    <h3>1. Zero-Level Basics</h3>
    <p>Start by writing down what the topic is about in your own words. For this section, you should be able to answer:</p>
    <ul>
      <li>What is the basic definition of <strong>${safeTopic}</strong>?</li>
      <li>What are the key quantities, terms or symbols used?</li>
      <li>What is the simplest real-life example related to this topic?</li>
    </ul>

    <h3>2. Step-by-Step Core Concepts</h3>
    <p>Break the topic into 3–6 core ideas. For each, try to understand:</p>
    <ul>
      <li>Definition / statement</li>
      <li>Diagram or visual picture (if relevant)</li>
      <li>Simple example or numerical illustration</li>
      <li>How it connects to previous concepts you know</li>
    </ul>

    <h3>3. Advanced Level & Competitive Edge</h3>
    <p>At this level, you should focus on:</p>
    <ul>
      <li>Important edge cases and non-obvious scenarios</li>
      <li>How this topic is mixed with other chapters in JEE / VITEEE questions</li>
      <li>Special tricks or shortcuts that save time during MCQs</li>
      <li>Common high-order thinking questions (HOTs) that combine multiple ideas</li>
    </ul>

    <h3>4. Important Formulas & Results</h3>
    <p>Create a compact list of formulas and results for <strong>${safeTopic}</strong>:</p>
    <ul>
      <li>Write each formula with clear meaning of every symbol.</li>
      <li>Note the conditions (when the formula is valid / not valid).</li>
      <li>Add 1–2 example values near each formula to build intuition.</li>
    </ul>

    <h3>5. Intuition & Real Understanding</h3>
    <p>Ask yourself:</p>
    <ul>
      <li>“If I change this quantity, what happens qualitatively?”</li>
      <li>“Can I draw a picture or story that represents this formula or concept?”</li>
      <li>“What would be a real-life situation where this topic naturally appears?”</li>
    </ul>

    <h3>6. Common Mistakes Students Make</h3>
    <ul>
      <li>Memorising formulas without knowing when they apply.</li>
      <li>Ignoring units, sign conventions, or domain/range (for Maths).</li>
      <li>Confusing similar-looking concepts or using wrong approximations.</li>
      <li>Not checking boundary cases or extreme values in MCQs.</li>
    </ul>

    <h3>7. Shortcuts & Time-Saving Tricks</h3>
    <p>For this topic, identify:</p>
    <ul>
      <li>Any standard patterns in questions (e.g., “whenever they ask X, quickly check Y first”).</li>
      <li>Ways to avoid full derivations and jump directly using logic or key results.</li>
      <li>Fast elimination tricks in MCQs: quickly reject 2 options using units, orders of magnitude, or simple substitution.</li>
    </ul>

    <h3>8. Exam Importance (JEE / VITEEE)</h3>
    <ul>
      <li>Mark whether <strong>${safeTopic}</strong> is usually asked via direct formula, conceptual theory, or mixed-chapter problems.</li>
      <li>Note any famous subtopics that repeatedly appear in previous year questions.</li>
      <li>Identify 2–3 “must-solve” patterns that almost always come from this topic.</li>
    </ul>

    <h3>9. Practice Question Patterns</h3>
    <p>Typical question styles you should practice for ${safeSubject} – ${safeTopic}:</p>
    <ul>
      <li>Basic concept check (definition / direct application)</li>
      <li>Formula application with simple numbers</li>
      <li>Tricky conceptual MCQ with close options</li>
      <li>Mixed-topic question combining this with 1–2 other chapters</li>
      <li>Edge-case or “what if” scenario question testing deep understanding</li>
    </ul>

    <h3>10. Your Own Formula & Concept Sheet</h3>
    <p>On one A4 page, summarise for <strong>${safeTopic}</strong>:</p>
    <ul>
      <li>Top 5–10 formulas</li>
      <li>3–5 most important concepts</li>
      <li>3 most common mistakes to avoid</li>
      <li>2 fast-check tricks to use during exam</li>
    </ul>
  `;
}

async function handleGenerate(isUpdate = false, updateId = null) {
  const subject = subjectEl.value.trim();
  const topic = topicEl.value.trim();

  if (!topic) {
    alert("Please enter a topic.");
    topicEl.focus();
    return;
  }

  loadingEl.classList.remove("hidden");
  saveTopicBtn.disabled = true;
  generateBtn.disabled = true;

  try {
    // Currently using a deterministic template for explanation.
    // To connect a real AI model, replace the call to buildExplanationHtml()
    // with a fetch() request to your backend or OpenAI/other LLM API.
    const html = buildExplanationHtml(subject, topic);

    // Smooth fade-in animation for new content
    outputEl.classList.remove("fresh", "show");
    // Force reflow to restart animation
    // eslint-disable-next-line no-void
    void outputEl.offsetWidth;
    outputEl.classList.add("fresh");
    outputEl.innerHTML = html;
    requestAnimationFrame(() => {
      outputEl.classList.add("show");
    });

    saveTopicBtn.disabled = false;

    if (isUpdate && updateId) {
      const items = getSavedTopics();
      const next = items.map((it) =>
        it.id === updateId
          ? { ...it, html, subject, topic, updatedAt: new Date().toISOString() }
          : it
      );
      setSavedTopics(next);
      renderSavedTopics();
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while generating the explanation.");
  } finally {
    loadingEl.classList.add("hidden");
    generateBtn.disabled = false;
  }
}

function handleSaveTopic() {
  const subject = subjectEl.value.trim() || "General";
  const topic = topicEl.value.trim();
  if (!topic) {
    alert("Please enter a topic before saving.");
    return;
  }
  const html = outputEl.innerHTML;
  if (!html || !html.trim()) {
    alert("Nothing to save. Generate an explanation first.");
    return;
  }

  const items = getSavedTopics();
  const existingIndex = items.findIndex(
    (it) => it.subject === subject && it.topic.toLowerCase() === topic.toLowerCase()
  );

  const now = new Date().toISOString();
  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      html,
      updatedAt: now,
    };
  } else {
    items.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random()}`,
      subject,
      topic,
      html,
      createdAt: now,
      updatedAt: now,
    });
  }

  setSavedTopics(items);
  renderSavedTopics();
}

generateBtn.addEventListener("click", () => handleGenerate(false, null));
saveTopicBtn.addEventListener("click", handleSaveTopic);

topicEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleGenerate(false, null);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderSavedTopics();
});

