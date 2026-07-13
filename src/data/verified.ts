// Web-verified manufacturing routes, predominant-process explanations, and major
// manufacturers (with official websites) for the most-traded products in the
// database. Researched from public sources in June 2026, see `sources` on each
// entry. Keyed by slug(productName) so the Knowledge Base can attach them to the
// matching catalog product. Manufacturer links point to official corporate
// sites; verify standing before any commercial engagement.

export type VerifiedLink = { name: string; url: string };

export type VerifiedProduct = {
  routes: string[];
  mainProcess: { name: string; detail: string };
  manufacturers: VerifiedLink[];
  sources: VerifiedLink[];
};

export const verified: Record<string, VerifiedProduct> = {
  paraxylene: {
    routes: [
      "Catalytic reforming of naphtha to a mixed C8 aromatics (xylenes) stream",
      "Selective adsorption separation, UOP Parex / IFP Eluxyl simulated moving bed (dominant)",
      "Low-temperature crystallisation separation of p-xylene",
      "Xylene isomerisation (UOP Isomar) to re-equilibrate o-/m-xylene back to p-xylene",
      "Toluene disproportionation and transalkylation to make more xylenes",
    ],
    mainProcess: {
      name: "Catalytic reforming + UOP Parex adsorptive separation",
      detail:
        "Petroleum naphtha is catalytically reformed over a platinum catalyst at about 500 °C to a reformate rich in C8 aromatics, the three xylene isomers plus ethylbenzene, which boil too closely to split by ordinary distillation. The mixed-xylene cut is fed to a simulated-moving-bed adsorption unit (UOP Parex or IFP Eluxyl), where a zeolitic adsorbent selectively captures p-xylene and a desorbent displaces it, recovering over 97% of the p-xylene at 99.9% purity in a single pass. The raffinate (o-/m-xylene and ethylbenzene) goes to a UOP Isomar isomerisation reactor that shifts the isomers back toward p-xylene, and the stream is recycled to extinction. Toluene disproportionation/transalkylation units feed extra xylenes into the loop.",
    },
    manufacturers: [
      { name: "Reliance Industries (world's largest PX producer)", url: "https://www.ril.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "Hengli Petrochemical", url: "https://en.hengli.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "SK geo centric", url: "https://www.skgeocentric.com" },
      { name: "Lotte Chemical", url: "https://www.lottechem.com" },
    ],
    sources: [
      { name: "CPMA, Para-xylene", url: "https://cpmaindia.com/knowledge-centre/product-group/-fibre-intermediates/px" },
      { name: "Honeywell UOP, Benzene/Para-xylene production", url: "https://honeywell-uop.azurewebsites.net/processing-solutions/petrochemicals/benzene-para-xylene-production/" },
      { name: "ChemAnalyst, Paraxylene production process", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/inside-the-reactor-a-deep-dive-into-the-paraxylene-production-process-38883" },
    ],
  },

  "phosphoric-acid-fertiliser-grade": {
    routes: [
      "Wet process, sulfuric-acid digestion of phosphate rock (dihydrate/hemihydrate); ~90% of output",
      "Thermal process, burning elemental phosphorus for high-purity acid",
      "Wet process with nitric or hydrochloric acid (less common)",
      "Solvent-extraction purification to technical/food grade",
    ],
    mainProcess: {
      name: "Wet process (sulfuric-acid dihydrate route)",
      detail:
        "Ground phosphate rock (apatite) is reacted with sulfuric acid in a train of agitated reactors. The acid releases phosphoric acid and precipitates calcium sulfate (gypsum): Ca5F(PO4)3 + 5 H2SO4 + 10 H2O → 3 H3PO4 + 5 CaSO4·2H2O + HF. The slurry is held near 70-80 °C with a controlled sulfate level so the gypsum grows into filterable crystals, then filtered on large tilting-pan or belt filters and washed counter-currently to recover P2O5. The dilute acid (~28-32% P2O5) is concentrated by vacuum evaporation to the 40-54% P2O5 fertiliser grade, while evolved fluorine (SiF4/HF) is scrubbed. Roughly 90% of world phosphoric acid is made this way.",
    },
    manufacturers: [
      { name: "OCP Group (world's largest complex)", url: "https://www.ocpgroup.ma" },
      { name: "The Mosaic Company", url: "https://www.mosaicco.com" },
      { name: "PhosAgro", url: "https://www.phosagro.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "EuroChem Group", url: "https://www.eurochemgroup.com" },
    ],
    sources: [
      { name: "US EPA, Phosphoric acid (AP-42 §8.9)", url: "https://www.epa.gov/sites/default/files/2020-09/documents/8.9_phosphoric_acid.pdf" },
      { name: "ChemAnalyst, Production process of phosphoric acid", url: "https://www.chemanalyst.com/Blogs/understanding-the-production-process-of-phosphoric-acid-16" },
      { name: "FerTech Inform, Phosphoric acid production", url: "https://fertechinform.org/knowledgebase/phosphoric-acid-production-introduction/" },
    ],
  },

  "n-hexane": {
    routes: [
      "Fractional distillation of the C6 cut of light naphtha / natural gasoline",
      "Hydrotreating (desulfurisation) plus dearomatisation by hydrogenation ('double hydrogenation')",
      "Superfractionation to strip close-boiling isomers (2-/3-methylpentane)",
      "Recovery from catalytic-reforming raffinate",
    ],
    mainProcess: {
      name: "Distillation + double hydrogenation of light naphtha",
      detail:
        "n-Hexane is isolated from the C6 fraction of light straight-run naphtha or natural gasoline. The feed is hydrotreated to remove sulfur and then hydrogenated ('double hydrogenation') to saturate olefins and cut benzene below food-grade limits, since hexane is widely used for edible-oil extraction. The treated stream is fractionated in high-efficiency columns boiling around 60-70 °C to take the hexane cut, with further superfractionation to remove the close-boiling isomers (2- and 3-methylpentane) and reach commercial n-hexane purity. Grades are tailored for oil-seed extraction and as a polymerisation solvent.",
    },
    manufacturers: [
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "Phillips 66", url: "https://www.phillips66.com" },
      { name: "Junyuan Petroleum Group", url: "https://junyuanpetroleumgroup.com" },
      { name: "SK geo centric", url: "https://www.skgeocentric.com" },
    ],
    sources: [
      { name: "Shell, Hexane solvent grades", url: "https://www.shell.com/business-customers/chemicals/our-products/solvents-hydrocarbon/special-boiling-point-solvents/hexane.html" },
      { name: "Junyuan Petroleum Group, n-Hexane supply chain", url: "https://junyuanpetroleumgroup.com/hexane/n-hexane-global-supply-chain-leader/" },
      { name: "Google Patents, High-purity hexane process", url: "https://patents.google.com/patent/US20170203231A1/en" },
    ],
  },

  "styrene-monomer": {
    routes: [
      "Catalytic dehydrogenation of ethylbenzene with steam (~90% of output)",
      "Ethylbenzene oxidation to hydroperoxide → styrene + propylene oxide (POSM/SMPO co-product)",
      "Recovery from pyrolysis gasoline (minor)",
    ],
    mainProcess: {
      name: "Ethylbenzene dehydrogenation (steam route)",
      detail:
        "Benzene is first alkylated with ethylene over an acidic zeolite catalyst to ethylbenzene. The ethylbenzene is vaporised, mixed with a large excess of superheated steam, and passed adiabatically over a potassium-promoted iron-oxide (Fe2O3/K2CO3) catalyst at 600-650 °C through reactor beds in series. The endothermic reaction removes hydrogen to form styrene; the steam supplies heat, lowers the ethylbenzene partial pressure to push the equilibrium toward styrene, and keeps the catalyst clean via the water-gas reaction. Per-pass conversion is held near 60-70% to limit by-products, and the effluent is separated by vacuum distillation (to avoid thermal polymerisation) with an added inhibitor, recycling unconverted ethylbenzene.",
    },
    manufacturers: [
      { name: "Chevron Phillips Chemical", url: "https://www.cpchem.com" },
      { name: "INEOS Styrolution", url: "https://www.ineos-styrolution.com" },
      { name: "Trinseo", url: "https://www.trinseo.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Dow", url: "https://www.dow.com" },
    ],
    sources: [
      { name: "Chevron Phillips Chemical, Styrene", url: "https://www.cpchem.com/what-we-do/solutions/aromatics/products/styrene" },
      { name: "Styrene production from ethylbenzene (technical PDF)", url: "https://michiganfoam.com/wp-content/uploads/2019/03/styrene_production_from_ethylbenzene.pdf" },
      { name: "NCBI, Styrene production and use", url: "https://www.ncbi.nlm.nih.gov/books/NBK601961/" },
    ],
  },

  toluene: {
    routes: [
      "Catalytic reforming of naphtha (reformate), then aromatics extraction",
      "Recovery from pyrolysis gasoline (steam-cracker pygas)",
      "Solvent extraction / extractive distillation of the toluene cut",
      "By-product of coke-oven light oil (minor)",
    ],
    mainProcess: {
      name: "Catalytic reforming + aromatics extraction",
      detail:
        "Most toluene is co-produced with benzene and xylenes (the BTX stream). Hydrotreated naphtha is catalytically reformed over a Pt/Re catalyst at about 500 °C and moderate pressure, converting paraffins and naphthenes into aromatics (reformate). Because toluene boils close to non-aromatic C7s, it is recovered by liquid-liquid solvent extraction or extractive distillation using a polar solvent such as sulfolane, which preferentially dissolves the aromatics; the extract is then distilled to separate benzene, toluene and xylenes. Pyrolysis gasoline from naphtha steam crackers supplies roughly a third of BTX and is treated similarly. Much toluene is further converted by hydrodealkylation to benzene or by disproportionation to xylenes.",
    },
    manufacturers: [
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "bp", url: "https://www.bp.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
    ],
    sources: [
      { name: "Wikipedia, Catalytic reforming", url: "https://en.wikipedia.org/wiki/Catalytic_reforming" },
      { name: "US DOE, The BTX chain (PDF)", url: "http://www1.eere.energy.gov/manufacturing/resources/chemicals/pdfs/profile_chap4.pdf" },
      { name: "thyssenkrupp, Aromatics extraction (PDF)", url: "https://ucpcdn.thyssenkrupp.com/_legacy/UCPthyssenkruppBAIS/assets.files/products___services/chemical_plants___processes/tkis_aromatics.pdf" },
    ],
  },

  "liquid-ammonia-anhydrous": {
    routes: [
      "Haber-Bosch synthesis from N2 + H2 with steam-methane-reforming hydrogen (dominant)",
      "Coal-gasification route to syngas, then synthesis (common in China)",
      "Green ammonia, electrolytic H2 + Haber-Bosch (emerging)",
    ],
    mainProcess: {
      name: "Haber-Bosch process (SMR hydrogen)",
      detail:
        "Hydrogen is generated by steam-methane reforming of natural gas, followed by water-gas shift, CO2 removal and methanation to leave a pure H2 stream; nitrogen is drawn from air in the secondary reformer. The 3:1 H2:N2 synthesis gas is compressed to ~150-300 bar and passed over a promoted magnetite (iron) catalyst at 400-500 °C, where N2 + 3 H2 ⇌ 2 NH3. Because single-pass conversion is only ~15-20%, ammonia is condensed out and the unreacted gas is recycled in a high-pressure loop. The product is refrigerated and stored as anhydrous liquid ammonia. Over 70% of ammonia uses natural-gas hydrogen; Chinese plants often use coal gasification.",
    },
    manufacturers: [
      { name: "Yara International", url: "https://www.yara.com" },
      { name: "CF Industries", url: "https://www.cfindustries.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "OCI Global", url: "https://www.oci-global.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "IFFCO", url: "https://www.iffco.in" },
    ],
    sources: [
      { name: "Wikipedia, Haber process", url: "https://en.wikipedia.org/wiki/Haber_process" },
      { name: "HY2GEN, Haber-Bosch process", url: "https://www.hy2gen.com/haber-bosch-process" },
      { name: "C&EN, Ammonia as a fuel of the future", url: "https://cen.acs.org/business/petrochemicals/ammonia-fuel-future/99/i8" },
    ],
  },

  methanol: {
    routes: [
      "Steam reforming of natural gas to syngas, then catalytic synthesis (~60% of output)",
      "Autothermal/combined reforming (ATR) for world-scale plants",
      "Coal gasification to syngas (dominant in China)",
      "CO2 hydrogenation / green methanol (emerging)",
    ],
    mainProcess: {
      name: "Natural-gas steam reforming + low-pressure synthesis",
      detail:
        "Natural gas is desulfurised and reformed with steam at ~800-900 °C over a nickel catalyst to make synthesis gas (CO, CO2, H2). The conditioned syngas is compressed and converted over a copper-zinc-alumina (Cu/ZnO/Al2O3) catalyst at ~50-100 bar and 200-300 °C: CO + 2 H2 → CH3OH and CO2 + 3 H2 → CH3OH + H2O. The reaction is exothermic and equilibrium-limited, so per-pass conversion is modest and unreacted gas is recycled; crude methanol is condensed and purified by distillation to strip water and light/heavy ends. Steam reforming accounts for roughly 60% of global methanol, while coal gasification dominates in China.",
    },
    manufacturers: [
      { name: "Methanex Corporation (world's largest)", url: "https://www.methanex.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "OCI Global", url: "https://www.oci-global.com" },
      { name: "Mitsubishi Gas Chemical", url: "https://www.mgc.co.jp/eng/" },
      { name: "Proman", url: "https://www.proman.org" },
      { name: "Yankuang / Zagros (regional)", url: "https://www.methanex.com" },
    ],
    sources: [
      { name: "HYCO1, Methanol pathways and benchmarks", url: "https://hyco1.com/methanols-moment-part-1/" },
      { name: "IndexBox, Industrial production of methanol", url: "https://www.indexbox.io/search/industrial-production-of-methanol/" },
      { name: "Google Patents, Methanol from steam reforming", url: "https://patents.google.com/patent/EP2116295A1/en" },
    ],
  },

  aniline: {
    routes: [
      "Catalytic hydrogenation of nitrobenzene (gas- or liquid-phase); >95% of output",
      "Ammonolysis of phenol (Halcon/Aristech route)",
      "Chlorobenzene ammonolysis (largely historical)",
    ],
    mainProcess: {
      name: "Nitrobenzene hydrogenation",
      detail:
        "Benzene is nitrated with mixed acid (HNO3/H2SO4) to nitrobenzene, which is then catalytically hydrogenated to aniline. In the dominant gas-phase route, vaporised nitrobenzene and excess hydrogen pass over a supported noble-metal (Pd) or copper catalyst at ~250-350 °C in fluidised- or fixed-bed reactors, giving essentially complete single-pass conversion: C6H5NO2 + 3 H2 → C6H5NH2 + 2 H2O. The strongly exothermic heat is removed to protect the catalyst. Crude aniline is separated from process water by decantation and the wet aniline is purified by dehydration and vacuum distillation. Most aniline feeds MDI/polyurethane production.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Covestro", url: "https://www.covestro.com" },
      { name: "Wanhua Chemical", url: "https://www.wanhuachemical.com" },
      { name: "Huntsman", url: "https://www.huntsman.com" },
      { name: "Tosoh Corporation", url: "https://www.tosoh.com" },
    ],
    sources: [
      { name: "Intratec, Aniline from nitrobenzene (PDF)", url: "https://cdn.intratec.us/docs/reports/previews/aniline-e13a-b.pdf" },
      { name: "NCBI, Aniline (production and use)", url: "https://www.ncbi.nlm.nih.gov/books/NBK576629/" },
      { name: "Research and Markets, Aniline market", url: "https://www.researchandmarkets.com/report/anilines" },
    ],
  },

  "ethylene-glycol": {
    routes: [
      "Ethylene → ethylene oxide (silver-catalysed oxidation) → hydration to MEG",
      "Shell OMEGA catalytic route via ethylene carbonate (>99% MEG selectivity)",
      "Coal-to-MEG via syngas and dimethyl oxalate (China)",
      "Bio-MEG from sugar/bioethanol (emerging)",
    ],
    mainProcess: {
      name: "Ethylene oxide hydration (EO → MEG)",
      detail:
        "Ethylene is partially oxidised with oxygen over a silver catalyst at ~200-300 °C to ethylene oxide (EO). EO is then reacted with water to open the ring and form monoethylene glycol: C2H4O + H2O → HOCH2CH2OH. In the conventional thermal route a large excess of water is used (to suppress di- and tri-ethylene glycol) at ~150-200 °C and moderate pressure; the dilute glycol solution is concentrated and the glycols separated by multi-effect vacuum distillation. Shell's catalytic OMEGA process instead reacts EO with CO2 to ethylene carbonate and hydrolyses it, reaching over 99% MEG selectivity with far less water and energy. China increasingly makes MEG from coal-derived syngas via dimethyl oxalate.",
    },
    manufacturers: [
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "MEGlobal", url: "https://www.meglobal.biz" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "IndianOil", url: "https://www.iocl.com" },
    ],
    sources: [
      { name: "IndianOil, Glycols (MEG)", url: "https://iocl.com/glycols" },
      { name: "Coherent Market Insights, Top MEG companies", url: "https://www.coherentmarketinsights.com/blog/insights/top-companies-monoethylene-glycol-industry-768" },
      { name: "Market Research Future, MEG companies", url: "https://www.marketresearchfuture.com/reports/mono-ethylene-glycol-market/companies" },
    ],
  },

  "purified-terephthalic-acid-pta": {
    routes: [
      "Amoco/Mid-Century liquid-phase air oxidation of p-xylene to crude TA (CTA)",
      "Catalytic hydropurification of CTA to fibre-grade PTA",
      "Esterification to dimethyl terephthalate (DMT), older, declining",
    ],
    mainProcess: {
      name: "Amoco Mid-Century oxidation + hydropurification",
      detail:
        "p-Xylene is oxidised with air in glacial acetic acid solvent using a cobalt-manganese-bromide (Co/Mn/Br) catalyst at ~175-225 °C and 15-30 bar. Both methyl groups are oxidised to carboxylic acids, giving crude terephthalic acid (CTA): C6H4(CH3)2 + 3 O2 → C6H4(COOH)2 + 2 H2O. CTA precipitates (terephthalic acid is almost insoluble) and is filtered, but it still carries the colour-forming impurity 4-carboxybenzaldehyde (4-CBA). In purification, CTA is dissolved in hot water at ~270-290 °C and hydrogenated over a palladium-on-carbon catalyst, which converts 4-CBA to soluble p-toluic acid; pure PTA is then crystallised, filtered and dried to fibre grade for polyester (PET).",
    },
    manufacturers: [
      { name: "Sinopec (world's largest by capacity)", url: "https://www.sinopec.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "Indorama Ventures", url: "https://www.indoramaventures.com" },
      { name: "Mitsubishi Chemical Group", url: "https://www.mcgc.com" },
      { name: "Lotte Chemical", url: "https://www.lottechem.com" },
      { name: "Alpek", url: "https://www.alpek.com" },
    ],
    sources: [
      { name: "Valco, PTA manufacturing process", url: "https://www.valcogroup-valves.com/faq-2/pta-terephthalic-acid-manufacturing-process-of-pta/" },
      { name: "Verified Market Research, Top PTA manufacturers", url: "https://www.verifiedmarketresearch.com/blog/top-purified-terephthalic-acid-manufacturers/" },
      { name: "Reliance, Fibre intermediates (PTA)", url: "https://www.ril.com/businesses/petrochemicals/fibre-intermediates" },
    ],
  },

  "sulphuric-acid": {
    routes: [
      "Contact process, sulfur burning, catalytic SO2 → SO3, absorption",
      "Double Contact Double Absorption (DCDA) for >99.7% conversion and low SO2",
      "Metallurgical acid from smelter off-gas (copper/zinc by-product)",
      "Spent-acid regeneration",
    ],
    mainProcess: {
      name: "Contact process with Double Contact Double Absorption (DCDA)",
      detail:
        "Elemental sulfur (or smelter SO2 gas) is burned in dry air to sulfur dioxide: S + O2 → SO2. The cooled gas passes through a multi-bed converter packed with vanadium pentoxide (V2O5) catalyst at ~420-620 °C, where 2 SO2 + O2 ⇌ 2 SO3. In the DCDA configuration the gas is absorbed after the third catalyst bed in an intermediate tower (SO3 + H2SO4 → oleum), which removes product and shifts the equilibrium, then the remaining SO2 is converted in a fourth bed and sent to a final absorber. This two-stage absorption lifts overall conversion above 99.7% and sharply cuts SO2 emissions. SO3 is absorbed into ~98% sulfuric acid (not water) to control the reaction, then diluted to grade.",
    },
    manufacturers: [
      { name: "Aurubis", url: "https://www.aurubis.com" },
      { name: "The Mosaic Company", url: "https://www.mosaicco.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "PhosAgro", url: "https://www.phosagro.com" },
      { name: "OCP Group", url: "https://www.ocpgroup.ma" },
      { name: "BASF", url: "https://www.basf.com" },
    ],
    sources: [
      { name: "HORIBA, Sulfuric acid by DCDA", url: "https://www.horiba.com/int/process-and-environmental/industries/sulfuric-acid-production/" },
      { name: "ChemAnalyst, Sulphuric acid supply chain", url: "https://www.chemanalyst.com/Blogs/understanding-the-global-sulphuric-acid-supply-chain-from-production-to-end-use-28" },
      { name: "Aurubis, Sulfuric acid", url: "https://www.aurubis.com/en/products/other-products/sulfuric-acid" },
    ],
  },

  "acetic-acid": {
    routes: [
      "Methanol carbonylation, BP Cativa (Ir) or Monsanto (Rh); dominant",
      "Acetaldehyde oxidation (older)",
      "Direct liquid-phase oxidation of n-butane/naphtha",
      "Bio-fermentation (food-grade vinegar)",
    ],
    mainProcess: {
      name: "Methanol carbonylation (BP Cativa process)",
      detail:
        "Over 75% of acetic acid is made by reacting methanol with carbon monoxide: CH3OH + CO → CH3COOH. In BP's Cativa process an iridium complex with a ruthenium promoter (and a methyl-iodide co-catalyst) catalyses the reaction in the liquid phase at ~150-200 °C and 30-50 bar, with selectivity above 99% on methanol. Iridium gives faster rates, greater stability and lower-water operation than the older rhodium-based Monsanto process, cutting energy and purification cost. Crude acid is dried and distilled to remove water, heavy ends and iodide to reach glacial (99.85%+) quality. Fermentation is still used for food-grade vinegar.",
    },
    manufacturers: [
      { name: "Celanese (world's largest)", url: "https://www.celanese.com" },
      { name: "INEOS Acetyls", url: "https://www.ineos.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "Daicel Corporation", url: "https://www.daicel.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
    ],
    sources: [
      { name: "ChemAnalyst, Production process of acetic acid", url: "https://www.chemanalyst.com/Blogs/comprehensive-guide-production-process-of-acetic-acid-47" },
      { name: "Wikipedia, Monsanto process", url: "https://en.wikipedia.org/wiki/Monsanto_process" },
      { name: "Valco, Acetic acid manufacturing process", url: "https://www.valcogroup-valves.com/faq-2/acetic-acid-manufacturing-process-for-acetic-acid/" },
    ],
  },

  "6-aminopenicillanic-acid-6-apa": {
    routes: [
      "Enzymatic deacylation of penicillin G/V with immobilised penicillin acylase (dominant, green)",
      "Chemical deacylation (silylation / PCl5 at low temperature), older",
      "Direct fermentation (limited)",
    ],
    mainProcess: {
      name: "Enzymatic deacylation of penicillin G",
      detail:
        "6-APA is the core beta-lactam intermediate for semi-synthetic penicillins (amoxicillin, ampicillin). It is made by enzymatically cleaving the phenylacetyl side chain from fermentation-derived penicillin G (or the phenoxyacetyl chain of penicillin V). Immobilised penicillin G acylase from E. coli is contacted with a penicillin G solution under mild conditions (~28-37 °C, pH ~7.5-8.0) in stirred or packed-bed reactors, hydrolysing the amide bond to give 6-APA plus phenylacetic acid; pH is held constant by base addition as acid is liberated. 6-APA, poorly soluble at its isoelectric point, is crystallised by lowering pH to ~4 and filtered. More than 60% of the world's 20,000+ t/yr of 6-APA is made enzymatically because it avoids chlorinated reagents and cryogenic conditions.",
    },
    manufacturers: [
      { name: "Centrient Pharmaceuticals (ex DSM-Sinochem)", url: "https://centrient.com" },
      { name: "Sandoz", url: "https://www.sandoz.com" },
      { name: "The United Laboratories", url: "https://www.tul.com.hk" },
      { name: "dsm-firmenich", url: "https://www.dsm-firmenich.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "ScienceDirect, Enzymatic transformation of penicillins to 6-APA", url: "https://www.sciencedirect.com/science/article/abs/pii/S0734975000000392" },
      { name: "Centrient Pharmaceuticals, 6-APA", url: "https://centrient.com/our-products/6-apa" },
      { name: "ACS Omega, 6-APA process development", url: "https://pubs.acs.org/doi/10.1021/acsomega.0c02813" },
    ],
  },

  letrozole: {
    routes: [
      "Triazole N-alkylation with 4-(halomethyl)benzonitrile, then coupling with a second benzonitrile",
      "Regioselective route via 4-amino-1,2,4-triazole then deamination",
      "Carbanion coupling of the 4-(triazol-1-ylmethyl)benzonitrile intermediate",
    ],
    mainProcess: {
      name: "Triazole alkylation + benzonitrile coupling",
      detail:
        "Letrozole, an aromatase inhibitor, is built around two 4-cyanophenyl groups bridged by a methine bearing a 1,2,4-triazole. The key intermediate 4-(1H-1,2,4-triazol-1-ylmethyl)benzonitrile is made by N-alkylating the sodium salt of 1,2,4-triazole with 4-(halomethyl)benzonitrile, under conditions chosen to favour the 1H-regioisomer. This intermediate is deprotonated at the benzylic position with a strong base and coupled with a second 4-halo- (or 4-fluoro-) benzonitrile to install the second cyanophenyl group, giving letrozole after work-up. The crude is purified by crystallisation to >99%, controlling the regioisomeric triazole impurity; routes differ mainly in how they suppress the unwanted 4H-triazole isomer.",
    },
    manufacturers: [
      { name: "Novartis (originator, Femara)", url: "https://www.novartis.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
    ],
    sources: [
      { name: "NBINNO, Synthesis of letrozole", url: "https://www.nbinno.com/article/pharmaceutical-intermediates/navigating-synthesis-letrozole-criticality-4-1h-1-2-4-triazol-1-ylmethyl-benzonitrile-qo" },
      { name: "Google Patents, Process for preparation of letrozole", url: "https://patents.google.com/patent/US7705159B2/en" },
      { name: "Pharmaoffer, Letrozole API suppliers", url: "https://pharmaoffer.com/api-excipient-supplier/aromatase-inhibitors/letrozole" },
    ],
  },

  galantamine: {
    routes: [
      "Total synthesis via intramolecular oxidative phenolic coupling to narwedine, then asymmetric reduction",
      "Dynamic resolution of (±)-narwedine, then reduction to (−)-galantamine",
      "Extraction from Narcissus / Leucojum (Amaryllidaceae) bulbs",
    ],
    mainProcess: {
      name: "Synthetic route via narwedine",
      detail:
        "Galantamine is an acetylcholinesterase inhibitor used in Alzheimer's disease. The commercial synthetic route (developed by Sanochemia with TU Wien) builds the tetracyclic skeleton by an intramolecular oxidative phenolic coupling that forms narwedine, the key enone precursor. Racemic narwedine is upgraded to the single (−)-enantiomer by a dynamic, crystallisation-induced resolution, seeding an ethanol/triethylamine solution with (−)-narwedine epimerises and funnels almost all material to the desired crystal form. The narwedine enone is then stereoselectively reduced (e.g. with L-Selectride or a chirally modified hydride) to the allylic alcohol (−)-galantamine, isolated as the hydrobromide salt. Part of world supply is still extracted from daffodil (Narcissus) and snowflake (Leucojum) bulbs.",
    },
    manufacturers: [
      { name: "Janssen / Johnson & Johnson (originator, Razadyne)", url: "https://www.janssen.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
    ],
    sources: [
      { name: "Wikipedia, Galantamine total synthesis", url: "https://en.wikipedia.org/wiki/Galantamine_total_synthesis" },
      { name: "RSC Nat. Prod. Rep., Total synthesis of galantamine", url: "https://pubs.rsc.org/en/content/articlehtml/2024/np/d4np00001c" },
      { name: "Google Patents, Galantamine hydrobromide process", url: "https://patents.google.com/patent/EP2009015B1/en" },
    ],
  },

  "framycetin-sulphate": {
    routes: [
      "Submerged fermentation of Streptomyces fradiae, then isolation as the sulphate salt",
      "Semi-solid-state fermentation (higher titre)",
      "Ion-exchange recovery and purification of neomycin B from the neomycin complex",
    ],
    mainProcess: {
      name: "Streptomyces fradiae fermentation (neomycin B)",
      detail:
        "Framycetin is essentially neomycin B, the major component of the aminoglycoside antibiotic neomycin. It is produced by aerobic submerged fermentation of the soil actinomycete Streptomyces fradiae in a nutrient broth (carbon source, nitrogen sources such as soybean meal and ammonium salts, mineral salts) at ~28-37 °C for several days with controlled aeration and pH. The organism secretes a mixture of neomycins A, B and C; after fermentation the broth is filtered to remove mycelium and the basic, water-soluble antibiotic is captured and concentrated on a cation-exchange resin, eluted, and the neomycin-B-rich fraction is purified and crystallised as framycetin sulphate. Strain improvement and medium optimisation are used to raise the neomycin-B titre and ratio.",
    },
    manufacturers: [
      { name: "Sanofi (Soframycin / Sofradex brands)", url: "https://www.sanofi.com" },
      { name: "Pfizer", url: "https://www.pfizer.com" },
      { name: "Zhejiang Hisun Pharmaceutical", url: "https://www.hisunpharm.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
    ],
    sources: [
      { name: "ScienceDirect, Semi-solid-state fermentation for neomycin", url: "https://www.sciencedirect.com/science/article/abs/pii/S0168165613001685" },
      { name: "PharmaCompass, Framycetin sulfate", url: "https://www.pharmacompass.com/active-pharmaceutical-ingredients/framycetin-sulfate" },
      { name: "PMC, Optimisation of neomycin by S. fradiae", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4070395/" },
    ],
  },
  benzene: {
    routes: [
      "Recovery from catalytic reformate by aromatics extraction (~45% of supply)",
      "Extraction from pyrolysis gasoline (steam-cracker pygas)",
      "Toluene hydrodealkylation (HDA) to benzene",
      "Toluene disproportionation (also yields xylenes); minor coke-oven light oil",
    ],
    mainProcess: {
      name: "Aromatics extraction from reformate / pygas",
      detail:
        "About 70% of benzene is recovered from catalytic reformate (from naphtha catalytic reforming) and from pyrolysis gasoline produced as a co-product of olefin steam cracking. Because benzene boils close to non-aromatic hydrocarbons, it is separated by liquid-liquid extraction or extractive distillation with a polar solvent such as sulfolane that preferentially dissolves the aromatics; the extract is then distilled to high-purity benzene. To balance supply, surplus toluene is converted to benzene by hydrodealkylation (toluene + H2 → benzene + methane at ~500-600 °C, 40-60 bar) or by disproportionation, which also produces xylenes.",
    },
    manufacturers: [
      { name: "Chevron Phillips Chemical", url: "https://www.cpchem.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "Dow", url: "https://www.dow.com" },
    ],
    sources: [
      { name: "Essential Chemical Industry, Benzene", url: "https://www.essentialchemicalindustry.org/chemicals/benzene.html" },
      { name: "ChemAnalyst, Industrial production of benzene", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/understanding-the-industrial-production-process-of-benzene-37940" },
      { name: "Chevron Phillips Chemical, Benzene", url: "https://www.cpchem.com/what-we-do/solutions/aromatics/products/benzene" },
    ],
  },

  phenol: {
    routes: [
      "Cumene (Hock) process, cumene oxidation to hydroperoxide, then acid cleavage (~95% of output)",
      "Toluene oxidation via benzoic acid (Dow/Lummus)",
      "Direct benzene oxidation / sulphonation routes (largely historical)",
    ],
    mainProcess: {
      name: "Cumene (Hock) process",
      detail:
        "Benzene is alkylated with propylene over an acid catalyst to cumene (isopropylbenzene). Cumene is oxidised with air at ~80-130 °C to cumene hydroperoxide (CHP), which is then cleaved with a small amount of sulfuric acid to give phenol plus acetone as a co-product: C6H5CH(CH3)2 → C6H5OH + (CH3)2CO. Each tonne of phenol yields roughly 0.6 t of acetone, so the two markets are linked. The crude is neutralised and separated by a train of distillation columns to recover phenol, acetone, and unreacted cumene/alpha-methylstyrene for recycle or hydrogenation.",
    },
    manufacturers: [
      { name: "INEOS Phenol (world's largest)", url: "https://www.ineos.com" },
      { name: "Mitsui Chemicals", url: "https://www.mitsuichemicals.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
    ],
    sources: [
      { name: "INEOS, Phenol", url: "https://www.ineos.com/industry/products/chemicals/phenol/" },
      { name: "Wikipedia, Cumene process", url: "https://en.wikipedia.org/wiki/Cumene_process" },
      { name: "ChemAnalyst, Phenol market", url: "https://www.chemanalyst.com/industry-report/phenol-market-184" },
    ],
  },

  acetone: {
    routes: [
      "Co-product of the cumene-to-phenol (Hock) process, dominant",
      "Catalytic dehydrogenation of isopropanol (IPA)",
      "Recovery from petrochemical streams (minor)",
    ],
    mainProcess: {
      name: "Cumene process co-product (with phenol)",
      detail:
        "Most acetone is made together with phenol in the cumene process: cumene is air-oxidised to cumene hydroperoxide, which is acid-cleaved to phenol and acetone, (CH3)2CO. The cleavage mixture is neutralised and distilled, with acetone taken overhead and purified to high grade. Because it is tied to phenol demand, dedicated acetone is also produced by catalytic dehydrogenation of isopropanol over a copper or zinc oxide catalyst: (CH3)2CHOH → (CH3)2CO + H2.",
    },
    manufacturers: [
      { name: "INEOS Phenol", url: "https://www.ineos.com" },
      { name: "Mitsui Chemicals", url: "https://www.mitsuichemicals.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
      { name: "DOMO Chemicals", url: "https://www.domochemicals.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
    ],
    sources: [
      { name: "Wikipedia, Cumene process", url: "https://en.wikipedia.org/wiki/Cumene_process" },
      { name: "NBINNO, Cumene process: phenol & acetone", url: "https://www.nbinno.com/article/other-organic-chemicals/cumene-process-deep-dive-phenol-acetone-manufacturing-vh" },
      { name: "DOMO Chemicals, Acetone", url: "https://www.domochemicals.com/en/products/chemical-intermediates/acetone" },
    ],
  },

  propylene: {
    routes: [
      "Co-product of ethylene steam cracking (~60-65% of supply)",
      "By-product of refinery fluid catalytic cracking (FCC) (~30%)",
      "On-purpose propane dehydrogenation (PDH, CATOFIN / Oleflex)",
      "Olefin metathesis of ethylene + 2-butene",
    ],
    mainProcess: {
      name: "Steam cracking (with FCC and PDH on purpose)",
      detail:
        "Most propylene is a co-product of ethylene manufacture: hydrocarbon feeds (naphtha, LPG) are steam-cracked at 800-900 °C and the cracked gas is separated cryogenically, yielding propylene alongside ethylene, lower-severity, heavier feeds give relatively more propylene. Refinery FCC units supply roughly another 30% as a by-product of gasoline production, often boosted with ZSM-5 additive. Because cracker propylene has fallen with the shift to ethane feed, on-purpose propane dehydrogenation (PDH, CATOFIN or Oleflex: C3H8 → C3H6 + H2) and metathesis are increasingly used to close the gap.",
    },
    manufacturers: [
      { name: "Dow", url: "https://www.dow.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
    ],
    sources: [
      { name: "Wikipedia, Propylene", url: "https://en.wikipedia.org/wiki/Propylene" },
      { name: "Wikipedia, Steam cracking", url: "https://en.wikipedia.org/wiki/Steam_cracking" },
      { name: "Applied Petrochemical Research, Propylene via FCC", url: "https://link.springer.com/article/10.1007/s13203-015-0104-3" },
    ],
  },

  ethylene: {
    routes: [
      "Steam cracking of ethane/LPG (gas crackers, high ethylene yield)",
      "Steam cracking of naphtha/gas oil (liquid crackers, more co-products)",
      "Coal/methanol to olefins (MTO/CTO, China)",
      "Catalytic/oxidative dehydrogenation of ethane (emerging)",
    ],
    mainProcess: {
      name: "Hydrocarbon steam cracking",
      detail:
        "Ethylene is produced by steam cracking: a hydrocarbon feed (ethane, propane/LPG, or naphtha/gas oil) is mixed with dilution steam and heated in tubular furnaces to 800-900 °C with very short residence time, breaking C-C bonds to form ethylene and other olefins. The furnace effluent is quenched and the cracked gas is compressed, treated, and separated by cryogenic distillation into polymer-grade ethylene, propylene and other fractions. Light feeds such as ethane give ~80% ethylene and few co-products; naphtha gives ~30% ethylene plus propylene, butadiene and aromatics. China increasingly makes ethylene via coal/methanol-to-olefins.",
    },
    manufacturers: [
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
    ],
    sources: [
      { name: "Wikipedia, Steam cracking", url: "https://en.wikipedia.org/wiki/Steam_cracking" },
      { name: "ScienceDirect, Steam cracking overview", url: "https://www.sciencedirect.com/topics/chemistry/steam-cracking" },
      { name: "Coherent Market Insights, Ethylene market", url: "https://www.coherentmarketinsights.com/market-insight/global-ethylene-market-371" },
    ],
  },

  urea: {
    routes: [
      "Synthesis from ammonia + CO2 via ammonium carbamate (Stamicarbon CO2-stripping)",
      "Snamprogetti/Saipem ammonia-stripping process",
      "Toyo ACES process; total-recycle and once-through layouts",
    ],
    mainProcess: {
      name: "Ammonia + CO2 synthesis (CO2-stripping)",
      detail:
        "Urea is made from its own upstream ammonia and the CO2 captured during ammonia synthesis. In a high-pressure reactor (~140-200 bar, 180-200 °C) ammonia and carbon dioxide first form ammonium carbamate, which then dehydrates to urea: 2 NH3 + CO2 → NH2COONH4 → NH2CONH2 + H2O. Conversion per pass is incomplete, so unreacted carbamate is decomposed and recovered, in the Stamicarbon process CO2 is used as a stripping agent inside the high-pressure loop (Snamprogetti strips with ammonia) to recycle reactants efficiently. The urea solution is concentrated by evaporation and finished into prills or granules.",
    },
    manufacturers: [
      { name: "Yara International", url: "https://www.yara.com" },
      { name: "IFFCO", url: "https://www.iffco.in" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "CF Industries", url: "https://www.cfindustries.com" },
      { name: "EuroChem Group", url: "https://www.eurochemgroup.com" },
      { name: "OCI Global", url: "https://www.oci-global.com" },
    ],
    sources: [
      { name: "Saipem, Snamprogetti urea technology", url: "https://www.saipem.com/en/solutions-energy-transition/onshore/snamprogetti-urea" },
      { name: "Fertilizer Industrial Services, Urea technology", url: "https://fertilizer.services/urea/" },
      { name: "Expert Market Research, Top urea companies", url: "https://www.expertmarketresearch.com/blogs/top-urea-companies" },
    ],
  },

  "bisphenol-a": {
    routes: [
      "Acid-catalysed condensation of phenol with acetone over ion-exchange resin (dominant)",
      "HCl-catalysed condensation (older homogeneous route)",
      "Reactive distillation / melt-crystallisation purification variants",
    ],
    mainProcess: {
      name: "Phenol-acetone condensation (ion-exchange resin)",
      detail:
        "Bisphenol A is made by condensing acetone with a large excess of phenol over a sulfonic-acid cation-exchange resin catalyst (often modified with a mercaptan promoter) at ~50-90 °C: (CH3)2CO + 2 C6H5OH → (CH3)2C(C6H4OH)2 + H2O. The phenol excess and the catalyst drive high selectivity to the para,para'-isomer required for polycarbonate and epoxy resins. The product is recovered as a phenol-BPA adduct by crystallisation, the phenol is stripped and recycled, and the BPA is finished by distillation/prilling. Isomer and tar by-products are cracked back to useful feeds.",
    },
    manufacturers: [
      { name: "Covestro (largest capacity)", url: "https://www.covestro.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "Mitsui Chemicals", url: "https://www.mitsuichemicals.com" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
      { name: "Chang Chun Group", url: "https://www.ccp.com.tw" },
      { name: "Nan Ya Plastics", url: "https://www.nanya.com" },
    ],
    sources: [
      { name: "Covestro, Bisphenol A", url: "https://www.covestro.com/en/sustainability/how-we-operate/product-responsibility/bisphenol-a" },
      { name: "Mordor Intelligence, BPA market", url: "https://www.mordorintelligence.com/industry-reports/bisphenol-a-bpa-market" },
      { name: "Grand View Research, BPA market", url: "https://www.grandviewresearch.com/industry-analysis/bisphenol-a-bpa-market" },
    ],
  },

  acrylonitrile: {
    routes: [
      "Propylene ammoxidation, SOHIO process (~90% of output)",
      "Propane ammoxidation (Asahi Kasei) using cheaper feed",
      "Recovery of by-product acetonitrile and HCN from the same reactor",
    ],
    mainProcess: {
      name: "Propylene ammoxidation (SOHIO process)",
      detail:
        "Acrylonitrile is made by the single-step gas-phase ammoxidation of propylene with ammonia and air over a bismuth-molybdate (multi-metal oxide) catalyst in a fluidised-bed reactor at roughly 400-500 °C and modest pressure: 2 C3H6 + 2 NH3 + 3 O2 → 2 CH2=CHCN + 6 H2O. The strongly exothermic reaction also produces valuable by-products acetonitrile and hydrogen cyanide, which are recovered. Reactor effluent is quenched, the acrylonitrile is absorbed in water and purified by extractive and conventional distillation. Asahi Kasei operates a variant that uses cheaper propane as feed.",
    },
    manufacturers: [
      { name: "INEOS Nitriles", url: "https://www.ineos.com" },
      { name: "Ascend Performance Materials", url: "https://www.ascendmaterials.com" },
      { name: "Asahi Kasei", url: "https://www.asahi-kasei.com" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
      { name: "Mitsubishi Chemical Group", url: "https://www.mcgc.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
    ],
    sources: [
      { name: "ACS, Sohio acrylonitrile process landmark", url: "https://www.acs.org/education/whatischemistry/landmarks/acrylonitrile.html" },
      { name: "ScienceDirect, Ammoxidation overview", url: "https://www.sciencedirect.com/topics/chemical-engineering/ammoxidation" },
      { name: "Technavio, Acrylonitrile market participants", url: "https://www.prnewswire.com/news-releases/acrylonitrile-market--asahi-kasei-corp-ascend-performance-materials-operations-llc-and-cornerstone-chemical-co-will-emerge-as-major-acrylonitrile-market-participants--technavio-301576121.html" },
    ],
  },

  "caustic-soda": {
    routes: [
      "Chlor-alkali electrolysis of brine, membrane cell (modern standard)",
      "Diaphragm cell electrolysis (older)",
      "Mercury cell electrolysis (being phased out)",
    ],
    mainProcess: {
      name: "Membrane-cell chlor-alkali electrolysis",
      detail:
        "Caustic soda is co-produced with chlorine and hydrogen by electrolysing saturated, purified sodium-chloride brine. In a membrane cell an ion-selective perfluorinated membrane separates the anode and cathode: chloride is oxidised to chlorine gas at the anode, while at the cathode water is reduced to hydrogen and hydroxide, and sodium ions migrate across the membrane to form sodium hydroxide solution (2 NaCl + 2 H2O → 2 NaOH + Cl2 + H2). The membrane process gives high-purity ~32% caustic that is evaporated to 50% or to solid flakes/prills, with lower energy use than the older diaphragm and mercury cells.",
    },
    manufacturers: [
      { name: "Olin Corporation (largest membrane caustic capacity)", url: "https://www.olin.com" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Occidental / OxyChem", url: "https://www.oxy.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
      { name: "Solvay", url: "https://www.solvay.com" },
    ],
    sources: [
      { name: "US EPA, Sodium hydroxide supply chain (PDF)", url: "https://www.epa.gov/system/files/documents/2023-03/Sodium+Hydroxide+Supply+Chain+Profile.pdf" },
      { name: "Olin Chlor Alkali, Sodium hydroxide", url: "https://olinchloralkali.com/products/sodium-hydroxide/" },
      { name: "MarketsandMarkets, Chlor-alkali companies", url: "https://www.marketsandmarkets.com/ResearchInsight/chlor-alkali-market.asp" },
    ],
  },

  "nitric-acid": {
    routes: [
      "Ostwald process, catalytic ammonia oxidation, then NO2 absorption (dominant)",
      "Single-, dual- and high-pressure absorption plant configurations",
      "Concentration to fuming/strong acid via extractive distillation",
    ],
    mainProcess: {
      name: "Ostwald process (ammonia oxidation)",
      detail:
        "Nitric acid is made from ammonia in three catalytic/absorption steps. Ammonia is mixed with air and oxidised over platinum-rhodium gauze at ~850-950 °C to nitric oxide: 4 NH3 + 5 O2 → 4 NO + 6 H2O. The NO is cooled and further oxidised by oxygen to nitrogen dioxide (2 NO + O2 → 2 NO2), which is then absorbed in water in a tall packed/tray column to give nitric acid: 3 NO2 + H2O → 2 HNO3 + NO, with the NO recycled. This yields ~55-65% acid; stronger or fuming acid is made by extractive distillation with sulfuric acid or magnesium nitrate.",
    },
    manufacturers: [
      { name: "Yara International", url: "https://www.yara.com" },
      { name: "CF Industries", url: "https://www.cfindustries.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Dyno Nobel (Incitec Pivot)", url: "https://www.dynonobel.com" },
      { name: "EuroChem Group", url: "https://www.eurochemgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Ostwald process", url: "https://en.wikipedia.org/wiki/Ostwald_process" },
      { name: "ChemAnalyst, Production process of nitric acid", url: "https://www.chemanalyst.com/Blogs/understanding-the-production-process-of-nitric-acid-10" },
      { name: "Trademark Nitrogen, Nitric acid & Ostwald process", url: "https://trademarknitrogen.com/News/Blog/ArtMID/774/ArticleID/6/Nitric-Acid-and-the-Ostwald-Process-A-Crucial-Chemical-Duo" },
    ],
  },

  "titanium-dioxide": {
    routes: [
      "Chloride process, continuous, high-grade ore to TiCl4 then oxidation (rutile)",
      "Sulfate process, batch digestion of ilmenite with sulfuric acid",
      "Surface treatment/coating and micronising to finished pigment",
    ],
    mainProcess: {
      name: "Chloride process",
      detail:
        "In the dominant chloride route, high-titanium feedstock (rutile, synthetic rutile or slag) is reacted with chlorine and coke in a fluidised bed at ~900-1000 °C to form titanium tetrachloride: TiO2 + 2 Cl2 + C → TiCl4 + CO2. The TiCl4 is purified by distillation and then oxidised with oxygen at high temperature to regenerate pure rutile TiO2 and release chlorine for recycle: TiCl4 + O2 → TiO2 + 2 Cl2. The raw pigment is then surface-treated (alumina/silica), washed, dried and micronised. The older sulfate process digests ilmenite in sulfuric acid and hydrolyses the titanyl sulfate, and still makes ~40% of world output.",
    },
    manufacturers: [
      { name: "The Chemours Company", url: "https://www.chemours.com" },
      { name: "Tronox Holdings", url: "https://www.tronox.com" },
      { name: "Kronos Worldwide", url: "https://www.kronostio2.com" },
      { name: "Venator Materials", url: "https://www.venatorcorp.com" },
      { name: "Ishihara Sangyo Kaisha (ISK)", url: "https://www.iskweb.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Titanium dioxide", url: "https://en.wikipedia.org/wiki/Titanium_dioxide" },
      { name: "Tronox, Titanium dioxide", url: "https://www.tronox.com/products/titanium-dioxide/" },
      { name: "MarketsandMarkets, Titanium dioxide market", url: "https://www.marketsandmarkets.com/ResearchInsight/titanium-dioxide-market.asp" },
    ],
  },

  "pvc-resin": {
    routes: [
      "Suspension polymerisation of vinyl chloride monomer (S-PVC; ~80% of output)",
      "Emulsion polymerisation (E-PVC, paste resin)",
      "Bulk (mass) polymerisation",
    ],
    mainProcess: {
      name: "Suspension polymerisation of VCM",
      detail:
        "PVC starts from vinyl chloride monomer (VCM), itself made from ethylene via ethylene dichloride cracking. In suspension polymerisation, VCM droplets are dispersed in water with suspending agents and an oil-soluble free-radical initiator, then polymerised in a batch autoclave at ~50-70 °C and autogenous pressure. The chain-growth reaction (n CH2=CHCl → [CH2-CHCl]n) is run to ~85-90% conversion before unreacted VCM is stripped and recovered; the porous PVC grains are centrifuged, dried and blended. Particle size and porosity are tuned by the suspending system to suit rigid or flexible compounds.",
    },
    manufacturers: [
      { name: "Shin-Etsu Chemical / Shintech (world's largest)", url: "https://www.shinetsu.co.jp" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
      { name: "INOVYN (INEOS)", url: "https://www.inovyn.com" },
      { name: "Orbia (Vestolit/Alphagary)", url: "https://www.orbia.com" },
      { name: "Occidental / OxyVinyls", url: "https://www.oxy.com" },
    ],
    sources: [
      { name: "Shin-Etsu Chemical, PVC", url: "https://www.shinetsu.co.jp/en/products/infrastructure-materials/polyvinyl-chloride-pvc/" },
      { name: "Westlake, PVC resin", url: "https://westlake.com/chlorovinyls/pvc-resin" },
      { name: "Verified Market Research, Top PVC manufacturers", url: "https://www.verifiedmarketresearch.com/blog/top-polyvinyl-chloride-manufacturers/" },
    ],
  },

  "carbon-black": {
    routes: [
      "Oil-furnace (furnace black) process, ~90% of output",
      "Gas black / channel black process",
      "Thermal black and acetylene black (specialty grades)",
    ],
    mainProcess: {
      name: "Oil-furnace process",
      detail:
        "Most carbon black is made by the furnace process: a heavy aromatic feedstock oil is injected into a hot combustion-gas stream (from burning natural gas or oil) inside a refractory-lined reactor, where it vaporises and pyrolyses in the vapour phase at ~1200-1900 °C to nucleate microscopic carbon particles. The reaction is quenched with water to fix the particle size and structure, then the carbon black is collected from the gas in bag filters, degassed, and pelletised. Adjusting feed rate, air and temperature controls particle size and surface area, which set the grade for tyres, rubber and pigments.",
    },
    manufacturers: [
      { name: "Cabot Corporation (world's largest)", url: "https://www.cabotcorp.com" },
      { name: "Birla Carbon", url: "https://www.birlacarbon.com" },
      { name: "Orion S.A. (Engineered Carbons)", url: "https://www.orioncarbons.com" },
      { name: "Tokai Carbon", url: "https://www.tokaicarbon.co.jp" },
      { name: "PCBL (Philips Carbon Black)", url: "https://www.pcblltd.com" },
      { name: "Continental Carbon", url: "https://www.continentalcarbon.com" },
    ],
    sources: [
      { name: "Wikipedia, Carbon black", url: "https://en.wikipedia.org/wiki/Carbon_black" },
      { name: "US EPA, Carbon black (AP-42 §6.1, PDF)", url: "https://www3.epa.gov/ttn/chief/ap42/ch06/final/c06s01.pdf" },
      { name: "IMARC, Top carbon black companies", url: "https://www.imarcgroup.com/top-carbon-black-companies" },
    ],
  },

  melamine: {
    routes: [
      "Urea pyrolysis, high-pressure non-catalytic process (Casale/Eurotecnica)",
      "Low-pressure catalytic process (gas-phase over alumina)",
      "Off-gas (NH3 + CO2) recycled to the urea plant",
    ],
    mainProcess: {
      name: "High-pressure urea pyrolysis",
      detail:
        "Melamine is made by the thermal condensation (pyrolysis) of urea. In the high-pressure non-catalytic process a urea melt is fed to a reactor at ~70-200 bar and ~360-420 °C, where urea first decomposes to cyanic acid/isocyanic acid and ammonia and then trimerises to melamine: 6 (NH2)2CO → C3H6N6 + 6 NH3 + 3 CO2. The molten melamine is quenched and purified (crystallised from water) to high purity, while the off-gas of ammonia and carbon dioxide is recycled back to an integrated urea unit. Low-pressure catalytic processes run the same chemistry in the gas phase over an alumina catalyst.",
    },
    manufacturers: [
      { name: "Borealis (OMV)", url: "https://www.borealisgroup.com" },
      { name: "OCI Global", url: "https://www.oci-global.com" },
      { name: "Grupa Azoty", url: "https://www.grupaazoty.com" },
      { name: "Cornerstone Chemical", url: "https://www.cornerstonechem.com" },
      { name: "Mitsui Chemicals", url: "https://www.mitsuichemicals.com" },
    ],
    sources: [
      { name: "Borealis, Melamine technology", url: "https://www.borealisgroup.com/news/borealis-sells-melamine-process-technology-to-urea-casale-sa" },
      { name: "Google Patents, High-purity melamine from urea", url: "https://patents.google.com/patent/EP2098516A1/en" },
      { name: "Google Patents, Production of melamine", url: "https://patents.google.com/patent/US2918467A/en" },
    ],
  },

  polypropylene: {
    routes: [
      "Gas-phase polymerisation of propylene (Unipol, Novolen) over Ziegler-Natta catalyst",
      "Bulk/slurry loop polymerisation (LyondellBasell Spheripol)",
      "Metallocene-catalysed grades for specialty applications",
    ],
    mainProcess: {
      name: "Ziegler-Natta polymerisation of propylene",
      detail:
        "Polymer-grade propylene is polymerised with a magnesium-chloride-supported titanium Ziegler-Natta catalyst (activated by an aluminium alkyl and an external electron donor that controls stereoregularity) to give highly isotactic polypropylene. In the widely used gas-phase fluidised-bed (Unipol) or bulk slurry-loop (Spheripol) processes, propylene reacts at ~60-80 °C and ~20-35 bar; the growing polymer forms solid granules around the catalyst particles. Comonomer (ethylene) can be added in a second reactor to make impact copolymers. The powder is degassed of monomer, stabilised and pelletised.",
    },
    manufacturers: [
      { name: "LyondellBasell (largest PP technology licensor)", url: "https://www.lyondellbasell.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "Borealis (OMV)", url: "https://www.borealisgroup.com" },
      { name: "Braskem", url: "https://www.braskem.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
    ],
    sources: [
      { name: "Wikipedia, Ziegler-Natta catalyst", url: "https://en.wikipedia.org/wiki/Ziegler%E2%80%93Natta_catalyst" },
      { name: "LyondellBasell, Gas-phase PP processes (PDF)", url: "https://www.lyondellbasell.com/globalassets/products-technology/technology/gas-phase-pp-processes.pdf?id=13744" },
      { name: "Mordor Intelligence, Polypropylene companies", url: "https://www.mordorintelligence.com/industry-reports/polypropylene-market/companies" },
    ],
  },

  hdpe: {
    routes: [
      "Slurry (loop/stirred) polymerisation of ethylene",
      "Gas-phase fluidised-bed polymerisation (Unipol)",
      "Solution-phase polymerisation; Ziegler-Natta, Phillips (Cr) or metallocene catalysts",
    ],
    mainProcess: {
      name: "Catalytic ethylene polymerisation (slurry / gas phase)",
      detail:
        "High-density polyethylene is made by coordination polymerisation of ethylene (with a little 1-butene/1-hexene comonomer) over Ziegler-Natta, Phillips chromium-oxide, or metallocene catalysts, which give the linear, minimally branched chains responsible for high density and crystallinity. In the slurry process ethylene polymerises in a diluent in loop or stirred reactors at ~80-110 °C and ~30-40 bar, forming solid polymer particles; gas-phase fluidised-bed and solution processes are also widely used. Hydrogen controls molecular weight. The polymer is separated, degassed, additised and pelletised.",
    },
    manufacturers: [
      { name: "Dow", url: "https://www.dow.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "INEOS Olefins & Polymers", url: "https://www.ineos.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
    ],
    sources: [
      { name: "Expert Market Research, HDPE market", url: "https://www.expertmarketresearch.com/reports/high-density-polyethylene-hdpe-market" },
      { name: "American Chemistry Council, HDPE LCA (PDF)", url: "https://www.americanchemistry.com/content/download/8059/file/Cradle-to-Gate-Life-Cycle-Analysis-of-High-Density-Polyethylene-HDPE-Resin.pdf" },
      { name: "DOAJ, PE by slurry process (patent review)", url: "https://doaj.org/article/ece134ed6eed4ee3b72a0287d740b43f" },
    ],
  },

  "methyl-methacrylate-mma": {
    routes: [
      "Acetone cyanohydrin (ACH) sulfuric-acid route, long-dominant",
      "C4 direct oxidation of isobutylene/tert-butanol",
      "Ethylene-based Alpha / LiMA routes (Mitsubishi, Röhm)",
    ],
    mainProcess: {
      name: "Acetone cyanohydrin (ACH) process",
      detail:
        "In the principal ACH route, acetone reacts with hydrogen cyanide to form acetone cyanohydrin, which is treated with concentrated sulfuric acid to give methacrylamide sulfate; this is then esterified with methanol to methyl methacrylate, regenerating ammonium bisulfate: (CH3)2C(OH)CN → ... → CH2=C(CH3)COOCH3. Newer plants increasingly use the ethylene-based Alpha process (methyl propionate from ethylene/CO/methanol, then condensation with formaldehyde) and Röhm's LiMA technology to avoid HCN and sulfuric-acid by-product. The crude monomer is purified by distillation with a polymerisation inhibitor.",
    },
    manufacturers: [
      { name: "Röhm (only global MMA & PMMA maker)", url: "https://www.roehm.com" },
      { name: "Mitsubishi Chemical (Methacrylates)", url: "https://www.mcgc.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
      { name: "Kuraray", url: "https://www.kuraray.com" },
    ],
    sources: [
      { name: "ACS, Methyl methacrylate", url: "https://www.acs.org/molecule-of-the-week/archive/m/methyl-methacrylate.html" },
      { name: "Röhm, LiMA MMA technology", url: "https://www.roehm.com/en/detail/lima-technology-at-full-scale-operation-official-opening-of-rohm-s-bay-city-mma-plant" },
      { name: "SL Chemtech, MMA production overview", url: "https://www.slchemtech.com/news/methyl-methacrylate-production.html" },
    ],
  },

  "vinyl-acetate-monomer-vam": {
    routes: [
      "Vapour-phase ethylene acetoxylation (ethylene + acetic acid + O2, Pd catalyst), dominant",
      "Acetylene + acetic acid addition (older, still used in China with coal acetylene)",
    ],
    mainProcess: {
      name: "Ethylene acetoxylation (Pd/Au catalyst)",
      detail:
        "Vinyl acetate is made by the gas-phase oxidative addition (acetoxylation) of acetic acid to ethylene with oxygen over a supported palladium-gold catalyst (often with potassium acetate promoter) at ~150-180 °C and ~5-10 bar: C2H4 + CH3COOH + 1/2 O2 → CH2=CHOOCCH3 + H2O. The reactor effluent is cooled, the monomer absorbed/scrubbed, and CO2 and light ends removed, then VAM is purified by distillation with an inhibitor. Coal-rich regions still use the older acetylene-plus-acetic-acid route.",
    },
    manufacturers: [
      { name: "Celanese (world's largest VAM maker)", url: "https://www.celanese.com" },
      { name: "Dairen Chemical", url: "https://www.dcc.com.tw" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "Kuraray", url: "https://www.kuraray.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "Wacker Chemie", url: "https://www.wacker.com" },
    ],
    sources: [
      { name: "Wikipedia, Vinyl acetate", url: "https://en.wikipedia.org/wiki/Vinyl_acetate" },
      { name: "Celanese, Vinyl Acetate Monomer (PDF)", url: "https://www.celanese.com/-/media/Intermediate-Chemistry/Files/Brochures/Vinyl-Acetate-Monomer-VAM-Brochure.pdf" },
      { name: "Merchant Research, VAM overview", url: "https://mcgroup.co.uk/news/20240115/vinyl-acetate-monomer-vam-the-essential-chemical-in-modern-manufacturing.html" },
    ],
  },

  "acrylic-acid": {
    routes: [
      "Two-stage vapour-phase oxidation of propylene (via acrolein), dominant",
      "Propane oxidation (developmental)",
      "Bio-based routes from glycerol / 3-HP (emerging)",
    ],
    mainProcess: {
      name: "Two-stage propylene oxidation",
      detail:
        "Acrylic acid is made by oxidising propylene with air in two catalytic vapour-phase stages. In the first reactor propylene is oxidised over a bismuth-molybdate catalyst to acrolein (CH2=CHCHO); in the second reactor the acrolein is oxidised over a molybdenum-vanadium oxide catalyst to acrylic acid (CH2=CHCOOH), each stage at ~200-320 °C with separate temperature control. The reactor gas is absorbed in water and the crude acid is recovered and purified by solvent extraction and distillation, with glacial acrylic acid taken for esters and superabsorbent polymers. An inhibitor is used throughout to prevent polymerisation.",
    },
    manufacturers: [
      { name: "BASF (largest capacity)", url: "https://www.basf.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Arkema", url: "https://www.arkema.com" },
      { name: "Nippon Shokubai", url: "https://www.shokubai.co.jp" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
    ],
    sources: [
      { name: "Intratec, Acrylic acid from propylene (PDF)", url: "https://cdn.intratec.us/docs/reports/previews/acrylic-acid-e11a-b.pdf" },
      { name: "Nippon Shokubai, Process catalysts", url: "https://www.shokubai.co.jp/en/products/detail/process_cat/" },
      { name: "US EPA, Acrylic acid manufacture", url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=91017W1A.TXT" },
    ],
  },

  caprolactam: {
    routes: [
      "Cyclohexanone → oxime → Beckmann rearrangement (conventional, dominant)",
      "Photonitrosation of cyclohexane (Toray PNC)",
      "Vapour-phase Beckmann over zeolite (Sumitomo, by-product-free)",
    ],
    mainProcess: {
      name: "Cyclohexanone oxime Beckmann rearrangement",
      detail:
        "Caprolactam, the monomer for nylon-6, is made from cyclohexanone. The ketone is converted to cyclohexanone oxime with hydroxylamine, and the oxime then undergoes the acid-catalysed Beckmann rearrangement, traditionally in fuming sulfuric acid (oleum), to ring-expand into ε-caprolactam. The acidic mixture is neutralised with ammonia, producing large amounts of ammonium sulfate by-product, after which the lactam is purified by extraction and distillation. Newer routes (Sumitomo's vapour-phase Beckmann over a high-silica zeolite with HPO ammoximation) avoid the sulfate by-product.",
    },
    manufacturers: [
      { name: "Fibrant (Highsun)", url: "https://www.fibrant52.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "UBE Corporation", url: "https://www.ube.com" },
      { name: "AdvanSix", url: "https://www.advansix.com" },
      { name: "DOMO Chemicals", url: "https://www.domochemicals.com" },
    ],
    sources: [
      { name: "Fibrant, Caprolactam", url: "https://www.fibrant52.com/en/products/caprolactam" },
      { name: "Google Patents, Beckmann rearrangement to caprolactam", url: "https://patents.google.com/patent/US5264571A/en" },
      { name: "Mordor Intelligence, Caprolactam companies", url: "https://www.mordorintelligence.com/industry-reports/caprolactam-market/companies" },
    ],
  },

  "ethylene-dichloride-edc": {
    routes: [
      "Direct chlorination of ethylene (Cl2 addition, FeCl3 catalyst)",
      "Oxychlorination of ethylene (with HCl + O2), recycles HCl from VCM cracking",
      "Balanced plants combine both routes for chlorine efficiency",
    ],
    mainProcess: {
      name: "Direct chlorination + oxychlorination (balanced process)",
      detail:
        "Ethylene dichloride (1,2-dichloroethane), the precursor to vinyl chloride, is made from ethylene by two complementary reactions run together. Direct chlorination adds chlorine across ethylene in the liquid phase over a ferric-chloride catalyst at ~50-70 °C: C2H4 + Cl2 → C2H4Cl2. Oxychlorination reacts ethylene with hydrogen chloride and oxygen over a copper-chloride catalyst (C2H4 + 2 HCl + 1/2 O2 → C2H4Cl2 + H2O), consuming the HCl that is released when EDC is later cracked to vinyl chloride. Combining the two closes the chlorine balance; the EDC is purified by distillation.",
    },
    manufacturers: [
      { name: "Occidental / OxyChem", url: "https://www.oxy.com" },
      { name: "INEOS", url: "https://www.ineos.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Shin-Etsu / Shintech", url: "https://www.shinetsu.co.jp" },
    ],
    sources: [
      { name: "OxyChem, EDC handbook (PDF)", url: "https://www.oxy.com/siteassets/documents/chemicals/products/chlorinated-organics/edc.pdf" },
      { name: "Westlake Vinnolit, EDC/VCM process", url: "https://www.westlakevinnolit.com/en/licensing/edc-vcm-process/" },
      { name: "ChemAnalyst, EDC supply chain", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/untangling-the-global-ethylene-dichloride-edc-supply-chain-from-feedstock-38377" },
    ],
  },

  "toluene-diisocyanate-tdi": {
    routes: [
      "Toluene → dinitrotoluene → toluenediamine → phosgenation to TDI (conventional)",
      "Liquid-phase phosgenation (most producers)",
      "Gas-phase phosgenation (Covestro proprietary, lower phosgene hold-up)",
    ],
    mainProcess: {
      name: "TDA phosgenation",
      detail:
        "Toluene diisocyanate is made in three steps. Toluene is nitrated with mixed acid to dinitrotoluene (DNT), which is catalytically hydrogenated to toluenediamine (TDA). The TDA is then reacted with phosgene (COCl2), forming a carbamoyl chloride intermediate that loses HCl to give the diisocyanate: TDA + 2 COCl2 → TDI + 4 HCl. Most plants run liquid-phase phosgenation in a solvent; Covestro uses a gas-phase process that reduces phosgene inventory and energy. TDI is purified by distillation and largely consumed in flexible polyurethane foam.",
    },
    manufacturers: [
      { name: "Wanhua Chemical (global leader)", url: "https://www.wanhuachemical.com" },
      { name: "Covestro", url: "https://www.covestro.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Mitsui Chemicals", url: "https://www.mitsuichemicals.com" },
      { name: "Hanwha Solutions", url: "https://www.hanwhasolutions.com" },
    ],
    sources: [
      { name: "ChemAnalyst, How TDI is made", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/how-toluene-diisocyanate-tdi-is-made-a-quick-dive-into-process-sustainability-37881" },
      { name: "Mordor Intelligence, TDI market", url: "https://www.mordorintelligence.com/industry-reports/toluene-diisocyanate-market" },
      { name: "Fortune Business Insights, TDI market", url: "https://www.fortunebusinessinsights.com/toluene-diisocyanate-market-113962" },
    ],
  },

  "ethyl-acrylate": {
    routes: [
      "Acid-catalysed esterification of acrylic acid with ethanol (dominant)",
      "Reactive distillation esterification variants",
    ],
    mainProcess: {
      name: "Esterification of acrylic acid with ethanol",
      detail:
        "Ethyl acrylate is made by the acid-catalysed (e.g. sulfonic-acid resin or sulfuric acid) esterification of acrylic acid with ethanol: CH2=CHCOOH + C2H5OH ⇌ CH2=CHCOOC2H5 + H2O. The equilibrium reaction is driven by removing water (and ester) as it forms, often by reactive distillation. The crude ester is neutralised, washed and distilled under inhibitor to give the monomer, which is used in acrylic emulsion polymers for coatings, adhesives and textiles. (Acrylic acid itself comes from propylene oxidation.)",
    },
    manufacturers: [
      { name: "Dow", url: "https://www.dow.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Arkema", url: "https://www.arkema.com" },
      { name: "Nippon Shokubai", url: "https://www.shokubai.co.jp" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
    ],
    sources: [
      { name: "Wikipedia, Ethyl acrylate", url: "https://en.wikipedia.org/wiki/Ethyl_acrylate" },
      { name: "Basic Acrylic Monomer Manufacturers (BAMM)", url: "https://www.bamm.net/about-bamm" },
      { name: "MarketsandMarkets, Acrylate market", url: "https://www.marketsandmarkets.com/ResearchInsight/acrylate-market.asp" },
    ],
  },

  "n-butyl-acrylate": {
    routes: [
      "Acid-catalysed esterification of acrylic acid with n-butanol (dominant)",
      "Reactive distillation esterification variants",
    ],
    mainProcess: {
      name: "Esterification of acrylic acid with n-butanol",
      detail:
        "n-Butyl acrylate, a low-glass-transition acrylic monomer, is produced by esterifying acrylic acid with n-butanol over an acid catalyst: CH2=CHCOOH + C4H9OH ⇌ CH2=CHCOOC4H9 + H2O. Water is continuously removed to drive the equilibrium, and the product is neutralised, washed and purified by vacuum distillation with a polymerisation inhibitor. It is a key soft monomer in pressure-sensitive adhesives, paints and sealants. The upstream acrylic acid is supplied by propylene oxidation.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Arkema", url: "https://www.arkema.com" },
      { name: "Nippon Shokubai", url: "https://www.shokubai.co.jp" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
    ],
    sources: [
      { name: "Arkema, Butyl acrylate", url: "https://www.arkema.com/usa/en/product/acrylics/butylacrylate/" },
      { name: "Basic Acrylic Monomer Manufacturers (BAMM)", url: "https://www.bamm.net/about-bamm" },
      { name: "ChemPoint, Butyl acrylate (BASF)", url: "https://www.chempoint.com/products/basf/basf-acrylic-monomers/butyl-acrylate" },
    ],
  },

  "ortho-xylene": {
    routes: [
      "Recovery from catalytic reformate / pyrolysis gasoline mixed-xylenes",
      "Superfractionation (distillation) of o-xylene from the C8 aromatics",
      "Xylene isomerisation and transalkylation to boost o-xylene",
    ],
    mainProcess: {
      name: "Distillation from mixed xylenes",
      detail:
        "Ortho-xylene is separated from the mixed-xylene stream produced by catalytic reforming of naphtha (and from pyrolysis gasoline). Unlike para-xylene, o-xylene boils far enough from the other C8 aromatics (~144 °C) that it can be recovered by careful superfractionation in tall distillation columns rather than by adsorption or crystallisation. Mixed-xylene supply is supplemented by xylene isomerisation and toluene/C9 transalkylation. The purified o-xylene is mainly oxidised to phthalic anhydride for plasticisers.",
    },
    manufacturers: [
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "bp", url: "https://www.bp.com" },
      { name: "Formosa Plastics", url: "https://www.fpc.com.tw" },
    ],
    sources: [
      { name: "US DOE, The BTX chain (PDF)", url: "http://www1.eere.energy.gov/manufacturing/resources/chemicals/pdfs/profile_chap4.pdf" },
      { name: "S&P Global, ortho-Xylene CEH abstract (PDF)", url: "https://www.spglobal.com/content/dam/spglobal/ci/en/documents/products/pdf/CI_0825-Global-CEH-ortho-Xylene-Abstract.pdf" },
      { name: "US EPA, Phthalic anhydride from o-xylene", url: "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P100BG0H.TXT" },
    ],
  },

  cyclohexanone: {
    routes: [
      "Catalytic air oxidation of cyclohexane to KA oil (cyclohexanone + cyclohexanol)",
      "Hydrogenation of phenol to cyclohexanol/cyclohexanone, then dehydrogenation",
      "Selective hydrogenation of phenol directly to cyclohexanone",
    ],
    mainProcess: {
      name: "Cyclohexane air oxidation (KA oil)",
      detail:
        "Most cyclohexanone is made by the catalytic oxidation of cyclohexane with air over a cobalt or manganese catalyst at ~150-160 °C and ~10-20 bar, which gives a mixture of cyclohexanol and cyclohexanone known as KA (ketone-alcohol) oil at low per-pass conversion to limit over-oxidation. The cyclohexanol portion is then dehydrogenated over a zinc/copper catalyst to additional cyclohexanone. Alternatively, phenol is hydrogenated to cyclohexanone (directly or via cyclohexanol). Cyclohexanone is overwhelmingly used to make caprolactam (nylon-6) and adipic acid (nylon-66).",
    },
    manufacturers: [
      { name: "Fibrant (Highsun)", url: "https://www.fibrant52.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "UBE Corporation", url: "https://www.ube.com" },
      { name: "Asahi Kasei", url: "https://www.asahi-kasei.com" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Cyclohexanone", url: "https://en.wikipedia.org/wiki/Cyclohexanone" },
      { name: "ChemicalBook, Cyclohexanone production", url: "https://www.chemicalbook.com/article/cyclohexanone-chemical-and-physical-properties-production-and-uses.htm" },
      { name: "Vinipul, Cyclohexanone in nylon", url: "https://vinipulchemicals.com/cyclohexanone-in-nylon-production" },
    ],
  },

  glycerin: {
    routes: [
      "By-product of biodiesel transesterification (>85% of supply), then refining",
      "By-product of oleochemical fat splitting / soap making",
      "Synthetic glycerol from propylene (epichlorohydrin route, minor)",
    ],
    mainProcess: {
      name: "Biodiesel by-product recovery + refining",
      detail:
        "Most glycerol is recovered as the co-product of biodiesel and oleochemical manufacture. When vegetable oils or fats are transesterified with methanol (or hydrolysed/saponified), the triglyceride's glycerol backbone is released as a crude glycerol stream, roughly 10 kg per 100 kg of biodiesel. The crude is acidified to remove soaps and free fatty acids, the methanol is recovered, and the glycerol is refined by vacuum distillation and/or ion exchange plus activated-carbon bleaching to reach >99.5% USP/pharmaceutical purity. A small amount of synthetic glycerol is still made from propylene via epichlorohydrin.",
    },
    manufacturers: [
      { name: "Wilmar International", url: "https://www.wilmar-international.com" },
      { name: "Emery Oleochemicals", url: "https://www.emeryoleo.com" },
      { name: "KLK OLEO", url: "https://www.klkoleo.com" },
      { name: "ADM", url: "https://www.adm.com" },
      { name: "Kao Corporation", url: "https://www.kao.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
    ],
    sources: [
      { name: "Grand View Research, Glycerol market", url: "https://www.grandviewresearch.com/industry-analysis/glycerol-market" },
      { name: "RSC Advances, Crude glycerol from biodiesel", url: "https://pubs.rsc.org/en/content/articlehtml/2022/ra/d2ra05090k" },
      { name: "GMInsights, Glycerol market", url: "https://www.gminsights.com/industry-analysis/glycerol-market-size" },
    ],
  },

  "sodium-tripolyphosphate-stpp": {
    routes: [
      "Neutralise phosphoric acid with soda ash to ortho-phosphate mix, then calcine",
      "Spray-dry and high-temperature polymerisation (~350-450 °C)",
      "Feedstock from thermal or purified wet-process phosphoric acid",
    ],
    mainProcess: {
      name: "Phosphoric acid / soda-ash neutralisation + calcination",
      detail:
        "STPP is made by first neutralising phosphoric acid with sodium carbonate (soda ash) and/or caustic to a sodium-to-phosphorus ratio of about 5:3, giving an aqueous mixture of mono- and di-sodium orthophosphate (roughly 1:2). This solution is dried, and the orthophosphate powder is then calcined at ~350-450 °C, where the molecules condense (polymerise) and split out water to form sodium tripolyphosphate (Na5P3O10). Cooling and milling give the finished product, whose hydration form (Phase I/II) is controlled by calcination temperature; it is used mainly in detergents and as a food additive.",
    },
    manufacturers: [
      { name: "Prayon", url: "https://www.prayon.com" },
      { name: "Innophos", url: "https://www.innophos.com" },
      { name: "Occidental / OxyChem", url: "https://www.oxy.com" },
      { name: "Aditya Birla Chemicals", url: "https://www.adityabirlachemicals.com" },
      { name: "PhosAgro", url: "https://www.phosagro.com" },
    ],
    sources: [
      { name: "Google Patents, STPP from wet-process acid & soda ash", url: "https://patents.google.com/patent/US4209497A/en" },
      { name: "ScienceDirect, Sodium triphosphate overview", url: "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/sodium-triphosphate" },
      { name: "MarketsandMarkets, STPP companies", url: "https://www.marketsandmarkets.com/ResearchInsight/sodium-tripolyphosphate-companies.asp" },
    ],
  },

  "potassium-carbonate": {
    routes: [
      "Carbonation of potassium hydroxide (from KCl electrolysis) with CO2",
      "Potassium bicarbonate intermediate, then calcination to K2CO3",
      "Engel-Precht magnesium double-salt route (obsolete)",
    ],
    mainProcess: {
      name: "Potash electrolysis + carbonation",
      detail:
        "Modern potassium carbonate starts from potassium chloride, which is converted to potassium hydroxide by chlor-alkali electrolysis of KCl brine. The KOH solution is then carbonated with carbon dioxide to precipitate potassium bicarbonate (2 KOH + 2 CO2 → 2 KHCO3), which is filtered and thermally decomposed (calcined) back to potassium carbonate, water and CO2: 2 KHCO3 → K2CO3 + H2O + CO2. The recovered CO2 is recycled. The older Engel-Precht magnesium-double-salt process is essentially obsolete.",
    },
    manufacturers: [
      { name: "UNID (world's largest K2CO3 maker)", url: "https://www.unid.co.kr" },
      { name: "Armand Products", url: "https://www.armandproducts.com" },
      { name: "AGC Inc.", url: "https://www.agc.com" },
      { name: "Vynova Group", url: "https://www.vynova-group.com" },
      { name: "Evonik Industries", url: "https://www.evonik.com" },
    ],
    sources: [
      { name: "Armand Products, Potassium carbonate handbook", url: "https://www.armandproducts.com/products/media/potassium-carbonate-handbook/" },
      { name: "Google Patents, Producing potassium carbonate", url: "https://patents.google.com/patent/US5449506A/en" },
      { name: "USDA, Potassium carbonate technical report (PDF)", url: "https://www.ams.usda.gov/sites/default/files/media/2023Technical_Report_Potassium_Carbonate_Handling.pdf" },
    ],
  },

  "sodium-bicarbonate": {
    routes: [
      "Solvay process, carbonation of ammoniated brine (NaHCO3 is the intermediate)",
      "Carbonation of soda-ash solution with CO2 (refined bicarbonate)",
      "From natural trona/nahcolite (mining)",
    ],
    mainProcess: {
      name: "Solvay / soda-ash carbonation",
      detail:
        "Sodium bicarbonate is the key intermediate of the Solvay soda-ash process: purified sodium-chloride brine is saturated with ammonia and then carbonated with CO2 (from limestone calcination) in tall carbonation towers, precipitating sparingly soluble sodium bicarbonate: NaCl + NH3 + CO2 + H2O → NaHCO3 + NH4Cl. For refined-grade bicarbonate, soda ash (sodium carbonate) is redissolved and re-carbonated with carbon dioxide (Na2CO3 + CO2 + H2O → 2 NaHCO3) and crystallised to high purity. Producers in the US also make it from mined trona/nahcolite.",
    },
    manufacturers: [
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Church & Dwight (ARM & HAMMER)", url: "https://www.churchdwight.com" },
      { name: "Tata Chemicals", url: "https://www.tatachemicals.com" },
      { name: "Tosoh Corporation", url: "https://www.tosoh.com" },
      { name: "Natural Soda (ASX)", url: "https://www.naturalsoda.com" },
    ],
    sources: [
      { name: "Wikipedia, Solvay process", url: "https://en.wikipedia.org/wiki/Solvay_process" },
      { name: "Tata Chemicals, Sodium bicarbonate", url: "https://www.tatachemicals.com/products-and-applications/sodium-bicarbonate" },
      { name: "Mordor Intelligence, Sodium bicarbonate market", url: "https://www.mordorintelligence.com/industry-reports/sodium-bicarbonate-market" },
    ],
  },

  "aluminium-fluoride": {
    routes: [
      "Dry process, HF gas from fluorspar/sulfuric acid reacted with alumina hydrate",
      "Wet process, fluosilicic acid (H2SiF6) by-product reacted with alumina",
    ],
    mainProcess: {
      name: "Dry process (HF + alumina hydrate)",
      detail:
        "Aluminium fluoride, used as a flux in aluminium smelting, is mainly made by the dry process. Acid-grade fluorspar (CaF2) is reacted with sulfuric acid in heated rotary kilns to generate gaseous hydrogen fluoride (CaF2 + H2SO4 → 2 HF + CaSO4). The dry HF gas is then passed over alumina hydrate (aluminium hydroxide) in a fluidised-bed reactor at elevated temperature, where it reacts to form high-density anhydrous AlF3: Al(OH)3 + 3 HF → AlF3 + 3 H2O. A wet variant instead reacts fluosilicic acid (a phosphate-industry by-product) with alumina.",
    },
    manufacturers: [
      { name: "Fluorsid", url: "https://fluorsid.com" },
      { name: "Rio Tinto", url: "https://www.riotinto.com" },
      { name: "Tanfac Industries", url: "https://www.tanfac.com" },
      { name: "Orbia (Koura)", url: "https://www.orbia.com" },
      { name: "PhosAgro", url: "https://www.phosagro.com" },
    ],
    sources: [
      { name: "Fluorsid, Aluminium fluoride", url: "https://fluorsid.com/what-we-do/chemical/aluminium-fluoride/" },
      { name: "Business Research Insights, Aluminium fluoride market", url: "https://www.businessresearchinsights.com/market-reports/aluminum-fluoride-market-122568" },
      { name: "24 Chemical Research, Aluminium fluoride market", url: "https://www.24chemicalresearch.com/reports/215971/global-aluminium-fluoride-market" },
    ],
  },

  "hydrochloric-acid": {
    routes: [
      "By-product of chlorination (VCM, isocyanates, fluorocarbons), >90% of supply",
      "Direct synthesis, burning hydrogen in chlorine, absorbed in water",
      "Salt-cake (Mannheim) route as a by-product of sodium sulfate (minor)",
    ],
    mainProcess: {
      name: "By-product recovery + direct H2/Cl2 synthesis",
      detail:
        "Most hydrochloric acid is recovered as the by-product hydrogen chloride from organic chlorination reactions (vinyl chloride, isocyanates, chlorinated solvents, fluorocarbons): the HCl off-gas is absorbed in water in falling-film absorbers to give 30-37% acid. High-purity acid is made by direct synthesis, where chlorine and hydrogen (both from chlor-alkali electrolysis) are burned together in a controlled flame, H2 + Cl2 → 2 HCl, and the hot gas is absorbed in demineralised water. Direct synthesis gives a cleaner product but accounts for under 10% of volume.",
    },
    manufacturers: [
      { name: "Occidental / OxyChem", url: "https://www.oxy.com" },
      { name: "Covestro", url: "https://www.covestro.com" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Olin Corporation", url: "https://www.olin.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "INEOS", url: "https://www.ineos.com" },
    ],
    sources: [
      { name: "US EPA, Hydrochloric acid supply chain (PDF)", url: "https://www.epa.gov/system/files/documents/2023-03/Hydrochloric%20Acid%20Supply%20Chain%20Profile.pdf" },
      { name: "OxyChem, Hydrochloric acid stewardship (PDF)", url: "https://www.oxy.com/siteassets/documents/chemicals/stewardship/hydrochloric-acid.pdf" },
      { name: "Covestro, Hydrochloric acid", url: "https://solutions.covestro.com/en/brands/hydrochloric-acid" },
    ],
  },

  "sulphamic-acid": {
    routes: [
      "Reaction of urea with oleum / sulfur trioxide (dominant)",
      "Sulfonation route via sulfamic intermediates",
    ],
    mainProcess: {
      name: "Urea + oleum (SO3) process",
      detail:
        "Sulphamic acid (H3NSO3) is produced by reacting urea with fuming sulfuric acid (oleum) or a mixture of sulfur trioxide and sulfuric acid. The urea is fed into the oleum and reacts in two stages to give sulfamic acid, carbon dioxide and by-product: CO(NH2)2 + SO3 + H2SO4 → 2 H3NSO3 + CO2 (net). The reaction is controlled and cooled; the sulfamic acid crystallises out and is filtered, washed and dried to a stable, non-hygroscopic solid widely used as a descaling agent, in sulfamate plating and as a chlorine stabiliser.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "Kanto Chemical", url: "https://www.kanto.co.jp" },
      { name: "Jiangsu Yabang (representative China producer)", url: "https://www.yabang.com" },
    ],
    sources: [
      { name: "Wikipedia, Sulfamic acid", url: "https://en.wikipedia.org/wiki/Sulfamic_acid" },
      { name: "Brenntag, Sulphamic acid", url: "https://www.brenntag.com/en-dk/products/sulphamic-acid.html" },
      { name: "Metoree, Sulfamic acid manufacturers", url: "https://us.metoree.com/categories/6319/" },
    ],
  },

  theophylline: {
    routes: [
      "Traube purine synthesis from N,N'-dimethylurea and cyanoacetic acid",
      "Methylation of xanthine / from theobromine (minor)",
    ],
    mainProcess: {
      name: "Traube purine synthesis",
      detail:
        "Theophylline (1,3-dimethylxanthine) is made synthetically by the classical Traube purine synthesis. N,N'-dimethylurea is condensed with cyanoacetic acid to form a dimethyl-cyanoacetylurea, which is cyclised under base to 1,3-dimethyl-6-aminouracil. This aminouracil is nitrosated at the 5-position and reduced to the 5,6-diamino-uracil, which is then ring-closed with formic acid (or formamide) to build the second (imidazole) ring of the purine, giving theophylline. The crude is purified by recrystallisation to pharmacopoeial grade.",
    },
    manufacturers: [
      { name: "BASF (Pharma Solutions)", url: "https://pharmaceutical.basf.com" },
      { name: "Shandong Xinhua Pharmaceutical", url: "https://www.xinhuapharm.com" },
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
    ],
    sources: [
      { name: "PharmaCompass, Theophylline manufacturers", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/theophylline" },
      { name: "BASF Pharma, APIs", url: "https://pharmaceutical.basf.com/global/en/pharma-solutions/platforms/apis" },
      { name: "Pharmaoffer, Theophylline API suppliers", url: "https://pharmaoffer.com/api-excipient-supplier/bronchodilators/theophylline" },
    ],
  },

  "diclofenac-sodium": {
    routes: [
      "Diphenylamine route, N-phenyl-2,6-dichloroaniline, then indolinone cyclisation and ring opening",
      "Direct N-arylation / Smiles-rearrangement variants",
    ],
    mainProcess: {
      name: "Diphenylamine / indolinone route",
      detail:
        "Diclofenac, an NSAID, is built around a 2-[(2,6-dichlorophenyl)amino]phenylacetic acid core. A diarylamine, N-(2,6-dichlorophenyl)aniline, is first prepared (e.g. by coupling 2,6-dichloroaniline with a benzene derivative). It is N-acylated/alkylated with a two-carbon unit (such as chloroacetyl chloride) and cyclised to an oxindole (1-(2,6-dichlorophenyl)indolin-2-one); alkaline hydrolysis then opens the ring to give diclofenac acid, which is converted to the sodium salt and crystallised to pharmacopoeial purity.",
    },
    manufacturers: [
      { name: "Novartis (originator, Voltaren)", url: "https://www.novartis.com" },
      { name: "Amoli Organics", url: "https://www.amoliorganics.com" },
      { name: "Aarti Industries (Pharma)", url: "https://www.aartiindustries.com" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
    ],
    sources: [
      { name: "PharmaCompass, Diclofenac sodium manufacturers", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/diclofenac-sodium-5018304" },
      { name: "Procurement Resource, Diclofenac sodium process", url: "https://www.procurementresource.com/reports/diclofenac-sodium-manufacturing-plant-project-report" },
      { name: "Elam Pharma, Diclofenac", url: "https://www.elampharma.com/product/diclofenac-sodium-ip-bp" },
    ],
  },

  gabapentin: {
    routes: [
      "1,1-Cyclohexanediacetic acid → monoamide → Hofmann rearrangement",
      "Cyclohexanone-derived nitrile/ester routes to the cyclohexane backbone",
    ],
    mainProcess: {
      name: "Hofmann rearrangement of the cyclohexanediacetic monoamide",
      detail:
        "Gabapentin (1-(aminomethyl)cyclohexaneacetic acid) is made from a cyclohexane backbone built from cyclohexanone. 1,1-Cyclohexanediacetic acid is converted to its mono-amide (CAM), and the amide is then subjected to a Hofmann rearrangement, treatment with a hypohalite (or PIFA / bromine + base) converts the amide to an amine with loss of one carbon, installing the aminomethyl group adjacent to the ring. The resulting amino-acid is isolated, often via its hydrochloride, and purified/crystallised to the free zwitterionic API.",
    },
    manufacturers: [
      { name: "IOL Chemicals and Pharmaceuticals", url: "https://www.iolcp.com" },
      { name: "Zhejiang Huahai Pharmaceutical", url: "https://www.huahaipharm.com" },
      { name: "Zhejiang Chiral Medicine Chemicals", url: "https://www.chiralchem.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
    ],
    sources: [
      { name: "Pipeline Pharma, Gabapentin manufacturing process", url: "https://www.pipelinepharma.com/blog/understanding-the-gabapentin-manufacturing-process" },
      { name: "Google Patents, Industrial-scale gabapentin", url: "https://patents.google.com/patent/US7442834B2/en" },
      { name: "IOLCP, Gabapentin API", url: "https://www.iolcp.com/gabapentin" },
    ],
  },

  "cetirizine-dihydrochloride": {
    routes: [
      "Alkylation of 1-(4-chlorobenzhydryl)piperazine with a (2-chloroethoxy)acetic acid ester, then hydrolysis",
      "Oxidation/derivatisation of the hydroxyzine side chain",
    ],
    mainProcess: {
      name: "Benzhydrylpiperazine alkylation",
      detail:
        "Cetirizine, a second-generation antihistamine, is the carboxylic-acid analogue of hydroxyzine. The key building block 1-[(4-chlorophenyl)(phenyl)methyl]piperazine (chlorobenzhydrylpiperazine) is N-alkylated on the free piperazine nitrogen with an alkylating agent that carries the -OCH2COOH side chain (for example a 2-(2-chloroethoxy)acetate ester or the corresponding chloride). The ester is then hydrolysed to the acid and the molecule is treated with hydrochloric acid to form the dihydrochloride salt, which is crystallised to high purity.",
    },
    manufacturers: [
      { name: "UCB (originator, Zyrtec)", url: "https://www.ucb.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Supriya Lifescience", url: "https://www.supriyalifescience.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "PharmaCompass, Cetirizine dihydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/cetirizine-dihydrochloride" },
      { name: "Dr. Reddy's, Cetirizine dihydrochloride API", url: "https://api.drreddys.com/product/cetirizine-dihydrochloride" },
      { name: "Pharmaoffer, Cetirizine dihydrochloride suppliers", url: "https://pharmaoffer.com/api-excipient-supplier/cetirizine-dihydrochloride" },
    ],
  },

  ketoconazole: {
    routes: [
      "Build cis-dioxolane from 2,4-dichloroacetophenone + glycerol, introduce imidazole, couple to piperazine-acetanilide",
      "Convergent coupling of the dioxolane-imidazole and the acetylpiperazine-phenol fragments",
    ],
    mainProcess: {
      name: "Dioxolane-imidazole + piperazine coupling",
      detail:
        "Ketoconazole, an imidazole antifungal, is assembled convergently. One fragment is a cis-2-(2,4-dichlorophenyl)-2-(imidazol-1-ylmethyl)-1,3-dioxolane bearing a tosyloxymethyl handle, made from 2,4-dichloroacetophenone by bromination, ketalisation with glycerol, and displacement with imidazole. The second fragment is 1-acetyl-4-(4-hydroxyphenyl)piperazine. The phenol is alkylated (Williamson ether) with the dioxolane tosylate to join the two halves, giving ketoconazole, which is purified by crystallisation. Manufacturing is concentrated in India and China.",
    },
    manufacturers: [
      { name: "Janssen (originator, Nizoral)", url: "https://www.janssen.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Zydus Lifesciences", url: "https://www.zyduslife.com" },
      { name: "Hovione", url: "https://www.hovione.com" },
    ],
    sources: [
      { name: "PharmaCompass, Ketoconazole manufacturers", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/ketoconazole" },
      { name: "IMARC, Ketoconazole manufacturing", url: "https://www.imarcgroup.com/ketoconazole-manufacturing-plant-project-report" },
      { name: "DrugPatentWatch, Ketoconazole API sources", url: "https://www.drugpatentwatch.com/p/bulk-api/KETOCONAZOLE" },
    ],
  },

  lamivudine: {
    routes: [
      "Convergent synthesis: build chiral 1,3-oxathiolane, then N-glycosylate silylated cytosine",
      "Menthyl-glyoxylate / dithianediol route with chiral auxiliary (GSK)",
      "Enzymatic / chiral-resolution strategies for the cis-(−) isomer",
    ],
    mainProcess: {
      name: "Oxathiolane coupling with cytosine",
      detail:
        "Lamivudine (3TC) is a cytidine analogue in which the sugar is replaced by a chiral 1,3-oxathiolane ring. Manufacture is convergent: a substituted 1,3-oxathiolane bearing an activated (e.g. acetoxy) anomeric centre is built, classically from a menthyl glyoxylate and a dithiane/mercaptoacetaldehyde unit that also sets stereochemistry, and is then coupled (Vorbruggen-type N-glycosylation) with silyl-protected cytosine using a Lewis acid. The mixture is resolved/crystallised to obtain the single cis-(−) enantiomer required for activity, and deprotected to the API.",
    },
    manufacturers: [
      { name: "GSK / ViiV Healthcare (originator)", url: "https://www.gsk.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "Hetero", url: "https://www.heteroworld.com" },
      { name: "Laurus Labs", url: "https://www.lauruslabs.com" },
    ],
    sources: [
      { name: "ACS OPRD, Economical route to lamivudine", url: "https://pubs.acs.org/doi/10.1021/acs.oprd.0c00083" },
      { name: "Medicines4All, 3TC process (PDF)", url: "https://medicines4all.vcu.edu/media/medicines4all/assets/documents/3TC%20PDR_vFinal-1.pdf" },
      { name: "PharmaCompass, Lamivudine", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/lamivudine" },
    ],
  },

  levetiracetam: {
    routes: [
      "From (S)-2-aminobutanamide + 4-halobutyryl chloride, then ring closure",
      "Chiral resolution of the racemic acid, then amidation (UCB original)",
      "Asymmetric synthesis of the (S)-2-oxopyrrolidine acetamide",
    ],
    mainProcess: {
      name: "(S)-2-aminobutanamide acylation + cyclisation",
      detail:
        "Levetiracetam is the (S)-enantiomer of alpha-ethyl-2-oxo-1-pyrrolidineacetamide. A common route acylates (S)-2-aminobutanamide with 4-chlorobutyryl chloride; base-promoted intramolecular N-alkylation then closes the gamma-butyrolactam (2-oxopyrrolidine) ring around the nitrogen to give levetiracetam directly with the chirality carried from the amino-amide. UCB's early route instead resolved a racemic acid via diastereomeric salts and then converted it to the amide. The product is crystallised to high chemical and enantiomeric purity.",
    },
    manufacturers: [
      { name: "UCB (originator, Keppra)", url: "https://www.ucb.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "ChemAnalyst, Levetiracetam production process", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/the-production-process-of-levetiracetam-a-technical-insight-into-modern-api-38886" },
      { name: "ScienceDirect, Levetiracetam overview", url: "https://www.sciencedirect.com/topics/chemistry/levetiracetam" },
      { name: "ChemAnalyst, Levetiracetam supply chain", url: "https://www.chemanalyst.com/Blogs/decoding-the-levetiracetam-supply-chain-from-raw-material-to-global-distribution-58" },
    ],
  },

  "sulbactam-acid": {
    routes: [
      "From 6-APA: 6,6-dibromopenicillanic acid, sulfone oxidation, reductive debromination",
      "Direct oxidation of penicillanic acid to the 1,1-dioxide",
    ],
    mainProcess: {
      name: "Penicillanic acid sulfone from 6-APA",
      detail:
        "Sulbactam (penicillanic acid 1,1-dioxide) is a semi-synthetic beta-lactamase inhibitor made from the penicillin core 6-aminopenicillanic acid (6-APA). The 6-APA amino group is diazotised and brominated to 6,6-dibromopenicillanic acid; the divalent sulfur of the thiazolidine ring is then oxidised (e.g. with potassium permanganate) to the sulfone, and the two bromine atoms are removed by reductive debromination (zinc or iron) to give sulbactam acid. It is finished as the free acid or converted to sulbactam sodium with sodium 2-ethylhexanoate.",
    },
    manufacturers: [
      { name: "Livzon Pharmaceutical Group", url: "https://www.livzon.com.cn" },
      { name: "Centrient Pharmaceuticals", url: "https://centrient.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "Hikal", url: "https://www.hikal.com" },
    ],
    sources: [
      { name: "PharmaCompass, Sulbactam sodium", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/sulbactam-sodium" },
      { name: "Google Patents, Penicillanic acid compounds", url: "https://patents.google.com/patent/US4942229A/en" },
      { name: "Pharmaoffer, Sulbactam API suppliers", url: "https://pharmaoffer.com/api-excipient-supplier/beta-lactamase-inhibitors/sulbactam" },
    ],
  },

  "calcium-gluconate": {
    routes: [
      "Aerobic fermentation of glucose to gluconic acid (Aspergillus niger), then neutralisation with calcium",
      "Enzymatic / electrochemical glucose oxidation, then calcium salification",
    ],
    mainProcess: {
      name: "Gluconic-acid fermentation + calcium neutralisation",
      detail:
        "Calcium gluconate is made by first producing gluconic acid from glucose. In submerged aerobic fermentation, Aspergillus niger (using its glucose-oxidase system) oxidises the aldehyde group of glucose to the carboxylic acid, giving gluconic acid at near-quantitative yield under controlled pH and aeration. The gluconic acid (or its sodium salt) is then neutralised with a calcium source, calcium hydroxide or calcium carbonate, to form calcium gluconate, which is decolourised, concentrated and crystallised to pharmaceutical/food grade.",
    },
    manufacturers: [
      { name: "Jungbunzlauer", url: "https://www.jungbunzlauer.com" },
      { name: "Corbion", url: "https://www.corbion.com" },
      { name: "Global Calcium", url: "https://www.globalcalcium.com" },
      { name: "Roquette", url: "https://www.roquette.com" },
    ],
    sources: [
      { name: "PMC, Gluconic acid by microbial fermentation", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9149244/" },
      { name: "Google Patents, Preparing calcium gluconate", url: "https://patents.google.com/patent/US7618664B2/en" },
      { name: "Mordor Intelligence, Calcium gluconate market", url: "https://www.mordorintelligence.com/industry-reports/calcium-gluconate-market" },
    ],
  },

  mannitol: {
    routes: [
      "Catalytic hydrogenation of fructose/glucose (invert sugar) over Raney nickel",
      "Separation of mannitol from co-product sorbitol by crystallisation",
      "Microbial fermentation of fructose (lactic-acid bacteria)",
    ],
    mainProcess: {
      name: "Catalytic hydrogenation of fructose",
      detail:
        "D-Mannitol is made by the high-pressure catalytic hydrogenation of fructose/glucose (invert sugar) solutions over a Raney-nickel catalyst at ~120-160 °C. Fructose hydrogenates to a roughly equal mixture of mannitol and sorbitol, while any glucose gives sorbitol only, so a typical 50/50 fructose/glucose feed yields about 30% mannitol and 70% sorbitol. Because mannitol is much less soluble than sorbitol, it is separated and purified by selective crystallisation from the hydrogenated syrup. Some mannitol is also produced by fermentation of fructose.",
    },
    manufacturers: [
      { name: "Roquette", url: "https://www.roquette.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "SPI Pharma", url: "https://www.spipharma.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Cargill, Mannitol", url: "https://www.cargill.com/pharmaceutical/pharma-products/mannitol" },
      { name: "ResearchGate, Production methods of D-mannitol", url: "https://www.researchgate.net/publication/230122916_Production_Methods_of_D-Mannitol" },
      { name: "Across Biotech, Key mannitol manufacturers", url: "https://acrossbiotech.com/key-manufacturers-of-mannitol/" },
    ],
  },

  "citric-acid": {
    routes: [
      "Submerged fermentation of sugar by Aspergillus niger (~90% of output)",
      "Surface / solid-state fermentation (older)",
      "Recovery by calcium-citrate precipitation or solvent extraction",
    ],
    mainProcess: {
      name: "Aspergillus niger sugar fermentation",
      detail:
        "Almost all citric acid is made by fermentation. A sugar feedstock (glucose syrup, sucrose or molasses) is fermented by the mould Aspergillus niger in aerated, agitated tanks under carefully limited trace-metal and controlled-pH conditions that push the fungus to over-secrete citric acid through its TCA cycle. After fermentation the biomass is filtered off and the citric acid is recovered classically by precipitation as calcium citrate (then sprung free with sulfuric acid) or by solvent/ion-exchange extraction, followed by crystallisation to anhydrous or monohydrate food/pharma grade.",
    },
    manufacturers: [
      { name: "ADM", url: "https://www.adm.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "Tate & Lyle", url: "https://www.tateandlyle.com" },
      { name: "Jungbunzlauer", url: "https://www.jungbunzlauer.com" },
      { name: "COFCO Biochemical", url: "https://www.cofco.com" },
      { name: "Weifang Ensign Industry", url: "https://www.ensign-ind.com" },
    ],
    sources: [
      { name: "PMC, Citric acid production by A. niger", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11956825/" },
      { name: "MDPI Life, Citric acid via A. niger fermentation", url: "https://www.mdpi.com/2075-1729/14/6/756" },
      { name: "IMARC / AdPand, Top citric acid manufacturers", url: "https://www.adpand.com/top-10-citric-acid-manufacturers-in-the-world-imarc-group/" },
    ],
  },

  menthol: {
    routes: [
      "Synthetic from thymol (m-cresol), hydrogenation, then resolution (Symrise)",
      "Synthetic from myrcene/citronellal via isopulegol asymmetric route (Takasago, BASF)",
      "Natural extraction from Mentha arvensis (mint) oil by freezing/crystallisation",
    ],
    mainProcess: {
      name: "Synthetic menthol (thymol hydrogenation / citronellal route)",
      detail:
        "(−)-Menthol is made both naturally and synthetically. The natural route freezes and crystallises menthol from cornmint (Mentha arvensis) oil, mainly in India and China. In the leading synthetic route, thymol (from m-cresol) is hydrogenated over a catalyst to a mixture of menthol stereoisomers, and the desired (−)-menthol is obtained by racemic resolution and recycling of the other isomers. Takasago and BASF instead cyclise citronellal (from myrcene) to isopulegol using a chirality-setting catalyst, then hydrogenate it to (−)-menthol with high selectivity.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "Takasago International", url: "https://www.takasago.com" },
    ],
    sources: [
      { name: "Wiley FFJ, Industrial synthesis of (−)-menthol", url: "https://onlinelibrary.wiley.com/doi/full/10.1002/ffj.3699" },
      { name: "Chemistry LibreTexts, Strategies in (−)-menthol synthesis", url: "https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Logic_of_Organic_Synthesis_(Rao)/06:_Strategies_in_(-)-Menthol_Synthesis" },
      { name: "Outsourcing-Pharma, BASF synthetic menthol", url: "https://www.outsourcing-pharma.com/Article/2011/11/08/BASF-to-enter-synthetic-menthol-market-in-2012/" },
    ],
  },

  "dl-methionine": {
    routes: [
      "Chemical synthesis from acrolein, methyl mercaptan and HCN via hydantoin (dominant)",
      "Alkaline hydrolysis of 5-(2-methylthioethyl)hydantoin to methionine",
      "Liquid MHA (methionine hydroxy analogue) variant",
    ],
    mainProcess: {
      name: "Acrolein / methyl mercaptan hydantoin route",
      detail:
        "DL-methionine, a feed amino acid, is made by chemical synthesis. Acrolein is reacted with methyl mercaptan to give 3-(methylthio)propionaldehyde (methional), which is then condensed with hydrogen cyanide and ammonium carbonate (a Bucherer-Bergs reaction) to form 5-(2-methylthioethyl)hydantoin. Alkaline hydrolysis of this hydantoin with potassium (or sodium) carbonate opens the ring to give methionine in high yield (the salt is then acidified/crystallised). The route, developed at Degussa (now Evonik), gives the racemic DL-form used in animal nutrition.",
    },
    manufacturers: [
      { name: "Evonik Industries", url: "https://www.evonik.com" },
      { name: "Adisseo (Bluestar)", url: "https://www.adisseo.com" },
      { name: "Novus International", url: "https://www.novusint.com" },
      { name: "CJ CheilJedang", url: "https://www.cj.net" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
    ],
    sources: [
      { name: "Intratec, DL-methionine from acrolein/MeSH/HCN (PDF)", url: "https://cdn.intratec.us/docs/reports/previews/methionine-e41a-b.pdf" },
      { name: "Thunen Institute, Methionine production review (PDF)", url: "https://literatur.thuenen.de/digbib_extern/dn054249.pdf" },
      { name: "Across Biotech, Methionine manufacturers", url: "https://acrossbiotech.com/methionine-manufacturers-and-production-methods/" },
    ],
  },

  "l-lysine-hydrochloride": {
    routes: [
      "Aerobic fermentation of sugars by Corynebacterium glutamicum",
      "Ion-exchange recovery, then crystallisation as the monohydrochloride",
    ],
    mainProcess: {
      name: "Corynebacterium glutamicum fermentation",
      detail:
        "L-lysine is produced by aerobic fed-batch fermentation of engineered Corynebacterium glutamicum strains on carbohydrate feedstocks (glucose syrup, starch hydrolysate or molasses), where the over-producing organism secretes L-lysine into the broth under controlled temperature, pH and aeration. After fermentation the biomass is separated and the basic amino acid is captured and concentrated on a cation-exchange resin, eluted with ammonia, and then crystallised as L-lysine monohydrochloride (or spray-dried as a concentrated liquid/granule) for animal feed and nutrition.",
    },
    manufacturers: [
      { name: "ADM", url: "https://www.adm.com" },
      { name: "Ajinomoto", url: "https://www.ajinomoto.com" },
      { name: "Evonik Industries", url: "https://www.evonik.com" },
      { name: "CJ CheilJedang", url: "https://www.cj.net" },
      { name: "Meihua Holdings Group", url: "https://www.meihuagrp.com" },
    ],
    sources: [
      { name: "ScienceDirect, L-lysine in C. glutamicum", url: "https://www.sciencedirect.com/science/article/pii/S0944501322001410" },
      { name: "Ande Group, Industrial lysine fermentation", url: "https://www.myandegroup.com/blog/industrial-lysine-fermentation-process" },
      { name: "Fortune Business Insights, Lysine market", url: "https://www.fortunebusinessinsights.com/lysine-market-109615" },
    ],
  },

  "monosodium-glutamate": {
    routes: [
      "Aerobic fermentation of sugar by Corynebacterium glutamicum to L-glutamic acid",
      "Neutralisation with sodium hydroxide and crystallisation of the sodium salt",
    ],
    mainProcess: {
      name: "Glutamic-acid fermentation + neutralisation",
      detail:
        "MSG is produced by fermentation, the same biotechnology established in 1956 with Corynebacterium glutamicum. The bacterium is grown aerobically on glucose, cane molasses or tapioca-starch sugars at ~30-37 °C for 30-40 hours, over-secreting L-glutamic acid (to ~150 g/L) when biotin and other conditions are limited. The glutamic acid is recovered from the broth by isoelectric crystallisation, then neutralised with sodium hydroxide to form monosodium glutamate, which is decolourised and re-crystallised to bright, pure flavour-enhancer crystals.",
    },
    manufacturers: [
      { name: "Ajinomoto", url: "https://www.ajinomoto.com" },
      { name: "Fufeng Group (world's largest)", url: "https://www.fufeng-group.com" },
      { name: "Meihua Holdings Group", url: "https://www.meihuagrp.com" },
      { name: "Tate & Lyle", url: "https://www.tateandlyle.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
    ],
    sources: [
      { name: "ChemFYI, MSG production by fermentation", url: "https://chemfyi.com/application/monosodium-glutamate-msg-production-by-fermentation/" },
      { name: "The Science Notes, MSG production", url: "https://thesciencenotes.com/monosodium-glutamate-msg-history-structure-properties-production-effects/" },
      { name: "Mordor Intelligence, MSG companies", url: "https://www.mordorintelligence.com/industry-reports/monosodium-glutamate-msg-market/companies" },
    ],
  },

  "lauric-acid": {
    routes: [
      "Hydrolytic splitting of coconut / palm-kernel oil to fatty acids, then fractionation",
      "Fractional distillation to a C12 (lauric) cut",
      "Hydrogenation for fully saturated grades",
    ],
    mainProcess: {
      name: "Fat splitting + fractional distillation",
      detail:
        "Lauric acid (C12) is an oleochemical made from lauric oils, coconut oil and palm-kernel oil, which are rich in C12. The triglycerides are first hydrolysed ('fat splitting') with water at high temperature (~250 °C) and pressure, breaking them into crude mixed fatty acids and glycerol. The mixed fatty acids are then separated by fractional distillation into C8, C10, C12, C14 and higher cuts; the lauric cut is taken and, depending on grade, distilled further or hydrogenated to give high-purity (e.g. 99%) lauric acid for surfactants, soaps and personal care.",
    },
    manufacturers: [
      { name: "Wilmar International", url: "https://www.wilmar-international.com" },
      { name: "KLK OLEO", url: "https://www.klkoleo.com" },
      { name: "IOI Oleo", url: "https://www.ioioleo.de" },
      { name: "Musim Mas", url: "https://www.musimmas.com" },
      { name: "Acme-Hardesty", url: "https://www.acme-hardesty.com" },
    ],
    sources: [
      { name: "Wilmar, Lauric acid 98%", url: "https://www.wilmar-international.com/oleochemicals/products/home-care/lauric-acid-98" },
      { name: "Springer, Palm kernel & coconut oils technology", url: "https://link.springer.com/article/10.1007/BF02543521" },
      { name: "Future Market Insights, Lauric acid market", url: "https://www.futuremarketinsights.com/reports/lauric-acid-market" },
    ],
  },

  "propylene-glycol": {
    routes: [
      "Hydration of propylene oxide (thermal, water excess), dominant",
      "Catalytic hydration variants",
      "Bio-based hydrogenolysis of glycerol / sugars (renewable PG)",
    ],
    mainProcess: {
      name: "Propylene oxide hydration",
      detail:
        "Mono-propylene glycol is made by hydrating propylene oxide with a large excess of water, usually thermally (uncatalysed) at ~150-200 °C and moderate pressure: C3H6O + H2O → CH3CH(OH)CH2OH. The water excess suppresses the formation of di- and tri-propylene glycol co-products. The dilute glycol solution is concentrated by multi-effect evaporation and the mono-, di- and tri-propylene glycols are separated by vacuum distillation. (Propylene oxide itself is made by chlorohydrin, styrene-monomer/PO, cumene-hydroperoxide or HPPO routes.) Renewable PG is made by hydrogenolysis of glycerol.",
    },
    manufacturers: [
      { name: "Dow (largest capacity)", url: "https://www.dow.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "INEOS Oxide", url: "https://www.ineos.com" },
      { name: "ADM", url: "https://www.adm.com" },
    ],
    sources: [
      { name: "LyondellBasell, Propylene glycol industrial", url: "https://www.lyondellbasell.com/en/chemicals/p/PROPYLENE-GLYCOL-INDUSTRIAL/723d4ad9-7f19-4bea-ae6b-59f521c7c97e" },
      { name: "Mordor Intelligence, Propylene glycol market", url: "https://www.mordorintelligence.com/industry-reports/propylene-glycol-market" },
      { name: "iScience, Renewable propylene glycol", url: "https://www.cell.com/iscience/fulltext/S2589-0042(22)01175-0" },
    ],
  },

  acetonitrile: {
    routes: [
      "Recovery as a by-product of acrylonitrile (propylene ammoxidation), dominant",
      "Purification by distillation/dehydration to HPLC grades",
      "On-purpose synthesis from acetic acid + ammonia (minor)",
    ],
    mainProcess: {
      name: "Acrylonitrile by-product recovery",
      detail:
        "Almost all acetonitrile is recovered as a by-product of acrylonitrile manufacture: the propylene ammoxidation (SOHIO) reactor co-produces a few percent of acetonitrile alongside acrylonitrile and HCN. The crude acetonitrile is stripped from the reactor effluent and purified by a sequence of distillations and chemical/dehydration treatments to remove water, HCN, ammonia and other nitriles, yielding technical and high-purity (HPLC/gradient) grades. Because supply is tied to acrylonitrile output, acetonitrile availability swings with that market.",
    },
    manufacturers: [
      { name: "INEOS Nitriles (world leader)", url: "https://www.ineos.com" },
      { name: "Asahi Kasei", url: "https://www.asahi-kasei.com" },
      { name: "ANQORE", url: "https://www.anqore.com" },
      { name: "Nova Molecular Technologies", url: "https://novamolecular.com" },
      { name: "PetroChina (CNPC)", url: "https://www.petrochina.com.cn" },
    ],
    sources: [
      { name: "INEOS Nitriles, Speciality nitriles", url: "https://www.ineos.com/businesses/ineos-nitriles/products/speciality-nitriles/" },
      { name: "Nova Molecular, Acetonitrile market", url: "https://novamolecular.com/nova-molecular-technologies-major-player-acetonitrile-market/" },
      { name: "Coherent Market Insights, Acetonitrile companies", url: "https://www.coherentmarketinsights.com/blog/insights/major-companies-acetonitrile-industry-1032" },
    ],
  },

  "salicylic-acid": {
    routes: [
      "Kolbe-Schmitt carboxylation of sodium phenoxide with CO2 (dominant)",
      "Acidification of the sodium salicylate to free acid",
      "Hydrolysis of methyl salicylate (minor)",
    ],
    mainProcess: {
      name: "Kolbe-Schmitt carboxylation",
      detail:
        "Salicylic acid is made by the Kolbe-Schmitt reaction. Phenol is first neutralised with sodium hydroxide to dry sodium phenoxide, which is then reacted with carbon dioxide under pressure (~5-10 bar, ~125 °C); the phenoxide attacks CO2 and, after rearrangement, gives sodium salicylate with the carboxyl group ortho to the hydroxyl. Acidification with sulfuric acid liberates free salicylic acid, which is purified by recrystallisation or sublimation. It is the key precursor to aspirin (acetylsalicylic acid) and to methyl salicylate.",
    },
    manufacturers: [
      { name: "Novacyl (world leader)", url: "https://www.novacyl.com" },
      { name: "Shandong Xinhua Pharmaceutical", url: "https://www.xinhuapharm.com" },
      { name: "Siddharth Carbochem Products", url: "https://www.siddharthcarbochem.com" },
    ],
    sources: [
      { name: "Wikipedia, Kolbe-Schmitt reaction", url: "https://en.wikipedia.org/wiki/Kolbe%E2%80%93Schmitt_reaction" },
      { name: "MDPI Molecules, Kolbe-Schmitt salicylic acid", url: "https://www.mdpi.com/1420-3049/29/11/2527" },
      { name: "ChemAnalyst, Aspirin/salicylic acid process", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/inside-the-chemistry-industrial-production-process-of-aspirin-38477" },
    ],
  },

  benzaldehyde: {
    routes: [
      "Liquid-phase air oxidation of toluene (also yields benzoic acid)",
      "Chlorination of toluene to benzal chloride, then hydrolysis",
      "Recovery from benzoic-acid / cinnamaldehyde processes (minor)",
    ],
    mainProcess: {
      name: "Toluene oxidation / benzal chloride hydrolysis",
      detail:
        "Benzaldehyde is made on scale by two main routes. In catalytic liquid-phase air oxidation, toluene is oxidised with air over a cobalt/manganese catalyst, and conditions are tuned to stop at the aldehyde stage (benzaldehyde) before over-oxidation to benzoic acid. In the chlorination route, toluene's methyl group is chlorinated to benzal chloride (PhCHCl2), which is then hydrolysed with water/base at ~100-200 °C to benzaldehyde plus HCl. The chlorination route gives a 'technical' grade; oxidation gives chlorine-free benzaldehyde preferred for flavour and fragrance use.",
    },
    manufacturers: [
      { name: "LANXESS (Emerald Kalama)", url: "https://www.lanxess.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
      { name: "Kadillac Chemicals", url: "https://www.kadillacchemicals.com" },
    ],
    sources: [
      { name: "Grand View Research, Benzaldehyde market", url: "https://www.grandviewresearch.com/industry-analysis/benzaldehyde-market-report" },
      { name: "C&EN, Lanxess acquires Emerald Kalama", url: "https://cen.acs.org/business/specialty-chemicals/Lanxess-acquire-US-firm-Emerald/99/web/2021/02" },
      { name: "Google Patents, Benzaldehyde by toluene air oxidation", url: "https://patents.google.com/patent/US6495726B1/en" },
    ],
  },

  "beta-naphthol": {
    routes: [
      "Sulfonation of naphthalene to 2-naphthalenesulfonic acid, then caustic (alkali) fusion",
      "2-Isopropylnaphthalene oxidation route (co-produces acetone)",
    ],
    mainProcess: {
      name: "Naphthalene sulfonation + caustic fusion",
      detail:
        "Beta-naphthol (2-naphthol) is classically made in two steps from naphthalene. Naphthalene is sulfonated with sulfuric acid at elevated temperature to favour the 2-(beta-) naphthalenesulfonic acid isomer. The sulfonate is then fused with molten sodium hydroxide (alkali/caustic fusion) at high temperature, replacing the sulfonic-acid group with a hydroxyl to give sodium 2-naphtholate; acidification then releases free beta-naphthol, which is purified by distillation/crystallisation. It is a key intermediate for dyes, pigments and the antioxidant/agrochemical chains.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Naphthalene-2-sulfonic acid", url: "https://en.wikipedia.org/wiki/Naphthalene-2-sulfonic_acid" },
      { name: "IMARC, Beta-naphthol manufacturing", url: "https://www.imarcgroup.com/beta-naphthol-manufacturing-plant-project-report" },
      { name: "ChemicalBook, Applications of 2-naphthol", url: "https://www.chemicalbook.com/article/different-applications-of-2-naphthol.htm" },
    ],
  },

  "silicon-metal": {
    routes: [
      "Carbothermic reduction of quartz in a submerged electric-arc furnace",
      "Refining/ladle treatment to grade; further to polysilicon for electronics",
    ],
    mainProcess: {
      name: "Carbothermic reduction of quartz (electric-arc furnace)",
      detail:
        "Silicon metal is made by reducing high-purity quartz (SiO2) with carbon in a submerged electric-arc furnace. Quartz is mixed with carbon reductants (metallurgical coke, coal, charcoal and woodchips) and heated by the arc between carbon electrodes to ~1700-2000 °C, where carbon strips the oxygen: SiO2 + 2 C → Si + 2 CO. Molten silicon is tapped from the furnace, oxidatively refined in the ladle to remove impurities (e.g. with air/oxygen and slag formers), and cast and crushed. The process is highly energy-intensive (~13,000-15,000 kWh per tonne).",
    },
    manufacturers: [
      { name: "Ferroglobe", url: "https://www.ferroglobe.com" },
      { name: "Elkem (world's largest)", url: "https://www.elkem.com" },
      { name: "Wacker Chemie", url: "https://www.wacker.com" },
      { name: "Mississippi Silicon", url: "https://www.mississippisilicon.com" },
    ],
    sources: [
      { name: "Elkem, From quartz to silicon to silicones", url: "https://magazine.elkem.com/material-science-insights/from-quartz-to-silicon-to-silicones/" },
      { name: "Ferroglobe, Silicon metal", url: "https://www.ferroglobe.com/solutions/silicon-metal" },
      { name: "USGS, Silicon 2020 minerals yearbook (PDF)", url: "https://pubs.usgs.gov/myb/vol1/2020/myb1-2020-silicon.pdf" },
    ],
  },

  "calcium-chloride": {
    routes: [
      "Limestone + hydrochloric acid neutralisation (high purity / food grade)",
      "By-product of the Solvay soda-ash process",
      "Refining/concentration of natural calcium-chloride brines",
    ],
    mainProcess: {
      name: "Limestone-HCl reaction / Solvay by-product",
      detail:
        "Calcium chloride is made by several routes. In the limestone-hydrochloric-acid route, calcium carbonate is reacted with hydrochloric acid to give calcium chloride solution, CO2 and water (CaCO3 + 2 HCl → CaCl2 + CO2 + H2O); the liquor is purified and evaporated to flakes, prills or concentrated brine, giving high-purity food/industrial grades. Large volumes are also recovered as the main by-product of the Solvay soda-ash process, and from naturally occurring calcium-chloride brines that are simply purified and concentrated. It is widely used for de-icing, dust control and brines.",
    },
    manufacturers: [
      { name: "Occidental / OxyChem (world's largest)", url: "https://www.oxy.com" },
      { name: "TETRA Technologies", url: "https://onetetra.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
    ],
    sources: [
      { name: "TETRA Technologies, Calcium chloride", url: "https://onetetra.com/industrial-chemicals/calcium-chloride/" },
      { name: "USDA, Calcium chloride technical report (PDF)", url: "https://www.ams.usda.gov/sites/default/files/media/2024TechnicalReportCalciumChlorideHandling.pdf" },
      { name: "Merchant Research, Calcium chloride market", url: "https://mcgroup.co.uk/news/20250116/calcium-chloride-navigating-major-applications-and-market-trends.html" },
    ],
  },

  "copper-sulphate": {
    routes: [
      "Dissolving copper / copper oxide in sulfuric acid, then crystallisation",
      "Air oxidation of copper in dilute sulfuric acid",
      "Recovery from spent copper-etch / refinery streams",
    ],
    mainProcess: {
      name: "Copper dissolution in sulfuric acid",
      detail:
        "Copper sulfate pentahydrate (blue vitriol) is made by reacting copper metal (scrap, cathode or granules) or copper oxide with sulfuric acid. With copper metal, hot dilute sulfuric acid plus air/oxygen oxidises and dissolves the copper (2 Cu + 2 H2SO4 + O2 → 2 CuSO4 + 2 H2O); with cupric oxide the reaction is direct (CuO + H2SO4 → CuSO4 + H2O). The blue solution is clarified, evaporated and cooled so that CuSO4·5H2O crystallises out; the crystals are centrifuged and dried. It is used in agriculture (fungicide, feed), electroplating and as a chemical reagent.",
    },
    manufacturers: [
      { name: "Old Bridge Chemicals", url: "https://www.oldbridgechem.com" },
      { name: "Manica", url: "https://www.manica.it" },
      { name: "Anmol Chemicals Group", url: "https://www.anmolchemicals.org" },
      { name: "Sulfozyme Agro", url: "https://sulfozyme.com" },
    ],
    sources: [
      { name: "Metoree, Copper sulfate manufacturers", url: "https://us.metoree.com/categories/6720/" },
      { name: "Anmol Chemicals, Copper sulphate", url: "https://anmolchemicals.org/sc-copper-sulphate-pentahydrate.php" },
      { name: "Norkem, Copper sulphate", url: "https://norkem.com/products/copper-sulphate" },
    ],
  },

  "precipitated-silica": {
    routes: [
      "Acidification of sodium silicate (water glass) with sulfuric acid, then filtration/drying",
      "Controlled precipitation to tune surface area and structure",
    ],
    mainProcess: {
      name: "Sodium silicate + sulfuric acid precipitation",
      detail:
        "Precipitated silica is made by reacting a sodium silicate (water glass) solution with sulfuric acid under carefully controlled conditions: Na2SiO3 + H2SO4 → SiO2 + Na2SO4 + H2O. The rate of acid addition, temperature, pH and electrolyte concentration control how the silica nucleates and aggregates, setting the particle size, surface area and structure that define the grade. The silica slurry is filtered, washed free of sodium sulfate, and dried (spray- or flash-dried), then milled or granulated. Major uses are reinforcing filler in 'green' tyres, and in toothpaste, food and coatings.",
    },
    manufacturers: [
      { name: "Evonik Industries", url: "https://www.evonik.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "PPG Industries", url: "https://www.ppg.com" },
      { name: "W. R. Grace", url: "https://www.grace.com" },
      { name: "Tosoh Silica", url: "https://www.tosoh.com" },
    ],
    sources: [
      { name: "Verified Market Research, Top precipitated silica makers", url: "https://www.verifiedmarketresearch.com/blog/top-precipitated-silica-manufacturers/" },
      { name: "MarketsandMarkets, Precipitated silica companies", url: "https://www.marketsandmarkets.com/ResearchInsight/precipitated-silica-market.asp" },
      { name: "Mordor Intelligence, Precipitated silica market", url: "https://www.mordorintelligence.com/industry-reports/precipitated-silica-market" },
    ],
  },

  "aluminium-hydroxide": {
    routes: [
      "Bayer process, caustic digestion of bauxite, then seeded precipitation",
      "Re-precipitation/grinding to fine ATH (flame-retardant) grades",
    ],
    mainProcess: {
      name: "Bayer process precipitation",
      detail:
        "Aluminium hydroxide is produced via the Bayer process. Finely ground bauxite is digested in hot concentrated sodium hydroxide in autoclaves at ~130-250 °C, dissolving the alumina as sodium aluminate while the iron/silicon impurities settle out as 'red mud'. The clarified, cooled aluminate liquor is then seeded with fine aluminium-hydroxide crystals, which makes dissolved alumina precipitate as crystalline Al(OH)3 (gibbsite): NaAl(OH)4 → Al(OH)3 + NaOH. The hydroxide is filtered and washed; part is calcined to alumina for aluminium smelting, and finer precipitated grades (ATH) are used as flame retardants and fillers.",
    },
    manufacturers: [
      { name: "Almatis", url: "https://www.almatis.com" },
      { name: "Alcoa", url: "https://www.alcoa.com" },
      { name: "Nabaltec", url: "https://www.nabaltec.de" },
      { name: "Huber Engineered Materials", url: "https://www.hubermaterials.com" },
      { name: "Chalco (Aluminum Corp. of China)", url: "https://www.chalco.com.cn" },
    ],
    sources: [
      { name: "Aluminium Guide, Bayer process", url: "https://aluminium-guide.com/bayer-process-bauxite-alumina/" },
      { name: "Almatis, Our story", url: "https://www.almatis.com/en/about-us/our-story" },
      { name: "KMT Industrial, Aluminium hydroxide manufacturers", url: "https://www.kmtindustrial.com/top-aluminum-hydroxide-manufacturers/" },
    ],
  },

  azodicarbonamide: {
    routes: [
      "Urea + hydrazine to biurea (hydrazodicarbonamide), then oxidation to ADC",
      "Oxidation with chlorine, hypochlorite or hydrogen peroxide",
    ],
    mainProcess: {
      name: "Biurea formation + oxidation",
      detail:
        "Azodicarbonamide (ADC), the main chemical blowing agent for foamed plastics and rubber, is made in two steps. Urea is first condensed with hydrazine (hydrate) to form biurea (hydrazodicarbonamide): 2 (NH2)2CO + N2H4 → (H2NCONH)2 + 2 NH3. The biurea is then oxidised, classically with chlorine gas, or with sodium hypochlorite or hydrogen peroxide, to introduce the azo (-N=N-) bond, giving azodicarbonamide, which is filtered, washed, dried and milled to a controlled particle size. On heating it decomposes to release nitrogen and other gases that foam the polymer.",
    },
    manufacturers: [
      { name: "Otsuka Chemical (Unifoam AZ)", url: "https://www.otsukac.co.jp" },
      { name: "Kumyang", url: "https://www.kumyang.com" },
      { name: "Sundow Polymers", url: "https://www.sundow.com" },
    ],
    sources: [
      { name: "Wikipedia, Azodicarbonamide", url: "https://en.wikipedia.org/wiki/Azodicarbonamide" },
      { name: "Otsuka Chemical, Unifoam AZ blowing agent", url: "https://www.otsukac.co.jp/en/products/cat-hydrazine-derivative/blendtype-fa.html" },
      { name: "NBINNO, Azodicarbonamide production & uses", url: "https://www.nbinno.com/article/blowing-agents/deep-dive-azodicarbonamide-properties-production-uses-nw" },
    ],
  },

  "purified-isophthalic-acid-pia": {
    routes: [
      "Liquid-phase air oxidation of meta-xylene (Co/Mn/Br catalyst), then purification",
      "Hydropurification/crystallisation to fibre/resin grade",
    ],
    mainProcess: {
      name: "meta-Xylene oxidation (Amoco-type)",
      detail:
        "Purified isophthalic acid is made by the catalytic liquid-phase air oxidation of meta-xylene, the isomer chemistry analogous to PTA from para-xylene. m-Xylene is oxidised with air in acetic-acid solvent using a cobalt-manganese-bromide catalyst at ~175-225 °C and elevated pressure, converting both methyl groups to carboxylic acids to give crude isophthalic acid. The crude is then purified (crystallisation and/or hydrogenation steps) to remove colour-forming aldehyde impurities, giving PIA used in unsaturated polyester resins, PET co-monomer and high-performance coatings.",
    },
    manufacturers: [
      { name: "Lotte Chemical (world's largest)", url: "https://www.lottechem.com" },
      { name: "INEOS (Joliet)", url: "https://www.ineos.com" },
      { name: "Indorama Ventures", url: "https://www.indoramaventures.com" },
      { name: "Mitsubishi Gas Chemical", url: "https://www.mgc.co.jp/eng/" },
      { name: "Formosa Chemicals & Fibre", url: "https://www.fcfc.com.tw" },
    ],
    sources: [
      { name: "INEOS, Purified isophthalic acid", url: "https://www.ineos.com/businesses/ineos-enterprises/businesses/ineos-joliet/products/purified-isophthalic-acid/" },
      { name: "Transparency Market Research, PIA market", url: "https://www.transparencymarketresearch.com/purified-isophthalic-acid-market.html" },
      { name: "Procurement Resource, PIA process", url: "https://www.procurementresource.com/reports/purified-isophthalic-acid-pia-manufacturing-plant-project-report" },
    ],
  },

  "polyether-polyol": {
    routes: [
      "Base-catalysed (KOH) ring-opening polymerisation of propylene oxide / ethylene oxide onto a starter",
      "Double-metal-cyanide (DMC) catalysed polymerisation for high-MW, low-monol polyols",
      "Bio / CO2-based polyol variants (emerging)",
    ],
    mainProcess: {
      name: "Alkoxylation of a starter with PO/EO",
      detail:
        "Polyether polyols are made by the catalytic ring-opening polymerisation (alkoxylation) of propylene oxide, often with some ethylene oxide, onto a hydroxyl- or amine-functional starter (such as glycerol, sucrose or propylene glycol). Traditionally potassium hydroxide catalyses the addition at ~100-130 °C and moderate pressure, growing polyether chains of controlled length and functionality; the product is neutralised and the catalyst removed. Double-metal-cyanide (DMC) catalysts increasingly replace KOH for high-molecular-weight polyols because they give narrow polydispersity and very low unsaturation (monol). The polyols are the soft segment for polyurethane foams, elastomers and coatings.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Covestro", url: "https://www.covestro.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "Wanhua Chemical", url: "https://www.wanhuachemical.com" },
    ],
    sources: [
      { name: "Google Patents, Polyether polyol via DMC catalyst", url: "https://patents.google.com/patent/US20180237587A1/en" },
      { name: "BASF, Polyether polyols (patent)", url: "https://www.freepatentsonline.com/y2011/0269863.html" },
      { name: "Google Patents, DMC catalysts", url: "https://patents.google.com/patent/US5627120A/en" },
    ],
  },

  "sodium-nitrite": {
    routes: [
      "Absorption of nitrous gases (NO/NO2) into soda ash or caustic solution",
      "Separation of nitrite from co-formed nitrate by fractional crystallisation",
    ],
    mainProcess: {
      name: "Alkali absorption of nitrous gases",
      detail:
        "Sodium nitrite is produced by absorbing nitrous gases, a mixture of nitric oxide and nitrogen dioxide, often the tail gas from ammonia oxidation/nitric-acid plants, into a solution of sodium carbonate (soda ash) or sodium hydroxide. The NO and NO2 react with the alkali to form a mixture of sodium nitrite and sodium nitrate (NO + NO2 + Na2CO3 → 2 NaNO2 + CO2). Because nitrate also forms, the gas ratio (kept near NO:NO2 = 1:1) is controlled to maximise nitrite, and the more soluble nitrite is separated from nitrate by fractional crystallisation, then dried.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Deepak Nitrite (India's largest)", url: "https://www.godeepak.com" },
      { name: "Anmol Chemicals Group", url: "https://www.anmolchemicals.org" },
    ],
    sources: [
      { name: "ChemicalBook, Sodium nitrite", url: "https://www.chemicalbook.com/article/sodium-nitrite-an-all-rounder-with-good-and-evil.htm" },
      { name: "BASF Inorganics, Nitrogen salts", url: "https://inorganics.basf.com/products/nitrogen-salts" },
      { name: "Google Patents, Production of sodium nitrite", url: "https://patents.google.com/patent/US2032699A/en" },
    ],
  },

  "3-methylpyridine": {
    routes: [
      "Vapour-phase condensation of acetaldehyde, formaldehyde and ammonia (dominant)",
      "Co-production with pyridine and other picolines, then distillation",
    ],
    mainProcess: {
      name: "Acetaldehyde / formaldehyde / ammonia condensation",
      detail:
        "3-Methylpyridine (beta-picoline) is made by the high-temperature vapour-phase reaction of acetaldehyde and formaldehyde with ammonia over an acidic (often zeolite/oxide) catalyst, a Chichibabin-type pyridine synthesis. The aldehydes and ammonia condense and cyclise to a mixture of pyridine and methylpyridines; adjusting the acetaldehyde-to-formaldehyde ratio steers the yield toward 3-picoline. The product mix is separated by fractional distillation. 3-Picoline is the principal precursor to niacin (vitamin B3) and to agrochemicals such as chlorpyrifos.",
    },
    manufacturers: [
      { name: "Vertellus", url: "https://www.vertellus.com" },
      { name: "Jubilant Ingrevia", url: "https://www.jubilantingrevia.com" },
    ],
    sources: [
      { name: "Wikipedia, 3-Methylpyridine", url: "https://en.wikipedia.org/wiki/3-Methylpyridine" },
      { name: "S&P Global, Pyridines CEH abstract (PDF)", url: "https://www.spglobal.com/content/dam/spglobal/ci/en/documents/products/pdf/CI_0325_Global_CEH_Pyridines_Abstract.pdf" },
      { name: "Google Patents, Synthesis of 3-methylpyridine", url: "https://patents.google.com/patent/US9701634B2/en" },
    ],
  },

  "manganese-dioxide": {
    routes: [
      "Electrolytic manganese dioxide (EMD) from manganese sulfate electrolysis (battery grade)",
      "Chemical manganese dioxide (CMD) from manganese salts",
      "Beneficiation of natural pyrolusite ore",
    ],
    mainProcess: {
      name: "Electrolytic manganese dioxide (EMD)",
      detail:
        "Battery-grade manganese dioxide is made electrolytically. Manganese ore is reduced and leached with sulfuric acid to a purified manganese-sulfate electrolyte, which is electrolysed in heated cells (~90-98 °C) using titanium or graphite anodes. Manganese is oxidised and deposits as a hard layer of gamma-MnO2 on the anode (Mn2+ + 2 H2O → MnO2 + 4 H+ + 2 e-). The deposit is stripped, crushed, washed free of acid, neutralised and milled to the fine, high-activity powder used in alkaline and zinc-carbon batteries. Chemical (CMD) and natural grades serve lower-demand uses.",
    },
    manufacturers: [
      { name: "Tosoh Corporation (largest EMD maker)", url: "https://www.tosoh.com" },
      { name: "Vibrantz Technologies (Prince)", url: "https://www.vibrantz.com" },
      { name: "Tronox Holdings", url: "https://www.tronox.com" },
    ],
    sources: [
      { name: "Mordor Intelligence, EMD market", url: "https://www.mordorintelligence.com/industry-reports/electrolytic-manganese-dioxide-market" },
      { name: "Tosoh, Battery materials", url: "https://www.tosoh.com/our-products/advanced-materials" },
      { name: "SkyQuest, EMD companies", url: "https://www.skyquestt.com/report/electrolytic-manganese-dioxide-market/companies" },
    ],
  },

  "di-ethylene-glycol": {
    routes: [
      "Co-product of monoethylene glycol from ethylene oxide hydration",
      "Separated from MEG/TEG by vacuum distillation",
    ],
    mainProcess: {
      name: "Ethylene oxide hydration co-product",
      detail:
        "Diethylene glycol (DEG) is produced as the main heavier co-product when ethylene oxide is hydrated to monoethylene glycol. During hydration, some of the just-formed glycol reacts with another molecule of ethylene oxide, giving DEG (and then triethylene glycol): HOCH2CH2OH + C2H4O → HOCH2CH2OCH2CH2OH. By-products total roughly 10% of the glycol output; the mixed glycols are separated by multi-effect vacuum distillation into MEG, DEG and TEG cuts. A higher water-to-EO ratio reduces DEG formation. DEG is used in polyester resins, plasticisers and as a dehydration/heat-transfer fluid.",
    },
    manufacturers: [
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "MEGlobal", url: "https://www.meglobal.biz" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
    ],
    sources: [
      { name: "Wikipedia, Ethylene glycol (glycols co-products)", url: "https://en.wikipedia.org/wiki/Ethylene_glycol" },
      { name: "Solventis, Diethylene glycol", url: "https://solventis.net/products/glycols/diethylene-glycol/" },
      { name: "ScienceDirect, EO hydration to MEG", url: "https://www.sciencedirect.com/science/article/abs/pii/S0920586107001149" },
    ],
  },

  "methyl-salicylate": {
    routes: [
      "Fischer esterification of salicylic acid with methanol (acid catalyst)",
      "Recovery/rectification of natural oil of wintergreen (minor)",
    ],
    mainProcess: {
      name: "Esterification of salicylic acid with methanol",
      detail:
        "Synthetic methyl salicylate (oil of wintergreen) is made by the acid-catalysed Fischer esterification of salicylic acid with methanol. Salicylic acid is dissolved in excess methanol with sulfuric acid catalyst and heated under reflux at ~90-100 °C for several hours: C6H4(OH)COOH + CH3OH ⇌ C6H4(OH)COOCH3 + H2O. The excess methanol drives the equilibrium; the cooled mixture is washed with sodium-carbonate solution to remove acid and then vacuum-distilled to >99% product. The upstream salicylic acid comes from the Kolbe-Schmitt process.",
    },
    manufacturers: [
      { name: "Novacyl", url: "https://www.novacyl.com" },
      { name: "Shandong Xinhua Pharmaceutical", url: "https://www.xinhuapharm.com" },
    ],
    sources: [
      { name: "Wikipedia, Methyl salicylate", url: "https://en.wikipedia.org/wiki/Methyl_salicylate" },
      { name: "Britannica, Methyl salicylate", url: "https://www.britannica.com/science/methyl-salicylate" },
      { name: "ChemicalBook, Methyl salicylate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB8491046.htm" },
    ],
  },

  "ortho-toluidine": {
    routes: [
      "Nitration of toluene to ortho-nitrotoluene, then catalytic hydrogenation",
      "Iron/acid (Bechamp) reduction of nitrotoluene (older)",
    ],
    mainProcess: {
      name: "ortho-Nitrotoluene hydrogenation",
      detail:
        "ortho-Toluidine (2-methylaniline) is made from toluene. Toluene is nitrated with mixed acid (HNO3/H2SO4) to a mix of nitrotoluenes, from which ortho-nitrotoluene is separated by distillation. The ortho-nitrotoluene is then catalytically hydrogenated over palladium-on-carbon or nickel in the liquid phase at ~80-120 °C under moderate hydrogen pressure, reducing the nitro group to an amine with high (>90%) selectivity: o-CH3C6H4NO2 + 3 H2 → o-CH3C6H4NH2 + 2 H2O. The crude amine is purified by distillation. It is a dye, pigment and agrochemical intermediate.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "Deepak Nitrite", url: "https://www.godeepak.com" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
    ],
    sources: [
      { name: "Aarti Industries, Ortho Toluidine", url: "https://www.aarti-industries.com/products/chemical-products/chemistry/hydrogenation/ortho-toluidine-ot" },
      { name: "NCBI, ortho-Toluidine", url: "https://www.ncbi.nlm.nih.gov/books/NBK390860/" },
      { name: "Metoree, Toluidine manufacturers", url: "https://us.metoree.com/categories/6373/" },
    ],
  },

  "dimethyl-sulphate": {
    routes: [
      "Continuous reaction of dimethyl ether with sulfur trioxide",
      "Distillation of methyl sulfate / methanol + SO3 routes",
    ],
    mainProcess: {
      name: "Dimethyl ether + sulfur trioxide",
      detail:
        "Dimethyl sulfate (a powerful methylating agent) is produced industrially by the continuous reaction of dimethyl ether with sulfur trioxide. Gaseous dimethyl ether is bubbled into the bottom of an absorption tower while liquid SO3 is fed at the top: (CH3)2O + SO3 → (CH3O)2SO2. The tower fills with a mixture of ~96-97% dimethyl sulfate together with sulfuric acid and monomethyl sulfate, which is continuously withdrawn and purified by vacuum distillation (over sodium sulfate). Because DMS is highly toxic, plants are closed and tightly controlled. Production is concentrated among specialty makers in China, India and Europe.",
    },
    manufacturers: [
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
    ],
    sources: [
      { name: "Wikipedia, Dimethyl sulfate", url: "https://en.wikipedia.org/wiki/Dimethyl_sulfate" },
      { name: "INCHEM, Dimethyl sulfate (EHC 48)", url: "https://www.inchem.org/documents/ehc/ehc/ehc48.htm" },
      { name: "Metoree, Dimethyl sulfate manufacturers", url: "https://us.metoree.com/categories/7132/" },
    ],
  },

  "alpha-pinene": {
    routes: [
      "Fractional distillation of crude sulfate turpentine (kraft-pulping by-product)",
      "Distillation of gum turpentine (pine tapping)",
    ],
    mainProcess: {
      name: "Fractional distillation of turpentine",
      detail:
        "Alpha-pinene is the major component of turpentine. Most industrial supply comes from crude sulfate turpentine (CST), a by-product recovered from the kraft (sulfate) pulping of pine wood, the volatile turpentine is condensed from the digester relief gases and skimmed from the black liquor. The CST (or gum turpentine from pine tapping) is then refined and fractionally distilled to separate alpha-pinene from beta-pinene, camphene and limonene. Purified alpha-pinene is the feedstock for synthetic terpene fragrances, camphor, resins, and adhesive tackifiers.",
    },
    manufacturers: [
      { name: "DRT (Firmenich)", url: "https://www.drt.fr" },
      { name: "Kraton (DL Chemical)", url: "https://www.kraton.com" },
      { name: "Ingevity", url: "https://www.ingevity.com" },
    ],
    sources: [
      { name: "Grand View Research, Crude sulfate turpentine market", url: "https://www.grandviewresearch.com/industry-analysis/crude-sulfate-turpentine-market" },
      { name: "Future Market Insights, Crude sulfate turpentine", url: "https://www.futuremarketinsights.com/reports/crude-sulfate-turpentine-market" },
      { name: "FactMR, Crude sulfate turpentine market", url: "https://www.factmr.com/report/4435/crude-sulfate-turpentine-market" },
    ],
  },

  "niobium-pentoxide": {
    routes: [
      "Pyrochlore mining and concentration, then chemical purification to Nb2O5",
      "Solvent-extraction refining via niobium fluoride/oxide to high-purity oxide",
    ],
    mainProcess: {
      name: "Pyrochlore concentration + chemical refining",
      detail:
        "Most niobium comes from the mineral pyrochlore. The ore is mined and beneficiated by physical processing (crushing, flotation, magnetic separation) to a concentrate of ~55-60% Nb2O5. To make high-purity niobium pentoxide, the concentrate is digested (e.g. with hydrofluoric/sulfuric acid) and the niobium is separated from tantalum and impurities by solvent extraction, then precipitated and calcined to Nb2O5 of 98.5-99.5% purity (optical/electronic grades require a further purification step). Much niobium is instead made into ferroniobium for steel by aluminothermic reduction. Supply is dominated by Brazil's CBMM.",
    },
    manufacturers: [
      { name: "CBMM (over 80% of world supply)", url: "https://www.cbmm.com" },
      { name: "CMOC Group", url: "https://www.cmoc.com" },
      { name: "Magris Performance Materials (Niobec)", url: "https://www.magrispm.com" },
    ],
    sources: [
      { name: "Wikipedia, CBMM", url: "https://en.wikipedia.org/wiki/Companhia_Brasileira_de_Metalurgia_e_Minera%C3%A7%C3%A3o" },
      { name: "USGS, Niobium 2018 yearbook (PDF)", url: "https://pubs.usgs.gov/myb/vol1/2018/myb1-2018-niobium.pdf" },
      { name: "niobium.tech, Mining & ferroniobium at CBMM (PDF)", url: "https://niobium.tech/-/media/niobiumtech/attachments-biblioteca-tecnica/nt_mining-ore-preparation-and-ferroniobium-production-at-cbmm.pdf" },
    ],
  },

  "borax-pentahydrate": {
    routes: [
      "Dissolution/recrystallisation refining of tincal (borax) ore",
      "Controlled crystallisation of sodium tetraborate to the pentahydrate",
    ],
    mainProcess: {
      name: "Tincal ore refining + crystallisation",
      detail:
        "Borax pentahydrate is a refined sodium tetraborate made from borate ore. Mined tincal (and kernite) ore is crushed and dissolved in hot water/weak liquor; insoluble gangue (clays) is settled and removed, and the clarified sodium-borate solution is then crystallised under controlled temperature, crystallising above ~60 °C yields the pentahydrate (Na2B4O7·5H2O) rather than the decahydrate. The crystals are filtered, dried and graded. Supply is a near-duopoly of Turkey's Eti Maden and Rio Tinto's Boron (California) operation. Borax pentahydrate is used in glass/fibreglass, detergents and fertilisers.",
    },
    manufacturers: [
      { name: "Eti Maden", url: "https://www.etimaden.gov.tr" },
      { name: "Rio Tinto Borates (U.S. Borax)", url: "https://www.riotinto.com" },
      { name: "Searles Valley Minerals", url: "https://www.svminerals.com" },
    ],
    sources: [
      { name: "Wikipedia, Eti Maden", url: "https://en.wikipedia.org/wiki/Eti_Maden" },
      { name: "Borates Today, Boron mining processes", url: "https://borates.today/boron-mining-processes/" },
      { name: "Sinopeakchem, Borax pentahydrate guide", url: "https://www.sinopeakchem.com/en/blog/borax-pentahydrate-guide" },
    ],
  },

  "monocalcium-phosphate": {
    routes: [
      "Reaction of phosphoric acid with limestone / quicklime to pH ~3.2",
      "Anhydrous route at >140 °C with controlled lime addition",
    ],
    mainProcess: {
      name: "Phosphoric acid + lime neutralisation",
      detail:
        "Monocalcium phosphate (MCP, calcium dihydrogen phosphate) is made by reacting purified phosphoric acid with a calcium source, limestone (CaCO3) or quicklime, under controlled conditions: Ca(OH)2 + 2 H3PO4 → Ca(H2PO4)2 + 2 H2O. For food/feed grade the neutralisation endpoint is held near pH 3.2 to give the monocalcium (rather than di- or tri-calcium) salt; the anhydrous grade is made with a slight lime excess in concentrated acid so the exotherm holds the mass above ~140 °C while avoiding pyrophosphate formation. The slurry is filtered, dried and milled/granulated for baking leavening and animal feed.",
    },
    manufacturers: [
      { name: "J.R. Simplot", url: "https://www.simplot.com" },
      { name: "Polifar Group", url: "https://www.polifar.com" },
      { name: "Khonor Chemicals", url: "https://www.khonorchem.com" },
    ],
    sources: [
      { name: "GJ Phosphate, Food-grade MCP manufacturing", url: "https://www.gjphosphate.com/food-grade-monocalcium-phosphate-mcp/" },
      { name: "Simplot, Livestock feed ingredients", url: "https://www.simplot.com/livestock/feed-ingredients" },
      { name: "Google Patents, MCP leavening acid", url: "https://patents.google.com/patent/US5667836A/en" },
    ],
  },

  "phosphoric-acid-tech-grade": {
    routes: [
      "Thermal process, burn elemental phosphorus, hydrate P2O5 (high purity)",
      "Purified wet-process acid (solvent extraction of fertiliser acid)",
    ],
    mainProcess: {
      name: "Thermal process (elemental phosphorus combustion)",
      detail:
        "Technical/industrial and food-grade phosphoric acid is traditionally made by the thermal process, which gives a much purer acid than the fertiliser wet process. Elemental phosphorus (itself smelted from phosphate rock in an electric furnace) is burned in air in a combustion chamber at ~1650-2760 °C to phosphorus pentoxide (P4 + 5 O2 → 2 P2O5); the P2O5 is then hydrated with dilute acid or water in a hydration tower to strong phosphoric acid, and an electrostatic demister removes the acid mist. Increasingly, technical grade is instead made by solvent-extraction purification of wet-process acid, which is far less energy-intensive.",
    },
    manufacturers: [
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Innophos", url: "https://www.innophos.com" },
      { name: "Prayon", url: "https://www.prayon.com" },
      { name: "OCP Group", url: "https://www.ocpgroup.ma" },
      { name: "Aditya Birla Chemicals", url: "https://www.adityabirlachemicals.com" },
    ],
    sources: [
      { name: "US EPA, Phosphoric acid (AP-42 §8.9)", url: "https://www.epa.gov/sites/default/files/2020-09/documents/8.9_phosphoric_acid.pdf" },
      { name: "Biology Insights, Wet vs thermal phosphoric acid", url: "https://biologyinsights.com/how-is-phosphoric-acid-made-wet-vs-thermal-process/" },
      { name: "ICL, Phosphoric acid for chemical manufacturing", url: "https://www.icl-group.com/our-business/industrial/phosphoric-acid-chemical-manufacturing/" },
    ],
  },

  octylamine: {
    routes: [
      "Hydrogenation of octanenitrile (caprylonitrile) to the primary amine",
      "Catalytic amination of 1-octanol with ammonia ('hydrogen borrowing')",
      "Reductive amination of octanal (smaller scale)",
    ],
    mainProcess: {
      name: "Nitrile hydrogenation / fatty-alcohol amination",
      detail:
        "n-Octylamine (a C8 fatty amine) is made by two main industrial routes. In the nitrile route, octanenitrile (from the fatty acid/triglyceride chain or by hydrocyanation) is hydrogenated over a nickel or cobalt catalyst to the primary amine: C7H15CN + 2 H2 → C8H17NH2. In the fatty-alcohol route, 1-octanol is reacted with ammonia and hydrogen over a metal catalyst in a fixed-bed reactor at ~120-250 °C and 0.5-2 MPa ('hydrogen-borrowing' reductive amination), replacing the hydroxyl with an amino group. The crude amine is purified by distillation; selectivity to primary vs secondary/tertiary amine is set by the ammonia excess and catalyst.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Kao Corporation", url: "https://www.kao.com" },
    ],
    sources: [
      { name: "ScienceDirect, Amination of 1-octanol", url: "https://www.sciencedirect.com/science/article/abs/pii/S0926860X9900054X" },
      { name: "Wiley, Catalytic approaches to fatty amines", url: "https://onlinelibrary.wiley.com/doi/10.1002/tcr.202500225" },
      { name: "Google Patents, Synthesis of n-octylamine", url: "https://patents.google.com/patent/CN103664633A/en" },
    ],
  },

  "para-toluenesulphonamide": {
    routes: [
      "Chlorosulfonation of toluene to p-toluenesulfonyl chloride, then ammoniation",
      "Direct amidation of p-toluenesulfonic acid (lower-waste variant)",
    ],
    mainProcess: {
      name: "Chlorosulfonation of toluene + ammoniation",
      detail:
        "para-Toluenesulfonamide (PTSA) is made from toluene. Toluene is reacted with chlorosulfonic acid (chlorosulfonation), which installs a -SO2Cl group mainly at the para position to give p-toluenesulfonyl chloride (the ortho isomer is separated by freezing crystallisation). The sulfonyl chloride is then reacted with ammonia (ammoniation) to replace chlorine with an amide group: p-CH3C6H4SO2Cl + 2 NH3 → p-CH3C6H4SO2NH2 + NH4Cl. The crude is decolourised with activated carbon, filtered and acid-treated to the finished product, used as a plasticiser and resin/coating intermediate.",
    },
    manufacturers: [
      { name: "Axcentive", url: "https://www.axcentive.com" },
      { name: "Emco Dyestuff", url: "https://emcochemicals.com" },
    ],
    sources: [
      { name: "Google Patents, p-Toluenesulfonamide by direct amidation", url: "https://patents.google.com/patent/CN104945288A/en" },
      { name: "Emco Chemicals, Para-toluenesulfonamide (PTSA)", url: "https://emcochemicals.com/para-toluenesulfonamide-ptsa/" },
      { name: "ChemBK, p-Toluenesulfonamide", url: "https://www.chembk.com/en/chem/p-Toluenesulfonamide" },
    ],
  },

  "1-2-4-trichlorobenzene": {
    routes: [
      "Chlorination of benzene / dichlorobenzene (1,2,4-TCB as main or by-product)",
      "Dehydrochlorination of hexachlorocyclohexane (HCH)",
      "Isomerisation of dichlorobenzenes, then chlorination",
    ],
    mainProcess: {
      name: "Benzene / dichlorobenzene chlorination",
      detail:
        "1,2,4-Trichlorobenzene is produced by the catalytic chlorination of benzene (or, more selectively, of 1,4-dichlorobenzene) with chlorine over an iron/Lewis-acid catalyst. Successive ring substitution gives mono-, di- and tri-chlorobenzenes; with the right conditions and additives (e.g. sulfur), the 1,2,4-isomer becomes the principal trichloro product, and chlorinating 1,4-dichlorobenzene gives it almost exclusively. The isomers are separated by distillation/crystallisation. It is also recovered from the dehydrochlorination of HCH ('benzene hexachloride'). The product is used as a dye/agrochemical intermediate and high-boiling solvent.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "BASF", url: "https://www.basf.com" },
    ],
    sources: [
      { name: "Wikipedia, 1,2,4-Trichlorobenzene", url: "https://en.wikipedia.org/wiki/1,2,4-Trichlorobenzene" },
      { name: "Aarti Industries, 1,2,4-TCB", url: "https://www.aarti-industries.com/products/chemical-products/chemistry/chlorination/1-2-4-tri-chloro-benzene-(1-2-4-tcb)" },
      { name: "ATSDR, Trichlorobenzenes production (PDF)", url: "https://www.atsdr.cdc.gov/toxprofiles/tp199-c5.pdf" },
    ],
  },

  "paracetamol-intermediate": {
    routes: [
      "Catalytic hydrogenation of nitrobenzene to phenylhydroxylamine, then Bamberger rearrangement to PAP",
      "Single-step hydrogenation of nitrobenzene in aqueous acid",
      "Nitration/reduction of phenol or hydrogenation of p-nitrophenol",
    ],
    mainProcess: {
      name: "Nitrobenzene to para-aminophenol (Bamberger route)",
      detail:
        "The key paracetamol intermediate is para-aminophenol (PAP). In the dominant route nitrobenzene is partially reduced (catalytically with hydrogen, or with zinc) to phenylhydroxylamine, which in the presence of sulfuric acid undergoes the Bamberger rearrangement to para-aminophenol. Modern plants run this as a single-step catalytic hydrogenation of nitrobenzene in aqueous sulfuric acid over a platinum catalyst, giving PAP directly. PAP is then acetylated with acetic anhydride to make paracetamol (acetaminophen). Over 80% of world PAP goes to paracetamol.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, 4-Aminophenol", url: "https://en.wikipedia.org/wiki/4-Aminophenol" },
      { name: "ACS OPRD, PAP from nitrobenzene (Bamberger)", url: "https://pubs.acs.org/doi/10.1021/acs.oprd.7b00354" },
      { name: "ChemAnalyst, Para-aminophenol market", url: "https://www.chemanalyst.com/industry-report/para-aminophenol-market-3088" },
    ],
  },

  "1-octadecene": {
    routes: [
      "Ethylene oligomerisation to linear alpha olefins (SHOP, Ethyl/INEOS, CP Chem), then the C18 cut",
      "Fischer-Tropsch derived alpha olefins (Sasol)",
    ],
    mainProcess: {
      name: "Ethylene oligomerisation (linear alpha olefin)",
      detail:
        "1-Octadecene is a C18 linear alpha olefin (LAO) made by catalytic oligomerisation of ethylene. Ethylene is grown into a Schulz-Flory distribution of even-numbered linear alpha olefins over an organoaluminium or transition-metal catalyst (e.g. Shell's SHOP nickel process, or the Ethyl/INEOS and Chevron Phillips alkyl-aluminium processes) at elevated temperature and pressure. The crude olefin mixture (1-butene, 1-hexene, 1-octene … up to C20+) is separated by fractional distillation, and the C18 (1-octadecene) cut is taken. Some LAO is also recovered from Fischer-Tropsch synthesis. It is used in surfactants, lubricants, polymers and as a high-boiling reaction solvent.",
    },
    manufacturers: [
      { name: "Shell Chemicals", url: "https://www.shell.com" },
      { name: "Chevron Phillips Chemical", url: "https://www.cpchem.com" },
      { name: "INEOS Oligomers", url: "https://www.ineos.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "Sasol", url: "https://www.sasol.com" },
    ],
    sources: [
      { name: "Wikipedia, Linear alpha olefin", url: "https://en.wikipedia.org/wiki/Linear_alpha_olefin" },
      { name: "Chemical Engineering, LAO production profile", url: "https://www.chemengonline.com/technology-profile-production-of-linear-alpha-olefins/" },
      { name: "Grand View Research, Higher alpha olefins market", url: "https://www.grandviewresearch.com/industry-analysis/higher-alpha-olefins-market-report" },
    ],
  },

  "isotridecyl-alcohol": {
    routes: [
      "Oxo process (hydroformylation) of branched C12 olefins (tetrapropylene), then hydrogenation",
      "Cobalt- or rhodium-catalysed hydroformylation variants",
    ],
    mainProcess: {
      name: "Oxo process (hydroformylation of dodecene)",
      detail:
        "Isotridecyl alcohol (isotridecanol, a branched C13 oxo alcohol) is made by the oxo process. A branched C12 olefin feed, typically propylene tetramer (tetrapropylene), is hydroformylated by reacting it with synthesis gas (CO + H2) over a cobalt carbonyl catalyst at ~150-170 °C and high pressure (~30 MPa), adding one carbon as an aldehyde group. The resulting C13 aldehyde mixture is then hydrogenated to the corresponding branched primary alcohol. Because the feed is branched, the product is an isomer mixture rather than a single structure. It is mainly ethoxylated into nonionic surfactants and used in lubricants and plasticisers.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "ExxonMobil Chemical", url: "https://www.exxonmobilchemical.com" },
      { name: "Evonik Industries", url: "https://www.evonik.com" },
      { name: "Sasol", url: "https://www.sasol.com" },
      { name: "KH Neochem", url: "https://www.khneochem.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Hydroformylation", url: "https://en.wikipedia.org/wiki/Hydroformylation" },
      { name: "The Chemical Company, Isotridecyl alcohol", url: "https://thechemco.com/isotridecyl-alcohol-uses-applications/" },
      { name: "Johnson Matthey, LP Oxo alcohols technology", url: "https://matthey.com/products-and-markets/chemicals/process-licensing/oxo-alcohols-process" },
    ],
  },

  "meta-phenoxybenzaldehyde": {
    routes: [
      "Air oxidation of m-phenoxytoluene to the aldehyde",
      "Side-chain dihalogenation of m-phenoxytoluene, then hydrolysis",
      "Ullmann ether coupling routes from chlorobenzene/m-cresol building blocks",
    ],
    mainProcess: {
      name: "m-Phenoxytoluene oxidation / dihalide hydrolysis",
      detail:
        "meta-Phenoxybenzaldehyde (MPB) is the central intermediate for synthetic pyrethroid insecticides. The diphenyl-ether backbone (m-phenoxytoluene) is built by an Ullmann-type coupling of a chlorobenzene with m-cresol (or phenol with m-cresol derivatives). The methyl group of m-phenoxytoluene is then converted to the aldehyde either by controlled catalytic air oxidation (high selectivity at low conversion, with over-oxidised m-phenoxybenzoic acid recycled by Rosenmund reduction) or by side-chain dihalogenation to the benzal dihalide followed by hydrolysis. MPB is condensed with the acid/alcohol partners to make cypermethrin, deltamethrin and similar pyrethroids.",
    },
    manufacturers: [
      { name: "Gharda Chemicals", url: "https://www.gharda.com" },
      { name: "Heranba Industries", url: "https://www.heranba.co.in" },
    ],
    sources: [
      { name: "ACS OPRD, Synthesis of m-phenoxybenzaldehyde", url: "https://pubs.acs.org/doi/abs/10.1021/op990028z" },
      { name: "Google Patents, Preparation of m-phenoxybenzaldehyde", url: "https://patents.google.com/patent/US4108904A/en" },
      { name: "PW Consulting, Pyrethroid intermediate market", url: "https://pmarketresearch.com/chemi/pyrethroid-pesticide-intermediate-market/" },
    ],
  },

  "sugammadex-sodium": {
    routes: [
      "Per-6-halogenation of gamma-cyclodextrin, then displacement with 3-mercaptopropionic acid",
      "Iodination (I2/PPh3) or chlorination (PCl5), then thioether formation and sodium salt",
    ],
    mainProcess: {
      name: "gamma-Cyclodextrin per-6-thioetherification",
      detail:
        "Sugammadex is a modified gamma-cyclodextrin used to reverse neuromuscular blockade. Synthesis starts from gamma-cyclodextrin (a ring of eight glucose units): the eight primary (6-position) hydroxyls are all activated by halogenation, typically iodination with iodine/triphenylphosphine in DMF, or chlorination with phosphorus pentachloride, to give the per-6-halo-cyclodextrin. This octa-halide is then reacted with 3-mercaptopropionic acid under base (sodium hydride) so that the thiol displaces each halide, installing eight carboxyl-thioether arms; neutralisation gives the octasodium salt (sugammadex sodium), which is purified by chromatography/ultrafiltration to API grade.",
    },
    manufacturers: [
      { name: "Merck & Co. (originator, Bridion)", url: "https://www.merck.com" },
      { name: "Fresenius Kabi", url: "https://www.fresenius-kabi.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Nuray Chemicals", url: "https://www.nuraychemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Sugammadex", url: "https://en.wikipedia.org/wiki/Sugammadex" },
      { name: "Google Patents, Process for preparation of sugammadex", url: "https://patents.google.com/patent/US9120876B2/en" },
      { name: "Nuray Chemicals, Sugammadex sodium", url: "https://www.nuraychemicals.com/products/suggamadex-sodium/" },
    ],
  },

  sclareol: {
    routes: [
      "Solvent/CO2 extraction and purification from clary sage (Salvia sclarea)",
      "Fermentation (engineered microbes) to sclareol / ambrox precursors",
    ],
    mainProcess: {
      name: "Clary sage extraction (and biotech fermentation)",
      detail:
        "Sclareol is a labdane diterpene and the main fragrance precursor to Ambrox/ambroxide. Traditionally it is obtained from clary sage (Salvia sclarea): the harvested plant material is solvent- or CO2-extracted to a concrete, from which sclareol (which makes up ~1-2% of the essential oil) is concentrated and crystallised/purified. Increasingly it is produced by white biotechnology, fragrance houses have reconstructed the sclareol biosynthetic pathway in engineered microorganisms (e.g. yeast/E. coli) and ferment sugar feedstocks to sclareol, improving yield and supply stability. The sclareol is then chemically converted to ambroxide.",
    },
    manufacturers: [
      { name: "dsm-firmenich", url: "https://www.dsm-firmenich.com" },
      { name: "Givaudan", url: "https://www.givaudan.com" },
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "IFF", url: "https://www.iff.com" },
    ],
    sources: [
      { name: "PMC, Diterpene synthases for sclareol in clary sage", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3520730/" },
      { name: "C&EN, Givaudan Ambrofix via microbes", url: "https://cen.acs.org/biological-chemistry/biotechnology/Givaudan-makes-Ambrofix-brand-ambroxide/97/i44" },
      { name: "PubMed, Biosynthetic route to sclareol", url: "https://pubmed.ncbi.nlm.nih.gov/23113661/" },
    ],
  },

  racecadotril: {
    routes: [
      "Couple a 2-benzylacryloyl unit with glycine benzyl ester, then thia-Michael addition of thioacetic acid",
      "Acyl chloride amidation, then acetylthiomethyl installation",
    ],
    mainProcess: {
      name: "Amide coupling + thioacetic acid addition",
      detail:
        "Racecadotril (acetorphan), an enkephalinase inhibitor used as an antidiarrhoeal, is a benzyl-protected glycine amide bearing an acetylthiomethyl side chain. A common route activates 2-benzylacrylic acid as its acyl chloride (with thionyl chloride) and condenses it with glycine benzyl ester (with a base such as triethylamine) to give the 2-benzylacrylamide. Thioacetic acid is then added across the acrylamide double bond (a thia-Michael addition, heated ~80 °C), installing the -CH2-S-COCH3 (acetylthiomethyl) group to give racecadotril as the racemate. The product is purified by crystallisation.",
    },
    manufacturers: [
      { name: "Bioprojet (originator, Tiorfan/Hidrasec)", url: "https://www.bioprojet.com" },
      { name: "Hetero", url: "https://www.heteroworld.com" },
      { name: "MSN Laboratories", url: "https://www.msnlabs.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "PharmaCompass, Racecadotril manufacturers", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/racecadotril-acetorphan" },
      { name: "New Drug Approvals, Racecadotril", url: "https://newdrugapprovals.org/2022/01/15/racecadotril/" },
      { name: "All About Drugs, Racecadotril (acetorphan)", url: "https://www.allfordrugs.com/2016/06/21/racecadotril-acetorphan/" },
    ],
  },


  "benzoic-acid": {
    routes: [
      "Liquid-phase oxidation of toluene with air over cobalt/manganese naphthenate catalyst (the dominant commercial route)",
      "Hydrolysis of benzotrichloride to give technical-grade benzoic acid",
      "Hydrolysis/decarboxylation of phthalic anhydride",
      "Recovery as a by-product of cyclohexane/toluene oxidation streams",
    ],
    mainProcess: {
      name: "Catalytic liquid-phase air oxidation of toluene",
      detail:
        "Benzoic acid is produced commercially by the partial oxidation of toluene with air or oxygen in the liquid phase, catalysed by soluble cobalt or manganese salts (naphthenates/acetates). The reaction runs at roughly 130-165 °C and several bar; toluene conversion is held near 50% with about 80% selectivity to benzoic acid to limit over-oxidation. The methyl group is oxidised through benzyl alcohol and benzaldehyde to the carboxylic acid: C6H5CH3 + 1.5 O2 → C6H5COOH + H2O. The crude melt is degassed, then purified by distillation (and, for food/USP grade, by recrystallisation or a further hydrogenation/wash) to remove benzaldehyde and ring-oxidised by-products. The process uses cheap feedstock, runs in high yield and is regarded as relatively clean.",
    },
    manufacturers: [
      { name: "Emerald Kalama Chemical (LANXESS)", url: "https://lanxess.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
      { name: "Wuhan Youji Industries", url: "https://www.whyouji.com" },
      { name: "Velsicol / Genovique", url: "https://www.eastman.com" },
      { name: "Jiangsu Jiujiu Jiu Technology", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Wikidoc, Benzoic acid (production)", url: "https://www.wikidoc.org/index.php/Benzoic_acid" },
      { name: "ResearchGate, Catalytic oxidation of toluene to benzoic acid", url: "https://www.researchgate.net/publication/385558112_Improvements_in_the_manufacture_of_benzoic_acid_obtained_by_catalytic_oxidation_of_toluene" },
      { name: "Google Patents US3210416A, Benzoic acid from toluene", url: "https://patents.google.com/patent/US3210416A/" },
    ],
  },
  "sodium-benzoate": {
    routes: [
      "Neutralisation of benzoic acid with sodium hydroxide (caustic soda)",
      "Neutralisation of benzoic acid with sodium carbonate or sodium bicarbonate",
      "Direct work-up from toluene/benzotrichloride-derived benzoic acid streams",
    ],
    mainProcess: {
      name: "Neutralisation of benzoic acid with caustic soda",
      detail:
        "Sodium benzoate is made by neutralising benzoic acid with a sodium base: C6H5COOH + NaOH → C6H5COONa + H2O. Benzoic acid is charged to a neutraliser with caustic soda (or soda ash) and water and reacted at about 70-98 °C to a controlled end-point of pH 7.5-8.0, giving a crude sodium benzoate solution. The liquor is decolourised with activated carbon, filtered under pressure, then concentrated by evaporation and dried. Depending on the grade the product is finished as crystals, powder or granules/pellets, then screened and packed to food (E211) or technical specification.",
    },
    manufacturers: [
      { name: "Emerald Kalama Chemical (LANXESS)", url: "https://lanxess.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
      { name: "Wuhan Youji Industries", url: "https://www.whyouji.com" },
      { name: "A.M. Food Chemical", url: "https://www.preservatives-chem.com" },
      { name: "Tianjin Dongda Chemical Group", url: "https://www.tjddhg.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium benzoate", url: "https://en.wikipedia.org/wiki/Sodium_benzoate" },
      { name: "Google Patents CN1887845A, Granular sodium benzoate", url: "https://patents.google.com/patent/CN1887845A/en" },
      { name: "eCFR 21 CFR 184.1733, Sodium benzoate", url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-184/subpart-B/section-184.1733" },
    ],
  },
  "benzyl-alcohol": {
    routes: [
      "Alkaline hydrolysis (saponification) of benzyl chloride, the principal industrial route",
      "Catalytic hydrogenation of benzaldehyde",
      "Minor: hydrogenation of benzoic acid esters; electrochemical and bio-catalytic routes",
    ],
    mainProcess: {
      name: "Alkaline hydrolysis of benzyl chloride",
      detail:
        "The dominant route hydrolyses benzyl chloride with an alkaline agent. Because the reaction C6H5CH2Cl + H2O ⇌ C6H5CH2OH + HCl is reversible, an aqueous alkali (sodium/potassium hydroxide or carbonate, or an alkaline-earth oxide) is used to mop up the hydrogen chloride as it forms and drive conversion to near-quantitative yield. Benzyl chloride is heated with the excess aqueous base, and the benzyl alcohol layer is separated, washed and purified by distillation. The main by-product is dibenzyl ether, which is suppressed by controlling temperature and alkali concentration. The alternative commercial route hydrogenates benzaldehyde over a metal catalyst.",
    },
    manufacturers: [
      { name: "LANXESS (Emerald)", url: "https://lanxess.com" },
      { name: "Wuhan Youji Industries", url: "https://www.whyouji.com" },
      { name: "Hubei Greenhome Fine Chemical", url: "https://www.greenhome-chem.com" },
      { name: "Jiangsu Zhongdan Group", url: "https://www.chinazhongdan.com" },
      { name: "Velsicol Chemical", url: "https://www.eastman.com" },
    ],
    sources: [
      { name: "Chemcess, Benzyl alcohol production", url: "https://chemcess.com/benzyl-alcohol-production-reactions-and-uses/" },
      { name: "Google Patents US3557222A, Hydrolysis of benzyl chloride to benzyl alcohol", url: "https://patents.google.com/patent/US3557222A/en" },
      { name: "MDPI Microorganisms, Benzyl alcohol production routes", url: "https://www.mdpi.com/2076-2607/10/5/966" },
    ],
  },
  "calcium-carbonate": {
    routes: [
      "Precipitated calcium carbonate (PCC): calcine limestone to lime, slake to milk of lime, then carbonate with CO2",
      "Ground calcium carbonate (GCC): mechanically crush, grind and classify high-purity limestone or marble",
      "Wet/dry grinding with surface coating (e.g. stearate) for filler grades",
    ],
    mainProcess: {
      name: "Carbonation of milk of lime (PCC)",
      detail:
        "Precipitated calcium carbonate is made by a calcine-slake-carbonate loop. Limestone (CaCO3) is calcined in a kiln to quicklime and carbon dioxide: CaCO3 → CaO + CO2. The quicklime is slaked with water to a calcium hydroxide slurry ('milk of lime'): CaO + H2O → Ca(OH)2. Carbon dioxide gas, usually the CO2 recovered from the kiln, is then bubbled through the milk of lime in a carbonator, reprecipitating calcium carbonate: Ca(OH)2 + CO2 → CaCO3 + H2O. Temperature, CO2 rate and additives control the crystal habit (calcite vs aragonite) and particle size; the slurry is dewatered, dried and milled. Ground calcium carbonate (GCC), by contrast, is simply mined high-purity limestone/marble that is crushed, milled and classified.",
    },
    manufacturers: [
      { name: "Omya", url: "https://www.omya.com" },
      { name: "Imerys", url: "https://www.imerys.com" },
      { name: "Minerals Technologies (Specialty Minerals)", url: "https://www.mineralstech.com" },
      { name: "Mississippi Lime Company", url: "https://mississippilime.com" },
      { name: "Nordkalk", url: "https://www.nordkalk.com" },
    ],
    sources: [
      { name: "Sudarshan Group, PCC manufacturing process", url: "https://sudarshangroup.com/what-is-the-process-of-precipitated-calcium-carbonate-manufacturing/" },
      { name: "Intratec, Calcium carbonate from lime and CO2", url: "https://medium.com/intratec-products-blog/calcium-carbonate-production-from-lime-and-carbon-dioxide-economic-analysis-6cca76f51dbc" },
      { name: "Mordor Intelligence, PCC market & companies", url: "https://www.mordorintelligence.com/industry-reports/precipitated-calcium-carbonate-market" },
    ],
  },
  "calcium-nitrate": {
    routes: [
      "Digestion of limestone (calcium carbonate) with nitric acid, then neutralisation with ammonia",
      "Crystallisation as calcium nitrate tetrahydrate, or prilling/granulation",
      "Co-production with the nitrophosphate (Odda) route for NPK fertilisers",
    ],
    mainProcess: {
      name: "Limestone digestion with nitric acid",
      detail:
        "Calcium nitrate is produced by reacting ground limestone with dilute nitric acid: CaCO3 + 2 HNO3 → Ca(NO3)2 + CO2 + H2O. The exothermic digestion releases carbon dioxide and gives a calcium nitrate liquor, which is neutralised to a slightly basic pH with ammonia to precipitate iron/phosphate impurities and adjust the grade (often producing the 'calcium ammonium nitrate' double salt, 5Ca(NO3)2·NH4NO3·10H2O, marketed as YaraLiva). The purified solution is concentrated and either crystallised to calcium nitrate tetrahydrate or prilled/granulated. The CO2 by-product can be captured for sequestration or reuse.",
    },
    manufacturers: [
      { name: "Yara International", url: "https://www.yara.com" },
      { name: "EuroChem Group", url: "https://www.eurochemgroup.com" },
      { name: "Uralchem", url: "https://www.uralchem.com" },
      { name: "Sterling Chemicals / Haifa Group", url: "https://www.haifa-group.com" },
      { name: "Shandong Tianyi Chemical", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Google Patents WO2006031139A1, Method of calcium nitrate production", url: "https://patents.google.com/patent/WO2006031139A1/en" },
      { name: "Procurement Resource, Calcium nitrate production", url: "https://www.procurementresource.com/production-cost-report-store/calcium-nitrate" },
      { name: "NIIR, CAN / NPK production", url: "https://www.niir.org/blog/production-of-npk-fertilizer-calcium-ammonium-nitrate-can/" },
    ],
  },
  "calcium-propionate": {
    routes: [
      "Neutralisation of propionic acid with calcium hydroxide (milk of lime)",
      "Neutralisation of propionic acid with calcium carbonate",
      "Spray- or fluid-bed drying of the neutralised liquor to powder/granules",
    ],
    mainProcess: {
      name: "Neutralisation of propionic acid with calcium hydroxide",
      detail:
        "Calcium propionate is made by neutralising propionic acid with a calcium base: 2 CH3CH2COOH + Ca(OH)2 → Ca(CH3CH2COO)2 + 2 H2O (calcium carbonate can be used instead, releasing CO2). Calcium hydroxide is charged to a reactor with process water and propionic acid is metered in stepwise to control the exotherm; the mixture is stirred and held at about 70-100 °C for 2-3 hours to complete the neutralisation. The resulting solution is filtered to remove insolubles, then concentrated and dried (spray or fluid-bed) and milled to a fine white food- or feed-grade powder.",
    },
    manufacturers: [
      { name: "Niacet (Kerry Group)", url: "https://www.niacet.com" },
      { name: "Macco Organiques", url: "https://www.macco.cz" },
      { name: "Perstorp", url: "https://www.perstorp.com" },
      { name: "A.M. Food Chemical", url: "https://www.preservatives-chem.com" },
      { name: "Kemin Industries", url: "https://www.kemin.com" },
    ],
    sources: [
      { name: "Scribd, Calcium propionate manufacturing process", url: "https://www.scribd.com/document/451864932/17-Calcium-Propionate-manufacturing-process" },
      { name: "Google Patents EP0093317A1, Preparation of calcium propionate", url: "https://patents.google.com/patent/EP0093317A1/en" },
      { name: "FreePatentsOnline US4700000, Preparation of calcium propionate (BASF)", url: "https://www.freepatentsonline.com/4700000.html" },
    ],
  },
  "calcium-stearate": {
    routes: [
      "Precipitation route: saponify stearic acid to sodium stearate, then double-decompose with calcium chloride",
      "Fusion (direct) route: react molten stearic acid with calcium hydroxide",
      "Semi-wet hybrid process combining precipitation and fusion",
    ],
    mainProcess: {
      name: "Precipitation (double-decomposition) process",
      detail:
        "Two routes dominate. In the precipitation route, stearic acid is first saponified with sodium hydroxide to water-soluble sodium stearate; an aqueous calcium salt (usually calcium chloride) is then added so the metals exchange and calcium stearate precipitates: 2 C17H35COONa + CaCl2 → (C17H35COO)2Ca + 2 NaCl. The fine precipitate is filtered, washed free of salt, dried and milled, giving a very fine, low-bulk-density, high-purity powder favoured for PVC. In the fusion (dry) route, stearic acid and calcium hydroxide are heated together above the acid's melting point and reacted directly (2 C17H35COOH + Ca(OH)2 → (C17H35COO)2Ca + 2 H2O); this gives a coarser, denser product. Many plants now use a semi-wet hybrid of the two.",
    },
    manufacturers: [
      { name: "Baerlocher", url: "https://www.baerlocher.com" },
      { name: "FACI SpA", url: "https://www.faci.it" },
      { name: "Peter Greven", url: "https://www.peter-greven.de" },
      { name: "Norac Additives (Valtris)", url: "https://www.valtris.com" },
      { name: "Sun Ace Kakoh", url: "https://www.sunace.com.sg" },
    ],
    sources: [
      { name: "Alapolystabs, Manufacturing process of calcium stearates", url: "https://alapolystabs.com/calcium-stearates.html" },
      { name: "PishroChem, Manufacturing process of calcium stearate", url: "https://www.pishrochem.com/blog/en/the-manufacturing-process-of-calcium-stearate/" },
      { name: "Google Patents US4307027A, Continuous metallic stearate process", url: "https://patents.google.com/patent/US4307027A/en" },
    ],
  },
  "cocamidopropyl-betaine-capb": {
    routes: [
      "Amidation of coconut (lauric) fatty acids with 3-dimethylaminopropylamine (DMAPA) to the amidoamine",
      "Quaternisation/betainisation of the amidoamine with sodium monochloroacetate",
      "Biomass-balanced variants using renewable feedstock (e.g. BASF Galaxy CAPB SB)",
    ],
    mainProcess: {
      name: "Amidation with DMAPA then betainisation with sodium chloroacetate",
      detail:
        "CAPB is made in two steps. First, coconut- or palm-kernel-derived fatty acids (rich in lauric acid) are condensed with 3-dimethylaminopropylamine (DMAPA): the primary amine of DMAPA reacts with the fatty carboxyl group to form a fatty amidoamine (cocamidopropyl dimethylamine), splitting out water. In the second step this amidoamine is quaternised with sodium monochloroacetate (ClCH2COONa) in water, where the tertiary amine nitrogen is alkylated by the chloroacetate to install the carboxymethyl (betaine) group, giving the amphoteric surfactant plus sodium chloride. The product is supplied as a ~30% active aqueous solution, with residual amidoamine, DMAPA and monochloroacetate tightly controlled.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Evonik", url: "https://www.evonik.com" },
      { name: "Clariant", url: "https://www.clariant.com" },
      { name: "Galaxy Surfactants", url: "https://www.galaxysurfactants.com" },
      { name: "Stepan Company", url: "https://www.stepan.com" },
    ],
    sources: [
      { name: "Elchemy, How is CAPB manufactured", url: "https://elchemy.com/blogs/capb-reports/how-is-capb-manufactured" },
      { name: "Wikipedia, Cocamidopropyl betaine", url: "https://en.wikipedia.org/wiki/Cocamidopropyl_betaine" },
      { name: "Procurement Resource, CAPB from DMAPA", url: "https://www.procurementresource.com/cost-analysis/capb-cocamidopropyl-betaine-production-from-dimethylaminopropylamine-dmapa" },
    ],
  },
  "cocamide-dea": {
    routes: [
      "Direct amidation of coconut fatty acids with diethanolamine (DEA)",
      "Two-step transesterification of coconut oil to methyl ester (FAME), then amidation with DEA",
      "Reaction of whole/stripped coconut oil with DEA",
    ],
    mainProcess: {
      name: "Amidation of coconut fatty acids with diethanolamine",
      detail:
        "Cocamide DEA is a nonionic surfactant made by condensing the mixed fatty acids of coconut oil with diethanolamine (DEA). In the direct route, coconut fatty acid and DEA (around a 1:1 molar ratio for the highest-purity amide) are heated under controlled temperature and a slight vacuum so the carboxylic acid and the amine condense to the fatty diethanolamide, eliminating water: RCOOH + HN(CH2CH2OH)2 → RCON(CH2CH2OH)2 + H2O. A common industrial variant first transesterifies coconut oil to fatty acid methyl ester (FAME) and then amidates the FAME with DEA (often over a CaO catalyst), which runs at milder conditions and gives a lighter-coloured product. The crude is neutralised, filtered and standardised to the required active content.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Stepan Company", url: "https://www.stepan.com" },
      { name: "Kao Chemicals", url: "https://www.kao.com" },
      { name: "KLK Oleo", url: "https://www.klkoleo.com" },
      { name: "Fengchen Group", url: "https://www.fengchengroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Cocamide DEA", url: "https://en.wikipedia.org/wiki/Cocamide_DEA" },
      { name: "ARPN J. Eng., Transesterification & amidation route to cocamide DEA", url: "https://www.arpnjournals.org/jeas/research_papers/rp_2019/jeas_0619_7781.pdf" },
      { name: "SpecialChem, Cocamide DEA (INCI)", url: "https://cosmetics.specialchem.com/inci-ingredients/cocamide-dea" },
    ],
  },
  "cocamide-mea-cmea": {
    routes: [
      "Amidation of coconut fatty acids with monoethanolamine (MEA)",
      "Amidation of coconut fatty acid methyl ester with MEA",
      "Melt-flaking of the waxy amide to the solid product form",
    ],
    mainProcess: {
      name: "Amidation of coconut fatty acids with monoethanolamine",
      detail:
        "Cocamide MEA is a solid nonionic surfactant produced by amidation: the mixed fatty acids derived from coconut oil react with monoethanolamine (MEA) to form fatty acid monoethanolamides, RCOOH + H2NCH2CH2OH → RCONHCH2CH2OH + H2O. The reaction is run hot with water removed to drive condensation; the resulting waxy off-white to tan solid is then melted and processed into flakes (which melt to a pale-yellow viscous liquid on heating). CMEA is valued as a foam booster/stabiliser and viscosity builder in shampoos, soap bars and detergents.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Kao Chemicals", url: "https://www.kao.com" },
      { name: "Galaxy Surfactants", url: "https://www.galaxysurfactants.com" },
      { name: "Stepan Company", url: "https://www.stepan.com" },
      { name: "KLK Oleo", url: "https://www.klkoleo.com" },
    ],
    sources: [
      { name: "Wikipedia, Cocamide MEA", url: "https://en.wikipedia.org/wiki/Cocamide_MEA" },
      { name: "Scimplify, Cocamide MEA (CMEA)", url: "https://www.scimplify.com/en-us/cocamide-mea" },
      { name: "Google Patents US8937102, Cocamide monoethanolamide concentrates", url: "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8937102" },
    ],
  },
  "coconut-oil": {
    routes: [
      "Expeller (screw-press) extraction of oil from dried copra, with solvent extraction of the press cake",
      "Refining of crude coconut oil, degumming, neutralisation, bleaching and deodorisation (RBD)",
      "Virgin coconut oil by cold/wet processing of fresh coconut kernel",
    ],
    mainProcess: {
      name: "Copra expeller pressing and RBD refining",
      detail:
        "Most commercial coconut oil starts from copra, the dried kernel of mature coconuts (~64% oil). The cleaned, sized copra is conditioned and pressed in screw presses (expellers) to express crude oil; the residual press cake (still ~6-10% oil) is solvent-extracted (hexane) to recover the rest. The combined crude oil is then refined to RBD (refined, bleached, deodorised) grade: degumming/neutralisation removes free fatty acids and phosphatides, bleaching with activated clay removes colour, and steam deodorisation under vacuum strips odour and volatiles. Virgin coconut oil instead is made from fresh kernel by wet/cold processes without high-heat refining.",
    },
    manufacturers: [
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "Wilmar International", url: "https://www.wilmar-international.com" },
      { name: "Musim Mas", url: "https://www.musimmas.com" },
      { name: "Marico (Parachute)", url: "https://marico.com" },
      { name: "Greenville Agro / P&G Chemicals", url: "https://www.pgchemicals.com" },
    ],
    sources: [
      { name: "OFI Magazine, Processing coconut oil", url: "https://www.ofimagazine.com/content-images/news/Coconut_oil_processing.pdf" },
      { name: "Musim Mas, How coconut is processed into oil and oleochemicals", url: "https://www.musimmas.com/resources/blogs/how-is-coconut-processed-from-a-plant-into-oil-and-oleochemicals/" },
      { name: "Kumar Metal, Copra/coconut oil production", url: "https://kumarmetal.com/copra-or-coconut-oil-productions-specification-applications/" },
    ],
  },
  "diethyl-carbonate": {
    routes: [
      "Transesterification of dimethyl carbonate (or ethylene carbonate) with ethanol",
      "Oxidative carbonylation of ethanol with CO and O2 over a copper catalyst",
      "Reaction of ethanol with urea (urea alcoholysis); CO2 + ethanol routes (emerging)",
    ],
    mainProcess: {
      name: "Transesterification with ethanol",
      detail:
        "Battery- and solvent-grade diethyl carbonate is most commonly made by transesterification, swapping the alkyl groups of a cheaper carbonate with ethanol. Dimethyl carbonate (or ethylene carbonate) is reacted with ethanol over a basic catalyst (e.g. sodium ethoxide or a solid base): (CH3O)2CO + 2 C2H5OH ⇌ (C2H5O)2CO + 2 CH3OH, proceeding through the mixed ethyl methyl carbonate intermediate. The equilibrium is pulled toward DEC by removing the light methanol (as a methanol-DMC azeotrope) in a reactive-distillation column, and the product is purified to the very low water and protic-impurity levels needed for lithium-ion electrolytes. The alternative direct route is oxidative carbonylation of ethanol (EtOH + CO + ½O2 → DEC + H2O) over copper catalysts.",
    },
    manufacturers: [
      { name: "UBE Corporation", url: "https://www.ube.com" },
      { name: "Shandong Shida Shenghua", url: "https://www.shidashenghua.com" },
      { name: "Haike Chemical Group", url: "https://www.haikegroup.com" },
      { name: "Lixing Chemical", url: "https://www.lixingchem.com" },
      { name: "Tongling Jintai Chemical", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "ACS Energy & Fuels, DEC from ethanol and CO", url: "https://pubs.acs.org/doi/10.1021/ef0101816" },
      { name: "Nature Sci. Reports, DEC from CO2 and ethanol", url: "https://www.nature.com/articles/s41598-024-59070-y" },
      { name: "ACS Sustainable Chem. Eng., Oxidative carbonylation vs alternatives", url: "https://pubs.acs.org/doi/10.1021/acssuschemeng.5b01515" },
    ],
  },
  "diethyl-maleate": {
    routes: [
      "Two-stage esterification: maleic anhydride + ethanol to the monoester, then to the diester",
      "Homogeneous catalysis (sulfuric/p-toluenesulfonic acid)",
      "Heterogeneous catalysis over acidic ion-exchange resins (Amberlyst/Indion)",
    ],
    mainProcess: {
      name: "Acid-catalysed esterification of maleic anhydride with ethanol",
      detail:
        "Diethyl maleate is produced by esterifying maleic anhydride with ethanol in two stages. Maleic anhydride reacts almost instantly with the first equivalent of ethanol to open the ring and give monoethyl maleate; the slower, equilibrium-limited second stage esterifies the remaining carboxyl with a further equivalent of ethanol to the diester, catalysed by a strong acid: maleic anhydride + 2 C2H5OH → (CHCOOC2H5)2 + H2O. Conventional plants use homogeneous sulfuric or p-toluenesulfonic acid, while modern units favour solid acidic ion-exchange resins (Amberlyst-15/36, Indion-170) that avoid neutralisation waste; an excess of ethanol and continuous water removal drive high conversion, and the product is neutralised and distilled.",
    },
    manufacturers: [
      { name: "Tate & Lyle / specialty esters", url: "https://www.tateandlyle.com" },
      { name: "Polynt Group", url: "https://www.polynt.com" },
      { name: "Changzhou Yabang Chemical", url: "https://www.chemicalbook.com" },
      { name: "Anhui Hengxing / Tianyuan", url: "https://www.chemicalbook.com" },
      { name: "Mitsubishi Chemical", url: "https://www.mcgc.com" },
    ],
    sources: [
      { name: "Wikipedia, Diethyl maleate", url: "https://en.wikipedia.org/wiki/Diethyl_maleate" },
      { name: "ScienceDirect, Esterification of maleic acid with ethanol over resins", url: "https://www.sciencedirect.com/science/article/abs/pii/S138151480200086X" },
      { name: "Google Patents US4795824A, Production of dialkyl maleates", url: "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4795824" },
    ],
  },
  "diethyl-malonate": {
    routes: [
      "Classic cyanoacetic-acid route: chloroacetic acid → sodium chloroacetate → sodium cyanoacetate → esterify with ethanol",
      "Cobalt-catalysed alkoxycarbonylation of sodium chloroacetate with CO and ethanol",
      "Esterification of malonic acid with ethanol",
    ],
    mainProcess: {
      name: "Cyanoacetic-acid (malonic ester) route",
      detail:
        "The classic industrial route builds diethyl malonate from chloroacetic acid. Chloroacetic acid is neutralised to sodium chloroacetate and treated with sodium cyanide to give sodium cyanoacetate (displacing chloride with the nitrile). This is then subjected to acidic alcoholysis/esterification: the nitrile and carboxyl are converted in ethanol/sulfuric acid so that the cyano group is ethanolysed to an ester and the acid is esterified, yielding diethyl malonate, CH2(COOC2H5)2, with ammonium salts as by-product. A modern alternative is the cobalt-catalysed alkoxycarbonylation of chloroacetate with carbon monoxide and ethanol, which avoids cyanide. The crude ester is washed, neutralised and fractionally distilled.",
    },
    manufacturers: [
      { name: "Lonza", url: "https://www.lonza.com" },
      { name: "Tessenderlo Group (Kerley)", url: "https://www.tessenderlo.com" },
      { name: "Shandong Hongda / Tianjin Zhongxin", url: "https://www.chemicalbook.com" },
      { name: "Wuxi Yangshan Biochemical", url: "https://www.chemicalbook.com" },
      { name: "Jiangsu Hualun Chemical", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Grokipedia, Diethyl malonate", url: "https://grokipedia.com/page/Diethyl_malonate" },
      { name: "Google Patents CN101525290B, Preparation of diethyl malonate", url: "https://patents.google.com/patent/CN101525290B/en" },
      { name: "Perlego, Malonic ester synthesis overview", url: "https://www.perlego.com/index/chemistry/malonic-ester-synthesis" },
    ],
  },
  "diethyl-phthalate": {
    routes: [
      "Two-stage esterification of phthalic anhydride with ethanol (sulfuric-acid catalysed)",
      "Continuous water removal (azeotropic) to drive conversion",
      "Distillation/polishing to fragrance and pharma grade",
    ],
    mainProcess: {
      name: "Acid-catalysed esterification of phthalic anhydride with ethanol",
      detail:
        "Diethyl phthalate is produced by esterifying phthalic anhydride with ethanol using a concentrated sulfuric acid catalyst. The reaction is two-stage: phthalic anhydride opens rapidly with one equivalent of ethanol to the monoethyl ester, and the slower second esterification converts the remaining carboxyl to the diester, with water removed continuously to push the equilibrium: phthalic anhydride + 2 C2H5OH → C6H4(COOC2H5)2 + H2O. Excess ethanol is recovered and recycled, the acid catalyst is neutralised, and the crude is distilled and polished to the ≥99.5% purity and very low colour (APHA ≤10) demanded by fragrance and pharmaceutical uses. Phthalic anhydride feed itself comes from catalytic air oxidation of o-xylene or naphthalene.",
    },
    manufacturers: [
      { name: "IG Petrochemicals (IGPL)", url: "https://www.igpetro.com" },
      { name: "Thirumalai Chemicals", url: "https://www.thirumalaichemicals.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
      { name: "KLJ Group", url: "https://www.kljindia.com" },
      { name: "Aekyung Petrochemical", url: "https://www.aekyungchem.com" },
    ],
    sources: [
      { name: "Wikipedia, Diethyl phthalate", url: "https://en.wikipedia.org/wiki/Diethyl_phthalate" },
      { name: "ATSDR, Diethyl phthalate production", url: "https://www.atsdr.cdc.gov/toxprofiles/tp73-c4.pdf" },
      { name: "IG Petrochemicals, Diethyl phthalate (DEP)", url: "https://www.igpetro.com/dep" },
    ],
  },
  "dimer-acid": {
    routes: [
      "Clay-catalysed thermal/cationic dimerisation of unsaturated C18 fatty acids (tall oil or soybean fatty acids)",
      "Diels-Alder dimerisation forming a partially unsaturated cyclic C36 di-acid",
      "Molecular distillation to separate monomer, dimer and trimer/polymer fractions; optional hydrogenation",
    ],
    mainProcess: {
      name: "Clay-catalysed dimerisation of tall oil fatty acid",
      detail:
        "Dimer acid is made by dimerising unsaturated C18 fatty acids, typically tall oil fatty acid (TOFA, oleic/linoleic), by heat-bodying them at about 230-260 °C under pressure in the presence of an acidic montmorillonite clay catalyst. The clay promotes cationic and Diels-Alder coupling of the fatty chains, building predominantly a C36 di-carboxylic acid (with a partially unsaturated six-membered ring) alongside trimer and higher oligomers. After reaction the clay is filtered off and the mixture is separated by wiped-film/molecular distillation into monomer, dimer and trimer cuts; the dimer fraction may be hydrogenated for colour and oxidative stability. A drawback of the clay route is that the spent catalyst is not recyclable, so zeolite-catalysed processes on plant-based feeds are emerging.",
    },
    manufacturers: [
      { name: "Croda International", url: "https://www.croda.com" },
      { name: "Kraton / Kraton Chemical (now part of DL Holdings)", url: "https://www.kraton.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "Oleon", url: "https://www.oleon.com" },
      { name: "Florachem", url: "https://www.florachem.com" },
    ],
    sources: [
      { name: "Wikipedia, Dimer acid", url: "https://en.wikipedia.org/wiki/Dimer_acid" },
      { name: "ScienceDirect, Advanced process for structurally selective dimer acids", url: "https://www.sciencedirect.com/science/article/abs/pii/S0926669020300480" },
      { name: "ScienceDirect Topics, Dimer acid overview", url: "https://www.sciencedirect.com/topics/engineering/dimer-acid" },
    ],
  },
  edta: {
    routes: [
      "Single-step alkaline cyanomethylation: ethylenediamine + formaldehyde + sodium cyanide (Strecker-type) to tetrasodium EDTA",
      "Two-step route: ethylenediamine + HCN + formaldehyde to the tetranitrile, then alkaline hydrolysis",
      "Acidification of the sodium salt to the free EDTA acid",
    ],
    mainProcess: {
      name: "Alkaline cyanomethylation of ethylenediamine",
      detail:
        "The dominant industrial route is the alkaline cyanomethylation (a Strecker-type carboxymethylation) of ethylenediamine. Ethylenediamine reacts with formaldehyde and sodium cyanide under alkaline conditions so that each of the four N-H bonds is converted to an -CH2COO⁻ group, giving tetrasodium EDTA in over 90% yield (sodium hydroxide hydrolyses the intermediate nitriles to carboxylates, releasing ammonia). In the two-step variant, ethylenediamine, hydrogen cyanide and formaldehyde first give (ethylenedinitrilo)tetraacetonitrile in high yield, which is isolated and then hydrolysed with sodium hydroxide to pure tetrasodium EDTA. Acidifying the sodium salt precipitates the free acid (H4EDTA). Because cyanide is used, the plants are tightly regulated for handling and effluent.",
    },
    manufacturers: [
      { name: "Nouryon (Dissolvine)", url: "https://www.nouryon.com" },
      { name: "BASF (Trilon)", url: "https://www.basf.com" },
      { name: "Kemira", url: "https://www.kemira.com" },
      { name: "Mitsubishi Chemical", url: "https://www.mcgc.com" },
      { name: "Jiangsu Huaihe / Hubei Xinghong (chelates)", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Chemcess, EDTA properties, production and uses", url: "https://chemcess.com/ethylenediaminetetraacetic-acid-edta-properties-production-and-uses/" },
      { name: "Google Patents EP0085277A1, Production of EDTA", url: "https://patents.google.com/patent/EP0085277A1/en" },
      { name: "Google Patents CN1388113A, EDTA via HCN synthesis gas", url: "https://patents.google.com/patent/CN1388113A/en" },
    ],
  },
  "guar-gum": {
    routes: [
      "Dry milling: split guar seed, separate husk and germ, then grind the gum-rich endosperm",
      "Roasting/differential attrition, sieving and polishing of the refined splits to powder",
      "Hydration/flaking for food grade; derivatisation to guar derivatives (HPG, CMHPG, cationic guar)",
    ],
    mainProcess: {
      name: "Seed splitting and endosperm milling",
      detail:
        "Guar gum is the milled endosperm of the guar bean (Cyamopsis tetragonoloba), a galactomannan polysaccharide. Cleaned guar seed is processed (often with heating) to loosen and remove the fibrous husk and the protein-rich germ, typically by splitting in a horizontal burr/roller mill and separating the germ in a pin mill with screening, to leave the gum-bearing 'splits' (refined endosperm halves). The splits are then ground and polished into powder, with mesh/particle size set by repeated grinding, sieving and classification. For food grade, the splits are soaked/pre-hydrated, flaked, ground, dried and screened to the required viscosity and granulation; many grades are further derivatised (e.g. hydroxypropyl or cationic guar) for oilfield and personal-care use. India (mainly Rajasthan) accounts for the bulk of world output.",
    },
    manufacturers: [
      { name: "Vikas WSP", url: "https://www.vikaswsp.com" },
      { name: "Hindustan Gum & Chemicals", url: "https://www.hindustangum.com" },
      { name: "Premcem Gums", url: "https://www.premcemgums.com" },
      { name: "Rama Gum Industries", url: "https://ramagum.com" },
      { name: "Lamberti", url: "https://www.lamberti.com" },
    ],
    sources: [
      { name: "Wikipedia, Guar gum", url: "https://en.wikipedia.org/wiki/Guar_gum" },
      { name: "Agrogums, Step-by-step guar gum powder process", url: "https://www.agrogums.com/blogs/from-field-to-final-product-the-step-by-step-process-of-making-guar-gum-powder" },
      { name: "ScienceDirect, Dehulling of guar seeds", url: "https://www.sciencedirect.com/science/article/abs/pii/S0960308516300207" },
    ],
  },
  "hydrogenated-castor-oil-hco": {
    routes: [
      "Catalytic hydrogenation of bleached castor oil over a nickel catalyst under vacuum",
      "Saturation of ricinoleic acid double bonds to 12-hydroxystearate (wax-like solid)",
      "Cooling, filtration of catalyst and flaking of the product",
    ],
    mainProcess: {
      name: "Nickel-catalysed hydrogenation of castor oil",
      detail:
        "Hydrogenated castor oil (castor wax) is produced by hydrogenating bleached castor oil. The oil is heated under vacuum to around 160 °C with a nickel catalyst, and hydrogen is sparged in with agitation; the carbon-carbon double bonds of the ricinoleic-acid chains are saturated, converting the triglyceride of ricinoleic acid into the triglyceride of 12-hydroxystearic acid, a hard, wax-like solid melting near 86 °C. When the target degree of hydrogenation (iodine value) is reached the hydrogen feed is stopped, the batch is cooled to ~100 °C, the nickel catalyst is filtered off (and largely reclaimed), and the product is flaked. The retained hydroxyl groups give HCO its characteristic gelling and structuring behaviour in lubricants, cosmetics and coatings.",
    },
    manufacturers: [
      { name: "Jayant Agro-Organics", url: "https://www.jayantagro.com" },
      { name: "NK Proteins", url: "https://www.nkproteins.com" },
      { name: "Itoh Oil Chemicals", url: "https://www.itoh-oil.co.jp" },
      { name: "Thai Castor Oil Industries", url: "https://www.thaicastoroil.com" },
      { name: "Gokul Agro Resources", url: "https://www.gokulagro.com" },
    ],
    sources: [
      { name: "Jayant Agro-Organics, Hydrogenated Castor Oil (HCO)", url: "https://www.jayantagro.com/products/hydrogenated-castor-oil--hco-/30" },
      { name: "Google Patents KR101655764B1, Nickel catalyst & hydrogenated castor oil", url: "https://patents.google.com/patent/KR101655764B1/en" },
      { name: "Grand View Research, Castor oil & derivatives market", url: "https://www.grandviewresearch.com/industry-analysis/castor-oil-derivatives-industry" },
    ],
  },
  "lauric-acid-rspo-mb": {
    routes: [
      "High-pressure hydrolytic splitting of lauric oils (coconut / palm-kernel) to crude mixed fatty acids and glycerol",
      "Fractional distillation to isolate the C12 (lauric) cut; optional hydrogenation/redistillation to high purity",
      "RSPO Mass Balance supply-chain handling so certified and conventional volumes are reconciled by quantity",
    ],
    mainProcess: {
      name: "Fat splitting and fractionation under RSPO Mass Balance",
      detail:
        "Lauric acid is an oleochemical from lauric oils, coconut and palm-kernel oil, which are rich in C12. The triglycerides are hydrolysed ('fat splitting') with water at high temperature (~250 °C) and pressure (e.g. a Colgate-Emery column), breaking them into crude mixed fatty acids and glycerol. The mixed acids are then separated by fractional distillation into C8, C10, C12, C14 and heavier cuts; the lauric (C12) cut is taken and, by grade, further distilled or hydrogenated to high purity (e.g. 99%). The 'RSPO MB' designation refers to the Roundtable on Sustainable Palm Oil Mass Balance supply-chain model: certified sustainable palm-kernel feedstock is administratively mixed with conventional material, and the certified volume sold is matched to the certified volume purchased, guaranteeing that an equivalent quantity was produced sustainably, without requiring full physical segregation.",
    },
    manufacturers: [
      { name: "Wilmar International", url: "https://www.wilmar-international.com" },
      { name: "KLK Oleo", url: "https://www.klkoleo.com" },
      { name: "IOI Oleochemical", url: "https://www.ioioleo.de" },
      { name: "Musim Mas", url: "https://www.musimmas.com" },
      { name: "Emery Oleochemicals", url: "https://www.emeryoleo.com" },
    ],
    sources: [
      { name: "RSPO, Supply chain models (Mass Balance)", url: "https://rspo.org/as-an-organisation/certification/supply-chains/" },
      { name: "Wilmar, Lauric acid", url: "https://www.wilmar-international.com/oleochemicals/products/home-care/lauric-acid-98" },
      { name: "Colonial Chemical, Palm oil & RSPO Mass Balance", url: "https://colonialchem.com/company/palm-oil/" },
    ],
  },
  "paraffin-wax": {
    routes: [
      "Solvent dewaxing (MEK/toluene) of vacuum-distillate lube oil to recover slack wax",
      "De-oiling of slack wax by sweating or solvent extraction to set oil content",
      "Hydrofinishing to remove colour, odour and impurities (semi-/fully-refined wax)",
    ],
    mainProcess: {
      name: "Solvent dewaxing and hydrofinishing of slack wax",
      detail:
        "Paraffin wax is recovered from crude oil refining. After atmospheric and vacuum distillation, the waxy lube-oil distillate is solvent-dewaxed: a solvent such as MEK (methyl ethyl ketone) with toluene is mixed in and the stream is chilled so wax crystallises, then filtered off, yielding 'slack wax' that still holds roughly 5-30% oil. The slack wax is de-oiled (by controlled 'sweating' or further solvent extraction) to set the oil content and hardness, then hydrofinished, treated with hydrogen at high temperature and pressure to remove sulfur, nitrogen, colour bodies and polar compounds, to give odourless, white semi-refined or fully refined paraffin wax. Fischer-Tropsch (gas-to-liquids) wax from synthesis gas is an alternative, very pure source.",
    },
    manufacturers: [
      { name: "ExxonMobil", url: "https://www.exxonmobil.com" },
      { name: "Sasol", url: "https://www.sasol.com" },
      { name: "Shell", url: "https://www.shell.com" },
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "The International Group (IGI Wax)", url: "https://igiwax.com" },
    ],
    sources: [
      { name: "Hydrocarbon Processing, Paraffin wax production process", url: "https://www.hydrocarbonprocessing.com/news/2024/07/digital-feature-paraffin-wax-a-detailed-look-at-its-production-process/" },
      { name: "Petronaft, Paraffin wax production process", url: "https://www.petronaftco.com/paraffin-wax-production-process/" },
      { name: "Grand View Research, Paraffin wax market", url: "https://www.grandviewresearch.com/industry-analysis/paraffin-wax-market" },
    ],
  },
  "propionic-anhydride": {
    routes: [
      "Acylation of propionic acid with ketene (giving propionic anhydride plus acetic acid)",
      "Generation and reaction of methylketene from propionic acid pyrolysis",
      "Direct dehydration of propionic acid / reactive distillation",
    ],
    mainProcess: {
      name: "Ketene route from propionic acid",
      detail:
        "Propionic anhydride is produced industrially via ketene chemistry, analogous to acetic anhydride. Ketene (CH2=C=O), generated by high-temperature dehydration/cracking (commonly of acetic acid at ~700-780 °C), is absorbed into propionic acid, where it acylates the carboxyl to give the mixed/ symmetric anhydride; through anhydride exchange the system yields propionic anhydride, (CH3CH2CO)2O, with acetic acid as the co-product. Alternatively, methylketene generated from propionic acid itself can be reacted with further propionic acid. Modern plants run the absorption/reactive-distillation under conditions tuned to minimise tar and coloured by-products, and the anhydride is purified by fractional distillation.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
      { name: "Daicel Corporation", url: "https://www.daicel.com" },
      { name: "Perstorp", url: "https://www.perstorp.com" },
      { name: "Hubei Greenhome / Jiangsu producers", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Google Patents US2235561A, Methyl ketene and propionic anhydride (Eastman Kodak)", url: "https://patents.google.com/patent/US2235561A/en" },
      { name: "nbinno, Chemistry of propionic anhydride: synthesis & reactions", url: "https://www.nbinno.com/article/other-organic-chemicals/chemistry-propionic-anhydride-synthesis-reactions-hi" },
      { name: "Google Patents US7553991, Producing carboxylic acid anhydrides", url: "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7553991" },
    ],
  },
  "sodium-methyl-cocoyl-taurate": {
    routes: [
      "Make the precursor N-methyltaurine (react sodium isethionate with methylamine, or via taurine)",
      "Schotten-Baumann acylation: react coconut fatty acid chloride with N-methyltaurine under alkali",
      "Alternative direct amidation of coconut fatty acid with N-methyltaurine using a boric-acid catalyst",
    ],
    mainProcess: {
      name: "Acylation of N-methyltaurine with coconut fatty acid chloride",
      detail:
        "Sodium methyl cocoyl taurate (SMCT) is a mild anionic taurate surfactant. The key intermediate, N-methyltaurine, is first prepared (for example by reacting sodium isethionate with methylamine). It is then N-acylated with the fatty acyl group of coconut oil: in the common Schotten-Baumann route, N-methyltaurine is dissolved in aqueous caustic/alcohol and coconut fatty acid chloride is added under cooling and alkali so the amine is acylated to the amide, RCON(CH3)CH2CH2SO3Na, with sodium chloride as by-product; the product is then salted, filtered and dried to a white powder/paste. A solvent-free variant condenses coconut fatty acid directly with N-methyltaurine using a boric-acid catalyst at ~200 °C while distilling off water. SMCT is prized for its mildness and creamy foam in facial cleansers and syndet bars.",
    },
    manufacturers: [
      { name: "Clariant (Hostapon)", url: "https://www.clariant.com" },
      { name: "Nikko Chemicals (Nikkol)", url: "https://www.nikkol.co.jp" },
      { name: "Zschimmer & Schwarz", url: "https://www.zschimmer-schwarz.com" },
      { name: "Galaxy Surfactants", url: "https://www.galaxysurfactants.com" },
      { name: "Innospec", url: "https://www.innospecinc.com" },
    ],
    sources: [
      { name: "Cosmetics & Toiletries, Sodium methyl cocoyl taurate", url: "https://www.cosmeticsandtoiletries.com/research/literature-data/article/21835802/sodium-methyl-cocoyl-taurate-biosurfactant-in-action" },
      { name: "CIR, Safety assessment of alkyl taurate amides and taurate salts", url: "https://www.cir-safety.org/sites/default/files/taurat122015FR.pdf" },
      { name: "SpecialChem, Sodium methyl cocoyl taurate (INCI)", url: "https://www.specialchem.com/cosmetics/inci-ingredients/sodium-methyl-cocoyl-taurate" },
    ],
  },
  "tris-nonylphenyl-phosphite-tnpp": {
    routes: [
      "Reaction of phosphorus trichloride (PCl3) with a molar excess of nonylphenol, releasing HCl",
      "Thin-film (short-path) distillation to strip residual nonylphenol",
      "Optional amine/TEA-amine stabilisation to control acidity and hydrolytic stability",
    ],
    mainProcess: {
      name: "Esterification of PCl3 with excess nonylphenol",
      detail:
        "Tris(nonylphenyl) phosphite is a phosphite antioxidant/secondary stabiliser made by esterifying phosphorus trichloride with nonylphenol. Three equivalents of p-nonylphenol react with PCl3, with each P-Cl bond displaced by a phenol to form a P-O-aryl bond and liberate hydrogen chloride: PCl3 + 3 C9H19C6H4OH → (C9H19C6H4O)3P + 3 HCl. A molar excess of nonylphenol (typically >5-6%) is used to force the reaction to completion and obtain a low acid number; the evolved HCl is absorbed/scrubbed. The excess nonylphenol is then removed by thin-film (short-path) distillation, and the product is often stabilised with a trace of amine to suppress hydrolysis. TNPP protects PVC, polyolefins and rubber against thermal/oxidative degradation during processing, usually at 0.05-3%.",
    },
    manufacturers: [
      { name: "SI Group (incl. former Addivant)", url: "https://www.siigroup.com" },
      { name: "Dover Chemical Corporation", url: "https://www.doverchem.com" },
      { name: "Songwon Industrial", url: "https://www.songwon.com" },
      { name: "Galata Chemicals", url: "https://www.galatachemicals.com" },
      { name: "Sterling Auxiliaries", url: "https://www.sterlingauxiliaries.com" },
    ],
    sources: [
      { name: "Google Patents US5532401A, Production of tris(nonylphenyl) phosphite", url: "https://patents.google.com/patent/US5532401A/en" },
      { name: "MarketsandMarkets, TNPP companies", url: "https://www.marketsandmarkets.com/ResearchInsight/tris-nonylphenyl-phosphite-market.asp" },
      { name: "ChemicalBook, Tris(nonylphenyl) phosphite", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1266308.htm" },
    ],
  },

  "zinc-oxide": {
    routes: [
      "Indirect (French) process, vaporise/oxidise zinc metal",
      "Direct (American) process, carbothermic reduction of zinc ore, then oxidation",
      "Wet chemical process from zinc salt solutions (fine/active grades)",
    ],
    mainProcess: {
      name: "Indirect (French) process",
      detail:
        "Most pigment- and rubber-grade zinc oxide is made by the indirect (French) process. High-grade zinc metal is melted and boiled, and the zinc vapour is drawn into a combustion chamber where it burns in air to white zinc oxide: 2 Zn + O2 → 2 ZnO. The fume is cooled and collected in bag filters, then classified by particle size. The direct (American) process instead reduces zinc ore/secondary oxide with coke to zinc vapour and oxidises it in the same step, giving a less pure product; very fine 'active' grades are precipitated wet from zinc salts.",
    },
    manufacturers: [
      { name: "EverZinc", url: "https://www.everzinc.com" },
      { name: "Zochem", url: "https://www.zochem.com" },
      { name: "Rubamin", url: "https://www.rubamin.com" },
      { name: "Brüggemann", url: "https://www.brueggemann.com" },
    ],
    sources: [
      { name: "Wikipedia, Zinc oxide (production)", url: "https://en.wikipedia.org/wiki/Zinc_oxide" },
      { name: "EverZinc, Zinc oxide", url: "https://www.everzinc.com/our-products/zinc-oxide/" },
      { name: "Britannica, Zinc processing", url: "https://www.britannica.com/technology/zinc-processing" },
    ],
  },

  "soda-ash-light": {
    routes: [
      "Solvay (ammonia-soda) synthetic process from brine + limestone",
      "Refining of natural trona ore (Wyoming, Türkiye)",
      "Hou's (modified Solvay) process co-producing ammonium chloride",
    ],
    mainProcess: {
      name: "Solvay ammonia-soda process / trona refining",
      detail:
        "Soda ash (sodium carbonate) is made synthetically by the Solvay process and naturally from trona. In the Solvay process, ammoniated brine is carbonated with CO2 (from limestone calcination) to precipitate sodium bicarbonate, which is filtered and calcined to light soda ash (2 NaHCO3 → Na2CO3 + CO2 + H2O); ammonia is recovered with lime. Natural soda ash is made by mining trona, then dissolving, filtering, crystallising and calcining it. 'Light' ash is the low-bulk-density calcined powder; densification gives 'dense' ash. About three-quarters of world supply is synthetic.",
    },
    manufacturers: [
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "WE Soda (world's largest)", url: "https://wesoda.com" },
      { name: "Tata Chemicals", url: "https://www.tatachemicals.com" },
      { name: "Şişecam", url: "https://www.sisecam.com" },
      { name: "Nirma", url: "https://www.nirma.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Solvay process", url: "https://en.wikipedia.org/wiki/Solvay_process" },
      { name: "C&EN, Can synthetic soda ash survive?", url: "https://cen.acs.org/business/specialty-chemicals/synthetic-soda-ash-survive/101/i7" },
      { name: "Solvay, Soda Solvay", url: "https://www.solvay.com/en/brands/soda-solvay" },
    ],
  },

  "ammonium-chloride": {
    routes: [
      "By-product of the dual-process (Hou's) soda-ash manufacture",
      "Direct neutralisation of ammonia with hydrochloric acid",
      "Reaction of ammonium sulfate with sodium chloride",
    ],
    mainProcess: {
      name: "Soda-ash co-product / ammonia neutralisation",
      detail:
        "Ammonium chloride is produced both as a co-product and on purpose. In the modified Solvay (Hou's) process for soda ash, the mother liquor rich in ammonium chloride is cooled and salted out with sodium chloride so that NH4Cl crystallises while ammonia is retained, giving fertiliser-grade product. Technical and pharmaceutical grades are made by directly neutralising ammonia with hydrochloric acid (NH3 + HCl → NH4Cl), then evaporating and crystallising. It is used in fertilisers, dry-cell batteries, galvanising flux and as an expectorant.",
    },
    manufacturers: [
      { name: "Central Glass", url: "https://www.cgco.co.jp" },
      { name: "Tuticorin Alkali Chemicals & Fertilisers", url: "https://www.tacfert.in" },
      { name: "BASF", url: "https://www.basf.com" },
    ],
    sources: [
      { name: "Wikipedia, Ammonium chloride", url: "https://en.wikipedia.org/wiki/Ammonium_chloride" },
      { name: "Wikipedia, Solvay process (Hou's process)", url: "https://en.wikipedia.org/wiki/Solvay_process" },
      { name: "ChemicalBook, Ammonium chloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852160.htm" },
    ],
  },

  "sodium-sulphate-anhydrous": {
    routes: [
      "Recovery/refining of natural sodium sulfate (mirabilite/thenardite brines)",
      "By-product of the Mannheim HCl process and of rayon/resorcinol/battery production",
    ],
    mainProcess: {
      name: "Natural brine recovery / synthetic by-product",
      detail:
        "Sodium sulfate is produced naturally and as a by-product. Natural production extracts mirabilite (Glauber's salt, Na2SO4·10H2O) from brine lakes and deposits; the solution is cooled to crystallise the decahydrate, which is dehydrated and dried to anhydrous Na2SO4. Large synthetic volumes arise as a by-product where sodium and sulfate ions combine, e.g. the Mannheim process (2 NaCl + H2SO4 → Na2SO4 + 2 HCl), and rayon, resorcinol, chromate and battery manufacture, where the salt is recovered, purified and crystallised. It is mainly used in detergents and glass.",
    },
    manufacturers: [
      { name: "Searles Valley Minerals", url: "https://www.svminerals.com" },
      { name: "Grupo Crimidesa", url: "https://www.crimidesa.com" },
      { name: "Cooper Natural Resources", url: "https://www.coopernr.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium sulfate (production)", url: "https://en.wikipedia.org/wiki/Sodium_sulfate" },
      { name: "USGS, Sodium sulfate (PDF)", url: "https://pubs.usgs.gov/periodicals/mcs2023/mcs2023-sodium-sulfate.pdf" },
      { name: "Grupo Crimidesa, Sodium sulphate", url: "https://www.crimidesa.com/en/sodium-sulphate/" },
    ],
  },

  "magnesium-sulphate-heptahydrate": {
    routes: [
      "Reaction of magnesium oxide/hydroxide or magnesite with sulfuric acid",
      "Crystallisation/refining of natural epsomite and kieserite brines",
    ],
    mainProcess: {
      name: "Magnesia/magnesite + sulfuric acid",
      detail:
        "Magnesium sulfate heptahydrate (Epsom salt) is commonly made by reacting a magnesium source, magnesium oxide/hydroxide, magnesite (MgCO3) or dolomite, with sulfuric acid: MgO + H2SO4 + 6 H2O → MgSO4·7H2O. The solution is purified, concentrated and cooled so the heptahydrate crystallises; the crystals are centrifuged and dried at controlled temperature to keep the seven waters of hydration. It is also refined from natural epsomite/kieserite and salt-lake brines. Uses include fertilisers, animal feed, bath salts and pharmaceuticals.",
    },
    manufacturers: [
      { name: "K+S", url: "https://www.kpluss.com" },
      { name: "Premier Magnesia (Giles Chemical)", url: "https://www.premiermagnesia.com" },
      { name: "PQ / Ecovyst", url: "https://www.ecovyst.com" },
    ],
    sources: [
      { name: "Wikipedia, Magnesium sulfate", url: "https://en.wikipedia.org/wiki/Magnesium_sulfate" },
      { name: "K+S, Products", url: "https://www.kpluss.com/en-us/products/" },
      { name: "ChemicalBook, Magnesium sulfate heptahydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7186761.htm" },
    ],
  },

  "aluminium-sulphate-ar-sap": {
    routes: [
      "Digestion of alumina hydrate / bauxite / clay with sulfuric acid",
      "Concentration and casting/crystallisation to slabs or solution",
    ],
    mainProcess: {
      name: "Alumina + sulfuric acid digestion",
      detail:
        "Aluminium sulfate ('alum'), the main coagulant in water treatment, is made by reacting an alumina source, aluminium hydroxide (purest), bauxite or kaolin clay, with sulfuric acid: 2 Al(OH)3 + 3 H2SO4 → Al2(SO4)3 + 6 H2O. The reaction runs hot in acid-brick reactors; the slurry is settled to remove insolubles and the clarified liquor is concentrated and sold as solution or cast/solidified into slabs, lumps or ground product (~17% Al2O3). Iron-free grades use refined alumina hydrate. It is used in water/wastewater treatment and paper sizing.",
    },
    manufacturers: [
      { name: "Kemira", url: "https://www.kemira.com" },
      { name: "USALCO", url: "https://www.usalco.com" },
      { name: "Feralco Group", url: "https://www.feralco.com" },
      { name: "Chemtrade Logistics", url: "https://www.chemtradelogistics.com" },
    ],
    sources: [
      { name: "Wikipedia, Aluminium sulfate", url: "https://en.wikipedia.org/wiki/Aluminium_sulfate" },
      { name: "USALCO, Aluminum sulfate", url: "https://www.usalco.com/products/aluminum-sulfate/" },
      { name: "Kemira, Coagulants", url: "https://www.kemira.com/products/coagulants/" },
    ],
  },

  "ferrous-sulphate-heptahydrate": {
    routes: [
      "By-product of the sulfate-process titanium dioxide industry (copperas)",
      "By-product of steel pickling with sulfuric acid",
      "Dissolution of scrap iron in sulfuric acid",
    ],
    mainProcess: {
      name: "TiO2 / steel-pickle by-product recovery",
      detail:
        "Ferrous sulfate heptahydrate (copperas) is mostly recovered as a by-product. In the sulfate-process production of titanium dioxide, large amounts of FeSO4·7H2O crystallise from the spent liquor and are filtered off; sulfuric-acid pickling of steel likewise yields liquor rich in ferrous sulfate. The crude liquor is purified and cooled so the green heptahydrate crystallises, then centrifuged and dried at low temperature to avoid oxidation. It is also made directly by dissolving scrap iron in dilute sulfuric acid (Fe + H2SO4 → FeSO4 + H2). Uses include water treatment, cement chromate reduction, fertilisers and feed.",
    },
    manufacturers: [
      { name: "Kronos Worldwide", url: "https://www.kronostio2.com" },
      { name: "Venator Materials", url: "https://www.venatorcorp.com" },
      { name: "Pencco", url: "https://www.pencco.com" },
    ],
    sources: [
      { name: "Wikipedia, Iron(II) sulfate", url: "https://en.wikipedia.org/wiki/Iron(II)_sulfate" },
      { name: "Crown Technology, Ferrous sulfate", url: "https://www.crowntechnology.net/ferrous-sulfate/" },
      { name: "ScienceDirect, Ferrous sulphate (copperas)", url: "https://www.sciencedirect.com/topics/engineering/ferrous-sulphate" },
    ],
  },

  "sodium-thiosulphate-5-h2o-ar-acs-sap": {
    routes: [
      "Boiling sodium sulfite solution with sulfur",
      "Recovery from sulfur-dye / sodium-sulfide and flue-gas desulfurisation liquors",
    ],
    mainProcess: {
      name: "Sodium sulfite + sulfur",
      detail:
        "Sodium thiosulfate pentahydrate ('hypo') is made by boiling a sodium sulfite solution with elemental sulfur, which dissolves and adds to the sulfite: Na2SO3 + S → Na2S2O3. The filtered solution is concentrated and cooled so the pentahydrate (Na2S2O3·5H2O) crystallises, then it is centrifuged and dried gently. It is also recovered as a by-product of sodium-sulfide/sulfur-dye manufacture and of some flue-gas desulfurisation processes. Uses include photographic fixing, chlorine dechlorination in water treatment, gold leaching and analytical chemistry.",
    },
    manufacturers: [
      { name: "Esseco Group", url: "https://www.esseco.it" },
      { name: "Calabrian Corporation", url: "https://www.calabriancorp.com" },
      { name: "Hydrite Chemical", url: "https://www.hydrite.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium thiosulfate", url: "https://en.wikipedia.org/wiki/Sodium_thiosulfate" },
      { name: "ChemicalBook, Sodium thiosulfate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5854234.htm" },
      { name: "Calabrian, Sodium thiosulfate", url: "https://www.calabriancorp.com/products/sodium-thiosulfate" },
    ],
  },

  "potassium-persulphate": {
    routes: [
      "Electrolytic oxidation of potassium bisulfate/sulfate solution",
      "Metathesis from ammonium persulfate + potassium salt",
    ],
    mainProcess: {
      name: "Electrolytic persulfate synthesis",
      detail:
        "Potassium persulfate (potassium peroxydisulfate) is made electrochemically. A cold, concentrated solution of potassium bisulfate/sulfate (often via ammonium persulfate as the primary product) is electrolysed at a smooth platinum anode at high current density, where sulfate ions are oxidised and couple to form the peroxydisulfate ion: 2 HSO4- → S2O8(2-) + 2 H+ + 2 e-. The relatively insoluble potassium salt crystallises out (directly, or by adding a potassium salt to ammonium persulfate liquor), and is filtered, washed and dried at low temperature. It is used as a radical initiator for emulsion polymerisation and as an oxidiser/etchant.",
    },
    manufacturers: [
      { name: "United Initiators", url: "https://www.united-initiators.com" },
      { name: "Evonik Industries", url: "https://www.evonik.com" },
      { name: "ADEKA Corporation", url: "https://www.adeka.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Potassium persulfate", url: "https://en.wikipedia.org/wiki/Potassium_persulfate" },
      { name: "United Initiators, Persulfates", url: "https://www.united-initiators.com/en/products/persulfates" },
      { name: "ChemicalBook, Potassium persulfate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB2854095.htm" },
    ],
  },

  "manganese-sulphate-monohydrate": {
    routes: [
      "Dissolving manganese ore / MnO2 in sulfuric acid (with a reductant)",
      "By-product of hydroquinone and other MnO2-oxidation processes",
    ],
    mainProcess: {
      name: "Manganese ore + sulfuric acid leaching",
      detail:
        "Manganese sulfate monohydrate is made by leaching a manganese source with sulfuric acid. Reduced manganese ore (or MnO2 with a reducing agent such as iron(II) or organic matter) is digested in sulfuric acid to give manganese sulfate solution: MnO + H2SO4 → MnSO4 + H2O. The liquor is purified to remove iron, heavy metals and other impurities (precipitation/filtration), then evaporated and crystallised; above ~27 °C the stable phase is the monohydrate MnSO4·H2O, which is centrifuged and dried. It is widely used as a micronutrient fertiliser/feed additive and, in high-purity form, as a precursor for lithium-ion battery cathodes.",
    },
    manufacturers: [
      { name: "Vibrantz Technologies", url: "https://www.vibrantz.com" },
      { name: "Rech Chemical", url: "https://www.rech-chem.com" },
      { name: "Prince (Vibrantz)", url: "https://www.vibrantz.com" },
    ],
    sources: [
      { name: "Wikipedia, Manganese(II) sulfate", url: "https://en.wikipedia.org/wiki/Manganese(II)_sulfate" },
      { name: "ChemicalBook, Manganese sulfate monohydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4485392.htm" },
      { name: "Mordor Intelligence, Manganese sulfate market", url: "https://www.mordorintelligence.com/industry-reports/manganese-sulphate-market" },
    ],
  },

  "manganese-carbonate": {
    routes: [
      "Precipitation from a manganese sulfate/chloride solution with soda ash or bicarbonate",
      "Beneficiation of natural rhodochrosite ore (lower grade)",
    ],
    mainProcess: {
      name: "Precipitation from manganese salt + carbonate",
      detail:
        "Manganese carbonate is made by precipitating a purified manganese-salt solution with an alkali carbonate. A manganese sulfate (or chloride) liquor, itself from acid leaching of manganese ore, is reacted with sodium carbonate or sodium bicarbonate, precipitating insoluble manganese carbonate: MnSO4 + Na2CO3 → MnCO3 + Na2SO4. The pink-to-brown precipitate is filtered, washed free of soluble salts and dried under controlled conditions to limit oxidation. It is used as a micronutrient, a ceramic/ferrite raw material, and a precursor for other manganese chemicals.",
    },
    manufacturers: [
      { name: "Vibrantz Technologies", url: "https://www.vibrantz.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
    ],
    sources: [
      { name: "Wikipedia, Manganese(II) carbonate", url: "https://en.wikipedia.org/wiki/Manganese(II)_carbonate" },
      { name: "ChemicalBook, Manganese carbonate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3852159.htm" },
      { name: "American Elements, Manganese carbonate", url: "https://www.americanelements.com/manganese-carbonate-598-62-9" },
    ],
  },

  "calcium-hypochlorite-hydrated": {
    routes: [
      "Chlorination of lime slurry (calcium process) to high-test hypochlorite (HTH)",
      "Sodium process via NaOCl, then double decomposition with lime/CaCl2",
    ],
    mainProcess: {
      name: "Chlorination of lime slurry",
      detail:
        "Calcium hypochlorite (HTH, 'bleaching powder' at lower strength) is made by chlorinating hydrated lime. In the calcium process a slurry of slaked lime (and caustic/soda) is reacted with chlorine gas under controlled temperature to form calcium hypochlorite, which crystallises as a dibasic/hydrated salt: 2 Ca(OH)2 + 2 Cl2 → Ca(OCl)2 + CaCl2 + 2 H2O (net). The product is filtered, dried and granulated to ~65-70% available chlorine. The sodium process instead makes sodium hypochlorite first and then converts it with lime/calcium chloride. It is the main solid pool/drinking-water disinfectant.",
    },
    manufacturers: [
      { name: "Olin Corporation", url: "https://www.olin.com" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Nippon Soda", url: "https://www.nippon-soda.co.jp" },
      { name: "Tosoh Corporation", url: "https://www.tosoh.com" },
    ],
    sources: [
      { name: "Wikipedia, Calcium hypochlorite", url: "https://en.wikipedia.org/wiki/Calcium_hypochlorite" },
      { name: "ChemAnalyst, Calcium hypochlorite market", url: "https://www.chemanalyst.com/industry-report/calcium-hypochlorite-market-697" },
      { name: "Mordor Intelligence, Calcium hypochlorite market", url: "https://www.mordorintelligence.com/industry-reports/calcium-hypochlorite-market" },
    ],
  },

  "sodium-hydro-sulphite": {
    routes: [
      "Sodium formate process (formate + SO2 + caustic in methanol), modern standard",
      "Zinc-dust process (older)",
      "Sodium amalgam / electrolytic routes (minor)",
    ],
    mainProcess: {
      name: "Sodium formate process",
      detail:
        "Sodium dithionite (sodium hydrosulfite), a powerful reducing/bleaching agent, is made mainly by the sodium formate process. Sodium formate is dissolved in aqueous methanol with sodium hydroxide and reacted with sulfur dioxide; the formate reduces the SO2 and anhydrous sodium dithionite precipitates from the methanol medium (2 SO2 + HCOONa + NaOH → Na2S2O4 + CO2 + H2O). The solid is filtered, dried and stabilised. The older zinc-dust process reduces SO2 with zinc and then converts the zinc dithionite with soda. It is used in vat/sulfur dye reduction, pulp and textile bleaching.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Mitsubishi Gas Chemical", url: "https://www.mgc.co.jp/eng/" },
      { name: "Esseco Group", url: "https://www.esseco.it" },
    ],
    sources: [
      { name: "Wikipedia, Sodium dithionite", url: "https://en.wikipedia.org/wiki/Sodium_dithionite" },
      { name: "Rongda Chemical, Sodium dithionite production", url: "https://www.rongdachemical.com/blog/properties-production-sodium-dithionite/" },
      { name: "FreePatentsOnline, BASF sodium dithionite process", url: "https://www.freepatentsonline.com/4017593.html" },
    ],
  },

  "sodium-sulphite-other-details-as-per": {
    routes: [
      "Absorption of sulfur dioxide into sodium carbonate/hydroxide solution",
      "Two-stage soda-ash carbonation via sodium bisulfite, then neutralisation",
    ],
    mainProcess: {
      name: "Sulfur dioxide absorption in soda solution",
      detail:
        "Sodium sulfite is made by absorbing sulfur dioxide into a sodium carbonate (or hydroxide) solution. SO2 is first sparged into soda-ash liquor to form sodium bisulfite (Na2CO3 + 2 SO2 + H2O → 2 NaHSO3 + CO2); adding a further equivalent of soda ash or caustic then neutralises the bisulfite to the neutral sulfite (NaHSO3 + NaOH → Na2SO3 + H2O). The solution is concentrated and crystallised (anhydrous above ~34 °C, else as the heptahydrate) and dried. It is used as an oxygen scavenger in boiler water, a photographic developer, a pulping chemical and a food preservative.",
    },
    manufacturers: [
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Esseco Group", url: "https://www.esseco.it" },
      { name: "Calabrian Corporation", url: "https://www.calabriancorp.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium sulfite", url: "https://en.wikipedia.org/wiki/Sodium_sulfite" },
      { name: "ChemicalBook, Sodium sulfite", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1852633.htm" },
      { name: "Solvay, Sodium sulfite", url: "https://www.solvay.com/en/product/sodium-sulfite" },
    ],
  },

  "cupric-oxide": {
    routes: [
      "Thermal oxidation/roasting of copper metal or copper powder",
      "Precipitation of copper hydroxide/carbonate, then calcination",
      "Recovery from spent etch / copper scrap liquors",
    ],
    mainProcess: {
      name: "Oxidation of copper / calcination of precipitate",
      detail:
        "Cupric oxide (CuO, black copper oxide) is made by oxidising copper. Copper metal, powder or recovered copper values are roasted in air at high temperature to the oxide (2 Cu + O2 → 2 CuO), or a copper salt solution is precipitated as basic copper carbonate/hydroxide and then calcined to CuO. The product is milled to the required fineness. It is used as a pigment/colourant in ceramics and glass, a catalyst, a feed/fertiliser micronutrient and in antifouling and battery applications.",
    },
    manufacturers: [
      { name: "American Chemet", url: "https://www.chemet.com" },
      { name: "Old Bridge Chemicals", url: "https://www.oldbridgechem.com" },
    ],
    sources: [
      { name: "Wikipedia, Copper(II) oxide", url: "https://en.wikipedia.org/wiki/Copper(II)_oxide" },
      { name: "American Chemet, Copper oxides", url: "https://www.chemet.com/copper-chemistry/" },
      { name: "ChemicalBook, Copper(II) oxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854112.htm" },
    ],
  },

  "nickel-sulphate-electroless": {
    routes: [
      "Dissolution of nickel metal/oxide or refinery intermediates in sulfuric acid",
      "By-product of copper electro-refining and nickel refining",
    ],
    mainProcess: {
      name: "Nickel + sulfuric acid dissolution",
      detail:
        "Nickel sulfate is made by dissolving a nickel source in sulfuric acid. Nickel metal, nickel oxide, or refinery intermediates (and copper-refinery by-product liquors) are reacted with sulfuric acid and air to give nickel sulfate solution (Ni + H2SO4 + 1/2 O2 → NiSO4 + H2O); the liquor is purified of cobalt, iron and copper and crystallised as the hexahydrate. Plating ('electroless'/electrolytic) grades are tightly purified. It is the main feed for nickel electroplating and electroless nickel baths and, in high purity, for lithium-ion battery precursors.",
    },
    manufacturers: [
      { name: "Umicore", url: "https://www.umicore.com" },
      { name: "Sumitomo Metal Mining", url: "https://www.smm.co.jp" },
      { name: "Nornickel", url: "https://www.nornickel.com" },
      { name: "Jinchuan Group", url: "https://www.jnmc.com" },
    ],
    sources: [
      { name: "Wikipedia, Nickel(II) sulfate", url: "https://en.wikipedia.org/wiki/Nickel(II)_sulfate" },
      { name: "ChemicalBook, Nickel sulfate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5184400.htm" },
      { name: "Sumitomo Metal Mining, Nickel", url: "https://www.smm.co.jp/en/business/metals/nickel/" },
    ],
  },

  "zinc-borate": {
    routes: [
      "Reaction of zinc oxide with boric acid (and/or borax) in water",
      "Controlled crystallisation/dehydration to the 2ZnO·3B2O3·3.5H2O grade",
    ],
    mainProcess: {
      name: "Zinc oxide + boric acid",
      detail:
        "Zinc borate (the common flame-retardant grade 2ZnO·3B2O3·3.5H2O, e.g. Firebrake ZB) is made by reacting zinc oxide with boric acid (and sometimes borax) in an aqueous slurry at controlled temperature and pH, seeding to grow the desired hydrate crystal. The precipitated zinc borate is filtered, washed, dried and milled to a fine powder. It acts as a flame retardant, smoke suppressant and anti-arcing/afterglow agent in plastics, rubber, coatings and wood, often partly replacing antimony trioxide.",
    },
    manufacturers: [
      { name: "Rio Tinto Borates (U.S. Borax, Firebrake)", url: "https://www.riotinto.com" },
      { name: "ICL Group", url: "https://www.icl-group.com" },
    ],
    sources: [
      { name: "Wikipedia, Zinc borate", url: "https://en.wikipedia.org/wiki/Zinc_borate" },
      { name: "U.S. Borax, Firebrake zinc borate", url: "https://www.borax.com/products/firebrake" },
      { name: "ChemicalBook, Zinc borate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4853246.htm" },
    ],
  },

  "basic-chromium-sulphate": {
    routes: [
      "Reduction of sodium dichromate with SO2 or organics (molasses/sulphur) to Cr(III)",
      "Direct reduction of chromite-derived chromate liquor",
    ],
    mainProcess: {
      name: "Reduction of dichromate to Cr(III) sulfate",
      detail:
        "Basic chromium sulfate (the principal leather-tanning chrome) is made by reducing hexavalent chromium to the trivalent state in a sulfate medium. Sodium dichromate is reduced, with sulfur dioxide, or with organic reductants such as molasses/glucose plus sulfuric acid, to give a green basic chromium(III) sulfate of about 33% basicity (typically written Cr(OH)SO4): Na2Cr2O7 + 3 SO2 → 2 Cr(OH)SO4 + Na2SO4. The liquor is dried (spray/drum) to a powder of ~25-26% Cr2O3. It is used almost entirely for chrome tanning of leather.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Elementis", url: "https://www.elementis.com" },
      { name: "Vishnu Chemicals", url: "https://www.vishnuchemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Chromium(III) sulfate", url: "https://en.wikipedia.org/wiki/Chromium(III)_sulfate" },
      { name: "Vishnu Chemicals, Basic chromium sulphate", url: "https://www.vishnuchemicals.com/basic-chromium-sulphate.php" },
      { name: "ScienceDirect, Chrome tanning agents", url: "https://www.sciencedirect.com/topics/materials-science/chromium-sulfate" },
    ],
  },

  "potassium-dichromate-extrapure": {
    routes: [
      "Conversion of sodium dichromate with potassium chloride (metathesis)",
      "Upstream: roasting chromite with soda ash to chromate, then acidify to dichromate",
    ],
    mainProcess: {
      name: "Sodium dichromate + potassium chloride",
      detail:
        "Potassium dichromate is made from sodium dichromate, which itself comes from the alkaline roasting of chromite ore with soda ash to sodium chromate, followed by acidification to sodium dichromate. The sodium dichromate solution is then reacted with potassium chloride; on cooling, the less soluble potassium dichromate crystallises out (Na2Cr2O7 + 2 KCl → K2Cr2O7 + 2 NaCl) and is separated, recrystallised to 'extra-pure'/AR grade and dried. It is an oxidising agent and analytical reagent, and is used in chrome plating, tanning and pigment chemistry.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Elementis", url: "https://www.elementis.com" },
      { name: "Vishnu Chemicals", url: "https://www.vishnuchemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Potassium dichromate", url: "https://en.wikipedia.org/wiki/Potassium_dichromate" },
      { name: "Wikipedia, Sodium dichromate (production)", url: "https://en.wikipedia.org/wiki/Sodium_dichromate" },
      { name: "ChemicalBook, Potassium dichromate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7852592.htm" },
    ],
  },

  "lead-nitrate-ar-acs-sap": {
    routes: [
      "Dissolving lead metal or lead(II) oxide in nitric acid, then crystallisation",
    ],
    mainProcess: {
      name: "Lead/litharge + nitric acid",
      detail:
        "Lead(II) nitrate is made by dissolving metallic lead or lead(II) oxide (litharge) in dilute nitric acid: PbO + 2 HNO3 → Pb(NO3)2 + H2O (with metallic lead, NO/NO2 are also evolved). Because lead nitrate is freely soluble while many impurities are not, the solution is filtered and then evaporated/cooled so colourless lead nitrate crystals form, which are dried. It is used as a heat stabiliser, in gold cyanidation (as an accelerator), in pyrotechnics and as an analytical reagent; handling is strictly controlled due to lead toxicity.",
    },
    manufacturers: [
      { name: "American Elements", url: "https://www.americanelements.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Lead(II) nitrate", url: "https://en.wikipedia.org/wiki/Lead(II)_nitrate" },
      { name: "American Elements, Lead nitrate", url: "https://www.americanelements.com/lead-nitrate-10099-74-8" },
      { name: "ChemicalBook, Lead nitrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1852604.htm" },
    ],
  },

  "ammonium-metavanadate-ar-acs": {
    routes: [
      "Precipitation from sodium vanadate/vanadium leach liquor with ammonium salt",
      "From roasted vanadium ore or spent-catalyst leachate",
    ],
    mainProcess: {
      name: "Ammonium precipitation from vanadate liquor",
      detail:
        "Ammonium metavanadate is made by precipitating vanadium from a purified vanadate solution. Vanadium-bearing material (titanomagnetite slag, vanadium ore, or spent catalysts) is salt-roasted and water-leached to a sodium vanadate liquor; adding an ammonium salt (ammonium chloride/sulfate) at controlled pH precipitates sparingly soluble ammonium metavanadate (NaVO3 + NH4Cl → NH4VO3 + NaCl), which is filtered, washed and dried. Calcining it gives vanadium pentoxide. It is used to make V2O5, vanadium catalysts and as a reagent.",
    },
    manufacturers: [
      { name: "U.S. Vanadium", url: "https://www.usvanadium.com" },
      { name: "Bushveld Minerals", url: "https://www.bushveldminerals.com" },
      { name: "Largo", url: "https://www.largoinc.com" },
    ],
    sources: [
      { name: "Wikipedia, Ammonium metavanadate", url: "https://en.wikipedia.org/wiki/Ammonium_metavanadate" },
      { name: "ChemicalBook, Ammonium metavanadate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7852611.htm" },
      { name: "U.S. Vanadium, Vanadium chemicals", url: "https://www.usvanadium.com/products" },
    ],
  },

  "phosphorus-pentaoxide-min": {
    routes: [
      "Combustion of elemental phosphorus in dry air",
      "Collection/condensation of the P2O5 (P4O10) smoke",
    ],
    mainProcess: {
      name: "Burning elemental phosphorus",
      detail:
        "Phosphorus pentoxide (P2O5, properly P4O10) is made by burning elemental (white) phosphorus in a stream of dry air or oxygen in a combustion chamber: P4 + 5 O2 → P4O10. The hot oxide forms as a dense white smoke that is cooled and collected as a fluffy crystalline solid (kept rigorously dry because it is extremely hygroscopic). The same combustion is the first step of the thermal phosphoric-acid process; for solid P2O5 the oxide is condensed rather than hydrated. It is a powerful desiccant and dehydrating agent used in organic synthesis and to make polyphosphoric acid.",
    },
    manufacturers: [
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Prayon", url: "https://www.prayon.com" },
      { name: "Innophos", url: "https://www.innophos.com" },
    ],
    sources: [
      { name: "Wikipedia, Phosphorus pentoxide", url: "https://en.wikipedia.org/wiki/Phosphorus_pentoxide" },
      { name: "Britannica, Phosphorus oxides", url: "https://www.britannica.com/science/phosphorus-chemical-element/Oxides" },
      { name: "ChemicalBook, Phosphorus pentoxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852623.htm" },
    ],
  },

  "barium-sulphate-precipitated-pallets-containing-jumbo": {
    routes: [
      "Precipitation of a barium salt with sulfate (blanc fixe)",
      "From barium sulfide (black ash from barite + carbon) + sodium sulfate",
    ],
    mainProcess: {
      name: "Precipitated barium sulfate (blanc fixe)",
      detail:
        "Precipitated barium sulfate ('blanc fixe') is made by reacting a soluble barium salt with a sulfate source. Natural barite (BaSO4) is first reduced with carbon at high temperature to soluble barium sulfide ('black ash'); the barium sulfide liquor is then reacted with sodium sulfate (or sulfuric acid) to precipitate very fine, high-purity barium sulfate: BaS + Na2SO4 → BaSO4 + Na2S. The precipitate is filtered, washed, dried and milled. Controlled precipitation sets the fine particle size that distinguishes blanc fixe from ground natural barite; it is used as a filler/pigment extender, in plastics and as a radiocontrast agent.",
    },
    manufacturers: [
      { name: "Sakai Chemical", url: "https://www.sakai-chem.co.jp" },
      { name: "Venator Materials", url: "https://www.venatorcorp.com" },
      { name: "CIMBAR Performance Minerals", url: "https://www.cimbar.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
    ],
    sources: [
      { name: "Wikipedia, Barium sulfate", url: "https://en.wikipedia.org/wiki/Barium_sulfate" },
      { name: "Venator, Barium sulfate (blanc fixe)", url: "https://www.venatorcorp.com/products/functional-additives/barium-sulfate" },
      { name: "ChemicalBook, Barium sulfate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6357618.htm" },
    ],
  },

  "aluminium-oxide-alumina-calcined-non-metallurgical": {
    routes: [
      "Bayer-process alumina hydrate, then calcination to alpha-alumina",
      "Control of soda/grain size for non-metallurgical (ceramic/refractory) grades",
    ],
    mainProcess: {
      name: "Calcination of Bayer alumina hydrate",
      detail:
        "Calcined alumina is made by heating Bayer-process aluminium hydroxide (gibbsite) in rotary or fluid-flash calciners at ~1100-1300 °C, driving off the chemically bound water and converting the hydroxide into crystalline alpha-alumina: 2 Al(OH)3 → Al2O3 + 3 H2O. Calcination temperature, time and mineraliser additions control the soda content, crystal size and degree of alpha-phase conversion that define 'non-metallurgical' grades for refractories, ceramics, polishing and electronics (as opposed to smelter-grade alumina used to make aluminium metal). The product is milled to specified fineness.",
    },
    manufacturers: [
      { name: "Almatis", url: "https://www.almatis.com" },
      { name: "Alteo", url: "https://www.alteo-alumina.com" },
      { name: "Nabaltec", url: "https://www.nabaltec.de" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Aluminium oxide", url: "https://en.wikipedia.org/wiki/Aluminium_oxide" },
      { name: "Almatis, Calcined aluminas", url: "https://www.almatis.com/en/products/calcined-alumina/" },
      { name: "Wikipedia, Bayer process", url: "https://en.wikipedia.org/wiki/Bayer_process" },
    ],
  },

  "silicon-carbide-grains-sicl7-details-as": {
    routes: [
      "Acheson process, carbothermic reduction of silica with carbon",
      "Crushing/grading of the SiC crystal mass into grains",
    ],
    mainProcess: {
      name: "Acheson process",
      detail:
        "Silicon carbide is made by the Acheson process: a mixture of high-purity silica sand and petroleum coke (carbon) is packed around a graphite resistor core in a long electric resistance furnace and heated to ~1700-2500 °C. The carbon reduces the silica and combines with the silicon to form silicon carbide: SiO2 + 3 C → SiC + 2 CO. After a multi-day heating/cooling cycle the furnace yields a cylindrical crystalline SiC mass graded by purity (black to green); it is broken out, crushed, chemically cleaned, and screened into abrasive/refractory grains and powders of defined grit size.",
    },
    manufacturers: [
      { name: "Saint-Gobain", url: "https://www.saint-gobain.com" },
      { name: "Washington Mills", url: "https://www.washingtonmills.com" },
      { name: "ESK-SIC", url: "https://www.esk-sic.de" },
    ],
    sources: [
      { name: "Wikipedia, Silicon carbide (Acheson process)", url: "https://en.wikipedia.org/wiki/Silicon_carbide" },
      { name: "Washington Mills, Silicon carbide", url: "https://www.washingtonmills.com/materials/silicon-carbide" },
      { name: "Britannica, Acheson process", url: "https://www.britannica.com/technology/Acheson-process" },
    ],
  },

  "tri-basic-calcium-phosphate": {
    routes: [
      "Reaction of phosphoric acid with calcium hydroxide/carbonate at high pH",
      "Spray-drying / calcination to the hydroxyapatite-type product",
    ],
    mainProcess: {
      name: "Phosphoric acid + lime at high pH",
      detail:
        "Tricalcium phosphate (TCP, commercially a calcium-hydroxyphosphate close to hydroxyapatite) is made by reacting purified phosphoric acid with an excess of calcium hydroxide or calcium carbonate so the neutralisation goes to the tribasic, high-pH end: 3 Ca(OH)2 + 2 H3PO4 → Ca3(PO4)2 + 6 H2O. The fine precipitate is filtered, washed, dried (often spray-dried) and milled. Its insolubility and free-flowing nature make it an anticaking agent, calcium supplement, tableting excipient and toothpaste polishing agent.",
    },
    manufacturers: [
      { name: "Chemische Fabrik Budenheim", url: "https://www.budenheim.com" },
      { name: "Innophos", url: "https://www.innophos.com" },
      { name: "Prayon", url: "https://www.prayon.com" },
    ],
    sources: [
      { name: "Wikipedia, Tricalcium phosphate", url: "https://en.wikipedia.org/wiki/Tricalcium_phosphate" },
      { name: "Budenheim, Calcium phosphates", url: "https://www.budenheim.com/en/markets/food" },
      { name: "ChemicalBook, Tricalcium phosphate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5853246.htm" },
    ],
  },

  "magnesium-trisilicate-bp-pharmaceuticalraw-materials": {
    routes: [
      "Precipitation by reacting sodium silicate with a soluble magnesium salt",
      "Washing/drying to the pharmacopoeial hydrated magnesium silicate",
    ],
    mainProcess: {
      name: "Sodium silicate + magnesium salt precipitation",
      detail:
        "Magnesium trisilicate is made by reacting a solution of sodium silicate (water glass) with a soluble magnesium salt such as magnesium sulfate or chloride under controlled conditions. The two solutions are combined and the gelatinous hydrated magnesium silicate precipitates (a non-stoichiometric MgO·SiO2·xH2O close to the 'trisilicate'); it is filtered, washed free of sodium salts and dried and milled to a fine, odourless powder. Pharmacopoeial (BP/USP) grade is controlled for silica/magnesia ratio and acid-neutralising capacity. It is an antacid and a tablet excipient/adsorbent.",
    },
    manufacturers: [
      { name: "Dr. Paul Lohmann", url: "https://www.lohmann4minerals.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
    ],
    sources: [
      { name: "Wikipedia, Magnesium trisilicate", url: "https://en.wikipedia.org/wiki/Magnesium_trisilicate" },
      { name: "DrugBank, Magnesium trisilicate", url: "https://go.drugbank.com/drugs/DB09280" },
      { name: "ChemicalBook, Magnesium trisilicate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3354340.htm" },
    ],
  },

  "aluminum-chlorohydrate-solution-gc": {
    routes: [
      "Reaction of aluminium metal with hydrochloric acid / aluminium chloride solution",
      "Reaction of alumina hydrate with HCl/AlCl3 to a basic chloride",
    ],
    mainProcess: {
      name: "Aluminium + HCl/aluminium chloride",
      detail:
        "Aluminium chlorohydrate (ACH), a basic aluminium chloride, is made by reacting aluminium metal (or alumina hydrate) with hydrochloric acid and/or aluminium chloride solution under heat and pressure so that only part of the aluminium's coordination is chloride, giving a polymeric basic chloride of approximate formula Al2(OH)5Cl. The reaction is controlled to the target basicity (~5/6 OH), and the product is sold as a concentrated solution or spray-dried powder. It is the active in antiperspirants and a high-basicity coagulant for water treatment.",
    },
    manufacturers: [
      { name: "Kemira", url: "https://www.kemira.com" },
      { name: "USALCO", url: "https://www.usalco.com" },
      { name: "Gulbrandsen", url: "https://www.gulbrandsen.com" },
      { name: "Feralco Group", url: "https://www.feralco.com" },
    ],
    sources: [
      { name: "Wikipedia, Aluminium chlorohydrate", url: "https://en.wikipedia.org/wiki/Aluminium_chlorohydrate" },
      { name: "USALCO, Aluminum chlorohydrate", url: "https://www.usalco.com/products/aluminum-chlorohydrate/" },
      { name: "Gulbrandsen, ACH", url: "https://www.gulbrandsen.com/products/water-treatment-chemicals/" },
    ],
  },

  "trisodium-citrate-dihydrate-ar-acs-sap": {
    routes: [
      "Neutralisation of fermentation-derived citric acid with sodium hydroxide/carbonate",
      "Crystallisation to the dihydrate",
    ],
    mainProcess: {
      name: "Citric acid neutralisation with soda",
      detail:
        "Trisodium citrate is made by fully neutralising citric acid, itself produced by Aspergillus niger fermentation of sugar, with sodium hydroxide or sodium carbonate: C6H8O7 + 3 NaOH → Na3C6H5O7 + 3 H2O. The neutralised solution is decolourised (carbon), filtered and concentrated, then cooled so trisodium citrate dihydrate crystallises; the crystals are centrifuged and dried. It is a buffer, sequestrant and emulsifier in food and pharmaceuticals and an anticoagulant in blood collection.",
    },
    manufacturers: [
      { name: "Jungbunzlauer", url: "https://www.jungbunzlauer.com" },
      { name: "ADM", url: "https://www.adm.com" },
      { name: "Gadot Biochemical", url: "https://www.gadot-bio.com" },
      { name: "RZBC Group", url: "https://www.rzbc.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium citrate", url: "https://en.wikipedia.org/wiki/Sodium_citrate" },
      { name: "Jungbunzlauer, Sodium citrates", url: "https://www.jungbunzlauer.com/en/products/citrics/sodium-citrate.html" },
      { name: "ChemicalBook, Trisodium citrate dihydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7853179.htm" },
    ],
  },

  "sodium-acetate-trihydrate": {
    routes: [
      "Neutralisation of acetic acid with sodium hydroxide/carbonate",
      "Crystallisation of the trihydrate below ~58 °C",
    ],
    mainProcess: {
      name: "Acetic acid + sodium hydroxide",
      detail:
        "Sodium acetate is made by neutralising acetic acid (from methanol carbonylation) with sodium hydroxide or sodium carbonate: CH3COOH + NaOH → CH3COONa + H2O. The solution is concentrated and cooled; below ~58 °C the trihydrate (CH3COONa·3H2O) crystallises, while above it the anhydrous salt forms. The crystals are centrifuged and dried at low temperature to retain the water of hydration. It is used as a buffer, a textile/dye mordant, a concrete sealer, in heating pads (its supercooling/latent heat) and as a food additive.",
    },
    manufacturers: [
      { name: "Niacet (Kerry)", url: "https://www.niacet.com" },
      { name: "Jubilant Ingrevia", url: "https://www.jubilantingrevia.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium acetate", url: "https://en.wikipedia.org/wiki/Sodium_acetate" },
      { name: "ChemicalBook, Sodium acetate trihydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5854349.htm" },
      { name: "Niacet, Acetates", url: "https://www.niacet.com/markets/" },
    ],
  },

  "potassium-oxalate-ar-sap": {
    routes: [
      "Neutralisation of oxalic acid with potassium hydroxide/carbonate",
      "Crystallisation to the monohydrate",
    ],
    mainProcess: {
      name: "Oxalic acid + potassium base",
      detail:
        "Potassium oxalate is made by neutralising oxalic acid with potassium hydroxide or potassium carbonate: H2C2O4 + 2 KOH → K2C2O4 + 2 H2O. The solution is filtered, concentrated and cooled to crystallise potassium oxalate monohydrate, which is centrifuged and dried. (The upstream oxalic acid is itself made by oxidation of carbohydrates/glycols with nitric acid, or from sodium formate.) It is used as an analytical reagent, a bleaching/cleaning agent, a blood anticoagulant and in photography.",
    },
    manufacturers: [
      { name: "American Elements", url: "https://www.americanelements.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Potassium oxalate", url: "https://en.wikipedia.org/wiki/Potassium_oxalate" },
      { name: "ChemicalBook, Potassium oxalate monohydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5159524.htm" },
      { name: "American Elements, Potassium oxalate", url: "https://www.americanelements.com/potassium-oxalate-monohydrate-6487-48-5" },
    ],
  },

  "p0662-potassium-phosphate-monobasic-anhydrous": {
    routes: [
      "Reaction of phosphoric acid with potassium hydroxide/carbonate to a 1:1 K:P ratio",
      "Crystallisation of monopotassium phosphate (MKP)",
    ],
    mainProcess: {
      name: "Phosphoric acid + potassium base (mono-neutralisation)",
      detail:
        "Monopotassium phosphate (MKP, potassium dihydrogen phosphate) is made by partially neutralising purified phosphoric acid with potassium hydroxide or potassium carbonate, stopping at a 1:1 potassium-to-phosphorus ratio (around pH 4.5): H3PO4 + KOH → KH2PO4 + H2O. The clarified solution is concentrated and crystallised, and the crystals are centrifuged and dried. It is a fully water-soluble P-K fertiliser, a buffer and food additive, and a fire-retardant/specialty phosphate.",
    },
    manufacturers: [
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Prayon", url: "https://www.prayon.com" },
      { name: "Haifa Group", url: "https://www.haifa-group.com" },
      { name: "Chemische Fabrik Budenheim", url: "https://www.budenheim.com" },
    ],
    sources: [
      { name: "Wikipedia, Monopotassium phosphate", url: "https://en.wikipedia.org/wiki/Monopotassium_phosphate" },
      { name: "Haifa Group, MKP", url: "https://www.haifa-group.com/mkp-monopotassium-phosphate-0" },
      { name: "ChemicalBook, Potassium dihydrogen phosphate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5113379.htm" },
    ],
  },

  "s9638-sodium-phosphate-monobasicmonohydrate": {
    routes: [
      "Reaction of phosphoric acid with sodium hydroxide/carbonate to a 1:1 Na:P ratio",
      "Crystallisation of the monohydrate",
    ],
    mainProcess: {
      name: "Phosphoric acid + sodium base (mono-neutralisation)",
      detail:
        "Monosodium phosphate (sodium dihydrogen phosphate) is made by partially neutralising purified phosphoric acid with sodium hydroxide or sodium carbonate, stopping at a 1:1 sodium-to-phosphorus ratio (around pH 4-4.5): H3PO4 + NaOH → NaH2PO4 + H2O. The liquor is concentrated and crystallised; below ~60 °C the monohydrate (NaH2PO4·H2O) is the stable form. The crystals are centrifuged and dried at controlled temperature. It is a buffer, acidulant and sequestrant in food, water treatment and pharmaceuticals.",
    },
    manufacturers: [
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Innophos", url: "https://www.innophos.com" },
      { name: "Chemische Fabrik Budenheim", url: "https://www.budenheim.com" },
    ],
    sources: [
      { name: "Wikipedia, Monosodium phosphate", url: "https://en.wikipedia.org/wiki/Monosodium_phosphate" },
      { name: "ICL Food Specialties, Phosphates", url: "https://www.icl-group.com/our-business/icl-growing-solutions/" },
      { name: "ChemicalBook, Sodium dihydrogen phosphate monohydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5113380.htm" },
    ],
  },

  "lithium-bromide-x": {
    routes: [
      "Neutralisation of lithium carbonate/hydroxide with hydrobromic acid",
      "Concentration to anhydrous salt or stabilised solution",
    ],
    mainProcess: {
      name: "Lithium carbonate + hydrobromic acid",
      detail:
        "Lithium bromide is made by reacting a lithium base, lithium carbonate or lithium hydroxide, with hydrobromic acid: Li2CO3 + 2 HBr → 2 LiBr + CO2 + H2O. The solution is purified and then either crystallised/dried to the anhydrous salt (it is strongly hygroscopic, so drying is done carefully under vacuum/heat) or concentrated and stabilised with an inhibitor for sale as solution. Its main use is as the desiccant/absorbent working fluid in lithium-bromide absorption chillers; it is also used in air-drying systems and organic synthesis.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Honjo Chemical", url: "https://www.honjo-chem.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Lithium bromide", url: "https://en.wikipedia.org/wiki/Lithium_bromide" },
      { name: "LANXESS, Lithium derivatives", url: "https://lanxess.com/en/Products-and-Solutions/Brands/Lithium" },
      { name: "ChemicalBook, Lithium bromide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7852630.htm" },
    ],
  },

  "potassium-ferrocyanide-ar-sap": {
    routes: [
      "Reaction of HCN/cyanide by-product liquors with iron salts and lime, then potassium exchange",
      "Recovery from gas-purification (spent oxide) iron-cyanide complexes",
    ],
    mainProcess: {
      name: "Iron-cyanide complex + potassium",
      detail:
        "Potassium ferrocyanide (potassium hexacyanoferrate(II)) is produced from iron-cyanide complexes. Cyanide (often from by-product HCN liquors or gas-purification masses) is combined with iron(II) salts and lime to form calcium/iron ferrocyanide, which is then converted to the potassium salt by treatment with potassium carbonate/chloride and crystallised as the trihydrate K4[Fe(CN)6]·3H2O. The yellow crystals are recrystallised to AR grade. It is used as an anticaking agent in road salt, a wine fining agent, in pigments (Prussian blue) and as an analytical reagent; the cyanide is tightly bound and non-toxic in this complex.",
    },
    manufacturers: [
      { name: "American Elements", url: "https://www.americanelements.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Potassium ferrocyanide", url: "https://en.wikipedia.org/wiki/Potassium_ferrocyanide" },
      { name: "ChemicalBook, Potassium ferrocyanide trihydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852638.htm" },
      { name: "American Elements, Potassium ferrocyanide", url: "https://www.americanelements.com/potassium-ferrocyanide-trihydrate-14459-95-1" },
    ],
  },

  phenoxyethanol: {
    routes: [
      "Reaction of phenol with ethylene oxide (ethoxylation, base catalysed)",
      "Reaction of phenol with 2-chloroethanol (Williamson, minor)",
    ],
    mainProcess: {
      name: "Phenol ethoxylation",
      detail:
        "Phenoxyethanol (ethylene glycol monophenyl ether) is made by reacting phenol with one mole of ethylene oxide under basic catalysis (e.g. sodium hydroxide/phenoxide) at moderate temperature and pressure: C6H5OH + C2H4O → C6H5OCH2CH2OH. The mono-adduct is favoured by controlling the EO ratio, and the product is purified by vacuum distillation to a low-residual, low-colour grade. It is a broad-spectrum preservative in cosmetics and pharmaceuticals and a solvent/fixative.",
    },
    manufacturers: [
      { name: "Clariant", url: "https://www.clariant.com" },
      { name: "Arxada (Lonza Specialty)", url: "https://www.arxada.com" },
      { name: "Galaxy Surfactants", url: "https://www.galaxysurfactants.com" },
      { name: "Ashland", url: "https://www.ashland.com" },
    ],
    sources: [
      { name: "Wikipedia, Phenoxyethanol", url: "https://en.wikipedia.org/wiki/Phenoxyethanol" },
      { name: "ChemicalBook, 2-Phenoxyethanol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854198.htm" },
      { name: "Clariant, Preservatives", url: "https://www.clariant.com/en/Solutions/Products" },
    ],
  },

  "p-phenylenediamine": {
    routes: [
      "Nitration of chlorobenzene / aniline to nitro-anilines, then reduction",
      "Catalytic hydrogenation of para-nitroaniline (or p-nitrochlorobenzene + ammonia)",
    ],
    mainProcess: {
      name: "para-Nitroaniline hydrogenation",
      detail:
        "para-Phenylenediamine (PPD) is made by reducing a para-substituted nitro-aromatic. A common route ammonates para-nitrochlorobenzene to para-nitroaniline and then catalytically hydrogenates the nitro group to the second amine over a nickel or noble-metal catalyst: O2N-C6H4-NH2 + 3 H2 → H2N-C6H4-NH2 + 2 H2O. The crude diamine is purified by distillation/crystallisation. PPD is used to make para-aramid fibres (with terephthaloyl chloride), rubber antiozonants, and hair/textile dyes.",
    },
    manufacturers: [
      { name: "Nouryon", url: "https://www.nouryon.com" },
      { name: "Sennics", url: "https://www.sennics.com" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
    ],
    sources: [
      { name: "Wikipedia, p-Phenylenediamine", url: "https://en.wikipedia.org/wiki/P-Phenylenediamine" },
      { name: "ChemicalBook, p-Phenylenediamine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4854220.htm" },
      { name: "Nouryon, Diamines & derivatives", url: "https://www.nouryon.com/products/" },
    ],
  },

  "terephthaloyl-chloride": {
    routes: [
      "Chlorination of terephthalic acid with thionyl chloride or phosgene",
      "Reaction of terephthalic acid with PCl5 (laboratory/older)",
    ],
    mainProcess: {
      name: "Terephthalic acid + chlorinating agent",
      detail:
        "Terephthaloyl chloride (the acid chloride of terephthalic acid) is made by converting both carboxylic-acid groups of terephthalic acid to acid chlorides, using a chlorinating agent such as thionyl chloride or phosgene (often with a catalyst like DMF): C6H4(COOH)2 + 2 SOCl2 → C6H4(COCl)2 + 2 SO2 + 2 HCl. The product is purified by distillation/crystallisation under strictly anhydrous conditions because it hydrolyses readily. Its dominant use is the low-temperature polycondensation with para-phenylenediamine to make para-aramid (Kevlar/Twaron) fibre.",
    },
    manufacturers: [
      { name: "DuPont", url: "https://www.dupont.com" },
      { name: "Teijin", url: "https://www.teijin.com" },
    ],
    sources: [
      { name: "Wikipedia, Terephthaloyl chloride", url: "https://en.wikipedia.org/wiki/Terephthaloyl_chloride" },
      { name: "Wikipedia, Kevlar (synthesis)", url: "https://en.wikipedia.org/wiki/Kevlar" },
      { name: "ChemicalBook, Terephthaloyl chloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1219732.htm" },
    ],
  },

  "para-di-chloro-benzene": {
    routes: [
      "Catalytic chlorination of benzene/monochlorobenzene (para-selective)",
      "Separation of the para isomer by crystallisation",
    ],
    mainProcess: {
      name: "Benzene chlorination (para-selective)",
      detail:
        "para-Dichlorobenzene is made by the iron/Lewis-acid-catalysed chlorination of benzene or monochlorobenzene with chlorine; conditions and catalysts are chosen to favour the para isomer over the ortho. The dichlorobenzene isomer mixture is then separated, the high-melting para isomer is recovered by crystallisation (and distillation) from the ortho. It is used as a moth repellent and deodorant block and, importantly, as the monomer feedstock for polyphenylene sulfide (PPS) engineering plastic.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "Kureha Corporation", url: "https://www.kureha.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, 1,4-Dichlorobenzene", url: "https://en.wikipedia.org/wiki/1,4-Dichlorobenzene" },
      { name: "Aarti Industries, Chlorination products", url: "https://www.aarti-industries.com/products/chemical-products/chemistry/chlorination" },
      { name: "ChemicalBook, p-Dichlorobenzene", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5854120.htm" },
    ],
  },

  "benzyl-chloride": {
    routes: [
      "Photochemical/thermal side-chain chlorination of toluene",
      "Separation from benzal chloride/benzotrichloride by distillation",
    ],
    mainProcess: {
      name: "Side-chain chlorination of toluene",
      detail:
        "Benzyl chloride is made by the free-radical chlorination of the methyl side chain of toluene with chlorine, promoted by light or a radical initiator at ~100-130 °C: C6H5CH3 + Cl2 → C6H5CH2Cl + HCl. The reaction is run to limited conversion to favour the mono-chloride over the more highly chlorinated benzal chloride and benzotrichloride, and the products are separated by fractional distillation. It is a versatile alkylating/benzylating agent used to make benzyl alcohol, quaternary ammonium compounds, benzyl esters, plasticisers and pharmaceuticals.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
      { name: "Tokuyama Corporation", url: "https://www.tokuyama.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Benzyl chloride", url: "https://en.wikipedia.org/wiki/Benzyl_chloride" },
      { name: "ChemicalBook, Benzyl chloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB2854160.htm" },
      { name: "ScienceDirect, Side-chain chlorination of toluene", url: "https://www.sciencedirect.com/topics/chemistry/benzyl-chloride" },
    ],
  },

  benzothiazole: {
    routes: [
      "Condensation of 2-aminothiophenol with formic acid / orthoesters",
      "Reaction of aniline, sulfur and an aldehyde (industrial MBT family route)",
    ],
    mainProcess: {
      name: "2-Aminothiophenol cyclisation",
      detail:
        "Benzothiazole (the parent bicyclic ring) is made by cyclising 2-aminothiophenol with a one-carbon donor such as formic acid, an orthoester or an aldehyde: the amine and thiol both condense onto the carbon to close the thiazole ring with loss of water. Industrially the benzothiazole nucleus is more often built en route to 2-mercaptobenzothiazole (MBT) by reacting aniline, carbon disulfide and sulfur under pressure. Benzothiazoles are key intermediates for rubber vulcanisation accelerators, dyes, agrochemicals and corrosion inhibitors.",
    },
    manufacturers: [
      { name: "Sennics", url: "https://www.sennics.com" },
      { name: "NOCIL", url: "https://www.nocil.com" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
    ],
    sources: [
      { name: "Wikipedia, Benzothiazole", url: "https://en.wikipedia.org/wiki/Benzothiazole" },
      { name: "Wikipedia, 2-Mercaptobenzothiazole", url: "https://en.wikipedia.org/wiki/2-Mercaptobenzothiazole" },
      { name: "ChemicalBook, Benzothiazole", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4853243.htm" },
    ],
  },

  "alpha-methyl-styrene-iupac-name-benzen": {
    routes: [
      "By-product of the cumene-to-phenol (cumene hydroperoxide) process",
      "Catalytic dehydrogenation of cumene (on-purpose, minor)",
    ],
    mainProcess: {
      name: "Cumene-phenol process co-product",
      detail:
        "Alpha-methylstyrene (AMS) is recovered mainly as a co-product of phenol/acetone manufacture. In the cumene (Hock) process, a side reaction dehydrates part of the dimethylphenylcarbinol intermediate to alpha-methylstyrene; rather than fully hydrogenating it back to cumene, producers can isolate AMS by distillation from the process streams. It can also be made on purpose by catalytic dehydrogenation of cumene. AMS is used as a polymer modifier (to lower softening point and improve flow), in AMS-phenol resins, waxes and as a polymerisation regulator.",
    },
    manufacturers: [
      { name: "INEOS Phenol", url: "https://www.ineos.com" },
      { name: "Mitsui Chemicals", url: "https://www.mitsuichemicals.com" },
      { name: "AltiVia", url: "https://www.altivia.com" },
    ],
    sources: [
      { name: "Wikipedia, Alpha-Methylstyrene", url: "https://en.wikipedia.org/wiki/Alpha-Methylstyrene" },
      { name: "AltiVia, Alpha methylstyrene", url: "https://www.altivia.com/product/alpha-methylstyrene/" },
      { name: "ChemicalBook, alpha-Methylstyrene", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1354214.htm" },
    ],
  },

  "ethyl-acetate-with-min-purity-cas": {
    routes: [
      "Acid-catalysed (Fischer) esterification of acetic acid with ethanol",
      "Tishchenko dimerisation of acetaldehyde",
      "Direct addition of ethylene to acetic acid (AVADA)",
    ],
    mainProcess: {
      name: "Esterification of acetic acid with ethanol",
      detail:
        "Ethyl acetate is most often made by the acid-catalysed (sulfuric acid or solid acid) Fischer esterification of acetic acid with ethanol: CH3COOH + C2H5OH ⇌ CH3COOC2H5 + H2O. Water is removed (reactive distillation) to drive the equilibrium and the ester is purified by distillation. Two other commercial routes are the Tishchenko condensation of two acetaldehyde molecules over an aluminium alkoxide catalyst, and the direct vapour-phase addition of ethylene to acetic acid (Showa Denko's AVADA process). It is a major low-toxicity solvent for coatings, inks and adhesives.",
    },
    manufacturers: [
      { name: "Celanese", url: "https://www.celanese.com" },
      { name: "Jubilant Ingrevia", url: "https://www.jubilantingrevia.com" },
      { name: "Daicel Corporation", url: "https://www.daicel.com" },
      { name: "Sasol", url: "https://www.sasol.com" },
    ],
    sources: [
      { name: "Wikipedia, Ethyl acetate", url: "https://en.wikipedia.org/wiki/Ethyl_acetate" },
      { name: "ChemicalBook, Ethyl acetate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854142.htm" },
      { name: "Celanese, Ethyl acetate", url: "https://www.celanese.com/products/ethyl-acetate" },
    ],
  },

  tetrahydrofuran: {
    routes: [
      "Acid-catalysed dehydration/cyclisation of 1,4-butanediol",
      "Hydrogenation of maleic anhydride (Davy route)",
      "Acetoxylation of butadiene; oxidation of n-butane to maleic anhydride upstream",
    ],
    mainProcess: {
      name: "Dehydrocyclisation of 1,4-butanediol",
      detail:
        "Tetrahydrofuran (THF) is most commonly made by the acid-catalysed dehydration and cyclisation of 1,4-butanediol: HO(CH2)4OH → THF + H2O, over an acidic catalyst at moderate temperature, then purified by distillation. Much butanediol/THF is also made by the Davy process, hydrogenating maleic anhydride (from n-butane oxidation) via dimethyl maleate. Reppe (acetylene + formaldehyde) and butadiene-acetoxylation routes also feed the chain. THF is a strong aprotic solvent and the monomer for polytetramethylene ether glycol (spandex).",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Dairen Chemical", url: "https://www.dcc.com.tw" },
      { name: "Mitsubishi Chemical Group", url: "https://www.mcgc.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
    ],
    sources: [
      { name: "Wikipedia, Tetrahydrofuran (production)", url: "https://en.wikipedia.org/wiki/Tetrahydrofuran" },
      { name: "Wikipedia, 1,4-Butanediol", url: "https://en.wikipedia.org/wiki/1,4-Butanediol" },
      { name: "ChemicalBook, Tetrahydrofuran", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1854098.htm" },
    ],
  },

  "monochloro-difluoro-methane-r-22": {
    routes: [
      "Hydrofluorination of chloroform with HF over an antimony catalyst",
      "Distillation/separation from R-21 and HCl by-product",
    ],
    mainProcess: {
      name: "Chloroform hydrofluorination",
      detail:
        "Chlorodifluoromethane (R-22, HCFC-22) is made by reacting chloroform with anhydrous hydrogen fluoride over an antimony pentachloride/pentafluoride catalyst: CHCl3 + 2 HF → CHClF2 + 2 HCl. Fluorine progressively replaces chlorine; conditions are controlled to favour the difluoro (R-22) product over R-21 and R-23, and the gas is scrubbed of HCl and distilled. As an ozone-depleting HCFC it is being phased out under the Montreal Protocol for refrigerant use, but it remains an important feedstock for making PTFE/fluoropolymers (via pyrolysis to tetrafluoroethylene).",
    },
    manufacturers: [
      { name: "Gujarat Fluorochemicals", url: "https://www.gfl.co.in" },
      { name: "Navin Fluorine International", url: "https://www.nfil.in" },
      { name: "The Chemours Company", url: "https://www.chemours.com" },
      { name: "Arkema", url: "https://www.arkema.com" },
    ],
    sources: [
      { name: "Wikipedia, Chlorodifluoromethane (R-22)", url: "https://en.wikipedia.org/wiki/Chlorodifluoromethane" },
      { name: "US EPA, Phaseout of class II ODS (HCFCs)", url: "https://www.epa.gov/ods-phaseout/phaseout-class-ii-ozone-depleting-substances" },
      { name: "ChemicalBook, Chlorodifluoromethane", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852632.htm" },
    ],
  },

  "trimethylolpropane-x": {
    routes: [
      "Aldol condensation of n-butyraldehyde with formaldehyde, then crossed-Cannizzaro reduction",
    ],
    mainProcess: {
      name: "Butyraldehyde + formaldehyde (aldol / Cannizzaro)",
      detail:
        "Trimethylolpropane (TMP) is made from n-butyraldehyde and formaldehyde. Under basic catalysis the butyraldehyde first undergoes a double aldol addition with two formaldehyde molecules to give a dimethylol-butyraldehyde, and a third formaldehyde then reduces the remaining aldehyde to a hydroxymethyl group via a crossed-Cannizzaro reaction (consuming base, e.g. NaOH, and producing sodium formate). The result is the triol TMP, which is purified by extraction and distillation. It is a key polyol for alkyd resins, polyurethanes, synthetic lubricants and acrylate crosslinkers.",
    },
    manufacturers: [
      { name: "Perstorp", url: "https://www.perstorp.com" },
      { name: "OQ Chemicals", url: "https://www.oq.com" },
      { name: "Mitsubishi Gas Chemical", url: "https://www.mgc.co.jp/eng/" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
    ],
    sources: [
      { name: "Wikipedia, Trimethylolpropane", url: "https://en.wikipedia.org/wiki/Trimethylolpropane" },
      { name: "Perstorp, TMP", url: "https://www.perstorp.com/en/products/trimethylolpropane_tmp" },
      { name: "ChemicalBook, Trimethylolpropane", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6125327.htm" },
    ],
  },

  "methacrylic-anhydride": {
    routes: [
      "Dehydration of methacrylic acid (with acetic anhydride exchange)",
      "Reaction of methacrylic acid/methacryloyl chloride routes",
    ],
    mainProcess: {
      name: "Methacrylic acid dehydration / anhydride exchange",
      detail:
        "Methacrylic anhydride is made from methacrylic acid (itself from the MMA/C4 chain). The most common industrial approach is an anhydride-exchange (transanhydridisation) in which methacrylic acid is reacted with acetic anhydride; the equilibrium is driven by distilling off the more volatile acetic acid, leaving methacrylic anhydride. A polymerisation inhibitor is present throughout, and the product is purified by vacuum distillation under anhydrous conditions. It is used to introduce polymerisable methacrylate groups (e.g. GelMA hydrogels, dental and specialty monomers).",
    },
    manufacturers: [
      { name: "Röhm", url: "https://www.roehm.com" },
      { name: "Mitsubishi Chemical Group", url: "https://www.mcgc.com" },
    ],
    sources: [
      { name: "Wikipedia, Methacrylic anhydride", url: "https://en.wikipedia.org/wiki/Methacrylic_anhydride" },
      { name: "ChemicalBook, Methacrylic anhydride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6112079.htm" },
      { name: "Röhm, Methacrylate monomers", url: "https://www.roehm.com/en/products-industries/methacrylate-monomers" },
    ],
  },

  "neodecanoyl-chloride": {
    routes: [
      "Reaction of neodecanoic acid with thionyl chloride or phosgene",
    ],
    mainProcess: {
      name: "Neodecanoic acid + thionyl chloride",
      detail:
        "Neodecanoyl chloride is the acid chloride of neodecanoic acid (a highly branched, tertiary 'Versatic' C10 carboxylic acid made by Koch carbonylation of a branched nonene with carbon monoxide and water). The acid is converted to its acid chloride by reacting it with a chlorinating agent such as thionyl chloride or phosgene: RCOOH + SOCl2 → RCOCl + SO2 + HCl. The product is purified by distillation under anhydrous conditions. Its main use is making tertiary peroxyesters (e.g. peroxy-neodecanoates), which are low-temperature radical initiators for PVC and acrylic polymerisation.",
    },
    manufacturers: [
      { name: "Nouryon", url: "https://www.nouryon.com" },
      { name: "Westlake Epoxy (Versatic acids)", url: "https://www.westlake.com" },
    ],
    sources: [
      { name: "Wikipedia, Neodecanoic acid (Versatic 10)", url: "https://en.wikipedia.org/wiki/Neodecanoic_acid" },
      { name: "Nouryon, Organic peroxides", url: "https://www.nouryon.com/products/organic-peroxides/" },
      { name: "ChemicalBook, Neodecanoyl chloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5852153.htm" },
    ],
  },

  "di-isononyl-phthalate-details-as-per": {
    routes: [
      "Esterification of phthalic anhydride with isononanol (2 mol)",
      "Hydroformylation of octenes to isononanol upstream",
    ],
    mainProcess: {
      name: "Phthalic anhydride + isononanol esterification",
      detail:
        "Di-isononyl phthalate (DINP), a general-purpose plasticiser, is made by esterifying phthalic anhydride with two moles of isononyl alcohol (a branched C9 oxo-alcohol from octene hydroformylation). The anhydride first opens to the mono-ester rapidly, and a catalyst (e.g. titanate or acid) drives the second esterification at ~200-230 °C with continuous water removal: phthalic anhydride + 2 C9H19OH → DINP + H2O. The crude ester is neutralised, washed, steam-stripped of excess alcohol and carbon-treated to a clear, low-odour product used mainly to soften PVC.",
    },
    manufacturers: [
      { name: "ExxonMobil Chemical (Jayflex)", url: "https://www.exxonmobilchemical.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
      { name: "Nan Ya Plastics", url: "https://www.nanya.com" },
    ],
    sources: [
      { name: "Wikipedia, Diisononyl phthalate", url: "https://en.wikipedia.org/wiki/Diisononyl_phthalate" },
      { name: "ExxonMobil, Jayflex DINP plasticizer", url: "https://www.exxonmobilchemical.com/en/products/plasticizers/jayflex-dinp" },
      { name: "ChemicalBook, Diisononyl phthalate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1230086.htm" },
    ],
  },

  "methyl-paraben-bp-usp": {
    routes: [
      "Fischer esterification of para-hydroxybenzoic acid with methanol",
    ],
    mainProcess: {
      name: "Esterification of p-hydroxybenzoic acid with methanol",
      detail:
        "Methylparaben (methyl 4-hydroxybenzoate) is made by the acid-catalysed esterification of para-hydroxybenzoic acid (PHBA, made by the Kolbe-Schmitt carboxylation of potassium phenoxide) with methanol: HO-C6H4-COOH + CH3OH ⇌ HO-C6H4-COOCH3 + H2O. Sulfuric acid catalyses the reaction under reflux with excess methanol; the product is neutralised, the methanol recovered, and the ester recrystallised to a white pharmacopoeial (BP/USP) powder. It is a widely used antimicrobial preservative in cosmetics, pharmaceuticals and foods.",
    },
    manufacturers: [
      { name: "Sharon Laboratories", url: "https://www.sharon-labs.com" },
      { name: "Clariant", url: "https://www.clariant.com" },
    ],
    sources: [
      { name: "Wikipedia, Methylparaben", url: "https://en.wikipedia.org/wiki/Methylparaben" },
      { name: "ChemicalBook, Methylparaben", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852634.htm" },
      { name: "Sharon Laboratories, Parabens", url: "https://www.sharon-labs.com/preservatives/" },
    ],
  },

  "laboratory-chemical-resorcinol-acs-99": {
    routes: [
      "Benzene → benzene-1,3-disulfonic acid → caustic (alkali) fusion to resorcinol",
      "Oxidation of meta-diisopropylbenzene (cumene-type hydroperoxide route)",
    ],
    mainProcess: {
      name: "Benzene disulfonation + alkali fusion",
      detail:
        "Resorcinol (benzene-1,3-diol) is made classically from benzene. Benzene is disulfonated with oleum to benzene-1,3-disulfonic acid, which is then fused with molten sodium hydroxide (alkali fusion) at high temperature so both sulfonate groups are replaced by hydroxyls; acidification gives resorcinol, purified by distillation/crystallisation. A modern alternative oxidises meta-diisopropylbenzene to its dihydroperoxide and cleaves it (a double cumene process) to resorcinol plus acetone. It is used in resorcinol-formaldehyde adhesives (tyre cord), UV stabilisers, dyes and pharmaceuticals.",
    },
    manufacturers: [
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Resorcinol (production)", url: "https://en.wikipedia.org/wiki/Resorcinol" },
      { name: "Atul Ltd, Resorcinol", url: "https://www.atul.co.in/products/aromatics" },
      { name: "ChemicalBook, Resorcinol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB2854211.htm" },
    ],
  },

  "p-toluenesulfonic-acid-monohydrate-acs": {
    routes: [
      "Sulfonation of toluene with sulfuric acid/oleum (para-selective)",
      "Crystallisation of the monohydrate from the sulfonation mass",
    ],
    mainProcess: {
      name: "Toluene sulfonation",
      detail:
        "para-Toluenesulfonic acid (pTSA) is made by sulfonating toluene with concentrated sulfuric acid or oleum; at higher temperature the para isomer dominates over ortho: C6H5CH3 + H2SO4 → p-CH3C6H4SO3H + H2O. The water (and ortho isomer) are managed to push para selectivity, and the product is isolated by crystallisation as the monohydrate (pTSA·H2O). It is a strong, non-oxidising, fat-soluble organic acid catalyst widely used for esterifications, acetal/ketal formation, resin curing and as an acid source in organic synthesis.",
    },
    manufacturers: [
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
    ],
    sources: [
      { name: "Wikipedia, p-Toluenesulfonic acid", url: "https://en.wikipedia.org/wiki/P-Toluenesulfonic_acid" },
      { name: "ChemicalBook, p-Toluenesulfonic acid monohydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7159418.htm" },
      { name: "Atul Ltd, Sulfones/sulfonic acids", url: "https://www.atul.co.in/products/aromatics" },
    ],
  },

  "sodium-meta-nitro-benzene-sulphonate": {
    routes: [
      "Sulfonation of nitrobenzene to m-nitrobenzenesulfonic acid, then neutralisation to the sodium salt",
      "Nitration of benzenesulfonic acid (meta-directing), then salification",
    ],
    mainProcess: {
      name: "Nitrobenzene sulfonation / benzenesulfonic acid nitration",
      detail:
        "Sodium meta-nitrobenzenesulfonate (a mild oxidant/anti-reduction agent, 'Ludigol'-type) is made by introducing both a nitro and a sulfonic group meta to each other on benzene. Either nitrobenzene is sulfonated with oleum (the nitro group directs meta) to m-nitrobenzenesulfonic acid, or benzenesulfonic acid is nitrated; the acid is then neutralised with sodium hydroxide or soda ash and crystallised as the sodium salt. It is used in reactive/vat textile dyeing as an oxidation/anti-reduction agent and as an intermediate for metanilic acid and dyes.",
    },
    manufacturers: [
      { name: "Archroma", url: "https://www.archroma.com" },
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
    ],
    sources: [
      { name: "ChemicalBook, Sodium 3-nitrobenzenesulfonate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4318188.htm" },
      { name: "Archroma, Textile specialties", url: "https://www.archroma.com/markets/textiles" },
      { name: "PubChem, Sodium 3-nitrobenzenesulfonate", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-3-nitrobenzenesulfonate" },
    ],
  },

  "glycine-usp-packing-x-bags-shrink": {
    routes: [
      "Strecker-type / chloroacetic acid ammonolysis (amination with ammonia)",
      "Hydrolysis of aminoacetonitrile (from formaldehyde + HCN + ammonia)",
    ],
    mainProcess: {
      name: "Chloroacetic acid ammonolysis",
      detail:
        "Glycine, the simplest amino acid, is most commonly made by reacting chloroacetic acid (or its ester) with a large excess of ammonia, often with hexamethylenetetramine/urotropine as a catalyst, which aminates the alpha-carbon: ClCH2COOH + 2 NH3 → H2NCH2COOH + NH4Cl. The excess ammonia suppresses formation of secondary (iminodiacetic) products, and the glycine is separated from ammonium chloride and crystallised to technical, feed or USP grade. An alternative hydrolyses aminoacetonitrile (made from formaldehyde, HCN and ammonia). It is used in food, pharmaceuticals and as a buffer.",
    },
    manufacturers: [
      { name: "Resonac (Showa Denko)", url: "https://www.resonac.com" },
      { name: "Ajinomoto", url: "https://www.ajinomoto.com" },
      { name: "Chattem Chemicals", url: "https://www.chattemchemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Glycine (chemical synthesis)", url: "https://en.wikipedia.org/wiki/Glycine" },
      { name: "ChemicalBook, Glycine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854227.htm" },
      { name: "Chattem Chemicals, Glycine", url: "https://www.chattemchemicals.com/products/" },
    ],
  },

  "sorbitol-solution-usp-non-crystalline": {
    routes: [
      "Catalytic hydrogenation of glucose (dextrose) syrup over Raney nickel",
      "Concentration to 70% non-crystallising solution",
    ],
    mainProcess: {
      name: "Catalytic hydrogenation of glucose",
      detail:
        "Sorbitol is made by the high-pressure catalytic hydrogenation of glucose (dextrose) syrup, derived from starch. The purified glucose solution is hydrogenated over a Raney-nickel (or supported ruthenium) catalyst at ~120-150 °C and high hydrogen pressure, reducing the aldehyde group to a primary alcohol: C6H12O6 + H2 → C6H14O6. The catalyst is filtered off, the solution is ion-exchange purified and carbon-treated, then concentrated to a ~70% 'non-crystallising' sorbitol solution (USP). It is a humectant, sweetener and excipient in food, oral care and pharmaceuticals.",
    },
    manufacturers: [
      { name: "Roquette", url: "https://www.roquette.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "ADM", url: "https://www.adm.com" },
      { name: "Gulshan Polyols", url: "https://www.gulshanindia.com" },
    ],
    sources: [
      { name: "Wikipedia, Sorbitol (production)", url: "https://en.wikipedia.org/wiki/Sorbitol" },
      { name: "Roquette, Sorbitol", url: "https://www.roquette.com/industries/pharmaceuticals/sorbitol" },
      { name: "ChemicalBook, Sorbitol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854175.htm" },
    ],
  },

  "finawax-e-beads-erucamide": {
    routes: [
      "Amidation of erucic acid (from high-erucic rapeseed/mustard oil) with ammonia",
      "Dehydration of the ammonium erucate to the primary amide",
    ],
    mainProcess: {
      name: "Erucic acid + ammonia amidation",
      detail:
        "Erucamide (the primary amide of erucic acid, a C22 mono-unsaturated fatty acid) is a slip/anti-block additive for polyolefin films. It is made by reacting erucic acid, obtained by splitting high-erucic rapeseed or mustard oil, with ammonia at elevated temperature, first forming the ammonium soap and then dehydrating it to the amide: C21H41COOH + NH3 → C21H41CONH2 + H2O. The molten amide is purified and solidified into beads/flakes (e.g. Finawax-E). Migrating to the film surface, it reduces friction (slip) and prevents sheets sticking (anti-block).",
    },
    manufacturers: [
      { name: "Fine Organics", url: "https://www.fineorganics.com" },
      { name: "Croda International", url: "https://www.croda.com" },
      { name: "PMC Biogenix", url: "https://www.pmcbiogenix.com" },
    ],
    sources: [
      { name: "Wikipedia, Erucamide", url: "https://en.wikipedia.org/wiki/Erucamide" },
      { name: "Fine Organics, Slip additives", url: "https://www.fineorganics.com/products" },
      { name: "ChemicalBook, Erucamide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB8246171.htm" },
    ],
  },

  "round-camphor": {
    routes: [
      "Synthetic from alpha-pinene via camphene, then esterification/oxidation",
      "Natural distillation from camphor laurel wood (minor)",
    ],
    mainProcess: {
      name: "Synthetic camphor from alpha-pinene",
      detail:
        "Most commercial camphor is synthetic, made from alpha-pinene (turpentine). Alpha-pinene is acid-isomerised to camphene; camphene is reacted with a carboxylic acid (e.g. acetic/formic) to give isobornyl ester, which is hydrolysed to isoborneol; isoborneol is then dehydrogenated/oxidised over a copper catalyst to camphor. The crude is purified by sublimation and pressed into tablets/blocks ('round' camphor). It is used in religious/medicinal products, as a plasticiser and moth repellent, and in topical preparations.",
    },
    manufacturers: [
      { name: "Oriental Aromatics", url: "https://www.orientalaromatics.com" },
      { name: "Mangalam Organics", url: "https://www.mangalamorganics.com" },
      { name: "Kanchi Karpooram", url: "https://www.kanchikarpooram.com" },
    ],
    sources: [
      { name: "Wikipedia, Camphor (production)", url: "https://en.wikipedia.org/wiki/Camphor" },
      { name: "Mangalam Organics, Camphor", url: "https://www.mangalamorganics.com/camphor/" },
      { name: "ChemicalBook, Camphor", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854237.htm" },
    ],
  },

  "allyl-isothiocyanate": {
    routes: [
      "Reaction of allyl chloride with a thiocyanate salt, then thermal isomerisation",
      "Enzymatic release from sinigrin in mustard seed (natural)",
    ],
    mainProcess: {
      name: "Allyl chloride + thiocyanate (then isomerisation)",
      detail:
        "Synthetic allyl isothiocyanate ('volatile/synthetic mustard oil') is made by reacting allyl chloride with an inorganic thiocyanate (sodium or potassium thiocyanate) to give allyl thiocyanate, which on heating isomerises to the more stable allyl isothiocyanate: CH2=CHCH2Cl + KSCN → CH2=CHCH2SCN → CH2=CHCH2NCS. The product is purified by distillation. Naturally it is generated when the enzyme myrosinase hydrolyses sinigrin in crushed black/brown mustard seed. It is used as a flavour (mustard/horseradish), a fumigant/antimicrobial and a chemical intermediate.",
    },
    manufacturers: [
      { name: "Penta Manufacturing", url: "https://www.pentamfg.com" },
      { name: "Vigon International", url: "https://www.vigon.com" },
    ],
    sources: [
      { name: "Wikipedia, Allyl isothiocyanate", url: "https://en.wikipedia.org/wiki/Allyl_isothiocyanate" },
      { name: "ChemicalBook, Allyl isothiocyanate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4854216.htm" },
      { name: "PubChem, Allyl isothiocyanate", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Allyl-isothiocyanate" },
    ],
  },

  "acetyl-iso-eugenol": {
    routes: [
      "Acetylation of isoeugenol with acetic anhydride",
      "Upstream: isomerisation of eugenol to isoeugenol",
    ],
    mainProcess: {
      name: "Acetylation of isoeugenol",
      detail:
        "Acetyl isoeugenol (isoeugenyl acetate), a clove/carnation-spicy fragrance material, is made by acetylating isoeugenol. Eugenol (from clove oil or synthesised from guaiacol) is first base-isomerised to isoeugenol (shifting the allyl double bond into conjugation); the phenolic hydroxyl is then esterified with acetic anhydride (with a base or acid catalyst): isoeugenol + (CH3CO)2O → isoeugenyl acetate + CH3COOH. The product is washed and vacuum-distilled to a fragrance-grade material used in perfumery and as a fixative.",
    },
    manufacturers: [
      { name: "Privi Speciality Chemicals", url: "https://www.privi.com" },
      { name: "Vigon International", url: "https://www.vigon.com" },
    ],
    sources: [
      { name: "ChemicalBook, Isoeugenol acetate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5292533.htm" },
      { name: "Wikipedia, Isoeugenol", url: "https://en.wikipedia.org/wiki/Isoeugenol" },
      { name: "The Good Scents Company, Isoeugenyl acetate", url: "http://www.thegoodscentscompany.com/data/rw1009431.html" },
    ],
  },

  "cholesterol-for-parenteral-use": {
    routes: [
      "Extraction and purification from wool grease (lanolin)",
      "From plant sterols / fish-oil sources (non-animal grades)",
    ],
    mainProcess: {
      name: "Purification from wool grease (lanolin)",
      detail:
        "Pharmaceutical cholesterol is mainly isolated from wool grease (lanolin), the fatty coating of sheep's wool. The lanolin is saponified to separate the wool-alcohol (sterol) fraction, from which cholesterol is concentrated by solvent crystallisation and chromatographic/complexation purification (and bromination-debromination to remove related sterols) to high purity. Tight controls on purity, endotoxin and TSE/BSE risk are required for parenteral/injectable use (e.g. liposomes, lipid nanoparticles for vaccines). Non-animal grades are produced from plant sterols or fish oils.",
    },
    manufacturers: [
      { name: "Dishman Carbogen Amcis", url: "https://www.dishmangroup.com" },
      { name: "Nippon Fine Chemical", url: "https://www.nfc.gr.jp" },
      { name: "Croda International", url: "https://www.croda.com" },
    ],
    sources: [
      { name: "Wikipedia, Cholesterol (industrial)", url: "https://en.wikipedia.org/wiki/Cholesterol" },
      { name: "Dishman, Cholesterol & derivatives", url: "https://www.dishmangroup.com/cholesterol-and-related-products" },
      { name: "ChemicalBook, Cholesterol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854175.htm" },
    ],
  },

  "n-acetyl-l-cysteine": {
    routes: [
      "Acetylation of L-cysteine with acetic anhydride",
      "Upstream L-cysteine from keratin hydrolysis or fermentation",
    ],
    mainProcess: {
      name: "Acetylation of L-cysteine",
      detail:
        "N-acetyl-L-cysteine (NAC) is made by selectively acetylating the amino group of L-cysteine with acetic anhydride under controlled pH so the thiol is preserved: HSCH2CH(NH2)COOH + (CH3CO)2O → HSCH2CH(NHCOCH3)COOH + CH3COOH. The reaction is run cold/under inert atmosphere to avoid oxidising the -SH to a disulfide, then the product is crystallised and purified to pharmacopoeial grade. The upstream L-cysteine comes from acid hydrolysis of keratin (hair/feathers) or, increasingly, microbial fermentation. NAC is a mucolytic, a paracetamol-overdose antidote and an antioxidant supplement.",
    },
    manufacturers: [
      { name: "Zambon", url: "https://www.zambon.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Acetylcysteine", url: "https://en.wikipedia.org/wiki/Acetylcysteine" },
      { name: "ChemicalBook, N-Acetyl-L-cysteine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3852915.htm" },
      { name: "PharmaCompass, Acetylcysteine", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/acetylcysteine" },
    ],
  },

  "cyclohexanecarboxylic-acid-x": {
    routes: [
      "Catalytic ring hydrogenation of benzoic acid",
    ],
    mainProcess: {
      name: "Hydrogenation of benzoic acid",
      detail:
        "Cyclohexanecarboxylic acid (hexahydrobenzoic acid) is made by the catalytic hydrogenation of benzoic acid, saturating the aromatic ring over a palladium- or nickel-on-support catalyst at elevated temperature and hydrogen pressure: C6H5COOH + 3 H2 → C6H11COOH. The product is purified by distillation/crystallisation. It is an intermediate for caprolactam (in one route), for the antiparasitic praziquantel and other pharmaceuticals, and for specialty esters and metal-carboxylate driers.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
    ],
    sources: [
      { name: "Wikipedia, Cyclohexanecarboxylic acid", url: "https://en.wikipedia.org/wiki/Cyclohexanecarboxylic_acid" },
      { name: "ChemicalBook, Cyclohexanecarboxylic acid", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7852616.htm" },
      { name: "PubChem, Cyclohexanecarboxylic acid", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Cyclohexanecarboxylic-acid" },
    ],
  },

  "aroma-chemicals-methyl-ionone": {
    routes: [
      "Aldol condensation of citral with methyl ethyl ketone (butanone) to pseudo-methylionones",
      "Acid-catalysed cyclisation to alpha-/beta-methylionone isomers",
    ],
    mainProcess: {
      name: "Citral + butanone condensation, then cyclisation",
      detail:
        "Methylionone (a violet/orris-type fragrance) is made from citral. Citral undergoes a base-catalysed aldol (Claisen-Schmidt) condensation with methyl ethyl ketone (2-butanone) to give a 'pseudo-methylionone' open-chain ketone; this is then cyclised with an acid catalyst (e.g. sulfuric or phosphoric acid), and the ring-closure conditions determine the ratio of alpha-, beta- and iso-methylionone isomers. The product is purified by vacuum distillation. Methylionones are major perfumery ingredients valued for their soft, powdery violet character.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Privi Speciality Chemicals", url: "https://www.privi.com" },
      { name: "Symrise", url: "https://www.symrise.com" },
    ],
    sources: [
      { name: "Wikipedia, Ionone", url: "https://en.wikipedia.org/wiki/Ionone" },
      { name: "The Good Scents Company, Methyl ionone", url: "http://www.thegoodscentscompany.com/data/rw1004471.html" },
      { name: "ChemicalBook, alpha-Methylionone", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB9854255.htm" },
    ],
  },

  "metronidazole-u-s-p-tax-invoice": {
    routes: [
      "Nitration of 2-methylimidazole to 2-methyl-5-nitroimidazole, then N-alkylation with ethylene oxide",
      "N-(2-hydroxyethyl)ation via ethylene chlorohydrin (alternative)",
    ],
    mainProcess: {
      name: "2-Methyl-5-nitroimidazole hydroxyethylation",
      detail:
        "Metronidazole, a 5-nitroimidazole antibacterial/antiprotozoal, is made in two main steps. 2-Methylimidazole is nitrated with mixed acid to 2-methyl-5-nitroimidazole. This is then N-1 alkylated with ethylene oxide (or ethylene chlorohydrin) under acid catalysis to attach the 2-hydroxyethyl group, giving metronidazole: 2-methyl-5-nitroimidazole + C2H4O → metronidazole. The crude is purified by recrystallisation to USP grade. It is one of the most widely used drugs for anaerobic and protozoal infections.",
    },
    manufacturers: [
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
      { name: "Sanofi (originator, Flagyl)", url: "https://www.sanofi.com" },
    ],
    sources: [
      { name: "Wikipedia, Metronidazole", url: "https://en.wikipedia.org/wiki/Metronidazole" },
      { name: "PharmaCompass, Metronidazole manufacturers", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/metronidazole" },
      { name: "Procurement Resource, Metronidazole process", url: "https://www.procurementresource.com/reports/metronidazole-manufacturing-plant-project-report" },
    ],
  },

  "active-pharmaceutical-ingredient-chlorpheniramine-maleate-bp": {
    routes: [
      "Alkylate 4-chlorophenyl-(2-pyridyl)acetonitrile with 2-(dimethylamino)ethyl chloride, then decyanate; form maleate salt",
    ],
    mainProcess: {
      name: "Diaryl-acetonitrile alkylation + maleate salt",
      detail:
        "Chlorpheniramine, a first-generation antihistamine, is built on a 3-(4-chlorophenyl)-3-(2-pyridyl)propylamine skeleton. 4-Chlorophenyl-(2-pyridyl)acetonitrile is N-alkylated at its acidic benzylic carbon with 2-(dimethylamino)ethyl chloride under strong base to attach the dimethylaminoethyl chain; the remaining nitrile is then removed by hydrolysis/decarboxylation to give chlorpheniramine base. The base is finally reacted with maleic acid to crystallise chlorpheniramine maleate (BP) of high purity. It is widely used for allergy and cold preparations.",
    },
    manufacturers: [
      { name: "Supriya Lifescience", url: "https://www.supriyalifescience.com" },
      { name: "GSK (originator, Piriton)", url: "https://www.gsk.com" },
    ],
    sources: [
      { name: "Wikipedia, Chlorphenamine", url: "https://en.wikipedia.org/wiki/Chlorphenamine" },
      { name: "Supriya Lifescience, Antihistamines", url: "https://www.supriyalifescience.com/product-portfolio/" },
      { name: "PharmaCompass, Chlorpheniramine maleate", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/chlorpheniramine-maleate" },
    ],
  },

  "cephalexin-monohydrate-bp-usp-ep-cephalexin": {
    routes: [
      "Acylation of 7-ADCA with D-phenylglycine (enzymatic or chemical side-chain coupling)",
      "Upstream 7-ADCA from ring expansion of penicillin G",
    ],
    mainProcess: {
      name: "7-ADCA acylation with D-phenylglycine",
      detail:
        "Cephalexin is a semi-synthetic oral cephalosporin made from the beta-lactam nucleus 7-aminodeacetoxycephalosporanic acid (7-ADCA), itself produced by ring-expanding penicillin G. The D-phenylglycine side chain is then coupled to the 7-amino group of 7-ADCA, increasingly by an immobilised penicillin-acylase enzyme using the phenylglycine amide/ester under mild aqueous conditions (greener than the older chemical acylation via a Dane salt/mixed anhydride). The product is crystallised as cephalexin monohydrate to BP/USP/EP grade.",
    },
    manufacturers: [
      { name: "Centrient Pharmaceuticals", url: "https://centrient.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "ACS Dobfar", url: "https://www.acsdobfar.com" },
    ],
    sources: [
      { name: "Wikipedia, Cefalexin", url: "https://en.wikipedia.org/wiki/Cefalexin" },
      { name: "Centrient, Enzymatic cephalosporins", url: "https://centrient.com/our-products/cephalosporins" },
      { name: "PharmaCompass, Cephalexin", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/cefalexin" },
    ],
  },

  "hydroxyurea-capsule": {
    routes: [
      "Reaction of hydroxylamine salt with an alkali cyanate",
      "Reaction of hydroxylamine with urea (thermal)",
    ],
    mainProcess: {
      name: "Hydroxylamine + cyanate",
      detail:
        "Hydroxyurea (hydroxycarbamide) is made by reacting a hydroxylamine salt with an alkali metal cyanate. Hydroxylamine hydrochloride (or sulfate) reacts with sodium or potassium cyanate in water, the hydroxylamine nitrogen adding to the cyanate to give hydroxyurea: NH2OH + NaOCN → H2N-CO-NHOH + Na+ (net). The product is concentrated and crystallised, and purified to pharmacopoeial grade. An alternative heats hydroxylamine with urea. Hydroxyurea is an antineoplastic/ribonucleotide-reductase inhibitor used in sickle-cell disease and some leukaemias.",
    },
    manufacturers: [
      { name: "Bristol Myers Squibb (originator, Hydrea)", url: "https://www.bms.com" },
      { name: "Shilpa Medicare", url: "https://www.shilpamedicare.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
    ],
    sources: [
      { name: "Wikipedia, Hydroxycarbamide", url: "https://en.wikipedia.org/wiki/Hydroxycarbamide" },
      { name: "ChemicalBook, Hydroxyurea", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5274408.htm" },
      { name: "PharmaCompass, Hydroxyurea", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/hydroxyurea" },
    ],
  },

  "phr1009-caffeine-for-further-sale": {
    routes: [
      "Traube-type synthesis from dimethylurea + cyanoacetic acid, then methylation",
      "Methylation of theobromine / theophylline",
      "Recovery from coffee/tea decaffeination",
    ],
    mainProcess: {
      name: "Synthetic methylxanthine route",
      detail:
        "Synthetic caffeine (1,3,7-trimethylxanthine) is made by building and then methylating the xanthine ring. In the common route, N,N-dimethylurea and cyanoacetic acid are condensed and cyclised (Traube synthesis) to a dimethyl-aminouracil, which is nitrosated, reduced and ring-closed to theophylline/theobromine; exhaustive N-methylation (with dimethyl sulfate or methyl chloride under base) then gives caffeine. Large volumes are also recovered as a by-product of coffee and tea decaffeination. The product is crystallised to pharmacopoeial grade for beverages and pharmaceuticals.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "CSPC Pharmaceutical Group", url: "https://www.cspc.com.cn" },
      { name: "Kudos Chemie", url: "https://www.kudoschemie.com" },
    ],
    sources: [
      { name: "Wikipedia, Caffeine (synthesis)", url: "https://en.wikipedia.org/wiki/Caffeine" },
      { name: "ChemicalBook, Caffeine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3852793.htm" },
      { name: "Kudos Chemie, Caffeine", url: "https://www.kudoschemie.com/caffeine.php" },
    ],
  },

  "amoxycillin-trihydrate-through-6-apa-route-through": {
    routes: [
      "Acylation of 6-APA with D-(-)-p-hydroxyphenylglycine (enzymatic or chemical)",
      "Crystallisation as the trihydrate",
    ],
    mainProcess: {
      name: "6-APA acylation with hydroxyphenylglycine",
      detail:
        "Amoxicillin is a semi-synthetic aminopenicillin made from the penicillin nucleus 6-aminopenicillanic acid (6-APA). The D-(-)-para-hydroxyphenylglycine side chain is coupled to the 6-amino group of 6-APA, increasingly by an immobilised penicillin-acylase enzyme using the activated glycine amide/ester in water (the green route), replacing the older chemical acylation via a Dane salt/mixed anhydride in cold chlorinated solvent. The product is crystallised at its isoelectric point as amoxicillin trihydrate to pharmacopoeial grade. It is one of the most widely used oral antibiotics.",
    },
    manufacturers: [
      { name: "Centrient Pharmaceuticals", url: "https://centrient.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "The United Laboratories", url: "https://www.tul.com.hk" },
      { name: "Sandoz", url: "https://www.sandoz.com" },
    ],
    sources: [
      { name: "Wikipedia, Amoxicillin", url: "https://en.wikipedia.org/wiki/Amoxicillin" },
      { name: "Centrient, Enzymatic amoxicillin", url: "https://centrient.com/our-products/penicillins" },
      { name: "ScienceDirect, Enzymatic amoxicillin synthesis", url: "https://www.sciencedirect.com/science/article/abs/pii/S1359511309002475" },
    ],
  },

  "halquinol-bp": {
    routes: [
      "Controlled chlorination of 8-hydroxyquinoline (gives the 5,7-/5-/7-chloro mixture)",
    ],
    mainProcess: {
      name: "Chlorination of 8-hydroxyquinoline",
      detail:
        "Halquinol is a defined mixture of chlorinated 8-hydroxyquinolines, chiefly 5,7-dichloro-8-hydroxyquinoline together with the 5-chloro and 7-chloro isomers. It is made by the controlled chlorination of 8-hydroxyquinoline (itself from the Skraup synthesis on 2-aminophenol) with chlorine or a chlorinating agent in acidic medium; the reaction stoichiometry and conditions are tuned to reproduce the pharmacopoeial (BP) ratio of mono- and di-chloro species. The solid is filtered, washed and dried. It is a broad-spectrum antibacterial used as a veterinary gut-active agent and feed additive.",
    },
    manufacturers: [
      { name: "Stallen South Asia", url: "https://www.stallen.com" },
      { name: "Mayur Dyechem", url: "https://www.mayurdyeschem.com" },
    ],
    sources: [
      { name: "Poultry Trends, Stallen's Halquinol API facility", url: "https://www.poultrytrends.in/stallens-new-api-facility-for-halquinol/" },
      { name: "PharmaCompass, Halquinol", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/halquinol" },
      { name: "Wikipedia, Halquinol", url: "https://en.wikipedia.org/wiki/Halquinol" },
    ],
  },

  "acetaminophen-usp": {
    routes: [
      "Acetylation of para-aminophenol (PAP) with acetic anhydride",
    ],
    mainProcess: {
      name: "para-Aminophenol acetylation",
      detail:
        "Acetaminophen (paracetamol) is made by N-acetylating para-aminophenol (PAP) with acetic anhydride (or acetic acid): HO-C6H4-NH2 + (CH3CO)2O → HO-C6H4-NHCOCH3 + CH3COOH. The reaction is mild and high-yielding; the crude is decolourised with carbon and recrystallised from water to a white USP-grade powder. The upstream PAP comes from the catalytic hydrogenation of nitrobenzene (Bamberger rearrangement) or reduction of p-nitrophenol. It is the world's most widely used analgesic/antipyretic.",
    },
    manufacturers: [
      { name: "Mallinckrodt", url: "https://www.mallinckrodt.com" },
      { name: "Granules India", url: "https://www.granulesindia.com" },
      { name: "Farmson Pharmaceutical", url: "https://www.farmson.com" },
    ],
    sources: [
      { name: "Wikipedia, Paracetamol (synthesis)", url: "https://en.wikipedia.org/wiki/Paracetamol" },
      { name: "ChemicalBook, Acetaminophen", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5854301.htm" },
      { name: "ChemAnalyst, Paracetamol production", url: "https://www.chemanalyst.com/industry-report/paracetamol-market-665" },
    ],
  },

  ibuprofen: {
    routes: [
      "BHC (Hoechst-Celanese) green 3-step: acylation, hydrogenation, Pd-carbonylation",
      "Classic Boots 6-step (Friedel-Crafts, Darzens, hydrolysis...)",
    ],
    mainProcess: {
      name: "BHC three-step catalytic route",
      detail:
        "Modern ibuprofen is made by the atom-economical BHC process. Isobutylbenzene is first Friedel-Crafts acetylated with acetic anhydride (HF catalyst) to 4-isobutylacetophenone; this ketone is hydrogenated to the corresponding 1-aryl-ethanol over Raney nickel; the alcohol is then carbonylated with carbon monoxide and a palladium catalyst to install the carboxylic acid, giving ibuprofen directly. The HF and palladium are recycled, making it far greener than the older six-step Boots route. The product is crystallised to pharmacopoeial grade.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "IOL Chemicals and Pharmaceuticals", url: "https://www.iolcp.com" },
      { name: "SI Group", url: "https://www.siigroup.com" },
      { name: "Solara Active Pharma Sciences", url: "https://www.solara.co.in" },
    ],
    sources: [
      { name: "ACS, BHC ibuprofen green chemistry landmark", url: "https://www.acs.org/education/whatischemistry/landmarks/ibuprofen.html" },
      { name: "Wikipedia, Ibuprofen (synthesis)", url: "https://en.wikipedia.org/wiki/Ibuprofen" },
      { name: "IOLCP, Ibuprofen", url: "https://www.iolcp.com/ibuprofen" },
    ],
  },

  "pitavastatin-calcium-jp": {
    routes: [
      "Couple the cyclopropyl-quinoline aldehyde to the chiral dihydroxy-heptenoate side chain",
      "Wittig/Heck or aldol assembly, deprotect, then form the calcium salt",
    ],
    mainProcess: {
      name: "Quinoline core + chiral statin side chain",
      detail:
        "Pitavastatin is a fully synthetic statin built from a 2-cyclopropyl-4-(4-fluorophenyl)quinoline-3-carbaldehyde core and the statin (3R,5S)-3,5-dihydroxy-6-heptenoate side chain. The side chain, bearing the two defined stereocentres, is constructed on a protected chiral building block and joined to the quinoline aldehyde by an olefination (Wittig/Horner-Wadsworth-Emmons or Heck) to set the E-alkene. The protecting groups and ester are removed, and the resulting hydroxy-acid is converted to the hemicalcium salt and crystallised to JP/USP grade. It is a potent cholesterol-lowering drug.",
    },
    manufacturers: [
      { name: "Kowa (originator, Livalo)", url: "https://www.kowa.co.jp" },
      { name: "Nissan Chemical", url: "https://www.nissanchem.co.jp" },
      { name: "MSN Laboratories", url: "https://www.msnlabs.com" },
    ],
    sources: [
      { name: "Wikipedia, Pitavastatin", url: "https://en.wikipedia.org/wiki/Pitavastatin" },
      { name: "PharmaCompass, Pitavastatin calcium", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/pitavastatin-calcium" },
      { name: "ChemicalBook, Pitavastatin calcium", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1409801.htm" },
    ],
  },

  "diacerein-ep": {
    routes: [
      "Oxidation of aloin/barbaloin (from aloe) to rhein, then diacetylation",
      "From sennoside/anthraquinone feedstocks, then acetylation",
    ],
    mainProcess: {
      name: "Rhein diacetylation",
      detail:
        "Diacerein (diacetylrhein) is a semi-synthetic anthraquinone derived from rhein. Rhein is obtained by oxidising natural aloe constituents, barbaloin/aloin (or aloe-emodin) from Aloe or senna, to the dicarboxylic anthraquinone. Both phenolic hydroxyl groups of rhein are then acetylated with acetic anhydride to give diacerein, which is purified by recrystallisation to EP grade (with tight control of the residual aloe-emodin impurity). It is a slow-acting anti-inflammatory/interleukin-1 inhibitor used for osteoarthritis.",
    },
    manufacturers: [
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Zydus Lifesciences", url: "https://www.zyduslife.com" },
      { name: "Medichem", url: "https://www.medichem.es" },
    ],
    sources: [
      { name: "Wikipedia, Diacerein", url: "https://en.wikipedia.org/wiki/Diacerein" },
      { name: "PharmaCompass, Diacerein", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/diacerein" },
      { name: "ChemicalBook, Diacerein", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4253900.htm" },
    ],
  },

  "albuterol-sulfate-usp": {
    routes: [
      "Bromination/amination of a 4-hydroxyacetophenone derivative with tert-butylamine, then reduction",
      "Resolution/crystallisation, then sulfate salt formation",
    ],
    mainProcess: {
      name: "Aminoketone route to salbutamol, then sulfate",
      detail:
        "Albuterol (salbutamol) is built on a protected 4-hydroxy-3-(hydroxymethyl)acetophenone. The acetophenone is alpha-brominated and then displaced with tert-butylamine to give an amino-ketone; the ketone is reduced (catalytically or with a hydride) to the secondary alcohol, and the protecting groups are removed to give salbutamol base. The base is then reacted with sulfuric acid to crystallise albuterol (salbutamol) hemisulfate to USP grade. It is the leading short-acting beta-2 bronchodilator for asthma/COPD inhalers.",
    },
    manufacturers: [
      { name: "GSK (originator, Ventolin)", url: "https://www.gsk.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
      { name: "Neuland Laboratories", url: "https://www.neulandlabs.com" },
    ],
    sources: [
      { name: "Wikipedia, Salbutamol", url: "https://en.wikipedia.org/wiki/Salbutamol" },
      { name: "PharmaCompass, Salbutamol sulfate", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/salbutamol-sulfate" },
      { name: "ChemicalBook, Albuterol sulfate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3387159.htm" },
    ],
  },

  "propranolol-hydrochloride-usp-supreme-chemicals-gst-33abofs4575k1zk": {
    routes: [
      "React 1-naphthol with epichlorohydrin to the glycidyl ether, then open with isopropylamine; form HCl salt",
    ],
    mainProcess: {
      name: "Naphthyl glycidyl ether + isopropylamine",
      detail:
        "Propranolol, the first widely used beta-blocker, is made from 1-naphthol. 1-Naphthol is O-alkylated with epichlorohydrin under base to give 1-naphthyl glycidyl ether (an epoxide); this epoxide is then opened by isopropylamine, which attacks the less-hindered carbon to install the isopropylaminopropanol side chain characteristic of beta-blockers, giving racemic propranolol. The base is treated with hydrochloric acid and crystallised as propranolol hydrochloride (USP). It is used for hypertension, arrhythmia, angina and anxiety.",
    },
    manufacturers: [
      { name: "AstraZeneca (originator, Inderal)", url: "https://www.astrazeneca.com" },
      { name: "Erregierre", url: "https://www.erregierre.it" },
      { name: "Dishman Carbogen Amcis", url: "https://www.dishmangroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Propranolol", url: "https://en.wikipedia.org/wiki/Propranolol" },
      { name: "ChemicalBook, Propranolol hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5113458.htm" },
      { name: "PharmaCompass, Propranolol hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/propranolol-hydrochloride" },
    ],
  },

  "nicotine-sulphate": {
    routes: [
      "Solvent/steam extraction of nicotine from tobacco, then neutralisation with sulfuric acid",
    ],
    mainProcess: {
      name: "Tobacco extraction + sulfuric acid",
      detail:
        "Nicotine sulfate is made from natural nicotine extracted from tobacco (Nicotiana) leaf and stem waste. The alkaline-treated plant material is extracted with steam or solvent to recover free-base nicotine, which is purified by distillation; the purified nicotine is then neutralised with sulfuric acid to form the stable, non-volatile nicotine sulfate salt, concentrated to a ~40% liquor or solid. Historically a major insecticide, it is now mainly used as an intermediate and (in highly purified pharmaceutical nicotine) for smoking-cessation products.",
    },
    manufacturers: [
      { name: "Nicobrand", url: "https://www.nicobrand.com" },
      { name: "Contraf-Nicotex-Tobacco (CNT)", url: "https://www.cnt-tobacco.com" },
      { name: "Alkaloids Corporation", url: "https://www.alkaloids.com" },
    ],
    sources: [
      { name: "Wikipedia, Nicotine", url: "https://en.wikipedia.org/wiki/Nicotine" },
      { name: "ChemicalBook, Nicotine sulfate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB2229957.htm" },
      { name: "CNT, Nicotine products", url: "https://www.cnt-tobacco.com/products/" },
    ],
  },

  "coenzyme-q10": {
    routes: [
      "Microbial fermentation (yeast / Rhodobacter / Agrobacterium)",
      "Semi-synthesis from solanesol (tobacco-leaf) + the quinone head group",
    ],
    mainProcess: {
      name: "Microbial fermentation",
      detail:
        "Most pharmaceutical/nutraceutical coenzyme Q10 (ubidecarenone) is made by microbial fermentation, which delivers the natural all-trans isomer. Selected yeasts or bacteria (e.g. Rhodobacter sphaeroides, Agrobacterium, or specific yeasts) are grown in fed-batch fermenters where they biosynthesise CoQ10 intracellularly; the biomass is then harvested and the CoQ10 is solvent-extracted, saponified/purified and crystallised. A semi-synthetic route instead couples solanesol (from tobacco leaf) with the substituted benzoquinone ring. It is used as an antioxidant supplement and in cardiology and cosmetics.",
    },
    manufacturers: [
      { name: "Kaneka", url: "https://www.kaneka.co.jp" },
      { name: "Zhejiang NHU", url: "https://www.nhu.com.cn" },
      { name: "Mitsubishi Gas Chemical", url: "https://www.mgc.co.jp/eng/" },
    ],
    sources: [
      { name: "Wikipedia, Coenzyme Q10", url: "https://en.wikipedia.org/wiki/Coenzyme_Q10" },
      { name: "Kaneka, Coenzyme Q10", url: "https://www.kaneka.co.jp/business/health/nbd_007.html" },
      { name: "PMC, Microbial production of CoQ10", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5408984/" },
    ],
  },

  "purac-fcc-drum-l-lactic-acid": {
    routes: [
      "Microbial fermentation of sugar by Lactobacillus, then recovery/purification",
      "Synthetic via lactonitrile hydrolysis (gives racemic acid)",
    ],
    mainProcess: {
      name: "Lactic-acid fermentation",
      detail:
        "Most lactic acid (and essentially all single-enantiomer L-lactic acid) is made by fermentation. A carbohydrate feed (glucose, sucrose, or starch/sugar from corn or cane) is fermented by Lactobacillus bacteria at controlled pH, neutralised with lime or ammonia so the lactate salt accumulates, to give lactic acid at high yield. The broth is then filtered and the acid recovered and purified by acidification/esterification-hydrolysis, ion exchange or electrodialysis to food (FCC), pharmaceutical or polymer grade. Polymer-grade L-lactic acid is the monomer for polylactic acid (PLA). A minor synthetic route hydrolyses lactonitrile.",
    },
    manufacturers: [
      { name: "Corbion (Purac)", url: "https://www.corbion.com" },
      { name: "NatureWorks", url: "https://www.natureworksllc.com" },
      { name: "Galactic", url: "https://www.lactic.com" },
    ],
    sources: [
      { name: "Wikipedia, Lactic acid (production)", url: "https://en.wikipedia.org/wiki/Lactic_acid" },
      { name: "Corbion, Lactic acid", url: "https://www.corbion.com/products/lactic-acid-and-derivatives" },
      { name: "PMC, Microbial lactic acid production", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8235664/" },
    ],
  },

  "raw-material-sodium-ascorbate": {
    routes: [
      "Neutralisation of ascorbic acid (vitamin C) with sodium bicarbonate",
      "Upstream ascorbic acid by the two-step fermentation (Reichstein-derived) route",
    ],
    mainProcess: {
      name: "Ascorbic acid + sodium bicarbonate",
      detail:
        "Sodium ascorbate is the sodium salt of vitamin C, made by neutralising L-ascorbic acid with sodium bicarbonate: C6H8O6 + NaHCO3 → C6H7O6Na + H2O + CO2. The reaction is run in water or aqueous alcohol under mild conditions to protect the acid-sensitive vitamin, then the salt is crystallised (often by adding alcohol) and dried under vacuum. The upstream ascorbic acid is produced industrially from glucose via sorbitol and a two-step microbial fermentation to 2-keto-L-gulonic acid, then lactonisation. Sodium ascorbate is a non-acidic antioxidant for foods and a buffered vitamin-C supplement.",
    },
    manufacturers: [
      { name: "dsm-firmenich", url: "https://www.dsm-firmenich.com" },
      { name: "CSPC Pharmaceutical Group", url: "https://www.cspc.com.cn" },
      { name: "Northeast Pharmaceutical Group", url: "https://www.nepharm.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium ascorbate", url: "https://en.wikipedia.org/wiki/Sodium_ascorbate" },
      { name: "Wikipedia, Vitamin C (industrial synthesis)", url: "https://en.wikipedia.org/wiki/Vitamin_C" },
      { name: "ChemicalBook, Sodium ascorbate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5859613.htm" },
    ],
  },

  "docusate-sodium-salt-bioultra-docusate-sodium": {
    routes: [
      "Esterify maleic anhydride with 2-ethylhexanol to dioctyl maleate, then sulfonate with sodium bisulfite",
    ],
    mainProcess: {
      name: "Dioctyl maleate + sodium bisulfite (sulfosuccination)",
      detail:
        "Docusate sodium (dioctyl sodium sulfosuccinate, DSS) is an anionic surfactant/stool-softener. Maleic anhydride is first di-esterified with two moles of 2-ethylhexanol ('octyl' alcohol) to give dioctyl maleate; sodium bisulfite then adds across the maleate carbon-carbon double bond (sulfonation) to install the sulfonate group, yielding sodium 1,4-bis(2-ethylhexoxy)-1,4-dioxobutane-2-sulfonate. The product is purified and standardised. It is used as a laxative, a wetting agent and a pharmaceutical/industrial surfactant.",
    },
    manufacturers: [
      { name: "Solvay (Aerosol OT)", url: "https://www.solvay.com" },
      { name: "Croda International", url: "https://www.croda.com" },
      { name: "Vertellus", url: "https://www.vertellus.com" },
    ],
    sources: [
      { name: "Wikipedia, Docusate", url: "https://en.wikipedia.org/wiki/Docusate" },
      { name: "ChemicalBook, Docusate sodium", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1234567.htm" },
      { name: "PubChem, Docusate sodium", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Docusate-sodium" },
    ],
  },

  "pharma-product-thiopental-sodium-bp-b": {
    routes: [
      "Condense ethyl(1-methylbutyl)malonate with thiourea (sodium ethoxide), then form sodium salt",
    ],
    mainProcess: {
      name: "Malonate + thiourea barbiturate synthesis",
      detail:
        "Thiopental is a thiobarbiturate. The dialkylated malonic ester, diethyl 2-ethyl-2-(1-methylbutyl)malonate, is condensed with thiourea in the presence of sodium ethoxide; the two ester groups and the thiourea cyclise (with loss of ethanol) to build the six-membered thiobarbituric-acid ring, giving thiopental acid. Treatment with sodium hydroxide/carbonate then gives the water-soluble thiopental sodium, blended with anhydrous sodium carbonate as a buffer for injection. It is an ultra-short-acting anaesthetic/induction agent (a controlled product).",
    },
    manufacturers: [
      { name: "Hikma Pharmaceuticals", url: "https://www.hikma.com" },
      { name: "Merck (Sigma-Aldrich, reference)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium thiopental", url: "https://en.wikipedia.org/wiki/Sodium_thiopental" },
      { name: "ChemicalBook, Thiopental sodium", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3354344.htm" },
      { name: "PubChem, Thiopental sodium", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Thiopental-sodium" },
    ],
  },

  "nitromethane-for-synthesis": {
    routes: [
      "Vapour-phase nitration of propane (gives nitromethane + nitroethane + nitropropanes)",
      "Older: reaction of sodium chloroacetate with sodium nitrite",
    ],
    mainProcess: {
      name: "Vapour-phase propane nitration",
      detail:
        "Industrial nitromethane is made by the high-temperature vapour-phase nitration of propane with nitric acid (or NO2). At ~350-450 °C the radical reaction cleaves C-C and C-H bonds, producing a mixture of nitromethane, nitroethane, 1-nitropropane and 2-nitropropane; the products are separated by distillation. (A small-scale laboratory route reacts sodium chloroacetate with sodium nitrite.) Nitromethane is used as a high-energy fuel (drag racing, model engines), a polar solvent and stabiliser, and a synthetic building block (e.g. nitroaldol/Henry reactions).",
    },
    manufacturers: [
      { name: "ANGUS Chemical Company", url: "https://www.angus.com" },
      { name: "Vertellus", url: "https://www.vertellus.com" },
    ],
    sources: [
      { name: "Wikipedia, Nitromethane (production)", url: "https://en.wikipedia.org/wiki/Nitromethane" },
      { name: "ANGUS Chemical, Nitroalkanes", url: "https://www.angus.com/products/" },
      { name: "ChemicalBook, Nitromethane", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3852656.htm" },
    ],
  },

  "mancozeb-wp": {
    routes: [
      "React ethylenediamine + carbon disulfide + caustic to nabam, then add Mn and Zn salts",
      "Co-ordination polymer of manganese/zinc ethylenebisdithiocarbamate",
    ],
    mainProcess: {
      name: "Ethylenebisdithiocarbamate + Mn/Zn",
      detail:
        "Mancozeb is a coordination complex of zinc with manganese ethylenebisdithiocarbamate (a maneb-zineb mixture). Ethylenediamine is first reacted with carbon disulfide and sodium hydroxide to form disodium ethylenebisdithiocarbamate ('nabam'). Manganese sulfate is then added to precipitate the manganese complex (maneb), and zinc sulfate is incorporated (~2% Zn) to give the more stable mancozeb polymer, which is filtered, dried and formulated (e.g. as a wettable powder, 'WP'). It is one of the most widely used broad-spectrum protectant dithiocarbamate fungicides.",
    },
    manufacturers: [
      { name: "UPL", url: "https://www.upl-ltd.com" },
      { name: "Indofil Industries", url: "https://www.indofil.com" },
      { name: "Coromandel International", url: "https://www.coromandel.biz" },
      { name: "Corteva Agriscience", url: "https://www.corteva.com" },
    ],
    sources: [
      { name: "Wikipedia, Mancozeb", url: "https://en.wikipedia.org/wiki/Mancozeb" },
      { name: "Indofil, Mancozeb", url: "https://www.indofil.com/crop-protection" },
      { name: "US EPA, Mancozeb", url: "https://www.epa.gov/ingredients-used-pesticide-products/mancozeb" },
    ],
  },

  "samarium-oxide-99-x-inorganic-chemical": {
    routes: [
      "Solvent-extraction separation of samarium from rare-earth concentrate",
      "Precipitation as oxalate/carbonate, then calcination to Sm2O3",
    ],
    mainProcess: {
      name: "Rare-earth solvent extraction + calcination",
      detail:
        "Samarium oxide (Sm2O3) is recovered from rare-earth ores (bastnäsite, monazite or ion-adsorption clays). The mixed rare-earth concentrate is leached and the individual lanthanides separated by multi-stage solvent extraction, which exploits small differences in their complexation to isolate a purified samarium solution. The samarium is then precipitated as the oxalate (or carbonate) and calcined in air to the pale-yellow oxide: Sm2(C2O4)3 → Sm2O3 + CO/CO2. It is used in samarium-cobalt permanent magnets, as a neutron absorber, and in optical/ceramic applications.",
    },
    manufacturers: [
      { name: "Lynas Rare Earths", url: "https://www.lynasrareearths.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
    ],
    sources: [
      { name: "Wikipedia, Samarium(III) oxide", url: "https://en.wikipedia.org/wiki/Samarium(III)_oxide" },
      { name: "Wikipedia, Rare-earth element (separation)", url: "https://en.wikipedia.org/wiki/Rare-earth_element" },
      { name: "American Elements, Samarium oxide", url: "https://www.americanelements.com/samarium-oxide-12060-58-1" },
    ],
  },

  "laboratory-chemicals-mercuric-chloride-extrapure": {
    routes: [
      "Reaction of mercury metal with chlorine",
      "Sublimation from mercury(II) sulfate + sodium chloride (corrosive sublimate)",
    ],
    mainProcess: {
      name: "Mercury + chlorine / sublimation route",
      detail:
        "Mercury(II) chloride ('corrosive sublimate') is made by reacting mercury metal directly with chlorine gas (Hg + Cl2 → HgCl2), or by the classic sublimation route in which mercury(II) sulfate is heated with sodium chloride so that HgCl2 sublimes and is collected: HgSO4 + 2 NaCl → HgCl2 + Na2SO4. The vapour is condensed to white crystals and purified by resublimation/recrystallisation to extra-pure grade. Because of its high toxicity it is handled in closed systems; uses are as a laboratory reagent, catalyst and (historically) a disinfectant and preservative.",
    },
    manufacturers: [
      { name: "American Elements", url: "https://www.americanelements.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Mercury(II) chloride", url: "https://en.wikipedia.org/wiki/Mercury(II)_chloride" },
      { name: "ChemicalBook, Mercuric chloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1852602.htm" },
      { name: "PubChem, Mercuric chloride", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Mercuric-chloride" },
    ],
  },

  "ethylenediamine-anhydrous-x": {
    routes: [
      "Ammonolysis of ethylene dichloride (EDC) with ammonia (caustic route)",
      "Reductive amination of monoethanolamine with ammonia + hydrogen (EDA process)",
    ],
    mainProcess: {
      name: "EDC ammonolysis / MEA amination",
      detail:
        "Ethylenediamine (EDA) is made by two main routes. In the long-established EDC route, ethylene dichloride is reacted with a large excess of aqueous ammonia under pressure and heat; ammonia displaces chloride and the mixture is neutralised with caustic, giving EDA plus higher ethyleneamines (C2H4Cl2 + 2 NH3 → H2NCH2CH2NH2 + 2 HCl). The newer, chloride-free route reductively aminates monoethanolamine with ammonia and hydrogen over a metal catalyst. The amines are separated by distillation; anhydrous EDA is the lightest cut. It is used in chelants (EDTA), fungicides, resins and pharmaceuticals.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Tosoh Corporation", url: "https://www.tosoh.com" },
      { name: "Delamine", url: "https://www.delamine.com" },
    ],
    sources: [
      { name: "Wikipedia, Ethylenediamine", url: "https://en.wikipedia.org/wiki/Ethylenediamine" },
      { name: "Delamine, Ethyleneamines", url: "https://www.delamine.com/products" },
      { name: "ChemicalBook, Ethylenediamine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854096.htm" },
    ],
  },

  "fatty-alcohol": {
    routes: [
      "Hydrogenation of fatty-acid methyl esters (natural oleochemical route)",
      "Ziegler (ethylene growth) and oxo (hydroformylation) synthetic routes",
    ],
    mainProcess: {
      name: "Methyl-ester hydrogenolysis (natural route)",
      detail:
        "Natural fatty alcohols are made from vegetable oils/fats (coconut, palm kernel, palm). The oil is transesterified to fatty-acid methyl esters, which are then hydrogenated (hydrogenolysed) at high temperature and hydrogen pressure over a copper-chromite (or Cu/Zn) catalyst, converting the ester group to a primary alcohol: RCOOCH3 + 2 H2 → RCH2OH + CH3OH. The crude alcohols are distilled and fractionated by chain length. Synthetic fatty alcohols are made from ethylene by the Ziegler process or from olefins by oxo hydroformylation. They are feedstocks for surfactants (ether sulfates, ethoxylates), plasticisers and lubricants.",
    },
    manufacturers: [
      { name: "Wilmar International", url: "https://www.wilmar-international.com" },
      { name: "KLK OLEO", url: "https://www.klkoleo.com" },
      { name: "Sasol", url: "https://www.sasol.com" },
      { name: "BASF", url: "https://www.basf.com" },
    ],
    sources: [
      { name: "Wikipedia, Fatty alcohol (production)", url: "https://en.wikipedia.org/wiki/Fatty_alcohol" },
      { name: "KLK OLEO, Fatty alcohols", url: "https://www.klkoleo.com/product/fatty-alcohols.html" },
      { name: "ScienceDirect, Fatty alcohol manufacture", url: "https://www.sciencedirect.com/topics/chemistry/fatty-alcohol" },
    ],
  },

  "raw-material-sodium-seleite": {
    routes: [
      "Dissolve selenium dioxide (from copper-refinery selenium) in sodium hydroxide/carbonate",
      "Oxidise elemental selenium with nitric acid, then neutralise",
    ],
    mainProcess: {
      name: "Selenium dioxide + sodium base",
      detail:
        "Sodium selenite is made from selenium recovered as a by-product of copper electro-refining (anode slimes). Elemental selenium is oxidised, by roasting/burning in air to selenium dioxide, or with nitric acid to selenous acid, and the selenium(IV) oxide/acid is then dissolved in sodium hydroxide or sodium carbonate to give sodium selenite: SeO2 + 2 NaOH → Na2SeO3 + H2O. The solution is purified and crystallised (anhydrous or pentahydrate). It is used as a trace-element nutrient in animal feed and fertilisers, a glass decolouriser and a laboratory reagent (handled carefully, as selenium is toxic).",
    },
    manufacturers: [
      { name: "Vital Materials", url: "https://www.vitalmaterials.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium selenite", url: "https://en.wikipedia.org/wiki/Sodium_selenite" },
      { name: "Wikipedia, Selenium dioxide", url: "https://en.wikipedia.org/wiki/Selenium_dioxide" },
      { name: "ChemicalBook, Sodium selenite", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7158228.htm" },
    ],
  },

  "boron-trifluoride-methanol-cas-no-57-9": {
    routes: [
      "Generate BF3 from borate/boric acid with HF and sulfuric acid (or fluorosulfonic acid)",
      "Absorb BF3 gas into methanol to form the BF3-methanol complex reagent",
    ],
    mainProcess: {
      name: "BF3 generation + methanol complexation",
      detail:
        "Boron trifluoride is generated by reacting a boron source (boric acid, borax or sodium fluoroborate) with hydrofluoric acid and a strong dehydrating acid such as sulfuric or fluorosulfonic acid, releasing gaseous BF3 (e.g. B2O3 + 6 HF → 2 BF3 + 3 H2O, driven by sulfuric acid). The dried BF3 gas is then absorbed into methanol to make the stable boron trifluoride-methanol complex (commonly a ~14% solution), a convenient, easy-to-handle acid catalyst and derivatising reagent. BF3-methanol is widely used to prepare fatty-acid methyl esters for gas-chromatography analysis and as a Lewis-acid catalyst.",
    },
    manufacturers: [
      { name: "Stella Chemifa", url: "https://www.stella-chemifa.co.jp" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Boron trifluoride", url: "https://en.wikipedia.org/wiki/Boron_trifluoride" },
      { name: "ChemicalBook, Boron trifluoride-methanol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB8156490.htm" },
      { name: "PubChem, Boron trifluoride", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Boron-trifluoride" },
    ],
  },

  "diisopropyl-d-tartrate-99-ee-g": {
    routes: [
      "Acid-catalysed esterification of D-(-)-tartaric acid with isopropanol",
    ],
    mainProcess: {
      name: "Esterification of D-tartaric acid with isopropanol",
      detail:
        "Diisopropyl D-tartrate (DIPT) is a chiral ester used as a ligand/auxiliary (e.g. in Sharpless asymmetric epoxidation). It is made by the acid-catalysed Fischer esterification of enantiopure D-(-)-tartaric acid with two moles of isopropanol, removing water (azeotropically) to drive the equilibrium: HOOC-CH(OH)-CH(OH)-COOH + 2 iPrOH → diisopropyl tartrate + 2 H2O. The product is neutralised, washed and distilled/crystallised, with the high enantiomeric purity carried directly from the natural-derived tartaric acid. Tartaric acid itself is a by-product of wine-making (potassium bitartrate).",
    },
    manufacturers: [
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
      { name: "TCI Chemicals", url: "https://www.tcichemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Diisopropyl tartrate", url: "https://en.wikipedia.org/wiki/Diisopropyl_tartrate" },
      { name: "Wikipedia, Sharpless epoxidation", url: "https://en.wikipedia.org/wiki/Sharpless_epoxidation" },
      { name: "ChemicalBook, Diisopropyl D-tartrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB9854262.htm" },
    ],
  },

  "caustic-soda-flakes": {
    routes: [
      "Chlor-alkali membrane-cell electrolysis of brine, then concentration to flakes",
      "Falling-film/forced-circulation evaporation of 50% caustic to molten NaOH, then flaking",
    ],
    mainProcess: {
      name: "Chlor-alkali electrolysis + evaporation/flaking",
      detail:
        "Caustic soda flakes are the solid form of sodium hydroxide from chlor-alkali electrolysis. Purified brine is electrolysed in membrane cells, producing ~32% caustic at the cathode (with chlorine and hydrogen as co-products); this is concentrated by multi-effect evaporation to 50% and then to molten anhydrous (~99%) NaOH. The molten caustic is solidified on a chilled rotating flaker drum and scraped off as flakes, which are packaged with moisture protection. Flakes are a convenient solid form for pulp/paper, soaps and detergents, water treatment, alumina and chemical processing.",
    },
    manufacturers: [
      { name: "Olin Corporation", url: "https://www.olin.com" },
      { name: "Westlake Corporation", url: "https://www.westlake.com" },
      { name: "Gujarat Alkalies and Chemicals (GACL)", url: "https://www.gacl.com" },
      { name: "Nirma", url: "https://www.nirma.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Sodium hydroxide (production)", url: "https://en.wikipedia.org/wiki/Sodium_hydroxide" },
      { name: "GACL, Caustic soda", url: "https://www.gacl.com/product-caustic-soda-flakes" },
      { name: "Wikipedia, Chloralkali process", url: "https://en.wikipedia.org/wiki/Chloralkali_process" },
    ],
  },

  "verdyl-acetate": {
    routes: [
      "Addition of acetic acid to dicyclopentadiene (Prins/acid-catalysed)",
      "Acetylation of the tricyclodecenyl alcohol",
    ],
    mainProcess: {
      name: "Dicyclopentadiene + acetic acid",
      detail:
        "Verdyl acetate (tricyclodecenyl acetate, a fresh green-floral fragrance) is made from dicyclopentadiene (DCPD), a cheap steam-cracker C5 by-product. DCPD is reacted with acetic acid under acid catalysis, the acid adding across one of the strained ring double bonds to give the tricyclo[5.2.1.0]decenyl acetate ester directly; alternatively the corresponding tricyclodecenyl alcohol is made first and then acetylated with acetic anhydride. The product is purified by vacuum distillation to a perfumery-grade material widely used in functional fragrances.",
    },
    manufacturers: [
      { name: "IFF", url: "https://www.iff.com" },
      { name: "Privi Speciality Chemicals", url: "https://www.privi.com" },
    ],
    sources: [
      { name: "The Good Scents Company, Verdyl acetate", url: "http://www.thegoodscentscompany.com/data/rw1008492.html" },
      { name: "Wikipedia, Dicyclopentadiene", url: "https://en.wikipedia.org/wiki/Dicyclopentadiene" },
      { name: "ChemicalBook, Tricyclodecenyl acetate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1330336.htm" },
    ],
  },

  "verdyl-propionate": {
    routes: [
      "Addition of propionic acid to dicyclopentadiene",
      "Esterification of the tricyclodecenyl alcohol with propionic acid/anhydride",
    ],
    mainProcess: {
      name: "Dicyclopentadiene + propionic acid",
      detail:
        "Verdyl propionate (tricyclodecenyl propionate) is the propionate analogue of Verdyl acetate and is made the same way. Dicyclopentadiene is reacted with propionic acid under acid catalysis so the acid adds across a ring double bond to give the tricyclodecenyl propionate ester, or the tricyclodecenyl alcohol is esterified with propionic acid/anhydride. After neutralisation and washing, the ester is vacuum-distilled to a fragrance-grade material with a fruity-green, slightly floral odour used in perfumery.",
    },
    manufacturers: [
      { name: "IFF", url: "https://www.iff.com" },
      { name: "Privi Speciality Chemicals", url: "https://www.privi.com" },
    ],
    sources: [
      { name: "The Good Scents Company, Verdyl propionate", url: "http://www.thegoodscentscompany.com/data/rw1008493.html" },
      { name: "Wikipedia, Dicyclopentadiene", url: "https://en.wikipedia.org/wiki/Dicyclopentadiene" },
      { name: "ChemicalBook, Tricyclodecenyl propionate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6330337.htm" },
    ],
  },

  "pomelo-acetal": {
    routes: [
      "Acid-catalysed acetalisation of an aldehyde with an alcohol (or orthoester)",
    ],
    mainProcess: {
      name: "Aldehyde acetalisation",
      detail:
        "Pomelo acetal is a captive/specialty grapefruit-citrus fragrance acetal. Like other fragrance acetals it is made by the acid-catalysed condensation of an aldehyde with an alcohol (or a diol), the carbonyl reacting with two equivalents of alcohol to form the acetal with loss of water: RCHO + 2 R'OH → RCH(OR')2 + H2O. Water is removed (azeotropically or with a drying agent) to push the equilibrium, the acid catalyst is neutralised, and the acetal is vacuum-distilled. Acetals are valued in perfumery for their stability in alkaline media (soaps/detergents) and diffusive fresh-fruity character.",
    },
    manufacturers: [
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "IFF", url: "https://www.iff.com" },
    ],
    sources: [
      { name: "Wikipedia, Acetal", url: "https://en.wikipedia.org/wiki/Acetal" },
      { name: "The Good Scents Company, Fragrance acetals", url: "http://www.thegoodscentscompany.com/" },
      { name: "ScienceDirect, Acetals in flavour & fragrance", url: "https://www.sciencedirect.com/topics/chemistry/acetal" },
    ],
  },

  "methoxy-2-nitroaniline-x-4-methoxy-2-nitroaniline-x": {
    routes: [
      "Nitration of (protected) para-anisidine, then deprotection",
      "Ammonolysis of 4-chloro-3-nitroanisole",
    ],
    mainProcess: {
      name: "para-Anisidine nitration / chloronitroanisole ammonolysis",
      detail:
        "4-Methoxy-2-nitroaniline (a dye/pigment intermediate) is made from a para-methoxy aromatic. In one route para-anisidine is acetylated to protect the amine, nitrated with mixed acid (which enters ortho to the amide), and then hydrolysed to free the amine, giving 4-methoxy-2-nitroaniline. An alternative aminates 4-chloro-3-nitroanisole with ammonia under pressure, the methoxy and nitro groups activating the chlorine toward displacement. The crude is purified by crystallisation. It is used to make azo dyes and pigments.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
    ],
    sources: [
      { name: "ChemicalBook, 4-Methoxy-2-nitroaniline", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3854252.htm" },
      { name: "PubChem, 4-Methoxy-2-nitroaniline", url: "https://pubchem.ncbi.nlm.nih.gov/compound/4-Methoxy-2-nitroaniline" },
      { name: "Aarti Industries, Nitro / amino aromatics", url: "https://www.aarti-industries.com/products/chemical-products" },
    ],
  },

  "cyclopropylbutane-1-3-dione-cs-w006361-10-4": {
    routes: [
      "Claisen condensation of cyclopropyl methyl ketone with an acetate ester",
    ],
    mainProcess: {
      name: "Claisen condensation",
      detail:
        "1-Cyclopropylbutane-1,3-dione is a 1,3-diketone building block used to construct pyrazole/isoxazole rings in agrochemicals and pharmaceuticals. It is made by a Claisen condensation: the enolate of cyclopropyl methyl ketone (generated with a strong base such as sodium hydride or sodium ethoxide) attacks an acetate ester (ethyl acetate), and after acidic work-up the beta-diketone is obtained: cyclopropyl-CO-CH3 + CH3COOEt → cyclopropyl-CO-CH2-CO-CH3 + EtOH. The product is purified by distillation/crystallisation. Such diketones condense with hydrazines/hydroxylamine to give substituted heterocycles.",
    },
    manufacturers: [
      { name: "TCI Chemicals", url: "https://www.tcichemicals.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Claisen condensation", url: "https://en.wikipedia.org/wiki/Claisen_condensation" },
      { name: "PubChem, 1-Cyclopropyl-1,3-butanedione", url: "https://pubchem.ncbi.nlm.nih.gov/compound/1-Cyclopropyl-1_3-butanedione" },
      { name: "ChemicalBook, 1-Cyclopropane-1,3-butanedione", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1745310.htm" },
    ],
  },

  "methyl-5-thiazoleethanol-acetate-4-methyl-5-thiazoleethanol-acetate": {
    routes: [
      "Acetylation of 4-methyl-5-thiazoleethanol (sulfurol) with acetic anhydride",
    ],
    mainProcess: {
      name: "Acetylation of sulfurol",
      detail:
        "4-Methyl-5-thiazoleethanol acetate (sulfurol acetate) is a savoury/meaty flavour ester. It is made by acetylating the primary alcohol of 4-methyl-5-thiazoleethanol ('sulfurol'), itself a thiazole built from a chloroketone, thioformamide-type and amino-alcohol chemistry, with acetic anhydride under a base or acid catalyst: thiazole-CH2CH2OH + (CH3CO)2O → thiazole-CH2CH2OOCCH3 + CH3COOH. The ester is washed free of acid and vacuum-distilled to flavour grade. It is used in trace amounts in savoury and nutty flavour compositions.",
    },
    manufacturers: [
      { name: "Vigon International", url: "https://www.vigon.com" },
      { name: "Advanced Biotech", url: "https://www.adv-bio.com" },
    ],
    sources: [
      { name: "The Good Scents Company, Sulfurol acetate", url: "http://www.thegoodscentscompany.com/data/rw1010191.html" },
      { name: "PubChem, 4-Methyl-5-thiazoleethanol acetate", url: "https://pubchem.ncbi.nlm.nih.gov/compound/4-Methyl-5-thiazoleethanol-acetate" },
      { name: "ChemicalBook, 4-Methyl-5-thiazoleethanol acetate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7466992.htm" },
    ],
  },

  "tetraazacyclododecane-tetrahydrochloride": {
    routes: [
      "Richman-Atkins macrocyclisation of a tosylated tetraamine, detosylation, then HCl salt",
      "Bis-aminal / template macrocyclisation routes to cyclen",
    ],
    mainProcess: {
      name: "Cyclen synthesis, then hydrochloride salt",
      detail:
        "1,4,7,10-Tetraazacyclododecane ('cyclen') is the macrocyclic tetraamine behind MRI contrast agents (DOTA/gadolinium) and is sold as the stable tetrahydrochloride. It is made by macrocyclisation, classically the Richman-Atkins route, in which a per-tosylated linear tetraamine is cyclised with a tosylated diol/dihalide under high dilution and base to close the 12-membered ring, then the tosyl groups are removed (e.g. with acid/HBr) to free cyclen. Treatment with hydrochloric acid gives cyclen tetrahydrochloride, which is crystallised to high purity. Newer bis-aminal template routes improve the yield.",
    },
    manufacturers: [
      { name: "CheMatech", url: "https://www.chematech-mdt.com" },
      { name: "Macrocyclics", url: "https://www.macrocyclics.com" },
    ],
    sources: [
      { name: "Wikipedia, Cyclen", url: "https://en.wikipedia.org/wiki/Cyclen" },
      { name: "Wikipedia, Richman-Atkins reaction", url: "https://en.wikipedia.org/wiki/Richman%E2%80%93Atkins_reaction" },
      { name: "ChemicalBook, Cyclen tetrahydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB8746392.htm" },
    ],
  },

  "benzyl-alcohol-pure": {
    routes: [
      "Hydrolysis of benzyl chloride with aqueous sodium carbonate/hydroxide",
      "Catalytic/Cannizzaro routes from benzaldehyde (minor)",
    ],
    mainProcess: {
      name: "Hydrolysis of benzyl chloride",
      detail:
        "Benzyl alcohol is produced mainly by the alkaline hydrolysis of benzyl chloride (from side-chain chlorination of toluene). Benzyl chloride is heated with aqueous sodium carbonate or sodium hydroxide, which displaces the chloride to give benzyl alcohol: C6H5CH2Cl + H2O → C6H5CH2OH + HCl (neutralised by the base). Dibenzyl ether is a by-product, controlled by conditions. The crude is separated, washed and purified by vacuum distillation to a pure grade. It is a solvent, a preservative/antimicrobial in pharmaceuticals and cosmetics, and a fragrance/flavour fixative.",
    },
    manufacturers: [
      { name: "LANXESS (Emerald Kalama)", url: "https://www.lanxess.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Benzyl alcohol (production)", url: "https://en.wikipedia.org/wiki/Benzyl_alcohol" },
      { name: "ChemicalBook, Benzyl alcohol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854161.htm" },
      { name: "ScienceDirect, Benzyl alcohol manufacture", url: "https://www.sciencedirect.com/topics/chemistry/benzyl-alcohol" },
    ],
  },

  "furosemide-ep": {
    routes: [
      "Chlorosulfonation/sulfamoylation of 2,4-dichlorobenzoic acid, then furfurylamine displacement",
    ],
    mainProcess: {
      name: "Dichlorobenzoic acid sulfamoylation + amination",
      detail:
        "Furosemide, a loop diuretic, is built on a 5-sulfamoyl-anthranilic-acid core. 2,4-Dichlorobenzoic acid is chlorosulfonated (chlorosulfonic acid) to introduce a -SO2Cl group, which is converted to the primary sulfonamide (-SO2NH2) with ammonia. One of the ring chlorines (activated by the adjacent carboxyl/sulfamoyl groups) is then selectively displaced by furfurylamine to install the (furan-2-ylmethyl)amino group, giving furosemide. The crude is purified by recrystallisation to EP grade.",
    },
    manufacturers: [
      { name: "Sanofi (originator, Lasix)", url: "https://www.sanofi.com" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
      { name: "Zydus Lifesciences", url: "https://www.zyduslife.com" },
    ],
    sources: [
      { name: "Wikipedia, Furosemide", url: "https://en.wikipedia.org/wiki/Furosemide" },
      { name: "PharmaCompass, Furosemide", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/furosemide" },
      { name: "ChemicalBook, Furosemide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3354345.htm" },
    ],
  },

  "metformin-hcl": {
    routes: [
      "Fusion of dimethylamine (hydrochloride) with 2-cyanoguanidine (dicyandiamide)",
    ],
    mainProcess: {
      name: "Dimethylamine + dicyandiamide",
      detail:
        "Metformin hydrochloride, the first-line antidiabetic biguanide, is made by reacting dimethylamine with 2-cyanoguanidine (dicyandiamide). Dimethylamine hydrochloride and dicyandiamide are heated together (melt/solvent) so the amine adds across the nitrile and the guanidine units couple to form the biguanide, directly giving metformin hydrochloride: (CH3)2NH·HCl + H2N-C(=NH)-NH-CN → metformin·HCl. The product is crystallised and purified to pharmacopoeial grade. It is one of the highest-tonnage small-molecule APIs.",
    },
    manufacturers: [
      { name: "Vistin Pharma", url: "https://www.vistin.com" },
      { name: "USV", url: "https://www.usv.in" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
      { name: "Harman Finochem", url: "https://www.harmanfinochem.com" },
    ],
    sources: [
      { name: "Wikipedia, Metformin", url: "https://en.wikipedia.org/wiki/Metformin" },
      { name: "PharmaCompass, Metformin hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/metformin-hydrochloride" },
      { name: "ChemicalBook, Metformin hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3354346.htm" },
    ],
  },

  "cs-t-aspirin-x1": {
    routes: [
      "Acetylation of salicylic acid with acetic anhydride",
    ],
    mainProcess: {
      name: "Salicylic acid acetylation",
      detail:
        "Aspirin (acetylsalicylic acid) is made by acetylating the phenolic hydroxyl of salicylic acid with acetic anhydride, usually with a trace of acid catalyst (sulfuric or phosphoric acid): C6H4(OH)COOH + (CH3CO)2O → C6H4(OCOCH3)COOH + CH3COOH. The reaction is mild; the product crystallises on cooling/water addition and is filtered, washed and recrystallised to pharmacopoeial grade. The upstream salicylic acid comes from the Kolbe-Schmitt carboxylation of sodium phenoxide. Aspirin is an analgesic, antipyretic and antiplatelet agent.",
    },
    manufacturers: [
      { name: "Bayer (originator)", url: "https://www.bayer.com" },
      { name: "Novacyl", url: "https://www.novacyl.com" },
      { name: "Shandong Xinhua Pharmaceutical", url: "https://www.xinhuapharm.com" },
    ],
    sources: [
      { name: "Wikipedia, Aspirin (synthesis)", url: "https://en.wikipedia.org/wiki/Aspirin" },
      { name: "ChemAnalyst, Aspirin production process", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/inside-the-chemistry-industrial-production-process-of-aspirin-38477" },
      { name: "ChemicalBook, Acetylsalicylic acid", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854240.htm" },
    ],
  },

  "pharmaceutical-raw-material-bulk-drugs-mebendazole": {
    routes: [
      "Build a 3,4-diaminobenzophenone, then cyclise with methyl cyanocarbamate (carbamate-benzimidazole)",
    ],
    mainProcess: {
      name: "Benzimidazole-2-carbamate cyclisation",
      detail:
        "Mebendazole, a benzimidazole anthelmintic, is assembled from a 4-benzoyl-1,2-phenylenediamine (3,4-diaminobenzophenone). The ortho-diamine is condensed/cyclised with a one-carbon carbamate reagent, typically 1,3-bis(methoxycarbonyl)-S-methylisothiourea or methyl cyanocarbamate, which closes the imidazole ring and installs the methyl carbamate at C-2, giving methyl (5-benzoyl-1H-benzimidazol-2-yl)carbamate (mebendazole). The crude is purified by recrystallisation to bulk-drug grade.",
    },
    manufacturers: [
      { name: "Janssen (originator, Vermox)", url: "https://www.janssen.com" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
    ],
    sources: [
      { name: "Wikipedia, Mebendazole", url: "https://en.wikipedia.org/wiki/Mebendazole" },
      { name: "PharmaCompass, Mebendazole", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/mebendazole" },
      { name: "ChemicalBook, Mebendazole", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3354347.htm" },
    ],
  },

  "paroxetine-hcl-invoice-no": {
    routes: [
      "Build the trans-4-(4-fluorophenyl)-3-(hydroxymethyl)piperidine, etherify with sesamol",
      "Resolve to the (3S,4R) enantiomer; form the hydrochloride hemihydrate",
    ],
    mainProcess: {
      name: "Fluorophenyl-piperidine + sesamol ether",
      detail:
        "Paroxetine, an SSRI antidepressant, is a 3,4-disubstituted piperidine. A trans-4-(4-fluorophenyl)-piperidine bearing a hydroxymethyl (or activated leaving group) at C-3 is made and resolved to the (3S,4R) enantiomer (via a chiral acid such as di-p-toluoyltartaric acid or an asymmetric route). The C-3 arm is then coupled with sesamol (3,4-methylenedioxyphenol) by a Williamson ether/Mitsunobu reaction to install the benzodioxole ether, giving paroxetine. It is isolated as paroxetine hydrochloride hemihydrate, purified by crystallisation.",
    },
    manufacturers: [
      { name: "GSK (originator, Paxil/Seroxat)", url: "https://www.gsk.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Hetero", url: "https://www.heteroworld.com" },
    ],
    sources: [
      { name: "Wikipedia, Paroxetine", url: "https://en.wikipedia.org/wiki/Paroxetine" },
      { name: "PharmaCompass, Paroxetine hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/paroxetine-hydrochloride" },
      { name: "ChemicalBook, Paroxetine hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7354352.htm" },
    ],
  },

  "sertraline-hcl": {
    routes: [
      "Condense a tetralone with methylamine to an imine, then stereoselective reduction",
      "Resolve/crystallise to the cis-(1S,4S) isomer; form the hydrochloride",
    ],
    mainProcess: {
      name: "Tetralone reductive amination + resolution",
      detail:
        "Sertraline, an SSRI, is a 4-(3,4-dichlorophenyl)-tetrahydronaphthalen-1-amine. The corresponding 4-(3,4-dichlorophenyl)-3,4-dihydronaphthalen-1(2H)-one (tetralone) is condensed with methylamine to a ketimine/enamine, which is then catalytically hydrogenated; conditions favour the cis diastereomer. The racemic cis-amine is resolved with a chiral acid (mandelic acid) to the active (1S,4S) enantiomer, which is converted to sertraline hydrochloride and crystallised to the required polymorph. It is one of the most prescribed antidepressants.",
    },
    manufacturers: [
      { name: "Pfizer (originator, Zoloft)", url: "https://www.pfizer.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
    ],
    sources: [
      { name: "Wikipedia, Sertraline", url: "https://en.wikipedia.org/wiki/Sertraline" },
      { name: "ACS, Greener sertraline process (Pfizer)", url: "https://www.acs.org/pressroom/presspacs/2002/june.html" },
      { name: "PharmaCompass, Sertraline hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/sertraline-hydrochloride" },
    ],
  },

  "mebeverine-hydrochloride": {
    routes: [
      "Esterify veratric acid (chloride) with the N-ethyl-N-(p-methoxy-alpha-methylphenethyl)amino-butanol",
      "Form the hydrochloride salt",
    ],
    mainProcess: {
      name: "Veratric acid esterification",
      detail:
        "Mebeverine, an antispasmodic, is an ester of veratric acid (3,4-dimethoxybenzoic acid) with a substituted amino-alcohol. The amino-alcohol, 4-[ethyl(4-methoxy-alpha-methylphenethyl)amino]butan-1-ol, is built by reductive amination/alkylation steps, then esterified with veratric acid (as its acid chloride, with a base) to join the two halves: veratroyl chloride + amino-alcohol → mebeverine base. Treatment with hydrochloric acid gives mebeverine hydrochloride, crystallised to BP grade.",
    },
    manufacturers: [
      { name: "Abbott (Mylan, originator Colofac/Duspatalin)", url: "https://www.abbott.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
    ],
    sources: [
      { name: "Wikipedia, Mebeverine", url: "https://en.wikipedia.org/wiki/Mebeverine" },
      { name: "PharmaCompass, Mebeverine hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/mebeverine-hydrochloride" },
      { name: "ChemicalBook, Mebeverine hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB8354353.htm" },
    ],
  },

  "terbinafine-hydrochloride-usp": {
    routes: [
      "N-alkylate N-methyl-1-naphthalenemethylamine with the (E)-enyne allylic halide",
      "Form the hydrochloride salt",
    ],
    mainProcess: {
      name: "Naphthylmethylamine + (E)-enyne alkylation",
      detail:
        "Terbinafine, an allylamine antifungal, is made by joining two fragments. N-methyl-1-naphthalenemethylamine (from 1-naphthaldehyde via reductive amination) is N-alkylated with the (E)-6,6-dimethylhept-2-en-4-yn-1-yl halide (an enyne allylic chloride/bromide carrying the characteristic conjugated ene-yne tail), giving terbinafine base with the required E-geometry. The base is then treated with hydrochloric acid to crystallise terbinafine hydrochloride (USP). It inhibits fungal squalene epoxidase and is used for dermatophyte infections.",
    },
    manufacturers: [
      { name: "Novartis (originator, Lamisil)", url: "https://www.novartis.com" },
      { name: "MSN Laboratories", url: "https://www.msnlabs.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
    ],
    sources: [
      { name: "Wikipedia, Terbinafine", url: "https://en.wikipedia.org/wiki/Terbinafine" },
      { name: "PharmaCompass, Terbinafine hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/terbinafine-hydrochloride" },
      { name: "ChemicalBook, Terbinafine hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6354354.htm" },
    ],
  },

  "drugs-famotidine-ph-eur": {
    routes: [
      "Couple a 2-guanidinothiazole-methylthio-propanamidine chain; install the sulfamoyl-amidine",
    ],
    mainProcess: {
      name: "Guanidinothiazole + sulfamoyl-propanamidine assembly",
      detail:
        "Famotidine, an H2-receptor antagonist, is built around a 2-(diaminomethyleneamino)thiazole (guanidinothiazole) ring bearing a (methylthio)ethyl chain that ends in a sulfamoyl-propanimidamide. The guanidinothiazole is made by cyclising a guanidine with a chloroketone; its 4-methyl arm carries a thioether-linked propionitrile/imidate that is converted to the 3-(sulfamoyl)propanamidine terminus (via the imidate and reaction with a sulfamoyl source). Coupling these gives famotidine, which is crystallised to Ph. Eur. grade. It suppresses gastric acid secretion.",
    },
    manufacturers: [
      { name: "Astellas (Yamanouchi, originator Pepcid)", url: "https://www.astellas.com" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
    ],
    sources: [
      { name: "Wikipedia, Famotidine", url: "https://en.wikipedia.org/wiki/Famotidine" },
      { name: "PharmaCompass, Famotidine", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/famotidine" },
      { name: "ChemicalBook, Famotidine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6354355.htm" },
    ],
  },

  "ampicillin-trihydrate": {
    routes: [
      "Acylation of 6-APA with D-(-)-phenylglycine (enzymatic or chemical)",
      "Crystallisation as the trihydrate",
    ],
    mainProcess: {
      name: "6-APA acylation with D-phenylglycine",
      detail:
        "Ampicillin is a semi-synthetic aminopenicillin made from 6-aminopenicillanic acid (6-APA). The D-(-)-phenylglycine side chain is coupled to the 6-amino group of 6-APA, increasingly by an immobilised penicillin-acylase enzyme using the phenylglycine amide/ester in water (greener than the older chemical Dane-salt/mixed-anhydride acylation in cold solvent). The product is crystallised at its isoelectric point as ampicillin trihydrate to pharmacopoeial grade. It is a broad-spectrum oral/parenteral antibiotic.",
    },
    manufacturers: [
      { name: "Centrient Pharmaceuticals", url: "https://centrient.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
      { name: "The United Laboratories", url: "https://www.tul.com.hk" },
    ],
    sources: [
      { name: "Wikipedia, Ampicillin", url: "https://en.wikipedia.org/wiki/Ampicillin" },
      { name: "Centrient, Penicillins", url: "https://centrient.com/our-products/penicillins" },
      { name: "PharmaCompass, Ampicillin trihydrate", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/ampicillin-trihydrate" },
    ],
  },

  "amitriptyline-hcl-usp": {
    routes: [
      "Grignard addition of 3-(dimethylamino)propyl magnesium chloride to dibenzosuberone, then dehydration",
    ],
    mainProcess: {
      name: "Dibenzosuberone Grignard + dehydration",
      detail:
        "Amitriptyline, a tricyclic antidepressant, is built on a dibenzocycloheptene. The ketone dibenzosuberone (10,11-dihydro-5H-dibenzo[a,d]cyclohepten-5-one) is reacted with the Grignard reagent from 3-(dimethylamino)propyl chloride, adding the dimethylaminopropyl chain to the carbonyl to give a tertiary alcohol. Acid-catalysed dehydration then forms the exocyclic alkene that defines amitriptyline base, which is treated with hydrochloric acid to give amitriptyline hydrochloride (USP), purified by crystallisation.",
    },
    manufacturers: [
      { name: "Zydus Lifesciences", url: "https://www.zyduslife.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
      { name: "Teva Pharmaceutical Industries", url: "https://www.tevapharm.com" },
    ],
    sources: [
      { name: "Wikipedia, Amitriptyline", url: "https://en.wikipedia.org/wiki/Amitriptyline" },
      { name: "PharmaCompass, Amitriptyline hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/amitriptyline-hydrochloride" },
      { name: "ChemicalBook, Amitriptyline hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5354356.htm" },
    ],
  },

  linezolid: {
    routes: [
      "Build the (S)-oxazolidinone from a fluoronitrobenzene-morpholine and a chiral glycidyl/epoxide",
      "Install the acetamidomethyl group; resolve/crystallise the (S)-isomer",
    ],
    mainProcess: {
      name: "Oxazolidinone assembly",
      detail:
        "Linezolid, the first oxazolidinone antibiotic, is built on a 3-(3-fluoro-4-morpholinophenyl)oxazolidin-2-one. 3,4-Difluoronitrobenzene is reacted with morpholine and reduced to the aniline; this is carbamoylated and cyclised with a chiral three-carbon unit (an (R)-glycidyl derivative or epichlorohydrin route) to form the (S)-5-(hydroxymethyl)oxazolidinone with the correct stereochemistry. The hydroxymethyl is converted (via mesylate/azide or phthalimide) to an aminomethyl and acetylated to the acetamidomethyl group, giving linezolid, crystallised to high chiral purity.",
    },
    manufacturers: [
      { name: "Pfizer (originator, Zyvox)", url: "https://www.pfizer.com" },
      { name: "Hetero", url: "https://www.heteroworld.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "Wikipedia, Linezolid", url: "https://en.wikipedia.org/wiki/Linezolid" },
      { name: "PharmaCompass, Linezolid", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/linezolid" },
      { name: "ChemicalBook, Linezolid", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB9354357.htm" },
    ],
  },

  "linagliptin-export-invoice-no": {
    routes: [
      "Alkylate a substituted xanthine with a bromomethyl-quinazoline, then introduce the (R)-3-aminopiperidine",
    ],
    mainProcess: {
      name: "Xanthine + quinazolinylmethyl + aminopiperidine",
      detail:
        "Linagliptin, a DPP-4 inhibitor for type-2 diabetes, is a xanthine derivative. A 7-(but-2-ynyl)-8-bromo (or chloro) xanthine bearing a methyl group is N-alkylated with 4-(bromomethyl)-2-methylquinazoline to attach the quinazolinylmethyl arm; the 8-halogen is then displaced by (R)-3-aminopiperidine (protected, then deprotected) to install the chiral amino-piperidine that confers activity. The product is purified by crystallisation to high chemical and chiral purity.",
    },
    manufacturers: [
      { name: "Boehringer Ingelheim (originator, Trajenta)", url: "https://www.boehringer-ingelheim.com" },
      { name: "MSN Laboratories", url: "https://www.msnlabs.com" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "Wikipedia, Linagliptin", url: "https://en.wikipedia.org/wiki/Linagliptin" },
      { name: "PharmaCompass, Linagliptin", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/linagliptin" },
      { name: "ChemicalBook, Linagliptin", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1409802.htm" },
    ],
  },

  "trimethoprim-bp": {
    routes: [
      "Condense 3,4,5-trimethoxybenzaldehyde with 3-anilinopropionitrile/methoxypropionitrile, then cyclise with guanidine",
    ],
    mainProcess: {
      name: "Trimethoxybenzaldehyde + guanidine cyclisation",
      detail:
        "Trimethoprim, a diaminopyrimidine antibacterial, is built from 3,4,5-trimethoxybenzaldehyde. The aldehyde is condensed (Knoevenagel-type) with a propionitrile bearing a masked aldehyde/enol ether (e.g. 3-anilino- or 3-methoxy-propionitrile) to give an alpha-(trimethoxybenzyl)-beta-substituted acrylonitrile; cyclo-condensation of this with guanidine then builds the 2,4-diaminopyrimidine ring carrying the trimethoxybenzyl group, giving trimethoprim. The crude is purified by recrystallisation to BP grade; it is usually co-formulated with sulfamethoxazole.",
    },
    manufacturers: [
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Trimethoprim", url: "https://en.wikipedia.org/wiki/Trimethoprim" },
      { name: "PharmaCompass, Trimethoprim", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/trimethoprim" },
      { name: "ChemicalBook, Trimethoprim", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB2354358.htm" },
    ],
  },

  "sulphamethoxazole-bp": {
    routes: [
      "Couple N-acetylsulfanilyl chloride with 3-amino-5-methylisoxazole, then deacetylate",
    ],
    mainProcess: {
      name: "Sulfanilyl chloride + aminomethylisoxazole",
      detail:
        "Sulfamethoxazole, a sulfonamide antibacterial, joins a sulfanilamide unit to a methylisoxazole. N-acetylsulfanilyl chloride (from acetanilide chlorosulfonation) is reacted with 3-amino-5-methylisoxazole, the amine displacing chloride to form the sulfonamide bond; acid or base hydrolysis then removes the protecting acetyl group on the aniline nitrogen to give sulfamethoxazole. The crude is recrystallised to BP grade. It is widely used with trimethoprim (co-trimoxazole).",
    },
    manufacturers: [
      { name: "Sun Pharmaceutical Industries", url: "https://www.sunpharma.com" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Sulfamethoxazole", url: "https://en.wikipedia.org/wiki/Sulfamethoxazole" },
      { name: "PharmaCompass, Sulfamethoxazole", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/sulfamethoxazole" },
      { name: "ChemicalBook, Sulfamethoxazole", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3354359.htm" },
    ],
  },

  "pharmaceutical-raw-material-bulk-drugs-guaifenesin": {
    routes: [
      "Reaction of guaiacol with glycidol (or 3-chloro-1,2-propanediol), Williamson ether",
    ],
    mainProcess: {
      name: "Guaiacol + glycidol etherification",
      detail:
        "Guaifenesin (guaiacol glyceryl ether), an expectorant, is made by O-alkylating guaiacol (2-methoxyphenol) with a three-carbon diol unit. Under base, guaiacol's phenoxide reacts with glycidol (2,3-epoxy-1-propanol), opening the epoxide to give the glyceryl ether directly: guaiacol + glycidol → 3-(2-methoxyphenoxy)propane-1,2-diol. An alternative uses 3-chloro-1,2-propanediol. The crude is purified by crystallisation; the marketed drug is usually the racemate. It loosens bronchial secretions in cough/cold products.",
    },
    manufacturers: [
      { name: "Granules India", url: "https://www.granulesindia.com" },
      { name: "Vianex", url: "https://www.vianex.gr" },
    ],
    sources: [
      { name: "Wikipedia, Guaifenesin", url: "https://en.wikipedia.org/wiki/Guaifenesin" },
      { name: "PharmaCompass, Guaifenesin", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/guaifenesin" },
      { name: "ChemicalBook, Guaifenesin", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6354360.htm" },
    ],
  },

  "drug-drug-intermediates-ciprofloxacinhcl-ep": {
    routes: [
      "Build the cyclopropyl-fluoroquinolone-carboxylic acid core, then displace with piperazine; form the HCl salt",
    ],
    mainProcess: {
      name: "Fluoroquinolone core + piperazine",
      detail:
        "Ciprofloxacin, a second-generation fluoroquinolone, is built on a 1-cyclopropyl-6-fluoro-4-oxo-1,4-dihydroquinoline-3-carboxylic acid core (carrying a 7-chloro or 7-fluoro leaving group). The core is assembled from a 2,4-dichloro-5-fluoro-benzoyl building block via a beta-ketoester/enamine, cyclopropylamine introduction and Gould-Jacobs-type ring closure. The 7-halogen is then displaced by piperazine to install the piperazinyl group, giving ciprofloxacin, which is converted to ciprofloxacin hydrochloride and crystallised to EP grade.",
    },
    manufacturers: [
      { name: "Bayer (originator, Cipro)", url: "https://www.bayer.com" },
      { name: "Aarti Drugs", url: "https://www.aartidrugs.co.in" },
      { name: "Aurobindo Pharma", url: "https://www.aurobindo.com" },
    ],
    sources: [
      { name: "Wikipedia, Ciprofloxacin", url: "https://en.wikipedia.org/wiki/Ciprofloxacin" },
      { name: "PharmaCompass, Ciprofloxacin hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/ciprofloxacin-hydrochloride" },
      { name: "ChemicalBook, Ciprofloxacin hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4354361.htm" },
    ],
  },

  "bromhexine-hydrochloride-bp": {
    routes: [
      "Reductive amination of 2-amino-3,5-dibromobenzaldehyde with N-methylcyclohexylamine; form HCl salt",
    ],
    mainProcess: {
      name: "Dibromo-anthranilaldehyde reductive amination",
      detail:
        "Bromhexine, a mucolytic, is a benzylamine derivative. 2-Aminobenzaldehyde is brominated to 2-amino-3,5-dibromobenzaldehyde; this aldehyde is then reductively aminated with N-methylcyclohexylamine, forming the imine and reducing it (e.g. with a borohydride or by catalytic hydrogenation), to give the N-(2-amino-3,5-dibromobenzyl)-N-methylcyclohexylamine that is bromhexine base. Treatment with hydrochloric acid gives bromhexine hydrochloride, crystallised to BP grade. It breaks down mucopolysaccharides to thin mucus.",
    },
    manufacturers: [
      { name: "Boehringer Ingelheim (originator, Bisolvon)", url: "https://www.boehringer-ingelheim.com" },
      { name: "Cipla", url: "https://www.cipla.com" },
    ],
    sources: [
      { name: "Wikipedia, Bromhexine", url: "https://en.wikipedia.org/wiki/Bromhexine" },
      { name: "PharmaCompass, Bromhexine hydrochloride", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/bromhexine-hydrochloride" },
      { name: "ChemicalBook, Bromhexine hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5354362.htm" },
    ],
  },

  "biotin-mccp-b-n-n26018-jan-26": {
    routes: [
      "Multi-step chiral synthesis (Goldberg-Sternbach / Lonza route) to the bicyclic thiophane-ureido core",
      "Microbial fermentation (emerging)",
    ],
    mainProcess: {
      name: "Chiral total synthesis of (+)-biotin",
      detail:
        "Biotin (vitamin B7/H) is a bicyclic molecule, a fused tetrahydrothiophene and an imidazolidone (ureido) ring, bearing a valeric-acid side chain and three contiguous stereocentres, so manufacture is a demanding multi-step asymmetric synthesis. Classic industrial routes (Goldberg-Sternbach and the improved Lonza/DSM processes) build a meso-bicyclic anhydride/lactone from cysteine- or fumarate-derived intermediates, set the all-cis stereochemistry by enzymatic or chiral resolution, then attach the C5 side chain (e.g. by a Grignard/Wittig sequence) and adjust oxidation state to give (+)-biotin, purified by crystallisation. Fermentation routes are emerging.",
    },
    manufacturers: [
      { name: "dsm-firmenich", url: "https://www.dsm-firmenich.com" },
      { name: "Zhejiang NHU", url: "https://www.nhu.com.cn" },
    ],
    sources: [
      { name: "Wikipedia, Biotin (synthesis)", url: "https://en.wikipedia.org/wiki/Biotin" },
      { name: "ChemicalBook, D-Biotin", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854264.htm" },
      { name: "PMC, Industrial biotin synthesis review", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8839607/" },
    ],
  },

  "pyridoxine-b-n-n26014-mfgdt-jan-26": {
    routes: [
      "Diels-Alder of a 4-methyl-5-alkoxyoxazole with a dienophile, then aromatisation",
      "Build the trisubstituted pyridine, then introduce hydroxymethyl groups",
    ],
    mainProcess: {
      name: "Oxazole Diels-Alder route",
      detail:
        "Pyridoxine (vitamin B6) is made industrially by an oxazole Diels-Alder strategy. A 4-methyl-5-alkoxy-oxazole (the diene component) undergoes a [4+2] cycloaddition with a suitable dienophile (e.g. a but-2-ene-1,4-diol derivative or maleic/fumarate ester); the cycloadduct loses the oxazole oxygen bridge and aromatises to a trisubstituted pyridine carrying the methyl, hydroxyl and the two hydroxymethyl groups of pyridoxine. Functional-group adjustment and purification give pyridoxine, usually isolated as the hydrochloride. It is an essential water-soluble vitamin.",
    },
    manufacturers: [
      { name: "dsm-firmenich", url: "https://www.dsm-firmenich.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Pyridoxine", url: "https://en.wikipedia.org/wiki/Pyridoxine" },
      { name: "ChemicalBook, Pyridoxine hydrochloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3854265.htm" },
      { name: "ScienceDirect, Vitamin B6 synthesis", url: "https://www.sciencedirect.com/topics/chemistry/pyridoxine" },
    ],
  },

  "riboflavin-ip": {
    routes: [
      "Microbial fermentation (Ashbya gossypii or engineered Bacillus subtilis), dominant",
      "Chemical synthesis from D-ribose + 3,4-dimethylaniline + alloxan/barbituric acid (older)",
    ],
    mainProcess: {
      name: "Microbial fermentation",
      detail:
        "Most riboflavin (vitamin B2) is now made by fermentation, which has displaced the old multi-step chemical synthesis. Over-producing fungi (Ashbya gossypii / Eremothecium) or engineered Bacillus subtilis are grown on plant-oil or sugar feedstocks and secrete riboflavin, which crystallises from the broth; it is recovered, washed and purified to feed or pharmacopoeial (IP/USP) grade. The classic chemical route condensed D-ribose-derived ribitylaminodimethylaniline with alloxan/barbituric acid to build the isoalloxazine ring. Riboflavin is an essential vitamin and a yellow colourant.",
    },
    manufacturers: [
      { name: "dsm-firmenich", url: "https://www.dsm-firmenich.com" },
      { name: "BASF", url: "https://www.basf.com" },
    ],
    sources: [
      { name: "Wikipedia, Riboflavin (production)", url: "https://en.wikipedia.org/wiki/Riboflavin" },
      { name: "ChemicalBook, Riboflavin", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854266.htm" },
      { name: "PMC, Biotechnological riboflavin production", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3920794/" },
    ],
  },

  "niacinamide-ip": {
    routes: [
      "Partial hydrolysis (ammonolysis) of 3-cyanopyridine to nicotinamide",
      "From nicotinic acid + ammonia (amide formation)",
    ],
    mainProcess: {
      name: "3-Cyanopyridine partial hydrolysis",
      detail:
        "Niacinamide (nicotinamide, vitamin B3 amide) is made mainly by the controlled partial hydrolysis of 3-cyanopyridine. 3-Cyanopyridine, produced by the ammoxidation of 3-methylpyridine (beta-picoline), is hydrolysed (enzymatically with a nitrile hydratase, or chemically with base) only as far as the amide, stopping before the carboxylic acid: 3-NC-C5H4N + H2O → 3-H2NCO-C5H4N. Enzymatic hydration gives a very clean product. It is crystallised to IP/USP grade and used as a vitamin, a cosmetic active and a feed additive.",
    },
    manufacturers: [
      { name: "Lonza", url: "https://www.lonza.com" },
      { name: "Jubilant Ingrevia", url: "https://www.jubilantingrevia.com" },
      { name: "Vertellus", url: "https://www.vertellus.com" },
    ],
    sources: [
      { name: "Wikipedia, Nicotinamide", url: "https://en.wikipedia.org/wiki/Nicotinamide" },
      { name: "Lonza, Niacinamide / vitamin B3", url: "https://www.lonza.com/products" },
      { name: "ChemicalBook, Nicotinamide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854267.htm" },
    ],
  },

  "sorbic-acid-emprove-essential-ph-eur-bp-chp-nf-fcc-e": {
    routes: [
      "Reaction of ketene with crotonaldehyde to a polyester, then thermal/acid depolymerisation",
    ],
    mainProcess: {
      name: "Ketene + crotonaldehyde route",
      detail:
        "Sorbic acid, a food preservative, is made from ketene and crotonaldehyde. Ketene (from acetic acid/acetone pyrolysis) adds to crotonaldehyde in the presence of a catalyst to form a beta-lactone/polyester intermediate (a 3-hydroxy-hexenoic polyester); this is then depolymerised by heating with acid to release sorbic acid, (2E,4E)-hexa-2,4-dienoic acid. The crude is purified by recrystallisation to Ph. Eur./FCC grade. Sorbic acid and its potassium salt inhibit moulds and yeasts in foods, cosmetics and pharmaceuticals.",
    },
    manufacturers: [
      { name: "Celanese", url: "https://www.celanese.com" },
      { name: "Daicel Corporation", url: "https://www.daicel.com" },
    ],
    sources: [
      { name: "Wikipedia, Sorbic acid", url: "https://en.wikipedia.org/wiki/Sorbic_acid" },
      { name: "ChemicalBook, Sorbic acid", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4854268.htm" },
      { name: "Celanese, Sorbates", url: "https://www.celanese.com/products/sorbates" },
    ],
  },

  "hydrofluoric-acid": {
    routes: [
      "Reaction of acid-grade fluorspar (CaF2) with sulfuric acid in a heated rotary kiln",
      "Purification/condensation of HF gas; dilution to aqueous HF",
    ],
    mainProcess: {
      name: "Fluorspar + sulfuric acid",
      detail:
        "Hydrogen fluoride is made by reacting acid-grade fluorspar (calcium fluoride) with concentrated sulfuric acid in an externally heated rotary kiln at ~200-250 °C: CaF2 + H2SO4 → 2 HF + CaSO4. The gaseous HF is cooled, scrubbed of dust and sulfuric acid, and condensed to anhydrous HF or absorbed in water to make aqueous hydrofluoric acid; by-product gypsum (anhydrite) is removed. It is the gateway chemical to all fluorine products, fluorocarbons/refrigerants, aluminium fluoride, fluoropolymers, and uranium hexafluoride, and is used in glass etching and metal pickling.",
    },
    manufacturers: [
      { name: "Honeywell", url: "https://www.honeywell.com" },
      { name: "Orbia (Koura)", url: "https://www.orbia.com" },
      { name: "Gujarat Fluorochemicals", url: "https://www.gfl.co.in" },
      { name: "Daikin Industries", url: "https://www.daikin.com" },
    ],
    sources: [
      { name: "Wikipedia, Hydrogen fluoride (production)", url: "https://en.wikipedia.org/wiki/Hydrogen_fluoride" },
      { name: "US EPA, Hydrofluoric acid (AP-42 §8.7, PDF)", url: "https://www3.epa.gov/ttnchie1/ap42/ch08/final/c08s07.pdf" },
      { name: "ChemicalBook, Hydrofluoric acid", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852632.htm" },
    ],
  },

  "chromium-trioxide": {
    routes: [
      "Reaction of sodium dichromate with concentrated sulfuric acid, then crystallise CrO3",
    ],
    mainProcess: {
      name: "Sodium dichromate + sulfuric acid",
      detail:
        "Chromium trioxide (chromic acid anhydride, CrO3) is made by treating sodium dichromate with concentrated sulfuric acid: Na2Cr2O7 + 2 H2SO4 → 2 CrO3 + 2 NaHSO4 + H2O. The molten/concentrated mixture is cooled so that dark-red CrO3 crystallises out from the sodium bisulfate liquor; it is separated, flaked and packaged (it is a strong oxidiser and hygroscopic). The upstream sodium dichromate comes from roasting chromite ore with soda ash. CrO3 is used in hard/decorative chrome plating, metal finishing and as a strong oxidant.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Vishnu Chemicals", url: "https://www.vishnuchemicals.com" },
      { name: "Elementis", url: "https://www.elementis.com" },
    ],
    sources: [
      { name: "Wikipedia, Chromium trioxide", url: "https://en.wikipedia.org/wiki/Chromium_trioxide" },
      { name: "ChemicalBook, Chromium trioxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3852595.htm" },
      { name: "Wikipedia, Sodium dichromate", url: "https://en.wikipedia.org/wiki/Sodium_dichromate" },
    ],
  },

  iodine: {
    routes: [
      "From caliche/nitrate brine (Chile), extract iodate, reduce with SO2, blow-out",
      "From natural gas/oilfield brines (Japan, USA) by blow-out/ion exchange",
    ],
    mainProcess: {
      name: "Brine extraction (blow-out / reduction)",
      detail:
        "Most iodine comes from two natural brine sources. In Chile it is recovered from caliche (sodium nitrate) ore, where iodine occurs as iodate; the leach liquor is partly reduced with sulfur dioxide and then recombined so iodine precipitates (5 I- + IO3- + 6 H+ → 3 I2 + 3 H2O), and is filtered and refined by sublimation. In Japan and the USA it is recovered from underground gas/oilfield brines by oxidising the iodide with chlorine and stripping the iodine with air ('blow-out'), then absorbing and purifying it. Iodine is used in pharmaceuticals, X-ray contrast media, disinfectants, catalysts and LCD/optical films.",
    },
    manufacturers: [
      { name: "SQM", url: "https://www.sqm.com" },
      { name: "Iofina", url: "https://www.iofina.com" },
      { name: "ISE Chemicals", url: "https://www.isechem.co.jp" },
    ],
    sources: [
      { name: "Wikipedia, Iodine (production)", url: "https://en.wikipedia.org/wiki/Iodine" },
      { name: "USGS, Iodine (PDF)", url: "https://pubs.usgs.gov/periodicals/mcs2023/mcs2023-iodine.pdf" },
      { name: "SQM, Iodine", url: "https://www.sqm.com/en/producto/iodine-and-derivatives/" },
    ],
  },

  "sodium-cyanide": {
    routes: [
      "Neutralisation of hydrogen cyanide (Andrussow/BMA) with sodium hydroxide",
      "Older: Castner process from sodium amide",
    ],
    mainProcess: {
      name: "HCN + sodium hydroxide neutralisation",
      detail:
        "Sodium cyanide is made by absorbing hydrogen cyanide into sodium hydroxide: HCN + NaOH → NaCN + H2O. The HCN is produced upstream by the Andrussow process (ammonia + methane + air over a platinum catalyst at ~1200 °C) or the BMA process (ammonia + methane, air-free). The neutralised liquor is evaporated and crystallised, then compacted into briquettes or sold as solution under strict safety controls. The dominant use is gold and silver leaching (cyanidation); it is also a feedstock for nitriles, chelants and pharmaceuticals.",
    },
    manufacturers: [
      { name: "Cyanco", url: "https://www.cyanco.com" },
      { name: "Draslovka", url: "https://www.draslovka.com" },
      { name: "Orica", url: "https://www.orica.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium cyanide (production)", url: "https://en.wikipedia.org/wiki/Sodium_cyanide" },
      { name: "Wikipedia, Andrussow process", url: "https://en.wikipedia.org/wiki/Andrussow_process" },
      { name: "Cyanco, Sodium cyanide", url: "https://www.cyanco.com/products/" },
    ],
  },

  "potassium-permanganate-min-crystals-noc-no": {
    routes: [
      "Alkali roast/fusion of MnO2 with KOH and air to potassium manganate, then oxidation to permanganate",
      "Electrolytic or chemical oxidation of K2MnO4, then crystallisation",
    ],
    mainProcess: {
      name: "MnO2 fusion + manganate oxidation",
      detail:
        "Potassium permanganate is made in two stages from manganese dioxide ore. MnO2 is roasted/fused with potassium hydroxide and an oxidant (air or potassium nitrate) to give green potassium manganate, K2MnO4 (2 MnO2 + 4 KOH + O2 → 2 K2MnO4 + 2 H2O). The manganate(VI) is then oxidised to permanganate(VII), most efficiently by electrolytic oxidation in alkaline solution (or with chlorine/ozone), and the purple potassium permanganate is crystallised, centrifuged and dried. It is a strong oxidiser used in water treatment, disinfection and organic synthesis.",
    },
    manufacturers: [
      { name: "Carus Group", url: "https://www.caruslc.com" },
      { name: "Nippon Chemical Industrial", url: "https://www.nippon-chem.co.jp" },
      { name: "Universal Chemicals & Industries", url: "https://www.universalmanganese.com" },
    ],
    sources: [
      { name: "Wikipedia, Potassium permanganate (production)", url: "https://en.wikipedia.org/wiki/Potassium_permanganate" },
      { name: "Carus, Potassium permanganate", url: "https://www.caruslc.com/product/potassium-permanganate/" },
      { name: "ChemicalBook, Potassium permanganate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1852609.htm" },
    ],
  },

  "silver-nitrate-acs-reagent-99": {
    routes: [
      "Dissolution of silver metal in nitric acid, then crystallisation",
    ],
    mainProcess: {
      name: "Silver + nitric acid",
      detail:
        "Silver nitrate is made by dissolving high-purity silver metal in nitric acid: 3 Ag + 4 HNO3(dilute) → 3 AgNO3 + NO + 2 H2O (concentrated acid evolves NO2 instead). The reaction is run in stainless/glass-lined vessels, the nitrogen oxides are scrubbed, and the solution is evaporated so colourless silver nitrate crystallises; it is recrystallised to ACS-reagent purity and kept from light. It is the gateway silver chemical, for photographic materials, silver halides, mirrors, antimicrobials, plating and analytical reagents.",
    },
    manufacturers: [
      { name: "Ames Goldsmith", url: "https://www.amesgoldsmith.com" },
      { name: "Heraeus", url: "https://www.heraeus.com" },
      { name: "Umicore", url: "https://www.umicore.com" },
    ],
    sources: [
      { name: "Wikipedia, Silver nitrate", url: "https://en.wikipedia.org/wiki/Silver_nitrate" },
      { name: "ChemicalBook, Silver nitrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7852595.htm" },
      { name: "Ames Goldsmith, Silver nitrate", url: "https://www.amesgoldsmith.com/products/" },
    ],
  },

  "sodium-silicate": {
    routes: [
      "Furnace fusion of silica sand with soda ash, then dissolution to 'water glass'",
      "Hydrothermal dissolution of sand in caustic soda (direct route)",
    ],
    mainProcess: {
      name: "Sand + soda-ash fusion",
      detail:
        "Sodium silicate ('water glass') is made by fusing pure silica sand with sodium carbonate (soda ash) in a furnace at ~1300-1500 °C, where they react to a glassy silicate of the chosen SiO2:Na2O ratio: x SiO2 + Na2CO3 → Na2O·x SiO2 + CO2. The solid 'cullet' is then dissolved under pressure in hot water to give the liquid silicate solution, which is filtered and concentrated. A direct hydrothermal route dissolves sand in caustic soda. It is used in detergents, adhesives, silica gel/zeolite manufacture, paper, water treatment and construction.",
    },
    manufacturers: [
      { name: "PQ / Ecovyst", url: "https://www.ecovyst.com" },
      { name: "W. R. Grace", url: "https://www.grace.com" },
      { name: "Qemetica (CIECH)", url: "https://www.qemetica.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium silicate", url: "https://en.wikipedia.org/wiki/Sodium_silicate" },
      { name: "Britannica, Sodium silicate", url: "https://www.britannica.com/science/sodium-silicate" },
      { name: "ChemicalBook, Sodium silicate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5852625.htm" },
    ],
  },

  "magnesium-chloride": {
    routes: [
      "Evaporation/refining of natural brines and bischofite (carnallite end liquor)",
      "Reaction of magnesium oxide/hydroxide or magnesite with hydrochloric acid",
    ],
    mainProcess: {
      name: "Brine refining / MgO + HCl",
      detail:
        "Magnesium chloride is produced both from natural brines and synthetically. Salt-lake and sea-water bitterns (and carnallite-process end liquor) are concentrated and cooled so magnesium chloride hexahydrate (bischofite, MgCl2·6H2O) crystallises, then it is refined. Synthetically it is made by reacting hydrochloric acid with magnesium oxide/hydroxide or magnesite (MgO + 2 HCl → MgCl2 + H2O). Producing the anhydrous salt for magnesium-metal electrolysis requires careful dehydration under HCl to avoid hydrolysis to MgO. It is used for de-icing, dust control, as a coagulant (tofu), and as feed for magnesium metal.",
    },
    manufacturers: [
      { name: "ICL Group (Dead Sea)", url: "https://www.icl-group.com" },
      { name: "Compass Minerals", url: "https://www.compassminerals.com" },
      { name: "K+S", url: "https://www.kpluss.com" },
      { name: "Nedmag", url: "https://www.nedmag.com" },
    ],
    sources: [
      { name: "Wikipedia, Magnesium chloride", url: "https://en.wikipedia.org/wiki/Magnesium_chloride" },
      { name: "ChemicalBook, Magnesium chloride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5854118.htm" },
      { name: "Compass Minerals, Magnesium chloride", url: "https://www.compassminerals.com/products/magnesium-chloride/" },
    ],
  },

  "hydrogen-peroxide-industrial-use-not-for": {
    routes: [
      "Anthraquinone auto-oxidation (AO) process, hydrogenate, oxidise, extract",
      "Direct synthesis from H2 + O2 (developmental)",
    ],
    mainProcess: {
      name: "Anthraquinone auto-oxidation process",
      detail:
        "Almost all hydrogen peroxide is made by the anthraquinone (AO) process, an indirect H2 + O2 route. A 2-alkylanthraquinone dissolved in a working solvent is catalytically hydrogenated to the anthrahydroquinone; this is then oxidised with air, regenerating the quinone and releasing hydrogen peroxide (net: H2 + O2 → H2O2). The H2O2 is extracted into water, the quinone solution is recycled, and the aqueous peroxide is concentrated by distillation to commercial strengths (35-70%) and stabilised. It is used in pulp/paper and textile bleaching, water treatment, chemical synthesis (e.g. propylene oxide via HPPO) and electronics.",
    },
    manufacturers: [
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Evonik Industries", url: "https://www.evonik.com" },
      { name: "Nouryon", url: "https://www.nouryon.com" },
      { name: "Arkema", url: "https://www.arkema.com" },
    ],
    sources: [
      { name: "Wikipedia, Hydrogen peroxide (production)", url: "https://en.wikipedia.org/wiki/Hydrogen_peroxide" },
      { name: "Evonik, Hydrogen peroxide", url: "https://www.evonik.com/en/products/hydrogen-peroxide.html" },
      { name: "ChemicalBook, Hydrogen peroxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852634.htm" },
    ],
  },

  "chrome-oxide-green": {
    routes: [
      "Reduction of sodium dichromate with sulfur/carbon, then calcination to Cr2O3",
      "Thermal decomposition of ammonium dichromate",
    ],
    mainProcess: {
      name: "Dichromate reduction + calcination",
      detail:
        "Chromium(III) oxide green pigment (Cr2O3) is made by reducing a hexavalent chromium compound. Sodium dichromate is mixed with a reductant, sulfur or a carbonaceous material (or ammonium chloride), and calcined at high temperature, reducing the chromium to the +3 state and forming Cr2O3 (Na2Cr2O7 + S → Cr2O3 + Na2SO4). The fired product is leached to remove soluble salts, filtered, dried and milled to a fine, very stable green pigment. (Thermal decomposition of ammonium dichromate gives a fluffy Cr2O3 for some grades.) It is used in paints, ceramics, roofing granules, refractories and as a polishing/catalyst material.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Vishnu Chemicals", url: "https://www.vishnuchemicals.com" },
      { name: "Elementis", url: "https://www.elementis.com" },
    ],
    sources: [
      { name: "Wikipedia, Chromium(III) oxide", url: "https://en.wikipedia.org/wiki/Chromium(III)_oxide" },
      { name: "ChemicalBook, Chromium oxide green", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3852596.htm" },
      { name: "LANXESS, Chrome oxide pigments", url: "https://www.lanxess.com/en/Products-and-Solutions/Brands/Bayferrox" },
    ],
  },

  "ammonium-hepta-molybdate": {
    routes: [
      "Roast molybdenite (MoS2) to MoO3, dissolve in aqueous ammonia, then crystallise AHM",
    ],
    mainProcess: {
      name: "MoO3 dissolution in ammonia",
      detail:
        "Ammonium heptamolybdate (AHM) is made from molybdenum disulfide concentrate. Molybdenite (MoS2) is roasted in air to technical molybdenum trioxide (MoO3) and SO2; the MoO3 is purified and dissolved in aqueous ammonia to give ammonium molybdate solution (MoO3 + 2 NH3 + H2O → (NH4)2MoO4). On controlled evaporation/crystallisation the solution yields ammonium heptamolybdate tetrahydrate, (NH4)6Mo7O24·4H2O, which is filtered and dried. It is the main soluble molybdenum source, for catalysts, micronutrients, corrosion inhibitors, pigments and as a precursor to other molybdenum chemicals and metal.",
    },
    manufacturers: [
      { name: "Climax Molybdenum (Freeport-McMoRan)", url: "https://www.climaxmolybdenum.com" },
      { name: "Molymet", url: "https://www.molymet.com" },
      { name: "CMOC Group", url: "https://www.cmoc.com" },
    ],
    sources: [
      { name: "Wikipedia, Ammonium heptamolybdate", url: "https://en.wikipedia.org/wiki/Ammonium_heptamolybdate" },
      { name: "ChemicalBook, Ammonium molybdate tetrahydrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7852614.htm" },
      { name: "Molymet, Molybdenum chemicals", url: "https://www.molymet.com/en/products/" },
    ],
  },

  "laboratory-chemcials-potassium-hydroxide-flakes-ar": {
    routes: [
      "Chlor-alkali membrane electrolysis of potassium chloride brine, then evaporation/flaking",
    ],
    mainProcess: {
      name: "KCl electrolysis + evaporation/flaking",
      detail:
        "Potassium hydroxide (caustic potash) is made by the chlor-alkali electrolysis of potassium-chloride brine, the potassium analogue of caustic-soda production: purified KCl solution is electrolysed in membrane cells to give ~32% KOH at the cathode, with chlorine and hydrogen as co-products (2 KCl + 2 H2O → 2 KOH + Cl2 + H2). The dilute caustic is concentrated by evaporation to ~50% and then to molten anhydrous KOH, which is solidified on a chilled flaker drum and scraped off as flakes. It is used in liquid soaps, potassium chemicals, biodiesel catalysis, alkaline batteries and as a strong base/reagent.",
    },
    manufacturers: [
      { name: "Olin Corporation", url: "https://www.olin.com" },
      { name: "Occidental / OxyChem", url: "https://www.oxy.com" },
      { name: "Vynova Group", url: "https://www.vynova-group.com" },
      { name: "Gujarat Alkalies and Chemicals (GACL)", url: "https://www.gacl.com" },
    ],
    sources: [
      { name: "Wikipedia, Potassium hydroxide (production)", url: "https://en.wikipedia.org/wiki/Potassium_hydroxide" },
      { name: "ChemicalBook, Potassium hydroxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6852640.htm" },
      { name: "Vynova, Potassium hydroxide", url: "https://www.vynova-group.com/products/potassium-hydroxide" },
    ],
  },

  "pharmaceuticals-raw-materials-magnesiumhydroxide-usp-light": {
    routes: [
      "Precipitation from sea-water/brine with lime or dolime",
      "Hydration of magnesium oxide (from magnesite calcination)",
    ],
    mainProcess: {
      name: "Sea-water/brine precipitation with lime",
      detail:
        "Magnesium hydroxide is made mainly by precipitating it from magnesium-rich water. Sea water or brine is treated with slaked lime or calcined dolomite (dolime), and the dissolved magnesium precipitates as the sparingly soluble hydroxide: Mg2+ + Ca(OH)2 → Mg(OH)2 + Ca2+. The slurry is settled, washed to remove salts and filtered; pharmaceutical (USP 'light') grade is tightly purified. It can also be made by hydrating magnesium oxide (from magnesite calcination). It is used as an antacid/laxative ('milk of magnesia'), a halogen-free flame retardant, and for acid neutralisation and wastewater treatment.",
    },
    manufacturers: [
      { name: "Martin Marietta Magnesia Specialties", url: "https://www.magnesiaspecialties.com" },
      { name: "Nabaltec", url: "https://www.nabaltec.de" },
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Premier Magnesia", url: "https://www.premiermagnesia.com" },
    ],
    sources: [
      { name: "Wikipedia, Magnesium hydroxide", url: "https://en.wikipedia.org/wiki/Magnesium_hydroxide" },
      { name: "ChemicalBook, Magnesium hydroxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854119.htm" },
      { name: "Martin Marietta, Magnesium hydroxide", url: "https://www.magnesiaspecialties.com/products/" },
    ],
  },

  "chloroform-drum": {
    routes: [
      "Thermal/photochemical chlorination of methane (or methyl chloride), then distillation",
      "Chlorination of methanol-derived methyl chloride",
    ],
    mainProcess: {
      name: "Methane chlorination",
      detail:
        "Chloroform (trichloromethane) is made by the successive chlorination of methane (or methyl chloride from methanol + HCl). Methane reacts with chlorine at ~400-500 °C, progressively substituting hydrogens to give a mixture of methyl chloride, dichloromethane, chloroform and carbon tetrachloride; the products are separated by distillation and the lighter chloromethanes recycled to tune the chloroform yield. The product is stabilised (e.g. with a little ethanol/amylene) because it slowly oxidises to phosgene. Its largest use is as feedstock for R-22/fluoropolymers (PTFE); it is also a solvent and reagent.",
    },
    manufacturers: [
      { name: "AGC Inc.", url: "https://www.agc.com" },
      { name: "Gujarat Fluorochemicals", url: "https://www.gfl.co.in" },
      { name: "SRF Limited", url: "https://www.srf.com" },
      { name: "INEOS", url: "https://www.ineos.com" },
    ],
    sources: [
      { name: "Wikipedia, Chloroform (production)", url: "https://en.wikipedia.org/wiki/Chloroform" },
      { name: "Wikipedia, Chloromethane (chlorination)", url: "https://en.wikipedia.org/wiki/Chloromethane" },
      { name: "ChemicalBook, Chloroform", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4854114.htm" },
    ],
  },

  "benzyl-acetate": {
    routes: [
      "Esterification of benzyl alcohol with acetic acid/anhydride",
      "Reaction of benzyl chloride with sodium acetate",
    ],
    mainProcess: {
      name: "Benzyl alcohol + acetic acid",
      detail:
        "Benzyl acetate, a jasmine/floral fragrance ester, is made by the acid-catalysed esterification of benzyl alcohol with acetic acid (or, faster, acetic anhydride): C6H5CH2OH + CH3COOH ⇌ C6H5CH2OOCCH3 + H2O. Water is removed to drive the equilibrium, the catalyst is neutralised and the ester is washed and vacuum-distilled to fragrance grade. An alternative reacts benzyl chloride with sodium acetate. It is one of the highest-volume perfumery materials, used in soaps, cosmetics and as a solvent for lacquers and inks.",
    },
    manufacturers: [
      { name: "LANXESS (Emerald Kalama)", url: "https://www.lanxess.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
      { name: "Privi Speciality Chemicals", url: "https://www.privi.com" },
    ],
    sources: [
      { name: "Wikipedia, Benzyl acetate", url: "https://en.wikipedia.org/wiki/Benzyl_acetate" },
      { name: "The Good Scents Company, Benzyl acetate", url: "http://www.thegoodscentscompany.com/data/rw1000492.html" },
      { name: "ChemicalBook, Benzyl acetate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5854163.htm" },
    ],
  },

  "di-phenyl-oxide": {
    routes: [
      "Ullmann condensation of chlorobenzene with sodium phenoxide",
      "By-product of phenol manufacture from chlorobenzene (Dow process)",
    ],
    mainProcess: {
      name: "Chlorobenzene + sodium phenoxide",
      detail:
        "Diphenyl oxide (diphenyl ether) is made by reacting chlorobenzene with sodium phenoxide in a copper-catalysed Ullmann ether synthesis at high temperature: C6H5Cl + C6H5ONa → C6H5-O-C6H5 + NaCl. It also arises in quantity as a by-product when phenol is produced from chlorobenzene (the Dow hydrolysis process). The product is purified by distillation. It is valued for its very high thermal stability and pleasant geranium odour, used (with biphenyl) as the Dowtherm/Therminol heat-transfer eutectic, and as a fragrance and a building block for high-performance polymers.",
    },
    manufacturers: [
      { name: "Eastman Chemical (Therminol)", url: "https://www.eastman.com" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
    ],
    sources: [
      { name: "Wikipedia, Diphenyl ether", url: "https://en.wikipedia.org/wiki/Diphenyl_ether" },
      { name: "ChemicalBook, Diphenyl ether", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3854180.htm" },
      { name: "Eastman, Therminol/heat transfer fluids", url: "https://www.eastman.com/en/products/heat-transfer-fluids" },
    ],
  },

  "para-cresol-para-cresol-tanker-iso": {
    routes: [
      "Toluene → p-toluenesulfonic acid → alkali fusion to p-cresol",
      "Separation/synthesis from the cresol (cymene/methylation) stream; coal-tar recovery",
    ],
    mainProcess: {
      name: "Toluenesulfonic acid alkali fusion",
      detail:
        "para-Cresol (4-methylphenol) is made synthetically and from coal tar. In the classic synthetic route toluene is sulfonated to (mainly) para-toluenesulfonic acid, which is fused with molten sodium hydroxide so the sulfonate group is replaced by a hydroxyl, and acidification releases p-cresol (separated from o-/m- isomers by distillation/crystallisation). Other routes include cymene peroxidation and methanol alkylation of phenol, plus recovery from coal-tar cresylic acid. It is a precursor to antioxidants (BHT), fragrances, dyes and agrochemicals.",
    },
    manufacturers: [
      { name: "Sasol", url: "https://www.sasol.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
      { name: "Rain Carbon", url: "https://www.raincarbon.com" },
    ],
    sources: [
      { name: "Wikipedia, p-Cresol", url: "https://en.wikipedia.org/wiki/P-Cresol" },
      { name: "Wikipedia, Cresol (production)", url: "https://en.wikipedia.org/wiki/Cresol" },
      { name: "ChemicalBook, p-Cresol", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1854212.htm" },
    ],
  },

  "phthalic-anhydride-cas-number-85-44-9": {
    routes: [
      "Catalytic vapour-phase air oxidation of ortho-xylene (V2O5 catalyst)",
      "Oxidation of naphthalene (older)",
    ],
    mainProcess: {
      name: "ortho-Xylene air oxidation",
      detail:
        "Phthalic anhydride is made by the catalytic vapour-phase oxidation of ortho-xylene (largely replacing the older naphthalene route). o-Xylene vapour mixed with excess air is passed over a vanadium-pentoxide/titania catalyst in a fixed- or fluid-bed reactor at ~350-400 °C, oxidising both methyl groups and closing the anhydride ring: o-C6H4(CH3)2 + 3 O2 → C6H4(CO)2O + 3 H2O. The reactor gas is cooled in switch condensers where phthalic anhydride desublimes, then it is purified by distillation. It is the key precursor to plasticisers (phthalate esters), unsaturated polyester and alkyd resins.",
    },
    manufacturers: [
      { name: "IG Petrochemicals", url: "https://www.igpetro.com" },
      { name: "Thirumalai Chemicals", url: "https://www.thirumalaichemicals.com" },
      { name: "Polynt", url: "https://www.polynt.com" },
      { name: "Aekyung Petrochemical", url: "https://www.aekyungpetro.co.kr" },
    ],
    sources: [
      { name: "Wikipedia, Phthalic anhydride", url: "https://en.wikipedia.org/wiki/Phthalic_anhydride" },
      { name: "US EPA, Phthalic anhydride (AP-42 §6.7, PDF)", url: "https://www3.epa.gov/ttnchie1/ap42/ch06/final/c06s07.pdf" },
      { name: "ChemicalBook, Phthalic anhydride", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854240.htm" },
    ],
  },

  "hydroquinone-pure": {
    routes: [
      "Aniline oxidation to p-benzoquinone, then reduction to hydroquinone",
      "Hydroxylation of phenol with hydrogen peroxide (co-produces catechol)",
      "p-Diisopropylbenzene peroxidation/cleavage",
    ],
    mainProcess: {
      name: "Aniline oxidation / phenol hydroxylation",
      detail:
        "Hydroquinone (benzene-1,4-diol) is made by several routes. The classical route oxidises aniline with manganese dioxide in sulfuric acid to para-benzoquinone, which is then reduced (with iron filings or catalytically) to hydroquinone. Modern plants increasingly hydroxylate phenol directly with hydrogen peroxide over an acid/titanosilicate catalyst, giving a mixture of hydroquinone and catechol that is separated by distillation. A third route peroxidises para-diisopropylbenzene and cleaves it (analogous to the cumene-phenol process). It is used as a photographic developer, polymerisation inhibitor, antioxidant and skin-lightening agent.",
    },
    manufacturers: [
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
      { name: "Camlin Fine Sciences", url: "https://www.camlinfs.com" },
      { name: "UBE Corporation", url: "https://www.ube.com" },
    ],
    sources: [
      { name: "Wikipedia, Hydroquinone (production)", url: "https://en.wikipedia.org/wiki/Hydroquinone" },
      { name: "ChemicalBook, Hydroquinone", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7854218.htm" },
      { name: "Camlin Fine Sciences, Hydroquinone", url: "https://www.camlinfs.com/businesses/shelf-life-solutions/" },
    ],
  },

  "methyl-tertiary-butyl-ether-material-is": {
    routes: [
      "Acid-catalysed addition of methanol to isobutylene over an ion-exchange resin",
    ],
    mainProcess: {
      name: "Isobutylene + methanol etherification",
      detail:
        "MTBE (methyl tert-butyl ether) is made by reacting isobutylene with methanol over an acidic sulfonic ion-exchange resin catalyst at ~40-90 °C and moderate pressure: (CH3)2C=CH2 + CH3OH → (CH3)3C-O-CH3. The isobutylene comes from refinery/steam-cracker C4 raffinate or from isobutane dehydration/dehydrogenation; the highly selective reaction also serves to extract isobutylene from C4 streams. Unreacted methanol is recovered and recycled and the MTBE purified by distillation. It is a high-octane gasoline blending oxygenate (restricted in some markets) and a source of high-purity isobutylene.",
    },
    manufacturers: [
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "Reliance Industries", url: "https://www.ril.com" },
      { name: "Evonik Industries", url: "https://www.evonik.com" },
    ],
    sources: [
      { name: "Wikipedia, Methyl tert-butyl ether", url: "https://en.wikipedia.org/wiki/Methyl_tert-butyl_ether" },
      { name: "ChemicalBook, Methyl tert-butyl ether", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB1854099.htm" },
      { name: "ScienceDirect, MTBE synthesis", url: "https://www.sciencedirect.com/topics/chemistry/methyl-tert-butyl-ether" },
    ],
  },

  "sodium-monochloro-acetate": {
    routes: [
      "Neutralisation of monochloroacetic acid (MCA) with sodium hydroxide/carbonate",
      "Upstream MCA by chlorination of acetic acid, then dichloro removal by hydrogenation",
    ],
    mainProcess: {
      name: "Monochloroacetic acid neutralisation",
      detail:
        "Sodium monochloroacetate (SMCA) is the sodium salt of monochloroacetic acid (MCA). MCA is first made by chlorinating glacial acetic acid (with acetic anhydride/sulfur as catalyst), and the dichloroacetic-acid impurity is removed by catalytic hydrogenation to give high-purity MCA. The MCA is then neutralised with sodium hydroxide or sodium carbonate to give SMCA: ClCH2COOH + NaOH → ClCH2COONa + H2O, which is dried to a free-flowing powder. It is a key alkylating intermediate, for carboxymethyl cellulose (CMC), glycine, thioglycolates, agrochemicals (e.g. glyphosate, 2,4-D) and dyes.",
    },
    manufacturers: [
      { name: "CABB Group", url: "https://www.cabb-chemicals.com" },
      { name: "Nouryon", url: "https://www.nouryon.com" },
      { name: "Daicel Corporation", url: "https://www.daicel.com" },
    ],
    sources: [
      { name: "Wikipedia, Chloroacetic acid (uses/salts)", url: "https://en.wikipedia.org/wiki/Chloroacetic_acid" },
      { name: "CABB, Monochloroacetic acid & derivatives", url: "https://www.cabb-chemicals.com/products/monochloroacetic-acid/" },
      { name: "ChemicalBook, Sodium monochloroacetate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7158494.htm" },
    ],
  },

  "m-toluidine": {
    routes: [
      "Nitration of toluene, separate meta-nitrotoluene, then catalytic hydrogenation",
    ],
    mainProcess: {
      name: "meta-Nitrotoluene hydrogenation",
      detail:
        "meta-Toluidine (3-methylaniline) is made from toluene. Toluene is nitrated with mixed acid to a mixture of nitrotoluenes; the meta isomer (a minor product) is separated by distillation/crystallisation from the dominant ortho and para isomers. The meta-nitrotoluene is then catalytically hydrogenated over a nickel or noble-metal catalyst, reducing the nitro group to the amine: m-CH3C6H4NO2 + 3 H2 → m-CH3C6H4NH2 + 2 H2O. The crude amine is purified by distillation. It is a dye, pigment and agrochemical (e.g. herbicide) intermediate.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aartiindustries.com" },
      { name: "LANXESS", url: "https://www.lanxess.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
    ],
    sources: [
      { name: "Wikipedia, m-Toluidine", url: "https://en.wikipedia.org/wiki/M-Toluidine" },
      { name: "ChemicalBook, m-Toluidine", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB4854221.htm" },
      { name: "PubChem, 3-Methylaniline", url: "https://pubchem.ncbi.nlm.nih.gov/compound/m-Toluidine" },
    ],
  },

  "di-tert-butyl-dicarbonate-boc-reagent-for-amino-acid": {
    routes: [
      "From tert-butanol + CO2 + base to tert-butyl carbonate, then couple via phosgene/chloroformate (DABCO)",
    ],
    mainProcess: {
      name: "tert-Butyl carbonate coupling",
      detail:
        "Di-tert-butyl dicarbonate (Boc anhydride, Boc2O) is the reagent that installs the tert-butoxycarbonyl (Boc) amine protecting group. It is made by reacting tert-butanol with carbon dioxide and a base (e.g. potassium or sodium) to form a tert-butyl carbonate salt, which is then converted, via phosgene or a tert-butyl chloroformate intermediate, with a DABCO catalyst, into the symmetrical dicarbonate, (Boc)2O. The product is purified by distillation/crystallisation and kept cold. It is heavily used in peptide and pharmaceutical synthesis to protect amines as their Boc carbamates.",
    },
    manufacturers: [
      { name: "TCI Chemicals", url: "https://www.tcichemicals.com" },
      { name: "Merck (Sigma-Aldrich)", url: "https://www.merckgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Di-tert-butyl dicarbonate", url: "https://en.wikipedia.org/wiki/Di-tert-butyl_dicarbonate" },
      { name: "ChemicalBook, Di-tert-butyl dicarbonate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7158501.htm" },
      { name: "PubChem, Di-tert-butyl dicarbonate", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Di-tert-butyl-dicarbonate" },
    ],
  },

  "liquid-argon": {
    routes: [
      "Cryogenic distillation (air separation), argon side-cut, then purification and liquefaction",
    ],
    mainProcess: {
      name: "Cryogenic air separation",
      detail:
        "Argon is co-produced in cryogenic air-separation units (ASUs). Filtered air is compressed, cleaned of water/CO2 and cooled until it liquefies, then fractionally distilled in coupled high/low-pressure columns; because argon boils between oxygen and nitrogen, an argon-rich side stream is drawn off and sent to a dedicated 'crude argon' column. The crude argon is then purified (removing residual oxygen catalytically with a little hydrogen, and nitrogen by further distillation) to high-purity argon, which is liquefied and stored/shipped as a cryogenic liquid. It is used as an inert shielding gas in welding and metallurgy, in lighting and electronics, and in labs.",
    },
    manufacturers: [
      { name: "Linde", url: "https://www.linde.com" },
      { name: "Air Liquide", url: "https://www.airliquide.com" },
      { name: "Air Products", url: "https://www.airproducts.com" },
      { name: "Messer Group", url: "https://www.messergroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Argon (production)", url: "https://en.wikipedia.org/wiki/Argon" },
      { name: "Wikipedia, Air separation", url: "https://en.wikipedia.org/wiki/Air_separation" },
      { name: "Linde, Argon", url: "https://www.linde-gas.com/en/products_and_supply/gases_atmospheric/argon.html" },
    ],
  },

  "liquid-nitrous-oxide": {
    routes: [
      "Controlled thermal decomposition of ammonium nitrate (~250 °C), then purify and liquefy",
    ],
    mainProcess: {
      name: "Ammonium nitrate decomposition",
      detail:
        "Nitrous oxide (N2O) is made by the carefully controlled thermal decomposition of molten ammonium nitrate at about 240-270 °C: NH4NO3 → N2O + 2 H2O. Temperature is tightly controlled to favour nitrous oxide and avoid a runaway to higher nitrogen oxides; the gas is scrubbed (caustic/permanganate) to remove NO/NO2 and acidic impurities, dried, compressed and liquefied for storage in cylinders. Pharmaceutical/food grades are purified to strict limits. It is used as an anaesthetic/analgesic ('laughing gas'), an aerosol propellant (whipped cream), and an oxidiser.",
    },
    manufacturers: [
      { name: "Linde", url: "https://www.linde.com" },
      { name: "Air Liquide", url: "https://www.airliquide.com" },
      { name: "Air Products", url: "https://www.airproducts.com" },
    ],
    sources: [
      { name: "Wikipedia, Nitrous oxide (production)", url: "https://en.wikipedia.org/wiki/Nitrous_oxide" },
      { name: "ChemicalBook, Nitrous oxide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB7462576.htm" },
      { name: "Linde, Nitrous oxide", url: "https://www.linde-gas.com/en/products_and_supply/gases_medical/index.html" },
    ],
  },

  "magnesium-carbonate-powder-25fmcaf013": {
    routes: [
      "Precipitation from a magnesium salt with sodium carbonate/bicarbonate (basic magnesium carbonate)",
      "Carbonation of magnesium hydroxide slurry with CO2",
    ],
    mainProcess: {
      name: "Precipitation from magnesium salt + carbonate",
      detail:
        "Light/basic magnesium carbonate is made by reacting a soluble magnesium salt (magnesium sulfate or chloride, often from brine/magnesite) with sodium carbonate or sodium bicarbonate, precipitating a hydrated basic magnesium carbonate (hydromagnesite): 5 MgSO4 + ... → 4 MgCO3·Mg(OH)2·4H2O. Alternatively, a magnesium hydroxide slurry is carbonated with CO2 to magnesium bicarbonate and then heated to drop out the carbonate. The precipitate is filtered, washed and dried/milled to a light fluffy powder. It is used as an antacid/supplement, a free-flow/anticaking agent, a filler and a drying agent.",
    },
    manufacturers: [
      { name: "Dr. Paul Lohmann", url: "https://www.lohmann4minerals.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
    ],
    sources: [
      { name: "Wikipedia, Magnesium carbonate", url: "https://en.wikipedia.org/wiki/Magnesium_carbonate" },
      { name: "ChemicalBook, Magnesium carbonate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6854120.htm" },
      { name: "PubChem, Magnesium carbonate", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-carbonate" },
    ],
  },

  "calcium-citrate-usp": {
    routes: [
      "Neutralisation of fermentation-derived citric acid with calcium hydroxide/carbonate",
      "Double decomposition of sodium citrate with calcium chloride",
    ],
    mainProcess: {
      name: "Citric acid + calcium base",
      detail:
        "Calcium citrate is made by reacting citric acid (from Aspergillus niger fermentation) with a calcium source, calcium hydroxide or calcium carbonate: 2 C6H8O7 + 3 Ca(OH)2 → Ca3(C6H5O7)2 + 6 H2O. The sparingly soluble tricalcium citrate tetrahydrate precipitates, and is filtered, washed and dried to USP grade. (Industrially, calcium citrate is also the intermediate in the classic citric-acid recovery, where the fermentation broth is precipitated as calcium citrate and later sprung free with sulfuric acid.) It is used as a calcium supplement, a firming agent and a food acidity buffer.",
    },
    manufacturers: [
      { name: "Jungbunzlauer", url: "https://www.jungbunzlauer.com" },
      { name: "Gadot Biochemical", url: "https://www.gadot-bio.com" },
      { name: "Global Calcium", url: "https://www.globalcalcium.com" },
    ],
    sources: [
      { name: "Wikipedia, Calcium citrate", url: "https://en.wikipedia.org/wiki/Calcium_citrate" },
      { name: "Jungbunzlauer, Calcium citrate", url: "https://www.jungbunzlauer.com/en/products/citrics/calcium-citrate.html" },
      { name: "ChemicalBook, Calcium citrate", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB5159531.htm" },
    ],
  },

  "npk-19-19-19": {
    routes: [
      "Hot-melt/blend of MAP, urea, potassium nitrate and potassium salts to a fully water-soluble grade",
      "Dissolution-crystallisation of the balanced NPK",
      "Drying/granulation of the water-soluble product",
    ],
    mainProcess: {
      name: "Blending of soluble N-P-K salts",
      detail:
        "Water-soluble NPK 19-19-19 is a balanced fertiliser made by carefully blending and reacting soluble nitrogen, phosphate and potassium sources, typically mono-ammonium phosphate (P and some N), urea and ammonium/potassium nitrate (N) and potassium salts (K), to the precise 19:19:19 ratio of N:P2O5:K2O. The raw salts are weighed, co-dissolved/reacted and then crystallised or granulated into a fully water-soluble product for fertigation and foliar feeding.",
    },
    manufacturers: [
      { name: "Yara International (YaraRega)", url: "https://www.yara.com" },
      { name: "Haifa Group (Poly-Feed)", url: "https://www.haifa-group.com" },
      { name: "Coromandel International", url: "https://www.coromandel.biz" },
      { name: "EuroChem", url: "https://www.eurochemgroup.com" },
      { name: "IFFCO", url: "https://www.iffco.in" },
    ],
    sources: [
      { name: "Haifa, Poly-Feed 19-19-19", url: "https://www.haifa-group.com/poly-feed-gg-19-19-191mgo" },
      { name: "Yara, YaraRega water-soluble NPK", url: "https://www.yara.com/crop-nutrition/our-global-fertilizer-brands/yararega/" },
      { name: "IFFCO, NPK 19-19-19", url: "https://www.iffco.in/en/npk-19-19-19" },
    ],
  },
  "aluminum-zirconium-pentachlorohydrate-solution-usp-achieve": {
    routes: [
      "React aluminium chlorohydrate with a zirconium salt and glycine (buffer)",
      "Activate/age to the controlled-polymer antiperspirant active",
      "Spray-dry to powder or supply as solution",
    ],
    mainProcess: {
      name: "Aluminium chlorohydrate + zirconium/glycine complexation",
      detail:
        "Aluminium-zirconium chlorohydrate antiperspirant actives are made by combining aluminium chlorohydrate with a zirconyl salt (zirconium hydroxychloride) and the amino-acid glycine, which buffers and stabilises the mixed aluminium-zirconium hydroxy-chloride polymer responsible for sweat-duct plugging. Reaction conditions control basicity and the polymer size distribution ('activation'); the product is sold as a solution or spray-dried powder for sticks, roll-ons and aerosols.",
    },
    manufacturers: [
      { name: "Summit Reheis", url: "https://www.summitreheis.com" },
      { name: "Zschimmer & Schwarz", url: "https://www.zschimmer-schwarz.com" },
      { name: "Kemira", url: "https://www.kemira.com" },
      { name: "BASF", url: "https://www.basf.com" },
    ],
    sources: [
      { name: "Google Patents US7153495B2, Antiperspirant actives", url: "https://patents.google.com/patent/US7153495B2/en" },
      { name: "SpecialChem, Aluminum zirconium tetrachlorohydrex Gly", url: "https://www.specialchem.com/cosmetics/inci-ingredients/aluminum-zirconium-tetrachlorohydrex-gly" },
    ],
  },
  "trans-2-3-dibromo-2-butene-1-4-diol-toxic-solid-orga-inic-n": {
    routes: [
      "Bromination of 1,4-butynediol (or butenediol) across the unsaturation",
      "Controlled addition of bromine to give the trans-2,3-dibromo diol",
      "Crystallisation/purification of the solid product",
    ],
    mainProcess: {
      name: "Bromine addition to butynediol/butenediol",
      detail:
        "trans-2,3-Dibromo-2-butene-1,4-diol (DBB) is made by adding bromine across the carbon-carbon unsaturation of 1,4-butynediol (or 2-butene-1,4-diol), giving the dibromo diol; conditions are controlled to favour the trans isomer. It crystallises as a solid and is purified by recrystallisation. DBB is used as a brominated flame-retardant intermediate and a microbiocide building block.",
    },
    manufacturers: [
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "LANXESS", url: "https://lanxess.com" },
      { name: "Jay Intermediates & Chemicals", url: "https://www.chemicalbook.com" },
      { name: "Shandong fine-chem producers", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "PubChem, 2,3-Dibromo-2-butene-1,4-diol", url: "https://pubchem.ncbi.nlm.nih.gov/" },
      { name: "ChemicalBook, Dibromobutenediol", url: "https://www.chemicalbook.com/ProductIndex_EN.aspx" },
    ],
  },
  "non-gmo-soya-lecithin-unadjusted": {
    routes: [
      "Water/acid degumming of crude soybean oil to recover gums",
      "Drying of the wet gums to fluid lecithin",
      "Optional de-oiling, fractionation or enzymatic modification",
    ],
    mainProcess: {
      name: "Degumming of crude soybean oil",
      detail:
        "Soya lecithin is recovered from the gums produced when crude soybean oil is degummed. A small amount of water (or acid) is mixed into the crude oil so the phospholipids hydrate and separate; the gum phase is removed by centrifuge and then vacuum-dried to fluid lecithin (~60-65% phospholipids in residual oil). It can be further de-oiled to powder/granules or enzymatically/acetone-modified for specific emulsifier grades, used across food, feed, pharma and cosmetics.",
    },
    manufacturers: [
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "ADM", url: "https://www.adm.com" },
      { name: "Bunge", url: "https://www.bunge.com" },
      { name: "Lipoid", url: "https://www.lipoid.com" },
      { name: "Lasenor", url: "https://lasenor.com" },
    ],
    sources: [
      { name: "USSEC, Soybean lecithin fact sheet", url: "https://ussec.org/wp-content/uploads/2025/07/Soybean-Lecithin-Fact-Sheet-0901.pdf" },
      { name: "Lecitein, Degumming of soy lecithin", url: "https://www.lecitein.com/blog/all-you-need-to-know-about-degumming-of-soy-lecithin" },
      { name: "PMC, Chemical & enzymatic degumming", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10876682/" },
    ],
  },
  "nitric-acid-pct": {
    routes: [
      "Ostwald process, catalytic oxidation of ammonia, then absorption in water",
      "Ammonia oxidation over Pt/Rh gauze to NO, oxidation to NO2",
      "Absorption to ~60% acid; extractive distillation for concentrated acid",
    ],
    mainProcess: {
      name: "Ostwald process (ammonia oxidation)",
      detail:
        "Nitric acid is made by the Ostwald process. Ammonia is catalytically oxidised over platinum-rhodium gauzes at about 850-900 °C to nitric oxide (4 NH3 + 5 O2 → 4 NO + 6 H2O); the NO is cooled and further oxidised by air to nitrogen dioxide, which is absorbed counter-currently in water to give nitric acid (3 NO2 + H2O → 2 HNO3 + NO). Absorption yields weak (~55-68%) acid; concentrated acid is obtained by extractive distillation with sulfuric acid or magnesium nitrate. Most output goes to ammonium nitrate fertiliser.",
    },
    manufacturers: [
      { name: "Yara International", url: "https://www.yara.com" },
      { name: "CF Industries", url: "https://www.cfindustries.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "EuroChem", url: "https://www.eurochemgroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Ostwald process", url: "https://en.wikipedia.org/wiki/Ostwald_process" },
      { name: "Britannica, Nitric acid", url: "https://www.britannica.com/science/nitric-acid" },
    ],
  },
  "aroma-chemicals-galaxmusk-pure": {
    routes: [
      "Friedel-Crafts alkylation to build the hexamethyl-indane",
      "Cyclisation/ring closure to the isochroman (pyran) ring",
      "Distillation to the HHCB musk",
    ],
    mainProcess: {
      name: "Indane build-up then isochroman cyclisation",
      detail:
        "Galaxolide (HHCB) is a polycyclic 'white' musk. It is synthesised by Friedel-Crafts alkylation of an aromatic to build the highly methyl-substituted indane, which is then cyclised (with formaldehyde/propylene oxide derivatives under acid catalysis) to close the hexamethyl-indano-pyran (isochroman) ring that gives the musk odour. The crude is distilled and usually supplied as a ~50% solution in a diluent. It is a high-volume fragrance fixative.",
    },
    manufacturers: [
      { name: "IFF", url: "https://www.iff.com" },
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "Givaudan", url: "https://www.givaudan.com" },
      { name: "Privi Speciality", url: "https://www.privispeciality.com" },
    ],
    sources: [
      { name: "Wikipedia, Galaxolide", url: "https://en.wikipedia.org/wiki/Galaxolide" },
      { name: "US EPA, HHCB risk assessment", url: "https://www.epa.gov/sites/default/files/2015-09/documents/hhcb_wp_ra_final_08_27_14.pdf" },
    ],
  },
  "caustic-soda-prills": {
    routes: [
      "Chlor-alkali membrane-cell electrolysis of brine",
      "Concentration of cell liquor to 50% then to anhydrous melt",
      "Prilling/flaking of molten caustic soda",
    ],
    mainProcess: {
      name: "Membrane-cell electrolysis then prilling",
      detail:
        "Caustic soda prills are solid sodium hydroxide. NaOH is produced by electrolysing purified brine in membrane cells, where chloride is oxidised to chlorine at the anode and water is reduced to hydrogen and hydroxide at the cathode, giving ~32% caustic that is evaporated to 50% and then to an anhydrous molten caustic. The melt is sprayed and solidified into spherical prills (or flaked) and packed. The membrane process is the lowest-energy, mercury-free route and dominates new capacity.",
    },
    manufacturers: [
      { name: "Olin", url: "https://www.olin.com" },
      { name: "Westlake", url: "https://www.westlake.com" },
      { name: "Formosa Plastics", url: "https://www.fpcusa.com" },
      { name: "Aditya Birla Chemicals", url: "https://www.adityabirlachemicals.com" },
      { name: "GACL", url: "https://www.gacl.com" },
    ],
    sources: [
      { name: "Euro Chlor, Membrane cell process", url: "https://www.eurochlor.org/about-chlor-alkali/how-are-chlorine-and-caustic-soda-made/membrane-cell-process/" },
      { name: "INEOS, Chlor-alkali process", url: "https://www.ineos.com/businesses/ineos-electrochemical-solutions/electrolysers/chlor-alkali-process/" },
    ],
  },
  "liquid-carbon-dioxide-gas-gas-crbn": {
    routes: [
      "Recovery of CO2 from ammonia/hydrogen, ethanol fermentation or flue gas",
      "Purification (scrubbing, drying, deodorising)",
      "Compression and refrigeration to liquid CO2",
    ],
    mainProcess: {
      name: "CO2 recovery, purification and liquefaction",
      detail:
        "Liquid carbon dioxide is recovered as a by-product gas, most commonly from ammonia/hydrogen plants, ethanol fermentation or natural-gas/flue-gas streams. The raw CO2 is scrubbed of impurities, dried and deodorised over activated carbon, then compressed and refrigerated below its critical point to a liquid stored under pressure in insulated tanks. It supplies food/beverage carbonation, freezing, welding, water treatment and as a chemical feedstock.",
    },
    manufacturers: [
      { name: "Linde", url: "https://www.linde.com" },
      { name: "Air Liquide", url: "https://www.airliquide.com" },
      { name: "Air Products", url: "https://www.airproducts.com" },
      { name: "Messer", url: "https://www.messergroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Carbon dioxide (industrial)", url: "https://en.wikipedia.org/wiki/Carbon_dioxide" },
      { name: "Linde, Carbon dioxide", url: "https://www.linde-gas.com" },
    ],
  },
  "pvc-processing-aid-resin-p": {
    routes: [
      "Emulsion (free-radical) copolymerisation of methyl methacrylate with acrylate co-monomers",
      "Spray-drying of the latex to a fine powder",
      "Grade control by molecular weight and composition",
    ],
    mainProcess: {
      name: "Emulsion copolymerisation of acrylic monomers",
      detail:
        "PVC acrylic processing aids are high-molecular-weight acrylic copolymers (typically 50-79% methyl methacrylate with butyl/ethyl acrylate or methacrylate units, low Tg). They are made by free-radical emulsion polymerisation of the monomers in water with a surfactant and initiator to build very high molecular weight, then the latex is coagulated/spray-dried to a free-flowing powder. Blended at a few percent into PVC, they promote fusion, melt strength and surface quality in extrusion and moulding.",
    },
    manufacturers: [
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Kaneka", url: "https://www.kaneka.co.jp" },
      { name: "Arkema", url: "https://www.arkema.com" },
      { name: "LG Chem", url: "https://www.lgchem.com" },
      { name: "Mitsubishi Chemical", url: "https://www.mcgc.com" },
    ],
    sources: [
      { name: "Google Patents US10150831, Acrylic processing aid", url: "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10150831" },
      { name: "Repolyfine, Acrylic impact modifiers for PVC", url: "https://www.repolyfine.com/news/empowering-pvc-with-acrylic-impact-modifiers-71620694.html" },
    ],
  },
  "zinc-phosphatet-p-69": {
    routes: [
      "React zinc oxide with phosphoric acid to precipitate zinc phosphate",
      "Filter, wash and dry/calcine to the pigment",
      "Surface-modify for advanced anticorrosive grades",
    ],
    mainProcess: {
      name: "Zinc oxide + phosphoric acid",
      detail:
        "Anticorrosive zinc phosphate pigment is made by reacting zinc oxide with phosphoric acid in water (3 ZnO + 2 H3PO4 + H2O → Zn3(PO4)2·4H2O). pH, temperature and stoichiometry are controlled to precipitate a fine, low-oil-absorption tetrahydrate; the slurry is filtered, washed free of solubles, dried/milled. Modified grades are co-precipitated with aluminium or molybdenum actives. It passivates steel under coatings, replacing toxic lead/chromate primers.",
    },
    manufacturers: [
      { name: "Heubach Group", url: "https://www.heubach.com" },
      { name: "SNCZ", url: "https://www.sncz.com" },
      { name: "WPC Technologies", url: "https://wpc-tech.com" },
      { name: "Nubiola (Vibrantz)", url: "https://www.vibrantz.com" },
    ],
    sources: [
      { name: "SNCZ, Zinc phosphate PZ20", url: "https://www.sncz.com/en/pigment/zinc-phosphate-pz20/" },
      { name: "Heubach, Zinc phosphate", url: "https://www.heubach-india.com/zincphosphate-calciumphosphate.aspx" },
    ],
  },
  "propenyl-guaethol": {
    routes: [
      "Isomerisation/condensation from guaethol (2-ethoxyphenol) derivatives",
      "Base-catalysed propenyl double-bond formation",
      "Distillation/crystallisation to the vanilla aroma chemical",
    ],
    mainProcess: {
      name: "Synthesis from guaethol",
      detail:
        "Propenyl guaethol (Vanitrope; 1-ethoxy-2-hydroxy-4-propenylbenzene) is a sweet vanilla-like aroma chemical built on the 2-ethoxyphenol (guaethol) skeleton. It is made by introducing a propenyl side chain (via allylation then base-catalysed isomerisation to the conjugated propenyl) onto the guaethol ring, then purified by distillation/crystallisation. It is several times stronger than vanillin and used as a vanilla extender in flavours and fragrances.",
    },
    manufacturers: [
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "IFF", url: "https://www.iff.com" },
      { name: "Vigon International", url: "https://www.vigon.com" },
      { name: "Aurochemicals", url: "https://www.aurochemicals.com" },
    ],
    sources: [
      { name: "The Good Scents Company, propenyl guaethol", url: "https://www.thegoodscentscompany.com" },
      { name: "PubChem, Propenylguaethol", url: "https://pubchem.ncbi.nlm.nih.gov/" },
    ],
  },
  "sanitron-s-sodium-dimethyldithiocarbamate": {
    routes: [
      "React dimethylamine with carbon disulfide under sodium hydroxide",
      "Form the water-soluble sodium dithiocarbamate salt",
      "Standardise to solution grade",
    ],
    mainProcess: {
      name: "Dimethylamine + carbon disulfide + caustic",
      detail:
        "Sodium dimethyldithiocarbamate (SDDC) is made by reacting dimethylamine with carbon disulfide in aqueous sodium hydroxide: (CH3)2NH + CS2 + NaOH → (CH3)2N-CS-SNa + H2O. The exothermic reaction is run continuously and the product supplied as a high-concentration aqueous solution. It is a broad-spectrum biocide/slimicide for water treatment and paper, a metal-chelating agent for effluent, and a rubber vulcanisation accelerator precursor.",
    },
    manufacturers: [
      { name: "Kemira", url: "https://www.kemira.com" },
      { name: "Solenis", url: "https://www.solenis.com" },
      { name: "Nouryon", url: "https://www.nouryon.com" },
      { name: "Vibrantz", url: "https://www.vibrantz.com" },
    ],
    sources: [
      { name: "Wikipedia, Sodium dimethyldithiocarbamate", url: "https://en.wikipedia.org/wiki/Sodium_dimethyldithiocarbamate" },
      { name: "ResearchGate, SDDC production & applications", url: "https://www.researchgate.net/publication/378827468" },
    ],
  },
  "tetraethylammonium-nitrate-n": {
    routes: [
      "Neutralise tetraethylammonium hydroxide with nitric acid",
      "Or metathesis of a tetraethylammonium halide with a nitrate salt",
      "Crystallise/dry the quaternary ammonium nitrate",
    ],
    mainProcess: {
      name: "Neutralisation of tetraethylammonium hydroxide",
      detail:
        "Tetraethylammonium nitrate is a quaternary-ammonium salt made either by neutralising tetraethylammonium hydroxide with nitric acid ((C2H5)4NOH + HNO3 → (C2H5)4NNO3 + H2O) or by anion exchange/metathesis of tetraethylammonium bromide with a nitrate. The solution is concentrated and the salt crystallised and dried under controlled humidity. It is used as a supporting electrolyte (e.g. in electrochemistry and supercapacitors) and as a phase-transfer/research reagent.",
    },
    manufacturers: [
      { name: "Merck KGaA", url: "https://www.merckgroup.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
      { name: "GFS Chemicals", url: "https://www.gfschemicals.com" },
      { name: "Tokyo Chemical Industry", url: "https://www.tcichemicals.com" },
    ],
    sources: [
      { name: "PubChem, Tetraethylammonium nitrate", url: "https://pubchem.ncbi.nlm.nih.gov/" },
      { name: "ChemicalBook, Tetraethylammonium nitrate", url: "https://www.chemicalbook.com/ProductIndex_EN.aspx" },
    ],
  },
  "silica-gel-mesh-sap": {
    routes: [
      "Acidify sodium silicate (water glass) with sulfuric acid to a silica hydrosol",
      "Gel, age and wash to remove sodium sulfate",
      "Dry and grade (and impregnate indicator for some grades)",
    ],
    mainProcess: {
      name: "Sol-gel from sodium silicate",
      detail:
        "Silica gel is made by the sol-gel process: a sodium silicate solution is mixed with sulfuric acid under controlled pH so silicic acid polymerises into a three-dimensional silica hydrogel (Na2SiO3 + H2SO4 → SiO2·xH2O + Na2SO4). The gel is aged to set pore structure, washed free of sodium sulfate, then dried and crushed/graded to beads or granules; pore size and surface area are tuned by gelation conditions. It is a major desiccant, adsorbent and chromatography/catalyst support.",
    },
    manufacturers: [
      { name: "W. R. Grace", url: "https://grace.com" },
      { name: "Evonik", url: "https://www.evonik.com" },
      { name: "PQ Corporation (Ecovyst)", url: "https://www.ecovyst.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Clariant", url: "https://www.clariant.com" },
    ],
    sources: [
      { name: "Streampeak, How silica gel is produced", url: "https://www.streampeakgroup.com/how-is-silica-gel-produced/" },
      { name: "Google Patents US3313739, Preparation of silica gel", url: "https://patents.google.com/patent/US3313739A/en" },
    ],
  },
  "ethylene-oxide-gas-ethylene-carbon-di": {
    routes: [
      "Direct catalytic oxidation of ethylene over a silver catalyst",
      "Oxygen-based process with CO2/light-ends recovery",
      "Absorption of EO into water",
    ],
    mainProcess: {
      name: "Silver-catalysed oxidation of ethylene",
      detail:
        "Ethylene oxide is made by the direct vapour-phase oxidation of ethylene over a supported silver catalyst, the only selective epoxidation catalyst. Ethylene and oxygen pass over silver-on-alumina at about 230-290 °C and 10-20 bar (C2H4 + ½O2 → C2H4O), with chloride moderators suppressing total combustion. EO is absorbed into water and either purified as liquid or fed onward to glycols, ethoxylates and ethanolamines. It is shipped as a liquefied gas and is also used directly as a sterilant.",
    },
    manufacturers: [
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Shell", url: "https://www.shell.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "SABIC", url: "https://www.sabic.com" },
      { name: "INEOS Oxide", url: "https://www.ineos.com" },
    ],
    sources: [
      { name: "Wikipedia, Ethylene oxide", url: "https://en.wikipedia.org/wiki/Ethylene_oxide" },
      { name: "ChemAnalyst, How ethylene oxide is produced", url: "https://www.chemanalyst.com/NewsAndDeals/NewsDetails/inside-the-reactor-how-ethylene-oxide-is-produced-38346" },
    ],
  },
  "liquid-oxygen": {
    routes: [
      "Cryogenic distillation of air (air separation unit)",
      "Compress, clean, cool and partially liquefy air",
      "Distil into oxygen, nitrogen and argon; draw liquid oxygen",
    ],
    mainProcess: {
      name: "Cryogenic air separation",
      detail:
        "Liquid oxygen is produced by cryogenic distillation of air. Filtered air is compressed, cleaned of water/CO2, and cooled to about -185 °C through heat exchangers until it partially liquefies; it is then fractionally distilled in double columns that exploit the different boiling points of oxygen (-183 °C), nitrogen (-196 °C) and argon. The oxygen-rich liquid from the column sump is drawn as liquid oxygen, stored and transported in vacuum-insulated tanks. It supplies steelmaking, medical, chemical and aerospace uses.",
    },
    manufacturers: [
      { name: "Linde", url: "https://www.linde.com" },
      { name: "Air Liquide", url: "https://www.airliquide.com" },
      { name: "Air Products", url: "https://www.airproducts.com" },
      { name: "Messer", url: "https://www.messergroup.com" },
    ],
    sources: [
      { name: "Wikipedia, Cryogenic gas plant", url: "https://en.wikipedia.org/wiki/Cryogenic_gas_plant" },
      { name: "Air Products, Cryogenic air separation", url: "https://www.airproducts.com" },
    ],
  },
  "mts-synthetic-iron-oxide-pigment-red": {
    routes: [
      "Penniman process, scrap iron + ferrous nitrate + air to grow hematite",
      "Laux process, by-product of aniline (nitrobenzene reduction) manufacture",
      "Direct precipitation/calcination of iron salts",
    ],
    mainProcess: {
      name: "Penniman / Laux synthetic process",
      detail:
        "Synthetic red iron oxide pigment (hematite, Fe2O3) is made by oxidative routes. In the Penniman process, scrap iron is dissolved with a little ferrous nitrate and air, growing red hematite particles on seed crystals. In the Laux process, the reduction of nitrobenzene to aniline over iron is run so the iron is converted into high-quality oxide pigment as a co-product. Precipitation routes oxidise/calcine iron salts. Particle size and shape set the red shade; the pigment is filtered, washed, dried and milled.",
    },
    manufacturers: [
      { name: "LANXESS (Bayferrox)", url: "https://lanxess.com" },
      { name: "Cathay Industries", url: "https://www.cathaypigments.com" },
      { name: "Venator", url: "https://www.venatorcorp.com" },
      { name: "Toda / ICC Industries", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "LANXESS, Bayferrox processes", url: "https://lanxess.com/en/products-and-brands/brands/bayferrox/products-and-applications" },
      { name: "PCI, A new development in Penniman red", url: "https://www.pcimag.com/articles/100040-a-new-development-in-penniman-red-production" },
    ],
  },
  "verol-pr-polyglycerol-polyricinoleate": {
    routes: [
      "Polymerise glycerol to polyglycerol under alkaline catalysis",
      "Interesterify/condense castor (ricinoleic) fatty acid",
      "Esterify polyglycerol with polyricinoleic acid to PGPR",
    ],
    mainProcess: {
      name: "Esterification of polyglycerol with polyricinoleic acid",
      detail:
        "PGPR (polyglycerol polyricinoleate, E476) is made in two stages from castor oil derivatives. Glycerol is heated above 200 °C with an alkaline catalyst to polyglycerol; separately, castor-oil ricinoleic acid is self-condensed (interesterified) to polyricinoleic acid via its hydroxyl groups. The polyglycerol and polyricinoleic acid are then esterified together at high temperature to the polymeric emulsifier. It is a powerful water-in-oil emulsifier and viscosity reducer, used chiefly in chocolate and spreads.",
    },
    manufacturers: [
      { name: "Palsgaard", url: "https://www.palsgaard.com" },
      { name: "Oleon", url: "https://www.oleon.com" },
      { name: "Lasenor", url: "https://lasenor.com" },
      { name: "Kerry Group", url: "https://www.kerry.com" },
      { name: "TER Chemicals", url: "https://www.terchemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Polyglycerol polyricinoleate", url: "https://en.wikipedia.org/wiki/Polyglycerol_polyricinoleate" },
      { name: "Google Patents US8101707B2, Direct manufacture of PGPR", url: "https://patents.google.com/patent/US8101707B2/en" },
    ],
  },
  "dense-soda-ash-packed-in-jumbo": {
    routes: [
      "Solvay (ammonia-soda) synthetic process",
      "Natural refining of trona ore",
      "Densification of light soda ash to dense grade",
    ],
    mainProcess: {
      name: "Solvay process / natural trona, then densification",
      detail:
        "Soda ash (sodium carbonate) is made by the Solvay ammonia-soda process, ammoniated brine is carbonated to precipitate sodium bicarbonate (NaCl + NH3 + CO2 + H2O → NaHCO3 + NH4Cl), which is calcined to soda ash, or by refining natural trona ore. 'Dense' soda ash is produced by hydrating light soda ash to the monohydrate and re-calcining (or by mechanical densification) to give larger, free-flowing, non-dusting granules preferred for glassmaking.",
    },
    manufacturers: [
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Tata Chemicals", url: "https://www.tatachemicals.com" },
      { name: "Ciner Resources", url: "https://www.ciner.us.com" },
      { name: "WE Soda", url: "https://www.wesoda.com" },
      { name: "GHCL", url: "https://www.ghcl.co.in" },
    ],
    sources: [
      { name: "Wikipedia, Solvay process", url: "https://en.wikipedia.org/wiki/Solvay_process" },
      { name: "C&EN, Synthetic soda ash", url: "https://cen.acs.org/business/specialty-chemicals/synthetic-soda-ash-survive/101/i7" },
    ],
  },
  "glycerine-purified": {
    routes: [
      "Recovery of crude glycerol from oleochemical/biodiesel processing",
      "Saponification/transesterification or fat-splitting glycerol streams",
      "Distillation and bleaching to refined glycerine",
    ],
    mainProcess: {
      name: "Refining of crude glycerol",
      detail:
        "Purified glycerine is refined from the crude glycerol co-produced when fats and oils are split, saponified or transesterified (soap and biodiesel manufacture). The crude glycerol is treated to remove salts, fatty matter and methanol, then vacuum-distilled and bleached (carbon treatment) to a clear, ~99.5% USP/食品 grade. It is a humectant and building block for foods, pharmaceuticals, personal care, polyols and explosives.",
    },
    manufacturers: [
      { name: "Wilmar International", url: "https://www.wilmar-international.com" },
      { name: "Cargill", url: "https://www.cargill.com" },
      { name: "KLK Oleo", url: "https://www.klkoleo.com" },
      { name: "IOI Oleochemical", url: "https://www.ioioleo.de" },
      { name: "Emery Oleochemicals", url: "https://www.emeryoleo.com" },
    ],
    sources: [
      { name: "Wikipedia, Glycerol", url: "https://en.wikipedia.org/wiki/Glycerol" },
      { name: "Procurement Resource, Glycerine production", url: "https://www.procurementresource.com" },
    ],
  },
  "magnesium-stearate-ip": {
    routes: [
      "Precipitation (double decomposition) from sodium stearate and a magnesium salt",
      "Direct (fusion) reaction of stearic acid with magnesium oxide/hydroxide",
      "Filtration, drying and milling to fine powder",
    ],
    mainProcess: {
      name: "Precipitation from sodium stearate",
      detail:
        "Magnesium stearate is made mainly by precipitation: stearic/palmitic acid is saponified with sodium hydroxide to sodium stearate, then reacted with an aqueous magnesium salt (magnesium sulfate or chloride) so magnesium stearate precipitates (2 C17H35COONa + MgSO4 → (C17H35COO)2Mg + Na2SO4). The fine precipitate is filtered, washed free of salt, dried and milled to a low-density powder. A fusion route reacts molten stearic acid directly with magnesium oxide/hydroxide. It is the most common pharmaceutical tablet lubricant.",
    },
    manufacturers: [
      { name: "Peter Greven", url: "https://www.peter-greven.de" },
      { name: "FACI", url: "https://www.facigroup.com" },
      { name: "Baerlocher", url: "https://www.baerlocher.com" },
      { name: "Nimbasia Stabilizers", url: "https://www.nimbasia.com" },
      { name: "Valtris Specialty Chemicals", url: "https://www.valtris.com" },
    ],
    sources: [
      { name: "Alapolystabs, Role of metallic stearates", url: "https://alapolystabs.com/role-of-metallic-stearates.html" },
      { name: "Procurement Resource, Magnesium stearate plant", url: "https://www.procurementresource.com/reports/magnesium-stearate-manufacturing-plant-project-report" },
    ],
  },
  "calcium-carbonate-light-powder": {
    routes: [
      "Precipitated (PCC): calcine limestone to lime, slake, then carbonate with CO2",
      "Ground (GCC): crush, mill and classify high-purity limestone/marble",
      "Coating (e.g. stearate) for filler grades",
    ],
    mainProcess: {
      name: "Carbonation of milk of lime (PCC)",
      detail:
        "Light (precipitated) calcium carbonate is made by a calcine-slake-carbonate loop: limestone is calcined to quicklime and CO2 (CaCO3 → CaO + CO2), the lime is slaked to milk of lime (CaO + H2O → Ca(OH)2), and CO2 (recovered from the kiln) is bubbled through it to reprecipitate fine calcium carbonate (Ca(OH)2 + CO2 → CaCO3 + H2O). Carbonation conditions set the crystal habit and particle size; the slurry is dewatered, dried and milled. 'Light' grade is the low-bulk-density precipitated product used as a filler/antacid.",
    },
    manufacturers: [
      { name: "Omya", url: "https://www.omya.com" },
      { name: "Imerys", url: "https://www.imerys.com" },
      { name: "Minerals Technologies", url: "https://www.mineralstech.com" },
      { name: "Mississippi Lime", url: "https://mississippilime.com" },
      { name: "Gulshan Polyols", url: "https://www.gulshanpolyols.com" },
    ],
    sources: [
      { name: "Sudarshan, PCC manufacturing process", url: "https://sudarshangroup.com/what-is-the-process-of-precipitated-calcium-carbonate-manufacturing/" },
      { name: "Mordor, PCC market", url: "https://www.mordorintelligence.com/industry-reports/precipitated-calcium-carbonate-market" },
    ],
  },
  "metamitron-technical": {
    routes: [
      "Build the triazinone ring from a phenyl-hydrazide and amino-nitrile precursor",
      "Cyclisation/condensation to 4-amino-3-methyl-6-phenyl-1,2,4-triazin-5-one",
      "Formulation to technical/SC grades",
    ],
    mainProcess: {
      name: "Triazinone ring synthesis",
      detail:
        "Metamitron is a 1,2,4-triazin-5-one herbicide. It is synthesised by building the triazinone ring, typically condensing a phenyl-substituted intermediate (from benzaldehyde/phenyl precursors) with an amino/hydrazine and a methyl-bearing nitrile or ester, then cyclising to 4-amino-3-methyl-6-phenyl-1,2,4-triazin-5(4H)-one. The technical active is purified and formulated (e.g. 70% SC). It is a photosystem-II-inhibiting selective herbicide used mainly in sugar and fodder beet.",
    },
    manufacturers: [
      { name: "ADAMA", url: "https://www.adama.com" },
      { name: "UPL", url: "https://www.upl-ltd.com" },
      { name: "Bayer CropScience", url: "https://www.bayer.com" },
      { name: "Sharda Cropchem", url: "https://www.shardacropchem.com" },
      { name: "Rayfull Chemicals", url: "https://www.rayfull.net" },
    ],
    sources: [
      { name: "ADAMA, Goltix (metamitron)", url: "https://www.adama.com/uk/en/our-solutions/herbicides/goltix-70-sc" },
      { name: "BCPC, UK pesticide guide", url: "https://www.bcpc.org" },
    ],
  },
  "manganese-oxide-60-62-feed": {
    routes: [
      "Reductive roasting of manganese ore/carbonate to MnO",
      "Reduction of higher manganese oxides (MnO2/Mn3O4) with a reductant",
      "Grinding/sizing to feed or chemical grade",
    ],
    mainProcess: {
      name: "Reductive roasting of manganese ore",
      detail:
        "Feed-grade manganese oxide (MnO, ~60-62% Mn) is made by reductively roasting/calcining a manganese source, manganese carbonate ore or higher manganese oxides, in a controlled reducing atmosphere so the manganese is converted to the green monoxide MnO and CO2/water is driven off. The product is cooled, milled and sized. It is used as a manganese micronutrient in animal feed and fertiliser and as a chemical/ceramic raw material.",
    },
    manufacturers: [
      { name: "Vibrantz Technologies (Prince)", url: "https://www.vibrantz.com" },
      { name: "Manmohan Minerals", url: "https://www.manmohan.com" },
      { name: "Mineore Enterprises", url: "https://mineoreenterprises.com" },
      { name: "Eramet / Comilog", url: "https://www.eramet.com" },
    ],
    sources: [
      { name: "Vibrantz, Manganese for animal feed", url: "https://vibrantz.com/markets/agriculture/animal-nutrition/" },
      { name: "Manganese Supply, MnO grades", url: "https://manganesesupply.com/chemical-industry-catalysts-grade-manganese-oxide-mno/" },
    ],
  },
  camphorusp: {
    routes: [
      "Isomerise alpha-pinene (turpentine) to camphene",
      "Esterify camphene to isobornyl acetate, hydrolyse to isoborneol",
      "Dehydrogenate isoborneol to camphor",
    ],
    mainProcess: {
      name: "Synthetic route from turpentine alpha-pinene",
      detail:
        "Most commercial camphor is synthetic, made from turpentine. Alpha-pinene is catalytically isomerised to camphene; the camphene is esterified with acetic acid to isobornyl acetate, which is hydrolysed (saponified) to isoborneol; the isoborneol is then catalytically dehydrogenated to camphor. The crude camphor is purified by sublimation/distillation and pressed into tablets or milled to powder. It is used in religious/medicinal products, plasticisers and as a moth repellent.",
    },
    manufacturers: [
      { name: "Oriental Aromatics", url: "https://www.orientalaromatics.com" },
      { name: "Mangalam Organics", url: "https://www.mangalamorganics.com" },
      { name: "Kanchi Karpooram", url: "https://www.kanchicamphor.com" },
      { name: "Saurabh Aromatics / Indian producers", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "NIIR, Synthetic camphor production", url: "https://www.niir.org/blog/production-of-synthetic-camphor/" },
      { name: "Sciencing, How synthetic camphor is made", url: "https://www.sciencing.com/how-does-5649691-synthetic-camphor-made-/" },
    ],
  },
  "pharmaceutical-raw-material-bulk-drugs-boric": {
    routes: [
      "React borax/colemanite with sulfuric acid, then crystallise boric acid",
      "Acidulation of borate ore concentrate",
      "Recrystallisation to technical/pharma grade",
    ],
    mainProcess: {
      name: "Acidulation of borate minerals",
      detail:
        "Boric acid is produced by reacting a refined borate, borax (sodium tetraborate) or colemanite/ulexite (calcium borate), with sulfuric acid: Na2B4O7 + H2SO4 + 5 H2O → 4 H3BO3 + Na2SO4. The acid breaks down the borate, releasing boric acid which is crystallised on cooling and separated from the sulfate by-product, then recrystallised to the required purity. About 80% of refined borates come from Turkey (Eti Maden) and California (Rio Tinto/U.S. Borax).",
    },
    manufacturers: [
      { name: "Eti Maden", url: "https://www.etimaden.gov.tr" },
      { name: "Rio Tinto / U.S. Borax", url: "https://www.borax.com" },
      { name: "Searles Valley Minerals", url: "https://www.svminerals.com" },
      { name: "Quiborax", url: "https://www.quiborax.com" },
    ],
    sources: [
      { name: "USGS, Boron minerals yearbook", url: "https://pubs.usgs.gov/myb/vol1/2019/myb1-2019-boron.pdf" },
      { name: "Procurement Resource, Boric acid plant", url: "https://www.procurementresource.com/reports/boric-acid-manufacturing-plant-project-report" },
    ],
  },
  "pharmaceutical-raw-materials-clobetasone-butyrate-bp": {
    routes: [
      "Multistep semi-synthesis from a steroid intermediate (e.g. from plant sterols)",
      "Selective halogenation, dehydrogenation and oxidation of the steroid nucleus",
      "Esterification of the 17-hydroxyl with butyric acid to the butyrate",
    ],
    mainProcess: {
      name: "Steroid semi-synthesis then 17-butyrate esterification",
      detail:
        "Clobetasone butyrate is a topical corticosteroid API made by multistep semi-synthesis from a steroid precursor (derived from plant sterols/diosgenin). The androstane/pregnane core is functionalised by selective dehydrogenation (1,2-double bond), 9-halogenation, and 11-keto/oxidation steps to build the clobetasone skeleton, after which the 17-hydroxyl is esterified with butyric acid (as the anhydride/chloride) to give the 17-butyrate. The API is crystallised and micronised to pharmacopoeial grade.",
    },
    manufacturers: [
      { name: "Symbiotec Pharmalab", url: "https://www.symbiotec.in" },
      { name: "Axplora (Farmabios)", url: "https://www.axplora.com" },
      { name: "Avik Pharmaceutical", url: "https://avikpharma.com" },
      { name: "Crystal Pharma (Aspen)", url: "https://www.aspenpharma.com" },
    ],
    sources: [
      { name: "PharmaCompass, Clobetasone butyrate manufacturers", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/clobetasone-butyrate" },
      { name: "Axplora, Clobetasone butyrate API", url: "https://www.axplora.com/api-product/25122-57-0-s/" },
    ],
  },
  undecavertol: {
    routes: [
      "Multistep synthesis of the unsaturated decenol aroma chemical (Givaudan)",
      "Aldol/Grignard build-up of the C-skeleton, then controlled unsaturation",
      "Distillation to perfumery grade",
    ],
    mainProcess: {
      name: "Synthesis of the violet-decenol musk (proprietary)",
      detail:
        "Undecavertol (4-methyl-3-decen-5-ol, a Givaudan captive) is a powerful green-floral aroma chemical discovered while elucidating trace components of lily-of-the-valley. It is made by a multistep synthesis that builds the branched decenol carbon skeleton (via aldol/Grignard chemistry) and installs the single double bond with controlled geometry, then is fractionally distilled to high-purity perfumery grade. It is used in tiny amounts for green, fruity, muguet and violet-leaf effects.",
    },
    manufacturers: [
      { name: "Givaudan", url: "https://www.givaudan.com" },
    ],
    sources: [
      { name: "Givaudan, Undecavertol", url: "https://www.givaudan.com/fragrance-beauty/eindex/undecavertol" },
      { name: "The Good Scents Company, undecavertol", url: "https://www.thegoodscentscompany.com/data/rw1003762.html" },
    ],
  },
  alum: {
    routes: [
      "Digest bauxite/alumina trihydrate in sulfuric acid",
      "Settle/clarify, concentrate and crystallise the hydrated alum",
      "Solid 'kibbled' alum or liquid grades",
    ],
    mainProcess: {
      name: "Sulfuric-acid digestion of alumina",
      detail:
        "Alum (aluminium sulfate, 'filter alum') is made by reacting an aluminium hydroxide source, bauxite or purer alumina trihydrate, with sulfuric acid: 2 Al(OH)3 + 3 H2SO4 + 8 H2O → Al2(SO4)3·14H2O. Using purified alumina trihydrate gives a low-iron product for paper and potable water. The hot liquor is clarified to remove insolubles and either sold as ~48% solution or concentrated and cast/crystallised to solid alum. It is consumed mainly as a coagulant in water/wastewater treatment and in paper sizing.",
    },
    manufacturers: [
      { name: "Kemira", url: "https://www.kemira.com" },
      { name: "USALCO", url: "https://www.usalco.com" },
      { name: "Chemtrade Logistics", url: "https://www.chemtradelogistics.com" },
      { name: "GEO Specialty Chemicals", url: "https://www.geosc.com" },
    ],
    sources: [
      { name: "NZIC, Manufacture of aluminium sulfate", url: "https://www.nzic.org.nz/unsecure_files/book/1F.pdf" },
      { name: "Affinity Chemical, Alum manufacturing", url: "https://www.affinitychemical.com/alum-manufacturing-techniques-the-affinity-process/" },
    ],
  },
  "phenoxyethyl-isobutyrate": {
    routes: [
      "Esterify 2-phenoxyethanol with isobutyric acid (acid catalysis)",
      "Azeotropic water removal to drive conversion",
      "Distillation to fragrance grade",
    ],
    mainProcess: {
      name: "Esterification of phenoxyethanol with isobutyric acid",
      detail:
        "Phenoxyethyl isobutyrate (a rose-honey fragrance ester) is made by Fischer esterification of 2-phenoxyethanol with isobutyric acid over an acid catalyst, with water removed azeotropically to drive the equilibrium: C6H5OCH2CH2OH + (CH3)2CHCOOH → C6H5OCH2CH2OOCCH(CH3)2 + H2O. The crude is neutralised, washed and fractionally distilled to a low-colour, low-odour perfumery grade used as a soft rosy/balsamic note and fixative.",
    },
    manufacturers: [
      { name: "IFF", url: "https://www.iff.com" },
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "Vigon International", url: "https://www.vigon.com" },
      { name: "Eternis Fine Chemicals", url: "https://www.eternis.com" },
    ],
    sources: [
      { name: "The Good Scents Company, phenoxyethyl isobutyrate", url: "https://www.thegoodscentscompany.com" },
      { name: "PubChem, Phenethyl/phenoxyethyl esters", url: "https://pubchem.ncbi.nlm.nih.gov/" },
    ],
  },
  "sodium-bromide-solution": {
    routes: [
      "Neutralise hydrobromic acid with sodium hydroxide/carbonate",
      "Reaction of bromine with sodium hydroxide, then reduce the bromate",
      "Crystallise/dry (or supply as solution)",
    ],
    mainProcess: {
      name: "Neutralisation of hydrobromic acid",
      detail:
        "Sodium bromide is made either by neutralising hydrobromic acid with sodium carbonate/hydroxide (2 HBr + Na2CO3 → 2 NaBr + CO2 + H2O), or by reacting bromine with sodium hydroxide to give a bromide/bromate mixture that is then reduced (e.g. with iron or a reducing agent) to all-bromide. The solution is concentrated and crystallised, or sold as a clear brine. It is used in oilfield completion fluids, as a biocide precursor, in photography and pharmaceuticals.",
    },
    manufacturers: [
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "LANXESS", url: "https://lanxess.com" },
      { name: "Albemarle", url: "https://www.albemarle.com" },
      { name: "TETRA Technologies", url: "https://www.tetratec.com" },
      { name: "Jordan Bromine Company", url: "https://www.jbcjordan.com" },
    ],
    sources: [
      { name: "ChemicalBook, Sodium bromide", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB3181001.htm" },
      { name: "Google Patents CN1354125A, Sodium bromide/bromate", url: "https://patents.google.com/patent/CN1354125A/en" },
    ],
  },
  "oxyclozan-de-vet-bp": {
    routes: [
      "Condense 3,5,6-trichlorosalicylic acid with 2-chloroaniline (salicylanilide formation)",
      "Amide coupling via the acid chloride/PCl3 route",
      "Crystallisation to BP/vet grade",
    ],
    mainProcess: {
      name: "Salicylanilide condensation",
      detail:
        "Oxyclozanide is a salicylanilide anthelmintic made by condensing a polyhalogenated salicylic acid (3,5,6-trichloro-2-hydroxybenzoic acid) with 2-chloroaniline to form the salicylanilide amide bond, typically by activating the acid (PCl3 or the acid chloride) and coupling with the amine. The crude is purified by crystallisation to BP grade. It uncouples oxidative phosphorylation in liver flukes and is used to treat fasciolosis in cattle, sheep and goats.",
    },
    manufacturers: [
      { name: "Orex Pharma", url: "https://orexpharma.com" },
      { name: "Aarambh Life Science", url: "https://www.aarambhlifescience.com" },
      { name: "Salvavidas Pharmaceutical", url: "https://www.salvavidaspharma.com" },
      { name: "SBD Healthcare", url: "https://www.sbdhealthcare.in" },
    ],
    sources: [
      { name: "PharmaCompass, Oxyclozanide manufacturers", url: "https://www.pharmacompass.com/listed-active-pharmaceutical-ingredients/oxyclozanide" },
      { name: "Orex Pharma, Oxyclozanide BP", url: "http://orexpharma.com/oxyclozanide-bp/" },
    ],
  },
  "copper-oxychloride-technical-material-as-per": {
    routes: [
      "Air oxidation of cuprous chloride in brine, then hydrolysis",
      "Precipitation from copper(II) chloride with a base",
      "Filtration/drying to fungicide grade",
    ],
    mainProcess: {
      name: "Air oxidation of copper chloride",
      detail:
        "Copper oxychloride is made by air-oxidising copper in a chloride medium. Copper (or cuprous chloride) in brine is heated to 60-90 °C and aerated so it oxidises and hydrolyses, precipitating fine copper oxychloride (Cu2(OH)3Cl); the mother liquor (CuCl2/NaCl) is recycled. Alternatively a copper(II) chloride solution is treated with alkali to raise pH and precipitate the product, which is filtered, washed and dried to a 1-5 µm green powder. It is a major protective copper fungicide/bactericide for crops.",
    },
    manufacturers: [
      { name: "IQV (Industrias Químicas del Vallés)", url: "https://iqvagro.com" },
      { name: "Manica", url: "https://www.manica.com" },
      { name: "Coromandel International", url: "https://www.coromandel.biz" },
      { name: "Spiess-Urania Chemicals", url: "https://www.spiess-urania.com" },
    ],
    sources: [
      { name: "Manica, Copper oxychloride", url: "https://www.manica.com/en/crop-protection/copper-oxychloride/" },
      { name: "Google Patents US2655432A, Producing copper oxychloride", url: "https://patents.google.com/patent/US2655432A/en" },
    ],
  },
  "phenylpentan-1-one-hclcas-no-16-1": {
    routes: [
      "Friedel-Crafts acylation of benzene with valeryl (pentanoyl) chloride",
      "Or aryl Grignard addition to a nitrile/aldehyde",
      "Work-up and distillation/crystallisation",
    ],
    mainProcess: {
      name: "Friedel-Crafts acylation to the aryl pentanone",
      detail:
        "1-Phenylpentan-1-one (valerophenone) and its salts are aryl alkyl ketone intermediates made by Friedel-Crafts acylation of benzene with valeryl (pentanoyl) chloride over an aluminium-chloride catalyst (C6H6 + C4H9COCl → C6H5COC4H9 + HCl), or by addition of a phenyl organometallic to a suitable nitrile/aldehyde. The crude ketone is washed and purified by distillation or crystallisation. Such aryl ketones are intermediates for pharmaceuticals and fine chemicals.",
    },
    manufacturers: [
      { name: "Tokyo Chemical Industry", url: "https://www.tcichemicals.com" },
      { name: "Merck KGaA", url: "https://www.merckgroup.com" },
      { name: "Simson Pharma", url: "https://www.simsonpharma.com" },
      { name: "Indian/Chinese fine-chem", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "PubChem, Valerophenone", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Valerophenone" },
      { name: "ChemicalBook, 1-Phenyl-1-pentanone", url: "https://www.chemicalbook.com/ProductIndex_EN.aspx" },
    ],
  },
  "aroma-chemicals-anethole": {
    routes: [
      "Base-catalysed isomerisation of estragole (from pine/basil oil) to trans-anethole",
      "Fractional distillation of anise/star-anise/fennel essential oils",
      "Acid-catalysed anisole + propionaldehyde condensation route",
    ],
    mainProcess: {
      name: "Isomerisation of estragole",
      detail:
        "trans-Anethole (the sweet anise/liquorice aroma chemical) is made industrially by base-catalysed isomerisation of estragole, sourced from crude sulfate turpentine or basil oil, at 140-215 °C with NaOH/KOH, which shifts the allyl double bond into the conjugated propenyl position and favours the stable trans isomer. It is also obtained naturally by fractional distillation of star-anise, anise and fennel oils, and synthetically by condensing anisole with propionaldehyde. The product is distilled/crystallised to high purity.",
    },
    manufacturers: [
      { name: "Symrise", url: "https://www.symrise.com" },
      { name: "Advanced Biotech", url: "https://www.adv-bio.com" },
      { name: "Givaudan", url: "https://www.givaudan.com" },
      { name: "Vigon International", url: "https://www.vigon.com" },
    ],
    sources: [
      { name: "Grokipedia, Anethole", url: "https://grokipedia.com/page/Anethole" },
      { name: "Google Patents CN103755533A, Anethole from estragole", url: "https://patents.google.com/patent/CN103755533A/en" },
    ],
  },
  "trixylenyl-phosphate": {
    routes: [
      "React phosphorus oxychloride with xylenol (mixed xylenols)",
      "Esterification under a metal-chloride catalyst, releasing HCl",
      "Washing, neutralisation and distillation",
    ],
    mainProcess: {
      name: "Esterification of POCl3 with xylenol",
      detail:
        "Trixylenyl phosphate (TXP) is a triaryl phosphate ester made by esterifying phosphorus oxychloride with xylenol (dimethylphenol) under a Lewis-acid catalyst (magnesium/aluminium chloride): POCl3 + 3 xylenol → (xylenyl-O)3P=O + 3 HCl. Each P-Cl bond is displaced by a xylenol, liberating hydrogen chloride (recovered). The crude ester is washed, neutralised and distilled. TXP is a flame-retardant plasticiser for PVC and a fire-resistant hydraulic fluid base.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://lanxess.com" },
      { name: "ICL Group", url: "https://www.icl-group.com" },
      { name: "Daihachi Chemical Industry", url: "https://www.daihachi-chem.co.jp" },
      { name: "Valtris (Santicizer)", url: "https://www.valtris.com" },
    ],
    sources: [
      { name: "Valtris, Santicizer phosphate esters", url: "https://www.valtris.com/product/plasticizers/santicizer-flame-retardant-plasticizers/" },
      { name: "NBInno, Trixylyl phosphate", url: "https://www.nbinno.com/flame-retardants/trixylyl-phosphate-txp-supplier-flame-retardant-plasticizer-ub" },
    ],
  },
  "aluminium-oxide-grains-artificial-corundum-w": {
    routes: [
      "Fuse calcined alumina (or bauxite) in an electric-arc furnace",
      "Brown fused alumina from bauxite + coke + iron; white from Bayer alumina",
      "Crush, magnetically clean and grade the grains",
    ],
    mainProcess: {
      name: "Electric-arc fusion of alumina",
      detail:
        "Fused alumina (artificial corundum) is made by melting alumina in an electric-arc furnace above ~2000 °C. White fused alumina is produced from high-purity Bayer-process alumina (>99% Al2O3); brown fused alumina is smelted from calcined bauxite with coke and iron filings to remove impurities. The solidified ingot is broken out, crushed, magnetically and chemically cleaned and screened into abrasive/refractory grit sizes. The product has Mohs hardness 9 and is used in abrasives, blasting and refractories.",
    },
    manufacturers: [
      { name: "Saint-Gobain", url: "https://www.saint-gobain.com" },
      { name: "Washington Mills", url: "https://www.washingtonmills.com" },
      { name: "Imerys Fused Minerals", url: "https://www.imerys.com" },
      { name: "Almatis", url: "https://www.almatis.com" },
      { name: "Henan Ruishi", url: "https://ruishi-abrasives.com" },
    ],
    sources: [
      { name: "Washington Mills, Brown fused aluminum oxide", url: "https://washingtonmills.com/products/brown-fused-aluminum-oxide" },
      { name: "Imerys, Fused alumina", url: "https://www.imerys.com/minerals/fused-alumina" },
    ],
  },
  "h-acid": {
    routes: [
      "Sulfonate naphthalene (trisulfonation)",
      "Nitrate, then reduce the nitro group to amino",
      "Alkali fusion to introduce the hydroxyl, then acidify",
    ],
    mainProcess: {
      name: "Naphthalene sulfonation-nitration-reduction-fusion",
      detail:
        "H acid (1-amino-8-naphthol-3,6-disulfonic acid) is a key dye intermediate built from naphthalene through a classic four-step sequence: trisulfonation of naphthalene with oleum, nitration of the naphthalenetrisulfonic acid, reduction of the nitro group to an amine (Tobias/amino acid intermediates), and alkali fusion (caustic) to replace one sulfonate with a hydroxyl, followed by acidification to precipitate H acid. It is used to make reactive and acid azo dyes (black/navy shades).",
    },
    manufacturers: [
      { name: "Kiri Industries", url: "https://www.kiriindustries.com" },
      { name: "Bodal Chemicals", url: "https://www.bodal.com" },
      { name: "Aarti Industries", url: "https://www.aarti-industries.com" },
      { name: "Zhejiang Longsheng", url: "https://www.longsheng.com" },
    ],
    sources: [
      { name: "NBInno, Naphthalene dye intermediates", url: "https://www.nbinno.com/article/dye-intermediates/from-naphthalene-to-vivid-hues-the-synthesis-of-1-naphthylamine-5-sulfonic-acid-and-its-derivatives-lr" },
      { name: "Grokipedia, Naphthalene", url: "https://grokipedia.com/page/Naphthalene" },
    ],
  },
  "tertairy-amyl-methyl-ether": {
    routes: [
      "Etherify isoamylenes (C5 olefins) with methanol over acidic ion-exchange resin",
      "Catalytic-distillation reactor for high conversion",
      "Separation from the C5 raffinate",
    ],
    mainProcess: {
      name: "Acid-resin etherification of isoamylenes with methanol",
      detail:
        "TAME (tertiary amyl methyl ether) is a gasoline oxygenate made by reacting the reactive isoamylenes (2-methyl-1-butene and 2-methyl-2-butene) in a refinery C5 stream with methanol over an acidic sulfonic ion-exchange resin: isoamylene + CH3OH → TAME. It is typically run in a catalytic-distillation column to push conversion despite the equilibrium limit; unreacted C5s (raffinate) and excess methanol are recovered. TAME raises gasoline octane and oxygen content.",
    },
    manufacturers: [
      { name: "Sinopec", url: "https://www.sinopec.com" },
      { name: "LyondellBasell", url: "https://www.lyondellbasell.com" },
      { name: "Neste", url: "https://www.neste.com" },
      { name: "Refinery oxygenate units", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Wiley, Synthesis of TAME equilibrium", url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/ceat.270180205" },
      { name: "Google Patents US4988366, TAME/MTBE production", url: "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4988366" },
    ],
  },
  "zinc-citrate-trihydrate-ih": {
    routes: [
      "Neutralise citric acid with a high-purity zinc source (zinc oxide/carbonate)",
      "Precipitate and dehydrate to the di/trihydrate",
      "Mill to pharma/food grade",
    ],
    mainProcess: {
      name: "Neutralisation of citric acid with zinc oxide",
      detail:
        "Zinc citrate is made by completely neutralising citric acid with a high-purity zinc source, zinc oxide, hydroxide or carbonate, in water (3 ZnO + 2 C6H8O7 → Zn3(C6H5O7)2 + 3 H2O), then precipitating and dehydrating to the dihydrate or trihydrate. Integrated producers use captive citric acid. The fine powder is washed, dried and milled to pharmacopoeial grade, used as a zinc supplement in tablets and as an anti-plaque/anti-tartar active in toothpaste.",
    },
    manufacturers: [
      { name: "Jungbunzlauer", url: "https://www.jungbunzlauer.com" },
      { name: "Gadot Biochemical", url: "https://www.gadot-bio.com" },
      { name: "Dr. Paul Lohmann", url: "https://www.lohmann-minerals.com" },
      { name: "Jost Chemical", url: "https://www.jostchemical.com" },
    ],
    sources: [
      { name: "Jungbunzlauer, Zinc citrate", url: "https://www.jungbunzlauer.com/en/products/special-salts/zinc-citrate" },
      { name: "Mordor, Zinc citrate market", url: "https://www.mordorintelligence.com/industry-reports/zinc-citrate-market" },
    ],
  },
  "cis-8-methoxy-1-3-diaza-spiro-decane-2-4-dione-sodium-salt": {
    routes: [
      "Build the spiro-hydantoin ring from a cyclohexanone derivative via Bucherer-Bergs reaction",
      "Methoxy substitution and resolution of the cis-isomer",
      "Form the sodium salt",
    ],
    mainProcess: {
      name: "Bucherer-Bergs spiro-hydantoin synthesis",
      detail:
        "cis-8-Methoxy-1,3-diazaspiro[4.5]decane-2,4-dione (a spiro-hydantoin pharmaceutical intermediate) is built by a Bucherer-Bergs reaction: a substituted (8-methoxy) cyclohexanone is condensed with potassium cyanide and ammonium carbonate to spiro-fuse a hydantoin (1,3-diazaspirodecane-2,4-dione) ring onto the carbocycle. The cis diastereomer is separated, and the acidic hydantoin N-H is converted to the sodium salt for handling. It serves as a chiral/achiral building block in API synthesis.",
    },
    manufacturers: [
      { name: "Chinese/Indian fine-chem (custom synthesis)", url: "https://www.chemicalbook.com" },
      { name: "Tokyo Chemical Industry", url: "https://www.tcichemicals.com" },
      { name: "Simson Pharma", url: "https://www.simsonpharma.com" },
    ],
    sources: [
      { name: "Wikipedia, Bucherer-Bergs reaction", url: "https://en.wikipedia.org/wiki/Bucherer%E2%80%93Bergs_reaction" },
      { name: "PubChem, diazaspirodecane-dione", url: "https://pubchem.ncbi.nlm.nih.gov/" },
    ],
  },
  "propanil-dg-stam-dg-x-kg": {
    routes: [
      "Nitrate o-dichlorobenzene, hydrogenate to 3,4-dichloroaniline",
      "Acylate 3,4-dichloroaniline with propionyl chloride",
      "Crystallise/formulate the anilide herbicide",
    ],
    mainProcess: {
      name: "Acylation of 3,4-dichloroaniline with propionyl chloride",
      detail:
        "Propanil is an acetanilide herbicide. The aniline building block is made by nitrating 1,2-dichlorobenzene to 1,2-dichloro-4-nitrobenzene and hydrogenating the nitro group (Raney nickel) to 3,4-dichloroaniline. This amine is then acylated with propionyl chloride in the presence of a base/acid scavenger to form the propionamide (3',4'-dichloropropionanilide). The technical is crystallised and formulated (EC/SC). It is a contact, photosystem-II-inhibiting herbicide used mainly in rice.",
    },
    manufacturers: [
      { name: "UPL", url: "https://www.upl-ltd.com" },
      { name: "Corteva Agriscience", url: "https://www.corteva.com" },
      { name: "Rotam", url: "https://www.rotam.com" },
      { name: "RiceCo", url: "https://www.riceco.com" },
    ],
    sources: [
      { name: "Wikipedia, Propanil", url: "https://en.wikipedia.org/wiki/Propanil" },
      { name: "Grokipedia, Propionyl chloride", url: "https://grokipedia.com/page/Propionyl_chloride" },
    ],
  },
  "calcined-alumina": {
    routes: [
      "Bayer process, caustic digestion of bauxite, precipitate aluminium hydroxide",
      "Calcine aluminium hydroxide in rotary kiln/fluid bed to alpha-alumina",
      "Mill/grade to reactive, low-soda or tabular grades",
    ],
    mainProcess: {
      name: "Bayer process plus calcination",
      detail:
        "Calcined alumina is made by calcining the aluminium hydroxide from the Bayer process. Bauxite is digested in hot caustic soda under pressure, dissolving alumina as sodium aluminate (red-mud residue filtered off); on cooling and seeding, aluminium hydroxide precipitates. This hydrate is calcined at ~1000-1200 °C to alpha-alumina (2 Al(OH)3 → Al2O3 + 3 H2O), with temperature and mineralisers controlling crystal size, soda content and alpha ratio. Grades serve refractories, ceramics, polishing and technical uses.",
    },
    manufacturers: [
      { name: "Almatis", url: "https://www.almatis.com" },
      { name: "Alteo", url: "https://www.alteo-alumina.com" },
      { name: "Nabaltec", url: "https://www.nabaltec.de" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
      { name: "J.M. Huber", url: "https://www.hubermaterials.com" },
    ],
    sources: [
      { name: "Aluminium Guide, Bayer process", url: "https://aluminium-guide.com/bayer-process-bauxite-alumina/" },
      { name: "EPSA, Specialty aluminas", url: "https://specialty-chemicals.eu/epsa/" },
    ],
  },
  "n-chlorosuccinimide-x": {
    routes: [
      "Chlorinate succinimide with chlorine or sodium hypochlorite",
      "Maintain alkaline conditions and low temperature",
      "Filter, wash and dry the N-chloro product",
    ],
    mainProcess: {
      name: "N-chlorination of succinimide",
      detail:
        "N-Chlorosuccinimide (NCS) is made by chlorinating succinimide at the N-H position using a Cl+ source, chlorine gas or sodium hypochlorite (bleach), under controlled alkaline, low-temperature conditions: succinimide + Cl source → N-chlorosuccinimide. The product precipitates and is filtered, washed and dried. NCS is a convenient solid chlorinating and mild oxidising reagent for pharmaceuticals, agrochemicals and fine-chemical synthesis (e.g. allylic chlorination, alcohol oxidation).",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://lanxess.com" },
      { name: "Halides Chemicals", url: "http://www.halideschemicals.com" },
      { name: "CDH Fine Chemical", url: "https://www.cdhfinechemical.com" },
      { name: "Jiangsu/Chinese fine-chem", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Wikipedia, N-Chlorosuccinimide", url: "https://en.wikipedia.org/wiki/N-Chlorosuccinimide" },
      { name: "NBInno, Chemistry of N-chlorosuccinimide", url: "https://www.nbinno.com/article/other-organic-chemicals/the-chemistry-of-n-chlorosuccinimide-synthesis-industrial-applications" },
    ],
  },
  "pharmaceutical-raw-materials-rani-tid-ine": {
    routes: [
      "Build the furan core bearing the dimethylaminomethyl group",
      "Couple with a cysteamine-derived side chain",
      "Condense with nitromethylene to the ranitidine base, then form the HCl salt",
    ],
    mainProcess: {
      name: "Furan coupling then nitroethenediamine formation",
      detail:
        "Ranitidine hydrochloride (an H2-receptor antagonist API) is synthesised by building a 5-(dimethylaminomethyl)furan-2-yl-methanethiol intermediate, coupling it (via the thioether) with a cysteamine-type chain, and condensing with a nitromethylene/N-methyl-1-(methylthio)-2-nitroethenamine reagent to install the characteristic nitroethenediamine group; the base is then converted to the hydrochloride salt and crystallised (Form 1/2). Note: ranitidine has faced regulatory restrictions over NDMA-impurity concerns, so manufacturers apply tight nitrosamine control.",
    },
    manufacturers: [
      { name: "SMS Pharmaceuticals", url: "https://smspharma.com" },
      { name: "Saraca Laboratories", url: "https://www.saracalaboratories.com" },
      { name: "Dr. Reddy's Laboratories", url: "https://www.drreddys.com" },
      { name: "Hetero", url: "https://www.heteroworld.com" },
    ],
    sources: [
      { name: "PharmaCompass, Ranitidine HCl manufacturers", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/ranitidine-hydrochloride" },
      { name: "Google Patents US5621120, Form 1 ranitidine HCl", url: "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/5621120" },
    ],
  },
  "permethric-acid-chloride": {
    routes: [
      "Build the dichlorovinyl-dimethyl-cyclopropane carboxylic (DV) acid",
      "Convert the acid to its chloride with thionyl chloride",
      "Distil the acid chloride under anhydrous conditions",
    ],
    mainProcess: {
      name: "Acid-chloride formation of DV (permethric) acid",
      detail:
        "Permethric/cypermethric acid chloride (DV-acid chloride; 3-(2,2-dichlorovinyl)-2,2-dimethylcyclopropane-1-carbonyl chloride) is the key pyrethroid intermediate. The cyclopropane DV-acid is first synthesised (cyclopropanation building the gem-dimethyl cyclopropane ring bearing a dichlorovinyl group), then converted to the acid chloride with thionyl chloride (RCOOH + SOCl2 → RCOCl + SO2 + HCl) and distilled under anhydrous conditions. It is condensed with 3-phenoxybenzyl alcohol/cyanohydrin to make permethrin, cypermethrin and deltamethrin.",
    },
    manufacturers: [
      { name: "Jiangsu Yangnong Chemical", url: "https://www.chemicalbook.com" },
      { name: "Sumitomo Chemical", url: "https://www.sumitomo-chem.co.jp" },
      { name: "Gharda Chemicals", url: "https://gharda.com" },
      { name: "Tagros Chemicals", url: "https://www.tagros.com" },
    ],
    sources: [
      { name: "Gharda, Cypermethric acid chloride (DV acid chloride)", url: "https://gharda.com/cypermethric-acid-chloride-d-v-acid-chloride" },
      { name: "ChemBK, Cypermethric acid chloride", url: "https://www.chembk.com/en/chem/Cypermethric%20Acid%20Chloride" },
    ],
  },
  "neostigmine-methyl-sulphate": {
    routes: [
      "React 3-dimethylaminophenol with dimethylcarbamoyl chloride to the carbamate",
      "Quaternise with dimethyl sulfate to the methylsulfate salt",
      "Crystallise to API grade",
    ],
    mainProcess: {
      name: "Carbamoylation then quaternisation",
      detail:
        "Neostigmine methylsulfate (a cholinesterase-inhibitor API) is made by carbamoylating 3-(dimethylamino)phenol with dimethylcarbamoyl chloride to form the dimethylcarbamate ester, then quaternising the dimethylamino nitrogen with dimethyl sulfate to give the trimethyl-ammonium methylsulfate salt. The API is purified by crystallisation. It reversibly inhibits acetylcholinesterase and is used to reverse neuromuscular blockade and treat myasthenia gravis.",
    },
    manufacturers: [
      { name: "Enaltec Labs", url: "https://www.enaltec.com" },
      { name: "IQGENX Pharma", url: "https://www.chemicalbook.com" },
      { name: "Shaivya Pharmachem", url: "https://shaivyapharmachem.co.in" },
      { name: "LGM Pharma", url: "https://lgmpharma.com" },
    ],
    sources: [
      { name: "PharmaCompass, Neostigmine methylsulfate", url: "https://www.pharmacompass.com/manufacturers-suppliers-exporters/neostigmine-methylsulfate" },
      { name: "Wiley IJAC, Neostigmine methylsulfate analysis", url: "https://onlinelibrary.wiley.com/doi/10.1155/2021/5570173" },
    ],
  },
  "tax-invoice-no-trifluoro-acetic-acid": {
    routes: [
      "Electrochemical fluorination of acetyl chloride/acetic anhydride, then hydrolysis",
      "Hydrolysis of CFC-113a (in China)",
      "Oxidation/purification to anhydrous TFA",
    ],
    mainProcess: {
      name: "Electrofluorination then hydrolysis",
      detail:
        "Trifluoroacetic acid (TFA) is made by electrochemical fluorination, acetyl chloride or acetic anhydride is electrolysed in anhydrous hydrogen fluoride (Simons process) to perfluoroacetyl fluoride, which is hydrolysed to TFA. In China much TFA is made by hydrolysing CFC-113a (1,1,1-trichloro-2,2,2-trifluoroethane). The strongly corrosive intermediates demand specialised equipment, and the crude is distilled to anhydrous high-purity acid. TFA is used in pharmaceutical synthesis, peptide chemistry and as a strong acid reagent.",
    },
    manufacturers: [
      { name: "Halocarbon Products", url: "https://www.halocarbon.com" },
      { name: "SRF Limited", url: "https://www.srf.com" },
      { name: "Sinochem", url: "https://www.sinochem.com" },
      { name: "Solvay (until 2026)", url: "https://www.solvay.com" },
    ],
    sources: [
      { name: "Wikipedia, Trifluoroacetic acid", url: "https://en.wikipedia.org/wiki/Trifluoroacetic_acid" },
      { name: "Solvay, Update on TFA", url: "https://www.solvay.com/en/tfa" },
    ],
  },
  "sodium-saccharin-pure-dental": {
    routes: [
      "Maumee (Sherwin-Williams) process from phthalic anhydride via anthranilic acid",
      "Remsen-Fahlberg process from toluene",
      "Neutralise saccharin to the sodium salt and crystallise",
    ],
    mainProcess: {
      name: "Maumee / Remsen-Fahlberg synthesis then neutralisation",
      detail:
        "Sodium saccharin is the soluble salt of saccharin. In the Maumee (Sherwin-Williams) process, phthalic anhydride is converted to anthranilic acid, which is diazotised and reacted with sulfur dioxide, chlorine and ammonia to build the benzisothiazolone-dioxide (saccharin) ring. In the older Remsen-Fahlberg route, toluene is sulfonated (chlorosulfonic acid), amidated, then the methyl group oxidised and cyclised to saccharin. The saccharin is neutralised with sodium hydroxide/carbonate and crystallised as the sodium salt (E954).",
    },
    manufacturers: [
      { name: "Kaifeng Xinghua Fine Chemical", url: "https://www.chemicalbook.com" },
      { name: "Productos Aditivos", url: "https://www.chemicalbook.com" },
      { name: "Vishnu Chemicals / Indian producers", url: "https://www.chemicalbook.com" },
      { name: "Shree Vardayini Chemical", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Wikipedia, Saccharin", url: "https://en.wikipedia.org/wiki/Saccharin" },
      { name: "EFSA, Re-evaluation of saccharin and salts", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11565076/" },
    ],
  },
  "alpha-alpha-alpha-trifluoro-p-tolualde-h": {
    routes: [
      "Side-chain oxidation/hydrolysis of 4-(trifluoromethyl)toluene",
      "Chlorination to the benzal chloride, then hydrolysis",
      "Distillation to the aldehyde",
    ],
    mainProcess: {
      name: "Benzal-chloride hydrolysis route",
      detail:
        "alpha,alpha,alpha-Trifluoro-p-tolualdehyde (4-(trifluoromethyl)benzaldehyde) is made from 4-(trifluoromethyl)toluene by side-chain chlorination of the methyl group to the benzal chloride (Ar-CHCl2), which is then hydrolysed to the aldehyde (Ar-CHO); controlled catalytic air oxidation of the methyl group is an alternative. The crude is distilled to high purity. It is a key intermediate for the insecticide fipronil and for pharmaceuticals and liquid crystals.",
    },
    manufacturers: [
      { name: "Tokyo Chemical Industry", url: "https://www.tcichemicals.com" },
      { name: "Simson Pharma", url: "https://www.simsonpharma.com" },
      { name: "Unilong Industry", url: "https://www.unilongmaterial.com" },
      { name: "Nantong Reform Petrochemical", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "TCI, 4-(Trifluoromethyl)benzaldehyde", url: "https://www.tcichemicals.com/OP/en/p/T1091" },
      { name: "ChemicalBook, 4-(Trifluoromethyl)benzaldehyde", url: "https://www.chemicalbook.com/ChemicalProductProperty_EN_CB6403483.htm" },
    ],
  },
  "potassium-fluoroborate-potassium-fluorotitanate": {
    routes: [
      "Dissolve boric acid in hydrofluoric acid to fluoroboric acid",
      "Neutralise/metathesise with a potassium salt (KOH/K2CO3/KCl)",
      "Crystallise potassium tetrafluoroborate (and fluorotitanate analogously)",
    ],
    mainProcess: {
      name: "Fluoroboric acid + potassium salt",
      detail:
        "Potassium fluoroborate (potassium tetrafluoroborate, KBF4) is made by first dissolving boric acid in aqueous hydrofluoric acid to form fluoroboric acid (H3BO3 + 4 HF → HBF4 + 3 H2O), then reacting it with a potassium source (potassium hydroxide, carbonate or chloride) so the sparingly soluble KBF4 crystallises out, which is filtered and dried. Potassium fluorotitanate (K2TiF6) is made analogously from titanium/HF and a potassium salt. They are used as fluxes, in aluminium grain-refining, abrasives and electronics.",
    },
    manufacturers: [
      { name: "Derivados del Fluor", url: "https://www.derivadosdelfluor.com" },
      { name: "Solvay", url: "https://www.solvay.com" },
      { name: "Honeywell (Solstice)", url: "https://advancedmaterials.honeywell.com" },
      { name: "Morita Chemical", url: "https://www.morita-kagaku.com" },
      { name: "American Elements", url: "https://www.americanelements.com" },
    ],
    sources: [
      { name: "DDFluor, Potassium fluoroborate KBF4", url: "https://www.ddfluor.com/fluorochemicals/potassium-fluoroborate-kbf4/" },
      { name: "American Elements, Potassium tetrafluoroborate", url: "https://www.americanelements.com/potassium-tetrafluoroborate-14075-53-7" },
    ],
  },
  "denatonium-benzoate": {
    routes: [
      "React lidocaine (a tertiary amine) with benzyl chloride to denatonium chloride",
      "Metathesis with sodium benzoate to denatonium benzoate",
      "Crystallise the bitter quaternary salt",
    ],
    mainProcess: {
      name: "Benzylation of lidocaine then benzoate exchange",
      detail:
        "Denatonium benzoate (Bitrex, the bitterest known substance) is a quaternary-ammonium salt made by benzylating the tertiary amine of lidocaine with benzyl chloride to give denatonium chloride, then exchanging the anion with sodium benzoate to the benzoate salt (or reacting denatonium chloride with benzyl benzoate). The product is crystallised. It was discovered by Macfarlan Smith (now Veranova) in 1958 and is used as an aversive agent/denaturant in antifreeze, alcohols, household chemicals and to deter ingestion.",
    },
    manufacturers: [
      { name: "Veranova (Macfarlan Smith)", url: "https://www.veranova.com" },
      { name: "Johnson Matthey", url: "https://matthey.com" },
      { name: "Aako", url: "https://www.aako.nl" },
      { name: "Indian/Chinese fine-chem", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "Johnson Matthey/CPHI, Bitrex (denatonium benzoate)", url: "https://www.cphi-online.com/bitrex-denatonium-benzoate-prod710530.html" },
      { name: "Wikipedia, MacFarlan Smith", url: "https://en.wikipedia.org/wiki/MacFarlan_Smith" },
    ],
  },
  "carbon-black-acetylene-compressed": {
    routes: [
      "Continuous thermal decomposition of acetylene at 800-1000 °C",
      "Self-sustaining exothermic cracking with water cooling",
      "Collection, densification and packing of the black",
    ],
    mainProcess: {
      name: "Thermal decomposition of acetylene",
      detail:
        "Acetylene black is a high-purity, highly conductive carbon black made by the continuous thermal decomposition of acetylene at atmospheric pressure and about 800-1000 °C. Above ~800 °C the cracking of acetylene to carbon and hydrogen is exothermic and self-sustaining, so the reactor needs water cooling to hold temperature; the resulting carbon is collected, deaerated and densified. Its very high purity, structure and conductivity suit dry-cell batteries, conductive plastics/rubbers and cable compounds.",
    },
    manufacturers: [
      { name: "Denka", url: "https://www.denka.co.jp" },
      { name: "Cabot Corporation", url: "https://www.cabotcorp.com" },
      { name: "Orion S.A.", url: "https://www.orioncarbons.com" },
      { name: "Soltex", url: "https://www.soltexinc.com" },
    ],
    sources: [
      { name: "Denka, Denka Black", url: "https://www.denka.co.jp/eng/product/detail_00025/" },
      { name: "UT Austin, Carbon black from acetylene decomposition", url: "https://repositories.lib.utexas.edu/items/80c43471-da93-4f1a-8752-65cb78e76986" },
    ],
  },
  "date-04-methyldiethanolamine": {
    routes: [
      "React ethylene oxide with monomethylamine in aqueous medium",
      "Control EO:amine ratio to favour the di-ethoxylated (MDEA) product",
      "Vacuum distillation to purity",
    ],
    mainProcess: {
      name: "Ethylene oxide + monomethylamine",
      detail:
        "Methyldiethanolamine (MDEA) is a tertiary alkanolamine made by reacting ethylene oxide with monomethylamine: CH3NH2 + 2 C2H4O → CH3N(CH2CH2OH)2. The reaction is run in the liquid phase at about 60-160 °C and modest pressure with the EO-to-amine ratio set to favour the di-substituted MDEA over the mono product; the crude is dried and vacuum-distilled. MDEA's key feature is its selectivity for H2S over CO2, making it the workhorse amine for natural-gas/refinery acid-gas sweetening; it is also a concrete additive and intermediate.",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Dow", url: "https://www.dow.com" },
      { name: "Huntsman", url: "https://www.huntsman.com" },
      { name: "INEOS Oxide", url: "https://www.ineos.com" },
      { name: "Eastman Chemical", url: "https://www.eastman.com" },
    ],
    sources: [
      { name: "Wikipedia, Methyldiethanolamine", url: "https://en.wikipedia.org/wiki/Methyldiethanolamine" },
      { name: "Grokipedia, Methyldiethanolamine", url: "https://grokipedia.com/page/Methyldiethanolamine" },
    ],
  },
  "ammonium-bi-sulphite-solution": {
    routes: [
      "Absorb sulfur dioxide into aqueous ammonia",
      "Control pH to the bisulfite (mono) salt",
      "Standardise to solution grade",
    ],
    mainProcess: {
      name: "SO2 absorption in aqueous ammonia",
      detail:
        "Ammonium bisulphite solution is made by absorbing sulfur dioxide gas (from sulfur burning or a smelter/flue stream) into aqueous ammonia: NH3 + SO2 + H2O → NH4HSO3. The pH is held in the bisulfite (acidic) range rather than the neutral sulfite, and the strength is standardised, usually to a ~65-70% equivalent solution. It is used as a reducing agent, oxygen scavenger and preservative, in pulp/paper, water treatment, and oilfield, and as a source of sulfite for chemical synthesis.",
    },
    manufacturers: [
      { name: "Esseco Group", url: "https://www.esseco.it" },
      { name: "Chemtrade Logistics", url: "https://www.chemtradelogistics.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "Hydrite Chemical", url: "https://www.hydrite.com" },
    ],
    sources: [
      { name: "PubChem, Ammonium bisulfite", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Ammonium-bisulfite" },
      { name: "ChemicalBook, Ammonium bisulfite", url: "https://www.chemicalbook.com/ProductIndex_EN.aspx" },
    ],
  },
  "aqueous-ammonia-solution-iupacname-ammonium-hydroxide": {
    routes: [
      "Synthesise anhydrous ammonia (Haber-Bosch)",
      "Dissolve/absorb ammonia gas into demineralised water",
      "Standardise to the required concentration (often ~25%)",
    ],
    mainProcess: {
      name: "Dissolution of ammonia in water",
      detail:
        "Aqueous ammonia (ammonium hydroxide) is simply ammonia gas dissolved in water. The ammonia is first made by the Haber-Bosch process (N2 + 3 H2 → 2 NH3 over an iron catalyst at high pressure/temperature); compressed anhydrous ammonia is then absorbed into demineralised water in an absorber with cooling (the dissolution is exothermic) and the solution is standardised to a target strength, commonly ~24.5%, up to ~33%. It is used in water treatment, NOx control (SCR), cleaning, fertiliser and as a chemical reagent.",
    },
    manufacturers: [
      { name: "Yara International", url: "https://www.yara.com" },
      { name: "CF Industries", url: "https://www.cfindustries.com" },
      { name: "Nutrien", url: "https://www.nutrien.com" },
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Tata Chemicals", url: "https://www.tatachemicals.com" },
    ],
    sources: [
      { name: "Wikipedia, Ammonia solution", url: "https://en.wikipedia.org/wiki/Ammonia_solution" },
      { name: "Vaisala, Liquid ammonia/ammonium hydroxide process", url: "https://www.vaisala.com/en/chemical-industry-solutions/chemicals-allied-products/liquid-ammonia-ammonium-hydroxide-production-process" },
    ],
  },
  "sodium-trichloracetate": {
    routes: [
      "Chlorinate acetic acid to trichloroacetic acid",
      "Neutralise trichloroacetic acid with sodium hydroxide/carbonate",
      "Crystallise/dry sodium trichloroacetate",
    ],
    mainProcess: {
      name: "Neutralisation of trichloroacetic acid",
      detail:
        "Sodium trichloroacetate is the sodium salt of trichloroacetic acid (TCA). TCA is made by exhaustive chlorination of acetic acid (or hydrolysis of chloral/trichloroacetonitrile); it is then neutralised with sodium hydroxide or sodium carbonate (CCl3COOH + NaOH → CCl3COONa + H2O) and the solution concentrated and crystallised/dried. It was widely used as a soil-acting (TCA) herbicide against grasses and as a chemical intermediate; handling controls apply because TCA is corrosive.",
    },
    manufacturers: [
      { name: "Aarti Industries", url: "https://www.aarti-industries.com" },
      { name: "Hubei/Jiangsu chloroacetyl producers", url: "https://www.chemicalbook.com" },
      { name: "Niacet/Nouryon (chloroacetyl)", url: "https://www.nouryon.com" },
      { name: "Denak / Spanish producers", url: "https://www.chemicalbook.com" },
    ],
    sources: [
      { name: "PubChem, Sodium trichloroacetate", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-trichloroacetate" },
      { name: "Wikipedia, Trichloroacetic acid", url: "https://en.wikipedia.org/wiki/Trichloroacetic_acid" },
    ],
  },
  "nickel-sulphate": {
    routes: [
      "Dissolve nickel metal/oxide/hydroxide in sulfuric acid",
      "Purify by solvent extraction/ion exchange (battery grade)",
      "Crystallise nickel sulfate hexahydrate",
    ],
    mainProcess: {
      name: "Acid dissolution of nickel, then crystallisation",
      detail:
        "Nickel sulphate is made by dissolving nickel metal, nickel oxide or nickel hydroxide (or nickel-bearing refinery intermediates) in sulfuric acid: Ni + H2SO4 (+ ½O2) → NiSO4 + H2O. The crude solution is filtered and purified, for battery grade by solvent extraction/ion exchange to strip cobalt, iron and copper, then concentrated and crystallised as the hexahydrate (NiSO4·6H2O). It is the key precursor for nickel-rich NMC/NCA lithium-ion cathode materials, and is used in electroplating.",
    },
    manufacturers: [
      { name: "Umicore", url: "https://www.umicore.com" },
      { name: "Sumitomo Metal Mining", url: "https://www.smm.co.jp" },
      { name: "Jinchuan Group", url: "https://www.jnmc.com" },
      { name: "Norilsk Nickel", url: "https://www.nornickel.com" },
      { name: "GEM Co.", url: "https://www.gem.com.cn" },
    ],
    sources: [
      { name: "Umicore, Cobalt & nickel precursors", url: "https://www.umicore.com/en/markets-products/automotive-mobility/battery-materials/cobalt-nickel-precursors/" },
      { name: "ScienceDirect, Battery-grade nickel sulfate", url: "https://www.sciencedirect.com/science/article/pii/S1383586625042698" },
    ],
  },
  "dehydrated-castor-oil-fatty-acid-per": {
    routes: [
      "Dehydrate castor oil at ~250 °C with an acid/clay catalyst under vacuum",
      "Steam-split the dehydrated oil to fatty acids + glycerol",
      "Distil to the high-diene DCOFA",
    ],
    mainProcess: {
      name: "Dehydration of castor oil then fat splitting",
      detail:
        "Dehydrated castor oil fatty acid (DCOFA) is a high-diene conjugated fatty acid made from castor oil. Refined castor oil is dehydrated at about 250 °C under vacuum/inert gas with an acid or activated-clay catalyst, eliminating water from the hydroxyl/adjacent-hydrogen of the ricinoleate to create conjugated/non-conjugated diene unsaturation. The dehydrated oil is then high-pressure steam-split to fatty acids and glycerol, and the DCOFA is distilled. Its drying-oil character suits alkyds, epoxy esters and inks/coatings.",
    },
    manufacturers: [
      { name: "Jayant Agro-Organics", url: "https://www.jayantagro.com" },
      { name: "NK Proteins", url: "https://www.nkproteins.com" },
      { name: "Girnar Industries", url: "https://girnarindustries.com" },
      { name: "Itoh Oil Chemicals", url: "https://www.itoh-oil.co.jp" },
    ],
    sources: [
      { name: "Nova Industries, DCOFA technical data", url: "https://novaind.in/dehydrated-castor-oil-fatty-acid-dcofa-technical-data/" },
      { name: "Girnar Industries, DCOFA", url: "https://girnarindustries.com/castor-derivatives/dehydrated-castor-oil-fatty-acid/" },
    ],
  },
  "diethyl-sulphate": {
    routes: [
      "Absorb ethylene into concentrated sulfuric acid (ethyl hydrogen sulfate route)",
      "Dehydrate the mixture over sodium sulfate under vacuum",
      "Distil to >99% diethyl sulfate",
    ],
    mainProcess: {
      name: "Ethylene + sulfuric acid",
      detail:
        "Diethyl sulphate is made by absorbing ethylene into concentrated (~96%) sulfuric acid at about 60-75 °C, giving a mixture of ethyl hydrogen sulfate and diethyl sulfate; heating this with anhydrous sodium sulfate under vacuum shifts it toward the neutral diester, and distillation gives >99% diethyl sulfate. It is a powerful ethylating agent used to make dyes, pigments, textile auxiliaries and pharmaceutical/agro intermediates (handled carefully as a probable carcinogen).",
    },
    manufacturers: [
      { name: "BASF", url: "https://www.basf.com" },
      { name: "Atul Ltd", url: "https://www.atul.co.in" },
      { name: "Jiangsu/Chinese ethylating-agent producers", url: "https://www.chemicalbook.com" },
      { name: "Mubychem", url: "https://mubychem.com" },
    ],
    sources: [
      { name: "Wikipedia, Ethyl sulfate / diethyl sulfate", url: "https://en.wikipedia.org/wiki/Ethyl_sulfate" },
      { name: "NCBI, Diethyl sulfate production", url: "https://www.ncbi.nlm.nih.gov/books/NBK424638/" },
    ],
  },
  "arsenic-metal": {
    routes: [
      "Recover arsenic trioxide from copper/lead/gold smelter flue dust",
      "Reduce arsenic trioxide with carbon (charcoal) to elemental arsenic",
      "Sublime/condense to refine the metal",
    ],
    mainProcess: {
      name: "Carbothermic reduction of arsenic trioxide",
      detail:
        "Arsenic metal is produced as a by-product of non-ferrous smelting. Arsenic trioxide volatilises during copper/lead/gold smelting and is collected in flue dust, then refined (roasting with pyrite/galena) to ~90-95% As2O3. The trioxide is reduced with carbon (charcoal) in a sealed steel retort heated in an induction furnace, where gaseous As2O3 reacts with the carbon to give elemental arsenic vapour that is condensed (sublimed) to metallic arsenic. China dominates output. It is used in lead alloys, semiconductors (GaAs feedstock) and some specialty alloys.",
    },
    manufacturers: [
      { name: "China non-ferrous smelters (Yunnan/Hunan)", url: "https://www.chemicalbook.com" },
      { name: "Materion", url: "https://www.materion.com" },
      { name: "Nyrstar", url: "https://www.nyrstar.com" },
      { name: "5N Plus", url: "https://www.5nplus.com" },
    ],
    sources: [
      { name: "Wikipedia, Arsenic", url: "https://en.wikipedia.org/wiki/Arsenic" },
      { name: "USGS, Arsenic mineral commodity summary", url: "https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-arsenic.pdf" },
    ],
  },
  "liters-liquid-helium-at-the-rateof": {
    routes: [
      "Cryogenic recovery of crude helium from helium-rich natural gas",
      "PSA purification to >99.999% helium",
      "Liquefaction (Joule-Thomson/turbo-expander) to ~-269 °C",
    ],
    mainProcess: {
      name: "Cryogenic extraction from natural gas, then liquefaction",
      detail:
        "Helium is extracted from helium-rich natural-gas fields. After the gas is processed, the non-condensable fraction is cryogenically separated to a crude helium stream, which is purified, typically by pressure-swing adsorption, to better than 99.999% helium. The pure gas is then liquefied in a helium liquefier (cascade refrigeration plus Joule-Thomson/turbo-expansion) to about -269 °C (4 K) and stored/shipped in vacuum-insulated dewars and ISO containers. Liquid helium is essential for MRI magnets, semiconductors and cryogenic research.",
    },
    manufacturers: [
      { name: "Linde", url: "https://www.linde.com" },
      { name: "Air Products", url: "https://www.airproducts.com" },
      { name: "Air Liquide", url: "https://www.airliquide.com" },
      { name: "ExxonMobil", url: "https://www.exxonmobil.com" },
      { name: "Qatargas / Messer", url: "https://www.messergroup.com" },
    ],
    sources: [
      { name: "Linde Engineering, Helium recovery & liquefaction", url: "https://www.linde-engineering.com/products-and-services/process-plants/natural-gas-processing/helium-recovery-and-liquefaction-plants" },
      { name: "Air Products, Helium", url: "https://www.airproducts.com/gases/helium" },
    ],
  },
  "fosetyl-al-tc": {
    routes: [
      "React phosphorus trichloride with ethanol to monoethyl phosphite",
      "Neutralise/react with aluminium hydroxide or sulfate",
      "Form aluminium tris(O-ethyl phosphonate)",
    ],
    mainProcess: {
      name: "Ethyl phosphite then aluminium salt formation",
      detail:
        "Fosetyl-aluminium (aluminium tris(O-ethyl phosphonate)) is a systemic fungicide. Monoethyl phosphite (ethyl phosphonic acid mono-ester) is first prepared, usually from phosphorus trichloride and ethanol via diethyl phosphite, then partial hydrolysis, and is reacted with aluminium hydroxide or aluminium sulfate in aqueous solution to form the aluminium salt: 3 (EtO)P(O)H(OH) + Al(OH)3 → Al[(EtO)P(O)HO]3 + 3 H2O. The technical is filtered, dried and formulated (e.g. 80% WG/WP). Its active metabolite is phosphonic acid; it controls oomycete (downy mildew/Phytophthora) diseases.",
    },
    manufacturers: [
      { name: "Bayer CropScience", url: "https://www.bayer.com" },
      { name: "UPL", url: "https://www.upl-ltd.com" },
      { name: "Lier Chemical", url: "https://www.lierchemical.com" },
      { name: "Rayfull Chemicals", url: "https://www.rayfull.net" },
    ],
    sources: [
      { name: "AERU, Fosetyl-aluminium", url: "https://sitem.herts.ac.uk/aeru/ppdb/en/Reports/363.htm" },
      { name: "FAO, Fosetyl-aluminium specification", url: "https://openknowledge.fao.org/server/api/core/bitstreams/86edff2a-3045-40a2-aaf4-e7988dcd2b34/content" },
    ],
  },
  "mono-methyl-aniline": {
    routes: [
      "Catalytic N-methylation of aniline with methanol",
      "Vapour-phase reaction over an acid/oxide catalyst",
      "Distillation to N-methylaniline (mono)",
    ],
    mainProcess: {
      name: "N-methylation of aniline with methanol",
      detail:
        "Mono methyl aniline (N-methylaniline, NMA) is made by N-alkylating aniline with methanol over an acidic/oxide catalyst, typically in the vapour phase: C6H5NH2 + CH3OH → C6H5NHCH3 + H2O. Conditions and the methanol-to-aniline ratio are controlled to favour the mono-methyl product over N,N-dimethylaniline, which is separated by distillation. NMA is used chiefly as a non-metallic octane booster (antiknock) in gasoline and as a dye/agro intermediate.",
    },
    manufacturers: [
      { name: "LANXESS", url: "https://lanxess.com" },
      { name: "Volzhsky Orgsintez", url: "https://www.chemicalbook.com" },
      { name: "Minal Specialities", url: "https://www.minalspecialities.com" },
      { name: "Aarti Industries", url: "https://www.aarti-industries.com" },
    ],
    sources: [
      { name: "IntelMarketResearch, Mono methyl aniline", url: "https://www.intelmarketresearch.com/mono-methyl-aniline-market-10902" },
      { name: "Minal Specialities, N-Methylaniline", url: "https://www.minalspecialities.com/n-methylaniline/" },
    ],
  },
};

export function verifiedFor(productSlug: string): VerifiedProduct | undefined {
  return verified[productSlug];
}
