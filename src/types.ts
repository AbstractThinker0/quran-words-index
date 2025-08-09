export interface QuranWords {
  [wordKey: string]: WordInfo;
}

export interface WordInfo {
  word: string;
  prefixes: string[];
  bound_prefix: string;
  unprefixed: string;

  extracted_root: string;
  extraction_method: string;

  type: "reserved" | "normal" | "initial";
}
