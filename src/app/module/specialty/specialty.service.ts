import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });

  return specialty;
};

const getAllSpecialties = async (): Promise<Specialty[]> => {
  const result = await prisma.specialty.findMany();

  return result;
};

const deleteSpecialty = async (id: string): Promise<Specialty> => {
  const result = await prisma.specialty.delete({
    where: { id },
  });

  return result;
};

const updateSpecialty = async (
  id: string,
  payload: Partial<Specialty>,
): Promise<Specialty> => {
  const result = await prisma.specialty.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const specialtyService = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
