"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import signInSchema from "@/schemas/signInSchema";
import { Sign } from "crypto";
import { signIn } from "next-auth/react";
import { Young_Serif } from "next/font/google";

function page() {
  const [loader, setLoader] = React.useState(false);
  const [checkUsername, setCheckUsername] = React.useState(false);

  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const Login = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setLoader(true);

    const response = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    console.log(response);
    if (response?.error) {
      setLoader(false);
      toast({
        title: "Error",
        description: response?.error,
        variant: "destructive",
      });
    }

    if (response?.url) {
      toast({
        title: "Login Successfully",
        description: "you are logged in",
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">SignIn to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...Login}>
            <form onSubmit={Login.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={Login.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={Login.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loader}>
                {loader ? (
                  <>
                    <Loader2 className="animate-spin mx-2" /> Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default page;
