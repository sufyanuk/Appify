"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, errorProps } from "@/components/ui/field";
import type { FormState } from "@/lib/validation";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage message={state.message} />
      <Field label="Email" htmlFor="email" errors={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.values?.email}
          {...errorProps("email", errors.email)}
        />
      </Field>
      <Field label="Password" htmlFor="password" errors={errors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          {...errorProps("password", errors.password)}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
