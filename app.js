// Importation des dépendances
const fs = require('fs')
const qrcode = require('qrcode-terminal')
const { Client, LegacySessionAuth, MessageMedia } = require('whatsapp-web.js')

// Importation des données
const articles = require('./data/boutique/articles.json')
const dataPerso = require('./data/fiches/dataPerso.json')
const comptes = require('./data/banque/comptes.json')
const dataTeamClassement = require('./data/classement/dataTeamClassement.json')
const dataPersoClassement = require('./data/classement/dataPersoClassement.json')

// Importation des bdd prime
const persoPrime = require('./neon/fiches/persoPrime.json')

// Déclaration des variables de session 120363023938067293@g.us
const SESSION_FILE_PATH = './privateFiles/session.json'
let bot
let session_data

let restreints = {
    groupeP: [],
    neonPrime: [],
    bdd: [],
    boutique: [],
    all: []
}
let boutiquiers = [33615641467, 234844347013, 22961809807]
let banquiers = [33615641467, 22577766701]

/*
    * FONCTION D'OUVERTURE DES FONCTIONNALITES *
    * Présence de la variable de session
*/
const withSession = () => {
    // Récupération de la variable de session
    session_data = require(SESSION_FILE_PATH);

    // Initialisation de l'objet Client : BOT
    bot = new Client({
        authStrategy: new LegacySessionAuth({
            session: session_data
        })
    })

    // Démarrage de l'utilisation du bot
    bot.on('ready', () => {
        // Notification de mise en place du bot
        console.log('---Le Bot est prêt !')

        // Gestion de la communauté dans le groupe principal
        botSNG('33615641467-1575229409@g.us')

        // Gestion du classement shinobi à SNG
        botShinobi('33615641467-1575229409@g.us')

        // Gestion des transactions de la banque/boutique ninja
        botSNG_Boutique('237698731569-1589034114@g.us')

        // Gestion de la base de données
        botSNG('33615641467-1622481565@g.us')
        botDB('33615641467-1622481565@g.us')

        // Gestion des bannissements
        bannissement('33615641467-1575229409@g.us')
        bannissement('237698731569-1589034114@g.us')
        bannissement('33615641467-1622481565@g.us')
        bannissement('120363039858602742@g.us')


        // Other groups
        // botSNG('237696813190-1632689408@g.us')
        botShinobi('237696813190-1632689408@g.us')

        // Neon test
        botShinobi('120363023938067293@g.us')
        botPrime('120363023938067293@g.us')
        botPrime('120363020752825535@g.us')
        bannissement('120363023938067293@g.us')

        // sendMessage('22997609224@c.us', 'Test de\n\n messages\n sur plusieurs lignes')

        // Test de récupération de tous les messages
        // listenAllChat()
    })

    // Gestion d'erreur d'authentification
    bot.on('auth_failure', () => {
        console.log('Une erreur d\'authentification a été détectée !!')
    })

    // Initialisation du bot
    bot.initialize()
}

/*
    * FONCTION D'OUVERTURE DES FONCTIONNALITES *
    * Création de la variable de session en son absence
*/
const withOutSession = () => {
    // Notification d'absence de variable de session
    console.log('Absence de variable de session')

    // Initialisation de l'objet Client : BOT
    bot = new Client()

    // Ecoute de l'évènement QR Code
    bot.on('qr', qr => {
        // Génération du QR Code
        qrcode.generate(qr, {small: true});
    })

    // Création de la variable de session par authentification
    bot.on('authenticated', (session) => {
        // Enregistrement de la variable de session
        session_data = session;
        // Création du fichier json dans lequel le stocker définitivement
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.error(err);
            }
        });
    })

    // Initialisation du bot
    bot.initialize()
}

/*
    * FONCTION D'ECOUTE DE TOUS LES NOUVEAUX MESSAGES *
    * Récupération de l'id de l'expéditeur et de son message
*/
const listenAllChat = () => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Affichage des composants du message
        console.log(from + ' ' + to + ' ' + body)
    })
}

/*
    * FONCTION D'ECOUTE DE TOUS LES NOUVEAUX MESSAGES *
    * Récupération de l'id de l'expéditeur et de son message
*/
const sendMessage = (to, msg) => {
    bot.sendMessage(to, msg)
}

// Liste des articles
const listeArticles = () => {
    // Coffre des articles
    let lesArticles = '╔══════════════════════════╗\n '
    lesArticles +=    '  𝐀𝐑𝐓𝐈𝐂𝐋𝐄𝐒 𝐃𝐄 𝐋𝐀 𝐁𝐎𝐔𝐓𝐈𝐐𝐔𝐄 𝐍𝐈𝐍𝐉𝐀\n'
    lesArticles +=    '╚══════════════════════════╝\n\n'

    // Boucle de parcours des articles
    articles.forEach(article => {
        // Incrémentation de l'article
        lesArticles += `📌 *A${article.id}*. ${article.name}\n ➤ Prix : \`\`\`${article.prix}\`\`\` M$`

        // Implémentation de la quantité de stock disponible
        if (article.illimite)
        {
            // Quantité disponible illimitée
            lesArticles += `  ➤ Disponible\n\n`
        } else
        {
            // Vérification de la disponiblité
            if (article.statut)
            {
                // Quantité disponible limitée
                lesArticles += `  ➤ ${article.quantite} disponible(s)\n\n`
            } else
            {
                // Quantité indisponible
                lesArticles += `  ➤ Indisponible\n\n`
            }
        }
    })

    // Récupération de la liste des articles
    return lesArticles
}

/*
    * FONCTION D'ECOUTE DE TOUS LES NOUVEAUX MESSAGES *
    * Récupération de l'id de l'expéditeur et de son message
*/
const sendMessageTest = (ganko) => {
    // Envoi du premier message
    sendMessage(ganko, 'Yo! J\'suis *Riky Bot* !')
    // Demande de question
    sendMessage(ganko, 'Paraît-il que tu fais du RP à SNG. Quel est ton perso ?')

    bot.on('message', (msg) => {
        const { from, to, body } = msg

        if (from == ganko && to == '33615641467@c.us')
        {
            // Affichage du message dans la console
            console.log(body)

            // Conditionnement des réponses
            switch (body.toLowerCase()) {
                case 'ganko':
                    sendMessage(ganko, 'Woah! Il doit être puissant, je suppose. Quelle est son affinité ?')
                    break;
                case 'jiton':
                    sendMessage(ganko, 'Hum... Une maîtrise du *sable*, pas vrai ?')
                    break;
                case 'oui':
                    sendMessage(ganko, 'Je le savais! Dis moi, tu aimerais participer à mon développement ? ça m\'aiderait à être plus humain, tu sais ?')
                    break;
                case 'je le veux':
                    sendMessage(ganko, 'Merci beaucoup! Je suis si content...')
                    break;
                case 'non merci':
                    sendMessage(ganko, 'Oh zut! Ce n\'est pas grave. Merci quand-même.')
                    break;
                default:
                    sendMessage(ganko, 'Désolé mais je ne comprends pas. Essaie avec une réponse avec un seul mot stp.')
                    break;
            }
        }
    })
}

const sendMessageTestNeon = (neon) => {
    bot.on('message_create', (msg) => {
        const { from, to, body } = msg

        console.log(body)

        if ((from == neon && to == '33615641467@c.us') || (from == '33615641467@c.us' && to == neon))
        {
            // Conditionnement des réponses
            switch (body)
            {
                case '! Tagar':
                    // Récupération de l'image de l'avatar
                    const sourceImg = './assets/images/avatars/tagar_1.jpeg'
                    sendImageAvatar(sourceImg, msg)
                    break;
                case '> tagar':
                    // Récupération de l'image de l'avatar
                    const sourceImg2 = './assets/images/avatars/tagar_2.jpeg'
                    sendImageAvatar(sourceImg2, msg)
                    break
            }
        }
    })
}

const fuin = async(msg) => {
    // Récupération du membre à bannir
    const membreBan = await msg.getMentions()

    // Variable de vérification
    let trouve = false
    
    if (restreints.all.length != 0)
    {
        // Vérification de la liste des bannis
        restreints.all.forEach(membre => {
            if (membre == membreBan[0].number)
            {
                trouve = true
            }
        })

        // Vérification et traitement
        if (!trouve)
        {
            // Bannissement
            restreints.all.push(membreBan[0].number)
            // Notification de bannissement
            msg.reply('```Membre scellé avec succès !```')
        } else
        {
            // Notification
            msg.reply('```Le membre a déjà été banni !```')
        }
    } else 
    {
        // Bannissement
        restreints.all.push(membreBan[0].number)
        // Notification de bannissement
        msg.reply('```Membre scellé avec succès !```')
    }
}

const kai = async(msg) => {
    // Récupération du membre à bannir
    const membreBan = await msg.getMentions()

    // Variable de vérification
    let kai = false
    
    if (restreints.all.length != 0)
    {
        // Vérification de la liste des bannis
        for (let index = 0; index < restreints.all.length; index++)
        {
            if (restreints.all[index] == membreBan[0].number)
            {
                // Déscellement
                restreints.all.splice(index, 1)
                kai = true
            }
        }

        // Vérification et traitement
        if (kai)
        {
            // Notification de bannissement
            msg.reply('```Rupture du sceau !```')
        } else
        {
            // Notification
            msg.reply('```Le membre n\'a déjà été scellé !```')
        }
    }
}

/*
    * FONCTION DE GESTION DES BANISSEMENTS' *
    * Ajout des bannis et supression de la liiste des bannis
*/
const bannissement = (groupe) => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Tri des requêtes au bot (from == boutiqueNina) 
        if ((from == '33615641467@c.us') && (to == groupe))
        {
            // Récupération des infos de traitement
            const indice = body.substr(0, 1)
        
            // Vérification de la présence de requête
            if (indice == '*')
            {
                // Détection de la requête
                if (body.substr(1, 5) == 'fuin*')
                {
                    // Requête de scellement
                    fuin(msg)
                } else if (body.substr(1, 4) == 'kai*')
                {
                    // Requête de déscellement
                    kai(msg)
                }
            }
        }
    })
}

const recup = async(msg) => {
    const author = await msg.getContact()
    console.log(author.number)
}

/*
    * MENU D'OPTION DE LA BOUTIQUE NINJA *
    * Partie initiale
*/
const botSNG_Boutique = (boutiqueNina) => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Tri des requêtes au bot
        if ((from == boutiqueNina) || ((from == '33615641467@c.us') && (to == boutiqueNina)))
        {
            // Récupération des infos de traitement
            const indice = body.substr(0, 1)
        
            // Vérification de la présence de requête
            if (indice == '>')
            {
                // Variable de vérification du statut de banissement du membre
                let banni = null

                // Requête de vérification
                autorisation(msg, 'groupeP').then(val => {
                    // Récupération de la réponse d'authentification
                    banni = val.valueOf()

                    // Vérification et disposition des règles
                    if (!banni)
                    {
                        // Message du menu de la BOUTIQUE NINJA
                        let message = `*Bienvenu(e) à la BOUTIQUE NINJA !*\n\n🥷🏽 _Que désirez-vous, cher(e) client(e) ?_\n\n`
                        message += `⭕️ *>Liste* : voir la liste des articles\n`
                        message += `⭕️ *>Compte* : voir mon solde bancaire\n\n`
                        message += `⭕️ *>Commande* : effectuer des achats multiples\n`
                        message += `\`\`\`A<id> : 00\`\`\`\n`
                        message += `\`\`\`A<id> : 00\`\`\`\n`
                        message += `\`\`\`Nom du Perso\`\`\`\n\n`
                        message += `⭕️ *>Achat A<id>* : effectuer un achat unique\n`
                        message += `\`\`\`00\`\`\`\n`
                        message += `\`\`\`Nom du Perso\`\`\`\n\n`
                        message += '*N.B* : Tapez la commande correspondant à votre opération.\n*>* En cas d\'une commande ou d\'un achat, sauter une ligne après une requête sauf entre les articles d\'une commande.'
                        
                        // body.substr(1, 5).toLowerCase() == 'achat'
                        if (body.substr(1, 5).toLowerCase() == 'achat')
                        {
                            // Récupération des lignes de l'achat
                            let transaction = body.split('\n')

                            //  Récupération de la quantité
                            const quantite = parseInt(transaction[2])
                            if ((quantite != null) && (quantite != ''))
                            {
                                console.log(quantite)
                                transactionAchat(quantite, msg, transaction)
                            }
                        } else if (body.substr(1, 8).toLowerCase() == 'commande')
                        {
                            // Récupération des lignes de l'achat
                            let transaction = body.split('\n')
                            // Préparation de la commande
                            transactionCommande(msg, transaction)
                        } else if (body.substr(1, 11).toLowerCase() == 'transaction')
                        {
                            // Vérification de l'autorisation
                            boutiquier(msg).then(val => {
                                const autorisation = val.valueOf()

                                if (autorisation)
                                {
                                    let client
                                    let trouve = false
                                    const requeteVirement = body.split('\n')
                                    console.log('Membre à actualiser : ' + requeteVirement[2])
                                    comptes.forEach(compte => {
                                        if (compte.avatar == requeteVirement[2])
                                        {
                                            compte.solde += parseInt(requeteVirement[0].substr(13))
                                            trouve = true
                                            client = compte.avatar
                                        }
                                    })

                                    if (trouve)
                                    {
                                        // Notification d'actualisation
                                        msg.reply('🥷🏽 Compte de *' + client + '* actualisé !')
                                        // Mise à jour du compte
                                        mAjComptePerso()
                                    } else
                                    {
                                        // Notification d'absence du compte
                                        msg.reply('🥷🏽 Compte non disponible !')
                                    }
                                } else
                                {
                                    msg.reply('🥷🏽 *Mouf !*')
                                }
                            })
                        } else if (body.substr(1, 8).toLowerCase() == 'virement')
                        {
                            // Vérification de l'autorisation
                            banquier(msg).then(val => {
                                const autorisation = val.valueOf()

                                if (autorisation)
                                {
                                    let client
                                    let trouve = false
                                    const requeteVirement = body.split('\n')
                                    console.log('Membre à actualiser : ' + requeteVirement[2])
                                    comptes.forEach(compte => {
                                        if (compte.avatar == requeteVirement[2])
                                        {
                                            compte.solde += parseInt(requeteVirement[0].substr(10))
                                            trouve = true
                                            client = compte.avatar
                                        }
                                    })

                                    if (trouve)
                                    {
                                        // Notification de virement
                                        msg.reply('🥷🏽 Virement effectué pour *' + client + '* !')
                                        // Mise à jour du compte
                                        mAjComptePerso()
                                    } else
                                    {
                                        // Notification d'absence du compte
                                        msg.reply('🥷🏽 Virement impossible ! Compte non trouvé.')
                                    }
                                } else
                                {
                                    msg.reply('🥷🏽 *Mouf !*')
                                }
                            })
                        } else if (body.substr(0, 16) == '>>> *NEW COMPTE*')
                        {
                            if ((from == '33615641467@c.us') && (to == boutiqueNina))
                            {
                                // Création de la fiche perso
                                newCompteSNG(msg)
                            } else
                            {
                                msg.reply('🥷🏽 *Genjutsu - kai !*')
                            }
                        } else if ((from == '33615641467@c.us') && (to == boutiqueNina) && (body.substr(1, 7).toLowerCase() == 'accueil')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split(' ')
                            const newMembre = parseInt(num[1])

                            if (newMembre > 0)
                            {
                                // Ajout du nouveau membre
                                addMembre(newMembre, msg)
                            } else
                            {
                                // Log d'ajout impossible
                                console.log('Numéro invalide')
                            }
                        } else if ((from == '33615641467@c.us') && (to == boutiqueNina) && (body.substr(1, 9).toLowerCase() == 'desertion')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split('@')
                            const newMembre = parseInt(num[1])
                            if (newMembre > 0)
                            {
                                // Supression d'un membre
                                supMembre(newMembre, msg)
                            } else
                            {
                                // Log de suppression impossible
                                console.log('Numéro invalide')
                            }
                        } else
                        {
                            // Récupération de la requête
                            const requete = body.substr(1).toLowerCase()
                            // Vérification
                            switch (requete)
                            {
                                case 'menu':
                                    // Affichage des commandes
                                    sendMessage(boutiqueNina, message)
                                    break
                                
                                case 'liste':
                                    // Affichage de la liste des articles
                                    sendMessage(boutiqueNina, listeArticles())
                                    break

                                case 'compte':
                                    // Requête d'affichage du compte
                                    selectCompte(msg, boutiqueNina)
                                    // Affichage de la valeur du compte
                                    // msg.reply('🥷🏽 Vous êtes actuellement *fauché* !')
                                    break

                                case 'bourses ninja':
                                    // Récupération de la fiche des comptes
                                    afficherComptes(msg)
                                    break
                            
                                default:
                                    // Notification de gestion d'erreur
                                    msg.reply('⛔️ Veuillez vérifier la requête et réessayer...')
                                    break
                            }
                        }
                    }
                })
            }
        }
    })
}

