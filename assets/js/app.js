const DATA_URL = "data/library.json";

const categoryMeta = {
  Programming: { label: "编程开发", subtitle: "React · JavaScript · Python", icon: "⌘", color: "purple" },
  Technology: { label: "技术资料", subtitle: "计算机 · 网络 · 工具", icon: "⌁", color: "blue" },
  Books: { label: "书籍阅读", subtitle: "电子书 · 阅读收藏", icon: "▤", color: "orange" },
  Miscellaneous: { label: "其他收藏", subtitle: "灵感 · 参考 · 其他", icon: "✧", color: "green" }
};

const categoryColors = {
  purple: { bg: "#f0efff", fg: "#8177db" },
  blue: { bg: "#edf4ff", fg: "#7295d8" },
  orange: { bg: "#fff3e9", fg: "#df9a62" },
  green: { bg: "#eaf8f2", fg: "#62b995" }
};

let resources = [];
let activeCategory = "all";
let activeTag = "";
let searchTerm = "";
let activeType = "all";

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function formatDate(dateString) {
  if (!dateString) return "日期未注明";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function getCategoryInfo(category) {
  return categoryMeta[category] || { label: category, subtitle: "更多收藏", icon: "◇", color: "purple" };
}

function getCategories() {
  return [...new Set(resources.map(item => item.category).filter(Boolean))];
}

function renderStats() {
  $("#allCount").textContent = resources.length;
  $("#totalStat").textContent = resources.length;
  $("#categoryStat").textContent = getCategories().length;
  $("#pdfStat").textContent = resources.filter(item => item.type === "pdf").length;
  const newest = [...resources].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  $("#updatedStat").textContent = newest?.date ? formatDate(newest.date) : "—";
  $("#year").textContent = new Date().getFullYear();
}

function renderCategoryNav() {
  const counts = {};
  resources.forEach(item => counts[item.category] = (counts[item.category] || 0) + 1);
  $("#categoryNav").innerHTML = getCategories().map(category => {
    const info = getCategoryInfo(category);
    return `<button class="nav-item ${activeCategory === category ? "active" : ""}" data-category="${escapeHTML(category)}">
      <span class="nav-icon">${info.icon}</span><span>${escapeHTML(info.label)}</span><span class="nav-count">${counts[category]}</span>
    </button>`;
  }).join("");
}

function renderCategoryCards() {
  const counts = {};
  resources.forEach(item => counts[item.category] = (counts[item.category] || 0) + 1);
  $("#categoryCards").innerHTML = getCategories().map(category => {
    const info = getCategoryInfo(category);
    const color = categoryColors[info.color] || categoryColors.purple;
    return `<button class="category-card ${activeCategory === category ? "selected" : ""}" data-category="${escapeHTML(category)}">
      <span class="category-count">${counts[category]} ITEMS</span>
      <span class="category-icon" style="background:${color.bg};color:${color.fg}">${info.icon}</span>
      <strong>${escapeHTML(info.label)}</strong><small>${escapeHTML(info.subtitle)}</small>
    </button>`;
  }).join("");
}

function matchesSearch(item) {
  if (!searchTerm) return true;
  const haystack = [item.title, item.description, item.category, ...(item.tags || [])].join(" ").toLocaleLowerCase();
  return haystack.includes(searchTerm.toLocaleLowerCase());
}

function getFilteredResources() {
  let result = resources.filter(item =>
    (activeCategory === "all" || item.category === activeCategory) &&
    (!activeTag || (item.tags || []).includes(activeTag)) &&
    (activeType === "all" || item.type === activeType) &&
    matchesSearch(item)
  );
  const sort = $("#sortSelect").value;
  if (sort === "newest") result.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (sort === "oldest") result.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  return result;
}

function resourceCard(item) {
  const icon = item.type === "pdf" ? "▧" : item.type === "html" ? "⌘" : "↗";
  const typeLabel = item.type === "pdf" ? "PDF DOCUMENT" : item.type === "html" ? "WEB NOTE" : "EXTERNAL LINK";
  const tags = (item.tags || []).map(tag => `<button class="tag" data-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`).join("");
  const href = escapeHTML(item.file || "#");
  const action = item.type === "link" ? "打开链接 ↗" : item.type === "pdf" ? "在线阅读 ↗" : "阅读笔记 ↗";
  const target = item.type === "link" ? 'target="_blank" rel="noopener noreferrer"' : 'target="_blank"';
  return `<article class="resource-card">
    <div class="resource-top"><span class="file-icon ${escapeHTML(item.type)}">${icon}</span><span class="file-type">${typeLabel}</span></div>
    <h3>${escapeHTML(item.title)}</h3>
    <p class="resource-description">${escapeHTML(item.description || "暂无描述。")}</p>
    <div class="tag-list">${tags}</div>
    <div class="resource-bottom"><span>${escapeHTML(formatDate(item.date))}</span><a class="resource-action" href="${href}" ${target}>${action}</a></div>
  </article>`;
}

function renderResources() {
  const result = getFilteredResources();
  $("#resourceGrid").innerHTML = result.map(resourceCard).join("");
  $("#resourceGrid").hidden = result.length === 0;
  $("#emptyState").hidden = result.length !== 0;
  $("#resultCount").textContent = `${result.length} 项资料`;
  $("#clearFilters").hidden = !(searchTerm || activeCategory !== "all" || activeTag || activeType !== "all");
  $("#listHeading").textContent = activeCategory === "all" ? "全部资料" : getCategoryInfo(activeCategory).label;
  $("#currentLocation").textContent = activeCategory === "all" ? "全部资料" : getCategoryInfo(activeCategory).label;
  $("#listDescription").textContent = activeTag ? `标签：${activeTag}` : activeCategory === "all" ? "浏览所有收藏的文档与笔记。" : `浏览「${getCategoryInfo(activeCategory).label}」分类下的资料。`;
  const chips = [];
  if (activeCategory !== "all") chips.push(`<span class="filter-chip">${escapeHTML(getCategoryInfo(activeCategory).label)}</span>`);
  if (activeTag) chips.push(`<span class="filter-chip"># ${escapeHTML(activeTag)}</span>`);
  if (searchTerm) chips.push(`<span class="filter-chip">搜索：${escapeHTML(searchTerm)}</span>`);
  $("#activeFilters").innerHTML = chips.join("");
  $("#activeFilters").hidden = chips.length === 0;
  renderCategoryNav();
  renderCategoryCards();
}

function resetFilters() {
  activeCategory = "all";
  activeTag = "";
  searchTerm = "";
  activeType = "all";
  $("#searchInput").value = "";
  $("#typeFilter").value = "all";
  renderResources();
}

function handleCategoryClick(event) {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  activeTag = "";
  renderResources();
  $("#librarySection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  const toggle = $("#themeToggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
    toggle.title = isDark ? "切换浅色模式" : "切换深色模式";
    toggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
    toggle.querySelector(".theme-toggle-label").textContent = isDark ? "浅色模式" : "深色模式";
  }
  const themeMeta = $("#themeColorMeta");
  if (themeMeta) themeMeta.content = isDark ? "#171923" : "#f6f7fb";
  if (persist) localStorage.setItem("my-library-theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("my-library-theme");
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  applyTheme(savedTheme || (media && media.matches ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  });
  if (media) {
    const updateFromSystem = event => {
      if (!localStorage.getItem("my-library-theme")) applyTheme(event.matches ? "dark" : "light");
    };
    if (media.addEventListener) media.addEventListener("change", updateFromSystem);
    else if (media.addListener) media.addListener(updateFromSystem);
  }
}

function initEvents() {
  document.addEventListener("click", event => {
    if (event.target.closest("[data-category]")) handleCategoryClick(event);
    const tagButton = event.target.closest("[data-tag]");
    if (tagButton) {
      activeTag = tagButton.dataset.tag;
      renderResources();
      $("#librarySection").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  $("#searchInput").addEventListener("input", event => {
    searchTerm = event.target.value.trim();
    renderResources();
  });
  $("#typeFilter").addEventListener("change", event => {
    activeType = event.target.value;
    renderResources();
  });
  $("#sortSelect").addEventListener("change", renderResources);
  $("#clearFilters").addEventListener("click", resetFilters);
  $("#resetSearch").addEventListener("click", resetFilters);
  $("#showAllCategories").addEventListener("click", () => {
    activeCategory = "all";
    renderResources();
    $("#librarySection").scrollIntoView({ behavior: "smooth" });
  });
  $("#mobileMenu").addEventListener("click", () => {
    $("#sidebar").classList.add("open");
    $("#sidebarOverlay").classList.add("show");
  });
  $("#sidebarOverlay").addEventListener("click", () => {
    $("#sidebar").classList.remove("open");
    $("#sidebarOverlay").classList.remove("show");
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#searchInput").focus();
    }
    if (event.key === "Escape") $("#searchInput").blur();
  });
}

async function init() {
  initTheme();
  initEvents();
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    resources = Array.isArray(data) ? data : [];
    renderStats();
    renderResources();
  } catch (error) {
    console.error("无法加载资料目录：", error);
    $("#resourceGrid").hidden = true;
    $("#emptyState").hidden = false;
    $("#emptyState").innerHTML = `<div class="empty-icon">!</div><h3>资料目录加载失败</h3><p>请确认 data/library.json 文件存在，并通过网站服务器访问本页面。</p>`;
  }
}

init();
