"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    circle?: boolean;
    className?: string;
    iconClassName?: string;
    contentClassName?: string;
  };

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/80",
        primary: "bg-primary text-white hover:bg-primary/80",
        "primary-outline":
          "border border-primary text-primary hover:bg-primary hover:text-white",
        secondary: "bg-secondary text-txt-primary hover:bg-secondary/80",
        "secondary-outline":
          "border border-secondary text-txt-primary hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-2.5 gap-1.5 rounded-lg",
        xs: "h-11 px-3 px-8 py gap-1 rounded-md",
        sm: "h-[48px] px-8 py-3 gap-1 rounded-md",
        lg: "h-[56px] px-8 py-4 gap-2 rounded-xl",
        icon: "size-8",
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  contentClassName,
  variant,
  size,
  asChild = false,
  leftIcon,
  rightIcon,
  isLoading,
  disabled,
  fullWidth,
  rounded,
  circle,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const iconSize =
    size === "xs"
      ? "size-3"
      : size === "sm"
        ? "size-4"
        : size === "lg"
          ? "size-5"
          : "size-4";

  if (asChild) {
    return (
      <Slot
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded }),
          className,
        )}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || isLoading}
      className={cn(
        buttonVariants({ variant, size, fullWidth, rounded }),
        "cursor-pointer",
        circle && "rounded-full p-0",
        isLoading && "cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <span className="mr-2">
          <svg className={cn("animate-spin", iconSize)} viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
            />
          </svg>
        </span>
      )}

      {/* Left Icon */}
      {!isLoading && leftIcon && (
        <span className={cn("mr-2 flex items-center", iconSize)}>
          {leftIcon}
        </span>
      )}

      {/* Content */}
      <span
        className={cn(isLoading && "opacity-70", "w-full", contentClassName)}
      >
        {children}
      </span>

      {/* Right Icon */}
      {!isLoading && rightIcon && (
        <span className={cn("ml-2 flex items-center", iconSize)}>
          {rightIcon}
        </span>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
