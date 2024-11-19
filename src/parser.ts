import { Command, Token } from "./tokenizer.js";

export function parse(input: Array<Token>) {
    const result: {value: number, status: boolean}[][] = []
    let scratch: {value: number, status: boolean}[] = []
    let previousToken = null;
    let previous2oken = null;
    for(const t of input) {
        switch(t) {
            case Command.roll:
                break;
            case Command.keep:
                break;
            case Command.drop:
                break;
            case Command.dice:
                break;
            case Command.highest:
                break;
            case Command.lowest:
                break;
            case Command.end:
                result.push(scratch);
                scratch = [];
                break;
            default: 
                if(previousToken === Command.dice) {
                    if(!previous2oken)
                        throw new Error("ParseError")
                    scratch = roll(previous2oken as number, t);
                } else if (previous2oken === Command.keep) {
                    if(previousToken === Command.highest) {
                        const highest = [...scratch.filter(e => e.status === true).map(e => e.value)].sort((a, b) => a - b);
                        for(let i = 0; i < highest.length - t; i++) {
                            scratch.find(e => e.value === highest[i] && e.status === true)!.status = false;
                        }
                    } else if (previousToken === Command.lowest) {
                        const highest = [...scratch.filter(e => e.status === true).map(e => e.value)].sort((a, b) => a - b).reverse();
                        for(let i = 0; i < highest.length - t; i++) {
                            scratch.find(e => e.value === highest[i] && e.status === true)!.status = false;
                        }}
                } else if (previous2oken === Command.drop) {
                    if(previousToken === Command.highest) {
                        const highest = [...scratch.filter(e => e.status === true).map(e => e.value)].sort((a, b) => a - b).reverse();
                        for(let i = 0; i < t; i++) {
                            scratch.find(e => e.value === highest[i] && e.status === true)!.status = false;
                        }} else if (previousToken === Command.lowest) {
                        const highest = [...scratch.filter(e => e.status === true).map(e => e.value)].sort((a, b) => a - b);
                        for(let i = 0; i < t; i++) {
                            scratch.find(e => e.value === highest[i] && e.status === true)!.status = false;
                        }}
                }
                break;
        }
        previous2oken = previousToken;
        previousToken = t;
    }
    result.push(scratch);
    return result;
}

function roll(num: number, dice: number): {value: number, status: boolean}[] {
    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max) + 1;
    }
    const ret: {value: number, status: boolean}[] = []
    for(let i = 0; i < num; i++) {
        ret.push({value: getRandomInt(dice), status: true});
    }
    return ret;
}
