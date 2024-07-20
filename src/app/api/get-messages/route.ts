import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = user?._id;

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.date": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "No messages found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to get messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to get messages",
        error: error,
      },
      { status: 500 }
    );
  }
}
