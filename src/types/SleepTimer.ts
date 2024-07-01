export enum SleepTimerOption {
  FIVE_MINUTES = "5 minutes",
  TEN_MINUTES = "10 minutes",
  FIFTEEN_MINUTES = "15 minutes",
  THIRTY_MINUTES = "30 minutes",
  FOURTY_FIVE_MINUTES = "45 minutes",
  ONE_HOUR = "1 hour",
  END_OF_TRACK = "End of Track",
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