import { Router } from "express";
import { canciondjMethods } from "./cancionDj.controler.js";

export const cancionDjRouter = Router();

cancionDjRouter.get("/votacion", canciondjMethods.findAllActuales);
cancionDjRouter.get("/fechas", canciondjMethods.findAllFechas);
cancionDjRouter.get("/nuevanoche", canciondjMethods.nuevaNoche);
cancionDjRouter.get("/topcanciones/:fechaElegida", canciondjMethods.findAllTopCanciones);
cancionDjRouter.get("/:uidDj", canciondjMethods.findDjPuntual);
cancionDjRouter.get("/", canciondjMethods.findAll);
cancionDjRouter.put("/votacion/:id", canciondjMethods.sumarVoto);
cancionDjRouter.put("/:id", canciondjMethods.update);
cancionDjRouter.post("/", canciondjMethods.add);
cancionDjRouter.delete("/:id", canciondjMethods.deleteOne);
cancionDjRouter.delete("/", canciondjMethods.deleteAll);
