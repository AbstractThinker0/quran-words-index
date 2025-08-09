import { splitArabicLetters } from "quran-tools";
import { wordsIndex } from "../src/index";
import { commonArabicDiacritics } from "../src/consts";
import { getFirstRoot, getSecondRoot, getThirdRoot } from "../src/rootExtract";

describe("patterns tests", () => {
  test("Check اسْتَ - اسْتِ - اسْتُ - أَسْتَ prefix extracted roots", () => {
    for (const wordKey in wordsIndex) {
      const currWord = wordsIndex[wordKey];
      const splittedWord = splitArabicLetters(currWord.unprefixed);

      if (currWord.bound_prefix === "اسْتَ") {
        if (
          splittedWord.length > 1 &&
          splittedWord[1].includes(commonArabicDiacritics.shadda)
        ) {
          expect(currWord.extracted_root).toBe(
            getThirdRoot(currWord.unprefixed)
          );
        } else {
          expect(currWord.extracted_root).toBe(
            getFirstRoot(currWord.unprefixed)
          );
        }
      } else if (currWord.bound_prefix === "اسْتِ") {
        if (splittedWord.length > 3 && splittedWord[3] === "ءٍ") {
          expect(currWord.extracted_root).toBe(
            getFirstRoot(currWord.unprefixed)
          );
        } else {
          expect(currWord.extracted_root).toBe(
            getSecondRoot(currWord.unprefixed)
          );
        }
      } else if (currWord.bound_prefix === "اسْتُ") {
        expect(currWord.extracted_root).toBe(getFirstRoot(currWord.unprefixed));
      } else if (currWord.bound_prefix === "أَسْتَ") {
        expect(currWord.extracted_root).toBe(getFirstRoot(currWord.unprefixed));
      }
    }
  });
});
