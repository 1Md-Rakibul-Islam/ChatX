"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import clsx from "clsx";
import Icon from "../icons/Icon";

const inputVariants = cva(
  "h-[48px] w-full min-w-0 rounded-lg border bg-transparent px-3 py-3 text-base outline-none transition-all placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        "primary-outline":
          "border-primary text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",

        "secondary-outline":
          "border-secondary text-foreground focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/30",
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

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    helpText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
    rounded?: boolean;
    labelClassName?: string;
    required?: boolean;
    onIconClick?: () => void;
  };

function Input({
  className,
  variant,
  type,
  label,
  helpText,
  error,
  leftIcon,
  rightIcon,
  isLoading,
  fullWidth,
  rounded,
  labelClassName,
  required,
  onIconClick,
  disabled,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";

  const iconColor = error
    ? "text-red-500"
    : isFocused
      ? "text-primary"
      : "text-muted-foreground";

  return (
    <div className={cn("space-y-3", fullWidth && "w-full")}>
      {/* Label */}
      {label && (
        <Label
          htmlFor={props.id}
          required={required}
          className={clsx(labelClassName)}
        >
          {label}
        </Label>
      )}

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

        {/* Input */}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          data-slot="input"
          data-variant={variant}
          disabled={disabled || isLoading}
          className={cn(
            inputVariants({ variant, rounded, fullWidth }),
            leftIcon && "pl-10",
            (rightIcon || isPassword || isLoading) && "pr-10",
            error && "border-red-500 focus-visible:ring-red-500/30",
            isLoading && "cursor-not-allowed",
            className,
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon */}
        {(rightIcon || isPassword) && !isLoading && (
          <span
            onClick={onIconClick}
            className={cn(
              "absolute right-0 top-1/2 -translate-1/2 size-8",
              iconColor,
              onIconClick && "cursor-pointer",
            )}
          >
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Icon name="EyeClose" />
                ) : (
                  <Icon name="EyeOpen" />
                )}
              </button>
            ) : (
              rightIcon
            )}
          </span>
        )}

        {/* Loading */}
        {isLoading && (
          <span className="absolute right-3 top-7 -translate-y-1/2">
            <Icon name="Loading" />
          </span>
        )}
      </div>

      {/* Error / Help */}
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      ) : null}
    </div>
  );
}

export { Input, inputVariants };
