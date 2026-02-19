import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenHelpers } from "../../utils/token";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface ILoginUserPayload {
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,

      //    default value hisebe bose jabe
      //    role:Role.PATIENT
    },
  });

  if (!data.user) {
    throw new Error("Failed to register patient");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });

    const accessToken = tokenHelpers.getAccessToken({
      userId: data.user.id,
      email: data.user.email,
      role: data.user.role,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenHelpers.getRefreshToken({
      userId: data.user.id,
      email: data.user.email,
      role: data.user.role,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
      patient,
    };
  } catch (error) {
    console.log("transaction error:", error);
    //if user created
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.isDeleted) {
    throw new Error("user is deleted");
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("user is blocked");
  }

  const accessToken = tokenHelpers.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerPatient,
  loginUser,
};
