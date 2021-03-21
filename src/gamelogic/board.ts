import { Ship } from "./ship";

class Board {
  name: string;
  state: any[];
  size: number;

  constructor(data: { name: string; size: number }) {
    this.name = data.name;
    this.state = [];
    this.size = data.size;

    // initialization filling the state array
    this.initialize(this.size);
  }

  initialize(size: number): void {
    // init cells
    for (let i = 0; i < size; i++) {
      let row: any[] = [];
      for (let j = 0; j < size; j++) {
        row.push({
          coord: [i, j],
          hasShip: false,
          isShot: false,
          placeable: true,
        });
      }
      this.state.push(row);
    }
  }

  reset(): void {
    // reset state to empty array and refill with cells
    this.state = [];
    this.initialize(this.size);
  }

  getRandomNotShotCell(): number[] {
    // for e.g. [[9,4]],[9,5],[9,6],[9,7]]  // return [9,5]
    let notShotCells = this.getNotShotCells();
    return this.getRandomItemFromArr(notShotCells);
  }

  getNotShotCells(): number[][] {
    // get all cells which weren't shot on the board state
    // for e.g. [[9,4]],[9,5],[9,6],[9,7]]
    let result: number[][] = [];

    for (let row of this.state) {
      for (let cell of row) {
        if (cell.isShot === false) {
          result.push(cell.coord);
        }
      }
    }
    //console.log(result);
    return result;
  }

  getRandomAvailableCell(shipSize: number) {
    let availableCells = this.getPossiblePositionsForBothDirs(shipSize);
    if (availableCells.length < 1) return null;
    return this.getRandomItemFromArr(availableCells);
  }

  getRandomItemFromArr(arr: any[]) {
    let len: number = arr.length;
    let randomNumber: number = Math.floor(Math.random() * len);
    let result: any = arr[randomNumber];

    return result;
  }

  getPossiblePositionsForBothDirs(shipSize: number): any[] {
    let horizontal: string = "x";
    let vertical: string = "y";

    let result = [
      ...this.getPossiblePositionsForSizeAndDir(shipSize, horizontal),
      ...this.getPossiblePositionsForSizeAndDir(shipSize, vertical),
    ];
    return result;
  }

  getPossiblePositionsForSizeAndDir(
    shipSize: number,
    shipDirection: string
  ): any[] {
    // return array with available coords and direction for a ship with certain size
    // for e.g. [{coord: [1,3], direction: "x"},{coord: [1,4], direction: "x"},{{coord: [5,5], direction: "y"}}]
    let availableCells: number[][] = this.getPlaceableCoords(); // 2d array with coordinates for e.g. [[1,2], [1,3]]
    let result: any[] = [];

    for (let cell of availableCells) {
      // fill the result array with objects
      let obj: { coord?: number[]; direction?: string } = {};
      //console.log(cell);
      if (this.isCoordAvailableForShip(cell, shipSize, shipDirection)) {
        obj.coord = cell;
        obj.direction = shipDirection;
        result.push(obj);
      }
    }
    //console.log(result);
    return result;
  }

  getPlaceableCoords(): number[][] {
    // get all emptry cells (placeable === true) from the board state
    // for e.g. [[9,4]],[9,5],[9,6],[9,7]]
    let availableCells: number[][] = [];

    for (let arr of this.state) {
      for (let cell of arr) {
        if (cell.placeable === true) {
          availableCells.push(cell.coord);
        }
      }
    }
    //console.log(availableCells);
    return availableCells;
  }

  isCoordAvailableForShip(
    startCoord: number[],
    size: number,
    direction: string
  ): boolean {
    // function recursively checks every cell, if they are placeable for a ship with certain size
    let [x, y] = startCoord;
    //console.log(`Depth: ${size}.`)

    // if cell is not placeable return false
    // otherwise go to the next cell recursively and check it until depth is equal to 1
    if (!this.isCellPlaceable(startCoord)) return false;

    if (size === 1) {
      // Minimum depth is 1. If it's reached return true (if any of the cells is not placeable, function cant reach depth 1)
      //console.log(`Min depth: ${size} is reached.`)
      return true;
    }

    let newCoord: number[] =
      direction === "x" // check next cell
        ? [x + 1, y]
        : [x, y + 1];
    let newSize: number = size - 1; // decrease size (works also like recursion depth)

    let placeability: boolean = this.isCoordAvailableForShip(
      newCoord,
      newSize,
      direction
    );

    return placeability; // true/false
  }

