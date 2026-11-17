// Generates the hello, pensive, overwhelmed, RAG, pilot and cook poses, the six mascot levels (cumulative equipment),
// their problem variants, the onboarding poses, the trait poses, the scenes with the other colleagues,
// an overview sheet and the inventory icons.
// Usage: node assets/mascot/build.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));

// Swap this for the company colour used in the deck.
const COMPANY_COLOR = "#3643BA";
const COMPANY_COLOR_DARK = "#232C7A";

const C = {
  ink: "#1F2544",
  skin: "#F6C9A8",
  blush: "#F2A08E",
  hair: "#3A2622",
  shirt: "#DDE2EA",
  pants: "#56657F",
  shoe: "#FFFFFF",
  floppy: "#1F9D6E",
  remoteButton: "#FF4B3E",
  metal: "#B7C0CE",
  paper: "#FFFFFF",
  paperLine: "#9AA3B5",
  check: "#1F9D6E",
  book: "#6B4FD8",
  bookDark: "#4E36B0",
  gold: "#FFCB00",
  pink: "#FF9DB0",
  cyan: "#5CC8F0",
  mouth: "#7A2E2E",
  tongue: "#F07A86",
};

const LEVELS = [
  {
    file: "01-llm.svg",
    label: "1 · LLM seul",
    desc: "Une tête seule qui parle, une bulle à côté : le LLM est entraîné à répondre intelligemment, mais il ne sait faire que ça, sans corps pour agir ni mémoire.",
  },
  {
    file: "02-harness.svg",
    label: "2 · Harnais (agent)",
    desc: "Le harnais lui donne un corps : il tient sa télécommande et appuie lui-même sur le bouton, il agit sur son environnement.",
  },
  {
    file: "03-storage.svg",
    label: "3 · Stockage (Git)",
    desc: "Sa télécommande en main, il enfonce une disquette Git dans son crâne : sa mémoire durable est un support externe qu'il recharge à chaque session.",
  },
  {
    file: "04-skills.svg",
    label: "4 · Skills",
    desc: "Penché de trois quarts sur une fiche à cases cochées qu'il tient à deux mains : pour cette tâche précise, il applique la procédure qu'on lui a écrite.",
  },
  {
    file: "05-framework.svg",
    label: "5 · Framework de skills",
    desc: "Même posture, mais un gros manuel ouvert, avec ses onglets et son organigramme de rôles, remplace la fiche glissée dedans comme marque-page, et son air est assuré : il dispose d'une méthode complète.",
  },
  {
    file: "06-sdlc.svg",
    label: "6 · SDLC d'entreprise",
    desc: "Habillé tout en bleu avec la casquette et le logo maison, face à nous, le manuel sous le bras et le pouce levé : il est intégré à l'équipe et travaille avec nos règles, notre vocabulaire et nos pratiques.",
  },
];

// Not levels: before we equip him, he says hello, then wonders where to start. No prop at all.
const HELLO = {
  file: "00-hello.svg",
  label: "Bonjour",
  desc: "Le collègue en pied, sans aucun équipement, qui nous fait coucou de la main en souriant.",
};
const HELLO_LEVEL = 0;

const PENSIVE = {
  file: "00-pensive.svg",
  label: "Pensif",
  desc: "Le collègue en pied, sans aucun équipement, la main sous le menton et le regard en l'air : il arrive les mains vides et se demande par où commencer.",
};
const PENSIVE_LEVEL = -1;

// Still the harness level: he aims his remote at the tools he drives, like you do.
const PILOT = {
  file: "02-harness-pilot.svg",
  label: "Harnais, aux commandes",
  desc: "Le collègue tend le bras et pointe sa télécommande vers la droite, des ondes en sortent : il pilote tes outils.",
};
const PILOT_LEVEL = 2.5;

// Between skills and framework: he has the floppy but not the cap yet, and too many recipes.
const OVERWHELMED = {
  file: "04-skills-overwhelmed.svg",
  label: "Débordé",
  desc: "Le collègue, la disquette dans le crâne, se tient la tête à deux mains au milieu de fiches de recettes qui volent autour de lui : il ne sait plus où donner de la tête.",
};
const OVERWHELMED_LEVEL = 4.5;

// Between LLM and harness: still a head only, but he reads your documents before answering.
const RAG = {
  file: "01-rag.svg",
  label: "RAG",
  desc: "Toujours une tête seule qui parle, mais une pile de documents à côté d'elle : il les lit avant de répondre.",
};
const RAG_LEVEL = 1.5;

// Skills level, front-facing: guided by your recipe card, he flips crêpes the way you make them.
const COOK = {
  file: "04-skills-cook.svg",
  label: "Skills, en cuisine",
  desc: "Le collègue, la disquette dans le crâne, tient la fiche de recette d'une main et fait sauter une crêpe avec sa poêle de l'autre, ravi : guidé par ta recette, il cuisine comme toi.",
};
const COOK_LEVEL = 4.2;
const isHeadOnly = (level) => level === 1 || level === RAG_LEVEL;

// Onboarding (part 2): fully equipped, cap on. He reads the documents you give him.
const ONBOARD = {
  file: "07-onboard.svg",
  label: "Onboarding",
  desc: "Le collègue en tenue de l'entreprise, le manuel sous le bras, tient la pile de documents que tu lui donnes et la regarde avec attention.",
};
const ONBOARD_LEVEL = 6.2;
// Same outfit, arms down: the body of the onboarding problem poses.
const ONBOARD_TROUBLED_LEVEL = 6.1;
// Cap on, hands on his head, sheets flying around him: the session has grown too long.
const ONBOARD_OVERWHELMED_LEVEL = 6.3;

// The poses below are fully equipped too: they share level 6, the decimals only tell them apart.
// Part 2: he holds out his plan for you to review.
const PROPOSE = {
  file: "08-propose.svg",
  label: "Sa proposition",
  desc: "Le collègue en tenue de l'entreprise tend une feuille vers toi, l'air confiant : il te soumet son plan avant de s'y mettre.",
};
const PROPOSE_LEVEL = 6.4;
// Part 3: he hands a sheet to each of two other colleagues, the sub-agents, who read theirs.
const DELEGATE_LEVEL = 6.5;
const READ_SHEET_LEVEL = 6.6;
// Part 2: he carries out the plan, pencil in hand.
const WRITE = {
  file: "08-write.svg",
  label: "Il écrit",
  desc: "Le collègue en tenue de l'entreprise écrit sur une feuille, crayon en main, le bout de la langue sorti, concentré.",
};
const WRITE_LEVEL = 6.65;
// Each session starts with him saying hello, fresh; at the closing, every colleague waves.
const WAVE_LEVEL = 6.7;
const SESSION = {
  file: "08-session.svg",
  label: "Session neuve",
  desc: "Le collègue en tenue de l'entreprise nous fait coucou de la main : une session neuve commence, il arrive frais.",
};

// Part 3, his traits.
const CHATTY = {
  file: "09-chatty.svg",
  label: "Bavard",
  desc: "Le collègue en tenue de l'entreprise parle, l'index levé, à côté d'une immense bulle remplie de lignes qui n'en finit pas.",
};
const CHATTY_LEVEL = 6.81;
const OVERDO = {
  file: "09-overdo.svg",
  label: "Il en fait trop",
  desc: "Le collègue en tenue de l'entreprise, ravi, porte une pile vacillante de documents et de classeurs qui monte plus haut que sa tête.",
};
const OVERDO_LEVEL = 6.82;
const OWN_WORDS = {
  file: "09-own-words.svg",
  label: "Ses mots à lui",
  desc: "Le collègue en tenue de l'entreprise, une main sur la hanche et l'index levé, l'air sûr de lui, prononce un mot gribouillé qu'il vient d'inventer.",
};
const OWN_WORDS_LEVEL = 6.83;
const PLEASER = {
  file: "09-pleaser.svg",
  label: "Il veut te faire plaisir",
  desc: "Le collègue en tenue de l'entreprise lève les deux pouces avec un grand sourire, des petits cœurs autour de lui : il te donne raison.",
};
const PLEASER_LEVEL = 6.84;

