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
    if (a[property] === "Never") return 1;
    if (b[property] === "Never") return -1;

    const aDate = Date.parse(a[property] as string);
    const bDate = Date.parse(b[property] as string);
    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
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