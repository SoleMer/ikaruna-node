import { Notification } from "../models/Notification";
import { Shift } from "../models/Shift";
import{ Workshop } from "../models/Workshop";
import { User } from "../models/User";
import { Therapy } from "../models/Therapy";
import e, { Request, Response } from "express";
import {  controller, use, } from "./decorators";
import "../services/passport";
import { requireLogin } from "../middleware/requireLogin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireSameUser } from "../middleware/requireSameUser";
import { postResponseMessages } from "../controllers/responseMessages/post";
import { delResponseMessages } from "../controllers/responseMessages/delete";
import { del, get, post } from "./decorators/route";
import uniqid from "uniqid";

@controller("/api/notification")
export class NotificationController {
    @get("/:id")
    @use(requireAdmin)
    @use(requireSameUser)
    async getAll(req: Request, res: Response) {
        const id = req.params.id;
        var response: Notification[];
        
        try {
            const notifications = await Notification.findAll({where: {user_id: id}});
            /*notifications.forEach(n => {
                if(n instanceof Notification){
                    response.push(n);
                } else {
                    return res.status(201).json({ message: "Internal server error" });  
                }
            });*/
            return res.status(201).json({ notifications });  
        } catch (error) {
            return res.status(201).json({ message: "Internal server error" });  
        }
    }

    @del("/:id")
    @use(requireLogin)
    @use(requireSameUser)
    async deleteNotification(req: Request, res: Response) {
        const id = req.params.id;

        try {
            await Notification.destroy({
                where: {id: id}
            })
            return res.status(201).json({ message: delResponseMessages.notification_deleted_successfully });  
        } catch (error) {
            return res.status(201).json({ message: delResponseMessages.non_deleted });  
        }
    }

    @post("")
    @use(requireLogin)
    async requestWorkshop(req: Request, res: Response) {
        const { request } = req.body;
        const subject = "workshop";
        const workshop = await Workshop.findOne({where: {id: request.wsp_id}});
        const user = await User.findOne({where: {id: request.user_id}});
        var msg: string;
        if(user instanceof User && workshop instanceof Workshop) {
            msg = user.username + " desea hacer el taller " + workshop.name +
                        ". Su email es: " + user.email + ", y su número de teléfono es: "
                        + user.phone + ".";
        }
        const id = uniqid() + uniqid();
        const admins = await User.findAll({where: {admin: 1}});
        var notification: any;

        try {
            admins.forEach(async a => {
                if(a.phone != "1234") {
                    await notification.save({
                        id: id,
                        subject: subject,
                        text: msg,
                        user_id: a.id,
                    })
                }                
            });
            return res.status(201).json({ message: postResponseMessages.request_to_do_workshop_created }); 
        } catch (error) {
            return res.status(201).json({ message: "Internal server error" }); 
        }
    }
}