import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "text";
  className?: string;
};

export function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  const styles = {
    primary: "bg-[#2b2926] text-[#faf8f4] hover:bg-[#403c37]",
    secondary: "border border-[#d8d0c5] bg-transparent text-[#2b2926] hover:bg-[#f2ede5]",
    text: "text-[#2b2926] underline decoration-[#b7a995] underline-offset-4 hover:decoration-[#2b2926]"
  };

  const classes = `inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition ${styles[variant]} ${className}`;

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}
