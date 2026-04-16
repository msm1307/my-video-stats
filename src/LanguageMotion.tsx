import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type Language = { name: string; percent: number; color: string };

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

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 80% at 12% 8%, #1a1522 0%, transparent 52%), radial-gradient(90% 70% at 88% 92%, #152028 0%, transparent 45%), linear-gradient(168deg, #0a090c 0%, #121018 48%, #0c0b10 100%)",
        fontFamily:
          'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#f4f0ea",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
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
            fontSize: 13,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#9c8c78",
            fontWeight: 600,
          }}
        >
          GitHub
        </p>
        <h1
          style={{
            margin: "10px 0 0",
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: compactHeader ? 1.12 : 1.08,
            maxWidth: "85%",
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
            marginTop: compactHeader ? 14 : 22,
            width: Math.min(200, width * 0.14),
            height: 4,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, #c9a227, #e8d4a8, rgba(201,162,39,0.2))",
          }}
        />
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
              key={lang.name}
              style={{
                flex: "1 1 0",
                minHeight: 0,
                display: "grid",
                gridTemplateColumns: tight
                  ? "36px 1fr minmax(72px, 0.32fr)"
                  : "44px 1fr minmax(120px, 0.35fr)",
                alignItems: "center",
                gap: tight ? "8px 12px" : "14px 20px",
                padding: `${rowPadY}px ${rowPadX}px`,
                borderRadius: tight ? 10 : 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                transform: `translateY(${rowY}px)`,
                opacity: rowOp,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontSize: tight ? 17 : 22,
                  fontWeight: 800,
                  color: "#5c534a",
                  textAlign: "center",
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
                      width: tight ? 8 : 10,
                      height: tight ? 8 : 10,
                      borderRadius: "50%",
                      background: lang.color,
                      boxShadow: `0 0 16px ${lang.color}66`,
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
                    background: "rgba(0,0,0,0.35)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transformOrigin: "left center",
                      transform: `scaleX(${Math.max(0.004, fill)})`,
                      borderRadius: barH / 2,
                      background: `linear-gradient(90deg, ${lang.color}cc, ${lang.color})`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25)`,
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
                }}
              >
                {count >= 10 ? Math.round(count) : count.toFixed(1)}
                <span
                  style={{
                    fontSize: "0.55em",
                    fontWeight: 700,
                    color: "#a39a8e",
                    marginLeft: 2,
                  }}
                >
                  %
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
