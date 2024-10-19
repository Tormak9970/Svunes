import * as translationKeys from '../i18n/strings.json';

const fallbacks = translationKeys as Record<string, string>;

type LanguageEntry = {
  name: string;
  strings: any;
  credit: string[];
}

export const LANGS: Record<string, LanguageEntry> = {
  system: {
    name: "",
    strings: null,
    credit: []
  },
  en: {
    name: "English",
    strings: fallbacks,
    credit: []
  }
}