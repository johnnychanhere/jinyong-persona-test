import { quizData } from "./quiz-data.js";
import { ACCESS_KEYS } from "./access-keys.js";

const STORAGE_KEYS = {
  access: "jinyongPersonaAccessPassPersistentV1",
  accessKey: "jinyongPersonaAccessKeyPersistentV1",
  deviceId: "jinyongPersonaDeviceIdPersistentV1",
  progress: "jinyongPersonaQuizProgressV1",
  result: "jinyongPersonaLastResultV1",
  preference: "jinyongPersonaGender"
};

const state = {
  authorized: readStorage(STORAGE_KEYS.access) === "ok",
  stage: "entry",
  accessKey: "",
  message: "",
  preference: readStorage(STORAGE_KEYS.preference) || "female",
  questionIndex: 0,
  selectedOptionKey: "",
  scores: createEmptyScores(),
  history: [],
  resultKey: "",
  shareCopied: false,
  isUnlocking: false,
  posterPreviewUrl: "",
  posterFileName: "",
  posterHint: ""
};

restoreFromUrlOrStorage();
render();

function createEmptyScores() {
  return Object.fromEntries(quizData.meta.dimensionOrder.map((key) => [key, 0]));
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

function createDeviceId() {
  try {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
  } catch {
    // Ignore and fall back.
  }
  return `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getPersistentDeviceId() {
  const saved = readStorage(STORAGE_KEYS.deviceId);
  if (saved) return saved;
  const nextId = createDeviceId();
  writeStorage(STORAGE_KEYS.deviceId, nextId);
  return nextId;
}

function parseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeAccessKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("_", "-")
    .replace(/\s+/g, "");
}

function sanitizeScores(input) {
  const scores = createEmptyScores();
  for (const key of quizData.meta.dimensionOrder) {
    scores[key] = Number(input?.[key] || 0);
  }
  return scores;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function encodeScores(scores) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(scores))));
}

function decodeScores(raw) {
  if (!raw) return null;
  try {
    const value = decodeURIComponent(escape(atob(raw)));
    return sanitizeScores(JSON.parse(value));
  } catch {
    return null;
  }
}

function readResultFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const scores = decodeScores(params.get("r"));
  if (!scores) return null;
  return {
    scores,
    preference: params.get("g") || "female"
  };
}

function syncResultToUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set("r", encodeScores(state.scores));
  params.set("g", state.preference);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
}

function clearUrlSearch() {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url.toString());
}

function restoreFromUrlOrStorage() {
  const urlState = readResultFromUrl();
  if (urlState) {
    state.authorized = true;
    state.stage = "result";
    state.preference = urlState.preference;
    state.scores = urlState.scores;
    state.resultKey = computeResultKey(state.scores);
    writeStorage(STORAGE_KEYS.access, "ok");
    writeStorage(
      STORAGE_KEYS.result,
      JSON.stringify({
        stage: "result",
        scores: state.scores,
        preference: state.preference
      })
    );
    return;
  }

  const savedResult = parseJson(readStorage(STORAGE_KEYS.result));
  if (savedResult?.stage === "result" && savedResult.scores) {
    state.authorized = true;
    state.stage = "result";
    state.preference = savedResult.preference || state.preference;
    state.scores = sanitizeScores(savedResult.scores);
    state.resultKey = computeResultKey(state.scores);
    return;
  }

  const savedProgress = parseJson(readStorage(STORAGE_KEYS.progress));
  if (savedProgress?.stage === "quiz") {
    state.authorized = true;
    state.stage = "quiz";
    state.preference = savedProgress.preference || state.preference;
    state.questionIndex = clamp(savedProgress.index, 0, quizData.questions.length - 1);
    state.scores = sanitizeScores(savedProgress.scores);
    state.history = Array.isArray(savedProgress.history) ? savedProgress.history : [];
    return;
  }

  state.stage = state.authorized ? "preference" : "entry";
}

function persistProgress() {
  if (state.stage !== "quiz") {
    removeStorage(STORAGE_KEYS.progress);
    return;
  }

  writeStorage(
    STORAGE_KEYS.progress,
    JSON.stringify({
      stage: "quiz",
      index: state.questionIndex,
      scores: state.scores,
      history: state.history,
      preference: state.preference
    })
  );
}

function saveResult() {
  writeStorage(
    STORAGE_KEYS.result,
    JSON.stringify({
      stage: "result",
      scores: state.scores,
      preference: state.preference
    })
  );
  removeStorage(STORAGE_KEYS.progress);
  syncResultToUrl();
}

function computeResultKey(scores) {
  return [...quizData.meta.resultOrder].sort((left, right) => {
    const diff = (scores[right] || 0) - (scores[left] || 0);
    if (diff !== 0) return diff;
    return (
      quizData.meta.recommendedTieBreakOrder.indexOf(left) -
      quizData.meta.recommendedTieBreakOrder.indexOf(right)
    );
  })[0];
}

function getRankedResults(scores) {
  return [...quizData.meta.resultOrder].sort((left, right) => {
    const diff = (scores[right] || 0) - (scores[left] || 0);
    if (diff !== 0) return diff;
    return (
      quizData.meta.recommendedTieBreakOrder.indexOf(left) -
      quizData.meta.recommendedTieBreakOrder.indexOf(right)
    );
  });
}

function getFigureName(resultProfile, preference, totalScore) {
  const bucket =
    preference === "male"
      ? resultProfile.sampleFigures.male
      : preference === "female"
        ? resultProfile.sampleFigures.female
        : [...resultProfile.sampleFigures.female, ...resultProfile.sampleFigures.male];
  return bucket[totalScore % bucket.length];
}

function getTotalScore(scores) {
  return Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0);
}

function getShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("r", encodeScores(state.scores));
  url.searchParams.set("g", state.preference);
  return url.toString();
}

function percentageFromComposite(value) {
  const normalized = Math.max(0, Math.min(1, value / 72));
  return Math.round(38 + normalized * 60);
}

function getAbilityMetrics(scores) {
  return [
    {
      label: "边界感",
      percent: percentageFromComposite(scores.F * 0.55 + scores.C * 0.2 + scores.E * 0.25)
    },
    {
      label: "判断力",
      percent: percentageFromComposite(scores.H * 0.58 + scores.A * 0.2 + scores.G * 0.22)
    },
    {
      label: "行动力",
      percent: percentageFromComposite(scores.D * 0.62 + scores.A * 0.23 + scores.G * 0.15)
    },
    {
      label: "关系感知",
      percent: percentageFromComposite(scores.B * 0.58 + scores.G * 0.24 + scores.E * 0.18)
    },
    {
      label: "稳定性",
      percent: percentageFromComposite(scores.E * 0.42 + scores.F * 0.28 + scores.A * 0.3)
    }
  ];
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const chars = [...String(text || "")];
  let line = "";
  let currentY = y;

  for (const char of chars) {
    const testLine = line + char;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    context.fillText(line, x, currentY);
  }

  return currentY;
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
}

function isWeChatBrowser() {
  return /MicroMessenger/i.test(window.navigator.userAgent);
}

function revokePosterPreviewUrl() {
  if (state.posterPreviewUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(state.posterPreviewUrl);
  }
}

function clearPosterPreview() {
  revokePosterPreviewUrl();
  state.posterPreviewUrl = "";
  state.posterFileName = "";
  state.posterHint = "";
}

function openPosterPreview(url, fileName, hint) {
  clearPosterPreview();
  state.posterPreviewUrl = url;
  state.posterFileName = fileName;
  state.posterHint = hint;
  render({ animate: false });
}

function openPosterInCurrentTab(url) {
  window.location.href = url;
}

function triggerPosterDownload(url, fileName) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    if (!canvas.toBlob) {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error("Poster blob generation failed"));
    }, "image/png");
  });
}

async function savePoster() {
  const resultKey = state.resultKey || computeResultKey(state.scores);
  const resultProfile = quizData.resultProfiles[resultKey];
  const figureName = getFigureName(resultProfile, state.preference, getTotalScore(state.scores));
  const metrics = getAbilityMetrics(state.scores);

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1420;
  const context = canvas.getContext("2d");

  context.fillStyle = "#efe3cf";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#fffaf2");
  gradient.addColorStop(1, "#f0e2cb");
  context.fillStyle = gradient;
  context.fillRect(40, 40, 1000, 1340);

  context.fillStyle = "#8e6b3d";
  context.font = "600 28px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText("Jin Yong Persona Archive", 100, 120);

  context.fillStyle = "#201c18";
  context.font = "700 66px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText(resultProfile.title, 100, 210);

  context.fillStyle = "rgba(32, 28, 24, 0.72)";
  context.font = "400 34px 'Noto Serif SC', 'Songti SC', serif";
  wrapCanvasText(context, resultProfile.subtitle, 100, 270, 880, 52);

  context.fillStyle = "#f9f1e3";
  context.fillRect(100, 360, 880, 228);
  context.strokeStyle = "rgba(32, 28, 24, 0.08)";
  context.strokeRect(100, 360, 880, 228);

  context.fillStyle = "#8e6b3d";
  context.font = "600 24px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText("映射人物", 134, 406);
  context.fillStyle = "#201c18";
  context.font = "700 54px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText(figureName, 134, 478);
  context.fillStyle = "rgba(32, 28, 24, 0.74)";
  context.font = "400 26px 'Noto Serif SC', 'Songti SC', serif";
  wrapCanvasText(context, resultProfile.summary, 134, 530, 812, 42);

  context.fillStyle = "#201c18";
  context.font = "700 36px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText("核心能力百分比", 100, 660);

  metrics.forEach((metric, index) => {
    const top = 720 + index * 90;
    context.fillStyle = "rgba(32, 28, 24, 0.78)";
    context.font = "500 28px 'Noto Serif SC', 'Songti SC', serif";
    context.fillText(metric.label, 100, top);
    context.fillText(`${metric.percent}%`, 910, top);
    context.fillStyle = "rgba(32, 28, 24, 0.1)";
    context.fillRect(100, top + 24, 840, 20);
    context.fillStyle = "#9a7342";
    context.fillRect(100, top + 24, Math.round((metric.percent / 100) * 840), 20);
  });

  context.fillStyle = "#201c18";
  context.font = "700 36px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText("行动建议", 100, 1210);

  context.fillStyle = "rgba(32, 28, 24, 0.8)";
  context.font = "400 28px 'Noto Serif SC', 'Songti SC', serif";
  let suggestionY = 1270;
  resultProfile.advice.forEach((item) => {
    context.fillText(`• ${item}`, 118, suggestionY);
    suggestionY += 46;
  });

  const fileName = `金庸人格测试海报-${figureName}.png`;
  const blob = await canvasToBlob(canvas);
  const posterUrl = blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/png");
  const mobileHint = isWeChatBrowser()
    ? "请长按海报图片，然后选择“保存图片”。"
    : "请长按海报图片，保存到手机相册。";

  if (isMobileDevice() || isWeChatBrowser()) {
    openPosterPreview(posterUrl, fileName, mobileHint);
    return;
  }

  triggerPosterDownload(posterUrl, fileName);
  if (blob) {
    openPosterPreview(posterUrl, fileName, "海报已生成，也可在预览中再次下载。");
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function render({ animate = true } = {}) {
  const app = document.querySelector("#app");
  app.innerHTML = renderScreen({ animate });
  bindEvents();
}

function renderScreen({ animate }) {
  const screenClass = animate ? "screen screen-animated" : "screen";
  const mainScreen =
    state.stage === "entry"
      ? renderEntry()
      : state.stage === "preference"
        ? renderPreference()
        : state.stage === "quiz"
          ? renderQuiz()
          : state.stage === "result"
            ? renderResult()
            : `<section class="screen"><div class="panel empty-state"><p class="eyebrow">Archive Lost</p><h1 class="section-title">页面状态未找到</h1></div></section>`;

  const mainMarkup = mainScreen.replace('class="screen"', `class="${screenClass}"`);
  return `${mainMarkup}${renderPosterPreview()}`;
}

function renderPosterPreview() {
  if (!state.posterPreviewUrl) return "";

  return `
    <section class="poster-modal" aria-label="海报预览">
      <div class="poster-backdrop" data-close-poster="1"></div>
      <div class="poster-card">
        <button class="poster-close" type="button" data-close-poster="1" aria-label="关闭海报预览">×</button>
        <p class="eyebrow">Poster Preview</p>
        <h3 class="poster-title">海报已生成</h3>
        <p class="poster-hint">${escapeHtml(state.posterHint || "长按图片保存。")}</p>
        <img class="poster-image" src="${escapeHtml(state.posterPreviewUrl)}" alt="测试结果海报预览" />
        <div class="poster-actions">
          <button class="secondary-btn poster-link" type="button" data-open-poster="1">打开图片</button>
          <button class="ghost-btn" type="button" data-close-poster="1">我知道了</button>
        </div>
      </div>
    </section>
  `;
}

function renderEntry() {
  return `
    <section class="screen">
      <div class="panel entry-layout">
        <div>
          <p class="eyebrow">Jin Yong Persona Archive</p>
          <h1 class="title">你最像金庸江湖里哪位大侠/女侠？</h1>
          <p class="lead">24 道情境题，快速映射你的决断风格、情绪处理方式和处世倾向。答完即可得到你的江湖人格档案与映射人物。</p>
          <div class="footer-meta">纯前端版 ｜ 口令解锁 ｜ 可重复使用</div>
        </div>
        <div class="stack">
          <div>
            <p class="eyebrow">Access Gate</p>
            <p class="muted">请输入口令验证后开始测试。口令长期有效，可重复使用；验证成功后会在本设备记住解锁状态。</p>
          </div>
          <div class="input-wrap">
            <input
              class="text-input"
              id="access-key-input"
              type="text"
              value="${escapeHtml(state.accessKey)}"
              placeholder="请输入购买后获得的口令"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="primary-btn" id="unlock-btn" ${state.isUnlocking ? "disabled" : ""}>
              ${state.isUnlocking ? "验证中..." : "验证并开始测试"}
            </button>
            <p class="message">${escapeHtml(state.message)}</p>
          </div>
          <div class="stat-card">
            <h4>使用说明</h4>
            <ul class="stat-list">
              <li>购买后获得口令，输入即可开始测试。</li>
              <li>同一设备验证一次后，刷新页面仍可继续。</li>
              <li>结果可生成海报、复制分享链接。</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderPreference() {
  return `
    <section class="screen">
      <div class="panel">
        <p class="eyebrow">第一步 · 江湖映射偏好</p>
        <h2 class="section-title">选择你更有代入感的人物方向</h2>
        <p class="lead">这一步只影响结果页优先展示的人物名字，不影响答题内容和分数计算。</p>
        <div class="pref-grid" style="margin-top: 28px;">
          ${renderPreferenceCard("female", "女侠优先", "优先匹配金庸女侠人物")}
          ${renderPreferenceCard("male", "大侠优先", "优先匹配金庸大侠人物")}
          ${renderPreferenceCard("all", "随机匹配（我无所谓）", "不限制人物性别，按结果动态展示")}
        </div>
      </div>
    </section>
  `;
}

function renderPreferenceCard(key, title, desc) {
  const active = state.preference === key;
  return `
    <button class="pref-card${active ? " option-active" : ""}" data-preference="${key}">
      <p class="pref-card-title">${escapeHtml(title)}</p>
      <p class="pref-card-desc">${escapeHtml(desc)}</p>
    </button>
  `;
}

function renderQuiz() {
  const question = quizData.questions[state.questionIndex];
  const progress = ((state.questionIndex + 1) / quizData.questions.length) * 100;
  return `
    <section class="screen">
      <div class="progress-card">
        <div class="progress-meta">
          <span>江湖进度</span>
          <span>${state.questionIndex + 1}/${quizData.questions.length}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>
      </div>
      <div class="panel question-card">
        <div class="question-tag-row">
          <p class="question-tag">今日脑洞</p>
          <span class="scene-chip">Scene Card</span>
        </div>
        <p class="question-text">${escapeHtml(question.text)}</p>
        <div class="option-grid" style="margin-top: 22px;">
          ${question.options
            .map((option) => {
              const active = state.selectedOptionKey === option.key;
              return `
                <button class="option-card${active ? " option-active option-locked" : ""}" data-option="${option.key}">
                  <span class="option-key">${escapeHtml(option.key)}</span>
                  <p class="option-text">${escapeHtml(option.text)}</p>
                </button>
              `;
            })
            .join("")}
        </div>
        <div class="question-actions">
          <button class="ghost-btn" id="back-btn" ${state.history.length ? "" : "disabled"}>
            上一题
          </button>
          <p class="chip-note">${state.selectedOptionKey ? "这一题已记录，继续往下看你的反应风格。" : "每题只需选一个最贴近你的反应。"}</p>
        </div>
      </div>
    </section>
  `;
}

function renderResult() {
  const ranked = getRankedResults(state.scores);
  const resultKey = state.resultKey || computeResultKey(state.scores);
  const resultProfile = quizData.resultProfiles[resultKey];
  const figureName = getFigureName(resultProfile, state.preference, getTotalScore(state.scores));
  const secondary = ranked[1];
  const tertiary = ranked[2];
  const shareUrl = getShareUrl();
  const metrics = getAbilityMetrics(state.scores);
  return `
    <section class="screen">
      <div class="panel">
        <div class="result-top-grid">
          <div class="result-hero">
            <span class="result-badge">结果归档</span>
            <h1 class="result-headline">${escapeHtml(resultProfile.title)}</h1>
            <p class="result-subline">${escapeHtml(resultProfile.subtitle)}</p>
            <p class="lead" style="margin-top: 0;">${escapeHtml(resultProfile.summary)}</p>
            <div class="result-meta-row">
              <span class="mini-chip">主维度：${escapeHtml(quizData.dimensions[resultKey].name)}</span>
              <span class="mini-chip">次维度：${escapeHtml(quizData.dimensions[secondary].name)}</span>
              <span class="mini-chip">第三维度：${escapeHtml(quizData.dimensions[tertiary].name)}</span>
            </div>
          </div>
          <div class="hero-figure">
            <p class="hero-figure-label">映射人物</p>
            <h2 class="hero-figure-name">${escapeHtml(figureName)}</h2>
            <p class="hero-figure-caption">这是一种展示型映射，用来让结果页更有代入感。真正决定结果的是你的维度分布，而不是单一人物标签。</p>
          </div>
        </div>

        <div class="result-grid" style="margin-top: 22px;">
          <div class="result-card result-card-wide">
            <h3>核心能力百分比</h3>
            <div class="result-body metric-grid">
              ${metrics
                .map(
                  (metric) => `
                    <div class="metric-card">
                      <div class="metric-head">
                        <span>${escapeHtml(metric.label)}</span>
                        <strong>${metric.percent}%</strong>
                      </div>
                      <div class="metric-track">
                        <div class="metric-fill" style="width: ${metric.percent}%;"></div>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="result-card">
            <h3>人物画像</h3>
            <div class="result-body portrait-body">
              <p class="portrait-title">${escapeHtml(resultProfile.title)}</p>
              <p class="portrait-sub">${escapeHtml(resultProfile.subtitle)}</p>
              <p>${escapeHtml(resultProfile.summary)}</p>
              <p class="portrait-dim">主维度「${escapeHtml(quizData.dimensions[resultKey].name)}」：${escapeHtml(quizData.dimensions[resultKey].description)}</p>
              <p class="portrait-dim">次维度「${escapeHtml(quizData.dimensions[secondary].name)}」：${escapeHtml(quizData.dimensions[secondary].tagline)}</p>
              <p class="portrait-map">映射人物更接近：${escapeHtml(figureName)}。同类还有 ${escapeHtml(
                (state.preference === "male"
                  ? resultProfile.sampleFigures.male
                  : state.preference === "female"
                    ? resultProfile.sampleFigures.female
                    : [...resultProfile.sampleFigures.female, ...resultProfile.sampleFigures.male]
                ).filter((name) => name !== figureName).slice(0, 3).join("、")
              )}。</p>
            </div>
          </div>
          <div class="result-card">
            <h3>能力结构</h3>
            <div class="result-body scoreboard">
              ${quizData.meta.dimensionOrder
                .map((key) => {
                  const maxScore = Math.max(...Object.values(state.scores), 1);
                  const percent = ((state.scores[key] || 0) / maxScore) * 100;
                  return `
                    <div class="score-row">
                      <div class="score-row-head">
                        <span>${escapeHtml(quizData.dimensions[key].name)}</span>
                        <span>${state.scores[key] || 0}</span>
                      </div>
                      <div class="score-track">
                        <div class="score-fill" style="width: ${percent}%;"></div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
          <div class="result-card">
            <h3>现实表现</h3>
            <div class="result-body">
              <ul class="list-block">
                ${resultProfile.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="result-card">
            <h3>当前风险</h3>
            <div class="result-body">
              <ul class="list-block">
                ${resultProfile.risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="result-card">
            <h3>行动建议</h3>
            <div class="result-body">
              <ul class="list-block">
                ${resultProfile.advice.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="result-card">
            <h3>同类人物池</h3>
            <div class="result-body">
              <p>大侠人物：${escapeHtml(resultProfile.sampleFigures.male.join("、"))}</p>
              <p style="margin-top: 10px;">女侠人物：${escapeHtml(resultProfile.sampleFigures.female.join("、"))}</p>
            </div>
          </div>
        </div>

        <div class="action-row">
          <button class="primary-btn" id="restart-btn">重新测试</button>
          <button class="secondary-btn" id="save-poster-btn">保存海报</button>
          <button class="secondary-btn" id="copy-link-btn">复制结果链接</button>
          <button class="secondary-btn" id="copy-summary-btn">复制结果文案</button>
        </div>

        <div class="share-box" style="margin-top: 18px;">
          ${state.shareCopied ? '<p class="copy-success" style="margin-top: 0;">已复制到剪贴板。</p>' : ""}
          <strong>分享链接：</strong><br />
          ${escapeHtml(shareUrl)}
        </div>
      </div>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-close-poster]").forEach((node) => {
    node.addEventListener("click", () => {
      clearPosterPreview();
      render({ animate: false });
    });
  });

  document.querySelectorAll("[data-open-poster]").forEach((node) => {
    node.addEventListener("click", () => {
      if (!state.posterPreviewUrl) return;
      openPosterInCurrentTab(state.posterPreviewUrl);
    });
  });

  if (state.stage === "entry") {
    const input = document.querySelector("#access-key-input");
    input?.addEventListener("input", (event) => {
      state.accessKey = event.target.value.toUpperCase();
    });
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !state.isUnlocking) {
        unlock();
      }
    });
    document.querySelector("#unlock-btn")?.addEventListener("click", unlock);
    return;
  }

  if (state.stage === "preference") {
    document.querySelectorAll("[data-preference]").forEach((button) => {
      button.addEventListener("click", () => {
        const preference = button.getAttribute("data-preference");
        state.preference = preference;
        writeStorage(STORAGE_KEYS.preference, preference);
        state.stage = "quiz";
        state.questionIndex = 0;
        state.selectedOptionKey = "";
        state.scores = createEmptyScores();
        state.history = [];
        state.shareCopied = false;
        removeStorage(STORAGE_KEYS.result);
        persistProgress();
        render();
      });
    });
    return;
  }

  if (state.stage === "quiz") {
    document.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.selectedOptionKey) return;
        const key = button.getAttribute("data-option");
        const question = quizData.questions[state.questionIndex];
        const option = question.options.find((item) => item.key === key);
        if (!option) return;

        state.selectedOptionKey = option.key;
        state.history.push({
          index: state.questionIndex,
          scores: { ...state.scores }
        });
        for (const [scoreKey, scoreValue] of Object.entries(option.scores)) {
          state.scores[scoreKey] += scoreValue;
        }
        persistProgress();

        button.classList.add("option-active", "option-locked");
        document.querySelectorAll("[data-option]").forEach((item) => {
          item.classList.add("option-locked");
        });
        const note = document.querySelector(".chip-note");
        if (note) {
          note.textContent = "这一题已记录，继续往下看你的反应风格。";
        }

        window.setTimeout(() => {
          if (state.questionIndex === quizData.questions.length - 1) {
            state.resultKey = computeResultKey(state.scores);
            state.stage = "result";
            state.selectedOptionKey = "";
            state.shareCopied = false;
            saveResult();
            render();
            return;
          }

          state.questionIndex += 1;
          state.selectedOptionKey = "";
          persistProgress();
          render({ animate: false });
        }, 180);
      });
    });

    document.querySelector("#back-btn")?.addEventListener("click", () => {
      if (!state.history.length) return;
      const previous = state.history.pop();
      state.questionIndex = previous.index;
      state.scores = sanitizeScores(previous.scores);
      state.selectedOptionKey = "";
      persistProgress();
      render({ animate: false });
    });
    return;
  }

  if (state.stage === "result") {
    document.querySelector("#restart-btn")?.addEventListener("click", () => {
      const keepPreference = state.preference;
      const keepAccessKey = state.accessKey || readStorage(STORAGE_KEYS.accessKey) || "";
      clearPosterPreview();
      state.authorized = Boolean(readStorage(STORAGE_KEYS.access) === "ok");
      state.stage = state.authorized ? "preference" : "entry";
      state.preference = keepPreference;
      state.questionIndex = 0;
      state.selectedOptionKey = "";
      state.accessKey = keepAccessKey;
      state.message = "";
      state.scores = createEmptyScores();
      state.history = [];
      state.resultKey = "";
      state.shareCopied = false;
      removeStorage(STORAGE_KEYS.result);
      removeStorage(STORAGE_KEYS.progress);
      clearUrlSearch();
      render();
    });

    document.querySelector("#save-poster-btn")?.addEventListener("click", async () => {
      try {
        await savePoster();
      } catch {
        window.alert("海报生成失败，请稍后重试。");
      }
    });

    document.querySelector("#copy-link-btn")?.addEventListener("click", async () => {
      const success = await copyToClipboard(getShareUrl());
      state.shareCopied = success;
      render({ animate: false });
    });

    document.querySelector("#copy-summary-btn")?.addEventListener("click", async () => {
      const resultKey = state.resultKey || computeResultKey(state.scores);
      const resultProfile = quizData.resultProfiles[resultKey];
      const text = [
        `我的结果：${resultProfile.title}`,
        resultProfile.subtitle,
        `优势：${resultProfile.strengths.join("、")}`,
        `提醒：${resultProfile.risks.join("、")}`,
        `建议：${resultProfile.advice.join("、")}`,
        `链接：${getShareUrl()}`
      ].join("\n");
      const success = await copyToClipboard(text);
      state.shareCopied = success;
      render({ animate: false });
    });
  }
}

async function unlock() {
  const normalized = normalizeAccessKey(state.accessKey);
  if (!normalized) {
    state.message = "请输入口令。";
    render({ animate: false });
    return;
  }

  state.accessKey = normalized;
  state.isUnlocking = true;
  state.message = "";
  render({ animate: false });

  try {
    getPersistentDeviceId();
    const validKeys = ACCESS_KEYS.map(normalizeAccessKey);
    if (!validKeys.includes(normalized)) {
      throw new Error("口令无效，请检查后重试。");
    }

    state.authorized = true;
    state.stage = "preference";
    state.message = "";
    writeStorage(STORAGE_KEYS.access, "ok");
    writeStorage(STORAGE_KEYS.accessKey, normalized);
  } catch (error) {
    state.message = error instanceof Error ? error.message : "验证失败，请重试。";
  } finally {
    state.isUnlocking = false;
    render();
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    textarea.remove();
    return success;
  }
}
