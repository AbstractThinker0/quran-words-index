import { wordsIndex } from "../src/index";
import { removeDiacritics, splitArabicLetters } from "quran-tools";

describe("integrity tests", () => {
  test("Check words num", () => {
    expect(Object.keys(wordsIndex).length).toBe(78248);
  });

  test("Stable letters occur in their word", () => {
    for (const [wordKey, word] of Object.entries(wordsIndex)) {
      if (word.stable_letters === undefined) {
        continue;
      }

      const wordLetters = new Set(
        splitArabicLetters(removeDiacritics(word.word)),
      );
      const invalidLetters = splitArabicLetters(
        removeDiacritics(word.stable_letters),
      ).filter((letter) => !wordLetters.has(letter));

      expect(
        invalidLetters,
        `${wordKey}: "${word.stable_letters}" is not contained in "${word.word}"`,
      ).toEqual([]);
    }
  });

  test("Prefixes integrity", () => {
    for (const wordKey in wordsIndex) {
      const currWord = wordsIndex[wordKey];

      const loosePrefixes = currWord.prefixes.join("");

      const startsWithLoose = currWord.word.startsWith(loosePrefixes);

      if (!startsWithLoose) {
        console.log(
          "word: ",
          currWord.word,
          " - loose prefixes: ",
          loosePrefixes,
        );
      }

      expect(startsWithLoose).toBe(true);

      const fullPrefix = loosePrefixes.concat(currWord.bound_prefix);

      const startsWithFull = currWord.word.startsWith(fullPrefix);

      if (!startsWithFull) {
        console.log("word: ", currWord.word, " - full prefix: ", fullPrefix);
      }

      expect(startsWithFull).toBe(true);

      const hasSuffix =
        currWord.suffix.length > 0 &&
        currWord.suffix !== "none" &&
        currWord.suffix !== "pending";

      if (hasSuffix) {
        const endsWithSuffix = currWord.word.endsWith(currWord.suffix);
        if (!endsWithSuffix) {
          console.log("word: ", currWord.word, " - suffix: ", currWord.suffix);
        }

        expect(endsWithSuffix).toBe(true);
      }
    }
  });
});
