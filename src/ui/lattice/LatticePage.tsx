import { useState } from "react";
import PageLayout from "../layout/PageLayout";
import PageHeader from "../layout/PageHeader";
import ContentCard from "../layout/ContentCard";
import LatticeVisualizer from "./components/LatticeVisualizer";
import HelpButton from "../components/HelpButton";
import HelpPanel from "./components/HelpPanel";

function LatticePage() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <PageLayout width="full" fillHeight>
        <PageHeader
          title="Ratio Lattice Visualizer"
          description="Build and explore just-intonation relationships in an interactive three-dimensional lattice."
        />

        <ContentCard className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
          <LatticeVisualizer />
        </ContentCard>
      </PageLayout>

      <HelpButton onClick={() => setHelpOpen(true)} />
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}

export default LatticePage;
