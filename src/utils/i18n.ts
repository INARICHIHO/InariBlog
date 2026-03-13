import en from "../languages/en";
import ja from "../languages/ja";
import zhCn from "../languages/zh-cn";
import zhTw from "../languages/zh-tw";

import { SITE } from "./config";

const langMap: Record<string, any> = {
  "en": en,
  "ja": ja,
  "zh-cn": zhCn,
  "zh-tw": zhTw,
};

// Simplified translation function: directly use SITE.language from config
export const __ = (key: string): string => {
  const lang = SITE.language.toLowerCase() || "zh-cn";
  const i18n = langMap[lang] || en;
  
  const keys = key.split(".");
  let result = i18n;
  for (let k of keys) {
    if (!result || result[k] === undefined) return key;
    result = result[k];
  }
  return (result as unknown as string) || key;
};

// Simplified translation with parameters
export const _p = (key: string, params: string | number): string => {
  const lang = SITE.language.toLowerCase() || "zh-cn";
  const i18n = langMap[lang] || en;

  const keys = key.split(".");
  let result = i18n;
  for (let k of keys) {
    if (!result || result[k] === undefined) return key;
    result = result[k];
  }

  const replaceStr = (str: string, val: string | number) => str.replace("%s", String(val));

  if (typeof params === "number" || !isNaN(Number(params))) {
    if (typeof result === "string") return replaceStr(result, params);
    
    // Handle plural forms based on count
    const count = Number(params);
    const text = count <= 1 ? (result?.one || "") : (result?.other || "");
    return replaceStr(text, params) || key;
  }
  
  const text = typeof result === "string" ? result : (result?.other || "");
  return replaceStr(text, params) || key;
};

export const getI18n = (lang: string = "zh-cn"): Record<string, any> => {
  return langMap[lang] || en;
};

export const languages = langMap;