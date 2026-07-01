import { Cover, Divider, ExecSummary } from "./slides/intro";
import { Problem, Approach, Framework, Indicators, DataEngineering, StatModel, Tiering } from "./slides/methodology";
import { National, Leaderboard, Validation, Dashboard } from "./slides/results";
import { UseCases, DeepDive, Roadmap, Impact, Risks, Closing } from "./slides/activation";
import { AnnexIndicators, AnnexSources, AnnexMethod, AnnexWorked, AnnexReferences } from "./slides/annexure";

// Ordered slide list. `total` is injected so every footer shows the right count.
const SLIDES: ((p: { n: number; total: number }) => JSX.Element)[] = [
  Cover,
  ExecSummary,
  (p) => <Divider {...p} index="01" label="Context" title="Why districts, not states" sub="India's pharma growth has moved into the districts, but commercial planning has not. The index closes that gap." />,
  Problem,
  (p) => <Divider {...p} index="02" label="Methodology" title="The model and framework" sub="A ten-step composite-indicator pipeline: six pillars, real public data, a reconciled statistical weighting, one score." />,
  Approach,
  Framework,
  Indicators,
  DataEngineering,
  StatModel,
  Tiering,
  (p) => <Divider {...p} index="03" label="Results" title="What the index reveals" sub="Scores, tiers, a national map, whitespace, validation and the dashboard that ships it to decision-makers." />,
  National,
  Leaderboard,
  Validation,
  Dashboard,
  (p) => <Divider {...p} index="04" label="Activation" title="Turning scores into decisions" sub="Four commercial use cases, a worked launch, a roadmap, the business case, and how we govern the model's limits." />,
  UseCases,
  DeepDive,
  Roadmap,
  Impact,
  Risks,
  Closing,
  AnnexIndicators,
  AnnexSources,
  AnnexMethod,
  AnnexWorked,
  AnnexReferences,
];

export default function Deck() {
  const total = SLIDES.length;
  return (
    <div className="deck-root flex flex-col items-center gap-6 bg-[#f2f2f2] py-8 print:gap-0 print:bg-white print:py-0">
      {SLIDES.map((S, i) => (
        <div key={i} className="shadow-[0_2px_20px_rgba(0,0,0,0.08)] print:shadow-none">
          <S n={i + 1} total={total} />
        </div>
      ))}
    </div>
  );
}
