import { Request, Response } from "express";
import { controller, use } from "./decorators";
import "../services/passport";
import passport from "passport";
import { authResponseMessages } from "./responseMessages/auth";
import { User } from "../models/User";
import { get, post } from "../controllers/decorators/route";

const {
  server_error,
  username_taken,
  user_created_successfully,
  invalid_combination,
  successful_login,
} = authResponseMessages;

@controller("/api/login")
class LoginController {
  @post("")
  @use(passport.authenticate("local-signin"))
  async signinUser(req: Request, res: Response) {
    console.log(req.body);
    if (req.body == null) {
      req.body.logOut();
      return res.status(501).json({ success: false, text: server_error });
    }

    if (req.body.user == username_taken) {
      req.body.logOut();
      return res.status(401).json({ success: false, text: username_taken });
    }

    if (req.body.user == invalid_combination) {
      req.body.logOut();
      return res.status(401).json({
        success: false,
        text: invalid_combination,
      });
    }

    const { username, email, phone, admin } = req.body.user as {
      id: string;
      username: string;
      email: string;
      phone: string;
      admin: number;
    };

    const user = await User.findOne({
      where: {
        email,
      },
    });

    return res.status(201).json({
      success: true,
      text: successful_login,
      user: {
        username,
        email,
        phone,
        admin,
      },
    });
  }

  @post("/signup")
  @use(passport.authenticate("local-signup"))
  async signupUser(req: Request, res: Response) {
    if (req.body == null) {
      req.body.logOut();
      return res.status(501).json({ success: false, text: "Server error" });
    }

    if (req.body.user == username_taken) {
      req.body.logOut();
      return res.status(401).json({ success: false, text: username_taken });
    }

    const { username, email, phone, admin } = req.body.user as {
      userid: string;
      username: string;
      email: string;
      phone: string;
      admin: number;
    };

    return res.status(201).json({
      success: true,
      text: user_created_successfully,
      user: {
        username,
        email,
        phone,
        admin
      },
    });
  }

  @get("/current_user")
  getCurrentUser(req: Request, res: Response) {
    res.json(req.body.user);
  }

  @get("/signout")
  logoutUser(req: Request, res: Response) {
    req.body.logOut();
    res.end();
  }


}