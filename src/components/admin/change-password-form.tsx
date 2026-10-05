"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, errorProps } from "@/components/ui/field";
import type { FormState } from "@/lib/validation";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate className="space-y-4">
      <FormMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <Field label="Current password" htmlFor="currentPassword" errors={errors.currentPassword}>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" {...errorProps("currentPassword", errors.currentPassword)} />
      </Field>
      <Field label="New password" htmlFor="newPassword" hint="At least 10 characters." errors={errors.newPassword}>
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" {...errorProps("newPassword", errors.newPassword)} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirmPassword" errors={errors.confirmPassword}>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" {...errorProps("confirmPassword", errors.confirmPassword)} />
      </Field>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  );
}
