export enum Command {
    roll = "roll",
    keep = "keep",
    drop = "drop",
    dice = "dice",
    highest = "highest",
    lowest = "lowest",
    end = "end",
}

export type Token = 
    number 
    | Command;

function isDigit(char: string): boolean {
    return /^\d$/.test(char)
}

//parse through string, turning into tokens
export function tokenize(input: string): Array<Token> {
    let stack = '';
    let isDice = true;
    const ret: Array<Token> = []
    const pushStack = () => {
        if(stack != '')
            ret.push(parseInt(stack)); 
        stack = ''
    }
    
    for(const c of input) {
        switch(c) {
            case 'r':
                pushStack();
                ret.push(Command.roll)
                break;
            case 'k':
                pushStack();
                ret.push(Command.keep)
                break;
            case 'd':
                pushStack();
                if(isDice) {
                    isDice = false;
                    ret.push(Command.dice)
                } else {
                    ret.push(Command.drop)
                }
                break;
            case 'h':
                pushStack();
                ret.push(Command.highest)
                break;
            case 'l':
                pushStack();
                ret.push(Command.lowest)
                break;
            case ';':
                pushStack();
                isDice = true;
                break;
            default:
                if(isDigit(c)) {
                    stack += c
                } else {
                    throw new Error('Encountered something that was not a command nor a Digit.')
                }
        }
    }
    pushStack();
    return ret;
}
