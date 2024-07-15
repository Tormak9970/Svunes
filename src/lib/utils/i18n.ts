// import * as es from '../i18n/es.json';
// import * as es419 from '../i18n/es-419.json';
import * as translationKeys from '../i18n/strings.json';

const fallbacks = translationKeys as Record<string, string>;

type LanguageEntry = {
  name: string;
  strings: any;
  credit: string[];
}

export const LANGS: Record<string, LanguageEntry> = {
  // es: {
  //   name: 'Español-España',
  //   strings: es,
  //   credit: ['Andrea Laguillo', 'Kam', 'm0uch0'],
  // },
  // 'es-419': {
  //   name: 'Español-Latinoamérica',
  //   strings: es419,
  //   credit: ['Kam'],
  // },
};

export function getCredits(lang?: string) {
  if (lang) return LANGS[lang]?.credit;
  return LANGS[navigator.language]?.credit;
};

export function getLanguageName(lang?: string): string {
  if (lang) return LANGS[lang]?.name;
  return LANGS[navigator.language]?.name;
};

/**
 * Gets the localized value for the provided key, falling back to the original string if its not defined.
 * @param key Locale key
 * @param originalString Original text
 *
 * @example
 * t('TITLE_FILTER_MODAL', 'Asset Filters')
 * @example
 * // if you need variables use .replace()
 * t('ACTION_REMOVE_GAME', 'Delete {gameName}').replaceAll('{gameName}', gameName)
 */
function trans_string(key: string): string {
  if (navigator.language.startsWith('en')) return fallbacks[key];

  return LANGS[navigator.language]?.strings?.[key] ?? fallbacks[key];
};

export default trans_string;