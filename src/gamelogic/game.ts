import { Board } from "./board";
import { Ship } from "./ship";
import { Player } from "./player";

class Game {
  boardSize: number;
  AIboard: Board;
  userBoard: Board;
  reinitializeCount: number;
  user: Player;
  ai: Player;

  constructor() {
    this.boardSize = 10;
    this.AIboard = new Board({ name: "AI board", size: this.boardSize });
    this.userBoard = new Board({ name: "User board", size: this.boardSize });
    this.reinitializeCount = 0;
    this.user = new Player("Player");
    this.ai = new Player("AI");

    // initialization must be in the end
    this.initRandomShips(); // fill the AIboard with random ships
  }

  getShipComposition() {
    let composition = [
      { name: "carrier", quantity: 1, size: 5 },
      { name: "battleship", quantity: 2, size: 4 },
      { name: "cruiser", quantity: 3, size: 3 },
      { name: "submarine", quantity: 4, size: 2 },
    ];

    return composition;
  }

  createRandomShipConfig(name: string, size: number): any {
    let randomCell = this.AIboard.getRandomAvailableCell(size);
    // return null if there are no empty cells on the board for a ship with certain size
    if (randomCell === null) {
      return null;
    }
    let shipConfig: {
      name: string;
      startCoord: number[];
      size: number;
      direction: string;
    };

    shipConfig = {
      name: name,
      startCoord: randomCell.coord,
      size: size,
      direction: randomCell.direction,
    };

    return shipConfig;
  }

  reinitializeAIBoard() {
    this.reinitializeCount += 1;
    // reset ai board
    this.AIboard.reset();
    // reset ai ships
    this.ai.resetShips();
    // initialize filling with random ships again
    this.initRandomShips();
  }

  initRandomShips() {
    let composition = this.getShipComposition();
    for (let shipComp of composition) {
      for (let i = 0; i < shipComp.quantity; i++) {
        let name = shipComp.name + i.toString();
        let shipConfig = this.createRandomShipConfig(name, shipComp.size);
        // reset board and try to fill it again if there are no empty cells on the board for a ship with certain size
        if (shipConfig === null) {
          this.reinitializeAIBoard();
          return;
        }
        // create a ship from ship config
        let ship = new Ship(shipConfig);
        // place it on the board
        this.AIboard.placeShip(ship);
        // after ship initialization add it to ai ships
        this.ai.addShip(ship);
      }
    }

    this.AIboard.logShipsOnly();
    this.ai.areAllShipsPlaced();
  }
}

export { Game };
