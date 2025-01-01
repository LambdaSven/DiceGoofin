## Dice Goofin

This is a small dice-rolling program I made to practice the skills I was learning in Nystrom's [Crafting Interpreters](https://craftinginterpreters.com). 

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
