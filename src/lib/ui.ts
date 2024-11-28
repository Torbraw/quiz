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
    showAnswer: "Show Answer",
    nextQuestion: "Next Question",
    showHint: "Show Hint",
  },
  fr: {
    newGame: "Nouvelle Partie",
    categories: "Catégories",
    allSelected: "Tout sélectionner par défaut",
    timer: "Chronomètre",
    others: "Autres",
    enabled: "Activé",
    autoShowAnswer: "Afficher la réponse automatiquement",
    durationSeconds: "Durée (secondes)",
    numberOfQuestions: "Nombre de questions",
    "error.autoShowAnswer": "L'affichage automatique de la réponse nécessite que le chronomètre soit activé",
    "error.noQuestions": "Aucune question trouvée pour les catégories sélectionnées",
    startGame: "Commencer la Partie",
    showAnswer: "Afficher la Réponse",
    nextQuestion: "Question Suivante",
    showHint: "Afficher l'Indice",
  },
} as const;
