"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function VerifyAccount() {
  const [loader, setLoader] = useState(false);
  const { username } = useParams();
  const { toast } = useToast();

  const verify = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setLoader(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username,
        verifyCode: data.code,
      });
      console.log(response.data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.push("/login");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description: axiosError.response?.data.message ?? "An error occured",
        variant: "destructive",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">code sent to your email</p>
        </div>
        <Form {...verify}>
          <form onSubmit={verify.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={verify.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Code" {...field} />
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
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
