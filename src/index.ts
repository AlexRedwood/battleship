import "normalize.css";

import { Game } from "./gamelogic/game";
import { Renderer } from "./render/render";
import "./style.scss";

let g = new Game();

let renderer = new Renderer();

renderer.renderAllShipsPlacementPhase(g.getShipComposition());
renderer.renderBoard(g.userBoard.state);
