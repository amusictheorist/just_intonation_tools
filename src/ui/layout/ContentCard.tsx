import type { ReactNode } from "react";

type ContentCardProps = {
  children: ReactNode;
  className?: string;
};

function ContentCard({ children, className = "" }: ContentCardProps) {
  return (
    <section
      className={`rounded-xl bottom-0 border-gray-200 bg-white p-6 shadow-sm sm:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export default ContentCard;
