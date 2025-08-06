export interface QuranWords {
  [wordKey: string]: WordInfo;
}

export interface WordInfo {
  word: string;
  prefixes: string[];
  bound_prefix: string;
  unprefixed: string;
  type: "reserved" | "normal" | "initial";
}
