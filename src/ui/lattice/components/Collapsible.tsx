import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type CollapsibleProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  animated?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

function Collapsible({
  title,
  children,
  defaultOpen = true,
  animated = false,
  className = "",
  titleClassName = "",
  contentClassName = "",
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | "auto">(
    defaultOpen ? "auto" : 0,
  );

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !contentRef.current) {
      return;
    }

    const content = contentRef.current;

    if (open) {
      setHeight(content.scrollHeight);

      const timeoutId = window.setTimeout(() => {
        setHeight("auto");
      }, 250);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    setHeight(content.scrollHeight);

    const frameId = requestAnimationFrame(() => {
      setHeight(0);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [open, animated]);

  return (
    <section className={`w-full ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-4 py-2 text-left ${titleClassName}`}
      >
        <span>{title}</span>

        {open ? (
          <ChevronDown aria-hidden="true" size={18} />
        ) : (
          <ChevronRight aria-hidden="true" size={18} />
        )}
      </button>

      <div
        style={
          animated
            ? {
                height,
                overflow: "hidden",
                transition: "height 0.25s ease",
              }
            : undefined
        }
      >
        <div
          ref={contentRef}
          hidden={!animated && !open}
          className={`mt-1 text-sm text-gray-700 ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export default Collapsible;
