import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
};

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h1>

      {description && (
        <div className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg">
          {description}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
