import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const bcyrpt = require("bcryptjs");

export const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.username },
            ],
          });
          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("User not verified");
          }
          const isValid = await bcyrpt.compare(
            credentials?.password,
            user.password
          );

          if (isValid) {
            return user;
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (err: any) {
          console.log(err);
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
      async jwt({ token, user }) {
        if(user){
            token._id = user.id.toString();
            token.username = user.username;
            token.email = user.email;
            token.isAcceptingMessage = user.isAcceptingMessage;
            token.isVerified = user.isVerified;
        }
        return token;
      },
    async session({ session, token }) {
        if(token){
            session.user = token;
        }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
