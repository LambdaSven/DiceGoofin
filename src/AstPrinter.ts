import { Binary, Expr, Grouping, Literal, Trinary, Unary, Visitor } from "./Expr.js";

export class AstPrinter implements Visitor<string> {
	print(expr: Expr): string {
		return expr.accept(this);
	}
    visitBinaryExpr(expr: Binary): string {
		return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
	}
    visitGroupingExpr(expr: Grouping): string {
		return this.parenthesize("group", expr.expression);
    }
    visitLiteralExpr(expr: Literal): string {
		return expr.value;
    }
    visitUnaryExpr(expr: Unary): string {
		return this.parenthesize(expr.operator.lexeme, expr.right);
    }
    visitTrinaryExpr(expr: Trinary): string {
		let string = `( ${expr.operator_one.lexeme}${expr.operator_two.lexeme}`;
		string += ` ${expr.left.accept(this)}`;
		string += ` ${expr.right.accept(this)})`;
		return string;
	}

	private parenthesize(name: string, ...exprs: Expr[]) {
		let string = `(${name}`;

		for(const e of exprs) {
			string += " ";
			string += e.accept(this);
		}

		string += ')';
		return string;
	}
}
