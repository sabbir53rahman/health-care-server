import { prisma } from "../../lib/prisma";
import { IUpdataDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctors;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctor;
};

const updateDoctor = async (id: string, data: IUpdataDoctorPayload) => {
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data,
  });
  return doctor;
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.delete({
    where: {
      id,
    },
  });
  return doctor;
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
