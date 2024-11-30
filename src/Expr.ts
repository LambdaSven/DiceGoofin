/*
expr -> literal | unary | binary | grouping
literal -> NUMBER | "TRUE" | "FALSE"
grouping -> '(' expr ')'
unary -> expr ('!' | 'f' | 'c')
binary -> expression operator expression
ternary -> expression ('k', 'd') ('h', 'l') expression
operator -> 'k' 'h', 'l', 'd', 'x', '+', '/', '-', '=', "!=", '>', '<', '>=', '<=', '#'

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

import { Token } from "./Token.js";

export interface Visitor<T> {
	visitBinaryExpr(expr: Binary): T;
	visitGroupingExpr(expr: Grouping ): T;
	visitLiteralExpr(expr: Literal ): T;
	visitUnaryExpr(expr: Unary ): T;
	visitTrinaryExpr(expr: Trinary): T;
}

export interface Expr {
	accept<T>(visitor: Visitor<T>): T;
}

export class Binary implements Expr {
	readonly left: Expr;
	readonly right: Expr;
	readonly operator: Token;

	constructor(left: Expr, operator: Token, right: Expr) {
		this.left = left;
		this.right = right;
		this.operator = operator;
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitBinaryExpr(this);
	}
}

export class Grouping implements Expr {
	readonly expression: Expr;

	constructor(expression: Expr) {
		this.expression = expression;
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitGroupingExpr(this);
	}
}
export class Literal implements Expr {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitLiteralExpr(this);
	}
}
export class Unary implements Expr {
	readonly right: Expr;
	readonly operator: Token;

	constructor(operator: Token, right: Expr) {
		this.right = right;
		this.operator = operator;
	}

	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitUnaryExpr(this);
	}
}

export class Trinary implements Expr {
	readonly left: Expr;
	readonly right: Expr;
	readonly operator_one: Token;
	readonly operator_two: Token;

	constructor(left: Expr, operator_one: Token, operator_two: Token, right: Expr) {
		this.left = left;
		this.right = right;
		this.operator_one = operator_one;
		this.operator_two = operator_two;
	}

	accept<T>(visitor: Visitor<T>): T{
		return visitor.visitTrinaryExpr(this);
	}
}
