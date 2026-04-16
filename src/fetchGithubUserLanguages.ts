/** GitHub 사용자 공개 저장소 기준 언어 비율 (Linguist와 유사: fork 제외). */

export type GithubLanguageRow = {
  name: string;
  percent: number;
};

const DEFAULT_UA =
  "my-video-stats/1.0 (Remotion; +https://github.com/remotion-dev/remotion)";

type FetchOpts = {
  token?: string;
  signal?: AbortSignal;
  /** fork 저장소 제외 (기본 true) */
  excludeForks?: boolean;
  /** 상위 N개만 (0이면 전부) */
  top?: number;
};

async function ghFetch(url: string, opts: FetchOpts): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": DEFAULT_UA,
  };
  if (opts.token?.trim()) {
    headers.Authorization = `Bearer ${opts.token.trim()}`;
  }
  const res = await fetch(url, { headers, signal: opts.signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GitHub ${res.status} ${res.statusText}: ${text.slice(0, 200)}`,
    );
  }
  return res.json() as Promise<unknown>;
}

type Repo = {
  name: string;
  fork: boolean;
  owner: { login: string };
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * `username`의 공개 저장소들에서 언어별 바이트를 합산한 뒤 비율(%)로 반환합니다.
 * CI에서는 `GITHUB_TOKEN`(또는 `REMOTION_GITHUB_TOKEN`)을 넣으면 속도·한도에 유리합니다.
 */
export async function fetchGithubUserLanguages(
  username: string,
  opts: FetchOpts = {},
): Promise<GithubLanguageRow[]> {
  try {
    return await fetchGithubUserLanguagesInner(username, opts);
  } catch {
    return [];
  }
}

async function fetchGithubUserLanguagesInner(
  username: string,
  opts: FetchOpts,
): Promise<GithubLanguageRow[]> {
  const excludeForks = opts.excludeForks !== false;
  const top = opts.top ?? 14;

  const repos: Repo[] = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://api.github.com/users/${encodeURIComponent(
      username,
    )}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
    const chunk = (await ghFetch(url, opts)) as unknown;
    if (!Array.isArray(chunk) || chunk.length === 0) {
      break;
    }
    for (const item of chunk) {
      if (!isRecord(item)) continue;
      const name = item.name;
      const fork = item.fork;
      const owner = item.owner;
      if (typeof name !== "string" || typeof fork !== "boolean") continue;
      if (!isRecord(owner) || typeof owner.login !== "string") continue;
      if (excludeForks && fork) continue;
      repos.push({ name, fork, owner: { login: owner.login } });
    }
    if (chunk.length < 100) {
      break;
    }
  }

  const totals = new Map<string, number>();

  for (const repo of repos) {
    const langUrl = `https://api.github.com/repos/${encodeURIComponent(
      repo.owner.login,
    )}/${encodeURIComponent(repo.name)}/languages`;
    try {
      const langs = (await ghFetch(langUrl, opts)) as unknown;
      if (!isRecord(langs)) continue;
      for (const lang of Object.keys(langs)) {
        const bytes = langs[lang];
        if (typeof bytes !== "number" || bytes <= 0) continue;
        totals.set(lang, (totals.get(lang) ?? 0) + bytes);
      }
    } catch {
      continue;
    }
  }

  const grand = [...totals.values()].reduce((a, b) => a + b, 0);
  if (grand <= 0) {
    return [];
  }

  const rows: GithubLanguageRow[] = [...totals.entries()]
    .map(([name, bytes]) => ({
      name,
      percent: (bytes / grand) * 100,
    }))
    .sort((a, b) => b.percent - a.percent)
    .map((r) => ({
      name: r.name,
      percent: Math.round(r.percent * 10) / 10,
    }))
    .filter((r) => r.percent >= 0.05);

  let out = rows;
  if (top > 0 && rows.length > top) {
    out = rows.slice(0, top);
  }
  const sum = out.reduce((a, b) => a + b.percent, 0);
  if (sum <= 0) {
    return out;
  }
  return out.map((r) => ({
    name: r.name,
    percent: Math.round((r.percent / sum) * 1000) / 10,
  }));
}

export const DEFAULT_GITHUB_USERNAME = "msm0748";
