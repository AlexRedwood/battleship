import { Game } from "../gamelogic/game";
import { Renderer } from "../render/renderer";

class Controller {
  game: Game;
  renderer: Renderer;
  shipClicked: boolean;
  placementPhase: boolean;

  constructor(game: Game, renderer: Renderer) {
    this.game = game;
    this.renderer = renderer;
    this.shipClicked = false;
    this.placementPhase = true;

    // bind "this" to handle event listeners
    // if we don't do it, "this" is not gonna be Controller instance inside event listener
    this.toggleShipForPlacement = this.toggleShipForPlacement.bind(this);
  }

  initShipsForPlacement(): void {
    let ships: any[] = Array.from(
      document.getElementsByClassName("ship-placementPhase")
    );

    for (let ship of ships) {
      ship.addEventListener("click", this.toggleShipForPlacement);
    }
  }

  toggleActiveShip(element: HTMLElement): void {
    // console.log(element.parentElement.parentElement);
    console.log(element);
    if (element.classList.contains("active")) {
      element.classList.remove("active");
    } else {
      this.deactivateAllShips();
      element.classList.add("active");
    }
  }

  deactivateAllShips(): void {
    const ships = Array.from(
      document.getElementsByClassName("ship-placementPhase")
    );
    ships.forEach((element: HTMLElement) => {
      element.classList.remove("active");
    });
  }

  toggleShipForPlacement(e: Event) {
    const target = e.currentTarget as HTMLDivElement;
    this.shipClicked = true;
    this.toggleActiveShip(target);

    // initialize board for ships after clicking on one of them
  }
}

export { Controller };
