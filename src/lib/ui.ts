export const languages = {
  en: "English",
  fr: "Français",
};

export const defaultLang = "fr";

export const ui = {
  en: {
    newGame: "New Game",
    categories: "Categories",
    allSelected: "All selected by default",
    timer: "Timer",
    others: "Others",
    enabled: "Enabled",
    autoShowAnswer: "Auto show answer",
    durationSeconds: "Duration (seconds)",
    numberOfQuestions: "Number of questions",
    "error.autoShowAnswer": "Auto show answer requires timer to be enabled",
    "error.noQuestions": "No questions found for the selected categories",
    startGame: "Start Game",
    questionsAvailable: "questions available",
    showAnswer: "Show Answer",
    nextQuestion: "Next Question",
    showHint: "Show Hint",
    "categoryEnum.general": "General",
    "categoryEnum.blind-test": "Blind Test",
    "categoryEnum.movies": "Movies",
    "categoryEnum.cartoons": "Cartoons",
    "categoryEnum.celebrities-qc": "Celebrities (QC)",
    "categoryEnum.celebrities": "Celebrities",
    "categoryEnum.math": "Math",
    "categoryEnum.logo": "Logo",
    "categoryEnum.rebus": "Rebus",
    "categoryEnum.translated-lyrics-fr": "Translated Lyrics (EN -> FR)",
    "categoryEnum.translated-lyrics-en": "Translated Lyrics (EN -> FR)",
    "categoryEnum.spelling": "Spelling",
    "categoryEnum.animals": "Animals",
    "categoryEnum.video-games": "Video Games",
    "categoryEnum.four-pics-one-word": "Four Pics One Word",
    "categoryEnum.for-kids": "For Kids",
  },
  fr: {
    newGame: "Nouvelle Partie",
    categories: "Catégories",
    allSelected: "Tous sélectionnés par défaut",
    timer: "Chronomètre",
    others: "Autres",
    enabled: "Activé",
    autoShowAnswer: "Afficher la réponse automatiquement",
    durationSeconds: "Durée (secondes)",
    numberOfQuestions: "Nombre de questions",
    "error.autoShowAnswer": "L'affichage automatique de la réponse nécessite que le chronomètre soit activé",
    "error.noQuestions": "Aucune question trouvée pour les catégories sélectionnées",
    startGame: "Commencer la Partie",
    questionsAvailable: "questions disponibles",
    showAnswer: "Afficher la Réponse",
    nextQuestion: "Question Suivante",
    showHint: "Afficher l'Indice",
    "categoryEnum.general": "Général",
    "categoryEnum.blind-test": "Blind Test",
    "categoryEnum.movies": "Films",
    "categoryEnum.cartoons": "Dessins animés",
    "categoryEnum.celebrities-qc": "Célébrités (QC)",
    "categoryEnum.celebrities": "Célébrités",
    "categoryEnum.math": "Mathématiques",
    "categoryEnum.logo": "Logo",
    "categoryEnum.rebus": "Rébus",
    "categoryEnum.translated-lyrics-fr": "Paroles Traduites (FR -> EN)",
    "categoryEnum.translated-lyrics-en": "Paroles Traduites (EN -> FR)",
    "categoryEnum.spelling": "Orthographe",
    "categoryEnum.animals": "Animaux",
    "categoryEnum.video-games": "Jeux Vidéo",
    "categoryEnum.four-pics-one-word": "Quatre Images Un Mot",
    "categoryEnum.for-kids": "Pour Enfants",
  },
} as const;
