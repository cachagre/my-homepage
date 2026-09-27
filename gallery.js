const images = [
  { src: "./assets/gallery-band.jpg", alt: "手持麦克风的若叶睦三连画", layout: "wide" },
  { src: "./assets/gallery-noir.jpg", alt: "黑色星空背景中的若叶睦", layout: "portrait" },
  { src: "./assets/gallery-red.jpg", alt: "红黑舞台中的若叶睦", layout: "portrait" },
  { src: "./assets/gallery-spiral.jpg", alt: "螺旋楼梯上伸手的若叶睦二人", layout: "portrait" },
  { src: "./assets/mutsumi-seaside.png", alt: "海风中的若叶睦", layout: "wide" },
  { src: "./assets/mutsumi-water.png", alt: "水下伸出手的若叶睦", layout: "wide" },
  { src: "./assets/mutsumi-eye.png", alt: "若叶睦的绿色眼眸特写", layout: "square" },
  { src: "./assets/mutsumi-rooftop.png", alt: "天台上的若叶睦", layout: "portrait" },
  { src: "./assets/mutsumi-frame.png", alt: "手持画框微笑的若叶睦", layout: "portrait" },
  { src: "./assets/mutsumi-night.jpg", alt: "夜色与海风中的若叶睦", layout: "wide" },
  { src: "./assets/mutsumi-sketches.jpg", alt: "长发中浮现许多小画面的若叶睦", layout: "portrait" },
  { src: "./assets/mutsumi-greeting.webp", alt: "暮色中挥手的若叶睦", layout: "wide" }
];

const grid = document.querySelector("#galleryGrid");
const viewer = document.querySelector("#imageViewer");
const viewerImage = document.querySelector("#viewerImage");
const viewerCounter = document.querySelector("#viewerCounter");
const thumbnails = document.querySelector("#viewerThumbnails");
const stage = document.querySelector("#viewerStage");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let changeTimer;

document.querySelector("#imageCount").textContent = String(images.length).padStart(2, "0");

grid.innerHTML = images.map((image, index) => `
  <button class="gallery-item is-${image.layout}" type="button" data-index="${index}" aria-label="打开第 ${index + 1} 张图片：${image.alt}">
    <img src="${image.src}" alt="${image.alt}" loading="lazy" decoding="async" />
    <span>FRAME ${String(index + 1).padStart(2, "0")}</span>
  </button>
`).join("");

thumbnails.innerHTML = images.map((image, index) => `
  <button class="viewer-thumb" type="button" data-index="${index}" aria-label="查看第 ${index + 1} 张图片">
    <img src="${image.src}" alt="" loading="lazy" />
  </button>
`).join("");

function updateViewer(index, direction = 1, immediate = false) {
  currentIndex = (index + images.length) % images.length;
  const image = images[currentIndex];
  clearTimeout(changeTimer);

  if (!immediate && !reducedMotion) {
    viewerImage.style.setProperty("--shift", direction > 0 ? "14px" : "-14px");
    viewerImage.classList.add("is-changing");
  }

  const render = () => {
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    viewerCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
    document.querySelectorAll(".viewer-thumb").forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === currentIndex);
      thumb.setAttribute("aria-current", thumbIndex === currentIndex ? "true" : "false");
    });
    const activeThumb = thumbnails.querySelector(`[data-index="${currentIndex}"]`);
    activeThumb?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
    requestAnimationFrame(() => viewerImage.classList.remove("is-changing"));
    [images[(currentIndex + 1) % images.length], images[(currentIndex - 1 + images.length) % images.length]]
      .forEach((nextImage) => { const preload = new Image(); preload.src = nextImage.src; });
  };

  if (immediate || reducedMotion) render();
  else changeTimer = setTimeout(render, 130);
}

function openViewer(index) {
  updateViewer(index, 1, true);
  viewer.showModal();
  document.body.classList.add("viewer-open");
  document.querySelector("#closeViewer").focus({ preventScroll: true });
}

function closeViewer() {
  viewer.close();
  document.body.classList.remove("viewer-open");
  grid.querySelector(`[data-index="${currentIndex}"]`)?.focus({ preventScroll: true });
}

grid.addEventListener("click", (event) => {
  const item = event.target.closest("[data-index]");
  if (item) openViewer(Number(item.dataset.index));
});

thumbnails.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-index]");
  if (thumb) updateViewer(Number(thumb.dataset.index), Number(thumb.dataset.index) >= currentIndex ? 1 : -1);
});

document.querySelector("#closeViewer").addEventListener("click", closeViewer);
document.querySelector("#previousImage").addEventListener("click", () => updateViewer(currentIndex - 1, -1));
document.querySelector("#nextImage").addEventListener("click", () => updateViewer(currentIndex + 1, 1));

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) closeViewer();
});

viewer.addEventListener("close", () => document.body.classList.remove("viewer-open"));

document.addEventListener("keydown", (event) => {
  if (!viewer.open) return;
  if (event.key === "ArrowLeft") updateViewer(currentIndex - 1, -1);
  if (event.key === "ArrowRight") updateViewer(currentIndex + 1, 1);
});

stage.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

stage.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
  updateViewer(currentIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
}, { passive: true });
