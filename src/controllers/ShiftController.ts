import { Shift } from "../models/Shift";
import { User } from "../models/User";
import { Therapy } from "../models/Therapy";
import e, { Request, Response } from "express";
import { controller, use } from "./decorators";
import "../services/passport";
import { requireLogin } from "../middleware/requireLogin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireSameUser } from "../middleware/requireSameUser";
import { postResponseMessages } from "./responseMessages/post";
import { delResponseMessages } from "./responseMessages/delete";
import { putResponseMessages } from "./responseMessages/put";
import { del, get, post, put } from "./decorators/route";
import uniqid from "uniqid";

@controller("/api/shift")
class ShiftController {
  @get("")
  @use(requireLogin)
  @use(requireAdmin)
  async getAll(_req: Request, res: Response) {
    try {
      const shifts = await Shift.findAll();
      /*    var response: Shift[];

            shifts.forEach(s => {
                if(s instanceof Shift) {
                    const {id, therapy_id, date, patient_id, patient_name, status } = s;
                    response.push(s);
                } else {
                    return res.status(501).json({ message: "Internal server error" });
                }
            });*/
      return res.status(201).json({ shifts });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @get("/:id")
  @use(requireLogin)
  @use(requireSameUser)
  async getUserShifts(req: Request, res: Response) {
    const id = req.params.id;

    const shifts = await Shift.findAll({ where: { patient_id: id } });
    try {
      /* var response: Shift[];

            shifts.forEach(s => {
                if(s instanceof Shift) {
                    const {id, therapy_id, date, patient_id, patient_name, status } = s;
                    response.push(s);
                } else {
                    return res.status(501).json({ message: "Internal server error" });
                }
            });*/
      return res.status(201).json({ shifts });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @post("")
  @use(requireLogin)
  async addShift(req: Request, res: Response) {
    const { shift } = req.body;

    try {
      const id = uniqid() + uniqid();
      await shift.save({
        id: id,
        therapy_id: shift.therapy_id,
        date: shift.date,
        patient_id: shift.patient_id,
        patient_name: shift.patient_name,
        status: shift.status,
      });
      if (shift.status == 0) {
        this.notifyShiftRequest(shift);
      } else if (shift.patient_id != 0) {
        this.notifyShiftAccepted(shift);
      }
      return res
        .status(501)
        .json({ message: postResponseMessages.shift_created_successfully });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @del("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async deleteShift(req: Request, res: Response) {
    const id = req.params.id;

    try {
      await Shift.destroy({
        where: { id: id },
      });
      return res
        .status(501)
        .json({ message: delResponseMessages.shift_deleted_successfully });
    } catch (error) {
      return res.status(501).json({ message: delResponseMessages.non_deleted });
    }
  }

  @put("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async confirmShift(req: Request, res: Response) {
    const id = req.params.id;

    const shift = await Shift.findOne({ where: { id: id } });
    try {
      if (shift instanceof Shift) {
        shift.update({
          status: 1,
        });
        this.notifyShiftAccepted(shift);
      }
      return res
        .status(501)
        .json({ message: putResponseMessages.confirmed_shift });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  async notifyShiftRequest(shift: Shift) {
    const subject = "shift";
    const patient = await User.findOne({ where: { id: shift.patient_id } });
    const therapy = await Therapy.findOne({ where: { id: shift.therapy_id } });
    var msg: string = "";

    if (patient instanceof User && therapy instanceof Therapy) {
      msg =
        patient.username +
        " solicita un turno para " +
        therapy.name +
        ", con fecha y hora: " +
        shift.date +
        ". Su número de contacto es: " +
        patient.phone +
        ".";
    }
    const id = uniqid() + uniqid();
    const admins = await User.findAll({ where: { admin: 1 } });
    var notification: any;

    admins.forEach(async (a) => {
      if (a.phone != "1234") {
        await notification.save({
          id: id,
          subject: subject,
          text: msg,
          user_id: a.id,
        });
      }
    });
  }

  async notifyShiftAccepted(shift: Shift) {
    const subject = "shift";
    const patient = await User.findOne({ where: { id: shift.patient_id } });
    const therapy = await Therapy.findOne({ where: { id: shift.therapy_id } });
    var msg: string = "";

    if (patient instanceof User && therapy instanceof Therapy) {
      msg =
        patient.username +
        ": se confirmó tu turno para " +
        therapy.name +
        ", con fecha y hora: " +
        shift.date +
        ". Te esperamo en 9 de Julio 250. Gracias!";
    }
    const id = uniqid() + uniqid();
    var notification: any;
    await notification.save({
      id: id,
      subject: subject,
      text: msg,
      user_id: shift.patient_id,
    });
  }
}
