import { splitArabicLetters } from "quran-tools";
import { wordsIndex } from "../src/index";
import { commonArabicDiacritics } from "../src/consts";
import {
  getFifthRoot,
  getFirstRoot,
  getSecondRoot,
  getThirdRoot,
} from "../src/rootExtract";

// Helper function to assert with extra context info on failure
function expectWithInfo(
  actual: string | undefined,
  expected: string | undefined,
  info: string
) {
  if (actual !== expected) {
    throw new Error(`${info}\nExpected: ${expected}\nReceived: ${actual}`);
  }
}

describe("patterns tests", () => {
  test("Check اسْتَ - اسْتِ - اسْتُ - أَسْتَ - انْ - مُسْتَ - يَسْتَ - نَسْتَ - يَنْ - يُسْتَ - يُتَ - يَتَّ - اتَّ prefix extracted roots", () => {
    for (const wordKey in wordsIndex) {
      const currWord = wordsIndex[wordKey];
      const wordWord = wordsIndex[wordKey].word;
      const splittedWord = splitArabicLetters(currWord.unprefixed);
      const errorMsg = `Word: ${wordWord}, Key: ${wordKey}, Prefix: ${currWord.bound_prefix}, Unprefixed: ${currWord.unprefixed}, Extracted: ${currWord.extracted_root}`;

      if (currWord.extraction_method === "5") {
        expectWithInfo(
          currWord.extracted_root,
          getFifthRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "اسْتَ") {
        if (
          splittedWord.length > 1 &&
          splittedWord[1].includes(commonArabicDiacritics.shadda)
        ) {
          expectWithInfo(
            currWord.extracted_root,
            getThirdRoot(currWord.unprefixed),
            errorMsg
          );
        } else {
          expectWithInfo(
            currWord.extracted_root,
            getFirstRoot(currWord.unprefixed),
            errorMsg
          );
        }
      } else if (currWord.bound_prefix === "اسْتِ") {
        if (splittedWord.length > 3 && splittedWord[3] === "ءٍ") {
          expectWithInfo(
            currWord.extracted_root,
            getFirstRoot(currWord.unprefixed),
            errorMsg
          );
        } else {
          expectWithInfo(
            currWord.extracted_root,
            getSecondRoot(currWord.unprefixed),
            errorMsg
          );
        }
      } else if (currWord.bound_prefix === "اسْتُ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "أَسْتَ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "انْ") {
        if (
          splittedWord.length > 1 &&
          splittedWord[1].includes(commonArabicDiacritics.shadda)
        ) {
          expectWithInfo(
            currWord.extracted_root,
            getThirdRoot(currWord.unprefixed),
            errorMsg
          );
        } else if (splittedWord.length > 1 && splittedWord[2] === "ا") {
          expectWithInfo(
            currWord.extracted_root,
            getSecondRoot(currWord.unprefixed),
            errorMsg
          );
        } else {
          expectWithInfo(
            currWord.extracted_root,
            getFirstRoot(currWord.unprefixed),
            errorMsg
          );
        }
      } else if (currWord.bound_prefix === "مُسْتَ") {
        if (
          splittedWord.length > 1 &&
          splittedWord[1].includes(commonArabicDiacritics.shadda)
        ) {
          expectWithInfo(
            currWord.extracted_root,
            getThirdRoot(currWord.unprefixed),
            errorMsg
          );
        } else {
          expectWithInfo(
            currWord.extracted_root,
            getFirstRoot(currWord.unprefixed),
            errorMsg
          );
        }
      } else if (currWord.bound_prefix === "يَسْتَ") {
        if (
          splittedWord.length > 1 &&
          splittedWord[1].includes(commonArabicDiacritics.shadda)
        ) {
          expectWithInfo(
            currWord.extracted_root,
            getThirdRoot(currWord.unprefixed),
            errorMsg
          );
        } else {
          expectWithInfo(
            currWord.extracted_root,
            getFirstRoot(currWord.unprefixed),
            errorMsg
          );
        }
      } else if (currWord.bound_prefix === "نَسْتَ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "يَنْ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "يُسْتَ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "يُتَ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "يَتَّ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.bound_prefix === "اتَّ") {
        expectWithInfo(
          currWord.extracted_root,
          getFirstRoot(currWord.unprefixed),
          errorMsg
        );
      }
    }
  });
});
