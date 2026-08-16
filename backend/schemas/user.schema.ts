import { z } from "zod";


// Find Users
// GET /user/search?query=krish

export const findUsersSchema = z.object({

  query: z.object({

    query: z
      .string()
      .trim()
      .min(1, "Search query is required")
      .max(50, "Search query is too long"),

  }),

});



// Get User By ID
// GET /user/:userId


export const getUserByIdSchema = z.object({

  params: z.object({

    userId: z
      .string()
      .uuid("Invalid user ID"),

  }),

});


// Update User
// PUT /user/:userId

export const updateUserSchema = z.object({

  params: z.object({

    userId: z
      .string()
      .uuid("Invalid user ID"),

  }),

  body: z.object({

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .optional(),

    profilePic: z
      .string()
      .url("Invalid profile picture URL")
      .nullable()
      .optional(),

  }),

});


export const updateProfileSchema = z.object({

  body: z.object({

    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .optional(),

  }),

});


export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "New password is too long"),
  }),
});