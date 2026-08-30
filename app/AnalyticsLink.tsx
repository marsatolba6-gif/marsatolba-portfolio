"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import Link, { type LinkProps } from "next/link";
import { track } from "@vercel/analytics";

type EventValue = string | number | boolean | null;

type AnalyticsLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    eventName: string;
    eventProperties?: Record<string, EventValue>;
  };

export default function AnalyticsLink({ eventName, eventProperties, onClick, ...props }: AnalyticsLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track(eventName, eventProperties);
    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}
