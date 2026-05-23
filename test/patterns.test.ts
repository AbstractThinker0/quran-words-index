import { splitArabicLetters } from "quran-tools";
import { wordsIndex } from "../src/index";
import { commonArabicDiacritics } from "../src/consts";
import {
  getEighthRoot,
  getFifthRoot,
  getFirstRoot,
  getFourthRoot,
  getSecondRoot,
  getSeventhRoot,
  getSixthRoot,
  getThirdRoot,
} from "../src/rootExtract";

// Helper function to assert with extra context info on failure
function normalizeTerminalRootLetter(value: string | undefined) {
  if (!value) {
    return value;
  }

  return value.endsWith("ي") ? `${value.slice(0, -1)}ى` : value;
}

function expectWithInfo(
  actual: string | undefined,
  expected: string | undefined,
  info: string
) {
  const normalizedActual = normalizeTerminalRootLetter(actual);
  const normalizedExpected = normalizeTerminalRootLetter(expected);

  if (normalizedActual !== normalizedExpected) {
    throw new Error(`${info}\nExpected: ${expected}\nReceived: ${actual}`);
  }
}

describe("patterns tests", () => {
  test("Check اسْتَ - اسْتِ - اسْتُ - أَسْتَ - انْ - مُسْتَ - يَسْتَ - نَسْتَ - يَنْ - يُسْتَ - يُتَ - يَتَّ - اتَّ prefix extracted roots", () => {
    for (const wordKey in wordsIndex) {
      const currWord = wordsIndex[wordKey];
      if (!currWord) {
        throw new Error(`Missing entry for key: ${wordKey}`);
      }

      const splittedWord = splitArabicLetters(currWord.unprefixed);
      const secondLetter = splittedWord[1];
      const thirdLetter = splittedWord[2];
      const fourthLetter = splittedWord[3];
      const errorMsg = `Word: ${currWord.word}, Key: ${wordKey}, Prefix: ${currWord.bound_prefix}, Unprefixed: ${currWord.unprefixed}, Extracted: ${currWord.extracted_root}`;

      let stem = currWord.unprefixed;

      if (
        currWord.suffix &&
        currWord.suffix !== "pending" &&
        currWord.suffix !== "none"
      ) {
        if (stem.endsWith(currWord.suffix)) {
          stem = stem.slice(0, -currWord.suffix.length);
        }
      }

      if (currWord.extraction_method === "4") {
        expectWithInfo(currWord.extracted_root, getFourthRoot(stem), errorMsg);
      } else if (currWord.extraction_method === "5") {
        expectWithInfo(currWord.extracted_root, getFifthRoot(stem), errorMsg);
      } else if (currWord.extraction_method === "6") {
        expectWithInfo(
          currWord.extracted_root,
          getSixthRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.extraction_method === "7") {
        expectWithInfo(
          currWord.extracted_root,
          getSeventhRoot(currWord.unprefixed),
          errorMsg
        );
      } else if (currWord.extraction_method === "8") {
        expectWithInfo(currWord.extracted_root, getEighthRoot(stem), errorMsg);
      } else if (currWord.bound_prefix === "اسْتَ") {
        if (
          splittedWord.length > 1 &&
          secondLetter?.includes(commonArabicDiacritics.shadda)
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
        if (splittedWord.length > 3 && fourthLetter === "ءٍ") {
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
          secondLetter?.includes(commonArabicDiacritics.shadda)
        ) {
          expectWithInfo(
            currWord.extracted_root,
            getThirdRoot(currWord.unprefixed),
            errorMsg
          );
        } else if (splittedWord.length > 1 && thirdLetter === "ا") {
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
          secondLetter?.includes(commonArabicDiacritics.shadda)
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
          secondLetter?.includes(commonArabicDiacritics.shadda)
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
