import { Router } from "express";
import { canciondjMethods } from "./cancionDj.controler.js";
export const cancionDjRouter = Router();
cancionDjRouter.get("/votacion", canciondjMethods.findAllVotacion);
cancionDjRouter.get("/", canciondjMethods.findAll);
cancionDjRouter.post("/", canciondjMethods.add);
//# sourceMappingURL=cancionDj.routes.js.map