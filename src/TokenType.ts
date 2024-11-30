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

export enum TokenType {
	//literals
	NUMBER, TRUE, FALSE,
	//grouping
	LEFT_PAREN, RIGHT_PAREN, RIGHT_BRACKET, LEFT_BRACKET,
	//unary
	EXPLODE, FLOOR, CEILING,
	//binary
	KEEP, DROP, DICE, HIGHEST, LOWEST, TIMES, PLUS, DIVIDE, MINUS, EQUAL, NOT_EQUAL, LESS, LESS_EQUAL, GREATER, GREATER_EQUAL, COUNT,

	EOF
}
