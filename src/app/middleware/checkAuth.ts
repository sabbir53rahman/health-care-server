/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieHelpers } from "../utils/cookie";
import AppError from "../errorHelpers/appError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtHelpers } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieHelpers.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.createdAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();

          const timeRemaining = expiresAt.getTime() - now.getTime();

          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 25) {
            res.setHeader("X-session-refresh", "true");
            res.setHeader("X-session-expires-at", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            if (
              user.status === UserStatus.BLOCKED ||
              user.status === UserStatus.DELETED
            ) {
              throw new AppError(
                status.UNAUTHORIZED,
                "Unauthorize access! User is not active.",
              );
            }

            if (user.isDeleted) {
              throw new AppError(
                status.UNAUTHORIZED,
                "Unauthorize access! User is deleted",
              );
            }

            if (authRoles.length > 0 && !authRoles.includes(user.role)) {
              throw new AppError(
                status.FORBIDDEN,
                "Forbidden access! You do not have permission to access this resourse",
              );
            }

            return next();
          }
        }

        const accessToken = cookieHelpers.getCookie(req, "access_token");

        if (!accessToken) {
          throw new AppError(status.UNAUTHORIZED, "Unauthorized");
        }
      }

      const accessToken = cookieHelpers.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }
      const verifiedToken = jwtHelpers.verifyToken(
        accessToken,
        envVars.JWT_ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(status.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