// His look. The other colleagues are equipped like him, cap included, but each has their own.
const MAIN_LOOK = { skin: C.skin, hair: C.hair, hairStyle: "short", shoe: C.shoe, hasGlasses: true, hasLashes: false };
const COLLEAGUE_LOOKS = {
  ponytail: { skin: "#E9B48C", hair: "#B8502A", hairStyle: "ponytail", shoe: C.remoteButton, hasGlasses: false, hasLashes: true },
  curls: { skin: "#9A6446", hair: "#24160F", hairStyle: "curls", shoe: C.gold, hasGlasses: false, hasLashes: false },
  long: { skin: "#F4D6BC", hair: "#E2B24E", hairStyle: "long", shoe: C.cyan, hasGlasses: false, hasLashes: true },
};

const SUBAGENTS = {
  file: "08-subagents.svg",
  label: "Les sous-agents",
  desc: "Au centre, le collègue tend une feuille de chaque côté à deux autres collègues, équipés comme lui : une fille à queue de cheval et baskets rouges, un garçon aux cheveux bouclés et baskets jaunes. Chacun lit la sienne.",
  width: 1000,
  figures: [
    { level: READ_SHEET_LEVEL, look: COLLEAGUE_LOOKS.ponytail, x: 0, y: 60, scale: 0.88 },
    { level: DELEGATE_LEVEL, look: MAIN_LOOK, x: 300, y: 0, scale: 1 },
    { level: READ_SHEET_LEVEL, look: COLLEAGUE_LOOKS.curls, x: 648, y: 60, scale: 0.88 },
  ],
};
const TEAM_HELLO = {
  file: "10-team-hello.svg",
  label: "L'équipe dit bonjour",
  desc: "Quatre collègues équipés, côte à côte, nous font coucou de la main : une fille blonde aux cheveux longs, une fille à queue de cheval, le collègue à lunettes et un garçon aux cheveux bouclés, chacun avec ses baskets.",
  width: 1300,
  figures: [
    { level: WAVE_LEVEL, look: COLLEAGUE_LOOKS.long, x: 0, y: 0, scale: 1 },
    { level: WAVE_LEVEL, look: COLLEAGUE_LOOKS.ponytail, x: 300, y: 0, scale: 1 },
    { level: WAVE_LEVEL, look: MAIN_LOOK, x: 600, y: 0, scale: 1 },
    { level: WAVE_LEVEL, look: COLLEAGUE_LOOKS.curls, x: 900, y: 0, scale: 1 },
  ],
};

// Same equipment, troubled face: the slides swap to these when they reveal the level's limit.
const PROBLEM_POSES = [
  {
    level: 1,
    file: "01-llm-problem.svg",
    label: "LLM seul, coincé",
    desc: "La tête seule, l'air gêné et une goutte de sueur : il parle, mais il ne peut rien faire.",
    face: { brows: "worried", eye: { pupil: 6.5, look: [0, 3] }, mouth: "awkward" },
    extras: () => sweatDrop(68, 92),
  },
  {
    level: RAG_LEVEL,
    file: "01-rag-problem.svg",
    label: "RAG, coincé",
    desc: "La tête seule à côté de ses documents, l'air gêné et une goutte de sueur : il lit, mais n'agit toujours pas.",
    face: { brows: "worried", eye: { pupil: 6.5, look: [0, 3] }, mouth: "awkward" },
    extras: () => sweatDrop(68, 92),
  },
  {
    level: 2,
    file: "02-harness-problem.svg",
    label: "Harnais, amnésique",
    desc: "Il regarde en l'air, bouche bée, une bulle de pensée vide au-dessus de la tête : il a tout oublié depuis la dernière session.",
    face: { brows: "raised", eye: { pupil: 5, look: [-5, -6] }, mouth: "oh" },
    extras: () => emptyThought(),
  },
  {
    level: 3,
    file: "03-storage-problem.svg",
    label: "Stockage, générique",
    desc: "La disquette enfoncée, il a l'air embarrassé, une goutte de sueur sur la tempe : sur une demande précise, il reste générique.",
    face: { brows: "worried", eye: { pupil: 7, look: [5, 1] }, mouth: "pensive", tilt: -12 },
    extras: () => sweatDrop(78, 84),
  },
  {
    level: 5,
    file: "05-framework-problem.svg",
    label: "Framework, perdu",
    desc: "Il lève les yeux de son manuel, perplexe, un point d'interrogation au-dessus de la tête : il ne connaît rien de notre entreprise.",
    face: { brows: "skeptical", eye: { pupil: 6, look: [-4, -5] }, mouth: "oh" },
    extras: () => questionMark(118, 44),
  },
  {
    level: ONBOARD_TROUBLED_LEVEL,
    file: "07-onboard-forgot.svg",
    label: "Onboarding, session perdue",
    desc: "En tenue de l'entreprise, il regarde en l'air, bouche bée, une bulle de pensée vide au-dessus de la tête : la session est fermée, rien n'a été écrit.",
    face: { brows: "raised", eye: { pupil: 5, look: [-5, -6] }, mouth: "oh" },
    extras: () => emptyThought(),
  },
  {
    level: ONBOARD_TROUBLED_LEVEL,
    file: "07-onboard-messy.svg",
    label: "Onboarding, rangé à sa façon",
    desc: "En tenue de l'entreprise, il a l'air embarrassé, une goutte de sueur sur la tempe : il a tout rangé à sa façon.",
    face: { brows: "worried", eye: { pupil: 7, look: [5, 1] }, mouth: "pensive", tilt: -12 },
    extras: () => sweatDrop(88, 112),
  },
  {
    level: ONBOARD_OVERWHELMED_LEVEL,
    file: "07-onboard-overwhelmed.svg",
    label: "Onboarding, session trop longue",
    desc: "En tenue de l'entreprise, il se tient la tête à deux mains au milieu de feuilles qui volent : la session s'est trop allongée, il s'emmêle.",
    face: { brows: "worried", eye: { pupil: 5.5, look: [0, 1] }, mouth: "wavy" },
    extras: () => "",
  },
  {
    level: ONBOARD_TROUBLED_LEVEL,
    file: "07-onboard-mixed.svg",
    label: "Onboarding, sources mélangées",
    desc: "En tenue de l'entreprise, il lève les yeux, perplexe, un point d'interrogation au-dessus de la tête : l'ancien et le nouveau se contredisent.",
    face: { brows: "skeptical", eye: { pupil: 6, look: [-4, -5] }, mouth: "oh" },
    extras: () => questionMark(118, 44),
  },
];

// Levels 4 and 5 show him in three-quarter view, reading; the others face the audience.
const isReading = (level) => level === 4 || level === 5;

const outfit = (level) =>
  level >= 6 ? { shirt: COMPANY_COLOR, pants: COMPANY_COLOR_DARK } : { shirt: C.shirt, pants: C.pants };

// --- Small shapes -----------------------------------------------------------

const SLEEVE_LENGTH = 34;

// The sleeve follows the arm's first direction, so it turns with the shoulder.
const armWithSleeve = ({ shoulder: [sx, sy], control: [cx, cy], end: [ex, ey] }, shirt) => {
  const arm = `M${sx} ${sy}Q${cx} ${cy} ${ex} ${ey}`;
  const length = Math.hypot(cx - sx, cy - sy);
  const cuffX = (sx + ((cx - sx) / length) * SLEEVE_LENGTH).toFixed(1);
  const cuffY = (sy + ((cy - sy) / length) * SLEEVE_LENGTH).toFixed(1);
  const sleeve = `M${sx} ${sy}L${cuffX} ${cuffY}`;
  return (
    `<path d="${arm}" fill="none" stroke="${C.ink}" stroke-width="27"/>` +
    `<path d="${arm}" fill="none" stroke="${C.skin}" stroke-width="17"/>` +
    `<path d="${sleeve}" fill="none" stroke="${C.ink}" stroke-width="38"/>` +
    `<path d="${sleeve}" fill="none" stroke="${shirt}" stroke-width="29"/>`
  );
};

