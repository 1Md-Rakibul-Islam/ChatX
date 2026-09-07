"use client";

import * as React from "react";
import { format } from "date-fns";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import clsx from "clsx";

import { Calendar } from "./calendar";
import { Button } from "@/components/ui/button";
import { Label } from "./label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Icon from "../icons/Icon";

const datePickerVariants = cva(
  "h-[48px] w-full rounded-lg border px-3 text-sm flex items-center justify-between",
  {
    variants: {
      variant: {
        "primary-outline": "border-primary focus:ring-2 focus:ring-primary/30",
        "secondary-outline":
          "border-secondary focus:ring-2 focus:ring-secondary/30",
      },
      rounded: {
        true: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary-outline",
    },
  },
);

type DatePickerProps = VariantProps<typeof datePickerVariants> & {
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  placeholder?: string;
  labelClassName?: string;
  value?: Date;
  onChange?: (date?: Date) => void;
};

function DatePickerField({
  label,
  helpText,
  error,
  required,
  fullWidth,
  rounded,
  variant,
  placeholder = "Pick a date",
  labelClassName,
  value,
  onChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (d?: Date) => {
    setDate(d);
    onChange?.(d);
    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {/* Label */}
      {label && (
        <Label required={required} className={clsx(labelClassName)}>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary-outline"
            contentClassName="inline-flex items-center justify-between gap-3"
            className={cn(
              datePickerVariants({ variant, rounded, fullWidth }),
              "justify-between",
              error && "border-red-500",
            )}
          >
            {date ? format(date, "PPP") : placeholder}
            <Icon name="watch" className="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>

      {/* Error / Help */}
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      ) : null}
    </div>
  );
}

export { DatePickerField };
