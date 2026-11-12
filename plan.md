# Plan de la présentation — Bonnes pratiques pour travailler avec l'IA (SDLC)

> Premier jet déduit d'un retour d'expérience oral. À raffiner.

## Fil rouge

**L'IA est un stagiaire brillant mais amnésique.**
Il ne retient rien d'une session à l'autre : on le cadre, on lui fait écrire ce qui compte, on relit son travail et on corrige la cause de ses erreurs.

Ouverture : poser l'image du stagiaire. Clôture : y revenir.

## 1. Comprendre la mécanique

Message : comprendre pourquoi l'IA oublie explique toutes les autres pratiques.

- LLM : texte en entrée, texte en sortie, sans état.
- Harnais (Copilot, Claude Code…) : orchestre plusieurs appels au LLM.
- Session = un agent. Sous-agent = un agent lancé par un autre agent.
- Le prompt final est composé de plusieurs couches : instructions globales, instructions du projet, entraînement du modèle, ce que je dis.
- Le modèle apporte la réflexion ; la connaissance métier vient de l'humain.

## 2. La mémoire, c'est le repo

Message : ce qui n'est pas commité est perdu.

- Nouvelle session = repart de zéro. Ce qui compte est écrit dans des `.md` et commité.
- `agent.md` du projet (conventions d'équipe) ≠ instructions globales (préférences personnelles, génériques).
- Une seule source de vérité : `copilot-instructions` renvoie vers `agent.md`.
- Quand une préférence change, demander à l'IA de l'enregistrer au bon endroit.

## 3. Hygiène de session

Message : une session = un objectif = une PR.

- On merge, puis on ouvre une session neuve (équivalent de « un commit = une chose »).
- Session longue : compaction arbitraire, qualité en baisse, coût en tokens en hausse.
- Repère de taille de contexte (à confirmer : « ne pas dépasser ~25 % » est une recommandation, pas une règle).
- Sous-agents : contexte propre et regard extérieur, donc moins d'hallucinations (exemple : la review de code).
- Worktrees : sessions parallèles sans toucher au local.
- Contre-exemple vécu : une session qui mélange deux sujets produit une PR difficile à relire.

## 4. Choisir et cadrer la méthode

Message : un framework est un cadre, pas une obligation.

- Skill = recette qui guide l'IA (image des pâtes dans la cuisine de quelqu'un d'autre).
- BMAD : skills orientés cycle de vie (brief, PRD, architecture, dev, review). Le SDLC d'entreprise ajoute ses propres skills.
- Installer le SDLC dans la première PR du projet (comme un `npm install`).
- Invoquer le skill explicitement, sinon l'IA improvise.
- Pas toujours adapté : BMAD est verbeux et lourd pour de la discovery. Alternatives citées : GSD, Spec Kit.
- Les comportements par défaut se surchargent (exemple : la review qui doit absolument trouver un défaut).
- Choisir le modèle selon la tâche : léger pour extraire, plus fort pour raisonner.

## 5. Nourrir la connaissance (onboarder le stagiaire)

Message : le coût d'onboarding est réel mais se rentabilise, et la qualité dépend de ce qu'on lui donne.

- Lui dire ce qui est obsolète et quelle est la source de vérité, sinon context poisoning.
- Lui faire distinguer fait vérifié, interprétation et recommandation.
- Lui donner les comptes-rendus de réunion : il met à jour et clôt les questions ouvertes.
- Garder les liens vers les sources (slides, Miro) pour pouvoir demander « retourne voir, ça a changé ».
- Un repo de connaissance se réutilise dans un autre projet via un lien dans `agent.md` (exemple : changement de brique technique répercuté de la discovery vers le code).

## 6. Cadrer la sortie

Message : sans cadre, l'IA invente son vocabulaire, son format et sa complexité.

- Vocabulaire métier imposé (sinon elle invente des termes).
- Langues : échanges et contenu des documents en français ; noms de fichiers, de dossiers et messages de commit en anglais.
- Format : schémas et exemples plutôt que longs textes.
- YAGNI / KISS dans `agent.md` pour éviter la sur-architecture.
- Séparer ce que lit l'humain de ce que lit l'agent (instructions en commentaires).
- Structure de documentation (ex. PARA) : la faire proposer, puis valider.

## 7. Relire et améliorer en boucle

Message : on corrige la cause, pas le symptôme.

- Relire la PR comme celle d'un dev externe : commentaires, review, « prends en compte ».
- Un « retire ça » sans règle enregistrée = le stagiaire refait la même erreur. Corriger ET enregistrer la règle.
- Relire beaucoup au début, de moins en moins ensuite.
- Garder l'historique du pourquoi (memo log, ADR).
- Si ça dérive : session de recadrage plutôt que s'acharner.
- Adapter le workflow à ses habitudes (exemple : PR « pré-mergée » parce que c'est l'humain qui clique sur merge).

## Posture transverse

- Ce n'est pas un moteur de recherche : on lui demande comment faire plutôt que d'aller chercher soi-même.
- La courbe d'apprentissage est longue seul : partager les pratiques en équipe.

## Points à trancher

- Public cible et durée de la présentation ?
- Une slide par temps (7 + ouverture/clôture) ou plus détaillé ?
- Quels exemples concrets montrer en démo ou en capture ?
- Les pratiques citées sont-elles toutes à présenter comme recommandées, ou certaines comme « retour d'expérience à nuancer » (taille de contexte, worktrees, distinction décision / question close) ?