const hand = ([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${C.skin}"/>`;

const thumbsUp = ([x, y]) =>
  `<rect x="${x - 7}" y="${y - 30}" width="14" height="26" rx="7" fill="${C.skin}"/>` +
  `<rect x="${x - 16}" y="${y - 10}" width="32" height="28" rx="11" fill="${C.skin}"/>` +
  `<path d="M${x - 9} ${y}H${x + 9}M${x - 9} ${y + 8}H${x + 9}" fill="none" stroke-width="3"/>`;

// Open palm with spread fingers; the palm is drawn last to hide the finger joints.
const wavingHand = ([x, y]) =>
  [-36, -12, 12, 36]
    .map((angle) => `<rect x="${x - 5}" y="${y - 38}" width="10" height="30" rx="5" fill="${C.skin}" transform="rotate(${angle} ${x} ${y})"/>`)
    .join("") +
  `<rect x="${x - 5}" y="${y - 27}" width="10" height="20" rx="5" fill="${C.skin}" transform="rotate(-108 ${x} ${y})"/>` +
  `<circle cx="${x}" cy="${y}" r="17" fill="${C.skin}"/>` +
  `<path d="M${x + 30} ${y - 30}Q${x + 38} ${y - 12} ${x + 30} ${y + 6}M${x + 42} ${y - 38}Q${x + 52} ${y - 12} ${x + 42} ${y + 14}" fill="none" stroke-width="4"/>`;

const flyingRecipes = () =>
  [
    [-150, 244, -24],
    [152, 250, 18],
    [-150, 384, 12],
    [150, 392, -16],
    [134, 92, 26],
  ]
    .map(([x, y, angle]) => sheet(x, y, angle, 0.75))
    .join("");

const sweatDrop = (x, y) =>
  `<path d="M${x} ${y - 16}C${x + 6} ${y - 6} ${x + 10} ${y} ${x + 10} ${y + 6}A10 10 0 0 1 ${x - 10} ${y + 6}C${x - 10} ${y} ${x - 6} ${y - 6} ${x} ${y - 16}Z" fill="${C.cyan}" stroke-width="4"/>`;

const emptyThought = () =>
  `<circle cx="-92" cy="80" r="6" fill="${C.paper}" stroke-width="4"/>` +
  `<circle cx="-110" cy="58" r="9" fill="${C.paper}" stroke-width="4"/>` +
  `<ellipse cx="-146" cy="30" rx="34" ry="24" fill="${C.paper}" stroke-width="4"/>`;

const questionMark = (x, y) =>
  `<path d="M${x - 12} ${y - 14}Q${x - 12} ${y - 30} ${x + 2} ${y - 30}Q${x + 16} ${y - 30} ${x + 16} ${y - 16}Q${x + 16} ${y - 6} ${x + 4} ${y}Q${x} ${y + 3} ${x} ${y + 12}" fill="none" stroke-width="7"/>` +
  `<circle cx="${x}" cy="${y + 26}" r="4" fill="${C.ink}" stroke="none"/>`;

// Beside the RAG head by default; the dotted line is his gaze reading it.
const documentStack = (x = -142, y = 152, withGaze = true) => `
  <g transform="translate(${x} ${y}) rotate(-8)">
    <rect x="-24" y="-34" width="52" height="66" rx="4" fill="${C.paper}" stroke-width="4"/>
    <rect x="-30" y="-38" width="52" height="66" rx="4" fill="${C.paper}" stroke-width="4"/>
    <rect x="-36" y="-42" width="52" height="66" rx="4" fill="${C.paper}" stroke-width="4"/>
    <path d="M-28 -28H8M-28 -18H8M-28 -8H0M-28 2H8M-28 12H-4" fill="none" stroke="${C.paperLine}" stroke-width="3.5"/>
  </g>
  ${withGaze ? `<path d="M-112 100Q-104 74 -88 82" fill="none" stroke-width="4" stroke-dasharray="1 9"/>` : ""}`;

const thoughtDots = () =>
  [
    [-92, 80, 6],
    [-112, 56, 9],
    [-138, 24, 13],
  ]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.paper}" stroke-width="4"/>`)
    .join("");

const sparkle = (x, y, s) =>
  `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="${C.gold}" stroke-width="3"/>`;

const heart = (x, y, s) =>
  `<path d="M${x} ${y + s}C${x - s * 1.6} ${y} ${x - s} ${y - s} ${x} ${y - s * 0.4}C${x + s} ${y - s} ${x + s * 1.6} ${y} ${x} ${y + s}Z" fill="${C.pink}" stroke-width="3.5"/>`;

// A tall bubble beside his head, full of lines, that trails off: he keeps talking.
const longSpeech = () => {
  const lineLengths = [74, 66, 78, 58, 74, 70, 50, 76, 64, 72];
  const lines = lineLengths.map((length, i) => `M-194 ${30 + i * 19}H${-194 + length}`).join("");
  return `
  <path d="M-196 8H-112Q-100 8 -100 20V182L-84 198L-100 200V222Q-100 234 -112 234H-196Q-208 234 -208 222V20Q-208 8 -196 8Z" fill="${C.paper}"/>
  <path d="${lines}" fill="none" stroke="${C.paperLine}" stroke-width="5"/>
  ${[-170, -154, -138].map((x) => `<circle cx="${x}" cy="254" r="4" fill="${C.ink}" stroke="none"/>`).join("")}`;
};

// A short bubble holding a scribble, a word he made up, below the floppy and level with his mouth.
const madeUpWord = () => `
  <path d="M-196 160H-114Q-104 160 -104 170V180L-86 192L-104 196V208Q-104 218 -114 218H-196Q-206 218 -206 208V170Q-206 160 -196 160Z" fill="${C.paper}"/>
  <path d="M-192 190C-186 174 -180 204 -172 186C-166 172 -162 202 -154 188C-148 176 -144 200 -136 186C-130 176 -126 196 -120 188" fill="none" stroke-width="4.5"/>
  <path d="M-190 206H-122" fill="none" stroke="${C.remoteButton}" stroke-width="3.5" stroke-dasharray="2 7"/>`;

// --- Props held in the hands -------------------------------------------------

// The handle starts in his hand at (x, y); the crêpe flies above the pan.
const panWithFlyingCrepe = (x, y) => `
  <path d="M${x} ${y}L${x + 24} ${y - 8}" fill="none" stroke-width="10"/>
  <path d="M${x + 20} ${y - 14}Q${x + 48} ${y + 10} ${x + 76} ${y - 14}Z" fill="${C.ink}"/>
  <ellipse cx="${x + 48}" cy="${y - 14}" rx="28" ry="7" fill="${C.pants}" stroke-width="4"/>
  <path d="M${x + 30} ${y - 26}Q${x + 22} ${y - 58} ${x + 36} ${y - 82}M${x + 64} ${y - 26}Q${x + 72} ${y - 58} ${x + 60} ${y - 82}" fill="none" stroke-width="4" stroke-dasharray="1 9"/>
  <g transform="translate(${x + 48} ${y - 104}) rotate(-14)">
    <ellipse rx="30" ry="9" fill="${C.gold}" stroke-width="4"/>
    <circle cx="-12" cy="-1" r="2.5" fill="${C.hair}" stroke="none" opacity=".45"/>
    <circle cx="6" cy="2" r="3" fill="${C.hair}" stroke="none" opacity=".45"/>
    <circle cx="16" cy="-2" r="2" fill="${C.hair}" stroke="none" opacity=".45"/>
  </g>`;

const sheet = (x = 60, y = 300, angle = -12, scale = 1) => `
  <g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">
    <rect x="-38" y="-48" width="76" height="96" rx="4" fill="${C.paper}" stroke-width="4.5"/>
    <rect x="-28" y="-38" width="36" height="8" rx="2" fill="${C.gold}" stroke="none"/>
    ${[-18, -2, 14, 30]
      .map(
        (y, i) =>
          `<rect x="-28" y="${y - 5}" width="10" height="10" rx="2" fill="${C.paper}" stroke-width="3"/>` +
          `<path d="M-12 ${y}H26" fill="none" stroke="${C.paperLine}" stroke-width="3.5"/>` +
          (i < 2 ? `<path d="M-26 ${y}L-23 ${y + 3}L-17 ${y - 4}" fill="none" stroke="${C.check}" stroke-width="3.5"/>` : ""),
      )
      .join("")}
  </g>`;

// Binders and sheets piled from (x, bottomY) upward, swaying further off-centre the higher they go.
const TOWER_ITEMS = [
  { height: 26, fill: C.book },
  { height: 13, fill: C.paper },
  { height: 13, fill: C.paper },
  { height: 24, fill: C.gold },
  { height: 13, fill: C.paper },
  { height: 22, fill: C.pink },
  { height: 13, fill: C.paper },
  { height: 13, fill: C.paper },
  { height: 24, fill: C.cyan },
  { height: 13, fill: C.paper },
  { height: 22, fill: C.book },
  { height: 13, fill: C.paper },
];
const documentTower = (x, bottomY) => {
  let top = bottomY;
  const items = TOWER_ITEMS.map(({ height, fill }, i) => {
    top -= height;
    const sway = (i % 2 === 0 ? 1 : -1) * Math.min(i, 6);
    return `<rect x="${x - 36 + sway}" y="${top}" width="72" height="${height}" rx="3" fill="${fill}" stroke-width="4"/>`;
  }).join("");
  const wobbleLines = `<path d="M${x + 50} ${top + 6}Q${x + 58} ${top + 20} ${x + 50} ${top + 34}M${x - 48} ${top + 2}Q${x - 56} ${top + 16} ${x - 48} ${top + 30}" fill="none" stroke-width="4"/>`;
  return `<g transform="rotate(3 ${x} ${bottomY})">${items}${wobbleLines}</g>`;
};

// A pencil whose tip rests at (x, y), slanting up to the right. Wood is paper-coloured: C.skin is reserved for skin.
const pencil = (x, y) => `
  <g transform="translate(${x} ${y}) rotate(-50)">
    <path d="M12 -6L0 0L12 6Z" fill="${C.paper}" stroke-width="4"/>
    <path d="M4 -2L0 0L4 2Z" fill="${C.ink}" stroke="none"/>
    <rect x="12" y="-6" width="44" height="12" rx="2" fill="${C.gold}" stroke-width="4"/>
    <rect x="56" y="-6" width="10" height="12" rx="3" fill="${C.pink}" stroke-width="4"/>
  </g>`;

const openBook = () => `
  <g transform="translate(60 298) rotate(-10)">
    <rect x="22" y="-56" width="12" height="16" rx="2" fill="${C.gold}" stroke-width="3.5"/>
    <rect x="38" y="-54" width="12" height="14" rx="2" fill="${C.pink}" stroke-width="3.5"/>
    <rect x="-40" y="-64" width="18" height="26" fill="${C.paper}" stroke-width="3.5"/>
    <path d="M-36 -55L-32 -50L-26 -59" fill="none" stroke="${C.check}" stroke-width="3.5"/>
    <rect x="-72" y="-44" width="144" height="90" rx="6" fill="${C.book}"/>
    <path d="M-64 -38Q-32 -46 0 -34L0 40Q-32 30 -64 38Z" fill="${C.paper}"/>
    <path d="M64 -38Q32 -46 0 -34L0 40Q32 30 64 38Z" fill="${C.paper}"/>
    <path d="M-54 -22H-12M-54 -10H-12M-54 2H-20M-54 14H-12M-54 26H-28" fill="none" stroke="${C.paperLine}" stroke-width="3.5"/>
    <path d="M32 -16V-9M16 -9H48M16 -9V-2M32 -9V-2M48 -9V-2" fill="none" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="32" cy="-21" r="6" fill="${C.gold}" stroke-width="3"/>
    <circle cx="16" cy="4" r="5" fill="${C.cyan}" stroke-width="3"/>
    <circle cx="32" cy="4" r="5" fill="${C.pink}" stroke-width="3"/>
    <circle cx="48" cy="4" r="5" fill="${C.gold}" stroke-width="3"/>
    <path d="M14 22H50" fill="none" stroke="${C.paperLine}" stroke-width="3.5"/>
  </g>`;

const closedBook = () => `
  <g transform="translate(84 314) rotate(-8)">
    <rect x="-2" y="-70" width="20" height="30" fill="${C.paper}" stroke-width="3.5"/>
    <path d="M3 -61L7 -56L14 -65" fill="none" stroke="${C.check}" stroke-width="3.5"/>
    <rect x="30" y="-38" width="14" height="12" rx="2" fill="${C.gold}" stroke-width="3.5"/>
    <rect x="30" y="-16" width="14" height="12" rx="2" fill="${C.pink}" stroke-width="3.5"/>
    <rect x="30" y="6" width="14" height="12" rx="2" fill="${C.cyan}" stroke-width="3.5"/>
    <rect x="-30" y="-48" width="66" height="100" rx="5" fill="${C.paper}"/>
    <rect x="-38" y="-52" width="72" height="104" rx="6" fill="${C.book}"/>
    <path d="M-25 -52V52" fill="none" stroke="${C.bookDark}" stroke-width="7"/>
    <path d="M5 -15V-8M-11 -8H21M-11 -8V0M5 -8V0M21 -8V0" fill="none" stroke="${C.gold}" stroke-width="3.5"/>
    <circle cx="5" cy="-22" r="6.5" fill="${C.gold}" stroke-width="3"/>
    <circle cx="-11" cy="6" r="5.5" fill="${C.gold}" stroke-width="3"/>
    <circle cx="5" cy="6" r="5.5" fill="${C.gold}" stroke-width="3"/>
    <circle cx="21" cy="6" r="5.5" fill="${C.gold}" stroke-width="3"/>
    <path d="M-12 28H22M-6 38H16" fill="none" stroke="${C.paper}" stroke-width="4"/>
  </g>`;

// TV remote; (x, y) is the top-left corner of its case. The red button is what he presses.
const REMOTE_WIDTH = 30;
const tvRemote = (x, y) => {
  const cx = x + REMOTE_WIDTH / 2;
  const buttonRows = [30, 44, 58]
    .map(
      (dy) =>
        `<circle cx="${cx - 6}" cy="${y + dy}" r="3.5" fill="${C.metal}" stroke="none"/>` +
        `<circle cx="${cx + 6}" cy="${y + dy}" r="3.5" fill="${C.metal}" stroke="none"/>`,
    )
    .join("");
  return (
    `<rect x="${x}" y="${y}" width="${REMOTE_WIDTH}" height="76" rx="10" fill="${C.ink}"/>` +
    `<circle cx="${cx}" cy="${y + 13}" r="6" fill="${C.remoteButton}" stroke="none"/>` +
    buttonRows
  );
};

const pressLines = () => `<path d="M-20 290L-28 284M24 290L32 284M-22 300H-32M26 300H36" fill="none" stroke-width="4"/>`;

// The palm sits behind the case; thumb and fingers wrap its edges.
const handHoldingRemote = ([x, y]) =>
  hand([x, y]) +
  tvRemote(x - REMOTE_WIDTH / 2, y - 44) +
  `<ellipse cx="${x - 15}" cy="${y - 12}" rx="6" ry="9" fill="${C.skin}"/>` +
  `<ellipse cx="${x + 15}" cy="${y - 18}" rx="6" ry="6" fill="${C.skin}"/>` +
  `<ellipse cx="${x + 15}" cy="${y - 6}" rx="6" ry="6" fill="${C.skin}"/>`;

// The waves pulse one after the other, unless the viewer asked for less motion.
const signalWaves = ([x, y]) =>
  `<style>.wave{animation:wave 1.4s ease-in-out infinite}.wave+.wave{animation-delay:.25s}@keyframes wave{0%,100%{opacity:.25}50%{opacity:1}}@media (prefers-reduced-motion:reduce){.wave{animation:none}}</style>` +
  [52, 64]
    .map((r) => {
      const dx = Math.round(r * Math.sin(Math.PI / 8));
      const dy = Math.round(r * Math.cos(Math.PI / 8));
      return `<path class="wave" d="M${x - dx} ${y - dy}A${r} ${r} 0 0 1 ${x + dx} ${y - dy}" fill="none" stroke-width="5"/>`;
    })
    .join("");

// Same grip as handHoldingRemote, turned so the remote points at the slide's content on his left.
const REMOTE_AIM_ANGLE = 48;
const handAimingRemote = ([x, y]) =>
  `<g transform="rotate(${REMOTE_AIM_ANGLE} ${x} ${y})">${handHoldingRemote([x, y])}${signalWaves([x, y])}</g>`;

const pointingHand = ([x, y]) =>
  `<rect x="${x - 5}" y="${y}" width="10" height="26" rx="5" fill="${C.skin}"/>` +
  `<circle cx="${x}" cy="${y}" r="14" fill="${C.skin}"/>`;

const raisedIndex = ([x, y]) =>
  `<rect x="${x - 5}" y="${y - 34}" width="10" height="30" rx="5" fill="${C.skin}"/>` +
  `<circle cx="${x}" cy="${y}" r="14" fill="${C.skin}"/>`;

// --- Bodies ------------------------------------------------------------------

// Arm poses of the front-facing levels. A hand marked overHead touches the
// head (floppy, chin), so it is drawn after the head.
const LEFT_SHOULDER = [-48, 252];
const RIGHT_SHOULDER = [48, 252];

const FRONT_ARMS = {
  [HELLO_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [128, 250], end: [122, 182], waving: [122, 164] },
  },
  [OVERWHELMED_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-124, 250], end: [-94, 180], hand: [-90, 170], overHead: true },
    right: { shoulder: RIGHT_SHOULDER, control: [124, 250], end: [94, 180], hand: [90, 170], overHead: true },
  },
  [PENSIVE_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-72, 326], end: [18, 300], hand: [26, 300] },
    right: { shoulder: RIGHT_SHOULDER, control: [116, 300], end: [40, 228], hand: [34, 216], overHead: true },
  },
  2: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 330], end: [-6, 342], hand: [2, 342] },
    right: { shoulder: RIGHT_SHOULDER, control: [92, 310], end: [16, 270], pointing: [4, 266] },
  },
  [COOK_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-104, 300], end: [-96, 318], hand: [-96, 322] },
    right: { shoulder: RIGHT_SHOULDER, control: [100, 324], end: [98, 302], hand: [100, 298] },
  },
  [PILOT_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [96, 266], end: [104, 228], aimsRemote: [108, 222] },
  },
  3: {
    left: { shoulder: LEFT_SHOULDER, control: [-116, 250], end: [-110, 182], hand: [-108, 174], overHead: true },
    right: { shoulder: RIGHT_SHOULDER, control: [80, 300], end: [86, 336], holdsRemote: [88, 348] },
  },
  6: {
    left: { shoulder: LEFT_SHOULDER, control: [-108, 296], end: [-100, 244], thumbsUp: [-100, 236] },
    right: { shoulder: RIGHT_SHOULDER, control: [96, 300], end: [102, 350], hand: [104, 360] },
  },
  [ONBOARD_TROUBLED_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [96, 300], end: [102, 350], hand: [104, 360] },
  },
  [ONBOARD_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [96, 300], end: [102, 350], hand: [104, 360] },
  },
  [ONBOARD_OVERWHELMED_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-124, 250], end: [-94, 180], hand: [-90, 170], overHead: true },
    right: { shoulder: RIGHT_SHOULDER, control: [124, 250], end: [94, 180], hand: [90, 170], overHead: true },
  },
  [PROPOSE_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [112, 290], end: [126, 240], hand: [128, 236] },
  },
  [DELEGATE_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-100, 280], end: [-134, 290], hand: [-140, 290] },
    right: { shoulder: RIGHT_SHOULDER, control: [100, 280], end: [134, 290], hand: [140, 290] },
  },
  [READ_SHEET_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-88, 324], end: [-32, 320], hand: [-30, 320] },
    right: { shoulder: RIGHT_SHOULDER, control: [88, 324], end: [32, 320], hand: [30, 320] },
  },
  [WRITE_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-90, 326], end: [-42, 328], hand: [-38, 328] },
    right: { shoulder: RIGHT_SHOULDER, control: [102, 300], end: [40, 296], hand: [36, 294] },
  },
  [WAVE_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [128, 250], end: [122, 182], waving: [122, 164] },
  },
  [CHATTY_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 300], end: [-90, 350], hand: [-92, 360] },
    right: { shoulder: RIGHT_SHOULDER, control: [120, 276], end: [112, 214], raisedIndex: [112, 206] },
  },
  [OVERDO_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-24, 336], end: [74, 300], hand: [80, 298] },
    right: { shoulder: RIGHT_SHOULDER, control: [104, 318], end: [100, 350], hand: [104, 354] },
  },
  [OWN_WORDS_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-108, 292], end: [-58, 334], hand: [-56, 336] },
    right: { shoulder: RIGHT_SHOULDER, control: [120, 276], end: [112, 214], raisedIndex: [112, 206] },
  },
  [PLEASER_LEVEL]: {
    left: { shoulder: LEFT_SHOULDER, control: [-108, 296], end: [-100, 244], thumbsUp: [-100, 236] },
    right: { shoulder: RIGHT_SHOULDER, control: [108, 296], end: [100, 244], thumbsUp: [100, 236] },
  },
};

