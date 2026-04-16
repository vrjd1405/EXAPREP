// ------- Configuration -------

// JEE/VITEEE physics‑style tutor sections
const SECTION_ORDER = [
  "FOUNDATION (Basics)",
  "CORE CONCEPTS",
  "FORMULAS",
  "EXAM LEVEL",
  "FINAL SUMMARY"
];

// Simulated AI template: short, clear English only.
// Later you can replace `buildSimulatedResponse` with a real API call.
function buildSimulatedResponse(topicRaw) {
  const topic = topicRaw.trim() || "Selected Topic";

  return {
    "FOUNDATION (Basics)": `
Let us first understand what "${topic}" actually is.

This topic is a clean way to describe a real physical situation using simple ideas and maths.  
Ask yourself: *Where do I see this in daily life?*  
For example, if "${topic}" is about motion, think of a car starting, stopping, or turning and how your body reacts.

Key basic points:
- What quantity is changing? (position, speed, energy, force, charge, field, etc.)
- What are the standard units and symbols we use?
- Which earlier chapters connect to it (like kinematics, vectors, or basic math)?

Once you can point to a real-life scene and say “this is ${topic} in action”, your foundation is ready.`.trim(),

    "CORE CONCEPTS": `
Now focus on the main ideas that drive "${topic}".

1. **What is changing?**  
   Identify the primary physical quantity for this chapter (for example: velocity in motion, force in dynamics, charge in electrostatics). "${topic}" mainly tracks how this quantity behaves.

2. **Cause and effect**  
   In every question, ask: *What is the cause and what is the effect?*  
   When one quantity changes (cause), something else responds (effect). "${topic}" gives the rule connecting them.

3. **Graph intuition**  
   Try to imagine at least one simple graph for "${topic}" (for example, quantity vs. time or quantity vs. position). Even a rough mental graph helps you predict increasing, decreasing, or constant behaviour.

4. **Extreme cases**  
   Check what happens when a variable becomes very small, very large, or zero. Hard questions often become easy when you understand these limiting cases.

So, "${topic}" is really a story about how one or two key quantities react when conditions change.`.trim(),

    "FORMULAS": `
Formulas of "${topic}" are just short-hand versions of the ideas above.

- First, there is usually **one main relation** that defines the chapter.  
  From this, most other results can be derived.

- Then you have **a small set of standard formulas** that appear repeatedly in questions.

For each important formula in "${topic}":
- Know what every symbol means and its unit.
- Know in which direction sign is taken positive.
- Know under which conditions it is valid (for example, constant acceleration, ideal conditions, small angle, etc.).

If you can look at a formula and say in plain English, “This means when ___ changes, ___ responds like this…”, then that formula is truly clear.`.trim(),

    "EXAM LEVEL": `
Now think like a JEE/VITEEE examiner who wants to test "${topic}" smartly.

**Typical tricks:**
- The question rarely writes the formula directly; the concept is hidden inside a story, a graph, or a combo of topics.
- Many problems can be cracked by thinking in **ratios, proportionality, and units**, not full long calculations.
- Sometimes a rough estimate or limiting-case check is enough to eliminate wrong options.

**Common mistakes:**
- Sign error (wrong plus/minus when direction is opposite to your assumption).
- Unit error (mixing cm with m, g with kg, or forgetting conversion).
- Applying a formula for "${topic}" outside its valid range of conditions.
- Ignoring keywords like “smooth”, “equilibrium”, “light string”, “frictionless”, which simplify the physics.

Before solving, pause for 3–5 seconds and ask:  
“Which core idea of \\"${topic}\\" is this question really using?”  
Once you see the idea, the rest is mostly clean execution.`.trim(),

    "FINAL SUMMARY": `
Final quick revision for "${topic}":

- Start from **real-life feel**, then connect to the physics idea.
- Identify the **one or two main quantities** that the whole topic talks about.
- Use **graphs and extreme cases** to build strong intuition.
- Learn each key **formula with full meaning**: symbols, units, direction, and validity.
- In exam mode, first spot the **underlying idea**, then do neat, low-error calculations.
- Always run a quick check for sign, units, and rough size of the final answer.

Using this template, any topic like "${topic}" becomes easier to remember, reason about, and apply in JEE/VITEEE problems.`.trim()
  };
}

// Simple tags per section for card footer
const SECTION_TAG_HINTS = {
  "FOUNDATION (Basics)": ["Basics", "Real life"],
  "CORE CONCEPTS": ["Intuition", "Key ideas"],
  "FORMULAS": ["Meaning", "Units"],
  "EXAM LEVEL": ["JEE/VITEEE", "Tricks"],
  "FINAL SUMMARY": ["Revision", "Quick recall"]
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

