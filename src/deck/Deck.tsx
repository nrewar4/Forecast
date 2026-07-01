import { Cover, ExecSummary } from "./slides/intro";
import { Context, Framework, Model } from "./slides/methodology";
import { Results } from "./slides/results";
import { Strategy, Application, Roadmap, Closing } from "./slides/activation";
import { AnnexFrameworks, AnnexIndicators, AnnexSources, AnnexMethod, AnnexWorked, AnnexReferences } from "./slides/annexure";

// Eight dense content slides (2-9) plus cover, closing and a six-part annexure.
const SLIDES: ((p: { n: number; total: number }) => JSX.Element)[] = [
  Cover,
  ExecSummary, // 1
  Context, // 2
  Framework, // 3
  Model, // 4
  Results, // 5
  Strategy, // 6
  Application, // 7
  Roadmap, // 8
  Closing,
  AnnexFrameworks,
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
