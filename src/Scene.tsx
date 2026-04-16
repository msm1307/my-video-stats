import React from "react";
import { z } from "zod";
import { LanguageMotion } from "./LanguageMotion";

export const languageSchema = z.object({
  name: z.string(),
  percent: z.number(),
  /** 없으면 `languageColors` 맵에서 `name`으로 자동 매칭 */
  color: z.string().optional(),
});

export const myCompSchema = z.object({
  languages: z.array(languageSchema),
});

type MyCompSchemaType = z.infer<typeof myCompSchema>;

export const Scene: React.FC<MyCompSchemaType> = ({ languages }) => {
  return <LanguageMotion languages={languages} />;
};
