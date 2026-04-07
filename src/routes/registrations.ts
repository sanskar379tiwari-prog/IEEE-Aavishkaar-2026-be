import { Router } from "express";
import { newregistrationcontroller } from "../controllers/newregistrationcontroller";
import allregistrationscontroller from "../controllers/allregistrationscontroller";
import allregistrationsbyidcontroller from "../controllers/allregistrationbyeventidcontroller";
import { submitRegistrationBySlugController } from "../controllers/submitRegistrationBySlugController";

const router = Router();

// legacy registration endpoint
router.post("/newregistration", newregistrationcontroller);

// New endpoint: Register by event ID
router.post("/:id", submitRegistrationBySlugController); // POST /api/registrations/:id

router.get("/allregistrations", allregistrationscontroller);
router.get("/allregistrations/:eventId", allregistrationsbyidcontroller);

export const registrationRoute = router;