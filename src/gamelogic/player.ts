import { Ship } from "./ship";

class Player {
  name: string;
  ships: Ship[];
  shipQuantity: number;
  lost: boolean;
  comp: { name: string; quantity: number; size: number }[];

  constructor(name: string) {
    this.name = name;
    this.ships = [];
    this.shipQuantity = 10;
    this.lost = false;
    this.comp = [
      { name: "carrier", quantity: 1, size: 5 },
      { name: "battleship", quantity: 2, size: 4 },
      { name: "cruiser", quantity: 3, size: 3 },
      { name: "submarine", quantity: 4, size: 2 },
    ];
  }

  shoot(coord: number[], board: any[][], enemyPlayer: Player): void {
    // error handling
    if (!this.isCoordViableTarget(coord, board)) {
      return;
    }
    // main logic
    let [x, y] = coord;
    board[x][y].isShot = true;

    if (board[x][y].hasShip) {
      console.log(`Ship was hit!`);
      enemyPlayer.getShotAt(coord);
    } else {
      console.log(`Missed.`);
    }
  }

  getShotAt(coord: number[]): void {
    let damagedShipIndex: number = this.ships.findIndex((ship) =>
      ship.coords.some((cell) => cell[0] === coord[0] && cell[1] === coord[1])
    );
    let damagedShip: Ship = this.ships[damagedShipIndex];
    if (damagedShip != undefined) {
      damagedShip.getHit(coord);
    } else {
      console.log(`Couldn't find ship to shoot at. Probably miss.`);
    }
    this.checkIfLost();
  }

  isCoordViableTarget(coord: number[], board: any[][]): boolean {
    let [x, y] = coord;
    if (board[x] === undefined) {
      console.log(
        `Can't shoot in undefined (first coordinate is probably bad)`
      );
      return false;
    }
    if (board[x][y] === undefined) {
      console.log(
        `Can't shoot in undefined. (But [x]: ${x} exists. Second coordinate is probably bad))`
      );
      return false;
    }
    if (board[x][y].isShot === true) {
      console.log(`Can't shoot in the same cell more than once.`);
      return false;
    }
    return true;
  }

  resetShips(): void {
    this.ships = [];
  }

  addShip(ship: Ship): void {
    this.ships.push(ship);
  }

  areAllShipsPlaced(): boolean {
    if (this.ships.length === this.shipQuantity) {
      console.log(
        `Player ${this.name} successfully placed all ${this.shipQuantity} ships.`
      );
      return true;
    }
    return false;
  }

  checkIfLost(): void {
    if (this.ships.every((ship) => ship.sunk)) {
      console.log(
        `Player ${this.name} lost all ${this.shipQuantity} ships and therefore lost the game.`
      );
      this.lost = true;
    }
  }
}

export { Player };
