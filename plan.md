# Plan de la présentation — Bonnes pratiques pour travailler avec l'IA (SDLC)

> Premier jet déduit d'un retour d'expérience oral. À raffiner.
> Refonte en cours, slide par slide : les slides déjà refaites passent en tête de `slides.html`. Les anciennes restent derrière, marquées « À reprendre ». On en retire une seulement quand son contenu a été repris ou qu'on a décidé de l'abandonner.
> Repères : en haut à gauche, le fil d'Ariane des trois parties (L'équiper, L'onboarder, Ses traits) montre où on en est. Les anciennes slides y sont rangées selon ce plan.
> Style : le minimum de texte sur la slide, puisque l'orateur parle. Ce qu'il dit va dans les notes de la slide (`<aside class="notes">`), que le public peut afficher avec la touche N en relisant la présentation.

## Fil rouge

**L'IA est ton nouveau collègue : brillant, mais il arrive les mains vides.**
On lui parle comme à un humain, pas comme à un système informatique. On l'équipe, puis on l'onboarde sur ton projet. Il garde ses traits de personnalité : chacun a sa parade.

Ouverture : le collègue dit bonjour. Clôture : y revenir.

## Public et promesse

Public : les Product Managers d'abord, et plus largement ceux qui ne sont pas pointus en tech. Ils utilisent déjà l'IA, mais pour poser des questions. Durée : environ 60 minutes, questions incluses.

Promesse : « À la fin, tu sauras lancer un projet qui exploite vraiment l'IA, sur ton sujet de discovery. »

Double usage : l'orateur commente devant la salle et vouvoie ; la présentation se relit ensuite seul, avec les notes (touche N), qui tutoient comme les slides.

## Intro. Ton nouveau collègue

