import { useEffect, useRef } from "react";
import { SceneManager } from "../scene/SceneManager";
import { addPrimeAnchorPrototype } from "../scene/addPrimeAnchorPrototype";

function PrimeAnchorPrototypeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const manager = new SceneManager(container);

    addPrimeAnchorPrototype(manager);
    manager.resize();

    function handleResize() {
      manager.resize();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      manager.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-152 w-full overflow-hidden rounded-lg bg-gray-100"
    />
  );
}

export default PrimeAnchorPrototypeCanvas;
