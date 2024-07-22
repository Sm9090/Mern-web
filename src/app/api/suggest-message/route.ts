import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
    try {
    
      const prompt =  " Create a list of tyhree open-ended and engaging questions fomated as a single string , Each question should be sperated by '||' , these questions  are for an anonymous social messaging platform , like Qooh.me and should be designed to spark interesting conversations between users. For example: 'What is your biggest fear?||What is your favorite childhood memory?||What is the most important lesson you've learned in life?'";
    
      // Ask OpenAI for a streaming chat completion given the prompt
      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        max_tokens: 400,
        stream: true,
        prompt,
      });
    
      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response);
      // Respond with the stream
      return new StreamingTextResponse(stream);
} catch (error) {
    console.error("failed to suggest message", error);
    if(error instanceof OpenAI.APIError){
        const  {status , message , name , headers} = error
        return NextResponse.json({status , headers , message , name},{status})
    }else{
        console.error("An unexpected error occured",error)
        throw  error
    }
    
}
}