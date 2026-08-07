"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
  multiple: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

export function Accordion({ type = "single", defaultValue, className, children, ...props }: AccordionProps) {
  const initial = React.useMemo(() => {
    if (!defaultValue) return new Set<string>();
    return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  }, [defaultValue]);

  const [openItems, setOpenItems] = React.useState<Set<string>>(initial);
  const multiple = type === "multiple";

  const toggle = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = multiple ? new Set(prev) : new Set<string>();
        if (prev.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        return next;
      });
    },
    [multiple]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle, multiple }}>
      <div className={cn("divide-y divide-border", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  value: string;
  title: React.ReactNode;
}

export function AccordionItem({ value, title, className, children, ...props }: AccordionItemProps) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");
  const isOpen = ctx.openItems.has(value);

  return (
    <div className={cn("py-2", className)} {...props}>
      <button
        type="button"
        onClick={() => ctx.toggle(value)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-3 text-left text-card-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-4 text-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
