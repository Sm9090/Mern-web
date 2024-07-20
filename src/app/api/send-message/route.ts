import dbConnect from "@/lib/dbConnect";
import UserModel, { message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect()
    const {username, content} =await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({success: false , message: "User not found"}, {status: 404})
        }
        if(!user.isAcceptingMessage){
            return Response.json({success: false , message: "User not accepting messages"}, {status: 403})
        }
        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as message)
        await user.save()

        return Response.json({success: true, message: "Message sent Successfully"}, {status: 200})

    } catch (error) {
        console.log("failed to send message", error)
        return Response.json({success: false, message: "failed to send message", error}, {status: 500})
    }
    
}