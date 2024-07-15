import { z } from "zod";

// Define the schema
export const verifySchema = z.object({
    code: z.string().min(6,"verify code must be atleast 6 characters"),
});

