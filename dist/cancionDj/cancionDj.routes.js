import { Router } from "express";
import { canciondjMethods } from "./cancionDj.controler.js";
export const cancionDjRouter = Router();
cancionDjRouter.put("/:id/votacion", canciondjMethods.update);
cancionDjRouter.get("/votacion", canciondjMethods.findAllVotacion);
cancionDjRouter.get("/", canciondjMethods.findAll);
cancionDjRouter.post("/", canciondjMethods.add);
cancionDjRouter.get("/topcanciones/:fechaElegida", canciondjMethods.findAllTopCanciones);
cancionDjRouter.delete("/", canciondjMethods.deleteAll);
cancionDjRouter.get("/nuevanoche", canciondjMethods.nuevaNoche);
//# sourceMappingURL=cancionDj.routes.js.map