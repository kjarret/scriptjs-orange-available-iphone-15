# 📱 iPhone Capacity Checker

Ce script Node.js permet de vérifier la disponibilité des capacités des nouveaux iPhones sur le site d'Orange et d'envoyer un e-mail à l'utilisateur avec les résultats.

## Prérequis

Avant d'exécuter le script, assurez-vous d'avoir les éléments suivants installés sur votre système :

- Node.js
- npm ou yarn

## Installation

1. Clonez ce dépôt sur votre machine :

```bash
git clone <url_du_depot>
Accédez au répertoire du projet :
```

```bash
cd iphone-capacity-checker
```

Installez les dépendances nécessaires :

```bash
npm install
```

### ou

```bash
yarn install
```

## Configuration

Avant d'exécuter le script, assurez-vous de configurer les variables d'environnement dans un fichier `.env` Vous pouvez utiliser le fichier `.env.example` comme modèle.

`dotenv`

```bash
SENDGRID_USERNAME=your_sendgrid_username
SENDGRID_PASSWORD=your_sendgrid_password
RECIPIENT_EMAIL=your_recipient_email
```

## Utilisation

Pour lancer le script, exécutez la commande suivante :

```bash
node checkiPhoneCapacity.js
```

Le script vérifiera la disponibilité des capacités des iPhones et enverra un e-mail à l'adresse spécifiée dans la variable d'environnement `RECIPIENT_EMAIL`.
