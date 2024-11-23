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

		for(const t of tokens) {
			console.log(t.toString());
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
