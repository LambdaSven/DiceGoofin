export class Dice<T> {
    readonly faces: T[];
    isAlive: boolean = true;
    exploded: boolean = false;
    readonly value: T;

    constructor(faces: T[]) {
	this.faces = faces;
	this.value = this.faces[Math.floor(Math.random() * this.faces.length)];
    }

    kill() {
	this.isAlive = false;
    }

    live() {
	this.isAlive = true;
    }

    explode() {
	this.exploded = true;
    }
}

export function getFaces(size: number) {
    const ret: number[] = [];
    for(let i = 1; i <= size; i++) {
	ret.push(i);
    }

    return ret;
}
