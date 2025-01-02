import { Expr, Binary, Unary, Trinary, Grouping, Literal } from "./Expr.js";
import { Token } from "./Token.js";
import { TokenType } from "./TokenType.js";


/*
With precedence something like...
expression -> equality
equality -> comparison ( ("!=" | "=")) comparison)*
comparison -> term ( (">" | "<" | "<=" | >=") term)\*;
term -> round ( ( "-" | "+" ) round )\*
round -> factor ('f' | 'c')
factor -> explode ( ( "/" | "x" ) unary )\*
explode -> tern '!'
tern -> roll ('k' | 'd') ('l' | 'h') roll
roll -> primary 'd' primary 
primary -> NUMBER | '(' expression ')' 
 */
export class Parser {
	private readonly tokens: Array<Token>;
	private current = 0;

	constructor(tokens: Array<Token>) {
		this.tokens = tokens;
	}

	private expression(): Expr {
		return this.equality();
	}

	parse(): Expr | null {
		try {
			return this.expression();
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	private equality() {
		let expr: Expr = this.comparison();
		while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
			const operator: Token = this.previous();
			const right: Expr = this.comparison();
			expr = new Binary(expr, operator, right);
		}

		return expr;
	}

	private comparison() {
		let expr: Expr = this.term();

		while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL, TokenType.COUNT)) {
			const operator: Token = this.previous();
			const right: Expr = this.term();
			expr = new Binary(expr, operator, right);
		}

		return expr;
	}

	private term() {
		let expr: Expr = this.round()

		while(this.match(TokenType.MINUS, TokenType.PLUS)) {
			const operator: Token = this.previous();
			const right: Expr = this.round();
			expr = new Binary(expr, operator, right)
		}

		return expr;
	}

/*
private explode(): Expr {
    const operand = this.tern(); // Parse the operand first (e.g., "3d6")
    while (this.match(TokenType.EXPLODE)) {
        const operator: Token = this.previous(); // The `!` token
        return new Unary(operator, operand); // Wrap the operand with the unary operator
    }
    return operand; // If there's no `!`, just return the operand
}
 */ 

	private round() {
		const operand = this.factor();
		while(this.match(TokenType.CEILING, TokenType.FLOOR)) {
			const operator: Token = this.previous();
			return new Unary(operator, operand);
		}

		return operand;
	}

	private factor() {
		let expr: Expr = this.explode();

		while(this.match(TokenType.DIVIDE, TokenType.TIMES)) {
			const operator: Token = this.previous();
			const right: Expr = this.explode();
			expr = new Binary(expr, operator, right)
		}

		return expr;
	}

	private explode() {
		const operand = this.tern();
		while(this.match(TokenType.EXPLODE)) {
			const operator: Token = this.previous();
			return new Unary(operator, operand);
		}
		return operand;
	}

	private tern(): Expr {
		let expr: Expr = this.roll();

		while(this.match(TokenType.KEEP, TokenType.DROP)) {
			if(this.peek().type == TokenType.HIGHEST || this.peek().type == TokenType.LOWEST) {
				const operator_one = this.previous();
				this.advance();
				const operator_two = this.previous();
				const right: Expr = this.roll()
				expr = new Trinary(expr, operator_one, operator_two, right);
			} else {
				throw new Error("Keep and Drop must be combined with Highest or Lowest")
			}
		}
		return expr;

	}

	private roll() {
		let expr: Expr = this.primary();

		while(this.match(TokenType.DICE)) {
			const operator: Token = this.previous();
			const right: Expr = this.primary();
			expr = new Binary(expr, operator, right);
		}

		return expr;
	}

	private primary() {
		if(this.match(TokenType.NUMBER)) {
			return new Literal(this.previous().lexeme);
		}

		if(this.match(TokenType.LEFT_PAREN)) {
			const expr: Expr = this.expression();
			this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
			return new Grouping(expr);
		}

		throw new Error(this.peek() + "Expect Expression")
	}

	private consume(type: TokenType, message: string) {
		if(this.check(type)) {
			return this.advance();
		}

		throw new Error(this.peek().toString() + message);
	}
	private match(...types: Array<TokenType>) {
		for(const t of types) {
			if(this.check(t)) {
				this.advance()
				return true;
			}
		}
		return false;
	}

	private check(type: TokenType): boolean {
		if(this.isAtEnd()) {
			return false;
		}
		return this.peek().type == type;
	}

	private advance(): Token {
		if(!this.isAtEnd()) {
			this.current++;
		}
		return this.previous();
	}

	private isAtEnd(): boolean {
		return this.peek().type == TokenType.EOF;
	}

	private peek(): Token {
		return this.tokens[this.current];
	}

	private peek2(): Token{
		if(this.current + 1 > this.tokens.length) {
			return new Token(TokenType.EOF, "EOF", this.current);
		}
		return this.tokens[this.current + 1];
	}

	private previous(): Token {
		return this.tokens[this.current - 1];
	}
}
