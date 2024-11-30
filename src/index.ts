import { AstPrinter } from "./AstPrinter.js";
import { Expr } from "./Expr.js";
import { Interpreter } from "./Interpreter.js";
import { Parser } from "./Parser.js";
import { Scanner } from "./Scanner.js";
import { Token } from "./Token.js";

export class DiceGoofin {
	public static main() {
		if(process.argv.length > 4) {
			console.error('Usage: npm run start [diceExpr]')
		} else if (process.argv.length === 3) {
			return(this.runExpr(process.argv[2]));
		} 
	}

	public static runExpr(input: string) {
		const scanner = new Scanner(input);
		const tokens: Array<Token> = scanner.scanTokens();
		const parser: Parser = new Parser(tokens);
		const interpreter: Interpreter = new Interpreter();

		//for(const t of tokens) {
		//	console.log(t.toString());
		//}

		const tryExpression: Expr | null = parser.parse();
		if(tryExpression !== null) {
			const expression: Expr = tryExpression;
			//console.log(JSON.stringify(expression, null, 2));
			console.log(new AstPrinter().print(expression));
			interpreter.interpret(expression);
		} else {
			console.error('failed to parse');
		}
	}

	public static error(line: number, message: string): void {
		this.report(line, '', message);
	}

	private static report(line: number, where: string, message: string) {
		console.error(`[line: ${line}] ERROR: ${where}: ${message}`);
	}
}



DiceGoofin.main();
