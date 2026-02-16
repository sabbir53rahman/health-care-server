import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put(
  "/:id",
  validateRequest(updateDoctorZodSchema),
  doctorController.updateDoctor,
);
router.delete("/:id", doctorController.deleteDoctor);

export const DoctorRoutes = router;