const drawHand = (arm) => {
  if (arm.overHead) return "";
  if (arm.thumbsUp) return thumbsUp(arm.thumbsUp);
  if (arm.waving) return wavingHand(arm.waving);
  if (arm.pointing) return pointingHand(arm.pointing);
  if (arm.raisedIndex) return raisedIndex(arm.raisedIndex);
  if (arm.holdsRemote) return handHoldingRemote(arm.holdsRemote);
  if (arm.aimsRemote) return handAimingRemote(arm.aimsRemote);
  return hand(arm.hand);
};

const FRONT_PROPS = {
  [HELLO_LEVEL]: () => "",
  [PENSIVE_LEVEL]: () => "",
  [OVERWHELMED_LEVEL]: () => "",
  [PILOT_LEVEL]: () => "",
  [COOK_LEVEL]: () => sheet(-122, 300, -10, 0.7) + panWithFlyingCrepe(100, 298),
  2: () => tvRemote(-13, 284) + pressLines(),
  3: () => "",
  6: closedBook,
  [ONBOARD_TROUBLED_LEVEL]: closedBook,
  [ONBOARD_LEVEL]: closedBook,
  [ONBOARD_OVERWHELMED_LEVEL]: () => "",
  [PROPOSE_LEVEL]: () => sheet(146, 196, 10, 0.85),
  [DELEGATE_LEVEL]: () => sheet(-160, 262, -14, 0.55) + sheet(160, 262, 14, 0.55),
  [READ_SHEET_LEVEL]: () => sheet(0, 302, -4, 0.8),
  [WRITE_LEVEL]: () => sheet(-10, 308, -8, 0.8) + pencil(14, 318),
  [WAVE_LEVEL]: () => "",
  [CHATTY_LEVEL]: () => "",
  [OVERDO_LEVEL]: () => documentTower(118, 346),
  [OWN_WORDS_LEVEL]: () => "",
  [PLEASER_LEVEL]: () => "",
};

