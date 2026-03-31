import { Router } from "express";
import { registrationController } from "@/controllers/registration";

export const registrationRoute = Router();

registrationRoute.post(
    "/events/:eventId/register",
    (req, res) => void registrationController(req, res),
);
