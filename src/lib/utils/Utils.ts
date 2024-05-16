/**
 * Throttles a function to only run every provided interval.
 * @param func The function to throttle.
 * @param wait The amount of time in between each run.
 * @returns A function that throttles the provided function.
 */
export function throttle(func: any, wait: number) {
  let waiting = false;
  return function (...args: any[]) {
    if (waiting) {
      return;
    } else {
      // @ts-ignore
      func.apply(this, args);
    }

    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, wait);
  }
}

/**
 * Debounces a function by the provided interval.
 * @param func The function to debounce.
 * @param wait How long to wait before running the function after the last call.
 * @param immediate Whether to run the function immediately, then debounce, or debounce from the start.
 * @returns The debounced function.
 */
export function debounce(func: any, wait:number, immediate?:boolean) {
  let timeout:any|null;
  return function (...args: any[]) {
    // @ts-ignore
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout as any);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  }
}

/**
 * Renders the provided date in short form.
 * @param formattedDate The date in ISO format.
 */
export function renderDate(formattedDate: string): string {
  const date = new Date(formattedDate);
  return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
}

/**
 * Gets the ISO formatted string for a given date.
 * @param date The date to format.
 */
export function getISODate(date: Date): string {
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
}

/**
 * Genrates a sorting function for the provided property.
 * @param property The property to sort by.
 * @returns The sorting function.
 */
export function stringSort<T>(property: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if ((a[property] ?? "Unk") < (b[property] ?? "Unk")) return -1;
    if ((a[property] ?? "Unk") > (b[property] ?? "Unk")) return 1;
    return 0;
  }
}

/**
 * Genrates a sorting function for the provided property.
 * @param property The property to sort by.
 * @returns The sorting function.
 */
export function dateSort<T>(property: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if (a[property] === "Never" && b[property] === "Never") return 0;
    if (a[property] === "Never") return -1;
    if (b[property] === "Never") return 1;

    const aDate = Date.parse(a[property] as string);
    const bDate = Date.parse(b[property] as string);
    if (aDate < bDate) return -1;
    if (aDate > bDate) return 1;
    return 0;
  }
}

function prefixIfNeeded(time: number): string {
  return time < 10 ? "0" + time.toString() : time.toString()
}

/**
 * Formats a duration into an easy to read format.
 * @param totalSeconds The total time in seconds.
 * @returns The formatted time.
 */
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / (60 * 60));
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = totalSeconds % 60;
  return `${hours !== 0 ? hours + ":" + prefixIfNeeded(minutes) : minutes}:${prefixIfNeeded(seconds)}`;
}