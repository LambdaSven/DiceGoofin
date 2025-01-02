import { Dice,getFaces } from "./Dice.js";
import { DiceCollection } from "./DiceCollection.js";
import { Binary, Expr, Grouping, Literal, Trinary, Unary, Visitor } from "./Expr.js";
import { DiceGoofin } from "./index.js";
import { TokenType } from "./TokenType.js";

type WrappedNum = {numVal: number};

export class Interpreter implements Visitor<object> {
    interpret(expression: Expr) {
        try {
            const value = this.evaluate(expression);
            //console.log(JSON.stringify(value));
            console.log(this.toString(value));
        } catch (e) {
            throw new Error('ooooppssieeesss' + e)
        }
    }

    toString(v: object): string {
        if(v instanceof DiceCollection) {
            let ret = ``;
            ret += `Roll: ${v.dice.map(e => this.render(e))}`;
            ret += `\nAlive: ${v.dice.filter(e => e.isAlive === true).map(e => e.value)}`
            ret += `\nValue: ${v.sum()}`
            return ret;
        } else {
            return `${(v as WrappedNum).numVal}`;
        }
    }

    render(d: Dice<number>): string {
        if(d.isAlive) {
            if(d.exploded) {
                return d.value + `!!`
            } else {
                return `${d.value}`;
            }
        } else {
            return `~${d.value}~`;
        }
    }

    visitBinaryExpr(expr: Binary): object {
        const left: object = this.evaluate(expr.left);
        const right: object = this.evaluate(expr.right);

        let l: number;
        let r: number;
        if(left instanceof DiceCollection) {
            l = left.sum();
        } else {
            l = (left as WrappedNum).numVal;
        }

        if(right instanceof DiceCollection) {
            r = right.sum();
        } else {
            r = (right as WrappedNum).numVal;
        }

        switch(expr.operator.type) {
            case TokenType.DICE:
                return new DiceCollection(l, getFaces(r));
            case TokenType.TIMES:
                return {numVal: r * l};
            case TokenType.PLUS:
                return {numVal: r + l};
            case TokenType.DIVIDE:
                return {numVal: l / r};
            case TokenType.MINUS:
                return {numVal: r - l};
            case TokenType.EQUAL:
                break;
            case TokenType.NOT_EQUAL:
                break;
            case TokenType.GREATER:
                break;
            case TokenType.GREATER_EQUAL:
                break;
            case TokenType.LESS:
                break;
            case TokenType.LESS_EQUAL:
                break;
            case TokenType.COUNT:
                try {
                    const dice = left as DiceCollection<number>;
                    return {numVal: dice.dice.filter(e => e.value === r).length};
                } catch (e) {
                    throw new Error('oopsie! ' + e)
                }
            default:
        }
        throw new Error('unknown binary error')
    }

    visitGroupingExpr(expr: Grouping): object {
        return this.evaluate(expr.expression);
    }

    private evaluate(expr: Expr): object {
        return expr.accept(this);
    }

    visitLiteralExpr(expr: Literal): object {
        return {numVal: parseInt(expr.value)};
    }

    visitUnaryExpr(expr: Unary): object {
        const right: object = this.evaluate(expr.right);

        switch(expr.operator.type) {
            case TokenType.EXPLODE:
                try {
                    const dice = right as DiceCollection<number>;
                    dice.explode();
                    return dice;
                } catch (e) {
                    DiceGoofin.error(expr.operator.position, 'oopsied - ' + e);
                }
                break;
            case TokenType.FLOOR:
                try {
                    const num = (right as {numVal: number}).numVal;
                    return {numVal: Math.floor(num)};
                } catch (e) {
                    DiceGoofin.error(expr.operator.position, 'oopsied - ' + e)
                }
                break;
            case TokenType.CEILING:
                try {
                    const num = (right as {numVal: number}).numVal;
                    return {numVal: Math.ceil(num)};
                } catch (e) {
                    DiceGoofin.error(expr.operator.position, 'oopsied - ' + e)
                }
                break;
        }

        throw new Error("Unknown Interpretation Error")
    }
    visitTrinaryExpr(expr: Trinary): object {
        const left: DiceCollection<number> = this.evaluate(expr.left) as DiceCollection<number>;
        const right = this.evaluate(expr.right);
        let r: number; 

        if(right instanceof DiceCollection) {
            r = right.sum();
        } else {
            r = (right as WrappedNum).numVal;
        }

        switch(expr.operator_one.type) {
            case TokenType.KEEP:
                switch(expr.operator_two.type) {
                    case TokenType.HIGHEST:
                        left.keep(true, r);
                        return left;
                    case TokenType.LOWEST:
                        left.keep(false, r);
                        return left;
                }
            break;
            case TokenType.DROP:
                switch(expr.operator_two.type) {
                    case TokenType.HIGHEST:
                        left.drop(true, r);
                        return left;
                    case TokenType.LOWEST:
                        left.drop(false, r);
                        return left;
                }
            break;
        }

        throw new Error('Opppppies');
    }

}
