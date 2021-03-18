import { Therapy } from "../models/Therapy";
import e, { Request, Response } from "express";
import { controller, use } from "./decorators";
import "../services/passport";
import { requireLogin } from "../middleware/requireLogin";
import { requireAdmin } from "../middleware/requireAdmin";
import { postResponseMessages } from "../controllers/responseMessages/post";
import { delResponseMessages } from "../controllers/responseMessages/delete";
import { putResponseMessages } from "../controllers/responseMessages/put";
import { del, get, post, put } from "./decorators/route";
import uniqid from "uniqid";

@controller("/api/therapy")
class TherapyController {
  @get("")
  async getAll(_req: Request, res: Response) {
    try {
      const therapies = await Therapy.findAll();
      /*var response: Therapy[];
      therapies.forEach(t => {
        if (t instanceof Therapy) {
          const { id, name, description, therapist } = t;
          response.push(t);
        } else {
          return res.status(404).json({ message: "There is no such therapy" });
        }
      });*/
      return res.status(201).json({ therapies });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @post("")
  @use(requireLogin)
  @use(requireAdmin)
  async CreateTherapy(req: Request, res: Response) {
    const { therapy } = req.body;

    try {
      const id = uniqid() + uniqid();
      await therapy.save({
        id: id,
        therapy_name: therapy.name,
        description: therapy.description,
        therapist_id: therapy.therapist_id,
      });

      if (therapy) {
        return res
          .status(201)
          .json({ message: postResponseMessages.therapy_created_successfully });
      } else {
        return res
          .status(401)
          .json({ message: postResponseMessages.incomplete_data });
      }
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @del("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async DeleteTherapy(req: Request, res: Response) {
    const id_t = req.params.id;

    try {
      await Therapy.destroy({
        where: { id: id_t },
      });
      return res
        .status(401)
        .json({ message: delResponseMessages.therapy_deleted_successfully });
    } catch (error) {
      return res.status(501).json({ message: delResponseMessages.non_deleted });
    }
  }

  @put("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async updateTherapy(req: Request, res: Response) {
    const { new_therapy } = req.body;
    const id = req.params.id;
    const therapy = await Therapy.findOne({ where: { id: id } });
    var trp_name: string = "";
    var desc: string = "";
    var ther: number = 0;

    if (new_therapy.name != "") trp_name = new_therapy.name;
    else if (therapy instanceof Therapy) trp_name = therapy.name;

    if (new_therapy.description != "") desc = new_therapy.description;
    else if (therapy instanceof Therapy) desc = therapy.description;

    if (new_therapy.therapist_id != 0) ther = new_therapy.therapist_id;
    else if (therapy instanceof Therapy) ther = therapy.therapist_id;

    try {
      if (therapy instanceof Therapy) {
        await therapy.update({
          name: trp_name,
          description: desc,
          therapist_id: ther,
        });
      }
      return res
        .status(201)
        .json({ message: putResponseMessages.updated_therapy });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }
}
