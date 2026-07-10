const profile = {
  name: "玩具拒玩",
  githubUser: "cachagre",
  headline: "每天清晨有多少双眼睛睁开,就有多少个世界",
  subtitle:
    "计算机科学与技术大二在读,目前在过暑假",
  currentFocus: "计算机基础 / 项目实践 / 英语",
  recentBook: "None",
  sitePosition: "为了考研学一点应试的内容",
  about: [
    "记录自己",
    
  ],
  skills: ["408 基础", "读书笔记"],
  links: [
    { label: "GitHub", href: "https://github.com/cachagre", style: "primary" },
    { label: "Email", href: "#", style: "secondary", copyText: "toyer726@gmail.com" }
  ],
  contacts: [
    
  ]
};

const readingNotes = [
  {
    title: "",
    author: "",
    category: "",
    date: "",
    summary: "",
    takeaways: [
      
    ]
  }
];

const posts = [
  {
    title:"",
    date: "",
    description: "",
    href: ""
  }
];

let activeCategory = "全部";

const $ = (selector) => document.querySelector(selector);

function setText(selector, text) {
  $(selector).textContent = text;
}

function renderProfile() {
  document.title = `${profile.name} | 个人主页`;
  $("#avatar").src = `https://github.com/${profile.githubUser}.png`;
  $("#avatar").alt = `${profile.name} 的头像`;
  setText("#brandName", profile.name);
  setText("#heroTitle", profile.headline);
  setText("#heroSubtitle", profile.subtitle);
  setText("#currentFocus", profile.currentFocus);
  setText("#recentBook", profile.recentBook);
  setText("#sitePosition", profile.sitePosition);

  $("#heroActions").innerHTML = profile.links
    .map(
      (link) => {
        const copyAttr = link.copyText ? ` data-copy-email="${link.copyText}"` : "";
        return `<a class="${link.style === "secondary" ? "secondary" : ""}" href="${link.href}"${copyAttr}>${link.label}</a>`;
      }
    )
    .join("");

  $("#aboutText").innerHTML = profile.about.map((line) => `<p>${line}</p>`).join("");
  $("#skillList").innerHTML = profile.skills.map((skill) => `<span class="tag">${skill}</span>`).join("");
  $("#contactList").innerHTML = profile.contacts
    .map((contact) => `<a href="${contact.href}">${contact.label}</a>`)
    .join("");
}

function renderFilters() {
  const categories = ["全部", ...new Set(readingNotes.map((note) => note.category))];
  $("#categoryFilters").innerHTML = categories
    .map(
      (category) =>
        `<button type="button" aria-pressed="${category === activeCategory}" data-category="${category}">${category}</button>`
    )
    .join("");
}

function getVisibleNotes() {
  const keyword = $("#searchInput").value.trim().toLowerCase();
  return readingNotes.filter((note) => {
    const categoryMatched = activeCategory === "全部" || note.category === activeCategory;
    const text = `${note.title} ${note.author} ${note.category} ${note.summary}`.toLowerCase();
    return categoryMatched && text.includes(keyword);
  });
}

function renderNotes() {
  const notes = getVisibleNotes();
  if (notes.length === 0) {
    $("#noteGrid").innerHTML = `<div class="empty-state">没有找到匹配的读书笔记。</div>`;
    return;
  }

  $("#noteGrid").innerHTML = notes
    .map(
      (note, index) => `
        <button class="note-card" type="button" data-note="${index}">
          <div class="note-meta">
            <span>${note.category}</span>
            <span>${note.date}</span>
          </div>
          <h3>${note.title}</h3>
          <p>${note.author}</p>
          <p>${note.summary}</p>
        </button>
      `
    )
    .join("");
}

function renderPosts() {
  $("#postList").innerHTML = posts
    .map(
      (post) => `
        <article class="post-item">
          <div class="post-meta">${post.date}</div>
          <div>
            <h3>${post.title}</h3>
            <p>${post.description}</p>
          </div>
          <a href="${post.href}">阅读</a>
        </article>
      `
    )
    .join("");
}

function openNote(note) {
  $("#dialogContent").innerHTML = `
    <p class="eyebrow">${note.category} / ${note.date}</p>
    <h2>${note.title}</h2>
    <p>${note.author}</p>
    <p>${note.summary}</p>
    <h3>我的收获</h3>
    <ul>${note.takeaways.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
  $("#noteDialog").showModal();
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

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

function bindEvents() {
  $("#searchInput").addEventListener("input", renderNotes);

  $("#heroActions").addEventListener("click", async (event) => {
    const link = event.target.closest("[data-copy-email]");
    if (!link) return;
    event.preventDefault();

    try {
      await copyToClipboard(link.dataset.copyEmail);
      const label = link.textContent;
      link.textContent = "已复制";
      setTimeout(() => {
        link.textContent = label;
      }, 1400);
    } catch {
      window.prompt("复制邮箱：", link.dataset.copyEmail);
    }
  });

  $("#categoryFilters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderNotes();
  });

  $("#noteGrid").addEventListener("click", (event) => {
    const card = event.target.closest(".note-card");
    if (!card) return;
    openNote(getVisibleNotes()[Number(card.dataset.note)]);
  });

  $("#closeDialog").addEventListener("click", () => $("#noteDialog").close());

  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  });
}

renderProfile();
renderFilters();
renderNotes();
renderPosts();
bindEvents();