const frontBody = (level, look) => {
  const { shirt, pants } = outfit(level);
  const { left: leftArm, right: rightArm } = FRONT_ARMS[level];
  return `
  <ellipse cx="0" cy="466" rx="78" ry="9" fill="${C.ink}" opacity=".12" stroke="none"/>
  <path d="M-50 356L50 356L54 446L12 446L0 392L-12 446L-54 446Z" fill="${pants}"/>
  <path d="M-58 444L-10 444L-8 458Q-8 466 -16 466L-62 466Q-72 466 -68 456Z" fill="${look.shoe}"/>
  <path d="M58 444L10 444L8 458Q8 466 16 466L62 466Q72 466 68 456Z" fill="${look.shoe}"/>
  <rect x="-14" y="204" width="28" height="34" fill="${C.skin}"/>
  <path d="M-52 232C-20 222 20 222 52 232L62 362L-62 362Z" fill="${shirt}"/>
  <path d="M-16 228Q0 246 16 228Z" fill="${C.skin}" stroke-width="4"/>
  ${level >= 6 ? companyLogo(-24, 268, 1.1) : ""}
  ${armWithSleeve(leftArm, shirt)}
  ${armWithSleeve(rightArm, shirt)}
  ${FRONT_PROPS[level]()}
  ${drawHand(leftArm)}
  ${drawHand(rightArm)}`;
};

