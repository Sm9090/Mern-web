import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
var bcrypt = require("bcryptjs");

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        { message: "Username already exists", success: false },
        {
          status: 400,
        }
      ); //registeration nhi hoskta already user register hai is user name se
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { message: "Email already exists", success: false },
          {
            status: 400,
          }
        ); //registeration nhi hoskta already user register hai is email se
      } else {
        //user already exists but not verified
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        await UserModel.updateOne(
          { email },
          {
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpire: expiryDate,
          }
        );
        //now send verification email to user
      }
    } else {
      //new user aya hai
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpire: expiryDate,
        isAcceptingMessage: true,
        messages: [],
        isVerified: false,
      });

      await newUser.save();
    }

    //now send verification email to user
    const emailResponse = await sendVerificationEmail(
      email,
      verifyCode,
      username
    );
    console.log(emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        { message: emailResponse.message, success: false },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message: "User Registered Successfully. Please Verify your Email",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error Registering User", err);
    return Response.json(
      { message: "Error Registering User", success: false },
      {
        status: 500,
      }
    );
  }
}
