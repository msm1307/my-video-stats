import { Composition } from "remotion";
import { Scene, myCompSchema } from "./Scene";

const DEFAULT_LANGUAGES = [
  { name: "TypeScript", percent: 45, color: "#3178c6" },
  { name: "JavaScript", percent: 25, color: "#f7df1e" },
  { name: "Rust", percent: 15, color: "#dea584" },
  { name: "Python", percent: 10, color: "#3776ab" },
  { name: "Go", percent: 5, color: "#00add8" },
  { name: "Go", percent: 5, color: "#00add8" },
  { name: "Go", percent: 5, color: "#00add8" },
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
