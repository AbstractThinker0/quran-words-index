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
    word.length > 2 &&
    (word.endsWith("وا") ||
      word.endsWith("ونِ") ||
      word.endsWith("تُمُ") ||
      word.endsWith("وهُ") ||
      word.endsWith("ينَ") ||
      word.endsWith("تُنَّ"))
  ) {
    return splitted.slice(0, splitted.length - 2).join("");
  }

  if (word.length > 2 && (word.endsWith("وْا") || word.endsWith("ونَ"))) {
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

  return word;
};

const getFirstRoot = (word: string) => {
  const splitted = splitArabicLetters(extractSuffix(word));

  if (
    splitted.length > 1 &&
    splitted[0].includes("ت") &&
    splitted[1].includes("خ")
  ) {
    return removeDiacritics(["أ", splitted[1], splitted[2]].join(""));
  }

  if (
    splitted.length > 1 &&
    splitted[0].includes("خ") &&
    splitted[1].includes("ذ")
  ) {
    return removeDiacritics(["أ", splitted[0], splitted[1]].join(""));
  }

  if (splitted.length > 1 && splitted[1].includes("ا")) {
    return removeDiacritics([splitted[0], "و", splitted[2]].join(""));
  }

  if (
    splitted.length > 1 &&
    splitted[1].includes(commonArabicDiacritics.sukun)
  ) {
    return removeDiacritics([splitted[0], "و", splitted[1]].join(""));
  }

  if (
    splitted.length > 2 &&
    (splitted[2].includes("تْ") || splitted[2] === "ا")
  ) {
    return removeDiacritics([splitted[0], splitted[1], "ى"].join(""));
  }

  if (
    splitted.length > 1 &&
    !splitted[0].includes("ب") &&
    splitted[1] === "ي"
  ) {
    return removeDiacritics([splitted[0], "و", splitted[2]].join(""));
  }

  if (splitted.length > 1 && splitted[1] === "يُ") {
    return removeDiacritics([splitted[0], splitted[1], "ى"].join(""));
  }

  if (splitted.length > 1 && splitted[1] === "فٍ") {
    return removeDiacritics([splitted[0], splitted[1], "ى"].join(""));
  }

  if (splitted.length === 2 && splitted[1] === "تُ") {
    return removeDiacritics([splitted[0], splitted[1], "ى"].join(""));
  }

  if (splitted.length === 2 && splitted[1] === "فُ") {
    return removeDiacritics([splitted[0], splitted[1], "ى"].join(""));
  }

  if (splitted.length > 2 && splitted[2].includes("ئ")) {
    splitted[2] = "ء";
  }

  const firstThreeLetters = splitted.slice(0, 3).join("");

  return removeDiacritics(firstThreeLetters);
};

const getSecondRoot = (word: string) => {
  const splitted = splitArabicLetters(word);

  if (
    splitted.length > 2 &&
    (splitted[2].includes("ي") ||
      splitted[2].includes("ا") ||
      splitted[2].includes("و"))
  ) {
    return removeDiacritics([splitted[0], splitted[1], splitted[3]].join(""));
  }

  if (
    splitted.length > 1 &&
    (splitted[1].includes("ي") ||
      splitted[1].includes("ا") ||
      splitted[1].includes("و"))
  ) {
    return removeDiacritics([splitted[0], splitted[2], splitted[3]].join(""));
  }

  if (
    splitted.length > 1 &&
    (splitted[0].includes(commonArabicDiacritics.sukun) ||
      splitted[1].includes("ت"))
  ) {
    if (splitted.length < 3) {
      return removeDiacritics([splitted[0], splitted[2]].join(""));
    } else {
      return removeDiacritics([splitted[0], splitted[2], splitted[3]].join(""));
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
    return removeDiacritics([splitted[0], splitted[1], splitted[1]].join(""));
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

export { getFirstRoot, getSecondRoot, getThirdRoot, getFourthRoot };