/*
    * TRANSACTION D'ACHAT UNIQUE EN BOUTIQUE *
    * Détection du compte du perso
*/
const transactionAchat = (quantite, msg, transaction) => {
    let client = false
    // Vérification
    if (quantite > 0)
    {
        comptes.forEach(compte => {
            if (compte.avatar == transaction[4])
            {
                // Traitement de la requête d'achat
                const id_article = parseInt(transaction[0].substr(8))

                // Variable de détection
                let trouveArticle = false
                
                // Parcours des articles
                articles.forEach(article => {
                    if ((article.id == id_article) && article.statut)
                    {
                        // Article trouvé
                        trouveArticle = true

                        // Récupération des identifiants du membre concerné
                        console.log('DEBUT de la transaction !')

                        // Mise à jour dans la fiche perso
                        let trouve = false
                        dataPerso.forEach(perso => {
                            // Vérification de la correspondance au client
                            if (perso.id == compte.id)
                            {
                                if (compte.solde >= (article.prix * quantite))
                                {
                                    // Transaction quand le compte est favorable à la transaction
                                    if (article.illimite)
                                    {
                                        // Variable de vérification de l'équipement
                                        let equipementTrouve = false
                                        // Vérification de la présence de l'article
                                        perso.equipements.forEach(equipement => {
                                            if (equipement.libelle == article.name)
                                            {
                                                // Modification de la quantité de l'article
                                                equipement.quantite += quantite
                                                // Log de transaction
                                                console.log('Mise à jour de la fiche perso de '+ perso.name)
                                                // Mise à jour du compte
                                                compte.solde -= article.prix * quantite
                                                // Validation de la transation
                                                validiteTransactionAchat('valide', compte, article, quantite, msg)
                                                // Mention
                                                equipementTrouve = true
                                            }
                                        })

                                        // Traitement si l'article n'était pas encore présent
                                        if (!equipementTrouve)
                                        {
                                            // Ajout de l'article dans la liste des équipements
                                            perso.equipements.push({
                                                libelle: article.name,
                                                quantite: quantite,
                                                principal: false,
                                                rouleau: false,
                                                sousEquiements: []
                                            })
                                            // Log de transaction
                                            console.log('Mise à jour de la fiche perso de '+ perso.name)
                                            // Mise à jour du compte
                                            compte.solde -= article.prix * quantite
                                            // Validation de la transation
                                            validiteTransactionAchat('valide', compte, article, quantite, msg)
                                        }

                                        // Mise à jour de la fiche et du compte
                                        mAjFichePerso()
                                        mAjComptePerso()
                                    } else
                                    {
                                        // Vérification de la quantité abordable
                                        if (quantite <= article.quantite)
                                        {
                                            // Transaction enregistrée
                                            article.quantite -= quantite

                                            // Variable de vérification de l'équipement
                                            let equipementTrouve = false
                                            // Vérification de la présence de l'article
                                            perso.equipements.forEach(equipement => {
                                                if (equipement.libelle == article.name)
                                                {
                                                    // Modification de la quantité de l'article
                                                    equipement.quantite += quantite
                                                    // Log de transaction
                                                    console.log('Mise à jour de la fiche perso de '+ perso.name)
                                                    // Mise à jour du compte
                                                    compte.solde -= article.prix * quantite
                                                    // Validation de la transation
                                                    validiteTransactionAchat('valide', compte, article, quantite, msg)
                                                    // Mention
                                                    equipementTrouve = true
                                                }
                                            })

                                            // Traitement si l'article n'était pas encore présent
                                            if (!equipementTrouve)
                                            {
                                                // Ajout de l'article dans la liste des équipements
                                                perso.equipements.push({
                                                    libelle: article.name,
                                                    quantite: quantite,
                                                    principal: false,
                                                    rouleau: false,
                                                    sousEquiements: []
                                                })
                                                // Log de transaction
                                                console.log('Mise à jour de la fiche perso de '+ perso.name)
                                                // Mise à jour du compte
                                                compte.solde -= article.prix * quantite
                                                // Validation de la transation
                                                validiteTransactionAchat('valide', compte, article, quantite, msg)
                                            }

                                            // Modification en cas d'achat d'un article unique
                                            if (article.quantite == 0)
                                            {
                                                // Changement du statut en acheté
                                                article.statut = false
                                            }

                                            // Mise à jour de la fiche et du compte
                                            mAjFichePerso()
                                            mAjComptePerso()
                                        } else
                                        {
                                            // Notification de transation impossible car quantité élevée
                                            validiteTransactionAchat('quantite', compte, article, quantite, msg)
                                        }
                                    }
                                } else
                                {
                                    // NOtification en cas de compte insuffisant
                                    validiteTransactionAchat('solde', compte, article, quantite, msg)
                                }

                                // Mention de la correspondance
                                trouve = true
                            }
                        })

                        // Vérification de l'absence de la fiche du client
                        if (!trouve)
                        {
                            // Notification
                            msg.reply('🥷🏽 Navré, mais votre fiche n\'est pas présente dans la base de données.')
                        }
                    }
                })

                // Vérification en cas d'absence de l'article
                if (!trouveArticle)
                {
                    // Transaction impossible
                    msg.reply('♨️ *TRANSACTION IMPOSSIBLE* ♨️\n\n🥷🏽 L\'article que vous désirez n\'existe pas !')
                }
                
                // Mention de présence du compte client
                client = true
            }
        })

        // Vérification de l'absence du compte du client
        if (!client)
        {
            // Notification en cas d'absence du compte dans la boutique ninja
            msg.reply('🥷🏽 Votre compte n\'existe pas en Boutique.')
        }
    }else
    {
        // Notification en cas d'absence de la quantité d'article
        msg.reply('🥷🏽 Quantité indisponible. Veuillez vérifier votre requête...')
    }
}

const validiteTransactionAchat = (statut, client, article, quantiteArticle, requete) => {
    switch (statut)
    {
        case 'solde':
            // Transaction invalide
            let transationImpossibleS = '♨️ *TRANSACTION IMPOSSIBLE* ♨️\n\n'
            transationImpossibleS += `_${client.grade}_ *${client.avatar}*, vous avez passé une commande unique détaillée ci-dessous :\n\n`
            transationImpossibleS += '▫️Nom de l\'article : _' + article.name + '_\n'
            transationImpossibleS += '▫️Prix unitaire : _' + article.prix + ' M$_\n'
            transationImpossibleS += '▫️Quantité : _' + quantiteArticle + '_\n\n'
            transationImpossibleS += 'Votre solde est insuffisant pour réaliser cette transaction de *' + article.prix * quantiteArticle + ' M$*.\n\n'
            transationImpossibleS += '\`\`\`Bourse Ninja :\`\`\` *' + client.solde + ' M$*\n\n'
            transationImpossibleS += '🥷🏽 Merci et à bientôt !'

            // Envoie de la fin de transaction
            requete.reply(transationImpossibleS)
            break

        case 'quantite':
            // Transaction invalide
            let transationImpossibleQ = '♨️ *TRANSACTION IMPOSSIBLE* ♨️\n\n'
            transationImpossibleQ += `_${client.grade}_ *${client.avatar}*, vous avez passé une commande unique détaillée ci-dessous :\n\n`
            transationImpossibleQ += '▫️Nom de l\'article : _' + article.name + '_\n'
            transationImpossibleQ += '▫️Prix unitaire : _' + article.prix + ' M$_\n'
            transationImpossibleQ += '▫️Quantité : _' + quantiteArticle + '_\n\n'
            transationImpossibleQ += 'La quantité demandée est au dessus des réserves de la boutique : *' + article.quantite + '*.\n\n'
            transationImpossibleQ += '🥷🏽 Merci et à bientôt !'

            // Envoie de la fin de transaction
            requete.reply(transationImpossibleQ)
            break
    
        default:
            // Transation valide
            let transationReussie = '♨️ *TRANSACTION EFFECTUEE* ♨️\n\n'
            transationReussie += `_${client.grade}_ *${client.avatar}*, vous avez passé une commande unique détaillée ci-dessous :\n\n`
            transationReussie += '▫️Nom de l\'article : _' + article.name + '_\n'
            transationReussie += '▫️Prix unitaire : _' + article.prix + ' M$_\n'
            transationReussie += '▫️Quantité : _' + quantiteArticle + '_\n\n'
            transationReussie += 'Cette transaction est validée pour un montant total de *' + article.prix * quantiteArticle + ' M$*.\n\n'
            transationReussie += '\`\`\`Bourse Ninja :\`\`\` *' + client.solde + ' M$*\n\n'
            transationReussie += '🥷🏽 Merci et à bientôt !'

            // Envoie de la fin de transaction
            requete.reply(transationReussie)
            break
    }
}

/*
    * TRANSACTION D'ACHAT MULTIPLE EN BOUTIQUE *
    * Détection du compte du perso
*/
const transactionCommande = (msg, transaction) => {
    // Variables de transaction
    let client = false
    let commande = []
    let commandeValide = []

    // Détection des commandes
    let i = 2
    while ((transaction[i] != '') && (transaction[i].substr(0, 1) == 'A'))
    {
        // Récupération de l'article et de sa quantité
        const detailAchat = transaction[i].split(' : ')
        const id_article = parseInt(detailAchat[0].substr(1))
        const quantite = parseInt(detailAchat[1].substr(0))

        // Vérification de l'intégrité de l'article
        if ((id_article != 0) && (quantite > 0))
        {
            // Ajout à la liste des commandes
            commande.push({
                article_id: id_article,
                article_quantite: quantite
            })
        }
        // Indentation
        i++
    }

    // Vérification
    comptes.forEach(compte => {
        if (compte.avatar == transaction[(transaction.length - 1)])
        {
            commande.forEach(achat => {
                // Parcours des articles
                articles.forEach(article => {
                    if ((article.id == achat.article_id) && article.statut)
                    {
                        // Récupération des identifiants du membre concerné
                        console.log('DEBUT de la transaction !')

                        // Mise à jour dans la fiche perso
                        let trouve = false
                        dataPerso.forEach(perso => {
                            // Vérification de la correspondance au client
                            if (perso.id == compte.id)
                            {
                                // Valeur de l'achat
                                const valeurAchat = article.prix * achat.article_quantite
                                if (compte.solde >= valeurAchat)
                                {
                                    // Transaction quand le compte est favorable à la transaction
                                    if (article.illimite)
                                    {
                                        // Variable de vérification de l'équipement
                                        let equipementTrouve = false
                                        // Vérification de la présence de l'article
                                        perso.equipements.forEach(equipement => {
                                            if (equipement.libelle == article.name)
                                            {
                                                // Modification de la quantité de l'article
                                                equipement.quantite += achat.article_quantite
                                                // Log de transaction
                                                console.log('Mise à jour de la fiche perso de '+ perso.name)
                                                // Mise à jour du compte
                                                compte.solde -= article.prix * achat.article_quantite
                                                // Mention
                                                equipementTrouve = true
                                                // Ajout à la liste des articles validés
                                                commandeValide.push({
                                                    nameArticle: article.name,
                                                    quantiteArticle: achat.article_quantite,
                                                    valeur: valeurAchat
                                                })
                                            }
                                        })

                                        // Traitement si l'article n'était pas encore présent
                                        if (!equipementTrouve)
                                        {
                                            // Ajout de l'article dans la liste des équipements
                                            perso.equipements.push({
                                                libelle: article.name,
                                                quantite: achat.article_quantite,
                                                principal: false,
                                                rouleau: false,
                                                sousEquiements: []
                                            })
                                            // Log de transaction
                                            console.log('Mise à jour de la fiche perso de '+ perso.name)
                                            // Mise à jour du compte
                                            compte.solde -= article.prix * achat.article_quantite
                                            // Ajout à la liste des articles validés
                                            commandeValide.push({
                                                nameArticle: article.name,
                                                quantiteArticle: achat.article_quantite,
                                                valeur: valeurAchat
                                            })
                                        }
                                    } else
                                    {
                                        // Vérification de la quantité abordable
                                        if (achat.article_quantite <= article.quantite)
                                        {
                                            // Transaction enregistrée
                                            article.quantite -= achat.article_quantite

                                            // Variable de vérification de l'équipement
                                            let equipementTrouve = false
                                            // Vérification de la présence de l'article
                                            perso.equipements.forEach(equipement => {
                                                if (equipement.libelle == article.name)
                                                {
                                                    // Modification de la quantité de l'article
                                                    equipement.quantite += achat.article_quantite
                                                    // Log de transaction
                                                    console.log('Mise à jour de la fiche perso de '+ perso.name)
                                                    // Mise à jour du compte
                                                    compte.solde -= article.prix * achat.article_quantite
                                                    // Mention
                                                    equipementTrouve = true
                                                    // Ajout à la liste des articles validés
                                                    commandeValide.push({
                                                        nameArticle: article.name,
                                                        quantiteArticle: achat.article_quantite,
                                                        valeur: valeurAchat
                                                    })
                                                }
                                            })

                                            // Traitement si l'article n'était pas encore présent
                                            if (!equipementTrouve)
                                            {
                                                // Ajout de l'article dans la liste des équipements
                                                perso.equipements.push({
                                                    libelle: article.name,
                                                    quantite: achat.article_quantite,
                                                    principal: false,
                                                    rouleau: false,
                                                    sousEquiements: []
                                                })
                                                // Log de transaction
                                                console.log('Mise à jour de la fiche perso de '+ perso.name)
                                                // Mise à jour du compte
                                                compte.solde -= article.prix * achat.article_quantite
                                                // Ajout à la liste des articles validés
                                                commandeValide.push({
                                                    nameArticle: article.name,
                                                    quantiteArticle: achat.article_quantite,
                                                    valeur: valeurAchat
                                                })
                                            }

                                            // Modification en cas d'achat d'un article unique
                                            if (article.quantite == 0)
                                            {
                                                // Changement du statut en acheté
                                                article.statut = false
                                            }
                                        }
                                    }
                                }

                                // Mention de la correspondance
                                trouve = true
                            }
                        })

                        // Vérification de l'absence de la fiche du client
                        if (!trouve)
                        {
                            // Notification
                            msg.reply('🥷🏽 Navré, mais votre fiche n\'est pas présente dans la base de données.')
                        }
                    }
                })
            })

            // Vérification de la mise à jour du compte et de la fiche perso
            if (commandeValide.length > 0)
            {
                // Validation de la transation
                validiteTransactionCommande(compte, commandeValide, msg)

                // Mise à jour de la fiche et du compte
                mAjFichePerso()
                mAjComptePerso()
            }else
            {
                // Transaction impossible
                msg.reply('♨️ *TRANSACTION IMPOSSIBLE* ♨️\n\nVotre commande n\'a pas pu être prise en compte. Veuillez vérifier la disposition de la commande et votre compte.\n\n🥷🏽 Merci.')
            }
            
            // Mention de présence du compte client
            client = true
        }
    })

    // Vérification de l'absence du compte du client
    if (!client)
    {
        // Notification en cas d'absence du compte dans la boutique ninja
        msg.reply('🥷🏽 Votre compte n\'existe pas en Boutique.')
    }
}
const validiteTransactionCommande = (client, commande, requete) => {
    // Total d'achat
    let total = 0

    // Transation valide
    let transationReussie = '♨️ *TRANSACTION EFFECTUEE* ♨️\n\n'
    transationReussie += `_${client.grade}_ *${client.avatar}*, vous avez passé une commande d'articles ci-dessous cités :\n\n`
    // Parcours des articles commandés
    commande.forEach(achat => {
        // Affichage de l'achat valide
        transationReussie += '▫️' + achat.quantiteArticle + ' ' + achat.nameArticle + ' : _' + achat.valeur + ' M$_\n'
        // Ajout au prix total de la commande
        total += achat.valeur
    })
    transationReussie += '\nCette transaction est validée pour un montant total de *' + total + ' M$*.\n\n'
    transationReussie += '\`\`\`Bourse Ninja :\`\`\` *' + client.solde + ' M$*\n\n'
    transationReussie += '🥷🏽 Merci et à bientôt !'

    // Envoie de la fin de transaction
    requete.reply(transationReussie)
}

/*
    * AUTORISATION DE L'UTILISATION DU BOT *
    * Variation suivant les sections
*/
const autorisation = async(msg, section) => {
    // Récupération du numéro
    const membreId = await msg.getContact()
    // Variable de vérification
    let banni = false

    // Vérification parmi les membres bannis
    if (restreints.all.length != 0)
    {
        restreints.all.forEach(membre => {
            if (membre == membreId.number)
            {
                // Membre banni de l'utilisation du bot
                banni = true
            }
        })
    }

    // Vérification des bannis parmi de la section
    if (restreints[section].length != 0)
    {
        restreints[section].forEach(membre => {
            if (membre == membreId.number)
            {
                console.log('Membre banni du groupe ' + section)
                // return true
                banni = true
            }
        })
    }

    // Récupération de l'autorisation
    return banni
}

/*
    * AUTORISATION DE FONCTION DE BANQUIERS *
    * Vérification des banquiers
*/
const boutiquier = async(msg) => {
    // Récupération du numéro
    const Boutiquier = await msg.getContact()
    // Variable de vérification
    let autorise = false

    // Vérification de la présence du membre
    boutiquiers.forEach(salarie => {
        if (Boutiquier.number == salarie)
        {
            autorise = true
        }
    })

    // Récupération de l'autorisation
    return autorise
}

/*
    * AUTORISATION DE FONCTION DE BANQUIERS *
    * Vérification des banquiers
*/
const banquier = async(msg) => {
    // Récupération du numéro
    const Banquier = await msg.getContact()
    // Variable de vérification
    let autorise = false

    // Vérification de la présence du membre
    banquiers.forEach(salarie => {
        if (Banquier.number == salarie)
        {
            autorise = true
        }
    })

    // Récupération de l'autorisation
    return autorise
}

