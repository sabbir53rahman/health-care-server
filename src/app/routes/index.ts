import { Router } from "express";
import { specialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", specialtyRoutes);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoutes);
router.use("/admins", AdminRoutes);
// router.use("/payments", PaymentRoutes);
router.use("/appointments", AppointmentRoutes);
router.use("/schedules", scheduleRoutes);
// router.use("/reviews", reviewRoutes);
router.use("/doctor-schedules", DoctorScheduleRoutes);

export const IndexRoutes = router;
