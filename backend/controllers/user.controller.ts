import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { adapter } from "../utils/prismaAdapter"
import { hashPassword, verifyPassword } from "../utils/HashAndVerify";
import uploadToCloudinary from "../utils/uploadCloudinary";

const prisma = new PrismaClient({ adapter });


export const findUsers = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
        emailVerified: true,

      },
    });


    res.status(200).json({ users, message: "Users fetched successfully" });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User id is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        profilePic: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    const {
      username,
      email,
    } = req.body;


    const uploadedFile = req.file;

    // Replace this with the property
    // your Cloudinary middleware provides
    const profilePic =  await uploadToCloudinary(req.file!.buffer);


    if ( username === undefined && email === undefined &&  !profilePic) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }


    // Username uniqueness

    if (username) {

      const existingUsername = await prisma.user.findFirst({

          where: {
            username,
            NOT: {
              id: userId,
            },
          },

        });


      if (existingUsername) {

        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });

      }

    }


    // Email change

    if (email) {

      const existingEmail = await prisma.user.findFirst({
          where: {
            email,
            NOT: {
              id: userId,
            },
          },

        });


      if (existingEmail) {

        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });

      }

    }

    // Update user

    const updatedUser =
      await prisma.user.update({

        where: {
          id: userId,
        },

        data: {

          ...(username !== undefined && {
            username,
          }),

          ...(profilePic && {
            profilePic,
          }),

          ...(email && {
            email,
            emailVerified: false,
          }),

        },

        select: {
          id: true,
          username: true,
          email: true,
          profilePic: true,
          emailVerified: true,
        },

      });


    // TODO:
    // If email changed:
    // generate verification token
    // save token
    // send verification email


    return res.status(200).json({

      success: true,

      message: email
        ? "Profile updated. Please verify your new email."
        : "Profile updated successfully",

      user: updatedUser,

    });


  } catch (error) {

    console.error(
      "Update profile error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Internal server error",

    });

  }

};

export const changePassword = async (req: Request, res: Response) => {

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { currentPassword, newPassword, } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },

    });


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const passwordMatch = await verifyPassword(currentPassword, user.password!);



    if (!passwordMatch) {

      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });

    }


    const hashedPassword = await hashPassword(newPassword);


    await prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },

    });


    return res.status(200).json({

      success: true,

      message: "Password updated successfully",

    });


  } catch (error) {

    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Internal server error",

    });

  }

};