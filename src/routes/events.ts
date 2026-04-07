import { Router } from "express";
import { eventscontroller } from "../controllers/eventscontroller";
import { alleventscontroller } from "../controllers/alleventscontroller";
import { getEventBySlugController } from "../controllers/getEventBySlugController";

const router = Router();

// legacy admin route
router.post("/createevent", eventscontroller);

// frontend-friendly event endpoints
router.get("/", alleventscontroller); // GET /api/events
router.get("/:slug", getEventBySlugController); // GET /api/events/:slug

export const eventRoute = router;
