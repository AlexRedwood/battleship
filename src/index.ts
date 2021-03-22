import "normalize.css";
import { Controller } from "./controller/controller";

import { Game } from "./gamelogic/game";
import { Renderer } from "./render/renderer";

import "./style.scss";

let game = new Game();
let renderer = new Renderer();
let controller = new Controller(game, renderer);

// Initial rendering of empty cells
renderer.renderAllShipsPlacementPhase(game.user.comp);
renderer.renderBoard(game.userBoard);

// Initialize ships for placement
controller.initShipsForPlacement();
