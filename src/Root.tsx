import { Composition } from "remotion";
import { Scene, myCompSchema } from "./Scene";

/** 색은 생략 → `src/languageColors.ts`에서 이름으로 자동 매칭 */
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
      />
    </>
  );
};
