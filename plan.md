# Plan de la présentation — Bonnes pratiques pour travailler avec l'IA (SDLC)

> Premier jet déduit d'un retour d'expérience oral. À raffiner.
> Les trois parties et la clôture ont une première version dans `slides.html`. Les anciennes slides « À reprendre » sont retirées : leur contenu est repris ci-dessous, ou abandonné (voir « Écarté »).
> Repères : en haut à gauche, le fil d'Ariane des trois parties (L'équiper, L'onboarder, Ses traits) montre où on en est.
> Style : le minimum de texte sur la slide, puisque l'orateur parle. Ce qu'il dit va dans les notes de la slide (`<aside class="notes">`), que le public peut afficher avec la touche N en relisant la présentation.

## Fil rouge

**L'IA est ton nouveau collègue : brillant, mais il arrive les mains vides.**
On lui parle comme à un humain, pas comme à un système informatique. On l'équipe, puis on l'onboarde sur ton projet. Il garde ses traits de personnalité : chacun a sa parade.

**Une présentation à tiroirs** : chaque partie suffit à repartir avec quelque chose.

| Tiroir | Tu repars avec |
|---|---|
| 1. L'équiper | les bons outils, et ce que chacun permet |
| 2. L'onboarder | le cycle d'itération : tu travailles avec lui, une session et une PR à la fois, sur ta discovery. La promesse est tenue ici. |
| 3. Ses traits | ses travers corrigés une fois pour toutes, dans AGENTS.md |

Version courte : les tiroirs 1 et 2.

Ouverture : le collègue dit bonjour. Clôture : toute l'équipe de collègues dit bonjour.

## Public et promesse

Public : les Product Managers d'abord, et plus largement ceux qui ne sont pas pointus en tech. Ils utilisent déjà l'IA, mais pour poser des questions. Durée : environ 60 minutes, questions incluses.

Promesse : « À la fin, tu sauras lancer un projet qui exploite vraiment l'IA, sur ton sujet de discovery. »

Double usage : l'orateur commente devant la salle et vouvoie ; la présentation se relit ensuite seul, avec les notes (touche N), qui tutoient comme les slides.

Pas de méthode propre à un projet (PARA, ADR, YAGNI, Party Mode…) : on garde l'idée, sans le nom.

## Intro. Ton nouveau collègue

- Titre : « L'IA, ton nouveau collègue. Tu t'en sers déjà. Pas encore à pleine puissance. »
- Mains levées : qui a utilisé une IA cette semaine ? Pour autre chose que poser une question ? La salle constate l'écart elle-même.
- La promesse, seule sur sa slide, puis pourquoi maintenant : les devs ont pris le virage, le produit en est encore à la question-réponse.
- Le collègue dit bonjour : un nouveau collaborateur qui rejoint ton équipe (il servira l'entreprise une fois équipé), il est brillant, on lui parle comme à un humain (exemple avant/après d'une demande).
- Le collègue pensif : il arrive les mains vides, il faut l'équiper, l'onboarder et connaître ses traits de personnalité pour en tirer le meilleur.
- Les trois tiroirs, qui s'ouvrent un par un : ce que chacun te laisse. Tu peux t'arrêter après chaque tiroir.

## 1. L'équiper

Message : l'équipement est générique, il sert dans tous les projets de l'entreprise. À la fin, tu as les bons outils et tu sais ce que chacun permet ; il connaît l'entreprise, pas encore ton projet.

Une slide par niveau : la solution, puis au clic ce qu'elle permet de faire en plus (étiquette jaune « Tu peux »). Le problème suit sur sa propre slide, sans titre : la mascotte embêtée en grand au centre (goutte de sueur, bulle vide, point d'interrogation, recettes qui volent), l'étiquette « Problème » et la phrase en dessous, la slide teintée de rouge. La slide suivante le résout. Les titres disent ce que le niveau apporte, pas l'objet dessiné. Les exemples sont annoncés (« Exemples de harnais »). À gauche de la mascotte, un inventaire vertical façon jeu vidéo : une case par objet (bulle de parole, télécommande, disquette, guide, casquette), qui se remplit slide après slide. Complet, un halo et des paillettes l'entourent. Le détail est dans les notes.

