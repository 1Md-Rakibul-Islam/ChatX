"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-0.5 text-sm leading-none font-medium select-none text-txt-primary",
        className,
      )}
      {...props}
    >
      {children}

      {/* Required star */}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </LabelPrimitive.Root>
  );
}

export { Label };
