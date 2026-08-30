import type { ReactNode } from "react";

type PageWidth = "standard" | "wide" | "full";

type PageLayoutProps = {
  children: ReactNode;
  width?: PageWidth;
  fillHeight?: boolean;
};

const widthClasses: Record<PageWidth, string> = {
  standard: "max-w-4xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

function PageLayout({
  children,
  width = "standard",
  fillHeight = false,
}: PageLayoutProps) {
  return (
    <div
      className={[
        "mx-auto w-full px-4 py-10 sm:px-6 lg:px-8",
        widthClasses[width],
        fillHeight ? "flex min-h-0 flex-1 flex-col" : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default PageLayout;
