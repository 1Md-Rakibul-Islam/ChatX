"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type CustomSelectProps = React.ComponentProps<typeof SelectPrimitive.Root> &
  VariantProps<typeof selectVariants> & {
    label?: string;
    helpText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    rounded?: boolean;
    required?: boolean;
    placeholder?: string;
    labelClassName?: string;
    className?: string;
  };

const selectVariants = cva(
  "h-[48px] w-full rounded-lg border bg-transparent px-3 text-sm flex items-center justify-between outline-none transition-all disabled:opacity-50 disabled:pointer-events-none",
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

function Select({
  label,
  helpText,
  error,
  leftIcon,
  rightIcon,
  fullWidth,
  rounded,
  variant,
  required,
  placeholder,
  labelClassName,
  children,
  className,
  ...props
}: CustomSelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const iconColor = error
    ? "text-red-500"
    : isFocused
      ? "text-primary"
      : "text-muted-foreground";

  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {/* Label */}
      {label && (
        <Label required={required} className={clsx(labelClassName)}>
          {label}
        </Label>
      )}

      <SelectPrimitive.Root {...props}>
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <span
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                iconColor,
              )}
            >
              {leftIcon}
            </span>
          )}

          {/* Trigger */}
          <SelectPrimitive.Trigger
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={twMerge(
              "space-x-1",
              className,
              selectVariants({ variant, rounded, fullWidth }),
              leftIcon && "pl-10",
              "",
              error && "border-red-500 focus:ring-red-500/30",
            )}
          >
            <SelectPrimitive.Value
              placeholder={placeholder || "Select option"}
            />

            <SelectPrimitive.Icon asChild>
              {rightIcon ? (
                <span className={iconColor}>{rightIcon}</span>
              ) : (
                <ChevronDownIcon className={cn("size-4", iconColor)} />
              )}
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
        </div>

        {/* Dropdown */}
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="z-50 rounded-lg border bg-popover shadow-md">
            <SelectPrimitive.Viewport className="p-1">
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {/* Error / Help */}
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      ) : null}
    </div>
  );
}

function SelectItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer items-center rounded-md py-2 pl-2 pr-8 text-sm focus:bg-accent",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <span className="absolute right-2">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectItem };
