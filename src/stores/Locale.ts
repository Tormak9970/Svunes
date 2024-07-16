import { derived, get, writable, type Readable } from "svelte/store";
import { LANGS } from "../lib/utils/i18n";
import { showHelpTranslate } from "./Modals";

export const HELP_TRANSLATE_LINK = "https://github.com/Tormak9970/Tunistic/blob/main/Translate.md";

export const selectedLanguage = writable("system");
export const systemDefaultLanguage = writable(navigator.language);
export const languageSupported = writable(true);
export const hasShownHelpTranslate = writable(false);

/**
 * Gets the credits for the provided language.
 * @param lang The language to get the credits for.
 */
export function getCredits(lang: string) {
  return LANGS[lang]?.credit;
}

function getBestFitForSystemDefault(lang: string): string {
  const langKeys = Object.keys(LANGS);

  if (langKeys.includes(lang)) {
    languageSupported.set(true);
    return lang;
  }

  const splitIndex = lang.indexOf("-");
  if (splitIndex !== -1) {
    const base = lang.substring(0, splitIndex);
    if (langKeys.includes(base)) {
      languageSupported.set(true);
      return base;
    }
  }

  languageSupported.set(false);
  if (!get(hasShownHelpTranslate)) {
    hasShownHelpTranslate.set(true);
    showHelpTranslate.set(true);
  }
  return lang;
}

/**
 * Gets the localized value for the provided key.
 * @param key Locale key
 *
 * @example
 * $t('SYSTEM_DEFAULT_LANGUAGE_LABEL')
 * @example
 * // if you need variables use .replace()
 * $t('BULK_EDITING_TITLE').replaceAll('{count}', songCount)
 */
export const t: Readable<(key: string) => string> = derived([
  selectedLanguage,
  systemDefaultLanguage
], ([$selectedLanguage, $systemDefaultLanguage]) => {
  const lang = ($selectedLanguage === "system") ? getBestFitForSystemDefault($systemDefaultLanguage) : $selectedLanguage;

  return (key: string) => {
    return LANGS[lang]?.strings?.[key] ?? LANGS.en.strings[key]
  }
});

/**
 * Renders the provided date in short form.
 * @param formattedDate The date in ISO format.
 */
export const getLanguageName: Readable<(lang: string) => string> = derived([t], ([$t]) => {
  return (lang: string) => {
    if (lang === "system") return $t("SYSTEM_DEFAULT_LANGUAGE_LABEL");
    return LANGS[lang]?.name;
  }
});

/**
 * Renders the provided date in short form.
 * @param formattedDate The date in ISO format.
 */
export const renderDate: Readable<(formattedDate: string) => string> = derived([
  selectedLanguage,
  systemDefaultLanguage
], ([$selectedLanguage, $systemDefaultLanguage]) => {
  return (formattedDate: string) => {
    const lang = ($selectedLanguage === "system") ? $systemDefaultLanguage : $selectedLanguage;
    const formatter = new Intl.DateTimeFormat(lang);
    const date = new Date(formattedDate);
    return formatter.format(date);
  }
});