  getName(): string {
    return this.name;
  }

  logShipsOnly(): void {
    let show = [];
    for (let arr of this.state) {
      let row = [];
      for (let obj of arr) {
        let cell = "| |";
        if (!obj.placeable) cell = "| |";
        if (obj.hasShip) cell = "|O|";
        if (obj.isShot && obj.hasShip) cell = "|K|";
        if (obj.isShot && !obj.hasShip) cell = "|M|";
        row.push(cell);
      }
      show.push(row);
    }
    console.log(show);
  }

  log(): void {
    let show = [];
    for (let arr of this.state) {
      let row = [];
      for (let obj of arr) {
        let cell = "| |";
        if (!obj.placeable) cell = "|X|";
        if (obj.hasShip) cell = "|O|";
        if (obj.isShot && obj.hasShip) cell = "|K|";
        if (obj.isShot && !obj.hasShip) cell = "|M|";
        row.push(cell);
      }
      show.push(row);
    }
    console.log(show);
  }

  placeAll(ships: any[]): void {
    for (let ship of ships) {
      this.placeShip(ship);
    }
  }

  placeShip(ship: Ship): void {
    // check if can place a ship
    if (!this.isShipPlaceable(ship.coords)) {
      console.log(`The whole ship: ${ship.coords} - is unplaceable.`);
      return;
    }
    // place it
    for (let coord of ship.coords) {
      this.placeShipCell(coord);
    }
    // make surroundings (and ship's cells too) unplaceable
    this.makeAllNearbyCellsUnplaceable(ship.coords);
  }

  placeShipCell(coord: number[]): void {
    // one cell of the ship
    let [x, y] = coord;
    this.state[x][y].hasShip = true;
  }

  isShipPlaceable(coords: number[][]): boolean {
    // whole ship
    for (let coord of coords) {
      if (!this.isCellPlaceable(coord)) return false;
    }
    return true;
  }

  isCellPlaceable(coord: number[]): boolean {
    // one cell of the ship
    let [x, y] = coord;
    // check exists
    if (!this.doesExist(coord)) {
      //console.log(`Location x:${x}, y:${y} does not exist. It's not possible to place something there.`);
      return false;
    }
    // check placeability
    if (!this.state[x][y].placeable) {
      // check for another ship
      if (this.state[x][y].hasShip) {
        //console.log(`Location x:${x}, y:${y} has ship. Can't insert to those cells.`);
      } else {
        //console.log(`Location x:${x}, y:${y} doesn't have ship. But you can't insert too close to other ships.`);
      }
    } else {
      //console.log(`Location x:${x}, y:${y} is good (placeable).`);
    }
    let result: boolean = this.state[x][y].placeable;
    return result;
  }

  makeAllNearbyCellsUnplaceable(coords: number[][]): void {
    // around whole ship
    for (let coord of coords) {
      this.makeNearbyCellsUnplaceable(coord);
    }
  }

  makeNearbyCellsUnplaceable(coord: number[]) {
    // around one cell
    let [x, y] = coord;
    let nearbyXCoord: number[] = [x, x + 1, x - 1];
    let nearbyYCoord: number[] = [y, y + 1, y - 1];

    // find all cell combinatons from coordinates above
    let combos = this.getCombos(nearbyXCoord, nearbyYCoord);

    for (let combo of combos) {
      //console.log(`Making cell x:${combo[0]}, y:${combo[1]} unplaceable.`)
      if (this.doesExist(combo))
        this.state[combo[0]][combo[1]].placeable = false;
    }
  }

  getCombos(arr1: any[], arr2: any[]) {
    // get all possible combinations of elements from 2 arrays (x and y coordinates)
    // return a 2d array with those combinations
    let combos: any[] = [];
    for (let x of arr1) {
      for (let y of arr2) {
        combos.push([x, y]);
      }
    }
    return combos;
  }

  doesExist(coord: number[]): boolean {
    let [x, y] = coord;
    if (this.state[x] === undefined || this.state[x][y] === undefined) {
      return false;
    } else {
      return true;
    }
  }
}

export { Board };
