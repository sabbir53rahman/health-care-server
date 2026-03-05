/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { specialtyController } from "./specialty.controller";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
  specialtyController.createSpecialty,
);
router.get("/", specialtyController.getAllSpecialties);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  specialtyController.updateSpecialty,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  specialtyController.deleteSpecialty,
);

export const specialtyRoutes = router;