const READING_ARMS = {
  4: {
    near: { shoulder: [-42, 252], control: [-66, 334], end: [18, 318], hand: [25, 318] },
    far: { shoulder: [40, 248], control: [70, 300], end: [94, 302], hand: [99, 302] },
  },
  5: {
    near: { shoulder: [-42, 252], control: [-70, 330], end: [-14, 314], hand: [-8, 312] },
    far: { shoulder: [40, 248], control: [84, 290], end: [122, 286], hand: [128, 287] },
  },
};

const readingBody = (level, look) => {
  const { shirt, pants } = outfit(level);
  const arms = READING_ARMS[level];
  return `
  <ellipse cx="4" cy="466" rx="78" ry="9" fill="${C.ink}" opacity=".12" stroke="none"/>
  <path d="M-44 356L44 356L46 446L10 446L2 392L-8 446L-46 446Z" fill="${pants}"/>
  <path d="M-50 444L-8 444Q4 446 6 456Q8 466 -4 466L-48 466Q-56 466 -54 456Z" fill="${look.shoe}"/>
  <path d="M12 444L50 444Q62 446 64 456Q66 466 54 466L12 466Q6 466 8 456Z" fill="${look.shoe}"/>
  <rect x="-10" y="204" width="28" height="34" fill="${C.skin}"/>
  ${armWithSleeve(arms.far, shirt)}
  <path d="M-46 232C-20 224 18 224 44 234L52 362L-56 362Z" fill="${shirt}"/>
  <path d="M-10 230Q6 246 22 232Z" fill="${C.skin}" stroke-width="4"/>
  ${level === 4 ? sheet() : openBook()}
  ${armWithSleeve(arms.near, shirt)}
  ${hand(arms.near.hand)}
  ${hand(arms.far.hand)}`;
};

// --- Head --------------------------------------------------------------------

// Expression goes from vacant (level 1) to confident and "boosted" (level 6).
const FACE = {
  [RAG_LEVEL]: { brows: "raised", eye: { pupil: 7, look: [-5, 2] }, mouth: "talk" },
  [OVERWHELMED_LEVEL]: { brows: "worried", eye: { pupil: 5.5, look: [0, 1] }, mouth: "wavy" },
  [PENSIVE_LEVEL]: { brows: "raised", eye: { pupil: 7, look: [-6, -7] }, mouth: "pensive", tilt: -6 },
  [PILOT_LEVEL]: { brows: "confident", eye: { pupil: 7, look: [7, -2] }, mouth: "smirk", tilt: 4 },
  [COOK_LEVEL]: { brows: "happy", eye: { pupil: 7, look: [6, -6] }, mouth: "bigSmile", tilt: 6 },
  [HELLO_LEVEL]: { brows: "happy", eye: { pupil: 7, look: [0, 0] }, mouth: "bigSmile", tilt: 6 },
  1: { brows: "raised", eye: { pupil: 7, look: [3, -1] }, mouth: "talk" },
  2: { brows: "neutral", eye: { pupil: 7, look: [0, 7] }, mouth: "smile" },
  3: { brows: "neutral", eye: { pupil: 7, look: [-6, -4] }, mouth: "bigSmile", tilt: -12 },
  4: { brows: "focused", eye: { pupil: 7, look: [2, 5] }, mouth: "tongue" },
  5: { brows: "confident", eye: { pupil: 6.5, look: [2, 1], halfLid: true }, mouth: "smirk" },
  6: { brows: "happy", eye: { pupil: 7.5, look: [0, 0] }, mouth: "grin" },
  [ONBOARD_LEVEL]: { brows: "raised", eye: { pupil: 7, look: [-6, 5] }, mouth: "smile" },
  [PROPOSE_LEVEL]: { brows: "raised", eye: { pupil: 7, look: [6, -2] }, mouth: "smile", tilt: 4 },
  [DELEGATE_LEVEL]: { brows: "happy", eye: { pupil: 7, look: [0, 0] }, mouth: "bigSmile" },
  [READ_SHEET_LEVEL]: { brows: "focused", eye: { pupil: 7, look: [0, 7] }, mouth: "smile" },
  [WRITE_LEVEL]: { brows: "focused", eye: { pupil: 7, look: [-2, 7] }, mouth: "tongue" },
  [WAVE_LEVEL]: { brows: "happy", eye: { pupil: 7, look: [0, 0] }, mouth: "bigSmile", tilt: 6 },
  [CHATTY_LEVEL]: { brows: "raised", eye: { pupil: 7, look: [-3, 0] }, mouth: "talk", tilt: -4 },
  [OVERDO_LEVEL]: { brows: "happy", eye: { pupil: 7.5, look: [-2, 0] }, mouth: "grin", tilt: -6 },
  [OWN_WORDS_LEVEL]: { brows: "confident", eye: { pupil: 6.5, look: [-2, 1], halfLid: true }, mouth: "smirk", tilt: 6 },
  [PLEASER_LEVEL]: { brows: "happy", eye: { pupil: 7.5, look: [0, 0] }, mouth: "grin", tilt: 8 },
};

const HEAD_VIEW = {
  front: {
    eyes: [
      { x: -30, rx: 15 },
      { x: 30, rx: 15 },
    ],
    ears: [-78, 78],
    nose: "M-3 18Q-10 28 2 30",
    mouthX: 0,
    blush: [-54, 54],
    temples: "M-52 6L-77 2M52 6L77 2",
  },
  threeQuarter: {
    transform: "translate(16 150) rotate(16)",
    eyes: [
      { x: -12, rx: 15 },
      { x: 42, rx: 13 },
    ],
    ears: [-76],
    nose: "M33 16Q44 28 31 30",
    mouthX: 24,
    blush: [-36, 58],
    temples: "M-34 6L-74 2",
  },
};

const EYE_Y = 8;

const browPath = (style, x, isLeftEye) => {
  const y = EYE_Y;
  const w = 14;
  switch (style) {
    case "raised":
      return `M${x - w} ${y - 32}Q${x} ${y - 44} ${x + w} ${y - 34}`;
    case "focused":
      return isLeftEye ? `M${x - w} ${y - 33}L${x + w} ${y - 28}` : `M${x - w} ${y - 28}L${x + w} ${y - 33}`;
    case "confident":
      return isLeftEye ? `M${x - w} ${y - 29}Q${x} ${y - 33} ${x + w} ${y - 29}` : `M${x - w} ${y - 33}Q${x} ${y - 44} ${x + w} ${y - 36}`;
    case "skeptical":
      return isLeftEye ? `M${x - w} ${y - 29}Q${x} ${y - 33} ${x + w} ${y - 30}` : `M${x - w} ${y - 36}Q${x} ${y - 46} ${x + w} ${y - 38}`;
    case "worried":
      return isLeftEye ? `M${x - w} ${y - 30}Q${x} ${y - 32} ${x + w} ${y - 40}` : `M${x - w} ${y - 40}Q${x} ${y - 32} ${x + w} ${y - 30}`;
    case "happy":
      return `M${x - w} ${y - 29}Q${x} ${y - 40} ${x + w} ${y - 29}`;
    default:
      return `M${x - w} ${y - 29}Q${x} ${y - 35} ${x + w} ${y - 30}`;
  }
};

const eye = ({ x, rx }, { pupil, look: [lx, ly], halfLid }) => {
  const y = EYE_Y;
  const ry = 17;
  const w = rx;
  if (halfLid) {
    return (
      `<path d="M${x - w} ${y - 3}Q${x} ${y - 9} ${x + w} ${y - 3}Q${x + w + 1} ${y + ry} ${x} ${y + ry}Q${x - w - 1} ${y + ry} ${x - w} ${y - 3}Z" fill="${C.paper}" stroke-width="4"/>` +
      `<circle cx="${x + lx}" cy="${y + 5 + ly}" r="${pupil}" fill="${C.ink}" stroke="none"/>` +
      `<path d="M${x - w - 1} ${y - 3}Q${x} ${y - 10} ${x + w + 1} ${y - 3}" fill="none" stroke-width="6"/>`
    );
  }
  const highlight = `<circle cx="${x + lx - 2.5}" cy="${y + ly - 2.5}" r="2.4" fill="${C.paper}" stroke="none"/>`;
  return (
    `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${ry}" fill="${C.paper}" stroke-width="4"/>` +
    `<circle cx="${x + lx}" cy="${y + ly}" r="${pupil}" fill="${C.ink}" stroke="none"/>` +
    highlight
  );
};

