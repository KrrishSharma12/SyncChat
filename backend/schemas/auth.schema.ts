import { z } from "zod";


// Signup

export const signupSchema = z.object({

    body: z.object({

        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must not exceed 30 characters"),

        email: z
            .string()
            .trim()
            .email("Invalid email address"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password must not exceed 100 characters"),


    }),
    params: z.object({}),

    query: z.object({}),

});


// Login

export const loginSchema = z.object({

    body: z.object({

        email: z
            .string()
            .trim()
            .email("Invalid email address"),

        password: z
            .string()
            .min(1, "Password is required"),

    }),
    params: z.object({}),

    query: z.object({}),

});


// Verify Email

export const verifyEmailSchema = z.object({

    body: z.object({

        otp: z
            .string()
            .trim()
            .min(1, "Verification token is required"),
        email: z
            .string()
            .trim()
            .email("Invalid email address"),


    }),
    params: z.object({}),

    query: z.object({}),

});


// Resend Verification Email

export const resendVerificationSchema = z.object({

    body: z.object({

        email: z
            .string()
            .trim()
            .email("Invalid email address"),
            
        }),
        params: z.object({}),

        query: z.object({}),

});