import { get } from "svelte/store";
import { t as translate } from "../stores/Locale";

export enum SleepTimerOption {
  FIVE_MINUTES,
  TEN_MINUTES,
  FIFTEEN_MINUTES,
  THIRTY_MINUTES,
  FOURTY_FIVE_MINUTES,
  ONE_HOUR,
  END_OF_TRACK,
}

/**
 * Gets the label for the provided SleepTimerOption.
 * @param option The option to get the label for.
 */
export function getTimeOptionLabel(option: SleepTimerOption): string {
  const t = get(translate);
  
  switch (option) {
    case SleepTimerOption.FIVE_MINUTES:
      return t("TIME_OPTION_5m_LABEL");
    case SleepTimerOption.TEN_MINUTES:
      return t("TIME_OPTION_10m_LABEL");
    case SleepTimerOption.FIFTEEN_MINUTES:
      return t("TIME_OPTION_15m_LABEL");
    case SleepTimerOption.THIRTY_MINUTES:
      return t("TIME_OPTION_30m_LABEL");
    case SleepTimerOption.FOURTY_FIVE_MINUTES:
      return t("TIME_OPTION_45m_LABEL");
    case SleepTimerOption.ONE_HOUR:
      return t("TIME_OPTION_1h_LABEL");
    default:
      return t("TIME_OPTION_EOT_LABEL");
  }
}

/**
 * Gets the time in ms for the provided SleepTimerOption.
 * @param option The option to get the time for.
 */
export function getTimeForOption(option: SleepTimerOption): number {
  switch (option) {
    case SleepTimerOption.FIVE_MINUTES:
      return 1000 * 60 * 5;
    case SleepTimerOption.TEN_MINUTES:
      return 1000 * 60 * 10;
    case SleepTimerOption.FIFTEEN_MINUTES:
      return 1000 * 60 * 15;
    case SleepTimerOption.THIRTY_MINUTES:
      return 1000 * 60 * 30;
    case SleepTimerOption.FOURTY_FIVE_MINUTES:
      return 1000 * 60 * 45;
    case SleepTimerOption.ONE_HOUR:
      return 1000 * 60 * 60;
    default:
      return 0;
  }
}