const mouth = (style, x) => {
  const y = 46;
  switch (style) {
    case "talk":
      return `<path d="M${x - 12} ${y - 4}Q${x} ${y - 7} ${x + 12} ${y - 4}Q${x + 10} ${y + 13} ${x} ${y + 13}Q${x - 10} ${y + 13} ${x - 12} ${y - 4}Z" fill="${C.mouth}" stroke-width="4"/>`;
    case "awkward":
      return `<path d="M${x - 14} ${y + 2}Q${x - 4} ${y + 6} ${x + 4} ${y}Q${x + 10} ${y - 4} ${x + 15} ${y - 2}" fill="none"/>`;
    case "oh":
      return `<ellipse cx="${x}" cy="${y + 4}" rx="6" ry="7" fill="${C.mouth}" stroke-width="4"/>`;
    case "wavy":
      return `<path d="M${x - 16} ${y}Q${x - 8} ${y - 7} ${x} ${y}Q${x + 8} ${y + 7} ${x + 16} ${y}" fill="none"/>`;
    case "pensive":
      return `<path d="M${x - 9} ${y + 2}Q${x + 2} ${y - 1} ${x + 10} ${y + 3}" fill="none"/>`;
    case "smile":
      return `<path d="M${x - 14} ${y - 2}Q${x} ${y + 8} ${x + 14} ${y - 2}" fill="none"/>`;
    case "bigSmile":
      return `<path d="M${x - 18} ${y - 4}Q${x} ${y + 14} ${x + 18} ${y - 4}" fill="none"/>`;
    case "tongue":
      return (
        `<ellipse cx="${x + 11}" cy="${y + 5}" rx="5" ry="4.5" fill="${C.tongue}" stroke-width="3"/>` +
        `<path d="M${x - 10} ${y + 2}Q${x + 2} ${y + 4} ${x + 14} ${y - 2}" fill="none"/>`
      );
    case "smirk":
      return `<path d="M${x - 14} ${y + 2}Q${x + 4} ${y + 6} ${x + 18} ${y - 8}" fill="none"/>`;
    default: {
      const outline = `M${x - 24} ${y - 6}L${x + 24} ${y - 6}Q${x + 22} ${y + 20} ${x} ${y + 20}Q${x - 22} ${y + 20} ${x - 24} ${y - 6}Z`;
      return (
        `<path d="${outline}" fill="${C.mouth}"/>` +
        `<path d="M${x - 21} ${y - 4}L${x + 21} ${y - 4}L${x + 20} ${y + 3}L${x - 20} ${y + 3}Z" fill="${C.paper}" stroke="none"/>` +
        `<path d="M${x - 12} ${y + 14}Q${x} ${y + 6} ${x + 12} ${y + 14}Q${x} ${y + 19} ${x - 12} ${y + 14}Z" fill="${C.tongue}" stroke="none"/>` +
        `<path d="${outline}" fill="none"/>`
      );
    }
  }
};

// Messy, spiky "little genius" hair.
const HAIR =
  "M-82 4C-90 -36 -76 -60 -54 -72L-62 -98L-32 -82L-28 -110L-6 -86L8 -114L22 -86L44 -106L46 -78L70 -90L62 -64C80 -50 88 -26 82 4C76 -16 62 -32 42 -38C22 -28 -6 -30 -26 -38C-48 -32 -70 -18 -82 4Z";

const HAIR_UNDER_CAP =
  "M-82 4C-86 -16 -88 -28 -94 -40L-78 -42C-74 -54 -66 -60 -56 -62L56 -62C66 -60 74 -54 78 -42L94 -40C88 -28 86 -16 82 4C76 -16 62 -32 42 -38C22 -28 -6 -30 -26 -38C-48 -32 -70 -18 -82 4Z";

// What shows of a colleague's hair beyond the cap, drawn behind the head.
const hairBehindHead = ({ hairStyle, hair }) => {
  switch (hairStyle) {
    case "long":
      return (
        `<path d="M-72 -50C-106 -14 -108 62 -98 112L-60 112C-68 70 -68 20 -62 -10Z" fill="${hair}"/>` +
        `<path d="M72 -50C106 -14 108 62 98 112L60 112C68 70 68 20 62 -10Z" fill="${hair}"/>`
      );
    // On the left: the waving arm is on the right.
    case "ponytail":
      return (
        `<path d="M-56 -54C-112 -64 -134 -2 -120 60C-114 88 -100 106 -90 100C-106 66 -104 16 -66 -10Z" fill="${hair}"/>` +
        `<circle cx="-74" cy="-46" r="8" fill="${C.remoteButton}" stroke-width="4"/>`
      );
    case "curls":
      return [-34, -8, 20]
        .flatMap((y, i) => [-1, 1].map((side) => `<circle cx="${side * (90 + i * 3)}" cy="${y}" r="19" fill="${hair}"/>`))
        .join("");
    default:
      return "";
  }
};

// Two lashes on the outer corner of each eye.
const lashes = ({ x, rx }, isLeftEye) => {
  const side = isLeftEye ? -1 : 1;
  const corner = x + side * (rx - 3);
  return `M${corner} ${EYE_Y - 13}l${side * 8} -6M${corner - side * 6} ${EYE_Y - 16}l${side * 5} -8`;
};

// The shutter edge sits inside the skull, so the head is drawn over it.
const floppy = (isBeingInserted) => `
  <g transform="translate(-96 -36) rotate(20) scale(1.25)">
    ${isBeingInserted ? `<path d="M-40 -14H-52M-42 0H-58M-40 14H-52" fill="none" stroke-width="4"/>` : ""}
    <rect x="-30" y="-30" width="60" height="60" rx="5" fill="${C.floppy}"/>
    <rect x="10" y="-16" width="18" height="32" rx="2" fill="${C.metal}" stroke-width="3.5"/>
    <rect x="-25" y="-22" width="30" height="44" rx="3" fill="${C.paper}" stroke-width="3.5"/>
    <path d="M-15 -12V12M-15 6Q-15 -4 -3 -6" fill="none" stroke-width="3.5"/>
    <circle cx="-15" cy="-12" r="3.5" fill="${C.floppy}" stroke-width="2.5"/>
    <circle cx="-15" cy="12" r="3.5" fill="${C.floppy}" stroke-width="2.5"/>
    <circle cx="-3" cy="-6" r="3.5" fill="${C.floppy}" stroke-width="2.5"/>
  </g>`;

const head = (level, face = FACE[level], look = MAIN_LOOK) => {
  const viewName = isReading(level) ? "threeQuarter" : "front";
  const view = HEAD_VIEW[viewName];
  const [leftEye, rightEye] = view.eyes;
  const lensR = (e) => (e.rx < 15 ? 19 : 22);
  const glasses = `
  <circle cx="${leftEye.x}" cy="${EYE_Y + 1}" r="${lensR(leftEye)}" fill="${C.paper}" fill-opacity=".18" stroke-width="5"/>
  <circle cx="${rightEye.x}" cy="${EYE_Y + 1}" r="${lensR(rightEye)}" fill="${C.paper}" fill-opacity=".18" stroke-width="5"/>
  <path d="M${leftEye.x + lensR(leftEye)} 6Q${(leftEye.x + rightEye.x) / 2} 0 ${rightEye.x - lensR(rightEye)} 6${view.temples}" fill="none" stroke-width="5"/>`;
  return `
<g transform="${viewName === "front" ? `translate(0 144) rotate(${face.tilt ?? 0})` : view.transform}">
  ${hairBehindHead(look)}${level >= 3 ? floppy(level === 3) : ""}
  ${view.ears.map((x) => `<circle cx="${x}" cy="6" r="15" fill="${C.skin}"/>`).join("")}
  <ellipse cx="0" cy="0" rx="80" ry="74" fill="${C.skin}"/>
  <path d="${level >= 6 ? HAIR_UNDER_CAP : HAIR}" fill="${look.hair}"/>
  ${view.blush.map((x) => `<ellipse cx="${x}" cy="36" rx="11" ry="7" fill="${C.blush}" opacity=".6" stroke="none"/>`).join("")}
  <path d="${browPath(face.brows, leftEye.x, true)}${browPath(face.brows, rightEye.x, false)}" fill="none" stroke-width="6"/>
  ${eye(leftEye, face.eye)}${eye(rightEye, face.eye)}${look.hasLashes ? `<path d="${lashes(leftEye, true)}${lashes(rightEye, false)}" fill="none" stroke-width="4"/>` : ""}
  <path d="${view.nose}" fill="none" stroke-width="4"/>
  ${mouth(face.mouth, view.mouthX)}${look.hasGlasses ? glasses : ""}
  ${level >= 6 ? cap() : ""}
</g>`;
};

