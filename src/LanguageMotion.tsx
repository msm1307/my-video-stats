import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveLanguageColor } from "./languageColors";

export type Language = { name: string; percent: number; color?: string };

export const LanguageMotion: React.FC<{ languages: Language[] }> = ({
  languages,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const sorted = useMemo(
    () => [...languages].sort((a, b) => b.percent - a.percent),
    [languages],
  );

  const n = sorted.length;
  const pad = Math.max(32, Math.round(Math.min(width, height) * 0.045));

  const compactHeader = n >= 5;
  const titleSize = compactHeader
    ? Math.min(44, Math.max(30, Math.round(width * 0.034)))
    : Math.min(64, Math.max(36, Math.round(width * 0.048)));

  const headerBlockH = compactHeader
    ? Math.round(56 + titleSize * 1.5)
    : Math.round(52 + titleSize * 2.35);

  const listTop = pad + headerBlockH;
  const listHeight = Math.max(120, height - listTop - pad);
  const gap = Math.max(4, Math.min(12, Math.floor(14 - n * 0.35)));
  const rowSlot =
    n > 0 ? (listHeight - gap * Math.max(0, n - 1)) / n : listHeight;
  const tight = rowSlot < 96;
  const rowPadY = tight ? 8 : 14;
  const rowPadX = tight ? 14 : 22;
  const barH = tight ? 10 : 14;
  const nameFs = tight
    ? Math.min(20, Math.max(15, width * 0.018))
    : Math.min(26, Math.max(17, width * 0.022));
  const pctFs = tight
    ? Math.min(26, Math.max(18, width * 0.022))
    : Math.min(34, Math.max(22, width * 0.028));

  const hero = spring({
    frame,
    fps,
    config: { damping: 22, mass: 0.9 },
  });

  const titleY = interpolate(hero, [0, 1], [28, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const titleOp = interpolate(hero, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const sheen = interpolate(frame, [0, 120], [0, 1], {
    extrapolateRight: "clamp",
  });
  const barShineX = interpolate(sheen, [0, 1], [-40, 120]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 85% 55% at 50% -5%, rgba(99,102,241,0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(236,72,153,0.12) 0%, transparent 50%), linear-gradient(165deg, #07060a 0%, #0f0e14 42%, #08070c 100%)",
        fontFamily:
          'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#f4f0ea",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.055,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: pad,
          transform: `translateY(${titleY}px)`,
          opacity: titleOp,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#a89f92",
            fontWeight: 600,
          }}
        >
          GitHub
        </p>
        <h1
          style={{
            margin: "12px 0 0",
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: compactHeader ? 1.12 : 1.06,
            maxWidth: "92%",
            background:
              "linear-gradient(105deg, #faf7f2 0%, #e8dfd0 35%, #c9b8a4 72%, #f5f0e8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {compactHeader ? (
            <>Most used languages</>
          ) : (
            <>
              Most used
              <br />
              languages
            </>
          )}
        </h1>
        <div
          style={{
            marginTop: compactHeader ? 16 : 24,
            position: "relative",
            width: Math.min(240, width * 0.18),
            height: 5,
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, #a78bfa, #c4b5fd, #fcd34d, #fbbf24)",
              opacity: 0.95,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "38%",
              left: `${barShineX}%`,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              filter: "blur(4px)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: listTop,
          height: listHeight,
          display: "flex",
          flexDirection: "column",
          gap,
        }}
      >
        {sorted.map((lang, index) => {
          const accent = resolveLanguageColor(lang.name, lang.color);
          const delay = 10 + index * 8;
          const row = spring({
            frame: frame - delay,
            fps,
            config: { damping: 20, mass: 0.85 },
          });
          const bar = spring({
            frame: frame - delay - 6,
            fps,
            config: { damping: 18, mass: 0.7 },
          });

          const rowY = interpolate(row, [0, 1], [22, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const rowOp = interpolate(row, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const fill = interpolate(bar, [0, 1], [0, lang.percent / 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const count = interpolate(
            frame,
            [delay + 10, delay + 38],
            [0, lang.percent],
            {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={`${lang.name}-${index}`}
              style={{
                flex: "1 1 0",
                minHeight: 0,
                position: "relative",
                borderRadius: tight ? 12 : 16,
                overflow: "hidden",
                transform: `translateY(${rowY}px)`,
                opacity: rowOp,
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.07),
                  0 18px 48px rgba(0,0,0,0.45),
                  inset 0 1px 0 rgba(255,255,255,0.06)
                `,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 48%, rgba(0,0,0,0.15) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 10,
                  bottom: 10,
                  width: 4,
                  borderRadius: 4,
                  background: accent,
                  boxShadow: `0 0 24px ${accent}99`,
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: tight
                    ? "36px 1fr minmax(72px, 0.32fr)"
                    : "44px 1fr minmax(120px, 0.35fr)",
                  alignItems: "center",
                  gap: tight ? "8px 12px" : "14px 20px",
                  padding: `${rowPadY}px ${rowPadX}px`,
                  paddingLeft: tight ? 16 : 20,
                }}
              >
                <span
                  style={{
                    fontSize: tight ? 16 : 20,
                    fontWeight: 800,
                    color: "#c4b4a2",
                    textAlign: "center",
                    lineHeight: 1,
                    padding: tight ? "6px 0" : "8px 0",
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {index + 1}
                </span>
                <div style={{ minWidth: 0, minHeight: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: tight ? 8 : 12,
                      marginBottom: tight ? 6 : 10,
                    }}
                  >
                    <span
                      style={{
                        width: tight ? 9 : 11,
                        height: tight ? 9 : 11,
                        borderRadius: "50%",
                        background: accent,
                        boxShadow: `0 0 20px ${accent}aa, inset 0 0 0 1px rgba(255,255,255,0.35)`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: nameFs,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#f8f4ee",
                      }}
                    >
                      {lang.name}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      height: barH,
                      borderRadius: barH / 2,
                      background: "rgba(0,0,0,0.45)",
                      overflow: "hidden",
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.35)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "left center",
                        transform: `scaleX(${Math.max(0.004, fill)})`,
                        borderRadius: barH / 2,
                        background: `linear-gradient(90deg, ${accent}ee, ${accent}, ${accent}cc)`,
                        boxShadow: `
                          inset 0 1px 0 rgba(255,255,255,0.35),
                          0 0 20px ${accent}66
                        `,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 800,
                    fontSize: pctFs,
                    color: "#faf6f0",
                    letterSpacing: "-0.03em",
                    textShadow: `0 0 28px ${accent}44`,
                  }}
                >
                  {count >= 10 ? Math.round(count) : count.toFixed(1)}
                  <span
                    style={{
                      fontSize: "0.55em",
                      fontWeight: 700,
                      color: "#9d948a",
                      marginLeft: 2,
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
