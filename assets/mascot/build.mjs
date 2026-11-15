// Generates the six mascot levels (cumulative equipment) and an overview sheet.
// Usage: node assets/mascot/build.mjs
import { writeFileSync } from "node:fs";
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
  runButton: "#FF4B3E",
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
    desc: "Le harnais lui donne un corps : il tient son bouton Run de poche et appuie dessus lui-même, il agit sur son environnement.",
  },
  {
    file: "03-storage.svg",
    label: "3 · Stockage (Git)",
    desc: "Son bouton Run en main, il enfonce une disquette Git dans son crâne : sa mémoire durable est un support externe qu'il recharge à chaque session.",
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

const sparkle = (x, y, s) =>
  `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="${C.gold}" stroke-width="3"/>`;

// --- Props held in the hands -------------------------------------------------

const sheet = () => `
  <g transform="translate(60 300) rotate(-12)">
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

// Pocket Run button; (x, y) is the top-left corner of its case.
const runRemote = (x, y) => `
  <rect x="${x}" y="${y}" width="52" height="38" rx="8" fill="${C.ink}"/>
  <path d="M${x + 10} ${y + 2}Q${x + 26} ${y - 20} ${x + 42} ${y + 2}Z" fill="${C.runButton}"/>
  <path d="M${x + 19} ${y + 10}L${x + 34} ${y + 19}L${x + 19} ${y + 28}Z" fill="${C.paper}" stroke="none"/>`;

const pressLines = () => `<path d="M-24 290L-32 284M44 290L52 284M-26 302H-36M46 302H56" fill="none" stroke-width="4"/>`;

const pointingHand = ([x, y]) =>
  `<rect x="${x - 5}" y="${y}" width="10" height="26" rx="5" fill="${C.skin}"/>` +
  `<circle cx="${x}" cy="${y}" r="14" fill="${C.skin}"/>`;

// --- Bodies ------------------------------------------------------------------

// Arm poses of the front-facing levels. A hand marked overHead touches the
// floppy, so it is drawn after the head.
const LEFT_SHOULDER = [-48, 252];
const RIGHT_SHOULDER = [48, 252];

const FRONT_ARMS = {
  2: {
    left: { shoulder: LEFT_SHOULDER, control: [-84, 330], end: [-6, 342], hand: [2, 342] },
    right: { shoulder: RIGHT_SHOULDER, control: [92, 310], end: [20, 270], pointing: [10, 266] },
  },
  3: {
    left: { shoulder: LEFT_SHOULDER, control: [-116, 250], end: [-110, 182], hand: [-108, 174], overHead: true },
    right: { shoulder: RIGHT_SHOULDER, control: [80, 300], end: [86, 330], hand: [88, 340] },
  },
  6: {
    left: { shoulder: LEFT_SHOULDER, control: [-108, 296], end: [-100, 244], thumbsUp: [-100, 236] },
    right: { shoulder: RIGHT_SHOULDER, control: [96, 300], end: [102, 350], hand: [104, 360] },
  },
};

const drawHand = (arm) => {
  if (arm.overHead) return "";
  if (arm.thumbsUp) return thumbsUp(arm.thumbsUp);
  if (arm.pointing) return pointingHand(arm.pointing);
  return hand(arm.hand);
};

const FRONT_PROPS = { 2: () => runRemote(-16, 302) + pressLines(), 3: () => runRemote(92, 306), 6: closedBook };

const frontBody = (level) => {
  const { shirt, pants } = outfit(level);
  const { left: leftArm, right: rightArm } = FRONT_ARMS[level];
  return `
  <ellipse cx="0" cy="466" rx="78" ry="9" fill="${C.ink}" opacity=".12" stroke="none"/>
  <path d="M-50 356L50 356L54 446L12 446L0 392L-12 446L-54 446Z" fill="${pants}"/>
  <path d="M-58 444L-10 444L-8 458Q-8 466 -16 466L-62 466Q-72 466 -68 456Z" fill="${C.shoe}"/>
  <path d="M58 444L10 444L8 458Q8 466 16 466L62 466Q72 466 68 456Z" fill="${C.shoe}"/>
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

const readingBody = (level) => {
  const { shirt, pants } = outfit(level);
  const arms = READING_ARMS[level];
  return `
  <ellipse cx="4" cy="466" rx="78" ry="9" fill="${C.ink}" opacity=".12" stroke="none"/>
  <path d="M-44 356L44 356L46 446L10 446L2 392L-8 446L-46 446Z" fill="${pants}"/>
  <path d="M-50 444L-8 444Q4 446 6 456Q8 466 -4 466L-48 466Q-56 466 -54 456Z" fill="${C.shoe}"/>
  <path d="M12 444L50 444Q62 446 64 456Q66 466 54 466L12 466Q6 466 8 456Z" fill="${C.shoe}"/>
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
  1: { brows: "raised", eye: { pupil: 7, look: [3, -1] }, mouth: "talk" },
  2: { brows: "neutral", eye: { pupil: 7, look: [0, 7] }, mouth: "smile" },
  3: { brows: "neutral", eye: { pupil: 7, look: [-6, -4] }, mouth: "bigSmile", tilt: -12 },
  4: { brows: "focused", eye: { pupil: 7, look: [2, 5] }, mouth: "tongue" },
  5: { brows: "confident", eye: { pupil: 6.5, look: [2, 1], halfLid: true }, mouth: "smirk" },
  6: { brows: "happy", eye: { pupil: 7.5, look: [0, 0] }, mouth: "grin" },
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

const head = (level) => {
  const viewName = isReading(level) ? "threeQuarter" : "front";
  const view = HEAD_VIEW[viewName];
  const face = FACE[level];
  const [leftEye, rightEye] = view.eyes;
  const lensR = (e) => (e.rx < 15 ? 19 : 22);
  return `
<g transform="${viewName === "front" ? `translate(0 144) rotate(${face.tilt ?? 0})` : view.transform}">
  ${level >= 3 ? floppy(level === 3) : ""}
  ${view.ears.map((x) => `<circle cx="${x}" cy="6" r="15" fill="${C.skin}"/>`).join("")}
  <ellipse cx="0" cy="0" rx="80" ry="74" fill="${C.skin}"/>
  <path d="${level >= 6 ? HAIR_UNDER_CAP : HAIR}" fill="${C.hair}"/>
  ${view.blush.map((x) => `<ellipse cx="${x}" cy="36" rx="11" ry="7" fill="${C.blush}" opacity=".6" stroke="none"/>`).join("")}
  <path d="${browPath(face.brows, leftEye.x, true)}${browPath(face.brows, rightEye.x, false)}" fill="none" stroke-width="6"/>
  ${eye(leftEye, face.eye)}${eye(rightEye, face.eye)}
  <path d="${view.nose}" fill="none" stroke-width="4"/>
  ${mouth(face.mouth, view.mouthX)}
  <circle cx="${leftEye.x}" cy="${EYE_Y + 1}" r="${lensR(leftEye)}" fill="${C.paper}" fill-opacity=".18" stroke-width="5"/>
  <circle cx="${rightEye.x}" cy="${EYE_Y + 1}" r="${lensR(rightEye)}" fill="${C.paper}" fill-opacity=".18" stroke-width="5"/>
  <path d="M${leftEye.x + lensR(leftEye)} 6Q${(leftEye.x + rightEye.x) / 2} 0 ${rightEye.x - lensR(rightEye)} 6${view.temples}" fill="none" stroke-width="5"/>
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

const body = (level) => {
  if (level === 1) return "";
  return isReading(level) ? readingBody(level) : frontBody(level);
};

const character = (level) => `
<g transform="translate(215 0)" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  ${body(level)}
  ${head(level)}
  ${level === 3 ? hand(FRONT_ARMS[3].left.hand) : ""}
  ${level === 1 ? speechBubble() : ""}
  ${level >= 6 ? sparkle(-128, 196, 12) + sparkle(112, 52, 16) + sparkle(130, 98, 9) : ""}
</g>`;

const W = 400;
const H = 500;

LEVELS.forEach(({ file, label, desc }, i) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
<title>Le collègue IA — ${label}</title>
<desc>${desc}</desc>
${character(i + 1)}
</svg>
`;
  writeFileSync(join(outDir, file), svg);
});

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
