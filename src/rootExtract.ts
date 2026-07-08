import {
  normalizeAlif,
  removeDiacritics,
  splitArabicLetters,
} from "quran-tools";
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

  // TODO: further investigae this commented out condition (Maybe remove it?)
  if (root[2] && root[2] === "ي" /*&& root[1] === "ل"*/) {
    root = root.slice(0, 2) + "ى" + root.slice(3);
  }

  /*
  // TODO: further investigae this commented out condition (Maybe remove it?)
  if (root[2] && root[2] === "ى" && root[1] !== "ل" && root.length === 3) {
    root = root.slice(0, 2) + "ي" + root.slice(3);
  }
  */

  return root;
};

const normalizeRootOutput = (root: string) => {
  if (!root) return root;

  const letters = splitArabicLetters(root);
  const lastIndex = letters.length - 1;

  if (
    (lastIndex >= 0 && letters[lastIndex] === "ئ") ||
    letters[lastIndex] === "أ"
  ) {
    letters[lastIndex] = "ء";
  }

  return letters.join("");
};

const replaceMiddleWawWithYa = (root: string) => {
  if (!root) return root;

  const letters = splitArabicLetters(root);

  if (letters.length > 1 && letters[1] === "و") {
    letters[1] = "ي";
  }

  return letters.join("");
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
    return normalizeRootOutput(
      normalizeStem(removeDiacritics(["و", splitted[0], splitted[1]].join("")))
    );
  }

  if (
    splitted.length > 1 &&
    splitted[0].includes("ت") &&
    splitted[1].includes("خ")
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics(["أ", splitted[1], splitted[2]].join("")))
    );
  }

  if (
    splitted.length > 1 &&
    splitted[0].includes("خ") &&
    splitted[1].includes("ذ")
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics(["أ", splitted[0], splitted[1]].join("")))
    );
  }

  if (splitted.length > 1 && splitted[1].includes("ا")) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], "و", splitted[2]].join("")))
    );
  }

  if (
    splitted.length > 1 &&
    splitted[1].includes(commonArabicDiacritics.sukun)
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], "و", splitted[1]].join("")))
    );
  }

  if (
    splitted.length > 2 &&
    (splitted[2].includes("تْ") || splitted[2] === "ا")
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], splitted[1], "ى"].join("")))
    );
  }

  if (
    splitted.length > 1 &&
    !splitted[0].includes("ب") &&
    splitted[1] === "ي"
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], "و", splitted[2]].join("")))
    );
  }

  if (
    splitted.length > 1 &&
    (splitted[1] === "يُ" || splitted[1] === "شُ" || splitted[1] === "نُ")
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], splitted[1], "ى"].join("")))
    );
  }

  if (splitted.length > 1 && splitted[1] === "فٍ") {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], splitted[1], "ى"].join("")))
    );
  }

  if (splitted.length === 2 && splitted[1] === "تُ") {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], splitted[1], "ى"].join("")))
    );
  }

  if (splitted.length === 2 && splitted[1] === "فُ") {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics([splitted[0], splitted[1], "ى"].join("")))
    );
  }

  const wordLength = splitted.length;

  if (wordLength == 2 && splitted[1].includes(commonArabicDiacritics.shadda)) {
    splitted[1] = splitted[1].replace(commonArabicDiacritics.shadda, "");
    splitted.push(splitted[1]);
  }

  if (
    wordLength > 1 &&
    (splitted[wordLength - 1].includes("ئ") ||
      splitted[wordLength - 1].includes("أ"))
  ) {
    splitted[wordLength - 1] = "ء";
  }

  const firstThreeLetters = splitted.slice(0, 3).join("");

  return normalizeRootOutput(
    normalizeStem(removeDiacritics(firstThreeLetters))
  );
};

const getSecondRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (
    splitted.length > 2 &&
    (splitted[2].includes("ي") ||
      splitted[2].includes("ا") ||
      splitted[2].includes("و"))
  ) {
    return normalizeRootOutput(
      normalizeStem(
        removeDiacritics([splitted[0], splitted[1], splitted[3]].join(""))
      )
    );
  }

  if (
    splitted.length > 1 &&
    (splitted[1].includes("ي") ||
      splitted[1].includes("ا") ||
      splitted[1].includes("و"))
  ) {
    return normalizeRootOutput(
      normalizeStem(
        removeDiacritics([splitted[0], splitted[2], splitted[3]].join(""))
      )
    );
  }

  if (
    splitted.length > 1 &&
    (splitted[0].includes(commonArabicDiacritics.sukun) ||
      splitted[1].includes("ت"))
  ) {
    if (splitted.length < 3) {
      return normalizeRootOutput(
        normalizeStem(removeDiacritics([splitted[0], splitted[2]].join("")))
      );
    } else {
      return normalizeRootOutput(
        normalizeStem(
          removeDiacritics([splitted[0], splitted[2], splitted[3]].join(""))
        )
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
    return normalizeRootOutput(
      normalizeStem(
        removeDiacritics([splitted[0], splitted[1], splitted[1]].join(""))
      )
    );
  }

  return "";
};

const getFourthRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (splitted.length > 4) {
    return normalizeRootOutput(
      removeDiacritics([splitted[0], splitted[1], splitted[4]].join(""))
    );
  }

  return "";
};

const getFifthRoot = (word: string) => {
  const StableLetters = [
    "م",
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

  const rootLetters: Array<string> = [];
  let lastStableIndex = 0;

  for (const letter of splitted) {
    const cleanLetter = removeDiacritics(letter);
    if (StableLetters.includes(cleanLetter)) {
      rootLetters.push(cleanLetter);
      lastStableIndex++;
      if (rootLetters.length === 3) {
        break;
      }
    }
  }

  if (rootLetters.length < 3) {
    if (lastStableIndex > 0 && lastStableIndex < splitted.length) {
      rootLetters.push(removeDiacritics(splitted[lastStableIndex]));
    }
  }

  return normalizeRootOutput(normalizeStem(rootLetters.join("")));
};

const getSixthRoot = (word: string) => {
  return normalizeRootOutput(
    splitArabicLetters(removeDiacritics(word)).slice(0, 3).join("")
  );
};

const getSeventhRoot = (word: string) => {
  const letters = splitArabicLetters(removeDiacritics(word));

  if (letters[2] === "ي") {
    letters.splice(2, 1);
  }

  return normalizeRootOutput(letters.slice(0, 3).join(""));
};

const getEighthRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (
    splitted.length > 1 &&
    (splitted[1].includes("ي") ||
      splitted[1].includes("ا") ||
      splitted[1].includes("و"))
  ) {
    return normalizeRootOutput(
      normalizeStem(removeDiacritics(["ا", splitted[0], splitted[2]].join("")))
    );
  }

  return "";
};

const getNinthRoot = (word: string) => {
  const splitted = splitArabicLetters(removeDiacritics(word)).slice(0, 3);

  splitted[0] = normalizeAlif(splitted[0], true);

  if (splitted[0] == "ؤ" || splitted[0] == "ئ") {
    splitted[0] = "ا";
  }

  if (splitted[0] == "ا") {
    splitted[0] = "أ";
  }

  return normalizeRootOutput(splitted.join(""));
};

const getTenthRoot = (word: string) => {
  return replaceMiddleWawWithYa(getFirstRoot(word));
};

export {
  normalizeStem,
  getFirstRoot,
  getSecondRoot,
  getThirdRoot,
  getFourthRoot,
  getFifthRoot,
  getSixthRoot,
  getSeventhRoot,
  getEighthRoot,
  getNinthRoot,
  getTenthRoot,
};
