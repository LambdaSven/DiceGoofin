/*
expr -> literal | unary | binary | grouping
literal -> NUMBER | "TRUE" | "FALSE"
grouping -> '(' expr ')'
unary -> expr ('!' | 'f' | 'c')
binary -> expression operator expression
operator -> 'k' 'h', 'l', 'd', 'x', '+', '/', '-', '=', "!=", '>', '<', '>=', '<=', '#'

With precedence something like...
expression -> equality
equality -> comparison ( ("!=" | "=")) comparison)*
comparison -> term ( (">" | "<" | "<=" | >=") term)\*;
term -> factor ( ( "-" | "+" ) factor )\*
factor -> unary ( ( "/" | "x" ) unary )\*
unary -> primary ('!' | 'f' | 'c')\* | primary;
primary -> NUMBER | '(' expression ')'
*/
import { DiceGoofin } from "./index.js";
import { Token } from "./Token.js";
import { TokenType } from "./TokenType.js";

export class Scanner {
	private readonly source: string;
	private readonly tokens: Token[] = [];
	private start = 0;
	private current = 0;
	private isRoll = [true];

	constructor(source: string) {
		this.source = source
	}

	scanTokens(): Token[] {
		while(!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}

		this.tokens.push(new Token(TokenType.EOF, 'EOF', this.current));
		return this.tokens;
	}

	isAtEnd() {
		return this.current >= this.source.length;
	}

	private scanToken(): void {
		//console.log(this.isRoll);
		const c: string = this.advance();
		switch(c) {	
			case 'k':
				this.addToken(TokenType.KEEP);
				break;
			case 'h':
				this.addToken(TokenType.HIGHEST);
				break;
			case 'l':
				this.addToken(TokenType.LOWEST);
				break;
			case 'd':
				if(this.isRoll[this.isRoll.length - 1]) {
					this.isRoll[this.isRoll.length - 1] = false;
					this.addToken(TokenType.DICE);
				} else {
					this.addToken(TokenType.DROP);
				}
				break;
			case 'x':
				this.isRoll[this.isRoll.length - 1] = true;
				this.addToken(TokenType.TIMES);
				break;
			case '+':
				this.isRoll[this.isRoll.length - 1] = true;
				this.addToken(TokenType.PLUS);
				break;
			case '/':
				this.isRoll[this.isRoll.length - 1] = true;
				this.addToken(TokenType.DIVIDE);
				break;
			case '-':
				this.isRoll [this.isRoll.length - 1] = true;
				this.addToken(TokenType.MINUS);
				break;
			case '=':
				this.isRoll [this.isRoll.length - 1] = true;
				this.addToken(TokenType.EQUAL);
				break;
			case '>':
				this.isRoll [this.isRoll.length - 1] = true;
				this.addToken(this.match('=')? TokenType.GREATER_EQUAL : TokenType.GREATER);
				break;
			case '<':
				this.isRoll [this.isRoll.length - 1] = true;
				this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
				break;
			case '#':
				this.isRoll [this.isRoll.length - 1] = true;
				this.addToken(TokenType.COUNT);
				break;
			case '(':
				this.isRoll.push(true);
				this.addToken(TokenType.LEFT_PAREN);
				break;
			case ')':
				this.isRoll.pop();
				this.addToken(TokenType.RIGHT_PAREN);
				break;
			case '[':
				this.addToken(TokenType.LEFT_BRACKET);
				break;
			case ']':
				this.addToken(TokenType.RIGHT_BRACKET);
				break;
			case '!':
				this.addToken(this.match('=') ? TokenType.NOT_EQUAL : TokenType.EXPLODE);
				break;
			case 'f':
				this.addToken(TokenType.FLOOR);
				break;
			case 'c':
				this.addToken(TokenType.CEILING);
				break;
			case ' ':
				break;
			default:
				if (this.isDigit(c)) {
					this.number()
				} else {
					DiceGoofin.error(this.current, "Unexpected Character")
				}
				
		}
	}

	private match(expected: string):boolean {
		if(this.isAtEnd())
			return false;
		if(this.source[this.current] != expected)
			return false;
		this.current++;
		return true;
	}
	private advance(): string {
		return this.source[this.current++];
	}

	private addToken(type: TokenType): void {
		const text: string = this.source.substring(this.start, this.current);
		this.tokens.push(new Token(type, text, this.current));
	}

	private peek(): string {
		if(this.isAtEnd()) {
			return '\0'
		}
		return this.source[this.current]
	}

	private isDigit(s: string): boolean {
		const c = s[0]
		return (c >= '0' && c <= '9')
	}

	private number() {
		while(this.isDigit(this.peek())) {
			this.advance();
		}
		this.addToken(TokenType.NUMBER)
	}
}
