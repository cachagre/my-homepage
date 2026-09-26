const profile = {
  name: "玩具拒玩",
  headline: "每天清晨有多少双眼睛睁开，就有多少个世界",
  subtitle: "计算机科学与技术在读，记录学习、生活与偶尔的灵光。",
  currentFocus: "计算机基础 / 项目实践 / 英语",
  recentBook: "None",
  sitePosition: "为了考研学一点应试的内容",
  about: ["记录自己"],
  skills: ["什么都不懂", "混吃等死", "装可爱真可爱"],
  links: [
    { label: "VIEW GITHUB", href: "https://github.com/cachagre" },
    { label: "COPY EMAIL", href: "#", copyText: "toyer726@gmail.com" }
  ],
  contacts: [
    { label: "GITHUB / CACHAGRE", href: "https://github.com/cachagre" }
  ]
};

const posts = [
  { title: "", date: "", description: "", href: "" }
];

const prologueBranches = {
  waiting: {
    scene: "greeting",
    label: "第一章 · 空拍",
    reply: "……那就好。这样谁也没有资格嫌弃谁。"
  },
  archive: {
    scene: "memory",
    label: "第二章 · 跑题",
    reply: "因为真正想说的话太难开口。于是大家绕了一圈，又回到了原点。"
  },
  enter: {
    scene: "shore",
    label: "第三章 · 乐队",
    reply: "……嗯。可每次说完这句话，大家还是会问：下一次排练几点？",
    direct: true
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function renderProfile() {
  document.title = `${profile.name} | 个人主页`;
  setText("#brandName", profile.name);
  setText("#heroTitle", profile.headline);
  setText("#heroSubtitle", profile.subtitle);
  setText("#currentFocus", profile.currentFocus);
  setText("#recentBook", profile.recentBook);
  setText("#sitePosition", profile.sitePosition);
  setText("#year", new Date().getFullYear());

  $("#heroActions").innerHTML = profile.links
    .map((link) => {
      const copyAttr = link.copyText ? ` data-copy-email="${link.copyText}"` : "";
      return `<a href="${link.href}"${copyAttr}>${link.label}</a>`;
    })
    .join("");

  $("#aboutText").innerHTML = profile.about.map((line) => `<p>${line}</p>`).join("");
  $("#skillList").innerHTML = profile.skills.map((skill) => `<span class="tag">${skill}</span>`).join("");
  $("#contactList").innerHTML = profile.contacts
    .map((contact) => `<a href="${contact.href}">${contact.label}</a>`)
    .join("");
}

function renderPosts() {
  const visiblePosts = posts.filter((post) => post.title.trim());
  if (!visiblePosts.length) {
    $("#postList").innerHTML = `
      <div class="empty-state">
        <strong>下一幕，尚未书写。</strong>
        <span>文字会在合适的时候出现。</span>
      </div>`;
    return;
  }

  $("#postList").innerHTML = visiblePosts
    .map((post) => `
      <article class="post-item">
        <div class="post-meta">${post.date}</div>
        <div><h3>${post.title}</h3><p>${post.description}</p></div>
        <a href="${post.href}">阅读 →</a>
      </article>`)
    .join("");
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

function setupFilm() {
  const hero = $(".cinematic-hero");
  const slides = $$(".hero-slide");
  const steps = $$(".scene-step");
  const toggle = $("#filmToggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentScene = 0;
  let playing = !reducedMotion;
  let timer;
  let elapsedSeconds = 0;

  function updateScene(nextScene) {
    currentScene = (nextScene + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === currentScene));
    steps.forEach((step, index) => {
      step.classList.remove("is-active");
      if (index === currentScene) requestAnimationFrame(() => step.classList.add("is-active"));
    });
    setText("#sceneNumber", `SCENE ${String(currentScene + 1).padStart(2, "0")}`);
  }

  function scheduleNext() {
    clearInterval(timer);
    if (!playing) return;
    timer = setInterval(() => updateScene(currentScene + 1), 6000);
  }

  function updatePlayState() {
    hero.classList.toggle("is-paused", !playing);
    toggle.classList.toggle("is-paused", !playing);
    toggle.setAttribute("aria-label", playing ? "暂停影片" : "继续播放影片");
    setText("#filmToggleLabel", playing ? "PAUSE FILM" : "PLAY FILM");
    scheduleNext();
  }

  toggle.addEventListener("click", () => {
    playing = !playing;
    updatePlayState();
  });

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      updateScene(Number(step.dataset.sceneTarget));
      scheduleNext();
    });
  });

  hero.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    hero.style.setProperty("--mx", x.toFixed(3));
    hero.style.setProperty("--my", y.toFixed(3));
  });

  setInterval(() => {
    if (!playing) return;
    elapsedSeconds += 1;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    setText("#timecode", `00:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
  }, 1000);

  updateScene(0);
  updatePlayState();
}

function setupPrologue() {
  const prologue = $("#prologue");
  const line = $("#prologueLine");
  const choices = $("#prologueChoices");
  const branchActions = $("#prologueBranchActions");
  const askAgain = $("#askAgain");
  const enterHomepage = $("#enterHomepage");
  const sceneLabel = $("#prologueSceneLabel");
  const timelineSteps = $$(".prologue-timeline > span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const greetingScene = $('[data-prologue-scene="greeting"]');
  const touchHint = $("#prologueTouchHint");
  const eyeButtons = $$(".eye-touch");
  let typeRun = 0;
  let eyeReplyTimer;
  let eyeReplyActive = false;

  function resetEyeReply() {
    clearTimeout(eyeReplyTimer);
    eyeReplyActive = false;
    greetingScene.classList.remove("is-touched");
  }

  function resetParallax() {
    greetingScene.style.setProperty("--look-x", "0px");
    greetingScene.style.setProperty("--look-y", "0px");
  }

  prologue.addEventListener("pointermove", (event) => {
    if (reducedMotion || event.pointerType !== "mouse" || !greetingScene.classList.contains("is-active")) return;
    const bounds = prologue.getBoundingClientRect();
    greetingScene.style.setProperty("--look-x", `${(event.clientX / bounds.width - 0.5) * 12}px`);
    greetingScene.style.setProperty("--look-y", `${(event.clientY / bounds.height - 0.5) * 8}px`);
  });
  prologue.addEventListener("pointerleave", resetParallax);
  document.addEventListener("visibilitychange", () => {
    prologue.classList.toggle("is-suspended", document.hidden);
    if (document.hidden) resetParallax();
  });

  eyeButtons.forEach((button) => button.addEventListener("click", async () => {
    if (eyeReplyActive || !greetingScene.classList.contains("is-active")) return;
    eyeReplyActive = true;
    greetingScene.classList.add("is-touched");
    eyeReplyTimer = setTimeout(resetEyeReply, 1800);
    const completed = await typeLine("……我看见你了。风会替我们翻过昨天，而明天，还可以慢慢写。");
    if (completed && !prologue.hidden && branchActions.hidden) choices.hidden = false;
  }));

  function setScene(sceneName) {
    resetEyeReply();
    $$(".prologue-scene").forEach((scene) => {
      scene.classList.toggle("is-active", scene.dataset.prologueScene === sceneName);
    });
    eyeButtons.forEach((button) => { button.disabled = sceneName !== "greeting"; });
    touchHint.hidden = sceneName !== "greeting";
  }

  function setProgress(activeIndex) {
    timelineSteps.forEach((step, index) => step.classList.toggle("is-active", index <= activeIndex));
  }

  function typeLine(text) {
    const currentRun = ++typeRun;
    line.textContent = "";
    line.classList.add("is-typing");

    if (reducedMotion) {
      line.textContent = text;
      line.classList.remove("is-typing");
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      let index = 0;
      function typeNext() {
        if (currentRun !== typeRun) {
          resolve(false);
          return;
        }
        line.textContent = text.slice(0, index + 1);
        index += 1;
        if (index < text.length) {
          setTimeout(typeNext, text[index - 1] === "…" ? 150 : 42);
          return;
        }
        line.classList.remove("is-typing");
        resolve(true);
      }
      typeNext();
    });
  }

  async function showChoices(prompt = "晚上好。每一次挥手，都是向旧日作别，也是在向尚未命名的新生问好。") {
    choices.hidden = true;
    branchActions.hidden = true;
    askAgain.hidden = false;
    setScene("greeting");
    sceneLabel.textContent = "序章 · 相遇";
    setProgress(0);
    const completed = await typeLine(prompt);
    if (completed && !prologue.hidden) choices.hidden = false;
  }

  async function selectBranch(branchName) {
    const branch = prologueBranches[branchName];
    choices.hidden = true;
    branchActions.hidden = true;
    setScene(branch.scene);
    sceneLabel.textContent = branch.label;
    setProgress(branch.direct ? 2 : 1);
    const completed = await typeLine(branch.reply);
    if (!completed || prologue.hidden) return;
    askAgain.hidden = Boolean(branch.direct);
    branchActions.hidden = false;
    enterHomepage.focus({ preventScroll: true });
  }

  function closePrologue() {
    typeRun += 1;
    resetEyeReply();
    resetParallax();
    line.classList.remove("is-typing");
    prologue.classList.add("is-leaving");
    setTimeout(() => {
      prologue.hidden = true;
      prologue.classList.remove("is-ready", "is-leaving");
      document.body.classList.remove("intro-active");
      $(".cinematic-hero").focus?.({ preventScroll: true });
    }, reducedMotion ? 40 : 920);
  }

  function openPrologue() {
    typeRun += 1;
    prologue.hidden = false;
    prologue.classList.remove("is-leaving");
    document.body.classList.add("intro-active");
    requestAnimationFrame(() => {
      prologue.classList.add("is-ready");
      showChoices();
    });
  }

  choices.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prologue-choice]");
    if (button) selectBranch(button.dataset.prologueChoice);
  });

  askAgain.addEventListener("click", () => showChoices("还想问什么？夜还很长。"));
  enterHomepage.addEventListener("click", closePrologue);
  $("#skipPrologue").addEventListener("click", closePrologue);
  $("#replayIntro").addEventListener("click", openPrologue);

  requestAnimationFrame(() => {
    prologue.classList.add("is-ready");
    showChoices();
  });
}

function setupReveals() {
  const sections = $$(".reveal-section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  sections.forEach((section) => observer.observe(section));
}

function setupInteractions() {
  $("#heroActions").addEventListener("click", async (event) => {
    const link = event.target.closest("[data-copy-email]");
    if (!link) return;
    event.preventDefault();
    try {
      await copyToClipboard(link.dataset.copyEmail);
      const label = link.textContent;
      link.textContent = "EMAIL COPIED";
      setTimeout(() => { link.textContent = label; }, 1500);
    } catch {
      window.prompt("复制邮箱：", link.dataset.copyEmail);
    }
  });

  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const soft = root.dataset.lights !== "soft";
    root.dataset.lights = soft ? "soft" : "";
    $("#themeToggle").setAttribute("aria-pressed", String(soft));
  });

  window.addEventListener("scroll", () => {
    $(".site-header").classList.toggle("is-scrolled", window.scrollY > 48);
  }, { passive: true });
}

renderProfile();
renderPosts();
setupPrologue();
setupFilm();
setupReveals();
setupInteractions();
