"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { numanFont } from "@/app/fonts";
import { signinSchema } from "@/lib/schemas";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import LoadingSpinner from "./LoadingSpinner";
import { signIn } from "@/lib/auth";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("access_token")) {
      router.push("/");
    }
  }, [router]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signinSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setLoading(true);
        const res = await signIn({
          email: value.email,
          password: value.password,
        });

        if (!res.success) {
          return toast({
            title: "Sign In Failed",
          });
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        router.push("/");
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Sign in failed";
        toast({
          title: "Sign In Failed",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="w-full md:w-[58%] min-h-full flex flex-col justify-evenly items-center gap-5">
      <div
        className={
          numanFont.className +
          " text-[36px] text-[#6750A4] w-[300px] md:w-[360px] lg:w-[450px] xl:w-[500px] xl:my-6"
        }
      >
        Slooze
      </div>
      <div className="flex flex-col gap-7 xl:gap-9">
        <div className="text-[26px]">Sign in</div>
        <div>
          <form
            id="signin-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="w-[300px] md:w-[360px] lg:w-[450px] xl:w-[500px] flex flex-col gap-8"
          >
            <FieldGroup>
              <div className="bg-[#E5DBFF] p-3 rounded-3xl">
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="focus:ring-0 border-none shadow-none focus-visible:ring-0 p-0 text-[#6750A4]"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <FieldGroup>
              <div className="bg-[#E5DBFF] px-4 py-3 rounded-3xl">
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="focus:ring-0 border-none shadow-none focus-visible:ring-0 p-0 text-[#6750A4]"
                          type="password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </FieldGroup>
            <div className="flex flex-col mt-4 gap-1">
              <div className="text-[14px]">
                <span>New User ?</span>
                <span
                  className="text-[#6750A4] ml-1 cursor-pointer"
                  onClick={() => router.push("/register")}
                >
                  Sign Up
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <Button
                className="px-8 py-5 bg-[#6750A4] w-fit rounded-full font-semibold cursor-pointer text-black"
                type="submit"
              >
                {loading ? (
                  <div className={"flex items-center justify-center "}>
                    <div className="animate-spin rounded-full border-b-2 border-white h-7 w-7"></div>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
