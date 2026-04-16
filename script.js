// ------- Configuration -------

const SECTION_ORDER = [
  "FOUNDATION (Basics)",
  "CORE CONCEPTS",
  "ADVANCED LEVEL",
  "EXTRA EDGE CONCEPTS",
  "INTUITION",
  "COMMON MISTAKES",
  "SHORTCUTS & TRICKS",
  "IMPORTANT TOPICS",
  "QUESTION PATTERNS",
  "PRACTICE QUESTIONS",
  "FINAL FORMULA SUMMARY"
];

// Simple simulated AI template.
// You can later replace `buildSimulatedResponse` with a real API call.
function buildSimulatedResponse(topicRaw) {
  const topic = topicRaw.trim() || "Selected Topic";

  return {
    "FOUNDATION (Basics)": `
Define what "${topic}" actually represents in the syllabus and in real life.
List key terms and symbols you will repeatedly use when dealing with this topic.
Clarify all units, dimensions and basic notations (for example, vector vs scalar form).
Connect it with the prerequisite chapters so that the learner recalls earlier ideas first.
Make sure the student can state the textbook definition of "${topic}" in a precise, exam-ready way.`.trim(),

    "CORE CONCEPTS": `
Break "${topic}" into 3–6 core ideas you must absolutely master for strong exam performance.
Explain each idea in one short paragraph followed by a crisp, bullet-style takeaway.
Highlight typical formulae, laws, theorems or relations that appear directly from these ideas.
Show at least one simple numeric example for each core concept to ground the theory.
Mention how these ideas combine in a standard problem based on "${topic}".`.trim(),

    "ADVANCED LEVEL": `
Extend the discussion of "${topic}" towards concepts that are more advanced and multi-step.
Introduce any special cases, limiting cases or edge-case behaviour that examiners love.
Discuss how the same formula behaves differently when parameters approach 0, ∞ or negative values.
Point out links with other high-level chapters (for example, graphs, calculus, modern physics, etc.).
Summarise how an advanced problem typically mixes "${topic}" with 1–2 other chapters.`.trim(),

    "EXTRA EDGE CONCEPTS": `
Mention 3–5 not-so-obvious results or observations around "${topic}" that give a competitive edge.
Include pattern observations, graphical interpretations or lesser-known shortcuts.
Clarify any conceptual traps that students who only read basic material usually miss.
If relevant, connect "${topic}" to experimental/real-life setups so that intuition becomes stronger.
End with 1–2 one-line "pro" insights that are memorable and high-yield in exams.`.trim(),

    "INTUITION": `
Explain "${topic}" using pure intuition—imagine teaching it to a curious 9th-grade student.
Use analogies (daily life, sports, driving, games) that map exactly to the formal concept.
Describe what is increasing/decreasing, pushing/pulling, storing/releasing, etc., in this chapter.
Use rough sketches or verbal imagery to show how quantities evolve step by step.
Ensure the learner can visualise a typical question from "${topic}" without looking at formulas first.`.trim(),

    "COMMON MISTAKES": `
List the 5–8 most common mistakes students make while solving problems from "${topic}".
Include sign errors, unit errors, wrong substitution, skipping conditions or domain restrictions.
Highlight confusion with look-alike formulas or misreading of graphs/diagrams.
For each mistake, add a quick "fix rule" or checklist that prevents it in the exam hall.
End with a mini checklist that students can mentally run through before finalising their answer.`.trim(),

    "SHORTCUTS & TRICKS": `
Present legal, concept-based shortcuts for problems involving "${topic}"—not rote hacks.
Include any pattern-based elimination tricks useful for objective and subjective questions.
Show when approximations (small angle, large distance, ideal conditions) are safe to apply.
Give 2–3 worked shortcut examples, comparing the long vs. short method.
Warn where shortcuts fail so that students do not overuse them blindly.`.trim(),

    "IMPORTANT TOPICS": `
Within "${topic}", mark the exact sub-topics that appear most frequently in past papers.
Rank 3–7 areas as "Very High", "High" and "Moderate" weightage for typical exams.
Mention any favorite question styles repeatedly used by exam setters from this chapter.
Advise how much time to allocate to each sub-part during revision.
Connect these with standard books or modules the student might be following (NCERT, coaching modules, etc.).`.trim(),

    "QUESTION PATTERNS": `
Describe the classic question patterns built around "${topic}" (theory, numeric, graph-based, assertion–reason, short answer, integer type).
For each pattern, specify the average difficulty and typical time required per question.
Include at least one example structure like: "Given __, asked to find __ using __ relation."
Show how examiners hide the core idea of "${topic}" inside seemingly different statements.
End with an exam strategy on which patterns to attempt first and which to leave for the end.`.trim(),

    "PRACTICE QUESTIONS": `
Create 5–8 practice questions on "${topic}" in increasing order of difficulty.
Ensure there is a mix of basic, intermediate and advanced style questions.
Tag each question with [Easy], [Medium] or [Advanced] and ideal time (in minutes).
Focus on conceptual variety: direct formula, application, multi-step, graph, and mixed-chapter problems.
(You may write questions in text-only form so that they can be quickly converted into formal PDFs later.)`.trim(),

    "FINAL FORMULA SUMMARY": `
Write a compact formula sheet for "${topic}" suitable for last-day revision.
Group formulas logically (by sub-topic or by variable).
Specify units, conditions of validity and any important approximations next to each formula.
Highlight 3–5 "must remember at any cost" relations with a star.
Keep the language ultra-compact so it can fit into a single revision page or digital flashcard.`.trim()
  };
}

