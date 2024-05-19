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
    if ((a[property] ?? "Unkown") < (b[property] ?? "Unkown")) return -1;
    if ((a[property] ?? "Unkown") > (b[property] ?? "Unkown")) return 1;
    return 0;
  }
}

/**
 * Genrates a sorting function for based on the provided callback.
 * @param callback The callback to run on each element.
 * @returns The sorting function.
 */
export function stringCallbackSort<T>(callback: (entry: T) => string | undefined): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if ((callback(a) ?? "Unkown") < (callback(b) ?? "Unkown")) return -1;
    if ((callback(a) ?? "Unkown") > (callback(b) ?? "Unkown")) return 1;
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

/**
 * Genrates a sorting function for the provided property.
 * @param property The property to sort by.
 * @returns The sorting function.
 */
export function nullishNumberSort<T>(property: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    if (a[property] && b[property]) {
      return (a[property] as number) - (b[property] as number);
    } else if (a[property]) {
      return -1;
    } else if (b[property]) {
      return 1;
    } else {
      return 0;
    }
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

/**
 * Sums the components of a color.
 * @param color The color to sum.
 * @returns The some of the color's components.
 */
export function sumColorString(color: string): number {
  const parts = color.split(" ").map((part) => parseInt(part));
  return parts[0] + parts[1] + parts[2];
}

/**
 * Checks if an artist is singular.
 * @param artist The artist to check
 */
export function artistIsSingular(artist: string) {
  if (artist.includes(" and ") || artist.includes(" & ") || artist.includes(",") || artist.includes("/")) return false;
  return true;
}

/**
 * Gets all the artist names from a string.
 * @param artist The string to check
 */
export function getAllArtistNames(artist: string): string[] {
  return artist.split(/\s*(?:\s*(?:and|&|,|\/)\s*)\s*/);
}

/**
 * Randomly selects n elements from an array.
 * @param arr The array to get elements from.
 * @param n The number of elements.
 * @returns The randomly selected elements.
 */
export function getRandomElements<T>(arr: T[], n: number): T[] {
  let result = new Array(n);
  let len = arr.length;
  let taken = new Array(len);
  if (n > len) throw new RangeError("getRandom: more elements taken than available");

  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }

  return result;
}