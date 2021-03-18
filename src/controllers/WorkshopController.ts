import { Workshop } from "../models/Workshop";
import e, { Request, Response } from "express";
import { controller, use } from "./decorators";
import "../services/passport";
import { requireLogin } from "../middleware/requireLogin";
import { requireAdmin } from "../middleware/requireAdmin";
import { postResponseMessages } from "../controllers/responseMessages/post";
import { putResponseMessages } from "../controllers/responseMessages/put";
import { delResponseMessages } from "../controllers/responseMessages/delete";
import { del, get, post, put } from "./decorators/route";
import uniqid from "uniqid";

@controller("/api/workshop")
class WorkshopController {
  @get("")
  async getAll(_req: Request, res: Response) {
    try {
      const workshops = await Workshop.findAll();
      /*var response: Therapy[];
            workshops.forEach(w => {
                if (w instanceof Workshop) {
                    const { id, name, caption, modality } = w;
                    response.push(w);
                } else {
                    return res.status(404).json({ message: "There is no such workshop" });
                }
            });*/
      return res.status(201).json({ workshops });
    } catch (error) {
      return res.status(404).json({ message: "Internal server error" });
    }
  }

  @post("")
  @use(requireLogin)
  @use(requireAdmin)
  async addWorkshop(req: Request, res: Response) {
    const { workshop } = req.body;

    try {
      const id = uniqid() + uniqid();
      await workshop.save({
        id: id,
        name: workshop.name,
        caption: workshop.caption,
        modality: workshop.modality,
      });
      return res
        .status(404)
        .json({ message: postResponseMessages.workshop_created_successfully });
    } catch (error) {
      return res.status(404).json({ message: postResponseMessages.error_data });
    }
  }

  @put("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async updateWorkshop(req: Request, res: Response) {
    const { new_wsp } = req.body;
    const id = req.params.id;
    const wsp = await Workshop.findOne({ where: { id: id } });
    var name: string = "";
    var caption: string = "";
    var modality: string = "";

    if (new_wsp.name != "") name = new_wsp.name;
    else if (wsp instanceof Workshop) name = wsp.name;

    if (new_wsp.caption != "") caption = new_wsp.caption;
    else if (wsp instanceof Workshop) caption = wsp.caption;

    if (new_wsp.modality != "") modality = new_wsp.modality;
    else if (wsp instanceof Workshop) modality = wsp.modality;

    try {
      await new_wsp.update({
        name: name,
        caption: caption,
        modality: modality,
      });
      return res
        .status(404)
        .json({ message: putResponseMessages.updated_workshop });
    } catch (error) {
      return res.status(404).json({ message: "Internal server error" });
    }
  }

  @del("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async deleteWorkshop(req: Request, res: Response) {
    const id = req.params.id;

    try {
      await Workshop.destroy({
        where: { id: id },
      });
      return res
        .status(404)
        .json({ message: delResponseMessages.workshop_deleted_successfully });
    } catch (error) {
      return res.status(404).json({ message: delResponseMessages.non_deleted });
    }
  }
}
