import { User } from "../models/User";
import { authResponseMessages } from "../controllers/responseMessages/auth";

const {
  server_error,
} = authResponseMessages;

export const findCurrentUser = async (user: any) => {
  try {
    return await User.findOne({
      where: {
        id: user.id,
      },
    });
  } catch (error) {
    //console.log(error);
    return { error: server_error };
  }
};