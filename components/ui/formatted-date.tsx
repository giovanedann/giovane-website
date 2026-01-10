"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
  date: string;
  className?: string;
}

export function FormattedDate({ date, className }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    const dateObj = new Date(date + "T12:00:00");
    setFormatted(
      dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, [date]);

  if (!formatted) {
    return <span className={className}>{date}</span>;
  }

  return <span className={className}>{formatted}</span>;
}
