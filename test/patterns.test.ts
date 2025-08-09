import { splitArabicLetters } from "quran-tools";
import { wordsIndex } from "../src/index";
import { commonArabicDiacritics } from "../src/consts";
import { getFirstRoot, getThirdRoot } from "../src/rootExtract";

describe("patterns tests", () => {
  test("Check اسْتَ prefix extracted roots", () => {
    for (const wordKey in wordsIndex) {
      const currWord = wordsIndex[wordKey];

      if (currWord.bound_prefix === "اسْتَ") {
        const splittedWord = splitArabicLetters(currWord.unprefixed);

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
      }
    }
  });
});
