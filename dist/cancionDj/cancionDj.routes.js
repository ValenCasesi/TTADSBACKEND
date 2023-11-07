import { Router } from "express";
import { canciondjMethods } from "./cancionDj.controler.js";
export const cancionDjRouter = Router();
cancionDjRouter.post("/add", canciondjMethods.add);
//# sourceMappingURL=cancionDj.routes.js.map