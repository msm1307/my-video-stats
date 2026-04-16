import { Composition } from "remotion";
import {
  DEFAULT_GITHUB_USERNAME,
  fetchGithubUserLanguages,
} from "./fetchGithubUserLanguages";
import { Scene, myCompSchema } from "./Scene";

/** 네트워크 실패·빈 결과 시 폴백 (색은 `languageColors`에서 매칭) */
const DEFAULT_LANGUAGES = [
  { name: "TypeScript", percent: 45 },
  { name: "JavaScript", percent: 25 },
  { name: "Rust", percent: 15 },
  { name: "Python", percent: 10 },
  { name: "Go", percent: 5 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Scene"
        component={Scene}
        fps={30}
        durationInFrames={300}
        width={1280}
        height={720}
        schema={myCompSchema}
        defaultProps={{
          languages: DEFAULT_LANGUAGES,
        }}
        calculateMetadata={async ({ defaultProps, abortSignal }) => {
          const user =
            process.env.REMOTION_GITHUB_USER?.trim() || DEFAULT_GITHUB_USERNAME;
          const token =
            process.env.GITHUB_TOKEN?.trim() ||
            process.env.REMOTION_GITHUB_TOKEN?.trim();
          try {
            const langs = await fetchGithubUserLanguages(user, {
              signal: abortSignal,
              token,
              top: 14,
            });
            if (langs.length === 0) {
              return { props: defaultProps };
            }
            return {
              props: {
                ...defaultProps,
                languages: langs.map((l) => ({
                  name: l.name,
                  percent: l.percent,
                })),
              },
            };
          } catch {
            return { props: defaultProps };
          }
        }}
      />
    </>
  );
};