const speechBubble = () => `
  <path d="M94 40H164Q174 40 174 50V92Q174 102 164 102H118L98 120L102 102H94Q84 102 84 92V50Q84 40 94 40Z" fill="${C.paper}"/>
  <path d="M98 58H160M98 72H160M98 86H138" fill="none" stroke="${C.paperLine}" stroke-width="5"/>`;

// An original mark, not a copy of any real logo.
const companyLogo = (x, y, scale) => `
  <g transform="translate(${x} ${y}) scale(${scale})" stroke="none">
    <circle r="10" fill="${C.paper}"/>
    <path d="M-10 3Q-2 -7 10 -1" fill="none" stroke="${COMPANY_COLOR}" stroke-width="3.5"/>
  </g>`;

const cap = () => `
  <path d="M-62 -58C-64 -114 64 -114 62 -58Z" fill="${COMPANY_COLOR}"/>
  <circle cx="0" cy="-100" r="4.5" fill="${COMPANY_COLOR}" stroke-width="3"/>
  ${companyLogo(0, -86, 1.05)}
  <path d="M-68 -62Q0 -80 68 -62Q76 -46 54 -44Q0 -56 -54 -44Q-76 -46 -68 -62Z" fill="${COMPANY_COLOR}"/>`;

// --- Assembly ----------------------------------------------------------------

const body = (level, look) => {
  if (isHeadOnly(level)) return "";
  return isReading(level) ? readingBody(level, look) : frontBody(level, look);
};

const EXTRAS = {
  [CHATTY_LEVEL]: longSpeech,
  [OWN_WORDS_LEVEL]: madeUpWord,
  [PLEASER_LEVEL]: () => heart(-138, 120, 12) + heart(128, 84, 10) + heart(150, 140, 8),
};

// Hands that touch the head are drawn after it.
const overHeadHands = (level) => {
  const arms = FRONT_ARMS[level];
  if (!arms) return "";
  return [arms.left, arms.right]
    .filter((arm) => arm.overHead)
    .map((arm) => hand(arm.hand))
    .join("");
};

// A problem pose keeps the level's equipment but swaps the face and adds its extras.
// Skin is the only use of C.skin, so a colleague's skin tone is a plain substitution.
const character = (level, problem, look = MAIN_LOOK) =>
  `
<g transform="translate(215 0)" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  ${level === OVERWHELMED_LEVEL || level === ONBOARD_OVERWHELMED_LEVEL ? flyingRecipes() : ""}${level === RAG_LEVEL ? documentStack() : ""}${level === ONBOARD_LEVEL ? documentStack(-100, 334, false) : ""}${body(level, look)}
  ${head(level, problem?.face, look)}
  ${overHeadHands(level)}${level === PENSIVE_LEVEL ? thoughtDots() : ""}
  ${isHeadOnly(level) ? speechBubble() : ""}
  ${level === 6 ? sparkle(-128, 196, 12) + sparkle(112, 52, 16) + sparkle(130, 98, 9) : ""}${problem ? problem.extras() : ""}${EXTRAS[level]?.() ?? ""}
</g>`.replaceAll(C.skin, look.skin);

const W = 400;
const H = 500;

const writeCharacterSvg = ({ file, label, desc }, level, problem) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
<title>Le collègue IA — ${label}</title>
<desc>${desc}</desc>
${character(level, problem)}
</svg>
`;
  writeFileSync(join(outDir, file), svg);
};

// Several colleagues side by side, each drawn in its own W×H box.
const writeSceneSvg = ({ file, label, desc, width, figures }) => {
  const drawnFigures = figures
    .map(({ level, look, x, y, scale }) => `<g transform="translate(${x} ${y}) scale(${scale})">${character(level, undefined, look)}</g>`)
    .join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${H}" viewBox="0 0 ${width} ${H}" role="img">
<title>Les collègues IA — ${label}</title>
<desc>${desc}</desc>
${drawnFigures}
</svg>
`;
  writeFileSync(join(outDir, file), svg);
};

writeCharacterSvg(HELLO, HELLO_LEVEL);
writeCharacterSvg(PENSIVE, PENSIVE_LEVEL);
writeCharacterSvg(OVERWHELMED, OVERWHELMED_LEVEL);
writeCharacterSvg(RAG, RAG_LEVEL);
writeCharacterSvg(PILOT, PILOT_LEVEL);
writeCharacterSvg(COOK, COOK_LEVEL);
writeCharacterSvg(ONBOARD, ONBOARD_LEVEL);
writeCharacterSvg(PROPOSE, PROPOSE_LEVEL);
writeCharacterSvg(WRITE, WRITE_LEVEL);
writeCharacterSvg(SESSION, WAVE_LEVEL);
writeCharacterSvg(CHATTY, CHATTY_LEVEL);
writeCharacterSvg(OVERDO, OVERDO_LEVEL);
writeCharacterSvg(OWN_WORDS, OWN_WORDS_LEVEL);
writeCharacterSvg(PLEASER, PLEASER_LEVEL);
writeSceneSvg(SUBAGENTS);
writeSceneSvg(TEAM_HELLO);
PROBLEM_POSES.forEach((pose) => writeCharacterSvg(pose, pose.level, pose));
LEVELS.forEach((level, i) => writeCharacterSvg(level, i + 1));

const LABEL_H = 60;
const overview = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 6}" height="${H + LABEL_H}" viewBox="0 0 ${W * 6} ${H + LABEL_H}" role="img">
<title>Le collègue IA — les six niveaux</title>
<rect width="100%" height="100%" fill="#FFFFFF"/>
${LEVELS.map(
  ({ label }, i) => `<svg x="${i * W}" y="0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${character(i + 1)}</svg>
<text x="${i * W + W / 2}" y="${H + 38}" text-anchor="middle" font-family="Sora, system-ui, sans-serif" font-size="26" font-weight="600" fill="${C.ink}">${label}</text>`,
).join("\n")}
</svg>
`;
writeFileSync(join(outDir, "overview.svg"), overview);

// Inventory icons for the slides: the item he receives at each level, cropped from the props above.
const ITEMS = [
  { file: "bubble.svg", label: "Bulle de parole", viewBox: "79 30 100 100", draw: speechBubble },
  { file: "remote.svg", label: "Télécommande", viewBox: "-28 -5 86 86", draw: () => tvRemote(0, 0) },
  { file: "floppy.svg", label: "Disquette", viewBox: "-150 -90 108 108", draw: () => floppy(false) },
  { file: "recipe.svg", label: "Recette", viewBox: "-54 -54 108 108", draw: () => sheet(0, 0, 0) },
  { file: "manual.svg", label: "Manuel", viewBox: "15 235 140 140", draw: closedBook },
  { file: "cap.svg", label: "Casquette", viewBox: "-75 -149 150 150", draw: cap },
];

const itemsDir = join(outDir, "items");
mkdirSync(itemsDir, { recursive: true });
ITEMS.forEach(({ file, label, viewBox, draw }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img">
<title>${label}</title>
<g stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${draw()}</g>
</svg>
`;
  writeFileSync(join(itemsDir, file), svg);
});
