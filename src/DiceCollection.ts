import { Dice } from "./Dice.js";

export class DiceCollection<T> {
    readonly dice: Dice<T>[];
    readonly faces: T[];
    
    constructor(count: number, faces: T[]) {
	const dice: Dice<T>[] = []
	for(let i = 0; i < count; i++) {
	    dice.push(new Dice(faces));
	}
	this.dice = dice;
	this.faces = faces;
    }

    keep(highest: boolean, count: number): void {
	this.dice.forEach(e => e.kill());
	for(let i = 0; i < count; i++) {
	    if(highest) {
		const m = Math.max(...this.dice.filter(e => e.isAlive === false).map(e => e.value as number));
		const d = this.dice.find(e => e.value === m && !e.isAlive)
		if(d) {
		    d.live();
		} else {
		    throw new Error("could not find dice to live");
		}
	    } else {
		const l = Math.min(...this.dice.filter(e => e.isAlive === false).map(e => e.value as number));
		const d = this.dice.find(e => e.value === l && !e.isAlive);
		if(d) {
		    d.live();
		} else {
		    throw new Error("could not find dice to live");
		}
	    } 
	}
    }

    drop(highest: boolean, count: number): void {
	for(let i = 0; i < count; i++) {
	    if(highest) {
		const m = Math.max(...this.dice.filter(e => e.isAlive === true).map(e => e.value as number));
		const d = this.dice.find(e => e.value === m && e.isAlive)
		if(d) {
		    d.kill();
		} else {
		    throw new Error("could not find dice to kill");
		}
	    } else {
		const l = Math.min(...this.dice.filter(e => e.isAlive === true).map(e => e.value as number));
		const d = this.dice.find(e => e.value === l && e.isAlive);
		if(d) {
		    d.kill();
		} else {
		    throw new Error("could not find dice to kill");
		}
	    } 
	}

    }

    explode() {
	for(const d of this.dice) {
	    if(d.value === Math.max(...d.faces.map(e => e as number)) && d.exploded === false) {
		this.dice.push(new Dice(this.faces));
		d.explode();
		this.explode();
	    }
	}
    }

    sum(): number {
	return this.dice.filter(e => e.isAlive === true).map(e => e.value as number).reduce((partialSum, a) => partialSum + a, 0);
    }
}
