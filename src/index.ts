import { parse } from "./parser.js";
import { tokenize } from "./tokenizer.js";

const test = "r10d20kh2dl1" 
const t = tokenize(test)
console.log(test)
console.log(JSON.stringify(t))

const parsed = parse(t)
console.log("PARSE\n", JSON.stringify(parsed, null, 2))
