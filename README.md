## Dice Goofin

This is a small dice-rolling program I made to practice the skills I was learning in Nystrom's [Crafting Interpreters](https://craftinginterpreters.com). 

Usage: `npm run start {diceExpr}`

This almost certainly could be impelemented better (Using Java code as a basis for a TS implementation creates some awkward TS code), however it was useful to solidify my understanding of various concepts - particularly Recursive Descent Parsing.

I might write an article about this goof some day.

Currently, the program simply takes 1 param, which is the dice expression. The dice uses the standard `ndx` format, where `n, x: Integer`. It also takes the following terms,
- (d)rop
- (k)eep
- (h)ighest
- (l)owest
- ! - Explode

For example, you could roll a 20 sided dice with the expression `1d20`. If you would like to drop the lowest 1 dice of 4d6, you could invoke `4d6dl1`. Explode re-rolls all dice that hit their max value.

You can also parenthesize expressions, for something like `(1d4)d100`, which is useful for rolling on loot tables.

It also supports basic math operations, `[+, -, /, x]`. So youc an perform `1d20 + 5` or `2d20kh1 + 1d4 + 5`. This will return a float, but in most dice systems you will want to round, which you can do with the optional `f` or `c` to specify floor or ceiling, as in `1d20/2f`.

In many systems, you also might want to Count the number of successes, so this supports the `#` operator for that. This operator only works for exact matches, not conditions. For example, `6d6#6` will return the number of 6s in the roll.
