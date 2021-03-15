import e, { Request, Response } from "express";
import {  controller, use } from "./decorators";
import "../services/passport";
import { User } from "../models/User";
import { requireLogin } from "../middleware/requireLogin";
import { findCurrentUser } from "../helpers/user";
import { requireSameUser } from "../middleware/requireSameUser";
import { requireAdmin } from "../middleware/requireAdmin";
import { del, get, post, put } from "./decorators/route";
import uniqid from "uniqid";
import { postResponseMessages } from "./responseMessages/post";
import { putResponseMessages } from "./responseMessages/put";
import { delResponseMessages } from "./responseMessages/delete";


@controller("/api/user")
class UserController {
  @get("/:id")
  @use(requireLogin)
  @use(requireSameUser)
  async getProfile(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const user = await User.findOne({ where: { id } });

      if (user instanceof User) {
        const { id, username, email, phone, admin } = user;
        return res.status(201).json({
          userInfo: {
            id,
            username,
            email,
            phone,
            admin
          },
        });
      } else {
        return res.status(404).json({ message: "There is no such user" });
      }
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @get("")
  @use(requireLogin)
  @use(requireAdmin)
  async getAll(res: Response) {

    try {
      const users = await User.findAll();
      /*var response: User[];
      users.forEach(user => {
        if (user instanceof User) {
          const { id, username, email, phone, admin } = user;
            response.push(user);
              
        } else {*/
        
      return res.status(201).json({ users });
    } catch (error) {
      return res.status(501).json({ message: "Internal server error" });
    }
  }

  @post("")
  async checkIn(req: Request, res: Response) {
    const { user } = req.body;
    const { email } = user.email;

    const registeredUser = await User.findOne({ where: { email } });
    if (user instanceof User && registeredUser == null) {
      try {
        const id = uniqid() + uniqid();
        await user.save({
          id: id,
          username: user.username,
          email : user.email,
          phone : user.phone,
          admin : 0,
          password : user.password,
        });
        return res.status(204).json({ success: { message: postResponseMessages.user_created_successfully } });
      } catch (error) {
        return res
          .status(501)
          .json({ error: { message: "Server internal error" } });
      }
    }

    return res
      .status(501)
      .json({ error: { message: "Ya existe un usuario para el email enviado. Iniciar sesión." } });
  }

  @put("/:id")
  @use(requireLogin)
  @use(requireSameUser)
  async changeUserData(req: Request, res: Response) {
    const { new_user } = req.body;
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    var email: string ="";
    var phone: string = "";

    if(new_user.email !="") email = new_user.email;
    else if(user instanceof User) email = user.email;

    if(new_user.phone != "") phone = new_user.phone;
    else if(user instanceof User) phone = user.phone;

    if (user instanceof User) {
      try {
        await user.update({
          email : email,
          phone: phone
        });
        return res.status(204).json({ success: { message: putResponseMessages.updated_user } });
      } catch (error) {
        return res
          .status(501)
          .json({ error: { message: "Server internal error" } });
      }
    }

    return res
      .status(501)
      .json({ error: { message: "Server internal error" } });
  }

  @del("/:id")
  @use(requireLogin)
  @use(requireAdmin)
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;

      try {
        await User.destroy({
          where: {id : id}
        })
        return res.status(204).json({ success: { message: delResponseMessages.user_deleted_successfully } });
      } catch (error) {
        return res
          .status(501)
          .json({ error: { message: delResponseMessages.non_deleted } });
      }
  }

  

}


