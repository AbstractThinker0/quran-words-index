import wordIndexJson from "../quran-words-index.json";
import { QuranWords } from "./types";

const wordsIndex: QuranWords = wordIndexJson as any;

export { wordsIndex };
