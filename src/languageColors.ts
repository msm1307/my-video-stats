/**
 * 언어 이름 → 고정 브랜드 색 (GitHub / 공식 스타일에 가깝게).
 * 나중에 API 데이터만 넣을 때는 `name`만 맞추면 `resolveLanguageColor`가 여기서 매칭합니다.
 * `props.color`를 넘기면 유효한 hex일 때만 그 값으로 덮어씁니다.
 */

const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  tsx: "typescript",
  "c++": "cpp",
  cpp: "cpp",
  "c#": "csharp",
  cs: "csharp",
  csharp: "csharp",
  py: "python",
  rb: "ruby",
  rs: "rust",
  golang: "go",
  kt: "kotlin",
  kts: "kotlin",
  swiftlang: "swift",
  objc: "objective-c",
  "objective c": "objective-c",
  fs: "fsharp",
  "f#": "fsharp",
  sh: "shell",
  zsh: "shell",
  bash: "shell",
  ps1: "powershell",
  vuejs: "vue",
  wasm: "webassembly",
  ziglang: "zig",
};

/** 키는 소문자·하이픈 기준으로 통일 */
export const LANGUAGE_BRAND_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f7df1e",
  python: "#3572A5",
  rust: "#dea584",
  go: "#00ADD8",
  java: "#b07219",
  kotlin: "#A97BFF",
  swift: "#F05138",
  ruby: "#701516",
  php: "#4F5D95",
  c: "#555555",
  cpp: "#f34b7d",
  csharp: "#178600",
  css: "#663399",
  html: "#e34c26",
  shell: "#89e051",
  powershell: "#012456",
  dart: "#00B4AB",
  vue: "#41b883",
  svelte: "#ff3e00",
  react: "#61dafb",
  elixir: "#6e4a7e",
  haskell: "#5e5086",
  scala: "#c22d40",
  clojure: "#db5855",
  erlang: "#A90533",
  lua: "#000080",
  perl: "#39457e",
  r: "#198CE7",
  matlab: "#e16737",
  solidity: "#AA6746",
  zig: "#ec915c",
  nim: "#ffc200",
  crystal: "#000100",
  julia: "#a270ba",
  ocaml: "#ef7a08",
  fsharp: "#378BBA",
  "objective-c": "#438eff",
  groovy: "#4298b8",
  terraform: "#7b42bc",
  dockerfile: "#384d54",
  makefile: "#427819",
  webassembly: "#654ff0",
  markdown: "#083fa1",
  yaml: "#cb171e",
  json: "#292929",
  graphql: "#e10098",
  sql: "#e38c00",
  swiftui: "#F05138",
  astro: "#ff5a03",
  kotlinandroid: "#A97BFF",
};

const FALLBACK_ACCENT = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function normalizeLanguageKey(raw: string): string {
  const t = raw.trim().toLowerCase().replace(/\s+/g, " ");
  const collapsed = t.replace(/ /g, "-");
  return ALIASES[collapsed] ?? ALIASES[t] ?? collapsed;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** `override`가 `#RRGGBB` 형태면 우선 사용, 아니면 맵 → 없으면 안정적인 fallback 팔레트 */
export function resolveLanguageColor(
  displayName: string,
  override?: string,
): string {
  const o = override?.trim();
  if (o && HEX.test(o)) {
    return o;
  }
  const key = normalizeLanguageKey(displayName);
  if (LANGUAGE_BRAND_COLORS[key]) {
    return LANGUAGE_BRAND_COLORS[key];
  }
  const simple = key.replace(/[^a-z0-9+#]/g, "");
  if (LANGUAGE_BRAND_COLORS[simple]) {
    return LANGUAGE_BRAND_COLORS[simple];
  }
  return FALLBACK_ACCENT[hashString(displayName) % FALLBACK_ACCENT.length];
}