/*
    * MENU D'OPTION DES REGLES *
    * Détection et récupération de la règle
*/
const botSNG = (groupe) => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Tri des requêtes au bot  || (from == '33615641467@c.us')
        if ((from == groupe) || ((from == '33615641467@c.us') && (to == groupe)))
        {
            // Récupération des infos de traitement
            const indice = body.substr(0, 1)
        
            // Vérification de la présence de requête
            if ((indice == '>'))
            {
                // Variable de vérification du statut de banissement du membre
                let banni = null

                // Requête de vérification
                autorisation(msg, 'groupeP').then(val => {
                    // Récupération de la réponse d'authentification
                    banni = val.valueOf()

                    // Vérification et disposition des règles
                    if (!banni)
                    {
                        if ((body.substr(1).toLowerCase() == 'regles') || (body.substr(1).toLowerCase() == 'règles'))
                        {
                            // Affichage du menu de règles
                            let menuRegles = '┌──────────────────┐\n'
                            menuRegles += '    𝐅𝐈𝐂𝐇𝐄𝐒 𝐃𝐄 𝐑𝐄𝐆𝐋𝐄𝐒 𝐒𝐍𝐆\n'
                            menuRegles += '└──────────────────┘\n\n'
                            menuRegles += '\`\`\`>fiche evo\`\`\` : Fiche d\'évolution\n'
                            menuRegles += '\`\`\`>fiche orga\`\`\` : Fiche d\'organisation\n'
                            menuRegles += '\`\`\`>fiche perso\`\`\` : Fiche de perso vierge\n'
                            menuRegles += '\`\`\`>fiche postes\`\`\` : Fiche des emplois-salaire\n'
                            menuRegles += '\`\`\`>fiche creation\`\`\` : Fiche de création perso\n'
                            menuRegles += '\`\`\`>fiche recap\`\`\` : Fiche récapitulative des règles\n\n'
                            menuRegles += '\`\`\`>regle edo\`\`\` : Règles de l\'edo tensei\n'
                            menuRegles += '\`\`\`>regle jutsu\`\`\` : Règles création jutsu\n'
                            menuRegles += '\`\`\`>regle senso\`\`\` : Règles ninjas sensoriels\n'
                            menuRegles += '\`\`\`>regle ajuste\`\`\` : Règles ajustement PCN\n\n'
                            menuRegles += '🥷🏽 Quelle règle désirez-vous voir ?'

                            // Affichage du menu des règles
                            sendMessage(groupe, menuRegles)

                        } else if (body.substr(1, 5).toLowerCase() == 'fiche')
                        {
                            // Récupération de la requête
                            const requete = body.substr(7).toLowerCase()
                            // Vérification
                            switch (requete)
                            {
                                case 'evo':
                                    // Récupération de la fiche perso
                                    let ficheEvolution = fs.readFileSync('./data/regles/evolution.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheEvolution.toString())
                                    break
                                
                                case 'orga':
                                    // Récupération de la fiche perso
                                    let ficheOrganisation = fs.readFileSync('./data/regles/organisation.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheOrganisation.toString())
                                    break

                                case 'perso':
                                    // Récupération de la fiche perso
                                    let fichePerso = fs.readFileSync('./data/regles/newPerso.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(fichePerso.toString())
                                    break

                                case 'postes':
                                    // Récupération de la fiche perso
                                    let fichePostes = fs.readFileSync('./data/regles/postes.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(fichePostes.toString())
                                    break
                                
                                case 'creation':
                                    // Récupération de la fiche perso
                                    let ficheCreationPerso = fs.readFileSync('./data/regles/creationPerso.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheCreationPerso.toString())
                                    break

                                case 'recap':
                                    // Récupération de la fiche perso
                                    let ficheRecap = fs.readFileSync('./data/regles/recap.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheRecap.toString())
                                    break
                            
                                default:
                                    // Notification d'absence de solution createFichePerso
                                    msg.reply('🥷🏽 Mystère')
                                    break
                            }
                        } else if ((body.substr(1, 5).toLowerCase() == 'regle') || (body.substr(1, 5).toLowerCase() == 'règle'))
                        {
                            // Récupération de la requête
                            const requete = body.substr(7).toLowerCase()
                            // Vérification
                            switch (requete)
                            {
                                case 'edo':
                                    // Récupération de la fiche perso
                                    let ficheEdo = fs.readFileSync('./data/regles/edoTensei.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheEdo.toString())
                                    break
                                
                                case 'senso':
                                    // Récupération de la fiche perso
                                    let ficheSenso = fs.readFileSync('./data/regles/mudraSensoriel.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheSenso.toString())
                                    break
                                
                                case 'jutsu':
                                    // Récupération de la fiche perso
                                    let ficheJutsu = fs.readFileSync('./data/regles/jutsu.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheJutsu.toString())
                                    break

                                case 'ajuste':
                                    // Récupération de la fiche perso
                                    let ficheAjustement = fs.readFileSync('./data/regles/ajustement.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheAjustement.toString())
                                    break
                            
                                default:
                                    // Notification d'absence de solution
                                    msg.reply('🥷🏽 Mystère')
                                    break
                            }
                        } else if (body.substr(1).toLowerCase() == 'avatars')
                        {
                            // Menu des options d'avatar
                            let menuAvatar = '┌──────────────────┐\n'
                            menuAvatar += '    𝐎𝐏𝐓𝐈𝐎𝐍𝐒 𝐃𝐄𝐒 𝐀𝐕𝐀𝐓𝐀𝐑𝐒\n'
                            menuAvatar += '└──────────────────┘\n\n'
                            menuAvatar += '\`\`\`>avatar ages\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar clans\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar grades\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar statuts\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar equipes\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar villages\`\`\`\n\n'
                            menuAvatar += '\`\`\`>avatar libres\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar principaux\`\`\`\n'
                            menuAvatar += '\`\`\`>avatar secondaires\`\`\`\n\n'
                            menuAvatar += '🥷🏽 Quelle option désirez-vous sélectionner ?'
                            
                            // Affichage du menu des options d'avatar
                            sendMessage(groupe, menuAvatar)

                        } else if ((body.substr(1, 6).toLowerCase() == 'avatar') && (body.substr(8, 1) != ' '))
                        {
                            // Requête
                            const requete = body.substr(8).toLowerCase()

                            // Traitement de la requête
                            switch (requete) {
                                case 'clans':
                                    // Réponse de la requête de récupération des clans
                                    msg.reply(listClan())
                                    break

                                case 'villages':
                                    // Réponse de la requête de récupération des clans
                                    msg.reply(listVillage())
                                    break
                                
                                case 'ages':
                                    // Réponse de la requête de récupération des clans
                                    msg.reply(listAge())
                                    break

                                case 'grades':
                                    // Réponse de la requête de récupération des clans
                                    msg.reply(listGrade())
                                    break

                                case 'statuts':
                                    // Réponse de la requête de récupération des clans
                                    msg.reply(listStatut())
                                    break

                                case 'principaux':
                                    // Réponse de la requête de récupération des perso principaux
                                    msg.reply(listPersoPSL('P'))
                                    break

                                case 'secondaires':
                                    // Réponse de la requête de récupération des perso secondaires
                                    msg.reply(listPersoPSL('S'))
                                    break

                                case 'libres':
                                    // Réponse de la requête de récupération des perso libres
                                    msg.reply(listPersoPSL('L'))
                                    break

                                case 'equipes':
                                    // Récupération de la fiche de répartition des équipes
                                    let ficheEquipe = fs.readFileSync('./data/fiches/equipes.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheEquipe.toString())
                                    break
                            
                                default:
                                    // Récupération du nom de l'avatar demandé
                                    const avatar = body.substr(8).toLowerCase()
                                    // msg.reply(selectFichePerso2(avatar))

                                    // Requête de récupération de la fiche
                                    selectFichePerso(avatar, msg, groupe)
                                    break
                            }
                        } else if ((body.substr(1, 6).toLowerCase() == 'profil') && (body.substr(8, 1) != ' '))
                        {
                            // Requête
                            const requete = body.substr(8).toLowerCase()

                            // Traitement de la requête
                            switch (requete) {
                                case 'tagar':
                                    // Récupération de l'image de l'avatar
                                    const sourceImg = './assets/images/avatars/tagar_1.jpeg'
                                    sendImageAvatar(sourceImg, msg)
                                    break

                                case 'nitsuya':
                                    // Récupération de l'image de l'avatar
                                    const sourceImg2 = './assets/images/avatars/tagar_1.jpeg'
                                    sendImageAvatar(sourceImg, msg)
                                    break
                                
                                case 'toka':
                                    // Récupération de l'image de l'avatar
                                    const sourceImg3 = './assets/images/avatars/tagar_1.jpeg'
                                    // sendImageAvatar(sourceImg, msg)
                                    break
                            }
                        } else if (body.substr(0, 21) == '>>> *NEW FICHE PERSO*')
                        {
                            if ((from == '33615641467@c.us') && (to == groupe))
                            {
                                // Création de la fiche perso
                                newPersoSNG(msg)
                            } else
                            {
                                msg.reply('🥷🏽 *Genjutsu - kai !*')
                            }
                        } else if ((from == '33615641467@c.us') && (to == groupe) && (body.substr(1, 7).toLowerCase() == 'accueil')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split(' ')
                            const newMembre = parseInt(num[1])

                            if (newMembre > 0)
                            {
                                // Ajout du nouveau membre
                                addMembre(newMembre, msg)
                            } else
                            {
                                // Log d'ajout impossible
                                console.log('Numéro invalide')
                            }
                        } else if ((from == '33615641467@c.us') && (to == groupe) && (body.substr(1, 9).toLowerCase() == 'desertion')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split('@')
                            const newMembre = parseInt(num[1])
                            if (newMembre > 0)
                            {
                                // Supression d'un membre
                                supMembre(newMembre, msg)
                            } else
                            {
                                // Log de suppression impossible
                                console.log('Numéro invalide')
                            }
                        } else if (body == '>tournoi')
                        {
                            // Message du lien du tournoi
                            let tournoi = '♨️ *TOURNOI SNG POWER TEST* ♨️\n\n'
                            tournoi += '_Salutation à vous, Shinobi de la New Generation !_\n\n'
                            tournoi += 'Nouvelle année, nouveaux défis ! C\'est ainsi qu\'émerge le premier tournoi de l\'année !\n\n'
                            tournoi += '\`\`\`Suivez l\'évolution du tournoi :\`\`\`\n\n'
                            tournoi += '👇🏻\nhttps://challonge.com/fr/1ynr5ae0\n'
                            tournoi += '*Merci !♨️*'
                            
                            // Envoi du lien d'annonce du tournoi
                            sendMessage(groupe, tournoi)
                        } else
                        {
                            // Notification d'absence de solution
                            msg.reply('🥷🏽 La vie n\'est pas rose...')
                        }
                    }
                })
            }
        }
    })
}

/*
    * GESTION DES FICHES DE LA BDD *
    * Actualisation de PCN et autres
*/
const botDB = (groupe) => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Tri des requêtes au bot  (from == groupe) || ((from == '33615641467@c.us') && (to == groupe))
        if ((from == groupe) || ((from == '33615641467@c.us') && (to == groupe)))
        {
            if (body.substr(0, 13).toLowerCase() == 'actualisation')
            {
                // Requête d'actualisation de fiche
                actualisationFiche(body, msg)

            } else if ((from == '33615641467@c.us') && (to == groupe) && (body.substr(1, 7).toLowerCase() == 'accueil')) 
            {
                // Récupération du numéro à ajouter
                const num = msg.body.split(' ')
                const newMembre = parseInt(num[1])

                if (newMembre > 0)
                {
                    // Ajout du nouveau membre
                    addMembre(newMembre, msg)
                } else
                {
                    // Log d'ajout impossible
                    console.log('Numéro invalide')
                }
            } else if ((from == '33615641467@c.us') && (to == groupe) && (body.substr(1, 9).toLowerCase() == 'desertion')) 
            {
                // Récupération du numéro à ajouter
                const num = msg.body.split('@')
                const newMembre = parseInt(num[1])
                if (newMembre > 0)
                {
                    // Supression d'un membre
                    supMembre(newMembre, msg)
                } else
                {
                    // Log de suppression impossible
                    console.log('Numéro invalide')
                }
            }
        }
    })
}

/*
    * MENU D'OPTION DU CLASSEMENT SHINOBI *
    * Adaptation all groupe
*/
const botShinobi = (groupe) => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Tri des requêtes au bot
        if ((from == groupe) || ((from == '33615641467@c.us') && (to == groupe)))
        {
            // Récupération des infos de traitement
            const indice = body.substr(0, 1)
        
            // Vérification de la présence de requête
            if ((indice == '!'))
            {
                // Variable de vérification du statut de banissement du membre
                let banni = null

                // Requête de vérification
                autorisation(msg, 'groupeP').then(val => {
                    // Récupération de la réponse d'authentification
                    banni = val.valueOf()

                    // Vérification et disposition des règles
                    if (!banni)
                    {
                        if (body.toLowerCase() == '! fiche')
                        {
                            // Requête de récupération du personnage
                            selectPersoClassement(msg, groupe)
                        } else if (body.substr(2).toLowerCase() == 'classement')
                        {
                            // Menu des options de classement
                            let menuClassement = '┌──────────────────┐\n'
                            menuClassement += '      𝐂𝐋𝐀𝐒𝐒𝐄𝐌𝐄𝐍𝐓 𝐒𝐇𝐈𝐍𝐎𝐁𝐈\n'
                            menuClassement += '└──────────────────┘\n\n'
                            menuClassement += '\`\`\`! fiche\`\`\`\n'
                            menuClassement += '\`\`\`! fiche defi\`\`\`\n'
                            menuClassement += '\`\`\`! fiche team\`\`\`\n'
                            menuClassement += '\`\`\`! fiche bilan\`\`\`\n'
                            menuClassement += '\`\`\`! fiche bilan off\`\`\`\n\n'
                            menuClassement += '\`\`\`! classement team\`\`\`\n'
                            menuClassement += '\`\`\`! classement perso\`\`\`\n'
                            menuClassement += '\`\`\`! classement regles\`\`\`\n\n'
                            menuClassement += '🥷🏽 Quelle option désirez-vous sélectionner ?'
                            
                            // Affichage du menu des options de classement
                            sendMessage(groupe, menuClassement)

                        } else if (body.substr(2, 5).toLowerCase() == 'fiche')
                        {
                            // Récupération de la requête
                            const requete = body.substr(8).toLowerCase()
                            // Vérification
                            switch (requete)
                            {
                                case 'defi':
                                    // Récupération de la fiche perso
                                    let ficheDefi = fs.readFileSync('./data/classement/ficheDefi.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheDefi.toString())
                                    break
                                
                                case 'bilan':
                                    // Récupération de la fiche perso
                                    let ficheBilanDefi = fs.readFileSync('./data/classement/bilanDefi.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheBilanDefi.toString())
                                    break

                                case 'bilan off':
                                    // Récupération de la fiche perso
                                    let ficheBilanDefiOff = fs.readFileSync('./data/classement/bilanOfficialisation.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheBilanDefiOff.toString())
                                    break
                                        
                                case 'team':
                                    // Récupération de la fiche perso
                                    let ficheTeam = fs.readFileSync('./data/classement/ficheTeam.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheTeam.toString())
                                    break
                            }
                        } else if (body.substr(2, 10).toLowerCase() == 'classement')
                        {
                            // Récupération de la requête
                            const requete = body.substr(13).toLowerCase()
                            // Vérification
                            switch (requete)
                            {
                                case 'team':
                                    console.log('Fiche des team du classement')
                                    // Réponse de la requête de récupération des team du classement shinobi
                                    // msg.reply(listPersoPSL('Team'))
                                    break

                                case 'perso':
                                    // Réponse de la requête de récupération des perso du classement shinobi
                                    // msg.reply(listPersoClassement())
                                    listPersoClassement(msg)
                                    break

                                case 'regles':
                                    // Récupération de la fiche perso
                                    let ficheClassement = fs.readFileSync('./data/classement/reglesClassement.txt', 'utf8')
                                    // Envoi des règles
                                    msg.reply(ficheClassement.toString())
                                    break
                            }
                        } else if ((body.substr(2, 4).toLowerCase() == 'team') && (body.substr(5, 1) != ' '))
                        {
                            // Récupération du nom de la team
                            const team = body.substr(6).trim()
                            // Requête de récupération de la fiche
                            selectTeamClassement(team, msg, groupe)

                        } else if (body.substr(2, 3).toLowerCase() == 'new')
                        {
                            if (((from == '33615641467@c.us') && (to == groupe)) || (from == '237696813190@c.us'))
                            {
                                // Récupération de la requête
                                const preparation = body.split('\n')
                                const requete = preparation[0].substr(5).toLowerCase().trim()
                                // Vérification
                                switch (requete)
                                {
                                    case 'team':
                                        // Notification finale
                                        createTeamShinobi(msg)
                                        break
                                    
                                    case 'perso':
                                        // Notification finale
                                        createPersoShinobi(msg)
                                        break
                                
                                    default:
                                        // Notification d'absence de solution createFichePerso
                                        msg.reply('🥷🏽 Humm')
                                        break
                                }
                            } else
                            {
                                msg.reply('🥷🏽 *Genjutsu - kai !*')
                            }
                        } else if ((from == '33615641467@c.us') && (to == groupe) && (body.substr(2, 9).toLowerCase() == 'bienvenue')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split(' ')
                            const newMembre = parseInt(num[2])

                            if (newMembre > 0)
                            {
                                // Ajout du nouveau membre
                                addMembre(newMembre, msg)
                            } else
                            {
                                // Log d'ajout impossible
                                console.log('Numéro invalide')
                            }
                        } else if ((from == '33615641467@c.us') && (to == groupe) && (body.substr(2, 3).toLowerCase() == 'bye')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split('@')
                            const newMembre = parseInt(num[1])
                            if (newMembre > 0)
                            {
                                // Supression d'un membre
                                supMembre(newMembre, msg)
                            } else
                            {
                                // Log de suppression impossible
                                console.log('Numéro invalide')
                            }
                        } else if (body == '>tournoi')
                        {
                            // Message du lien du tournoi
                            let tournoi = '♨️ *TOURNOI SNG POWER TEST* ♨️\n\n'
                            tournoi += '_Salutation à vous, Shinobi de la New Generation !_\n\n'
                            tournoi += 'Nouvelle année, nouveaux défis ! C\'est ainsi qu\'émerge le premier tournoi de l\'année !\n\n'
                            tournoi += '\`\`\`Suivez l\'évolution du tournoi :\`\`\`\n\n'
                            tournoi += '👇🏻\nhttps://challonge.com/fr/1ynr5ae0\n'
                            tournoi += '*Merci !♨️*'
                            
                            // Envoi du lien d'annonce du tournoi
                            sendMessage(groupe, tournoi)
                        }
                    }
                })
            }
        }
    })
}

const sendImageAvatar = async(source, newMsg) => {
    const chat = await newMsg.getChat()
    const media = MessageMedia.fromFilePath(source);
    chat.sendMessage(media)
}


/*
    * MENU D'ORGANISATION RP PRIME *
*/
const botPrime = (groupe) => {
    bot.on('message_create', (msg) => {
        // Récupération des composants du message
        const { from, to, body } = msg

        // Tri des requêtes au bot  || (from == '33615641467@c.us')
        if ((from == groupe) || ((from == '33615641467@c.us') && (to == groupe)))
        {
            // Récupération des infos de traitement
            const indice = body.substr(0, 1)
        
            // Vérification de la présence de requête
            if ((indice == '#'))
            {
                // Variable de vérification du statut de banissement du membre
                let banni = null

                // Requête de vérification
                autorisation(msg, 'neonPrime').then(val => {
                    // Récupération de la réponse d'authentification
                    banni = val.valueOf()

                    // Vérification et disposition des règles
                    if (!banni)
                    {
                        if (body.substr(1).toLowerCase() == 'commandes')
                        {
                            // Récupération du menu
                            let menuPrime = fs.readFileSync('./neon/fiches/menuPrime.txt', 'utf8')
                            // Envoi du menu prime
                            msg.reply(menuPrime.toString())

                        } else if (body.substr(1).toLowerCase() == 'army')
                        {
                            // Récupération des règles
                            let army = fs.readFileSync('./neon/fiches/armee.txt', 'utf8')
                            // Envoi des règles de l'armée
                            msg.reply(army.toString())

                        } else if (body.substr(1).toLowerCase() == 'horsLaLoi')
                        {
                            // Récupération des règles
                            let horsLaLoi = fs.readFileSync('./neon/fiches/horsLaLoi.txt', 'utf8')
                            // Envoi des règles des hors la loi
                            msg.reply(horsLaLoi.toString())

                        } else if (body.substr(1).toLowerCase() == 'evolution')
                        {
                            // Récupération des règles
                            let evolution = fs.readFileSync('./neon/fiches/niveaux.txt', 'utf8')
                            // Envoi des règles de niveaux d'évolution
                            msg.reply(evolution.toString())

                        } else if ((body.substr(1, 6).toLowerCase() == 'avatar') && (body.substr(8, 1) != ' '))
                        {
                            // Requête
                            const requete = body.substr(8).toLowerCase()

                            // Traitement de la requête
                            switch (requete) {
                                case 'map':
                                    // Réponse de la requête de récupération des maps
                                    // msg.reply(listClan())
                                    msg.reply('🤖 En cours de développement...')
                                    break
                            
                                default:
                                    // Récupération du nom de l'avatar demandé
                                    const avatar = body.substr(8).toLowerCase()

                                    // Requête de récupération de la fiche
                                    selectFichePersoPrime(avatar, msg, groupe)
                                    break
                            }
                        } else if (body.substr(1, 1).toLowerCase() == ' ')
                        {
                            // Requête
                            const requete = body.substr(2).toLowerCase()

                            // Traitement de la requête
                            switch (requete) {
                                case 'neo':
                                    // Récupération de l'image
                                    const sourceImg = './neon/images/bot/main.jpeg'
                                    sendImageAvatar(sourceImg, msg)
                                    break

                                case 'neo smile':
                                    // Récupération de l'image
                                    const sourceImg2 = './neon/images/bot/smile.jpeg'
                                    sendImageAvatar(sourceImg2, msg)
                                    break

                                case 'army':
                                    // Récupération de l'image
                                    const sourceImg3 = './neon/images/army.jpeg'
                                    sendImageAvatar(sourceImg3, msg)
                                    break

                                case 'hors la loi':
                                    // Récupération de l'image
                                    const sourceImg4 = './neon/images/horsLaLoi.jpeg'
                                    sendImageAvatar(sourceImg4, msg)
                                    break
                            }
                        } else if (body.substr(1, 5) == 'build')
                        {
                            if (((from == '33615641467@c.us') && (to == groupe)) || ((from == '8618752355751@c.us') && (to == groupe)))
                            {
                                // Création de la fiche perso
                                createPersoPrime(msg)
                            } else
                            {
                                msg.reply('🤖 *La vie est rose*')
                            }
                        } else if (body.substr(0, 23) == '# *ACTUALISATION PRIME*'){
                            if (((from == '33615641467@c.us') && (to == groupe)) || (from == '8618752355751@c.us'))
                            {
                                // Requête d'actualisation de fiche
                                console.log('Requête d\'actualisation')
                                actualisationFichePrime(body, msg)

                            }
                        } else if (((from == '8618752355751@c.us') && (to == groupe)) && (body.substr(1, 7).toLowerCase() == 'accueil')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split(' ')
                            const newMembre = parseInt(num[1])

                            if (newMembre > 0)
                            {
                                // Ajout du nouveau membre
                                addMembre(newMembre, msg)
                            } else
                            {
                                // Log d'ajout impossible
                                console.log('🤖 Numéro invalide')
                            }
                        } else if (((from == '8618752355751@c.us') && (to == groupe)) && (body.substr(1, 9).toLowerCase() == 'desertion')) 
                        {
                            // Récupération du numéro à ajouter
                            const num = msg.body.split('@')
                            const newMembre = parseInt(num[1])
                            if (newMembre > 0)
                            {
                                // Supression d'un membre
                                supMembre(newMembre, msg)
                            } else
                            {
                                // Log de suppression impossible
                                console.log('🤖 Numéro invalide')
                            }
                        }
                    }
                })
            }
        }
    })
}


/*
    * AJOUT DE NOUVEAU MEMBRES *
    * Fonction d'ajout de membres
*/
const addMembre = async(number, msg) => {
    // Récupération de l'instance du groupe
    const theGroup = await msg.getChat()
    // Vérificatoion du num
    const membre = `${number}@c.us`
    // Ajout du membre
    theGroup.addParticipants([membre])
    // Log de l'ajout du du numéro
    console.log('Ajout de +' + number)
    // Notification de fin d'ajout du membre
    // msg.reply('*Nouveau membre ajouté !*')
}
/*
    * SUPRESSION DE MEMBRES *
    * Fonction de supression de membres
*/
const supMembre = async(number, msg) => {
    // Récupération de l'instance du groupe
    const theGroup = await msg.getChat()
    // Vérificatoion du num
    const membre = `${number}@c.us`
    // Ajout du membre
    theGroup.removeParticipants([membre])
    // Log de l'ajout du du numéro
    console.log('Supression de +' + number)
    // Notification de fin de supression du membre
    // msg.reply('*Membre supprimé avec succès !*')
}


/*
    * AFFICHAGE DES COMPTES DE LA BOUTIQUE *
    * Comptes et armes principales
*/
const afficherComptes = (msg) => {
    // Variables de stockage des comptes
    let ficheCompte = {
        dataCompte: '',
        listeNum: []
    }
    let compteNinja = '𝑩𝑨𝑵𝑸𝑼𝑬 𝑫𝑬 𝑳𝑨 𝑪𝑶𝑴𝑴𝑼𝑵𝑨𝑼𝑻É\n\n'

    // Ajout de la description de la monnaie Shinobi
    compteNinja += '*M$* = Monnaie $hinobi\n\n'

    // Récupération de tous les comptes disponibles
    comptes.forEach(compte => {
        compteNinja += '♨️ *' + compte.avatar + '* (@' + compte.utilisateur + ')\n'
        compteNinja += '▪️Bourse ninja : ' + compte.solde + ' M$\n'
        compteNinja += '▪️Grade : '+ compte.grade + '\n\n'

        // Sauvegarde du numéro
        ficheCompte.listeNum.push(compte.utilisateur)
    })

    // Récupération finale de la fiche
    ficheCompte.dataCompte = compteNinja
    // Préparation au tague
    tagueAllCompte(ficheCompte, msg)
}


/*
    * MISE A JOUR AVATAR DE LA BASE DONNEES *
*/
const mAjFichePerso = () => {
    // Actualisation de la base de données
    console.log('Test')
    fs.writeFileSync('./data/fiches/dataPerso.json', JSON.stringify(dataPerso), 'utf8')
}

/*
    * MISE A JOUR PERSO CLASSEMENT SHINOBI *
*/
const mAjFichePersoClassement = () => {
    // Actualisation de la base de données
    fs.writeFileSync('./data/classement/dataPersoClassement.json', JSON.stringify(dataPersoClassement), 'utf8')
}

/*
    * MISE A JOUR TEAM CLASSEMENT SHINOBI *
*/
const mAjFicheTeamClassement = () => {
    // Actualisation de la base de données
    fs.writeFileSync('./data/classement/dataTeamClassement.json', JSON.stringify(dataTeamClassement), 'utf8')
}

/*
    * MISE A JOUR DES COMPTES AVATAR *
*/
const mAjComptePerso = () => {
    // Actualisation des comptes perso
    console.log('Test')
    fs.writeFileSync('./data/banque/comptes.json', JSON.stringify(comptes), 'utf8')
}

/*
    * MISE A JOUR DES ARTICLES *
*/
const mAjArticlesPerso = () => {
    // Actualisation des articles
    fs.writeFileSync('./data/boutique/articles.json', JSON.stringify(articles), 'utf8')
}

/*
    * ACTUALISATION DE PCN *
*/
const actualisationPCN = (fiche, data, competence) => {
    if (data.substr(10, 1) == '+')
    {
        // Récupération de nombre de PCN à ajouter
        const ajout = parseInt(data.substr(11))
        // Ajout des PCN
        fiche.competences[competence] += ajout
        return '▫️Ajout de ' + ajout + ' PCN ' + competence +'\n'
    }
    if (data.substr(10, 1) == '-')
    {
        // Récupération de nombre de PCN à retirer
        const soustraction = parseInt(data.substr(11))
        // Soustraction des PCN
        fiche.competences[competence] -= soustraction
        // Note de l'actualisation
        return '▫️Soustraction de ' + soustraction + ' PCN ' + competence +'\n'
    }
}

/*
    * ACTUALISATION DE JUTSU *
*/
const actualisationJUTSU = (fiche, data, type) => {
    // Récupération de nombre de PCN à ajouter
    const newJutsu = data.substr(12).trim()
    console.log(newJutsu)
    // Ajout de la technique
    fiche.jutsu[type.id].listJutsu.push(newJutsu)
    if (type.rang == 'L')
    {
        return '▫️Ajout de jutsu rang libre\n'
    } else
    {
        return '▫️Ajout de jutsu rang ' + type.rang + '\n'
    }
}

/*
    * ACTUALISATION COMPLETE DE LA FICHE AVATAR *
*/
const actualisationFiche = (recap, newMsg) => {
    // Tri du récapitulatif et répartition des requêtes
    const requete = recap.split('\n')
    // Récupération du nom de l'avatar
    const namePerso = requete[2].substr(0).trim()

    // Variable de vérification d'actualisation
    let actualisation = false
    let recapitulatif = '*RECAPITULATIF D\'ACTUALISATION*\n\n'

    // Recherche de la fiche perso
    dataPerso.forEach(perso => {
        if ((perso.name == namePerso) || (perso.name.toLowerCase() == namePerso.toLowerCase()))
        {
            // Actualisation des données de la fiche
            requete.forEach(ligne => {
                // Actualisation des PCN
                if (ligne.substr(2, 3) == 'PCN')
                {
                    switch (ligne.substr(6, 1))
                    {
                        case 'A':
                            // Actualisation des PCN agilité
                            recapitulatif += actualisationPCN(perso, ligne, 'agilite')
                            break
                        case 'V':
                            // Actualisation des PCN vitesse
                            recapitulatif += actualisationPCN(perso, ligne, 'vitesse')
                            break
                        case 'P':
                            // Actualisation des PCN precision
                            recapitulatif += actualisationPCN(perso, ligne, 'precision')
                            break
                        case 'F':
                            // Actualisation des PCN force brute
                            recapitulatif += actualisationPCN(perso, ligne, 'force')
                            break
                        case 'E':
                            // Actualisation des PCN endurance
                            recapitulatif += actualisationPCN(perso, ligne, 'endurance')
                            break
                        case 'S':
                            // Actualisation des PCN capacités sensorielles
                            recapitulatif += actualisationPCN(perso, ligne, 'senso')
                            break
                        case 'C':
                            // Note de l'actualisation
                            recapitulatif += '▫️Limite endurance de clan : ' + perso.limiteClan + ' => '
                            if (ligne.substr(10, 1) == '+')
                            {
                                // Récupération des limites à augmenter
                                const ajout = parseInt(ligne.substr(11))
                                // Augmentation des limites
                                perso.competences.limiteClan += ajout
                                // Note de fin d'actualisation
                                recapitulatif += perso.competences.limiteClan + '\n'
                            }
                            if (ligne.substr(10, 1) == '-')
                            {
                                // Récupération des limites à restreindre
                                const soustraction = parseInt(ligne.substr(11))
                                // Soustraction des limites
                                perso.competences.limiteClan -= soustraction
                                // Note de fin d'actualisation
                                recapitulatif += perso.competences.limiteClan + '\n'
                            }
                            break
                    }
                }
                // Actualisation de jutsu
                if (ligne.substr(2, 5) == 'jutsu')
                {
                    if (ligne.substr(8, 1) == 'C' || ligne.substr(8, 1) == 'D' || ligne.substr(8, 1) == 'E')
                    {
                        // Actualisation de la technique
                        recapitulatif += actualisationJUTSU(perso, ligne, {
                            id: 0,
                            rang: ligne.substr(8, 1)
                        })
                    } else if (ligne.substr(8, 1) == 'B' || ligne.substr(8, 1) == 'A')
                    {
                        // Actualisation de la technique
                        recapitulatif += actualisationJUTSU(perso, ligne, {
                            id: 1,
                            rang: ligne.substr(8, 1)
                        })
                    } else {
                        // Actualisation de la technique
                        recapitulatif += actualisationJUTSU(perso, ligne, {
                            id: 2,
                            rang: ligne.substr(8, 1)
                        })
                    }
                }
                // Actualisation du nom
                if (ligne.substr(2, 3).toLowerCase() == 'nom')
                {
                    // Actualisation du nom
                    recapitulatif += '▫️' + perso.name
                    perso.name = ligne.substr(8).trim()
                    recapitulatif += ' => _'+ perso.name +'_\n'
                }
                // Actualisation de l'étreinte
                if (ligne.substr(2, 8).toLowerCase() == 'etreinte')
                {
                    // Modification de l'étreinte
                    recapitulatif += '▫️' + perso.competences.etreinte
                    perso.competences.etreinte = ligne.substr(13).trim()
                    recapitulatif += ' => _'+ perso.competences.etreinte +'_\n'
                }
                // Actualisation du village
                if (ligne.substr(2, 7).toLowerCase() == 'village')
                {
                    // Actualisation du village actuel
                    recapitulatif += '▫️' + perso.village
                    perso.village = ligne.substr(12).trim()
                    recapitulatif += ' => _'+ perso.village +'_\n'
                }
                // Actualisation de l'âge
                if (ligne.substr(2, 3).toLowerCase() == 'age')
                {
                    // Actualisation de l'âge actuel
                    recapitulatif += '▫️' + perso.age
                    perso.age = ligne.substr(8).trim()
                    recapitulatif += 'ans => _'+ perso.age +'ans_\n'
                }
                // Actualisation de la taille
                if (ligne.substr(2, 6).toLowerCase() == 'taille')
                {
                    // Actualisation de la taille
                    recapitulatif += '▫️' + perso.taille
                    perso.taille = ligne.substr(11).trim()
                    recapitulatif += 'm => _'+ perso.taille +'m_\n'
                }
                // Actualisation du grade
                if (ligne.substr(2, 5).toLowerCase() == 'grade')
                {
                    // Actualisation du grade actuel
                    recapitulatif += '▫️' + perso.grade
                    perso.grade = ligne.substr(10).trim()
                    recapitulatif += ' => _'+ perso.grade +'_\n'
                }
                // Actualisation du numéro utilisateur
                if (ligne.substr(2, 4).toLowerCase() == 'user')
                {
                    // Actualisation du numéro
                    perso.user = ligne.substr(8).trim()
                    recapitulatif += '▫️Nouvel utilisateur : +'+ perso.user +'_\n'
                }
                // Actualisation d'affinité
                if (ligne.substr(2, 8).toLowerCase() == 'affinite')
                {
                    // Actualisation de l'affinité
                    let present = false
                    perso.affinite.forEach(affinite => {
                        if (ligne.substr(13).toLowerCase() == affinite.toLowerCase())
                        {
                            present = true
                        }
                    })
                    if (!present)
                    {
                        perso.affinite.push(ligne.substr(13).trim())
                        recapitulatif += '▫️Ajout d\'affinité : + _'+ ligne.substr(13).trim() +'_\n'
                    }
                }
                // Actualisation dE capacité particulière
                if (ligne.substr(2, 5).toLowerCase() == 'cap p')
                {
                    // Ajout de capacités héréditaires
                    let present = false
                    perso.capHereditaire.forEach(cap => {
                        if (ligne.substr(10).toLowerCase() == cap.toLowerCase())
                        {
                            present = true
                        }
                    })
                    if (!present)
                    {
                        perso.capCompSpeciale = ligne.substr(10).trim()
                        recapitulatif += '▫️Ajout de cap particulière : + _'+ ligne.substr(10).trim() +'_\n'
                    }
                }
                // Actualisation dE capacité héréditaire
                if (ligne.substr(2, 5).toLowerCase() == 'cap h')
                {
                    // Ajout de capacités héréditaires
                    let present = false
                    perso.capHereditaire.forEach(cap => {
                        if (ligne.substr(10).toLowerCase() == cap.toLowerCase())
                        {
                            present = true
                        }
                    })
                    if (!present)
                    {
                        perso.capHereditaire.push(ligne.substr(10).trim())
                        recapitulatif += '▫️Ajout de cap héréditaire : + _'+ ligne.substr(10).trim() +'_\n'
                    }
                }
                // Actualisation de statut
                if (ligne.substr(2, 6).toLowerCase() == 'statut')
                {
                    // Modification du statut
                    recapitulatif += '▫️' + perso.statut
                    perso.statut = ligne.substr(11).trim()
                    recapitulatif += ' => _'+ perso.statut +'_\n'
                }
                // Actualisation du chakra
                if (ligne.substr(2, 6).toLowerCase() == 'chakra')
                {
                    // Modification de chakra
                    recapitulatif += '▫️' + perso.chakra
                    perso.chakra = parseInt(ligne.substr(11).trim())
                    recapitulatif += ' => _'+ perso.chakra +' UT_\n'
                }
                // Actualisation de l'équipement principal
                if (ligne.substr(2, 6).toLowerCase() == 'arme p')
                {
                    // Actualisation de l'arme principale
                    recapitulatif += '▫️' + perso.armePrincipale
                    perso.armePrincipale = ligne.substr(11).trim()
                    recapitulatif += ' => _'+ perso.armePrincipale.trim() +'_\n'
                }
                // Actualisation de mission de rang D
                if (ligne.substr(2, 7).toLowerCase() == 'mission')
                {
                    // Récupération des paramètres de la requête d'actualisation
                    const statMission = ligne.substr(14).split('/')
                    const missionReussi = parseInt(statMission[0])
                    const nameMission = ligne.substr(10, 1)

                    // Vérification et actualisation
                    if ((missionReussi == 1) || (missionReussi == 2))
                    {
                        switch (nameMission)
                        {
                            case 'D':
                                // Actualisation mission de rang D
                                perso.missions[0].reussi += missionReussi
                                perso.missions[0].total += parseInt(statMission[1])
                                recapitulatif += '▫️Stats mission rang ' + nameMission + ' actualisées\n'
                                break
                            case 'C':
                                // Actualisation mission de rang C
                                perso.missions[1].reussi += missionReussi
                                perso.missions[1].total += parseInt(statMission[1])
                                recapitulatif += '▫️Stats mission rang ' + nameMission + ' actualisées\n'
                                break
                            case 'B':
                                // Actualisation mission de rang B
                                perso.missions[2].reussi += missionReussi
                                perso.missions[2].total += parseInt(statMission[1])
                                recapitulatif += '▫️Stats mission rang ' + nameMission + ' actualisées\n'
                                break
                            case 'A':
                                // Actualisation mission de rang A
                                perso.missions[3].reussi += missionReussi
                                perso.missions[3].total += parseInt(statMission[1])
                                recapitulatif += '▫️Stats mission rang ' + nameMission + ' actualisées\n'
                                break
                            case 'S':
                                // Actualisation mission de rang S
                                perso.missions[4].reussi += missionReussi
                                perso.missions[4].total += parseInt(statMission[1])
                                recapitulatif += '▫️Stats mission rang ' + nameMission + ' actualisées\n'
                                break
                        }
                    }
                }
                // Actualisation de l'expérience ninja
                if (ligne.substr(2, 2).toLowerCase() == 'xp' && ligne.substr(2).includes(' : '))
                {
                    // Actualisation des données de l'expérience
                    const newXp = ligne.substr(7).trim().split(' : ')
                    console.log(newXp)
                    perso.experience.push({
                        date: newXp[0],
                        description: newXp[1]
                    })
                    recapitulatif += '▫️Nouvelle exéperience ninja\n'
                }
            })
            // Actualisation
            mAjFichePerso()
            // Actualisation effectuée
            actualisation = true
        }
    })

    // Vérification de l'actualisation
    if (actualisation)
    {
        // Notification de succès d'actualisation
        newMsg.reply(recapitulatif + '\n ```Actualisation effectuée !```')
    } else
    {
        // Notification d'absence de la fiche
        newMsg.reply('🥷🏽 Fiche non disponible. Veuillez vérifier le nom du perso.')
    }
}

const recupIdGroup = async(message) => {
    const groupId = await message.getChat()
    const id = groupId.id
    return id
}

// Test tague
const tague = (groupe) => {
    bot.on('message_create', async (msg) => {
        if(msg.body === '>tag' && (msg.from === groupe) || ((msg.body === '>tag') && (msg.from == '33615641467@c.us') && (msg.to == groupe)))
        {
            let chat = await msg.getChat()

            for(let participant of chat.participants)
            {
                const contact = await bot.getContactById(participant.id._serialized);
                
                if (contact.number == '33615641467')
                {
                    await chat.sendMessage(`Yo @${contact.number}`, {
                        mentions: [contact]
                    })
                }
            }
        }
    })
}

/*
    * ENVOI DES FICHES TAGUES AU NOM DE L'UTILISATEUR *
*/
const tagueFiche = async(ficheResultat, newMsg, groupe) => {
    // Récupération de la discussion de groupe SNG
    const SNG = await newMsg.getChat()

    // Variable de test de présence du membre utilisateur de la fiche
    let trouve = false

    // Recherche du contact de l'utiisateur de la fiche
    for(let participant of SNG.participants)
    {
        // Stockage du contact
        const contact = await bot.getContactById(participant.id._serialized);
        
        // Vérification des coordonnées
        if (contact.number == ficheResultat.number)
        {
            // Mise à disposition de la fiche taguée
            await SNG.sendMessage(ficheResultat.dataFiche, {
                mentions: [contact]
            })
            // Mention de présence du membre
            trouve = true
        }
    }

    // Fiche en absence du membre
    if (!trouve)
    {
        // Mise à disposition de la fiche non taguée
        sendMessage(groupe, ficheResultat.dataFiche)
    }
}

/*
    * ENVOI DES COMPTES TAGUES AU NOM DE L'UTILISATEUR *
*/
const tagueAllCompte = async(ficheCompte, newMsg) => {
    // Récupération de la discussion de groupe SNG
    const BoutiqueNinja = await newMsg.getChat()

    // Tableau de récupération des contacts de comptes
    let mentions = []

    // Recherche du contact de l'utiisateur de la fiche
    for(let participant of BoutiqueNinja.participants)
    {
        // Stockage du contact
        const contact = await bot.getContactById(participant.id._serialized)

        // Récupération des contacts présents dans la boutique
        ficheCompte.listeNum.forEach(num => {
            // Vérification des coordonnées
            if (contact.number == num)
            {
                // Récupération du contact correspondant
                mentions.push(contact)
            }
        })
    }

    // Mise à disposition de la fiche taguée
    await BoutiqueNinja.sendMessage(ficheCompte.dataCompte, { mentions })
}

/*
    * ENVOI DU COMPTE PROPRE A L'AVATAR *
*/
const tagueCompte = async(ficheCompte, newMsg, groupe) => {
    // Récupération de la discussion de groupe SNG
    const BoutiqueNinja = await newMsg.getChat()

    // Variable de test de présence du membre utilisateur de l'avatar'
    let trouve = false

    // Recherche du contact de l'utiisateur de la fiche
    for(let participant of BoutiqueNinja.participants)
    {
        // Stockage du contact
        const contact = await bot.getContactById(participant.id._serialized);
        
        // Vérification des coordonnées
        if (contact.number == ficheCompte.num)
        {
            // Mise à disposition de la fiche taguée
            await BoutiqueNinja.sendMessage(ficheCompte.dataCompte, {
                mentions: [contact]
            })
            // Mention de présence du membre
            trouve = true
        }
    }

    // Compte en absence du membre
    if (!trouve)
    {
        // Mise à disposition de la compte non tagué
        sendMessage(groupe, ficheCompte.dataCompte)
    }
}

/*
    * ENVOI DE LA FICHE PERSO SHINOBI *
*/
const taguePersoClassement = async(fichePersoClassement, newMsg, groupe) => {
    // Récupération de la discussion de groupe SNG
    const GroupeClassement = await newMsg.getChat()

    // Variable de test de présence du perso
    let trouve = false

    // Recherche du contact de l'utiisateur de la fiche
    for(let participant of GroupeClassement.participants)
    {
        // Stockage du contact
        const contact = await bot.getContactById(participant.id._serialized);
        
        // Vérification des coordonnées
        if (contact.number == fichePersoClassement.num)
        {
            // Mise à disposition de la fiche taguée
            await GroupeClassement.sendMessage(fichePersoClassement.fiche, {
                mentions: [contact]
            })
            // Mention de présence du membre
            trouve = true
        }
    }

    // Fiche en absence du membre
    if (!trouve)
    {
        // Mise à disposition de la fiche non taguée
        sendMessage(groupe, fichePersoClassement.fiche)
    }
}

/*
    * RECUPERATION DES CLANS *
*/
const listClan = () => {
    // Création des variables de stockage
    let miniFiche = '━━ 𝙲𝙻𝙰𝙽𝚂 𝙳𝙴 𝙻𝙰 𝙲𝙾𝙼𝙼𝚄𝙽𝙰𝚄𝚃𝙴 ━━ \n\n'
    let clans = []
    let trouve = false
    // Récupération des clans
    dataPerso.forEach(perso => {
        // Vérification suivant les perso valides
        if (perso.actif)
        {
            if (clans.length == 0)
            {
                // Création du premier objet clan
                clans.push({
                    nameClan: perso.clan,
                    membres: [perso.name]
                })
            }else if (clans.length > 0)
            {
                // Indentation des clans et membres
                clans.forEach(clan => {
                    if (clan.nameClan == perso.clan)
                    {
                        // Ajout d'un autre membre
                        clan.membres.push(perso.name)
                        trouve = true
                    }
                })

                // Ajout d'un nouveau clan
                if (!trouve)
                {
                    // Création du clan suivant
                    clans.push({
                        nameClan: perso.clan,
                        membres: [perso.name]
                    })
                }
            }
        }
        // vérification de la variable "trouve"
        if (trouve)
        {
            trouve = false
        }
    })

    // Vérification
    clans.forEach(clan => {
        miniFiche += '⭕️ \`\`\`CLAN\`\`\` : *' + clan.nameClan + '*\n'
        // Récupération des membres du groupe
        clan.membres.forEach(membre => {
            miniFiche += '▪️' + membre + '\n'
        })
        // Fin de liste des membres du clan
        miniFiche += '\n'
    })

    // Notification du bot
    miniFiche += '\n🥷🏽 Merci d\'avoir fait appel à moi'

    // Retour de la liste des clans
    return miniFiche
}

/*
    * RECUPERATION DES VILLAGES *
*/
const listVillage = () => {
    // Création des variables de stockage
    let miniFiche = '━━ *𝚅𝙸𝙻𝙻𝙰𝙶𝙴𝚂 𝙳𝙴 𝙻𝙰 𝙲𝙾𝙼𝙼𝚄𝙽𝙰𝚄𝚃𝙴* ━━ \n\n'
    let villages = []
    let trouve = false
    // Récupération des villages
    dataPerso.forEach(perso => {
        // Vérification suivant les perso valides
        if (perso.actif)
        {
            if (villages.length == 0)
            {
                // Création du premier objet village
                if (perso.clan != 'Inconnu')
                {
                    // Ajout d'un autre membre avec clan
                    villages.push({
                        nameVillage: perso.village,
                        membres: [perso.clan + ' ' + perso.name]
                    })
                } else
                {
                    // Ajout d'un autre membre sans clan
                    villages.push({
                        nameVillage: perso.village,
                        membres: [perso.name]
                    })
                }
            }else if ((villages.length > 0))
            {
                // Indentation des villages et membres
                villages.forEach(village => {
                    if (village.nameVillage == perso.village)
                    {
                        if (perso.clan != 'Inconnu')
                        {
                            // Ajout d'un autre membre avec clan
                            village.membres.push(perso.clan + ' ' + perso.name)
                        } else
                        {
                            // Ajout d'un autre membre sans clan
                            village.membres.push(perso.name)
                        }
                        trouve = true
                    }
                })

                // Ajout d'un nouveau village
                if (!trouve)
                {
                    if (perso.clan != 'Inconnu')
                    {
                        // Création de l'objet village suivant
                        villages.push({
                            nameVillage: perso.village,
                            membres: [perso.clan + ' ' + perso.name]
                        })
                    } else
                    {
                        // Création de l'objet village suivant
                        villages.push({
                            nameVillage: perso.village,
                            membres: [perso.name]
                        })
                    }
                }
            }
        }
        // vérification de la variable "trouve"
        if (trouve)
        {
            trouve = false
        }
    })

    // Vérification
    villages.forEach(village => {
        miniFiche += '⭕️ \`\`\`VILLAGE\`\`\` : *' + village.nameVillage + '*\n'
        // Récupération des membres du village
        village.membres.forEach(membre => {
            miniFiche += '▪️' + membre + '\n'
        })
        // Fin de liste des membres du village
        miniFiche += '\n'
    })

    // Notification du bot
    miniFiche += '\n🥷🏽 Merci d\'avoir fait appel à moi'

    // Retour de la liste des villages et de leurs ninjas
    return miniFiche
}

/*
    * RECUPERATION DES GRADES *
*/
const listGrade = () => {
    // Création des variables de stockage
    let miniFiche = '━━ *𝙶𝚁𝙰𝙳𝙴𝚂 𝙽𝙸𝙽𝙹𝙰 𝚂𝙽𝙶* ━━ \n\n'
    let grades = []
    let trouve = false
    // Récupération des grades
    dataPerso.forEach(perso => {
        // Vérification suivant les perso valides
        if (perso.actif)
        {
            if (grades.length == 0)
            {
                // Création du premier objet grade
                if (perso.clan != 'Inconnu')
                {
                    // Ajout d'un membre avec clan
                    grades.push({
                        nameGrade: perso.grade,
                        membres: [perso.clan + ' ' + perso.name]
                    })
                } else
                {
                    // Ajout d'un membre sans clan
                    grades.push({
                        nameGrade: perso.grade,
                        membres: [perso.name]
                    })
                }
            }else if (grades.length > 0)
            {
                // Indentation des grades et membres
                grades.forEach(grade => {
                    if (grade.nameGrade == perso.grade)
                    {
                        if (perso.clan != 'Inconnu')
                        {
                            // Ajout d'un autre membre avec clan
                            grade.membres.push(perso.clan + ' ' + perso.name)
                        } else
                        {
                            // Ajout d'un autre membre sans clan
                            grade.membres.push(perso.name)
                        }
                        trouve = true
                    }
                })

                // Ajout d'un nouveau grade
                if (!trouve)
                {
                    if (perso.clan != 'Inconnu')
                    {
                        // Création de l'objet grade suivant
                        grades.push({
                            nameGrade: perso.grade,
                            membres: [perso.clan + ' ' + perso.name]
                        })
                    } else
                    {
                        // Création de l'objet grade suivant
                        grades.push({
                            nameGrade: perso.grade,
                            membres: [perso.name]
                        })
                    }
                }
            }
        }
        // vérification de la variable "trouve"
        if (trouve)
        {
            trouve = false
        }
    })

    // Vérification
    grades.forEach(grade => {
        miniFiche += '⭕️ \`\`\`GRADE\`\`\` : *' + grade.nameGrade + '*\n'
        // Récupération des ninjas de ce grade
        grade.membres.forEach(membre => {
            miniFiche += '▪️' + membre + '\n'
        })
        // Fin de liste des membres de ce grade
        miniFiche += '\n'
    })

    // Notification du bot
    miniFiche += '\n🥷🏽 Merci d\'avoir fait appel à moi'

    // Retour de la liste des grades et des ninja classés
    return miniFiche
}

/*
    * RECUPERATION DES STATUTS *
*/
const listStatut = () => {
    // Création des variables de stockage
    let miniFiche = '━━ *𝚂𝚃𝙰𝚃𝚄𝚃𝚂 𝙿𝙰𝚁𝚃𝙸𝙲𝚄𝙻𝙸𝙴𝚁𝚂 𝚂𝙽𝙶* ━━ \n\n'
    let statuts = []
    let trouve = false
    // Récupération des statuts
    dataPerso.forEach(perso => {
        // Vérification suivant les perso valides
        if (perso.actif)
        {
            if (statuts.length == 0)
            {
                // Création du premier objet statut
                if (perso.clan != 'Inconnu')
                {
                    // Ajout d'un autre membre avec clan
                    statuts.push({
                        nameStatut: perso.statut,
                        membres: [perso.clan + ' ' + perso.name]
                    })
                } else
                {
                    // Ajout d'un autre membre sans clan
                    statuts.push({
                        nameStatut: perso.statut,
                        membres: [perso.name]
                    })
                }
            }else if ((statuts.length > 0))
            {
                // Indentation des statuts et membres
                statuts.forEach(statut => {
                    if (statut.nameStatut == perso.statut)
                    {
                        // Ajout d'un autre membre
                        if (perso.clan != 'Inconnu')
                        {
                            // Ajout d'un autre membre avec clan
                            statut.membres.push(perso.clan + ' ' + perso.name)
                        } else
                        {
                            // Ajout d'un autre membre sans clan
                            statut.membres.push(perso.name)
                        }
                        trouve = true
                    }
                })

                // Ajout d'un nouveau statut
                if (!trouve)
                {
                    if (perso.clan != 'Inconnu')
                    {
                        // Création de l'objet du statut suivant
                        statuts.push({
                            nameStatut: perso.statut,
                            membres: [perso.clan + ' ' + perso.name]
                        })
                    } else
                    {
                        // Création de l'objet du statut suivant
                        statuts.push({
                            nameStatut: perso.statut,
                            membres: [perso.name]
                        })
                    }
                    trouve = false
                }
            }
        }
    })

    // Vérification
    statuts.forEach(statut => {
        miniFiche += '⭕️ *' + statut.nameStatut + '*\n' 
        // Récupération des ninjas ayant ce statut
        statut.membres.forEach(membre => {
            miniFiche += '▪️' + membre + '\n'
        })
        // Fin de liste des membres ayant ce statut
        miniFiche += '\n'
    })

    // Notification du bot
    miniFiche += '\n🥷🏽 Merci d\'avoir fait appel à moi'

    // Retour de la liste des statuts des ninjas
    return miniFiche
}

/*
    * RECUPERATION DES AGES DE MEMBRES *
*/
const listAge = () => {
    // Création des variables de stockage
    let miniFiche = '━━ *𝙰𝙶𝙴𝚂 𝙳𝙴𝚂 𝙽𝙸𝙽𝙹𝙰𝚂 𝚂𝙽𝙶* ━━ \n\n'
    let ages = []
    let trouve = false
    // Récupération des âges
    dataPerso.forEach(perso => {
        // Vérification suivant les perso valides
        if (perso.actif)
        {
            if (ages.length == 0)
            {
                // Création du premier objet âge
                if (perso.clan != 'Inconnu')
                {
                    // Ajout d'un autre membre avec clan
                    ages.push({
                        numAge: perso.age,
                        membres: [perso.clan + ' ' + perso.name]
                    })
                } else
                {
                    // Ajout d'un autre membre sans clan
                    ages.push({
                        numAge: perso.age,
                        membres: [perso.name]
                    })
                }
                
            }else if (ages.length > 0)
            {
                // Indentation des âges et membres
                ages.forEach(age => {
                    if (age.numAge == perso.age)
                    {
                        if (perso.clan != 'Inconnu')
                        {
                            // Ajout d'un autre membre avec clan
                            age.membres.push(perso.clan + ' ' + perso.name)
                        } else
                        {
                            // Ajout d'un autre membre sans clan
                            age.membres.push(perso.name)
                        }
                        trouve = true
                    }
                })
                // Ajout d'une nouvelle catégorie d'âge
                if (!trouve)
                {
                    if (perso.clan != 'Inconnu')
                    {
                        // Création de l'objet d'âge suivant
                        ages.push({
                            numAge: perso.age,
                            membres: [perso.clan + ' ' + perso.name]
                        })
                    } else
                    {
                        // Création de l'objet d'âge suivant
                        ages.push({
                            numAge: perso.age,
                            membres: [perso.name]
                        })
                    }
                }
            }
        }
        // vérification de la variable "trouve"
        if (trouve)
        {
            trouve = false
        }
    })

    // Vérification
    ages.forEach(age => {
        miniFiche += '⭕️ \`\`\`Ninjas de\`\`\` : *' + age.numAge + 'ans*\n'
        // Récupération des ninjas de cet âge
        age.membres.forEach(membre => {
            miniFiche += '▪️' + membre + '\n'
        })
        // Fin de liste des membres classé par âge
        miniFiche += '\n'
    })

    // Notification du bot
    miniFiche += '\n🥷🏽 Merci d\'avoir fait appel à moi'

    // Retour de la liste des ninjas classés par âge
    return miniFiche
}

/*
    * RECUPERATION DES PERSO PRINCIPAUX, SECONDAIRES ET LIBRES *
*/
const listPersoPSL = (type) => {
    // Variables de stockage
    let liste = ''
    let listPerso = []
    // Tri
    dataPerso.forEach(perso => {
        // Vérification
        if (perso.type == type && perso.actif)
        {
            if (perso.clan == 'Inconnu')
            {
                // Récupération de perso sans clan
                listPerso.push(perso.name)
            } else
            {
                // Récupération du perso de clan
                listPerso.push(perso.clan + ' ' + perso.name)
            }
        }
    })

    // Critères
    if (type == 'P')
    {
        // Titre
        liste += '♨️ *LISTE PERSO PRINCIPAUX* ♨️\n\n'
    } else if (type == 'S')
    {
        // Titre
        liste += '♨️ *LISTE PERSO SECONDAIRES* ♨️\n\n'
    } else if (type == 'L')
    {
        // Titre
        liste += '♨️ *LISTE PERSO LIBRES* ♨️\n\n'
    }

    // Traitement de la liste
    listPerso.forEach(perso => {
        // Liste
        liste += '▫️' + perso + '\n'
    })

    // Récupération de la liste
    if ((liste != '♨️ *LISTE PERSO PRINCIPAUX* ♨️\n\n') && (liste != '♨️ *LISTE PERSO SECONDAIRES* ♨️\n\n') && (liste != '♨️ *LISTE PERSO LIBRES* ♨️\n\n'))
    {
        // Notification du bot
        liste += '\n🥷🏽 Merci d\'avoir fait appel à moi'
        // Retour des résultats
        return liste
    } else
    {
        return '🥷🏽 Aucun perso de ce type disponible'
    }
}

const selectFichePerso2 = (namePerso) => {
    // Création de la variable de stockage de la fiche
    let fiche = ''

    dataPerso.forEach(perso => {
        if ((perso.name == namePerso) || (perso.name.toLowerCase() == namePerso))
        {
            /* PARTIE 1 - DEBUT */
            fiche = '▃▅▆█ *FICHE PERSO N° SNG' + perso.id + '* █▆▅▃\n\n'
            fiche += '*Clan* : ' + perso.clan + '\n'
            fiche += '*Nom d\'avatar* : ' + perso.name + '\n'
            fiche += '*Pays d\'origine* : ' + perso.pays + '\n'
            fiche += '*Village actuel* : ' + perso.village + '\n'
            fiche += '*Lien(s) de parenté* : ' + perso.parente + '\n\n'
            fiche += '*Âge* : ' + perso.age + 'ans\n'
            fiche += '*Taille* : ' + perso.taille + '\n'
            fiche += '*Grade* : ' + perso.grade + '\n'
            fiche += '*User* : ' + perso.user + '\n\n'
            fiche += '*D.N. Perso* : ' + perso.dnPerso + '\n'
            fiche += '*D.N. Membre* : ' + perso.dnMembre + '\n\n'
    
            // Affichage des affinités
            fiche += '*Affinité(s)* : '
            perso.affinite.forEach(element => {
                fiche += element + ' '
            })
            // Affichage des capacités héréditaires
            fiche += '\n*Cap. Héréditaire(s)* : '
            perso.capHereditaire.forEach(capacite => {
                fiche += capacite + ' '
            })
    
            /* PARTIE 2 - AJUSTEMENT */
            fiche += '\n*Cap. / Comp. spéciale* : ' + perso.capCompSpeciale + '\n'
            fiche += '*Statut particulier* : ' + perso.statut + '\n\n'
            fiche += '・・・・・・ ᎫႮͲՏႮ【' + (perso.jutsu[0].listJutsu.length + perso.jutsu[1].listJutsu.length + perso.jutsu[2].listJutsu.length)  +'】・・・・・・\n'
    
            // Liste des jutsus de l'avatar, triées par rang
            perso.jutsu.forEach(niveau => {
                // Liste des jutsu par rang
                fiche += '*' + niveau.titre + '*\n'
                // Liste des techniques
                niveau.listJutsu.forEach(technique => {
                    fiche += '▪️' + technique + '\n'
                })
            })
    
            /* PARTIE 3 - AJUSTEMENT */
            fiche += '・・・・・・・・・・・・・・・・・・・\n\n'
            fiche += '*C̬O̬M̬P̬É̬T̬E̬N̬C̬E̬S̬ N̬I̬N̬J̬A̬* ●  ' + perso.chakra + ' 🅤🅣 ●\n'
            fiche += '▫️Agilité :                            : *' + perso.competences.agilite + '/100*\n'
            fiche += '▫️Vitesse                            : *' + perso.competences.vitesse + '/100*\n'
            fiche += '▫️Précision                         : *' + perso.competences.precision + '/100*\n'
            fiche += '▫️Endurance                       : *' + perso.competences.endurance + '/' + perso.competences.limiteClan + '*\n'
            fiche += '▫️Force brute                      : *' + perso.competences.force + '/100*\n'
            fiche += '▫️Capacités sensorielles  : *' + perso.competences.senso + '/100*\n'
            fiche += '▫️Étreinte Psychique         : *' + perso.competences.etreinte + '*\n\n'
            fiche += '*Ꭼ́ϘႮᏆᏢᎬᎷᎬΝͲՏ ΝᏆΝᎫᎪ*\n'
    
            // Affichage des équipements
            perso.equipements.forEach(equipement => {
                if (equipement.rouleau)
                {
                    // Ligne de l'équipement
                    fiche += '▪️' + equipement.libelle + ' : ' + equipement.quantite + '\n'
    
                    // Sous-équipements du rouleau
                    if (equipement.sousEquiements.length > 0)
                    {
                        equipement.sousEquiements.forEach(sousEquipement => {
                            // Ligne d'un sous-équipement
                            fiche += '▫️' + sousEquipement.libelle + ' : ' + sousEquipement.quantite + '\n'
                        })
                    }
                } else
                {
                    // Ligne d'un équipement
                    fiche += '▪️' + equipement.libelle + ' : ' + equipement.quantite + '\n'
                }
            })
    
            /* PARTIE 3 - AJUSTEMENT */
            fiche += '\n*Ꭼ́ϘႮᏆᏢᎬᎷᎬΝͲ ᏢᎡᏆΝᏟᏆᏢᎪᏞ* : ' + perso.armePrincipale + '\n\n'
            fiche += '╚»★ *$₮₳₮Ʉ₮ ⲘƗ$$ƗØ₦$* ★«╝\n'
            fiche += '▪️Rang D : ' + perso.missions[0].reussi + ' réussie(s) sur ' + perso.missions[0].total + '\n'
            fiche += '▪️Rang C : ' + perso.missions[1].reussi + ' réussie(s) sur ' + perso.missions[1].total + '\n'
            fiche += '▪️Rang B : ' + perso.missions[2].reussi + ' réussie(s) sur ' + perso.missions[2].total + '\n'
            fiche += '▪️Rang A : ' + perso.missions[3].reussi + ' réussie(s) sur ' + perso.missions[3].total + '\n'
            fiche += '▪️Rang S : ' + perso.missions[4].reussi + ' réussie(s) sur ' + perso.missions[4].total + '\n\n'
            fiche += '░▒▓█ *EXPÉRIENCE NINJA* █▓▒░\n'
    
            // Affichage des expériences ninja
            perso.experience.forEach(xp => {
                // Ligne d'expérience
                fiche += '▪' + xp.date + ' : ' + xp.description + '\n'
            })
        }
    })

    // Vérification de la présence des données de la fiche
    if (fiche != '')
    {
        // Envoie de la fiche perso
        return fiche
    } else
    {
        // Notification d'absence de données de fiches
        return '🥷🏽 Hum... Données indisponibles'
    }
}

/*
    * RECUPERATION DES MEMBRES INSCRITS AU CLASSEMENT SHONOBI *
*/
const listPersoClassement = (newMsg) => {
    // Variables de stockage
    let liste = ''
    let listPerso = {
        dataCompte: '',
        listeNum: []
    }
    let avatarClassement = []
    // Tri
    dataPersoClassement.forEach(perso => {
        // Récupération des numéro de membre
        listPerso.listeNum.push(perso.user)
        // Stockage des avatars
        let avatars = []
        // Ajout des avatar du membre
        perso.perso.forEach(avatar => {
            if (avatar.clan != 'Inconnu')
            {
                // Ajout d'avatar avec clan
                avatars.push(avatar.clan + ' ' + avatar.nom)
            } else
            {
                // Ajout d'avatar sans clan
                avatars.push(avatar.nom)
            }
        })
        // Mise à disposition
        avatarClassement.push(avatars)
    })

    // Titre
    liste += '♨️ *MEMBRES CLASSEMENT SHINOBI* ♨️\n\n'

    // Traitement de la liste
    // listPerso.listeNum.forEach(perso => {
    //     // Liste
    //     liste += '▫️ [ @' + perso + ' ]\n'
    // })

    for (let index = 0; index <  listPerso.listeNum.length; index++)
    {
        // Récupération du numéro
        const perso =  listPerso.listeNum[index]
        // Ajout du tag du membre
        liste += '▫️ [ @' + perso + ' ]\n'
        // Affichage des avatar du membre
        avatarClassement[index].forEach(avatar => {
            liste += '~ _' + avatar + '_\n'
        })
        liste += '\n'
    }

    // Récupération de la liste
    if (liste != '♨️ *MEMBRES CLASSEMENT SHINOBI* ♨️\n\n')
    {
        // Notification du bot
        liste += '\n🥷🏽 \`\`\`Bon jeu à vous !\`\`\`'
        listPerso.dataCompte = liste
        // Retour des résultats
        tagueAllCompte(listPerso, newMsg)

    } else
    {
        return '🥷🏽 Aucun membre du classement disponible'
    }
}

/*
    * RECUPERATION D'UNE FICHE PERSO *
*/
const selectFichePerso = (namePerso, newMsg, groupe) => {
    // Création des variables de stockage de la fiche
    let fiche = ''
    let ficheData = {
        dataFiche: '',
        number: ''
    }

    dataPerso.forEach(perso => {
        if ((perso.name == namePerso) || (perso.name.toLowerCase() == namePerso))
        {
            /* PARTIE 1 - DEBUT */
            fiche = '▃▅▆█ *FICHE PERSO N° SNG' + perso.id + '* █▆▅▃\n\n'
            fiche += '*Clan* : ' + perso.clan + '\n'
            fiche += '*Nom d\'avatar* : ' + perso.name + '\n'
            fiche += '*Pays d\'origine* : ' + perso.pays + '\n'
            fiche += '*Village actuel* : ' + perso.village + '\n'
            fiche += '*Lien(s) de parenté* : ' + perso.parente + '\n\n'
            fiche += '*Âge* : ' + perso.age + 'ans\n'
            fiche += '*Taille* : ' + perso.taille + ' m\n'
            fiche += '*Grade* : ' + perso.grade + '\n'
            fiche += '*User* : ' + '@' + perso.user + '\n\n'
            fiche += '*D.N. Perso* : ' + perso.dnPerso + '\n'
            fiche += '*D.N. Membre* : ' + perso.dnMembre + '\n\n'
    
            // Affichage des affinités
            fiche += '*Affinité(s)* :'
            perso.affinite.forEach(element => {
                fiche += ' +' + element
            })
            // Affichage des capacités héréditaires
            fiche += '\n*Cap. Héréditaire(s)* :'
            perso.capHereditaire.forEach(capacite => {
                fiche += ' +' + capacite
            })
    
            /* PARTIE 2 - AJUSTEMENT */
            fiche += '\n*Cap. / Comp. spéciale* : ' + perso.capCompSpeciale + '\n'
            fiche += '*Statut particulier* : ' + perso.statut + '\n\n'
            fiche += '・・・・・・ ᎫႮͲՏႮ【' + (perso.jutsu[0].listJutsu.length + perso.jutsu[1].listJutsu.length + perso.jutsu[2].listJutsu.length)  +'】・・・・・・\n'
    
            // Liste des jutsus de l'avatar, triées par rang
            perso.jutsu.forEach(niveau => {
                // Liste des jutsu par rang
                fiche += '*' + niveau.titre + '*\n'
                // Liste des techniques
                niveau.listJutsu.forEach(technique => {
                    fiche += '▪️' + technique + '\n'
                })
            })
    
            /* PARTIE 3 - AJUSTEMENT */
            fiche += '・・・・・・・・・・・・・・・・・・・\n\n'
            fiche += '*C̬O̬M̬P̬É̬T̬E̬N̬C̬E̬S̬ N̬I̬N̬J̬A̬* ●  ' + perso.chakra + ' 🅤🅣 ●\n'
            fiche += '▫️Agilité                             : *' + perso.competences.agilite + '/250*\n'
            fiche += '▫️Vitesse                            : *' + perso.competences.vitesse + '/250*\n'
            fiche += '▫️Précision                         : *' + perso.competences.precision + '/100*\n'
            fiche += '▫️Endurance                       : *' + perso.competences.endurance + '/' + perso.competences.limiteClan + '*\n'
            fiche += '▫️Force brute                      : *' + perso.competences.force + '/250*\n'
            fiche += '▫️Capacités sensorielles  : *' + perso.competences.senso + '/250*\n'
            fiche += '▫️Étreinte Psychique         : *' + perso.competences.etreinte + '*\n\n'
            fiche += '*Ꭼ́ϘႮᏆᏢᎬᎷᎬΝͲՏ ΝᏆΝᎫᎪ*\n'
    
            // Affichage des équipements
            perso.equipements.forEach(equipement => {
                if (equipement.rouleau)
                {
                    // Ligne de l'équipement
                    fiche += '▪️' + equipement.libelle + ' : ' + equipement.quantite + '\n'
    
                    // Sous-équipements du rouleau
                    if (equipement.sousEquiements.length > 0)
                    {
                        equipement.sousEquiements.forEach(sousEquipement => {
                            // Ligne d'un sous-équipement
                            fiche += '▫️' + sousEquipement.libelle + ' : ' + sousEquipement.quantite + '\n'
                        })
                    }
                } else
                {
                    // Ligne d'un équipement
                    fiche += '▪️' + equipement.libelle + ' : ' + equipement.quantite + '\n'
                }
            })
    
            /* PARTIE 3 - AJUSTEMENT */
            fiche += '\n*Ꭼ́ϘႮᏆᏢᎬᎷᎬΝͲ ᏢᎡᏆΝᏟᏆᏢᎪᏞ* : ' + perso.armePrincipale + '\n\n'
            fiche += '╚»★ *$₮₳₮Ʉ₮ ⲘƗ$$ƗØ₦$* ★«╝\n'
            fiche += '▪️Rang D : ' + perso.missions[0].reussi + ' réussie(s) sur ' + perso.missions[0].total + '\n'
            fiche += '▪️Rang C : ' + perso.missions[1].reussi + ' réussie(s) sur ' + perso.missions[1].total + '\n'
            fiche += '▪️Rang B : ' + perso.missions[2].reussi + ' réussie(s) sur ' + perso.missions[2].total + '\n'
            fiche += '▪️Rang A : ' + perso.missions[3].reussi + ' réussie(s) sur ' + perso.missions[3].total + '\n'
            fiche += '▪️Rang S : ' + perso.missions[4].reussi + ' réussie(s) sur ' + perso.missions[4].total + '\n\n'
            fiche += '░▒▓█ *EXPÉRIENCE NINJA* █▓▒░\n'
    
            // Affichage des expériences ninja
            perso.experience.forEach(xp => {
                // Ligne d'expérience
                fiche += '▪' + xp.date + ' : ' + xp.description + '\n'
            })

            // Enregistrement dans l'objet
            ficheData.dataFiche = fiche
            ficheData.number = perso.user
        }
    })

    // Vérification de la présence des données de la fiche
    if (fiche != '')
    {
        // Envoie des données de la fiche perso
        tagueFiche(ficheData, newMsg, groupe)
    } else
    {
        // Notification d'absence de la fiche
        sendMessage(groupe, '🥷🏽 Hum... Données indisponibles')
    }
}

/*
    * CREATION D'UNE FICHE AVATAR *
*/
const newPersoSNG = (newMsg) => {
    // Création de l'objet du nouvel utilisateur
    let newPerso = {
        actif: true,
        type: "",
        id: 0,
        clan: "",
        name: "",
        pays: "",
        village: "",
        parente: "",
        age: 12,
        taille: 0,
        grade: "Genin",
        user: "",
        dnPerso: "",
        dnMembre: "",
        affinite: [],
        capHereditaire: ["Aucune"],
        capCompSpeciale: "Aucune",
        statut: "Aucun",
        jutsu: [
            {
                titre: "Rang E, D et C",
                listJutsu: []
            },
            {
                titre: "Rang B et A",
                listJutsu: [" ~Aucune~"]
            },
            {
                titre: "Rang S et autres",
                listJutsu: [" ~Aucune~"]
            }
        ],
        competences: {
            agilite: 0,
            vitesse: 0,
            precision: 0,
            endurance: 0,
            force: 0,
            senso: 0,
            etreinte: "Random",
            limiteClan: 100
        },
        chakra: 0,
        equipements: [],
        armePrincipale: "Aucune",
        missions: [
            {
                rang: "D",
                reussi: 0,
                total: 0
            },
            {
                rang: "C",
                reussi: 0,
                total: 0
            },
            {
                rang: "B",
                reussi: 0,
                total: 0
            },
            {
                rang: "A",
                reussi: 0,
                total: 0
            },
            {
                rang: "S",
                reussi: 0,
                total: 0
            }
        ],
        experience: [
            {
                date: new Date().toLocaleDateString(),
                description: 'Création du perso et intégration dans la communauté.'
            }
        ]
    }

    // Trie des données du nouveau perso
    const detailFiche = newMsg.body.split('\n')

    // Récupération du dernier id de la base de données
    let newId = dataPerso['length'] + 1

    // Vérification de chaque ligne de la fiche perso
    for (let index = 0; index < detailFiche.length; index++)
    {
        const ligne = detailFiche[index]
        if (ligne.includes('NEW FICHE PERSO'))
        {
            // Initialisation de l'id du nouveau perso
            newPerso.id = newId

        } else if (ligne.includes('Type'))
        {
            // Récupération du type d'avatar
            const type = ligne.substr(9).trim().toLowerCase()

            // Ajout du perso selon son type
            switch (type)
            {
                case 'libre':
                    // Ajout du perso libre
                    newPerso.type = 'L'
                    break

                case 'secondaire':
                    // Ajout du perso secondaire
                    newPerso.type = 'S'
                    break
            
                default:
                    // Ajout du perso principal
                    newPerso.type = 'P'
                    break
            }

        } else if (ligne.includes('Clan'))
        {
            // Récupération du clan de l'avatar
            newPerso.clan = ligne.substr(9).trim()

        } else if (ligne.includes('Nom d\'avatar'))
        {
            // Récupération du nom de l'avatar
            newPerso.name = ligne.substr(17).trim()

        } else if (ligne.includes('Pays d\'origine'))
        {
            // Récupération du pays d'origine
            newPerso.pays = ligne.substr(19).trim()

        } else if (ligne.includes('Village actuel'))
        {
            // Récupération du village de l'avatar
            newPerso.village = ligne.substr(19).trim()

        } else if (ligne.includes('Lien(s) de parenté'))
        {
            // Ajout du lien de parenté
            newPerso.parente = ligne.substr(23).trim()

        } else if (ligne.includes('Taille'))
        {
            // Récupération de la taille
            newPerso.taille = parseFloat(ligne.substr(11, 4).trim())

        } else if (ligne.includes('User'))
        {
            // Récupération du numéro d'utilisateur de l'avatar
            newPerso.user = ligne.substr(10).trim()

        } else if (ligne.includes('D.N. Perso'))
        {
            newPerso.dnPerso = ligne.substr(15).trim()

        } else if (ligne.includes('D.N. Membre'))
        {
            // Ajout de la date d'anniversaire du perso
            newPerso.dnMembre = ligne.substr(16).trim()

        } else if (ligne.includes('Affinité(s)'))
        {
            // Ajout de l'affinité
            const affinite = ligne.substr(16).trim()
            newPerso.affinite.push(affinite)

        } else if (ligne.includes('Jutsu initial'))
        {
            // Ajout du jutsu
            const jutsu = ligne.substr(18).trim()
            newPerso.jutsu[0].listJutsu.push(jutsu)

        } else if (ligne.includes('>'))
        {
            // Récupération des équipements
            const unEquipement = ligne.split(' : ')
            const nameEquipement = unEquipement[0].substr(2).trim()
            const nbEquipement = parseInt(unEquipement[1])
            // Ajout de l'équipement
            newPerso.equipements.push({
                libelle: nameEquipement,
                quantite: nbEquipement,
                principal: false,
                rouleau: false,
                sousEquiements: []
            })
        }
    }

    // Ajout du perso à la base de données
    dataPerso.push(newPerso)

    // Mise à jour de la fiche perso
    mAjFichePerso()

    // Vérification de la présence du compte du membre
    dataPerso.forEach(perso => {
        comptes.forEach(compte => {
            if (perso.clan != 'Inconnu')
            {
                // Vérification du nom de l'avatar avec clan
                if ((perso.clan + ' ' + perso.name) == compte.avatar)
                {
                    if (perso.id != compte.id)
                    {
                        // Mise à jour de l'identifiant
                        compte.id = perso.id
                    }
                }
            } else
            {
                // Vérification du nom de l'avatar sans clan
                if (compte.avatar == newPerso.name)
                {
                    if (perso.id != compte.id)
                    {
                        // Mise à jour de l'identifiant
                        compte.id = perso.id
                    }
                }
            }
        })
    })

    // Mise à jour des comptes
    mAjComptePerso()

    // Affichage du perso
    newMsg.reply('🥷🏽 ' + newId + 'e nouvel avatar créé !')
}

/*
    * RECUPERATION D'UNE FICHE PERSO *
*/
const selectCompte = async(newMsg, groupe) => {
    // Variables de stockage des comptes
    let double = false
    let trouve = false
    let ficheCompte = {
        dataCompte: '',
        num: ''
    }
    let compteNinja = ''

    // Récupération du num
    const numPerso = await newMsg.getContact()

    // Récupération de tous les comptes disponibles
    comptes.forEach(compte => {
        if (compte.utilisateur == numPerso.number)
        {
            // Vérification de fiche double
            if (double)
            {
                // Deuxième fiche trouvée
                compteNinja += '\n\n\n♨️ *FICHE DE COMPTE AVATAR* ♨️\n\n'
            } else
            {
                // Fiche trouvée
                compteNinja += '♨️ *FICHE DE COMPTE AVATAR* ♨️\n\n'
            }
            // Ajout du nom du perso
            compteNinja += '_' + compte.grade + '_ *' + compte.avatar + '*, voici ci-dessous vos données :\n\n'

            // Données du perso
            compteNinja += '▪️Vous : @' + compte.utilisateur + '\n'
            compteNinja += '▪️Bourse ninja : ' + compte.solde + ' M$\n'
            compteNinja += '▪️Job(s) : '

            // Ajout des jobs du membres dans la communauté
            if (compte.jobs.length != 0)
            {
                // Saut de ligne
                compteNinja += '\n'
                // Ajout des jobs
                compte.jobs.forEach(job => {
                    compteNinja +=  '   •' + job + '\n'
                })
            } else 
            {
                // Par défaut
                compteNinja += 'Chômeur\n'
            }
            // Saut de ligne
            compteNinja += '\n'

            // Ajout des armes principales de l'avatar
            if (compte.armes.length != 0)
            {
                if (compte.armes.length == 1)
                {
                    // Notification des armes
                    compteNinja += 'Vous avez actuellement *' + compte.armes.length + '* équipement principal :\n'
                    // Ajout de l'arme
                    compteNinja += '▫️' + compte.armes[0]
                } else 
                {
                    // Notification des armes
                    compteNinja += 'Vous avez actuellement *' + compte.armes.length + '* équipements principaux :'
                    // Ajout des armes
                    compte.armes.forEach(arme => {
                        compteNinja += '\n▫️' + arme
                    })
                }
            } else
            {
                // Notification des armes
                compteNinja += 'Vous n\'avez actuellement aucun équipement principal.'
            }

            // Notification de fin de ligne
            compteNinja += '\n\n🥷🏽 Merci et à bientôt.'

            // Sauvegarde du numéro
            ficheCompte.num = compte.utilisateur

            // Mention des données de l'avatar trouvé
            trouve = true

            // Mention d'une première présence de fiche
            double = true
        }
    })

    // Récupération finale de la fiche
    ficheCompte.dataCompte = compteNinja

    // Vérification de la présence des données de la fiche
    if (trouve)
    {
        // Envoi des données deu compte
        tagueCompte(ficheCompte, newMsg, groupe)
    } else
    {
        // Notification d'absence des données
        sendMessage(groupe, '🥷🏽 Données indisponibles, veuillez intégrer la base de données.')
    }
}

/*
    * CREATION D'UNE TEAM *
*/
const createTeamShinobi = async(newMsg) => {
    // Récupération
    if (newMsg.hasQuotedMsg)
    {
        // Récupération du message tagué
        const message = await newMsg.getQuotedMessage()

        const detailFiche = message.body.split('\n')

        // Récupération du nom de la team à ajouter
        const nameTeam = newMsg.body.split('\n')

        // Création de l'objet fiche de team
        let dataTeam = {
            id: dataTeamClassement['length'] + 1,
            rang: 0,
            name: "",
            creation: "",
            cagnotte: 0,
            reputation: {
                BPM: 0,
                BTM: 0
            },
            membres: {
                leader: {
                    id: 0,
                    user: 0
                },
                sousChef: {
                    id: 0,
                    user: 0
                },
                membres: []
            },
            recompenses: [
                {
                    name: "rang S",
                    nb: 0
                },
                {
                    name: "rang A",
                    nb: 0
                },
                {
                    name: "rang B",
                    nb: 0
                },
                {
                    name: "rang C",
                    nb: 0
                },
                {
                    name: "rang D",
                    nb: 0
                },
                {
                    name: "rang E",
                    nb: 0
                },
                {
                    name: "PCN",
                    nb: 0
                }
            ],
            defi: {
                victoireMois: 0,
                defaiteMois: 0,
                nulMois: 0,
                totalVictoire: 0,
                totalDefaite: 0,
                total: 0
            }
        }
        
        if (nameTeam[2] != undefined)
        {
            // Initialisation du nom de la nouvelle Team
            dataTeam.name = nameTeam[2].trim()

            // Vérification de chaque ligne de la fiche perso
            for (let index = 6; index < detailFiche.length; index++)
            {
                const ligne = detailFiche[index]
                if (ligne.includes('ᴄᴀɢɴᴏᴛᴛᴇ'))
                {
                    // Initialisation de la cagnotte
                    const cash = ligne.substr(15).split(' M$')
                    dataTeam.cagnotte = parseInt(cash[0])
                } else if (ligne.includes('ᴄʀᴇ́ᴇ́ᴇ'))
                {
                    // Initialisation de la date de création
                    dataTeam.creation = ligne.substr(19).trim()
                } else if (ligne.includes('Chef'))
                {
                    // Chef de team
                    dataTeam.membres.leader.id = 1
                    dataTeam.membres.leader.user = parseInt(ligne.substr(10).trim())
                } else if (ligne.includes('Sous-chef'))
                {
                    // Sous-chef de team
                    dataTeam.membres.sousChef.id = 2
                    dataTeam.membres.sousChef.user = parseInt(ligne.substr(15).trim())
                } else if (ligne.includes('+'))
                {
                    // Ajout des membres de la team
                    dataTeam.membres.membres.push({
                        id: 3,
                        user: parseInt(ligne.substr(3).trim())
                    })
                }
            }

            // Ajout de la team au classement
            dataTeamClassement.push(dataTeam)
            // Mise à jour des team du classement
            mAjFicheTeamClassement()
            // Notification d'ajout
            newMsg.reply('*Nouvelle team au classement !*')
        }else
        {
            // Notification d'erreur
            newMsg.reply('*Nom de "team" manquant !*')
        }
    }
}

/*
    * CREATION D'UN PERSO SHINOBI *
*/
const createPersoShinobi = (newMsg) => {
    // Création de l'objet fiche de perso shinobi
    let dataPersoShinobi = {
        id: dataPersoClassement['length'] + 1,
        team: false,
        nameTeam: '',
        user: 0,
        perso: [],
        reputation: [
            {
                titre: 'BPM',
                nb: 0
            },
            {
                titre: 'Arbitrage',
                nb: 0,
                supervise: 0,
                qualite: []
            },
            {
                gagne: 0,
                perdu: 0,
                total: 0
            }
        ]
    }

    // Variable de vérification
    let double = false
    let trouve = false

    // Récupération du numéro du perso
    const preparationPerso = newMsg.body.split('\n')
    const numPerso = preparationPerso[2].substr(1).trim()

    dataPersoClassement.forEach(perso => {
        if (perso.user == numPerso)
        {
            // Vérification des perso
            dataPersoClassement.forEach(persoClassement => {
                // Vidange des perso actuels
                persoClassement.perso = []

                // Récupération des avatars
                dataPerso.forEach(perso => {
                    if (perso.actif && perso.user == persoClassement.user)
                    {
                        // Vérification de fiche double
                        if (double)
                        {
                            // Ajout du second perso
                            persoClassement.perso.push({
                                id: perso.id,
                                clan: perso.clan,
                                nom: perso.name
                            })
                        } else
                        {
                            // Ajout du premier perso
                            persoClassement.perso.push({
                                id: perso.id,
                                clan: perso.clan,
                                nom: perso.name
                            })
                        }
                
                        // Mention d'une première présence de fiche
                        double = true
                    }
                })
            })

            // Mention
            trouve = true

            // Réinitialisation de la variable
            double = false
        }
    })

    if (!trouve)
    {
        // Récupération de tous les comptes disponibles
        dataPerso.forEach(perso => {
            if (perso.user == numPerso)
            {
                // Vérification de fiche double
                if (double)
                {
                    // Ajout du second perso
                    dataPersoShinobi.perso.push({
                        id: perso.id,
                        clan: perso.clan,
                        nom: perso.name
                    })
                } else
                {
                    // Sauvegarde du numéro du perso
                    dataPersoShinobi.user = parseInt(numPerso)
                    console.log(dataPersoShinobi.user)

                    // Ajout du premier perso
                    dataPersoShinobi.perso.push({
                        id: perso.id,
                        clan: perso.clan,
                        nom: perso.name
                    })
                }

                // Mention des données de l'avatar trouvé
                trouve = true

                // Mention d'une première présence de fiche
                double = true
            }
        })

        // Ajout de la team au classement
        dataPersoClassement.push(dataPersoShinobi)
    }

    // Vérification de la présence des données de la fiche
    if (trouve)
    {
        // Mise à jour des team du classement
        mAjFichePersoClassement()
        
        // Notification d'enregitrement
        newMsg.reply('🥷🏽 *Mise à jour des perso du classement !*')
    } else
    {
        // Notification d'absence d'avatar
        newMsg.reply('🥷🏽 Le membre n\'a pas d\'avatar !')
    }
}

/*
    * RECUPERATION D'UNE FICHE DE TEAM *
*/
const selectTeamClassement = (nameTeam, newMsg, groupe) => {
    // Création des variables de stockage de la fiche
    let fiche = ''
    let ficheData = {
        dataCompte: '',
        numChef: 0,
        numSousChef: 0,
        listeNum: []
    }

    dataTeamClassement.forEach(team => {
        if ((team.name == nameTeam) || (team.name.toLowerCase() == nameTeam.toLowerCase()))
        {
            // Remplissage de la fiche de team
            fiche = '✦✧ *ғɪᴄʜᴇ ᴅᴇ ᴄʀᴇ́ᴀᴛɪᴏɴ ᴅᴇ ᴛᴇᴀᴍ* ✧✦\n\n'
            fiche += '╔═════ ▓▓ ࿇  -  ࿇ ▓▓ ═════╗\n'
            const nb = parseInt(team.name.length / 2)
            const fin = 25 - nb
            for (let index = 0; index < fin; index++) {
                fiche += ' '
            }
            fiche += team.name + '\n'
            fiche += '╚═════ ▓▓ ࿇  -  ࿇ ▓▓ ═════╝\n\n'
            fiche += 'ᴄᴀɢɴᴏᴛᴛᴇ.    : '+ team.cagnotte +' M$\n'
            fiche += 'ᴄʀᴇ́ᴇ́ᴇ ʟᴇ       : ' + team.creation + '\n'
            fiche += 'ʀᴇ́ᴘᴜᴛᴀᴛɪᴏɴ  : ' + team.reputation.BPM + ' 💯 —  ' + team.reputation.BTM + ' 🌀\n\n'
            fiche += '🇲 🇪 🇲 🇧 🇷 🇪 🇸 \n'
            fiche += '+ Chef : @' + team.membres.leader.user + '\n'
            fiche += '+ Sous-chef : @' + team.membres.sousChef.user + '\n'
            ficheData.listeNum.push(team.membres.leader.user)
            ficheData.listeNum.push(team.membres.sousChef.user)
            team.membres.membres.forEach(membre => {
                fiche += '+ @' + membre.user + '\n'
                ficheData.listeNum.push(membre.user)
            })

            // Enregistrement dans l'objet
            ficheData.dataCompte = fiche
            ficheData.numChef = team.membres.leader.user
            ficheData.numSousChef = team.membres.sousChef.user
        }
    })

    // Vérification de la présence des données de la team
    if (fiche != '')
    {
        // Envoie des données de la fiche perso
        // sendMessage(groupe, ficheData.dataCompte)
        // tagueFiche(ficheData, newMsg, groupe)
        tagueAllCompte(ficheData, newMsg)
    } else
    {
        // Notification d'absence de la team
        newMsg.reply('🥷🏽 Cette team n\'est pas enregistrée')
    }
}

/*
    * RECUPERATION D'UNE FICHE DE PERSO CLASSEMENT *
*/
const selectPersoClassement = async(newMsg, groupe) => {
    // Variables de stockage des comptes
    let trouve = false
    let fichePersoClassement = {
        fiche: '',
        num: ''
    }
    let fichePersoC = ''

    // Récupération du num
    const numPerso = await newMsg.getContact()

    // Récupération de tous les comptes disponibles
    dataPersoClassement.forEach(perso => {
        if (perso.user == numPerso.number)
        {
            // Fiche trouvée
            fichePersoC += '┏━━━━━•ՏᎻᏆΝϴᏴᏆ ᏟᎪᎡᎠ•━━━━━┓\n\n'
            fichePersoC += 'Moi : @' + perso.user + '\n'
            if (perso.team)
            {
                fichePersoC += 'Statut : Membre de ' + perso.nameTeam + '\n\n'
            } else
            {
                fichePersoC += 'Statut : Mercenaire\n\n'
            }
            fichePersoC += '                웃 • AVATAR(S) • 웃 \n'
            perso.perso.forEach(avatar => {
                fichePersoC += '○ ' + avatar.clan + ' ' + avatar.nom + '\n'
            })

            fichePersoC += '\n💯 *ᏢᎪᏞᎷᎪᎡᎬ̀Տ* 💯\n'
            fichePersoC += '● ' + perso.reputation[0].nb + ' titre(s) \`\`\`BMP\`\`\`\n'
            fichePersoC += '● ' + perso.reputation[1].nb + ' combats arbitrés\n'
            fichePersoC += '● ' + perso.reputation[2].gagne + ' combat(s) gagnés sur ' + perso.reputation[2].total + '\n\n'
            fichePersoC += '          ᴀ ᴄᴏɴɴᴜ ʟᴀ ᴅᴇ́ғᴀɪᴛᴇ ' + perso.reputation[2].perdu + ' ғᴏɪs !\n'
            fichePersoC += '┗━━━━━━━━━━━━━━━━━━━━━━┛'

            // Sauvegarde du numéro
            fichePersoClassement.num = perso.user

            // Mention des données de la fiche trouvée
            trouve = true
        }
    })

    // Récupération finale de la fiche
    fichePersoClassement.fiche = fichePersoC

    // Vérification de la présence des données de la fiche
    if (trouve)
    {
        // Envoi des données deu compte
        taguePersoClassement(fichePersoClassement, newMsg, groupe)
    } else
    {
        // Notification d'absence des données
        newMsg.reply('🥷🏽 Vous ne faites pas partie du classement shinobi !')
    }
}

/*
    * CREATION D'UN COMPTE *
*/
const newCompteSNG = (newMsg) => {
    // Création de l'objet du nouvel utilisateur
    let newCompte = {
        id: 0,
        avatar: "",
        utilisateur: 0,
        grade: "",
        solde: 100,
        jobs: [],
        armes: []
    }
    
    // Trie des données du nouveau perso
    const avatar = newMsg.body.split(' : ')

    // Récupération du dernier id de la base de données
    let newId = comptes[(comptes.length - 1)].id

    // Déclaration de la variable de vérification
    let trouve = false

    // Récupération du perso
    dataPerso.forEach(perso => {
        if ((perso.name == avatar[1]) || (perso.name.toLowerCase() == avatar[1].toLowerCase()))
        {
            // Initialisation du compte
            newCompte.id = newId
            newCompte.utilisateur = parseInt(perso.user)
            newCompte.grade = perso.grade

            // Vérification du clan
            if (perso.clan == 'Inconnu')
            {
                // Ajout du compte sans le clan
                newCompte.avatar = perso.name
            } else {
                // Ajout du compte avec le clan
                newCompte.avatar = perso.clan + ' ' + perso.name
            }

            // Notification
            trouve = true
        }
    })

    // Vérification
    if (trouve)
    {
        // Ajout du nouveau compte à la base de données
        comptes.push(newCompte)
        // Mise à jour des comptes
        mAjComptePerso()
        // Notification finale
        newMsg.reply('🥷🏽 Nouveau Compte Créé !')
    } else
    {
        // Notification d'absence du compte
        newMsg.reply('🥷🏽 Navré, mais cette fiche est indisponibe.')
    }
}


/**
 * ***************************************************************************************
 */

/*
    * MISE A JOUR AVATAR DE LA BASE DONNEES *
*/
const mAjFichePersoPrime = () => {
    // Actualisation de la base de données
    fs.writeFileSync('./neon/fiches/persoPrime.json', JSON.stringify(persoPrime), 'utf8')
}

/*
    * CREATION D'UN PERSO PRIME *
*/
const createPersoPrime = (newMsg) => {
    // Création de l'objet du nouvel avatar
    let newPerso = {
        id: 0,
        pseudo: '',
        fortune: 2000,
        occupation: {
            libelle: '',
            exploration: 'SF'
        },
        grade: 'Soldat',
        void: '',
        rang: {
            titre: 'Rookie',
            logo: '🥉',
            categorie: '🐰',
            niveau: '1️⃣'
        },
        badge: '',
        portee: 5,
        competences: {
            vitesse: 1,
            senso: 1,
            reflexe: 1
        },
        xp: 0,
        pa: 0,
        badge: '',
        techniques: 0,
        armes: 0,
        boost: 0,
        trophee: 0
    }
    let top = false

    // Trie des données du nouveau perso
    const detailFiche = newMsg.body.split('\n')

    // Récupération du dernier id de la base de données
    let newId = persoPrime[(persoPrime.length - 1)].id

    // Vérification de chaque ligne de la fiche perso
    for (let index = 0; index < detailFiche.length; index++)
    {
        const ligne = detailFiche[index]
        if (ligne.includes('build'))
        {
            // Initialisation de l'id du nouveau perso
            newPerso.id = newId + 1
            top = true
            // newPerso.id = 1

        } else if (ligne.includes('Pseudo'))
        {
            // Récupération du clan de l'avatar
            newPerso.pseudo = ligne.substr(9).trim()

        } else if (ligne.includes('Voïd'))
        {
            // Récupération du nom de l'avatar
            newPerso.void = ligne.substr(7).trim()

        } else if (ligne.includes('Occupation'))
        {
            // Récupération du pays d'origine
            newPerso.occupation.libelle = ligne.substr(13).trim()
        }
    }

    if (top)
    {
        // Ajout du perso à la base de données
        persoPrime.push(newPerso)

        // Mise à jour de la fiche perso
        mAjFichePersoPrime()

        // Notification d'enregistrement
        newMsg.reply('🤖 Nouvelle card créée !')
        // newMsg.reply('🤖 nouvelle card créée !')
    }
}

/*
    * RECUPERATION D'UNE FICHE PERSO *
*/
const selectFichePersoPrime = (namePerso, newMsg, groupe) => {
    console.log('Sélection d\'un perso ')
    // Création des variables de stockage de la fiche
    let fiche = ''

    persoPrime.forEach(perso => {
        if ((perso.pseudo == namePerso) || (perso.pseudo.toLowerCase() == namePerso))
        {
            /* PARTIE 1 - DEBUT */
            fiche = '☆☆☆☆☆\n'
            fiche += '   *᚛᚜ 𝗨𝗥𝗣𝗚 :𝗘𝗹𝘆𝘀𝗶𝘂𝗺 𝗪𝗼𝗿𝗹𝗱🌀🎮⸎🌅*//\n\n'
            fiche += ' -------------------------------\n'
            fiche += ' ᚜ 🎴 *PLAYER CARDS*🎴᚛\n'
            fiche += '-------------------------------\n\n'
            fiche += '🆔 *PSEUDO*: ' + perso.pseudo + '\n'
            fiche += '💰 *FORTUN€*: ' + perso.fortune + '©🧭\n'
            fiche += '♉ *OCCUPATION*: ' + perso.occupation.libelle + '⚜️/'+ perso.occupation.exploration +'\n'
            fiche += '🎖️ *GRADE*: ' + perso.grade + '\n'
            fiche += '--------------\n'
            fiche += '🌀 *VOÏD*: ' + perso.void + '\n'
            fiche += '🎗️ *RANG*: ' + perso.rang.titre + perso.rang.logo + perso.rang.categorie + perso.rang.niveau + '\n'
            fiche += '🛡️ *BADGE*: ' + perso.badge + '\n'
            fiche += '♉ *PORTÉE*: ' + perso.portee + 'm\n'
            fiche += '----------------\n'
            fiche += '⚡ *VITESSE*: ' + perso.competences.vitesse + '/10🥉\n'
            fiche += '🔊 *SENSORIALITÉ*: ' + perso.competences.senso + '/10🥉\n'
            fiche += '💡 *REFLEXES*: ' + perso.competences.reflexe + '/10🥉\n'
            fiche += '----------------\n'
            fiche += '⏫ *XP*: ' + perso.xp + '/100\n'
            fiche += '✳️ *PA*: ' + perso.pa + '\n'
            fiche += '-----------------\n'
            fiche += '🏆 *TROPHÉES*: ' + perso.trophee + '\n'
            fiche += '🎴 *TECHNIQUES*: ' + perso.techniques + '\n'
            fiche += '🎴 *ARMES*: ' + perso.armes + '\n'
            fiche += '🎴 *BOOST*: ' + perso.boost
        }
    })

    // Vérification de la présence des données de la fiche
    if (fiche != '')
    {
        // Envoie des données de la fiche perso
        // tagueFiche(ficheData, newMsg, groupe)
        sendMessage(groupe, fiche)
    } else
    {
        // Notification d'absence de la fiche
        sendMessage(groupe, '🤖 *Perso indisponible*')
    }
}

/*
    * ACTUALISATION DE COMPETENCES *
*/
const actualisationCompetence = (fiche, data, competence) => {
    const donnee = data.split(' : ')
    if (donnee[1].substr(0, 1) == '+')
    {
        console.log('Ajout')
        // Récupération de nombre de PCN à ajouter
        const ajout = parseInt(donnee[1].substr(1))
        // Ajout des PCN
        fiche.competences[competence] += ajout
        return '▫️Ajout de ' + ajout + ' point(s) ' + competence +'\n'
    }
    if (donnee[1].substr(0, 1) == '-')
    {
        // Récupération de nombre de points à retirer
        const soustraction = parseInt(donnee[1].substr(1))
        // Soustraction des points
        fiche.competences[competence] -= soustraction
        // Note de l'actualisation
        return '▫️Soustraction de ' + soustraction + ' point(s) ' + competence +'\n'
    }
}

/*
    * ACTUALISATION DE POINTS *
*/
const actualisationPoint = (fiche, data, competence) => {
    const donnee = data.split(' : ')
    if (donnee[1].substr(0, 1) == '+')
    {
        // Récupération de nombre de PCN à ajouter
        const ajout = parseInt(donnee[1].substr(1))
        // Ajout des PCN
        fiche[competence] += ajout
        return '▫️Ajout de ' + ajout + ' point(s) ' + competence +'\n'
    }
    if (donnee[1].substr(0, 1) == '-')
    {
        // Récupération de nombre de points à retirer
        const soustraction = parseInt(donnee[1].substr(1))
        // Soustraction des points
        fiche[competence] -= soustraction
        // Note de l'actualisation
        return '▫️Soustraction de ' + soustraction + ' point(s) ' + competence +'\n'
    }
}

/*
    * ACTUALISATION COMPLETE DE LA FICHE PERSO PRIME *
*/
const actualisationFichePrime = (recap, newMsg) => {
    // Tri du récapitulatif et répartition des requêtes
    const requete = recap.split('\n')
    // Récupération du nom de l'avatar
    const namePerso = requete[2].substr(0).trim()

    // Variable de vérification d'actualisation
    let actualisation = false
    let recapitulatif = '*RECAPITULATIF D\'ACTUALISATION*\n\n'

    // Recherche de la fiche perso
    persoPrime.forEach(perso => {
        if ((perso.pseudo == namePerso) || (perso.pseudo.toLowerCase() == namePerso.toLowerCase()))
        {
            // Actualisation des données de la fiche
            requete.forEach(ligne => {
                // Actualisation des PCN
                if (ligne.substr(2, 4) == 'comp')
                {
                    switch (ligne.substr(7, 1))
                    {
                        case 'V':
                            // Actualisation des PCN vitesse
                            recapitulatif += actualisationCompetence(perso, ligne, 'vitesse')
                            break
                        case 'R':
                            // Actualisation des PCN endurance
                            recapitulatif += actualisationCompetence(perso, ligne, 'reflexe')
                            break
                        case 'S':
                            // Actualisation des PCN capacités sensorielles
                            recapitulatif += actualisationCompetence(perso, ligne, 'senso')
                            break
                    }
                }
                // Actualisation du pseudo
                if (ligne.substr(2, 6).toLowerCase() == 'pseudo')
                {
                    // Actualisation du pseudo
                    recapitulatif += '▫️' + perso.pseudo
                    perso.pseudo = ligne.substr(11).trim()
                    recapitulatif += ' => _'+ perso.pseudo +'_\n'
                }
                // Actualisation de la fortune
                if (ligne.substr(2, 7).toLowerCase() == 'fortune')
                {
                    // Modification de la fortune
                    recapitulatif += actualisationPoint(perso, ligne, 'fortune')
                }
                // Actualisation du badge
                if (ligne.substr(2, 5).toLowerCase() == 'badge')
                {
                    // Actualisation du badge
                    recapitulatif += '▫️' + perso.badge
                    perso.badge = ligne.substr(10).trim()
                    recapitulatif += ' => _'+ perso.badge +'_\n'
                }
                // Actualisation du void
                if (ligne.substr(2, 4).toLowerCase() == 'void')
                {
                    // Actualisation du void
                    recapitulatif += '▫️' + perso.void
                    perso.void = ligne.substr(9).trim()
                    recapitulatif += ' => _'+ perso.void +'_\n'
                }
                // Actualisation de la portée d'attaque
                if (ligne.substr(2, 6).toLowerCase() == 'portee')
                {
                    // Actualisation de la portée d'attaque
                    recapitulatif += '▫️' + perso.portee
                    perso.portee = ligne.substr(11).trim()
                    recapitulatif += 'm => _'+ perso.portee +'m_\n'
                }
                // Actualisation du grade
                if (ligne.substr(2, 5).toLowerCase() == 'grade')
                {
                    // Actualisation du grade actuel
                    recapitulatif += '▫️' + perso.grade
                    perso.grade = ligne.substr(10).trim()
                    recapitulatif += ' => _'+ perso.grade +'_\n'
                }
                // Actualisation de points
                if (ligne.substr(2, 3) == 'new')
                {
                    switch (ligne.substr(6, 3))
                    {
                        case 'XPs':
                            // Actualisation des xp
                            recapitulatif += actualisationPoint(perso, ligne, 'xp')
                            break
                        case 'PAs':
                            // Actualisation des points d'actualiation
                            recapitulatif += actualisationPoint(perso, ligne, 'pa')
                            break
                        case 'TRO':
                            // Actualisation des trophées
                            recapitulatif += actualisationPoint(perso, ligne, 'trophee')
                            break
                        case 'TEC':
                            // Actualisation des techniques
                            recapitulatif += actualisationPoint(perso, ligne, 'techniques')
                            break
                        case 'ARM':
                            // Actualisation des armes
                            recapitulatif += actualisationPoint(perso, ligne, 'armes')
                            break
                        case 'BOO':
                            // Actualisation des points de boost
                            recapitulatif += actualisationPoint(perso, ligne, 'booste')
                            break
                    }
                }
            })
            // Actualisation effectuée
            actualisation = true
        }
    })

    // Vérification de l'actualisation
    if (actualisation)
    {
        // Actualisation
        mAjFichePersoPrime()
        // Notification de succès d'actualisation
        newMsg.reply(recapitulatif + '\n ```Actualisation effectuée !```')
    } else
    {
        // Notification d'absence de la fiche
        newMsg.reply('🤖 Fiche non disponible. Veuillez vérifier le nom du perso.')
    }
}

/*
    * REDIRECTION SUIVANT LA PRESENCE DE LA VARIABLE DE SESSION *
*/
(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();