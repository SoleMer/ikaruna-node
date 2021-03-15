import { Question } from "../models/Question";
import e, { Request, Response } from "express";
import {  controller, use } from "./decorators";
import "../services/passport";
import { requireLogin } from "../middleware/requireLogin";
import { requireAdmin } from "../middleware/requireAdmin";
import { postResponseMessages } from "../controllers/responseMessages/post";
import { get, post } from "./decorators/route";
import uniqiid from"uniqid";
import uniqid from "uniqid";

@controller("/api/question")
class QuestionController {
    @get("")
    @use(requireLogin)
    @use(requireAdmin)
    async getAll(res: Response) {
        
        try {
            const questions = await Question.findAll();
            /*var response: Question[];
            questions.forEach(q => {
                if(q instanceof Question) {
                    const {id, text, user_id} = q;
                    response.push(q);
                } else {
                    return res.status(201).json({ message: "Internal server error" });
                }
            });*/
            return res.status(201).json({ questions });    
        } catch (error) {
            return res.status(201).json({ message: "Internal server error" });
        }
    }

    @post("")
    @use(requireLogin)
    async addQuestion(req: Request, res: Response) {
        const { question } = req.body;

        try {
            const id = uniqid() + uniqid();
            await question.save({
                id: id,
                text: question.text,
                user_id: question.user_id,
            })
            //notifcar a admins: nueva pregunta
            return res.status(201).json({ message: postResponseMessages.question_created_successfully });
        } catch (error) {
            return res.status(201).json({ message: postResponseMessages.incomplete_data });           
        }
    }
}

