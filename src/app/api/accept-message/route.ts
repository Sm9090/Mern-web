import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = user?._id;
  try {
    const { isAcceptMessage } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptMessage }
      //   { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "not found updated user" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully ",
        updatedUser,
      },
      { status: 404 }
    );
  } catch (err) {
    console.log("failed to update user status to accept message", err);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept message",
        error: err,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("failed to get user status to accept message", err);
    return Response.json(
      {
        success: false,
        message: "failed to get user status to accept message",
        error: err,
      },
      { status: 500 }
    );
  }
}