// Simple tags per section for card footer
const SECTION_TAG_HINTS = {
  "FOUNDATION (Basics)": ["Basics", "Definitions"],
  "CORE CONCEPTS": ["High yield", "Theory + examples"],
  "ADVANCED LEVEL": ["Challenging", "Edge cases"],
  "EXTRA EDGE CONCEPTS": ["Pro tips", "Non-obvious"],
  "INTUITION": ["Visual", "Real life"],
  "COMMON MISTAKES": ["Exam traps", "Error log"],
  "SHORTCUTS & TRICKS": ["Speed", "Smart solving"],
  "IMPORTANT TOPICS": ["Priority", "Weightage"],
  "QUESTION PATTERNS": ["Question styles", "Strategy"],
  "PRACTICE QUESTIONS": ["Drill", "Mixed level"],
  "FINAL FORMULA SUMMARY": ["Revision", "Formula sheet"]
};

// ------- DOM references -------

const htmlEl = document.documentElement;
const topicForm = document.getElementById("topicForm");
const topicInput = document.getElementById("topicInput");
const clearInputBtn = document.getElementById("clearInputBtn");
const generateBtn = document.getElementById("generateBtn");
const loader = document.getElementById("loader");
const outputStatus = document.getElementById("outputStatus");
const cardsGrid = document.getElementById("cardsGrid");
const sectionNavList = document.getElementById("sectionNavList");
const currentTopicLabel = document.getElementById("currentTopicLabel");
const copyAllBtn = document.getElementById("copyAllBtn");
const themeToggle = document.getElementById("themeToggle");
const scrollToOutputBtn = document.getElementById("scrollToOutputBtn");
const outputSection = document.getElementById("outputSection");

// ------- Helpers -------

function setLoading(isLoading) {
  if (isLoading) {
    loader.classList.add("active");
    generateBtn.classList.add("loading");
    generateBtn.disabled = true;
  } else {
    loader.classList.remove("active");
    generateBtn.classList.remove("loading");
    generateBtn.disabled = false;
  }
}

function clearOutput() {
  cardsGrid.innerHTML = "";
  sectionNavList.innerHTML = "";
}

function createSectionNavItem(id, label) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "section-link";
  btn.dataset.targetId = id;

  const dot = document.createElement("span");
  dot.className = "dot";

  const text = document.createElement("span");
  text.textContent = label;

  btn.appendChild(dot);
  btn.appendChild(text);
  li.appendChild(btn);
  return li;
}

function createSectionCard(index, id, title, content) {
  const card = document.createElement("article");
  card.className = "section-card";
  card.id = id;

  const header = document.createElement("header");
  header.className = "section-card-header";

  const titleWrap = document.createElement("div");
  titleWrap.className = "section-card-title";

  const indexEl = document.createElement("span");
  indexEl.className = "index";
  indexEl.textContent = index + 1;

  const h3 = document.createElement("h3");
  h3.textContent = title;

  titleWrap.appendChild(indexEl);
  titleWrap.appendChild(h3);

  const footerActions = document.createElement("div");
  footerActions.className = "section-card-footer";

  const tagsWrap = document.createElement("div");
  tagsWrap.className = "card-tags";

  (SECTION_TAG_HINTS[title] || []).forEach((t) => {
    const span = document.createElement("span");
    span.className = "card-tag";
    span.textContent = t;
    tagsWrap.appendChild(span);
  });

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "card-copy-btn";
  copyBtn.innerHTML = `<span>⧉</span><span>Copy</span>`;
  copyBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        copyBtn.innerHTML = `<span>✓</span><span>Copied</span>`;
        setTimeout(
          () => (copyBtn.innerHTML = `<span>⧉</span><span>Copy</span>`),
          1400
        );
      })
      .catch(() => {
        copyBtn.innerHTML = `<span>!</span><span>Error</span>`;
        setTimeout(
          () => (copyBtn.innerHTML = `<span>⧉</span><span>Copy</span>`),
          1400
        );
      });
  });

  const body = document.createElement("div");
  body.className = "section-card-body";
  body.dataset.fullText = content;

  header.appendChild(titleWrap);

  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(footerActions);

  const cardTagsWrapper = document.createElement("div");
  cardTagsWrapper.className = "card-tags";

  footerActions.appendChild(tagsWrap);
  footerActions.appendChild(copyBtn);

  return card;
}

