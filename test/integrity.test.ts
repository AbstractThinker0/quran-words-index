import { wordsIndex } from "../src/index";

describe("integrity tests", () => {
  test("Check words num", () => {
    expect(Object.keys(wordsIndex).length).toBe(78248);
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
          loosePrefixes
        );
      }

      expect(currWord.word.startsWith(loosePrefixes)).toBe(true);

      const fullPrefix = loosePrefixes.concat(currWord.bound_prefix);

      const startsWithFull = currWord.word.startsWith(fullPrefix);

      if (!startsWithFull) {
        console.log("word: ", currWord.word, " - full prefix: ", fullPrefix);
      }

      expect(currWord.word.startsWith(fullPrefix)).toBe(true);
    }
  });
});
