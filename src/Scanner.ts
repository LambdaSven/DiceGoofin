import { DiceGoofin } from "./index.js";
import { Token } from "./Token.js";
import { TokenType } from "./TokenType.js";

export class Scanner {
	private readonly source: string;
	private readonly tokens: Token[] = [];
	private start = 0;
	private current = 0;
	private isRoll = false;

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
		const c: string = this.advance();
		switch(c) {
			case 'r':
				this.isRoll = true;
				this.addToken(TokenType.ROLL);
				break;
			case 'd':
				if(this.isRoll) {
					this.addToken(TokenType.DICE)
					this.isRoll = false;
				} else {
					this.addToken(TokenType.DROP);
				}
				break;
			case 'k':
				this.addToken(TokenType.KEEP);
				break;
			case '!':
				this.addToken(TokenType.EXPLODE);
				break;
			case ')':
				this.addToken(TokenType.RIGHT_PAREN);
				break;
			case '(':
				this.addToken(TokenType.LEFT_PAREN);
				break;
			case '[':
				this.addToken(TokenType.LEFT_BRACKET)
				break;
			case ']':
				this.addToken(TokenType.RIGHT_PAREN);
				break;
			default: 
				if(this.isDigit(c)) {
					this.number();
				} else {
					DiceGoofin.error(this.current, 'Unexpected Character');
					break;
				}

		}
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