// Typing effect for a single element
function typeText(element, text, speed = 12) {
  element.textContent = "";
  element.classList.add("typing");

  return new Promise((resolve) => {
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        element.textContent = text.slice(0, i);
        i++;
        requestAnimationFrame(() => {
          setTimeout(step, speed);
        });
      } else {
        element.classList.remove("typing");
        resolve();
      }
    };
    step();
  });
}

// Type all cards sequentially
async function typeAllCards() {
  const cards = Array.from(cardsGrid.querySelectorAll(".section-card"));
  for (let idx = 0; idx < cards.length; idx++) {
    const card = cards[idx];
    const body = card.querySelector(".section-card-body");
    const text = body.dataset.fullText || "";
    // Reveal card with slight delay
    setTimeout(() => card.classList.add("visible"), 80 * idx);
    await typeText(body, text, 10 + idx); // small variation
  }
}

// Update section nav active state based on scroll
function updateActiveSection() {
  const cards = Array.from(cardsGrid.querySelectorAll(".section-card"));
  if (!cards.length) return;

  const viewportMid = window.scrollY + window.innerHeight / 2;
  let activeId = cards[0].id;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardMid = rect.top + window.scrollY + rect.height / 2;
    if (cardMid <= viewportMid) {
      activeId = card.id;
    }
  });

  const links = sectionNavList.querySelectorAll(".section-link");
  links.forEach((link) => {
    if (link.dataset.targetId === activeId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ------- Event bindings -------

// Theme toggle
themeToggle.addEventListener("change", (e) => {
  const dark = e.target.checked;
  htmlEl.setAttribute("data-theme", dark ? "dark" : "light");
});

// Input clear button visibility
function refreshClearButton() {
  if (topicInput.value.trim().length > 0) {
    topicInput.parentElement.classList.add("has-value");
  } else {
    topicInput.parentElement.classList.remove("has-value");
  }
}

topicInput.addEventListener("input", refreshClearButton);

clearInputBtn.addEventListener("click", () => {
  topicInput.value = "";
  refreshClearButton();
  topicInput.focus();
});

// Scroll to output
scrollToOutputBtn.addEventListener("click", () => {
  outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Copy all notes
copyAllBtn.addEventListener("click", () => {
  const texts = Array.from(
    cardsGrid.querySelectorAll(".section-card-body")
  ).map((el) => {
    const card = el.closest(".section-card");
    const title = card.querySelector("h3")?.textContent || "";
    return `${title}\n${el.dataset.fullText || ""}`;
  });

  if (!texts.length) return;

  const combined = texts.join("\n\n---\n\n");
  navigator.clipboard
    .writeText(combined)
    .then(() => {
      copyAllBtn.textContent = "Copied!";
      setTimeout(() => (copyAllBtn.textContent = "Copy All Notes"), 1400);
    })
    .catch(() => {
      copyAllBtn.textContent = "Error";
      setTimeout(() => (copyAllBtn.textContent = "Copy All Notes"), 1400);
    });
});

// Form submission
topicForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const topic = topicInput.value.trim();

  if (!topic) {
    outputStatus.textContent = "Please enter a topic before generating the explanation.";
    outputStatus.classList.add("error");
    return;
  }

  outputStatus.classList.remove("error");
  outputStatus.textContent = "Generating structured explanation. This is a simulated AI response.";

  clearOutput();
  setLoading(true);
  currentTopicLabel.textContent = `Topic: ${topic}`;

  // Simulate small delay to show loader (like an API round-trip)
  await new Promise((resolve) => setTimeout(resolve, 700));

  const response = buildSimulatedResponse(topic);

  // Build navigation + cards
  SECTION_ORDER.forEach((title, index) => {
    const id = `section-${index}`;
    const content = response[title] || "";

    // Nav
    const navItem = createSectionNavItem(id, title);
    sectionNavList.appendChild(navItem);

    // Card
    const card = createSectionCard(index, id, title, content);
    cardsGrid.appendChild(card);
  });

  // Bind nav click -> smooth scroll
  sectionNavList.querySelectorAll(".section-link").forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.targetId;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 80; // to avoid header
      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });

  setLoading(false);
  outputStatus.textContent =
    "Structured explanation ready. Scroll or use the left navigation to jump between sections.";

  // Start typing effect after cards are in DOM
  typeAllCards();
});

// Scroll listener for active section
window.addEventListener("scroll", () => {
  updateActiveSection();
});

// Initial state
refreshClearButton();
updateActiveSection();