- LLM = « À la base, il n'a qu'une tête » : il ne sait que réfléchir, même pas mémoriser. L'usage le plus basique, ChatGPT ou Gemini sur le web. Tu peux : poser des questions, reformuler, trouver des idées. Pas de problème : on enchaîne sur le RAG.
- RAG = petite évolution, il lit tes documents avant de répondre (Gemini Notebook). Tu peux : interroger tes documents. Problème : ça reste une tête, il n'agit toujours pas.
- Harnais = un corps et une télécommande. Titre : « Ajoute-lui un corps : tu obtiens un agent » ; ce corps, c'est le harnais : Claude Code, Codex, GitHub Copilot. Au clic, tes outils remplacent la phrase et les exemples, et il pointe sa télécommande vers eux (Drive, Miro, Slack, Figma, GitHub, et tout le web via ton navigateur) : tu peux le faire agir dans tout ce à quoi tu as accès, si tu l'autorises. Problème : à chaque session il faut tout lui redire, et un autre collègue ne peut pas lui parler.
- Mémoire (disquette) = « Complète sa tête avec une mémoire » : il sait maintenant réfléchir et retenir. On enregistre des fichiers qu'il saura relire : sur ton ordinateur pour travailler seul, ou mieux, sur un dépôt GitHub, plus sûr et partagé avec l'équipe. Ce qu'on y écrit sur le projet relève de l'onboarding. Tu peux : faire du vibe coding. Problème : il improvise, même demande, résultat différent ; exemple : « Fais le compte rendu de la réunion » donne lundi la décision et les actions (qui, pour quand), jeudi un paragraphe creux, sans décision ni action.
- Guide (manuel), en deux slides comme LLM et RAG :
  - Skills = procédure écrite pour une tâche précise : synthétiser des entretiens, rédiger une user story, écrire un compte rendu. Tu peux : obtenir le même travail, bien fait, à chaque fois ; dans le même bloc, sans contour, l'analogie de la cuisine illustrée par la mascotte qui fait sauter une crêpe, ta recette à la main (sans recette : la première poêle venue et de l'huile ; avec la tienne : tes crêpes, au beurre salé). Problème : trop de recettes à gérer, il ne sait plus où donner de la tête (la mascotte débordée).
  - Framework de skills = petite évolution, les recettes rangées en une méthode : BMAD, Spec Kit, GSD. Tu peux : dérouler toute une démarche, de l'idée à la livraison. En notes : un cadre, pas une obligation (BMAD est lourd pour de la discovery) ; appeler le skill par son nom, sinon il improvise. Problème : il ne connaît rien de notre boîte.
- SDLC d'entreprise (casquette) = « Rends-le corporate avec la surcouche de ton entreprise » : surcharge le framework. Tu peux : livrer un travail que l'équipe reconnaît comme le sien. Pas d'exemple nommé : la présentation ne se fait pas qu'à un seul client.
- Récap : les cinq niveaux côte à côte, chacun avec ce qu'il permet de faire (poser des questions, agir dans tes outils, vibe coder, travailler avec méthode, livrer comme l'équipe).
- Transition : tu peux démarrer n'importe quel projet ; il ne connaît pas encore le tien, il faut l'onboarder.

## 2. L'onboarder : le cycle d'itération

Message : il est équipé, on l'onboarde en se mettant au travail avec lui. Le fil rouge est le cycle d'itération : une session, un objectif, une PR, puis une session neuve. À la fin, tu sais mener ta discovery avec lui, cycle après cycle.

Repère visuel : en haut à droite, la mini-carte du cycle, comme l'inventaire de la partie 1. Sept étapes reliées, une flèche de retour en dessous ; l'étape en cours est en jaune, les étapes faites en bleu. Le cycle complet apparaît en grand, en anneau autour de la mascotte, à l'ouverture et à la fin de la partie.

Pas de slide rouge dans cette partie : c'est le chemin nominal, avec ses bons gestes. Les problèmes sont dans la partie 3. Le vocabulaire des devs (session, commit, PR, merge) est gardé et vulgarisé. Exemple fil rouge : écrire le brief de la discovery sur la gestion des stocks.

- **Le cycle d'itération**, en anneau : ouvre une session, parle-lui de ton sujet, revois son plan, il exécute le plan, commit et PR, relis et commente, merge, puis session neuve.
- **1. Ouvre une session** (il dit bonjour) : une conversation avec lui, dans ton harnais. Il arrive frais : il ne sait que ce qui est écrit dans le dépôt. La toute première fois, un dépôt par projet, et la surcouche de l'entreprise s'y installe. Une session, un objectif.
- **2. Parle-lui de ton sujet**, le plus précisément possible : il ne sait rien de ton métier tant que tu ne le lui donnes pas, ou ne lui dis pas où chercher. Documents, verbatims, comptes rendus, liens Miro et Drive ; en vocal, tu en dis plus, plus vite.
- **2 bis. Dis-lui ce qui fait foi** : sinon il met le cadrage de mars et l'atelier d'octobre au même niveau (context poisoning). Tu peux : « Retourne voir, ça a changé ».
- **3. Demande-lui un plan, et revois-le** : avant d'écrire, il dit quels fichiers il va créer et ce qu'il y mettra. C'est le moment le moins cher pour corriger.
- **4. Il exécute le plan** : brief, synthèses, PRD, avec les skills du framework, appelés par leur nom. Il écrit dans des fichiers du dépôt, pas dans la conversation.
- **5. Commit et PR** : « Commite et ouvre une PR. » Le commit est une sauvegarde datée, la PR une proposition de modification que tu relis avant de l'accepter. Ce qui n'est pas commité est perdu.
- **6. Relis et commente sur GitHub** : une maquette de PR (le fichier modifié, ton commentaire, sa réponse). Puis, dans ta session : « Prends en compte les commentaires de la PR. » Il corrige, nouveau commit, nouvelle relecture, jusqu'à satisfaction.
- **7. Merge** : la modification entre dans le dépôt, pour l'équipe et pour sa prochaine session. Tu peux : reprendre trois semaines plus tard, « Où en est-on ? ».
- **Puis, une session neuve** : la fenêtre de contexte comme un bureau de taille fixe, la compaction, le coût en tokens, le repère d'environ 25 % (une recommandation, pas une règle). Le dépôt se souvient : la session neuve relit ce qui est mergé.
- **Cycle après cycle** : l'anneau complet ; brief, synthèses, PRD, la discovery grandit une PR à la fois. Tu peux t'arrêter là.

