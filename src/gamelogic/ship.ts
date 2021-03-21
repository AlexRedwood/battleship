class Ship {
  name: string;
  startCoord: number[];
  size: number;
  direction: string;
  coords: number[][];
  hits: any[];
  sunk: boolean;

  constructor(ship: {
    name: string;
    startCoord: number[];
    size: number;
    direction: string;
  }) {
    let { name, startCoord, size, direction } = ship;
    this.name = name; // "submarine"
    this.startCoord = startCoord; // [0,0]
    this.size = size; // 2
    this.direction = direction; // "x"
    this.coords = []; // [[0,0],[1,0]]
    this.hits = []; // [ { coord: [0,0], hit: false }, { coord: [1,0], hit: false } ]
    this.sunk = false;

    // initialization must be in the end
    this.initialize(); // filling coord and hits arrays
  }

  initialize(): void {
    this.initErrorHandling();
    this.initializeCoords();
    this.initializeHits();
  }

  initializeHits() {
    this.hits = this.coords.map((coord: number[]) => {
      let obj: { coord: number[]; hit: boolean };
      obj = {
        coord: coord,
        hit: false,
      };
      return obj;
    });
  }

  initErrorHandling(): void {
    let possibleDirections = ["x", "y"];
    if (!possibleDirections.includes(this.direction)) {
      console.log(`Direction of ship: "${this.name}" has to be "x" or "y".`);
      return;
    }
    if (this.size <= 0) {
      console.log(
        `Size of ship: "${this.name}" can't be less than or equal 0.`
      );
      return;
    }
    if (this.startCoord[0] < 0 || this.startCoord[1] < 0) {
      console.log(
        `One of the starting coord (either x or y) of ship: "${this.name}" can't be less than 0.`
      );
      return;
    }
  }

  initializeCoords(): void {
    // get ship coords, for e.g. from [0,1], size 3, direction "x" to [[0,0],[1,0],[2,0]]
    let shipCoords: number[][] = [];
    shipCoords.push(this.startCoord); // push starting cell (point) of the ship
    for (let i = 0; i < this.size - 1; i++) {
      // this.size - 1 because we already pushed startCoord
      let nextCoord: number[] = []; // next ship cell to create
      let lastCoords: number[] = shipCoords[shipCoords.length - 1]; // get last ship cell
      nextCoord.push(lastCoords[0]); // pushing X coordinate
      nextCoord.push(lastCoords[1]); // pushing Y coordinate
      if (this.direction === "x") {
        // add + 1 to either X or Y dependning on ship direction
        nextCoord[0] = nextCoord[0] + 1; // adding to first element when Y because Y is first in arrays, then X
      } else {
        nextCoord[1] = nextCoord[1] + 1;
      }
      shipCoords.push(nextCoord);
    }
    this.coords = shipCoords;
  }

  getHit(coord: number[]): void {
    let [x, y] = coord;
    let hitCellIndex: number = this.hits.findIndex((item) => {
      return item.coord[0] === x && item.coord[1] === y;
    });
    this.hits[hitCellIndex].hit = true;
    this.checkIfSunk();
  }

  checkIfSunk(): void {
    let isSunk: boolean = this.hits.every((obj) => obj.hit === true);
    if (isSunk) {
      console.log(`Ship ${this.name} was sunk...`);
      this.sunk = true;
    }
  }
}

export { Ship };
