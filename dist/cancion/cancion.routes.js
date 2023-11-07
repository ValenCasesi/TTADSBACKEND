import { Router } from 'express';
import { cancionMethods } from "./cancion.controler.js";
export const cancionRouter = Router();
cancionRouter.get('/', cancionMethods.findAll);
cancionRouter.get("/:id", cancionMethods.findOne);
cancionRouter.post("/", cancionMethods.add);
cancionRouter.put("/:id", cancionMethods.update);
cancionRouter.delete("/:id", cancionMethods.remove);
//# sourceMappingURL=cancion.routes.js.map