- Titre : « L'IA, ton nouveau collègue. Tu t'en sers déjà. Pas encore à pleine puissance. »
- Mains levées : qui a utilisé une IA cette semaine ? Pour autre chose que poser une question ? La salle constate l'écart elle-même.
- La promesse, seule sur sa slide, puis pourquoi maintenant : les devs ont pris le virage, le produit en est encore à la question-réponse.
- Le collègue dit bonjour : il est brillant, on lui parle comme à un humain (exemple avant/après d'une demande).
- Le collègue pensif : il arrive les mains vides, il faut l'équiper, l'onboarder et connaître ses traits.
- Passerelle vers le LLM : ceux qui ne font que poser des questions n'utilisent que sa tête.

## 1. L'équiper

Message : l'équipement est générique, il sert dans tous les projets de l'entreprise. À la fin, il connaît l'entreprise, pas encore ton projet.

Une slide par niveau : la solution, puis au clic le nouveau problème, que résout la slide suivante. Le problème porte une étiquette « Problème » ; quand il apparaît, la slide se teinte de rouge autour de la mascotte, qui prend un air embêté (goutte de sueur, bulle vide, point d'interrogation, recettes qui volent). Les titres disent ce que le niveau apporte, pas l'objet dessiné. Les exemples sont annoncés (« Exemples de harnais »). À gauche de la mascotte, un inventaire vertical façon jeu vidéo : une case par objet (bulle de parole, télécommande, disquette, recette, manuel, casquette), qui se remplit slide après slide. Complet, un halo et des paillettes l'entourent. Le détail est dans les notes.

- LLM = l'usage le plus basique, ChatGPT ou Gemini sur le web : ce n'est que la tête. Limite : il parle mais n'agit pas, et ne connaît pas tes documents.
- RAG = petite évolution, il lit tes documents avant de répondre (Gemini Notebook). Limite : ça reste une tête, il n'agit toujours pas.
- Harnais = un corps et une télécommande. Titre : « Ajoute un harnais à ton LLM : tu obtiens un agent » : Claude Code, Codex, GitHub Copilot. Au clic, tes outils remplacent la phrase et les exemples, et il pointe sa télécommande vers eux (Drive, Miro, Slack, Figma, GitHub, et tout le web via ton navigateur) : il a accès à tout ce à quoi tu as accès, si tu l'autorises. Au clic suivant, le problème remplace les outils. Limite : à chaque session il faut tout lui redire, et un autre collègue ne peut pas lui parler.
- Mémoire sauvegardée (disquette) = le contenant, un endroit où relire ce qu'on lui écrit : en local si on travaille seul, ou mieux, un dépôt (GitHub). Ce qu'on y écrit sur le projet relève de l'onboarding. Limite : sur une demande précise, il reste générique.
- Skills (recette) = procédure écrite pour une tâche précise : commit, relecture de PR, ADR. Limite : trop de recettes à gérer, il ne sait plus où donner de la tête (la mascotte débordée remplace la mascotte au clic).
- Framework de skills (manuel) = les recettes rangées en une méthode : BMAD, Spec Kit, GSD. Limite : il ne connaît rien de notre boîte.
- SDLC d'entreprise (casquette) = surcharge le framework. Pas d'exemple nommé : la présentation ne se fait pas qu'à un seul client.
- Récap : les six niveaux côte à côte.
- Transition : il connaît l'entreprise, pas encore ton projet, il faut l'onboarder.

### La mécanique (ancien temps 1)

- LLM : texte en entrée, texte en sortie, sans état.
- Harnais (Copilot, Claude Code…) : orchestre plusieurs appels au LLM.

### Choisir et cadrer la méthode (ancien temps 4)

Message : un framework est un cadre, pas une obligation.

- Skill = recette qui guide l'IA (image des pâtes dans la cuisine de quelqu'un d'autre).
- BMAD : skills orientés cycle de vie (brief, PRD, architecture, dev, review). Le SDLC d'entreprise ajoute ses propres skills.
- Installer le SDLC dans la première PR du projet (comme un `npm install`).
- Invoquer le skill explicitement, sinon l'IA improvise.
- Pas toujours adapté : BMAD est verbeux et lourd pour de la discovery. Alternatives citées : GSD, Spec Kit.
- Choisir le modèle selon la tâche : léger pour extraire, plus fort pour raisonner.

## 2. L'onboarder

Message : on lui donne le contexte de ton projet, grâce à son équipement. Chaque session neuve est un nouvel onboarding.

### Le prompt (ancien temps 1)

- Le prompt final est composé de plusieurs couches : instructions globales, instructions du projet, entraînement du modèle, ce que je dis.
- Le modèle apporte la réflexion ; la connaissance métier vient de l'humain.

### La mémoire, c'est le repo (ancien temps 2)

Message : ce qui n'est pas commité est perdu.

- Nouvelle session = repart de zéro. Ce qui compte est écrit dans des `.md` et commité.
- `agent.md` du projet (conventions d'équipe) ≠ instructions globales (préférences personnelles, génériques).
- Une seule source de vérité : `copilot-instructions` renvoie vers `agent.md`.
- Quand une préférence change, demander à l'IA de l'enregistrer au bon endroit.

### Hygiène de session (ancien temps 3)

Message : une session = un objectif = une PR.

- Session = un agent. Sous-agent = un agent lancé par un autre agent.
- On merge, puis on ouvre une session neuve (équivalent de « un commit = une chose »).
- Session longue : compaction arbitraire, qualité en baisse, coût en tokens en hausse.
- Repère de taille de contexte (à confirmer : « ne pas dépasser ~25 % » est une recommandation, pas une règle).
- Sous-agents : contexte propre et regard extérieur, donc moins d'hallucinations (exemple : la review de code).
- Worktrees : sessions parallèles sans toucher au local.
- Contre-exemple vécu : une session qui mélange deux sujets produit une PR difficile à relire.

### Nourrir la connaissance (ancien temps 5)

Message : le coût d'onboarding est réel mais se rentabilise, et la qualité dépend de ce qu'on lui donne.

- Lui dire ce qui est obsolète et quelle est la source de vérité, sinon context poisoning.
- Lui faire distinguer fait vérifié, interprétation et recommandation.
- Lui donner les comptes-rendus de réunion : il met à jour et clôt les questions ouvertes.
- Garder les liens vers les sources (slides, Miro) pour pouvoir demander « retourne voir, ça a changé ».
- Un repo de connaissance se réutilise dans un autre projet via un lien dans `agent.md` (exemple : changement de brique technique répercuté de la discovery vers le code).

## 3. Ses traits de personnalité

Message : chaque trait vient avec sa parade. Candidats : il prend tout à la lettre, il invente son vocabulaire, il sur-architecture, en review il veut absolument trouver un défaut.

### Cadrer la sortie (ancien temps 6)

Message : sans cadre, l'IA invente son vocabulaire, son format et sa complexité.

- Vocabulaire métier imposé (sinon elle invente des termes).
- Langues : échanges et contenu des documents en français ; noms de fichiers, de dossiers et messages de commit en anglais.
- Format : schémas et exemples plutôt que longs textes.
- YAGNI / KISS dans `agent.md` pour éviter la sur-architecture.
- Séparer ce que lit l'humain de ce que lit l'agent (instructions en commentaires).
- Structure de documentation (ex. PARA) : la faire proposer, puis valider.
- Les comportements par défaut se surchargent (exemple : la review qui doit absolument trouver un défaut).

### Relire et améliorer en boucle (ancien temps 7)

Message : on corrige la cause, pas le symptôme.

- Relire la PR comme celle d'un dev externe : commentaires, review, « prends en compte ».
- Un « retire ça » sans règle enregistrée = le stagiaire refait la même erreur. Corriger ET enregistrer la règle.
- Relire beaucoup au début, de moins en moins ensuite.
- Garder l'historique du pourquoi (memo log, ADR).
- Si ça dérive : session de recadrage plutôt que s'acharner.
- Adapter le workflow à ses habitudes (exemple : PR « pré-mergée » parce que c'est l'humain qui clique sur merge).

## Clôture. Posture transverse

- Ce n'est pas un moteur de recherche : on lui demande comment faire plutôt que d'aller chercher soi-même.
- La courbe d'apprentissage est longue seul : partager les pratiques en équipe.

## Points à trancher

- Le corps du deck parle encore aux devs (PR, commits, worktrees, `agent.md`). À relire partie par partie : un PM s'en sert-il pour lancer son projet ?
- Version courte : quelles slides sauter ?
- Combien de slides par partie ?
- Quels exemples concrets montrer en démo ou en capture ?
- Les pratiques citées sont-elles toutes à présenter comme recommandées, ou certaines comme « retour d'expérience à nuancer » (taille de contexte, worktrees, distinction décision / question close) ?
