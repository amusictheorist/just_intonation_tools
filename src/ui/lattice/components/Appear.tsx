import { useEffect, useState, type ReactNode } from "react";

type AppearProps = {
  children: ReactNode;
  className?: string;
};

function Appear({ children, className = "" }: AppearProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className={[
        "transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default Appear;
