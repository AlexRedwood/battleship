import { Board } from "../gamelogic/board";

class Renderer {
  renderBoard(board: Board): void {
    let boardElement = document.getElementsByClassName("user-board")[0];

    for (let row of board.state) {
      for (let obj of row) {
        let cell = document.createElement("div");
        cell.classList.add("user-cell");
        if (board.name === "Player" && obj.hasShip && !obj.isShot)
          cell.classList.add("user-shipcell");
        if (board.name === "Player" && !obj.hasShip && !obj.placeable)
          cell.classList.add("cell-unplaceable");
        if (obj.hasShip && obj.isShot) cell.classList.add("hit");
        if (!obj.hasShip && obj.isShot) cell.classList.add("miss");

        cell.setAttribute("id", `${obj.coord[0]}-${obj.coord[1]}`);
        boardElement.appendChild(cell);
      }
    }
  }

  renderAllShipsPlacementPhase(
    composition: {
      name: string;
      quantity: number;
      size: number;
    }[]
  ): void {
    for (let shipData of composition) {
      this.renderShipPlacementPhase(shipData);
    }
  }

  renderShipPlacementPhase(shipData: {
    name: string;
    quantity: number;
    size: number;
  }) {
    let { name, quantity, size } = shipData;
    let shipContainer = document.getElementById(name);
    let shipTemplate = shipContainer.children[0]; // div to display a ship
    let shipQuantity = shipContainer.children[1]; // div to display quantity of ships

    let ship = this.createShipPlacementPhase(size); // create ship with size
    shipTemplate.appendChild(ship);
    shipQuantity.textContent = `x ${quantity}`;
  }

  createShipPlacementPhase(shipSize: number): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("ship-placementPhase");
    div.classList.add("df");
    div.draggable = true;
    for (let i = 0; i < shipSize; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell-placementPhase");
      div.appendChild(cell);
    }
    return div;
  }
}

export { Renderer };
