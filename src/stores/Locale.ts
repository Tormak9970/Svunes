import { derived, writable, type Readable } from "svelte/store";
import { LANGS } from "../lib/utils/i18n";

export const selectedLanguage = writable("system");
export const systemDefaultLanguage = writable(navigator.language);

/**
 * Gets the credits for the provided language.
 * @param lang The language to get the credits for.
 */
export function getCredits(lang: string) {
  return LANGS[lang]?.credit;
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
  const lang = ($selectedLanguage === "system") ? $systemDefaultLanguage : $selectedLanguage;

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