## 3. Ses traits : les problèmes que tu vas croiser

Message : cycle après cycle, ses travers reviennent. Tu les corriges à la cause, une fois pour toutes, dans AGENTS.md. Ici, on va plus loin : tu le règles à ta façon.

Une slide par travers : la mascotte dans la situation, l'étiquette rouge « Travers », un exemple, puis au clic l'étiquette jaune « Parade », la phrase à lui écrire, et le fichier où elle va (ton AGENTS.md ou celui du projet).

- **Il est bavard** : « Combien d'entretiens parlent de ressaisie ? », trois paragraphes. Tu lui dis « plus court », il obéit… et recommence à la session suivante.
- **Corrige la cause, pas le symptôme** : la règle écrite dans AGENTS.md, un fichier relu au début de chaque session. Relire beaucoup au début, de moins en moins ensuite. Si ça dérive : une session de recadrage plutôt que s'acharner.
- **Ton AGENTS.md, et celui du projet** : la pile du prompt, les deux couches en avant. Le tien te suit dans tous tes projets (ton, format, « contredis-moi ») ; celui du projet est partagé avec l'équipe (organisation, vocabulaire, sources). Selon l'outil, ton fichier à toi porte un autre nom ; `CLAUDE.md` et `copilot-instructions.md` renvoient vers `AGENTS.md`. Tu peux : « Retiens-le, au bon endroit. »
- **Il en fait trop** → ton AGENTS.md : « Fais ce qui est demandé, rien de plus. Propose le reste. »
- **Il veut te faire plaisir** (il te donne raison, ou trouve à tout prix un défaut en relecture) → ton AGENTS.md : « Contredis-moi quand j'ai tort. "Rien à signaler" est une réponse acceptable. »
- **Il range à sa façon** → AGENTS.md du projet : une arborescence (sources, entretiens, décisions et leur pourquoi, questions ouvertes) ; dans chaque synthèse, fait vérifié, interprétation, recommandation. Il peut proposer le rangement, tu valides.
- **Il invente ses mots** (l'équipe dit « magasinier », il écrit trois mots différents) → un glossaire, un mot par notion.
- **Tout n'a pas à être dans AGENTS.md** : il le relit à chaque session, alors il reste court et renvoie vers d'autres fichiers (glossaire, organisation, sources). Un lien peut même pointer vers un autre dépôt : ta discovery, pour l'agent des devs.
- **D'autres collègues, équipés comme lui : les sous-agents.** Seul, il relit son travail avec les yeux de l'auteur, et son bureau déborde. Il confie une part à chacun et ne garde que leur synthèse ; un sous-agent part d'un bureau vide, c'est un regard neuf.
- **Va plus vite, dépense moins** : le bon modèle pour la tâche (léger pour extraire, plus fort pour raisonner), plusieurs sessions en parallèle (chacune sur sa copie du projet), un workflow adapté à tes habitudes.
- Récap : les réglages de ton collègue, comme ceux d'un personnage de jeu. Un curseur par travers glisse vers ta façon.

## Clôture

- Les trois tiroirs, ouverts : ce que tu as construit.
- Toute l'équipe de collègues dit bonjour : il est prêt, présente-lui ton projet. Deux réflexes : ce n'est pas un moteur de recherche (demande-lui comment faire plutôt que de chercher à sa place) ; partage tes pratiques en équipe, la courbe d'apprentissage est longue seul.

## Écarté

- Les méthodes propres à un projet : PARA (on garde « il propose le rangement, tu valides »), ADR et memo log (on garde « chaque décision et son pourquoi »), YAGNI et KISS (on garde le travers « il en fait trop »), Party Mode, le seuil de tokens de BMAD.
- Les langues des fichiers et des commits (noms en anglais, contenu en français) : une convention de devs.
- La PR « pré-mergée » et le statut de sprint : trop propres à une équipe. Il reste « un workflow adapté à tes habitudes ».
- Le mot « worktree » : on dit « chacune sur sa copie du projet ».
- « Il prend tout à la lettre » : couvert par l'intro (on lui parle comme à un humain).

## Points à trancher

- Le deck passe à 46 slides pour 60 minutes ; les slides de problème se passent vite, mais la version courte (tiroirs 1 et 2) reste à minuter.
- La maquette de PR est dessinée en HTML : une vraie capture de GitHub, ou une démo en direct du cycle, parlerait davantage.
- « Ton AGENTS.md » est une simplification : le nom du fichier personnel dépend de l'outil. À vérifier pour chaque harnais cité avant de le montrer.
- Les pratiques citées sont-elles toutes à présenter comme recommandées, ou certaines comme « retour d'expérience à nuancer » (taille de contexte, distinction décision / question close) ?
