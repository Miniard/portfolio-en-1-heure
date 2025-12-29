/**
 * Terminal IA - Smart Response System
 * Un algorithme de réponses intelligent basé sur le pattern matching
 */

class TerminalAI {
    constructor() {
        this.outputElement = document.getElementById('terminal-output');
        this.inputElement = document.getElementById('terminal-input');
        this.context = {
            lastTopic: null,
            conversationCount: 0,
            userName: null
        };
        
        this.init();
    }
    
    init() {
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.inputElement.value.trim()) {
                this.handleInput(this.inputElement.value.trim());
                this.inputElement.value = '';
            }
        });
        
        // Focus on terminal when section is visible
        this.inputElement.focus();
    }
    
    handleInput(input) {
        // Add user message
        this.addLine('user', 'vous', input);
        
        // Process and respond
        setTimeout(() => {
            const response = this.generateResponse(input);
            this.addLine('ai', 'adam-ai', response);
            this.scrollToBottom();
        }, 500 + Math.random() * 500); // Délai réaliste
        
        this.context.conversationCount++;
    }
    
    addLine(type, prompt, text) {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = `
            <span class="prompt">${prompt}</span>
            <span class="text">${text}</span>
        `;
        this.outputElement.appendChild(line);
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    
    generateResponse(input) {
        const normalized = input.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[?!.,]/g, '');
        
        // Knowledge base avec patterns et réponses
        const responses = this.getKnowledgeBase();
        
        // Chercher la meilleure correspondance
        let bestMatch = null;
        let bestScore = 0;
        
        for (const category of responses) {
            for (const pattern of category.patterns) {
                const score = this.calculateMatchScore(normalized, pattern);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = category;
                }
            }
        }
        
        // Si un bon match est trouvé
        if (bestMatch && bestScore > 0.3) {
            this.context.lastTopic = bestMatch.topic;
            const responseList = bestMatch.responses;
            return responseList[Math.floor(Math.random() * responseList.length)];
        }
        
        // Réponses de fallback intelligentes
        return this.getFallbackResponse(normalized);
    }
    
    calculateMatchScore(input, pattern) {
        const patternWords = pattern.toLowerCase().split(' ');
        const inputWords = input.split(' ');
        
        let matches = 0;
        let totalWeight = 0;
        
        for (const pWord of patternWords) {
            const weight = pWord.length > 4 ? 2 : 1; // Mots plus longs = plus importants
            totalWeight += weight;
            
            for (const iWord of inputWords) {
                if (iWord.includes(pWord) || pWord.includes(iWord)) {
                    matches += weight;
                    break;
                }
            }
        }
        
        return totalWeight > 0 ? matches / totalWeight : 0;
    }
    
    getKnowledgeBase() {
        return [
            // === IDENTITÉ ===
            {
                topic: 'identity',
                patterns: [
                    'qui es tu', 'qui est adam', 'qui etes vous', 'cest qui',
                    'tu es qui', 'presente toi', 'parle moi de toi', 'ton nom',
                    'comment tu tappelles', 'qui est ce'
                ],
                responses: [
                    "Je suis l'IA d'Adam ! 🤖 Adam est un développeur passionné qui transforme le café en code. Il crée des applications web, des APIs, et adore résoudre des problèmes complexes.",
                    "Salut ! Je représente Adam, un dev full-stack qui vit pour coder. Il est spécialisé en JavaScript, Python, et tout ce qui touche au web moderne.",
                    "Adam, c'est un développeur créatif qui aime construire des choses utiles et belles. Et moi, je suis son assistant virtuel ici pour répondre à tes questions ! 🚀"
                ]
            },
            
            // === COMPÉTENCES ===
            {
                topic: 'skills',
                patterns: [
                    'competences', 'skills', 'tu sais faire quoi', 'technologies',
                    'langages', 'quoi coder', 'stack', 'tech stack', 'outils',
                    'frameworks', 'capable de', 'maitrises', 'connait'
                ],
                responses: [
                    "Adam maîtrise pas mal de trucs ! 💪 Frontend: React, Vue.js, TypeScript. Backend: Node.js, Python, Express, Django. DB: PostgreSQL, MongoDB. Et plein d'autres outils cool !",
                    "Côté technique, c'est du lourd : JavaScript/TypeScript en mode expert, Python pour le backend et l'IA, React/Vue pour les interfaces, et Docker/Git pour le DevOps. 🔥",
                    "Le stack préféré d'Adam ? React + Node.js + PostgreSQL. Mais il s'adapte facilement à n'importe quelle techno. Le code, c'est le code ! 😎"
                ]
            },
            
            // === PROJETS ===
            {
                topic: 'projects',
                patterns: [
                    'projets', 'portfolio', 'realise', 'cree', 'developpe',
                    'travaille sur', 'fait quoi', 'exemples', 'realisations',
                    'applications', 'sites', 'construit'
                ],
                responses: [
                    "Adam a bossé sur plein de projets cool ! Des apps web, des APIs REST, des dashboards interactifs, et même des bots Discord. Ce portfolio en est un bon exemple ! 🎨",
                    "Parmi ses projets : des plateformes e-commerce, des outils de productivité, des apps temps réel avec WebSocket, et ce terminal IA que tu utilises en ce moment ! 😄",
                    "Il a créé des trucs variés : sites vitrines, applications SaaS, outils d'automatisation, APIs... Chaque projet est une nouvelle aventure ! 🚀"
                ]
            },
            
            // === EXPERIENCE ===
            {
                topic: 'experience',
                patterns: [
                    'experience', 'travail', 'emploi', 'parcours', 'carriere',
                    'cv', 'background', 'depuis combien', 'annees', 'pro'
                ],
                responses: [
                    "Adam code depuis plusieurs années maintenant. Il a commencé par passion, puis c'est devenu une véritable expertise. Autodidacte et curieux, il apprend constamment ! 📚",
                    "Son parcours ? Une belle évolution : d'abord les bases en HTML/CSS/JS, puis les frameworks modernes, et maintenant le full-stack. Toujours en train d'apprendre ! 🎯",
                    "Il a travaillé sur des projets perso, des freelances, et des collaborations. Chaque expérience a renforcé ses compétences. Learning by doing ! 💡"
                ]
            },
            
            // === CONTACT ===
            {
                topic: 'contact',
                patterns: [
                    'contact', 'email', 'mail', 'joindre', 'contacter',
                    'embaucher', 'recruter', 'collaborer', 'travail ensemble',
                    'disponible', 'freelance', 'mission'
                ],
                responses: [
                    "Tu veux contacter Adam ? 📧 Check les liens en bas de page : GitHub, LinkedIn, ou email direct. Il répond généralement assez vite !",
                    "Pour bosser avec Adam, c'est simple : envoie-lui un message via LinkedIn ou par email. Il est toujours open pour discuter de nouveaux projets ! 🤝",
                    "Adam est disponible pour des missions freelance ou des collaborations. N'hésite pas à le contacter via les réseaux sociaux en footer ! 📬"
                ]
            },
            
            // === MOTIVATIONS ===
            {
                topic: 'motivation',
                patterns: [
                    'pourquoi dev', 'motivation', 'passion', 'aimes coder',
                    'pourquoi code', 'inspiration', 'objectifs', 'reve',
                    'ambition', 'but', 'vision'
                ],
                responses: [
                    "Adam code parce qu'il adore créer ! Le sentiment de voir une idée prendre vie en quelques lignes de code, c'est addictif. C'est comme de la magie, mais logique. ✨",
                    "La motivation ? Résoudre des problèmes et créer des choses utiles. Chaque bug fixé, chaque feature implémentée, c'est une petite victoire. 🏆",
                    "Ce qui drive Adam : l'apprentissage continu et l'impact. Coder, c'est avoir le pouvoir de construire n'importe quoi à partir de rien. C'est incroyable ! 🌟"
                ]
            },
            
            // === FORMATION ===
            {
                topic: 'education',
                patterns: [
                    'formation', 'etudes', 'diplome', 'ecole', 'universite',
                    'appris', 'cours', 'autodidacte', 'certifications'
                ],
                responses: [
                    "Adam est principalement autodidacte ! Il a appris en construisant des projets, en lisant de la doc, et en cassant (puis réparant) du code. Best way to learn! 🎓",
                    "Formation ? Un mix de ressources en ligne, de projets perso, et de pratique intensive. Les meilleurs profs : Stack Overflow et la documentation officielle ! 📖",
                    "L'apprentissage ne s'arrête jamais. Tutoriels, docs, projets open source... Adam absorbe les connaissances comme une éponge. Toujours curieux ! 🧠"
                ]
            },
            
            // === SALUTATIONS ===
            {
                topic: 'greetings',
                patterns: [
                    'salut', 'bonjour', 'hello', 'hey', 'coucou', 'yo',
                    'bonsoir', 'wesh', 'slt', 'bjr', 'hi'
                ],
                responses: [
                    "Hey ! 👋 Bienvenue sur le portfolio d'Adam. Qu'est-ce que tu veux savoir ?",
                    "Salut ! 🙌 Content de te voir ici. Pose-moi tes questions sur Adam, ses projets, ses skills...",
                    "Hello ! 😊 Je suis là pour répondre à toutes tes questions. Vas-y, je t'écoute !"
                ]
            },
            
            // === POLITESSE ===
            {
                topic: 'thanks',
                patterns: [
                    'merci', 'thanks', 'thx', 'cool', 'genial', 'super',
                    'parfait', 'nickel', 'top', 'bien joue'
                ],
                responses: [
                    "De rien ! 😊 Si t'as d'autres questions, hésite pas !",
                    "Avec plaisir ! 🙏 Je suis là pour ça. Autre chose ?",
                    "No prob ! Content d'avoir pu t'aider. 🤙"
                ]
            },
            
            // === AIDE ===
            {
                topic: 'help',
                patterns: [
                    'aide', 'help', 'comment ca marche', 'quoi demander',
                    'questions', 'commandes', 'options', 'que faire'
                ],
                responses: [
                    "Je peux répondre à plein de trucs ! 💡 Essaie : 'compétences', 'projets', 'contact', 'qui es-tu', 'expérience', 'motivation'...",
                    "Pose-moi des questions sur Adam : ses skills, ses projets, comment le contacter, son parcours... Je suis là pour ça ! 🤖",
                    "Tu peux me demander : qui est Adam, ce qu'il sait faire, ses projets, comment le joindre, ou même juste discuter ! 💬"
                ]
            },
            
            // === HUMOUR ===
            {
                topic: 'humor',
                patterns: [
                    'blague', 'drole', 'rigole', 'humour', 'joke',
                    'fun', 'marrant', 'lol', 'mdr', 'haha'
                ],
                responses: [
                    "Pourquoi les développeurs portent des lunettes ? Parce qu'ils ne voient pas C# ! 😂",
                    "Un bug entre dans un bar. Le barman dit : 'Désolé, on ne sert pas les bugs ici.' Le bug répond : 'Pas grave, je suis partout quand même.' 🐛",
                    "Combien de développeurs faut-il pour changer une ampoule ? Aucun, c'est un problème hardware ! 💡😄"
                ]
            },
            
            // === IA / TECH ===
            {
                topic: 'ai',
                patterns: [
                    'ia', 'intelligence artificielle', 'machine learning', 'ai',
                    'chatgpt', 'gpt', 'es tu une vraie ia', 'algorithme',
                    'comment tu marches', 'comment tu fonctionnes'
                ],
                responses: [
                    "Je suis un système de réponses intelligent créé par Adam ! 🤖 Pas de ML lourd ici, mais un algo de pattern matching bien pensé qui couvre plein de cas.",
                    "Techniquement, je fonctionne avec du pattern matching et une base de connaissances. Adam m'a codé pour répondre intelligemment sans dépendre d'APIs externes ! 🧠",
                    "Je suis une IA 'fait maison' ! Un algorithme qui analyse tes questions et trouve les meilleures réponses. Simple mais efficace ! 💪"
                ]
            },
            
            // === HOBBIES ===
            {
                topic: 'hobbies',
                patterns: [
                    'hobbies', 'loisirs', 'temps libre', 'interets', 'passion',
                    'fait quoi a cote', 'autre que code', 'vie perso'
                ],
                responses: [
                    "En dehors du code, Adam aime la musique, les jeux vidéo, et découvrir de nouvelles technos. Le code, c'est aussi un hobby ! 🎮🎵",
                    "Quand il ne code pas... il code autre chose ! 😄 Mais sinon : lecture, gaming, et explorer des side projects créatifs.",
                    "Les passions d'Adam : la tech évidemment, mais aussi la créativité sous toutes ses formes. Un dev qui aime designer aussi ! 🎨"
                ]
            },
            
            // === CONSEILS ===
            {
                topic: 'advice',
                patterns: [
                    'conseil', 'conseillerais', 'apprendre a coder', 'devenir dev',
                    'comment commencer', 'debuter', 'par ou commencer'
                ],
                responses: [
                    "Le conseil d'Adam : commence par construire des trucs ! 🔨 Choisis un petit projet et lance-toi. Tu apprendras en chemin.",
                    "Pour débuter : HTML/CSS/JavaScript. Puis un framework. Mais surtout : pratique, pratique, pratique ! Les projets > la théorie. 💻",
                    "Le secret ? La curiosité et la persévérance. Le code, ça s'apprend en cassant des trucs et en les réparant. N'aie pas peur d'échouer ! 🚀"
                ]
            },
            
            // === AGE ===
            {
                topic: 'age',
                patterns: [
                    'quel age', 'age', 'ans', 'vieux', 'jeune', 'annee de naissance'
                ],
                responses: [
                    "L'âge, c'est juste un nombre ! 😄 Ce qui compte, c'est les skills et la passion. Et ça, Adam en a à revendre !",
                    "Adam est dans la fleur de l'âge pour un dev : assez d'expérience pour être efficace, assez jeune pour rester curieux ! 🌟",
                    "Plutôt que l'âge, check ses années d'expérience en code. C'est ça qui compte vraiment ! 💪"
                ]
            },
            
            // === LOCALISATION ===
            {
                topic: 'location',
                patterns: [
                    'ou habites', 'localisation', 'ville', 'pays', 'france',
                    'tu vis ou', 'ou es tu', 'remote', 'teletravail'
                ],
                responses: [
                    "Adam travaille principalement en remote, donc la localisation importe peu ! 🌍 Le code voyage partout.",
                    "Basé en France, mais le remote c'est la vie ! Il peut collaborer avec des équipes du monde entier. 🇫🇷🌐",
                    "Le télétravail, c'est le game. Adam bosse d'où il veut, quand il veut. La liberté du dev ! 💻☕"
                ]
            },
            
            // === TARIFS ===
            {
                topic: 'pricing',
                patterns: [
                    'tarif', 'prix', 'cout', 'combien', 'budget', 'tjm',
                    'facturer', 'tarification', 'devis'
                ],
                responses: [
                    "Les tarifs dépendent du projet ! 💰 Le mieux c'est de contacter Adam directement pour discuter de ton besoin et avoir un devis.",
                    "Chaque projet est unique, donc les prix varient. Envoie un message à Adam avec les détails et il te fera une proposition ! 📝",
                    "Pour un devis, décris ton projet à Adam via les liens de contact. Il te répondra avec une estimation adaptée ! 🤝"
                ]
            },
            
            // === EASTER EGG ===
            {
                topic: 'easteregg',
                patterns: [
                    '42', 'sens de la vie', 'secret', 'konami', 'easter egg',
                    'surprise', 'cache', 'hidden'
                ],
                responses: [
                    "🎉 Tu as trouvé un easter egg ! Adam aime cacher des surprises dans son code. Keep exploring ! 🔍",
                    "42 ! La réponse à la grande question sur la vie, l'univers et le reste. Tu connais tes classiques ! 🌌",
                    "Psst... Tu es curieux, j'aime ça ! 🕵️ Les meilleurs devs sont ceux qui explorent. Continue comme ça !"
                ]
            }
        ];
    }
    
    getFallbackResponse(input) {
        const fallbacks = [
            "Hmm, je ne suis pas sûr de comprendre. 🤔 Essaie de reformuler ou tape 'aide' pour voir ce que je peux faire !",
            "Question intéressante ! Mais je n'ai pas la réponse. Essaie 'compétences', 'projets', ou 'contact'. 💡",
            "Je suis encore en train d'apprendre ! 🤖 Pour l'instant, je réponds mieux aux questions sur Adam, ses skills et ses projets.",
            "Pas compris celle-là ! 😅 Mais pose-moi des questions sur Adam, je suis expert en ça !",
            "404 - Réponse non trouvée ! 😄 Mais sérieusement, essaie 'aide' pour voir mes capacités."
        ];
        
        // Réponses contextuelles basées sur le dernier sujet
        if (this.context.lastTopic) {
            const contextual = {
                'skills': "Tu veux en savoir plus sur une techno en particulier ? Ou peut-être voir ses projets ?",
                'projects': "Si tu veux plus de détails sur un projet spécifique, contacte Adam directement !",
                'contact': "N'hésite vraiment pas à le contacter, il est super réactif ! 📧"
            };
            
            if (contextual[this.context.lastTopic] && Math.random() > 0.5) {
                return contextual[this.context.lastTopic];
            }
        }
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.terminalAI = new TerminalAI();
});

