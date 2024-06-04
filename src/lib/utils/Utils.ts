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
    const later = function () {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout as any);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  }
}

/**
 * Debounces a function by the provided interval.
 * @param func The function to debounce.
 * @param wait How long to wait before running the function after the last call.
 * @param immediate Whether to run the function immediately, then debounce, or debounce from the start.
 * @returns The debounced function.
 */
export function asyncDebounce(func: any, wait:number, resolve: (value?: unknown) => void, immediate?:boolean) {
  let timeout:any|null;
  return function (...args: any[]) {
    // @ts-ignore
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args).then(resolve);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout as any);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args).then(resolve);
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
  return artist.split(/\s*(?:\s*(?:and|&|,|;|\/|\\)\s*)\s*/);
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

/**
 * Capitalizes each word in the phrase.
 * @param phrase The phrase to capitalize.
 */
export function capitalizeEachWord(phrase: string): string {
  const words = phrase.split(" ");
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export const GENRE_LUT: Record<string, string> = {
  "0": "Blues",
  "1": "Classic Rock",
  "2": "Country",
  "3": "Dance",
  "4": "Disco",
  "5": "Funk",
  "6": "Grunge",
  "7": "Hip-Hop",
  "8": "Jazz",
  "9": "Metal",
  "10": "New Age",
  "11": "Oldies",
  "12": "Other",
  "13": "Pop",
  "14": "R&B",
  "15": "Rap",
  "16": "Reggae",
  "17": "Rock",
  "18": "Techno",
  "19": "Industrial",
  "20": "Alternative",
  "21": "Ska",
  "22": "Death Metal",
  "23": "Pranks",
  "24": "Soundtrack",
  "25": "Euro-Techno",
  "26": "Ambient",
  "27": "Trip-Hop",
  "28": "Vocal",
  "29": "Jazz+Funk",
  "30": "Fusion",
  "31": "Trance",
  "32": "Classical",
  "33": "Instrumental",
  "34": "Acid",
  "35": "House",
  "36": "Game",
  "37": "Sound Clip",
  "38": "Gospel",
  "39": "Noise",
  "40": "Alt. Rock",
  "41": "Bass",
  "42": "Soul",
  "43": "Punk",
  "44": "Space",
  "45": "Meditative",
  "46": "Instrumental Pop",
  "47": "Instrumental Rock",
  "48": "Ethnic",
  "49": "Gothic",
  "50": "Darkwave",
  "51": "Techno-Industrial",
  "52": "Electronic",
  "53": "Pop-Folk",
  "54": "Eurodance",
  "55": "Dream",
  "56": "Southern Rock",
  "57": "Comedy",
  "58": "Cult",
  "59": "Gangsta Rap",
  "60": "Top 40",
  "61": "Christian Rap",
  "62": "Pop/Funk",
  "63": "Jungle",
  "64": "Native American",
  "65": "Cabaret",
  "66": "New Wave",
  "67": "Psychedelic",
  "68": "Rave",
  "69": "Showtunes",
  "70": "Trailer",
  "71": "Lo-Fi",
  "72": "Tribal",
  "73": "Acid Punk",
  "74": "Acid Jazz",
  "75": "Polka",
  "76": "Retro",
  "77": "Musical",
  "78": "Rock & Roll",
  "79": "Hard Rock",
  "80": "Folk",
  "81": "Folk-Rock",
  "82": "National Folk",
  "83": "Swing",
  "84": "Fast-Fusion",
  "85": "Bebop",
  "86": "Latin",
  "87": "Revival",
  "88": "Celtic",
  "89": "Bluegrass",
  "90": "Avantgarde",
  "91": "Gothic Rock",
  "92": "Progressive Rock",
  "93": "Psychedelic Rock",
  "94": "Symphonic Rock",
  "95": "Slow Rock",
  "96": "Big Band",
  "97": "Chorus",
  "98": "Easy Listening",
  "99": "Acoustic",
  "100": "Humour",
  "101": "Speech",
  "102": "Chanson",
  "103": "Opera",
  "104": "Chamber Music",
  "105": "Sonata",
  "106": "Symphony",
  "107": "Booty Bass",
  "108": "Primus",
  "109": "Porn Groove",
  "110": "Satire",
  "111": "Slow Jam",
  "112": "Club",
  "113": "Tango",
  "114": "Samba",
  "115": "Folklore",
  "116": "Ballad",
  "117": "Power Ballad",
  "118": "Rhythmic Soul",
  "119": "Freestyle",
  "120": "Duet",
  "121": "Punk Rock",
  "122": "Drum Solo",
  "123": "A Cappella",
  "124": "Euro-House",
  "125": "Dance Hall",
  "126": "Goa",
  "127": "Drum & Bass",
  "128": "Club-House",
  "129": "Hardcore",
  "130": "Terror",
  "131": "Indie",
  "132": "BritPop",
  "133": "Afro-Punk",
  "134": "Polsk Punk",
  "135": "Beat",
  "136": "Christian Gangsta Rap",
  "137": "Heavy Metal",
  "138": "Black Metal",
  "139": "Crossover",
  "140": "Contemporary Christian",
  "141": "Christian Rock",
  "142": "Merengue",
  "143": "Salsa",
  "144": "Thrash Metal",
  "145": "Anime",
  "146": "JPop",
  "147": "Synthpop",
  "148": "Abstract",
  "149": "Art Rock",
  "150": "Baroque",
  "151": "Bhangra",
  "152": "Big Beat",
  "153": "Breakbeat",
  "154": "Chillout",
  "155": "Downtempo",
  "156": "Dub",
  "157": "EBM",
  "158": "Eclectic",
  "159": "Electro",
  "160": "Electroclash",
  "161": "Emo",
  "162": "Experimental",
  "163": "Garage",
  "164": "Global",
  "165": "IDM",
  "166": "Illbient",
  "167": "Industro-Goth",
  "168": "Jam Band",
  "169": "Krautrock",
  "170": "Leftfield",
  "171": "Lounge",
  "172": "Math Rock",
  "173": "New Romantic",
  "174": "Nu-Breakz",
  "175": "Post-Punk",
  "176": "Post-Rock",
  "177": "Psytrance",
  "178": "Shoegaze",
  "179": "Space Rock",
  "180": "Trop Rock",
  "181": "World Music",
  "182": "Neoclassical",
  "183": "Audiobook",
  "184": "Audio Theatre",
  "185": "Neue Deutsche Welle",
  "186": "Podcast",
  "187": "Indie Rock",
  "188": "G-Funk",
  "189": "Dubstep",
  "190": "Garage Rock",
  "191": "Psybient",
  "255": "None",
  "'CR'": "Cover",
  "'RX'": "Remix",
}

/**
 * Gets the correct genre for the value provided.
 * @param value The value to get.
 */
export function getGenre(value?: string) {
  let genre = "Other";

  if (!value) return genre;

  if (value.startsWith("(")) {
    const key = value.substring(1, value.length - 1);
    
    if (Object.keys(GENRE_LUT).includes(key)) {
      genre = GENRE_LUT[key];
    }
  } else if (value.toLocaleLowerCase() === value) {
    return capitalizeEachWord(value);
  } else {
    return value;
  }
}

/**
 * Normalizes a string.
 * @param value The string to normalize.
 */
export function normalizeString(value: string): string {
  const accentMap: Record<string, string> = {
    "ą": "a",
    "ć": "c",
    "ę": "e",
    "ł": "l",
    "ń": "n",
    "ó": "o",
    "ś": "s",
    "ź": "z",
    "ż": "z"
  };
  
  return value.normalize("NFD").replace(/[ąćęłńóśźż]/g, (matched) => accentMap[matched]);
}

/**
 * Adds an "s" to the value if lengthOfValues !== 1.
 * @param value The value to pluralize.
 * @param lengthOfValues The length of the values.
 */
export function pluralize(value: string, lengthOfValues?: number): string {
  return lengthOfValues === 1 ? value : value + "s";
}

// cyrb53 (c) 2018 bryc (github.com/bryc). License: Public domain. Attribution appreciated.
// A fast and simple 64-bit (or 53-bit) string hash function with decent collision resistance.
// Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
// See https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
// https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
function cyrb64(str: string, seed = 0): [number, number] {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  // For a single 53-bit numeric return value we could return
  // 4294967296 * (2097151 & h2) + (h1 >>> 0);
  // but we instead return the full 64-bit value:
  return [h2 >>> 0, h1 >>> 0];
};

/**
 * Hashes a string. Output is always 14 characters.
 * @param str The string to hash.
 * @param seed An optional seed.
 * @returns The hash.
 */
export function hash64(str: string, seed = 0): string {
  const [h2, h1] = cyrb64(str, seed);
  return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0');
}