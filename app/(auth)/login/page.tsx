"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

const schema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัว" }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "test@test.com",
      password: "testtest",
    },
  });

  const submit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/credential/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const json: { message: string } = await res.json();

      if (res.status === 200) {
        toast({
          title: "เข้าสู่ระบบสําเร็จ",
        });
        window.location.href = "/transaction";
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: json.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const googleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/google");
    const json = await res.json();
    if (res.status === 200) {
      window.location.href = json.url;
    }
  };

  return (
    <div className="flex h-dvh items-center justify-center">
      <Card className="w-full sm:w-1/2 lg:w-1/3 2xl:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <CardHeader>
              <span className="text-2xl font-semibold text-center">
                Wallet Next
              </span>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="block ">
              <section>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "เข้าสู่ระบบ"}
                </Button>
              </section>
              <hr className="my-8" />
              <section>
                <Button className="w-full bg-sky-600" onClick={googleLogin}>
                  Google
                </Button>
              </section>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
