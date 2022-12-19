class Planet {
    constructor(name, radius) {
        this.name = name;
        this.radius = radius;
    }

    getSurfaceArea() {
        let serfaceArea = 4 * Math.PI * Math.pow(this.radius, 2);
        console.log(serfaceArea + " square km!");
        return serfaceArea;
    }

    set gravity(value) {
        console.log("Setting value!");
        this._gravity = value;
    }

    get gravity() {
        console.log("Getting value!");
        return this._gravity;
    }
}

class PotatoPlanet extends Planet {
    constructor(name, width, potatoType) {
        super(name, width);
        this.potatoType = potatoType;
    }

    getPotatoType() {
        let thePotato = this.potatoType.toUpperCase() + "!!!!!!";
        console.log(thePotato);
        return thePotato;
    }
}

let spudnik = new PotatoPlanet("Spudnik", 12411, "Russet");
console.log(spudnik);
console.log(spudnik.getSurfaceArea());
spudnik.gravity = 10;