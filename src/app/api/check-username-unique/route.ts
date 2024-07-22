import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameQueryParams = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQueryParams.safeParse(queryParams);
    console.log(result, "result");
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log(usernameErrors, "usernameErrors");
       return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      );
    }
    const {username} = result.data ?? {};

    const existingVerifiedUser = await UserModel.findOne({ username , isVerified: true });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
        {
          success: true,
          message: `${username} is Available`,
        },
        {
          status: 200,
        }
      );

  } catch (err) {
    console.error("Error checking username");
    Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
