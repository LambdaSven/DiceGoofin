import { TokenType } from './TokenType.js'

export class Token {
	readonly type: TokenType;
	readonly lexeme: string;
	readonly position: number;

	constructor(type: TokenType, lexeme: string, position: number) {
		this.type = type;
		this.lexeme = lexeme;
		this.position = position;
	}

	public toString(): string {
		// SampleEnum[SampleEnum.A]; 
		return `${TokenType[this.type]} ${this.lexeme}, ${this.position}`
	}
}
