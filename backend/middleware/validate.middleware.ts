import {
  Request,
  Response,
  NextFunction,
} from "express";

import { z } from "zod";


export const validate = (schema: z.ZodTypeAny) => {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const result = schema.safeParse({

      body: req.body,

      params: req.params,

      query: req.query,

    });


    if (!result.success) {

      return res.status(400).json({

        success: false,

        message: "Validation failed",

        errors: result.error.issues.map((issue) => ({

          field: issue.path.join("."),

          message: issue.message,

        })),

      });

    }


    // Put validated body back into request
    if (
      typeof result.data === "object" &&
      result.data !== null &&
      "body" in result.data
    ) {

      req.body = (result.data as any).body;

    }




    next();

  };

};