// ------- Configuration -------

// JEE/VITEEE physics‑style tutor sections
const SECTION_ORDER = [
  "FOUNDATION (Basics)",
  "CORE CONCEPTS",
  "FORMULAS",
  "EXAM LEVEL",
  "FINAL SUMMARY"
];

// Simulated AI template following your teaching style.
// Later you can replace `buildSimulatedResponse` with a real API call.
function buildSimulatedResponse(topicRaw) {
  const topic = topicRaw.trim() || "Selected Topic";

  return {
    "FOUNDATION (Basics)": `
Okay, let's start super basic for "${topic}".

In simple words, this concept tells you **how physics is actually happening in real life**, but in a proper math + logic language. Imagine I'm your favourite physics sir in class, explaining on the board—same vibe here.

Think of one daily life scene where "${topic}" comes naturally. For example, if "${topic}" is related to motion, imagine:
- You sitting in a car,
- Speeding up, slowing down, or turning,
- How you feel a push or pull even though you are just sitting.

In the same way, "${topic}" is just a **clean way of describing what you already experience daily**, but with:
- proper words,
- proper units,
- proper equations.

First you should feel, “haan sir, ye toh roz hota hai life mein”, then we convert that feel into physics language. That’s the base.`.trim(),

    "CORE CONCEPTS": `
Now let's pull the main pillars of "${topic}" one by one, like small building blocks.

1. **Core Idea 1 – What is actually changing?**
   Always ask: in this chapter, **kaun si cheez change ho rahi hai?**  
   Position? Speed? Energy? Force? Charge? Field?  
   "${topic}" is mainly about how that quantity behaves when conditions around it change.

2. **Core Idea 2 – Cause and effect**
   JEE/VITEEE physics is full cause–effect.  
   Something changes (cause) → system reacts (effect).  
   In "${topic}", figure out:
   - kaun cause hai (which parameter we control),
   - kaun effect hai (what responds in result).

3. **Core Idea 3 – Graph feeling**
   For any physics topic, if you can **see a graph in your mind**, you're already ahead of 80% students.  
   Imagine one smooth curve that shows how the main quantity in "${topic}" grows, falls or stays constant.  
   Even a rough mental graph gives huge intuition for MCQs and integer type questions.

4. **Core Idea 4 – Limiting and extreme cases**
   Good JEE/VITEEE students always think:  
   - agar value bahut chhoti ho jaye to kya hoga?  
   - agar bahut badi ho jaye to kya hoga?  
   "${topic}" bhi extreme cases mein bahut predictable ban jaata hai. That makes hard problems look easy.

Overall, "${topic}" is not random formula mugging. It’s a **story of one or two main physical quantities** and how they behave in different situations.`.trim(),

    "FORMULAS": `
Now formulas of "${topic}"—but **with feeling**, not dead memory.

- Start with the **most fundamental relation** of this chapter.  
  This is the one which almost every other formula can be derived from.  
  In exam, even if you forget fancy shortcuts, this one relation can rebuild everything.

- Next, list **2–4 very standard formulas** that:
  - directly appear in objective questions,
  - or are used inside big derivations.

For each formula of "${topic}", you should know:
- each symbol ka meaning (with units),
- which direction sign is positive,
- kis condition mein valid hai (ideal case? small angle? constant acceleration? etc.),
- and ek chhota sa mental example where it obviously works.

Golden rule:  
If you cannot **explain a formula in your own Tanglish**, you don't fully own it yet. Read it, speak it out loud in simple words, then it becomes your weapon for JEE/VITEEE.`.trim(),

    "EXAM LEVEL": `
Ab thoda exam mode mein aa jaate hain for "${topic}".

**Common exam tricks:**
- Paper setter will rarely write the formula directly. They’ll **hide the concept** inside story language, graphs or mixed topics.
- Many JEE/VITEEE questions on "${topic}" are just **unit checking + order of magnitude thinking**, not full derivation.
- Often you can cancel big parts mentally and directly jump to ratio or proportionality.

**Very common mistakes:**
- Galat sign: plus/minus ghoom jata hai, especially when direction is opposite to your assumption.
- Wrong units: mixing cm with m, gram with kg, or forgetting to convert.
- Using a formula of "${topic}" **outside its valid condition** (for example assuming constant acceleration when it’s clearly not).
- Ignoring given constraints in the question (like “smooth”, “light string”, “frictionless”, “equilibrium”).

**JEE/VITEEE style tip:**
Before solving, take 5 seconds and say in your head:
> “Yeh question actually kis base idea se aa raha hai from "${topic}"?”

Once you name the idea, 70% work done. Calculation is just clean finishing.`.trim(),

    "FINAL SUMMARY": `
Chalo "${topic}" ko ek short revision snapshot mein pack karte hain:

- **Feel first, formula later** – Pehle real-life scene imagine karo, phir equation likho.
- **One main quantity** – Har chapter ek do important physical quantity ke around ghoomta hai; woh identify karo.
- **Graph + limit thinking** – How does that quantity behave on a graph? Extreme cases mein kya hota hai?
- **Formula with meaning** – Har symbol ka clear picture rakho. Units + direction + valid conditions.
- **Exam lens** – JEE/VITEEE mein direct formula se zyada, concept disguise important hai. Story ko tod ke base idea tak aao.
- **Error checklist** – sign, units, conditions, and final answer ka order of magnitude always re-check.

If you revise "${topic}" using this 5‑step template, you’ll naturally start thinking like a smart physics solver, not a formula‑mugging student.`.trim()
  };
}

// Simple tags per section for card footer
const SECTION_TAG_HINTS = {
  "FOUNDATION (Basics)": ["Tanglish basics", "Real life"],
  "CORE CONCEPTS": ["Intuition", "Pillars"],
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

