import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const codeValidation = z.object({
  verifyCode: z.string().length(6, "Code must be 6 characters"),
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const result = codeValidation.safeParse({ verifyCode });
    if (!result.success) {
      const codeErrors = result.error.format().verifyCode?._errors || [];
      console.log(codeErrors, "codeErrors");
      return Response.json(
        {
          success: false,
          message:
            codeErrors?.length > 0
              ? codeErrors.join(", ")
              : "Invalid Verification Code",
        },
        { status: 400 }
      );
    }
    const isValidCode = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();
    if (isValidCode && isCodeNotExpired) {
      await UserModel.updateOne(
        { username: decodedUsername },
        { isVerified: true }
      );
      return Response.json(
        { message: "User Verified Successfully" },
        { status: 200 }
      );
    } else if (!isValidCode) {
      return Response.json(
        { message: "Incorrect Verification Code" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { message: "Code Expired Please SignUp again for new code " },
        { status: 400 }
      );
    }
  } catch (err) {
    console.log("Internal Sever Error", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
