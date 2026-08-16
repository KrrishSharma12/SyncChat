import { Request, Response } from "express";
import uploadToCloudinary from "../utils/uploadCloudinary";
import { PrismaClient } from "../generated/prisma/client";
import { adapter } from "../utils/prismaAdapter"
import { hashPassword, verifyPassword } from "../utils/HashAndVerify";
import { sendVerificationEmail } from "../EmailService/Email.service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/GenerateAndVerifyTokens";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config'
import { OAuth2Client } from "google-auth-library";
dotenv.config();

const prisma = new PrismaClient({ adapter });

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
export const googleLogin = async (req: Request,res: Response) => {
  try {

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Google authorization code is required",
      });
    }

    const { tokens } =await googleClient.getToken(code);
    if (!tokens.id_token) {
      return res.status(401).json({
        success: false,
        message: "Google ID token not received",
      });
    }


    const ticket =await googleClient.verifyIdToken({ idToken: tokens.id_token,audience: process.env.GOOGLE_CLIENT_ID,});


    const payload = ticket.getPayload();


    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    const { sub,email,name,picture,email_verified,} = payload;
    if (!sub || !email) {
      return res.status(401).json({
        success: false,
        message: "Google account information is missing",
      });
    }

    let user =await prisma.user.findUnique({
        where: {
          googleId: sub,
        },
      });

    if (!user) {
      user =await prisma.user.findUnique({
          where: {
            email,
          },
        });

    }


    if (user) {

      if (!user.googleId) {

        user =await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              googleId: sub,
              emailVerified:email_verified === true ? true: user.emailVerified,
              profilePic: user.profilePic || picture || null,

            },

          });

      }

    }

    else {
      let username =  name || email.split("@")[0];
      const existingUsername =await prisma.user.findUnique({
          where: {
            username,
          },
        });



      if (existingUsername) {
        username =`${username}_${Date.now()}`;
      }


      user = await prisma.user.create({

          data: {
          username,
            email,
            googleId: sub,
            password: null,
            profilePic:picture || null,
            emailVerified:email_verified === true,
          },

        });

    }



    const accessToken =generateAccessToken(user.id,user.email);
    const refreshToken =generateRefreshToken(user.id,user.email);

    const hashedToken =await hashPassword(refreshToken);
    await prisma.user.update({

      where: {
        id: user.id,
      },

      data: {
        refreshToken:hashedToken,
        refreshTokenExpiry:new Date(Date.now() +7 * 24 * 60 * 60 * 1000),
      },

    });


    const signedUser = {

      id: user.id,

      username:user.username,

      email:user.email,

      profile:user.profilePic,

    };



    res.cookie("accessToken",accessToken,accessTokenCookieOptions);


    res.cookie("refreshToken",refreshToken,refreshTokenCookieOptions);

    

    return res.status(200).json({
      success: true,
      message:"Google login successful",
      user: signedUser,

    });


  } catch (error) {

    console.error("Google login error:",error);
    return res.status(401).json({

      success: false,

      message:"Google authentication failed",

    });

  }
};

export const signupUser = async (req: Request, res: Response) => {


  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {

      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
        success: false
      });
    }

    const hashedPassword = await hashPassword(password);

    let profileUrl: string | null = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      profileUrl = result.secure_url;
    }

    const otp = Math.floor( 100000 + Math.random() * 900000 ).toString();


    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profilePic: profileUrl,
        verificationToken: otp,
        verificationTokenExpiry: new Date(
          Date.now() + 10 * 60 * 1000
        )
      }
    });



    res.status(201).json({
      message: "Signup successful. Please verify your email.",
      email: user.email,
      success: true
    });

    void sendVerificationEmail(email, username, otp).catch((emailError) => {
      console.log("Error sending verification email", emailError);
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};




export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }


    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email already verified",
        success: false
      });
    }


    if (user.verificationToken !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false
      });
    }


    if (
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry < new Date()
    ) {
      return res.status(400).json({
        message: "OTP expired",
        success: false
      });
    }


    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });


    res.status(200).json({

      message: "Email verified successfully",
      success: true
    });


  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user || !user.emailVerified) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }


    const isPasswordValid = await verifyPassword(password, user.password!);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);
    const hashedToken = await hashPassword(refreshToken);

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refreshToken: hashedToken,
        refreshTokenExpiry: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        )
      }
    });

    const signedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profilePic
    }

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: signedUser,
      success: true
    });


  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const getMe = async (req: Request, res: Response) => {

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profilePic,
      },
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = verifyRefreshToken(refreshToken) as { userId: string, email: string } | null;


    const user = await prisma.user.findUnique({
      where: {
        id: decoded?.userId,
      },
    });

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const isValid = await verifyPassword(
      refreshToken,
      user.refreshToken
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const accessToken = generateAccessToken(
      user.id,
      user.email
    );

    res.cookie(
      "accessToken",
      accessToken,
      accessTokenCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: null,
        refreshTokenExpiry: null
      }
    });

    res.clearCookie("accessToken", accessTokenCookieOptions);
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    res.status(200).json({
      message: "Logout successful",
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
