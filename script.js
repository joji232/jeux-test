// Configuration du jeu
const CONFIG = {
    niveaux: {
        1: { type: 'addition', temps: 60, range: { min: 1, max: 20 } },
        2: { type: 'soustraction', temps: 50, range: { min: 1, max: 30 } },
        3: { type: 'multiplication', temps: 45, range: { min: 1, max: 10 } },
        4: { type: 'addition', temps: 40, range: { min: 10, max: 50 } },
        5: { type: 'soustraction', temps: 35, range: { min: 20, max: 60 } }
    }
};

// Variables globales
let points = 0;
let niveauActuel = 1;
let tempsRestant = CONFIG.niveaux[niveauActuel].temps;
let timer;
let questionEnCours = false;

// Éléments du DOM
const pointsElement = document.getElementById('points');
const niveauElement = document.getElementById('niveau');
const tempsElement = document.getElementById('temps');
const questionElement = document.getElementById('question');
const reponseInput = document.getElementById('reponse');
const validerButton = document.getElementById('valider');
const feedbackElement = document.getElementById('feedback');
const barreProgression = document.getElementById('barre-progression');
const nouvellePartieButton = document.getElementById('nouvelle-partie');
const changerNiveauButton = document.getElementById('changer-niveau');

// Fonctions principales
function initialiserJeu() {
    points = 0;
    niveauActuel = 1;
    mettreAJourAffichage();
    genererQuestion();
}

function genererQuestion() {
    if (questionEnCours) return;
    
    questionEnCours = true;
    const configNiveau = CONFIG.niveaux[niveauActuel];
    let operation, a, b, resultat, symbole;
    
    switch(configNiveau.type) {
        case 'addition':
            a = Math.floor(Math.random() * (configNiveau.range.max - configNiveau.range.min + 1)) + configNiveau.range.min;
            b = Math.floor(Math.random() * (configNiveau.range.max - configNiveau.range.min + 1)) + configNiveau.range.min;
            resultat = a + b;
            symbole = '+';
            break;
            
        case 'soustraction':
            a = Math.floor(Math.random() * (configNiveau.range.max - configNiveau.range.min + 1)) + configNiveau.range.min;
            b = Math.floor(Math.random() * (a - configNiveau.range.min + 1)) + configNiveau.range.min;
            resultat = a - b;
            symbole = '-';
            break;
            
        case 'multiplication':
            a = Math.floor(Math.random() * (configNiveau.range.max - configNiveau.range.min + 1)) + configNiveau.range.min;
            b = Math.floor(Math.random() * (configNiveau.range.max - configNiveau.range.min + 1)) + configNiveau.range.min;
            resultat = a * b;
            symbole = '×';
            break;
    }
    
    // Afficher la question
    questionElement.textContent = `${a} ${symbole} ${b} = ?`;
    
    // Réinitialiser l'entrée et le feedback
    reponseInput.value = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    
    // Mettre le focus sur l'input
    reponseInput.focus();
}

function verifierReponse() {
    if (!questionEnCours) return;
    
    const reponseUtilisateur = parseInt(reponseInput.value);
    const configNiveau = CONFIG.niveaux[niveauActuel];
    let a, b, resultat, symbole;
    
    // Recalculer le bon résultat
    switch(configNiveau.type) {
        case 'addition':
            a = parseInt(questionElement.textContent.split(' ')[0]);
            b = parseInt(questionElement.textContent.split(' ')[2]);
            resultat = a + b;
            break;
            
        case 'soustraction':
            a = parseInt(questionElement.textContent.split(' ')[0]);
            b = parseInt(questionElement.textContent.split(' ')[2]);
            resultat = a - b;
            break;
            
        case 'multiplication':
            a = parseInt(questionElement.textContent.split(' ')[0]);
            b = parseInt(questionElement.textContent.split(' ')[2]);
            resultat = a * b;
            break;
    }
    
    if (reponseUtilisateur === resultat) {
        // Bonne réponse
        points += 10 + niveauActuel * 5; // Plus de points avec les niveaux plus élevés
        feedbackElement.textContent = '✅ Super! Bonne réponse!';
        feedbackElement.className = 'feedback correct';
        
        // Mettre à jour la progression
        const progression = (points / (niveauActuel * 100)) * 100;
        barreProgression.style.width = Math.min(progression, 100) + '%';
    } else {
        // Mauvaise réponse
        feedbackElement.textContent = `❌ Raté! La bonne réponse était ${resultat}`;
        feedbackElement.className = 'feedback incorrect';
    }
    
    questionEnCours = false;
    mettreAJourAffichage();
    
    // Générer une nouvelle question après un court délai
    setTimeout(() => {
        if (!questionEnCours) {
            genererQuestion();
        }
    }, 1500);
}