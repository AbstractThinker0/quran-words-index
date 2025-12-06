import { splitArabicLetters, removeDiacritics } from "quran-tools";
import { commonArabicDiacritics } from "./consts";

const extractSuffix = (word: string) => {
  if (word === "بِينَ") {
    return word;
  }

  const splitted = splitArabicLetters(word);

  if (word.length > 3 && word.endsWith("ونَكَ")) {
    return splitted.slice(0, splitted.length - 3).join("");
  }

  if (
    (word.length > 2 &&
      (word.endsWith("وا") ||
        word.endsWith("ونِ") ||
        word.endsWith("تُمُ") ||
        word.endsWith("وهُ") ||
        word.endsWith("ينَ") ||
        word.endsWith("تُنَّ"))) ||
    word.endsWith("ونَ")
  ) {
    return splitted.slice(0, splitted.length - 2).join("");
  }

  if (word.length > 2 && (word.endsWith("وْا") || word.endsWith("وْنَ"))) {
    return splitted
      .slice(0, splitted.length - 2)
      .join("")
      .concat("ى");
  }

  if (splitted[splitted.length - 1] === "ي") {
    return splitted
      .slice(0, splitted.length - 1)
      .join("")
      .concat("ى");
  }

  if (splitted[splitted.length - 1].includes("ه")) {
    return splitted.slice(0, splitted.length - 1).join("");
  }

  return word;
};

const normalizeStem = (root: string) => {
  if (!root) return root;

  if (
    root[0] &&
    (root[0] === "ا" || root[0] === "إ" || root[0] === "آ" || root[0] === "ؤ")
  ) {
    root = "أ" + root.slice(1);
  }

  if (root[2] && root[2] === "ي") {
    root = root.slice(0, 2) + "ى" + root.slice(3);
  }

  return root;
};

const getFirstRoot = (word: string) => {
  const splitted = splitArabicLetters(extractSuffix(word));

  if (splitted.length === 1) {
    if (splitted[0].includes("ق")) {
      return "وقى";
    }
  }

  if (splitted.length === 2) {
    if (
      splitted[0].includes("ق") &&
      (splitted[1].includes("ى") || splitted[1].includes("ي"))
    ) {
      return "وقى";
    }
  }

  if (splitted.length === 2) {
    if (splitted[0].includes("ك") && splitted[1].includes("ئ")) {
      return "وكء";
    }
  }

  if (
    splitted.length === 2 &&
    splitted[0].includes("س") &&
    splitted[1].includes("ق")
  ) {
    return normalizeStem(
      removeDiacritics(["و", splitted[0], splitted[1]].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    splitted[0].includes("ت") &&
    splitted[1].includes("خ")
  ) {
    return normalizeStem(
      removeDiacritics(["أ", splitted[1], splitted[2]].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    splitted[0].includes("خ") &&
    splitted[1].includes("ذ")
  ) {
    return normalizeStem(
      removeDiacritics(["أ", splitted[0], splitted[1]].join(""))
    );
  }

  if (splitted.length > 1 && splitted[1].includes("ا")) {
    return normalizeStem(
      removeDiacritics([splitted[0], "و", splitted[2]].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    splitted[1].includes(commonArabicDiacritics.sukun)
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], "و", splitted[1]].join(""))
    );
  }

  if (
    splitted.length > 2 &&
    (splitted[2].includes("تْ") || splitted[2] === "ا")
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], "ى"].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    !splitted[0].includes("ب") &&
    splitted[1] === "ي"
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], "و", splitted[2]].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    (splitted[1] === "يُ" || splitted[1] === "شُ" || splitted[1] === "نُ")
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], "ى"].join(""))
    );
  }

  if (splitted.length > 1 && splitted[1] === "فٍ") {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], "ى"].join(""))
    );
  }

  if (splitted.length === 2 && splitted[1] === "تُ") {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], "ى"].join(""))
    );
  }

  if (splitted.length === 2 && splitted[1] === "فُ") {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], "ى"].join(""))
    );
  }

  const wordLength = splitted.length;

  if (
    wordLength > 1 &&
    (splitted[wordLength - 1].includes("ئ") ||
      splitted[wordLength - 1].includes("أ"))
  ) {
    splitted[wordLength - 1] = "ء";
  }

  const firstThreeLetters = splitted.slice(0, 3).join("");

  return normalizeStem(removeDiacritics(firstThreeLetters));
};

const getSecondRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (
    splitted.length > 2 &&
    (splitted[2].includes("ي") ||
      splitted[2].includes("ا") ||
      splitted[2].includes("و"))
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], splitted[3]].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    (splitted[1].includes("ي") ||
      splitted[1].includes("ا") ||
      splitted[1].includes("و"))
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[2], splitted[3]].join(""))
    );
  }

  if (
    splitted.length > 1 &&
    (splitted[0].includes(commonArabicDiacritics.sukun) ||
      splitted[1].includes("ت"))
  ) {
    if (splitted.length < 3) {
      return normalizeStem(
        removeDiacritics([splitted[0], splitted[2]].join(""))
      );
    } else {
      return normalizeStem(
        removeDiacritics([splitted[0], splitted[2], splitted[3]].join(""))
      );
    }
  }

  return "";
};

const getThirdRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (
    splitted.length > 1 &&
    splitted[1].includes(commonArabicDiacritics.shadda)
  ) {
    return normalizeStem(
      removeDiacritics([splitted[0], splitted[1], splitted[1]].join(""))
    );
  }

  return "";
};

const getFourthRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (splitted.length > 4) {
    return removeDiacritics([splitted[0], splitted[1], splitted[4]].join(""));
  }

  return "";
};

const getFifthRoot = (word: string) => {
  //const StableLetters = ["ج", "ح", "خ", "ع", "غ", "ر", "ز", "ص", "ش", "ث", "ق"];

  const StableLetters = [
    "ل",
    "ن",
    "ر",
    "ع",
    "ب",
    "ك",
    "ق",
    "ه",
    "د",
    "س",
    "ف",
    "ح",
    "ذ",
    "ج",
    "خ",
    "ى",
    "ث",
    "ص",
    "ز",
    "ش",
    "ض",
    "ط",
    "غ",
    "ظ",
    "ء",
    "ؤ",
    "آ",
    "إ",
  ];

  const splitted = splitArabicLetters(word);

  const rootLetters: string[] = [];

  for (const letter of splitted) {
    const cleanLetter = removeDiacritics(letter);
    if (StableLetters.includes(cleanLetter)) {
      rootLetters.push(cleanLetter);
      if (rootLetters.length === 3) {
        break;
      }
    }
  }

  return normalizeStem(rootLetters.join(""));
};

export {
  normalizeStem,
  getFirstRoot,
  getSecondRoot,
  getThirdRoot,
  getFourthRoot,
  getFifthRoot,
};
