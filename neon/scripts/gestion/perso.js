const persoPrime = require('../../fiches/persoPrime.json')
const fs = require('fs')


/*
    * MISE A JOUR AVATAR DE LA BASE DONNEES *
*/
const mAjFichePersoPrime = () => {
    // Actualisation de la base de données
    // fs.writeFileSync('./data/neon/fiches/persoPrime.json', JSON.stringify(persoPrime), 'utf8')
    fs.writeFileSync('../../fiches/persoPrime.json', JSON.stringify(persoPrime), 'utf8')
}

/*
    * CREATION D'UN PERSO PRIME *
*/
const createPersoPrime = (newMsg) => {
    // Création de l'objet du nouvel utilisateur
    let newPerso = {
        id: 0,
        pseudo: '',
        fortune: 2000,
        occupation: {
            libelle: '',
            exploration: ''
        },
        grade: 'Soldat',
        void: '',
        rang: {
            titre: 'Rookie',
            logo: '',
            categorie: '',
            niveau: ''
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

    // Trie des données du nouveau perso
    const detailFiche = newMsg.body.split('\n')

    // Récupération du dernier id de la base de données
    // let newId = persoPrime[(persoPrime.length - 1)].id

    // Vérification de chaque ligne de la fiche perso
    for (let index = 0; index < detailFiche.length; index++)
    {
        const ligne = detailFiche[index]
        if (ligne.includes('NEW PLAYER CARDS'))
        {
            // Initialisation de l'id du nouveau perso
            // newPerso.id = newId + 1
            newPerso.id = 1

        } else if (ligne.includes('PSEUDO'))
        {
            // Récupération du clan de l'avatar
            newPerso.clan = ligne.substr(9).trim()

        } else if (ligne.includes('VOID'))
        {
            // Récupération du nom de l'avatar
            newPerso.name = ligne.substr(17).trim()

        } else if (ligne.includes('OCCUPATION'))
        {
            // Récupération du pays d'origine
            newPerso.pays = ligne.substr(19).trim()

        }
    }

    // Ajout du perso à la base de données
    persoPrime.push(newPerso)

    // Mise à jour de la fiche perso
    mAjFichePersoPrime()

    // Notification d'enregistrement
    newMsg.reply('🤖 ' + (newId + 1) + 'e nouvelle card !')
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
            fiche = '*᚛᚜ 𝗨𝗥𝗣𝗚 :𝗘𝗹𝘆𝘀𝗶𝘂𝗺 𝗪𝗼𝗿𝗹𝗱🌀🎮⸎🌅*//\n\n'
            fiche += ' -------------------------------\n'
            fiche += ' ᚜ 🎴 *PLAYER CARDS*🎴᚛\n'
            fiche += '-------------------------------\n\n'
            fiche += '🆔 *PSEUDO*: ' + perso.pseudo
            fiche += '💰 *FORTUN€*: ' + perso.fortune
            fiche += '♉ *OCCUPATION*: ' + perso.occupation
            fiche += '🎖️ *GRADE*: ' + perso.grade
            fiche += '--------------'
            fiche += '🌀 *VOÏD*: ' + perso.void
            fiche += '🎗️ *RANG*: ' + perso.rang.titre + perso.rang.logo + perso.rang.categorie + perso.rang.niveau
            fiche += '🛡️ *BADGE*: ' + perso.badge
            fiche += '♉ *PORTÉE*: ' + perso.portee
            fiche += '----------------'
            fiche += '⚡ *VITESSE*: ' + perso.competences.vitesse + '/10🥉'
            fiche += '🔊 *SENSORIALITÉ*: ' + perso.competences.senso + '/10🥉'
            fiche += '💡 *REFLEXES*: ' + perso.competences.reflexe + '/10🥉'
            fiche += '----------------'
            fiche += '⏫ *XP*: ' + perso.xp + '/100'
            fiche += '✳️ *PA*: ' + perso.pa
            fiche += '-----------------'
            fiche += '🏆 *TROPHÉES*: ' + perso.trophee
            fiche += '🎴 *TECHNIQUES*: ' + perso.techniques
            fiche += '🎴 *ARMES*: ' + perso.armes
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
        sendMessage(groupe, '🤖 *Fiche indisponible*')
    }
}

/*
    * ACTUALISATION DE COMPETENCES *
*/
const actualisationCompetence = (fiche, data, competence) => {
    console.log('Actualisation prime compétence')
    const donnee = data.split(' : ')
    if (donnee[1].substr(0, 1) == '+')
    {
        console.log('Ajout')
        // Récupération de nombre de PCN à ajouter
        const ajout = parseInt(donnee[1].substr(11))
        // Ajout des PCN
        fiche.competences[competence] += ajout
        return '▫️Ajout de ' + ajout + ' point(s) ' + competence +'\n'
    }
    if (donnee[1].substr(0, 1) == '-')
    {
        console.log('Soustraction')
        // Récupération de nombre de points à retirer
        const soustraction = parseInt(donnee[1].substr(11))
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
    console.log('Actualisation prime points')
    const donnee = data.split(' : ')
    if (donnee[1].substr(0, 1) == '+')
    {
        console.log('Ajout')
        // Récupération de nombre de PCN à ajouter
        const ajout = parseInt(donnee[1].substr(11))
        // Ajout des PCN
        fiche[competence] += ajout
        return '▫️Ajout de ' + ajout + ' point(s) ' + competence +'\n'
    }
    if (donnee[1].substr(0, 1) == '-')
    {
        console.log('Soustraction')
        // Récupération de nombre de points à retirer
        const soustraction = parseInt(donnee[1].substr(11))
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
        if ((perso.name == namePerso) || (perso.name.toLowerCase() == namePerso.toLowerCase()))
        {
            // Actualisation des données de la fiche
            requete.forEach(ligne => {
                // Actualisation des PCN
                if (ligne.substr(2, 3) == 'comp')
                {
                    switch (ligne.substr(6, 1))
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
                if (ligne.substr(2, 3).toLowerCase() == 'pseudo')
                {
                    // Actualisation du nom
                    recapitulatif += '▫️' + perso.name
                    perso.pseudo = ligne.substr(8).trim()
                    recapitulatif += ' => _'+ perso.name +'_\n'
                }
                // Actualisation de l'étreinte
                if (ligne.substr(2, 8).toLowerCase() == 'fortune')
                {
                    // Modification de l'étreinte
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
                if (ligne.substr(2, 3) == 'new')
                {
                    switch (ligne.substr(6, 2))
                    {
                        case 'XPs':
                            // Actualisation des PCN vitesse
                            recapitulatif += actualisationPoint(perso, ligne, 'xp')
                            break
                        case 'PAs':
                            // Actualisation des PCN endurance
                            recapitulatif += actualisationPoint(perso, ligne, 'pa')
                            break
                        case 'TRO':
                            // Actualisation des PCN capacités sensorielles
                            recapitulatif += actualisationPoint(perso, ligne, 'trophee')
                            break
                        case 'TEC':
                            // Actualisation des PCN capacités sensorielles
                            recapitulatif += actualisationPoint(perso, ligne, 'techniques')
                            break
                        case 'ARM':
                            // Actualisation des PCN capacités sensorielles
                            recapitulatif += actualisationPoint(perso, ligne, 'armes')
                            break
                        case 'BOO':
                            // Actualisation des PCN capacités sensorielles
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

module.exports = {
    mAjFichePersoPrime,
    createPersoPrime,
    selectFichePersoPrime,
    actualisationCompetence,
    actualisationPoint,
    actualisationFichePrime
}