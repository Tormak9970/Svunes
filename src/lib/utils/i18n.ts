import { get } from "svelte/store";
import { selectedLanguage } from "../../stores/State";
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
};

function getLanguage(): string {
  const lang = get(selectedLanguage);

  if (lang === "system") return navigator.language;
  return lang;
}

/**
 * Gets the credits for the provided language.
 * @param lang The language to get the credits for.
 */
export function getCredits(lang?: string) {
  if (lang) return LANGS[lang]?.credit;
  return LANGS[getLanguage()]?.credit;
}

/**
 * Renders the provided date in short form.
 * @param formattedDate The date in ISO format.
 */
export function renderDate(formattedDate: string): string {
  const lang = getLanguage();
  const formatter = new Intl.DateTimeFormat(lang);
  const date = new Date(formattedDate);
  return formatter.format(date);
}

/**
 * Gets the localized value for the provided key.
 * @param key Locale key
 *
 * @example
 * t('SYSTEM_DEFAULT_LANGUAGE_LABEL')
 * @example
 * // if you need variables use .replace()
 * t('BULK_EDITING_TITLE').replaceAll('{count}', songCount)
 */
function trans_string(key: string): string {
  return LANGS[getLanguage()]?.strings?.[key] ?? fallbacks[key];
}

export default trans_string;

/**
 * Gets the name of the provided language.
 * @param lang The language to get the name of.
 */
export function getLanguageName(lang?: string): string {
  if (lang === "system") return trans_string("SYSTEM_DEFAULT_LANGUAGE_LABEL");
  if (lang) return LANGS[lang]?.name;
  return LANGS[getLanguage()]?.name;
}