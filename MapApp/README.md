# Application Map Mobile (React Native + Expo)

Cette application est une démo simple utilisant React Native et Expo pour afficher une carte interactive centrée sur la localisation de l'utilisateur.

## Prérequis

- Node.js installé sur votre machine.
- Un smartphone avec l'application "Expo Go" installée (disponible sur Play Store et App Store).
- Une clé API Google Maps (obligatoire pour Android et pour les builds de production iOS).

## Installation

1. Naviguez dans le dossier du projet :
   ```bash
   cd MapApp
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration de la Clé API Google

Pour que la carte fonctionne correctement (en particulier sur Android), vous devez configurer une clé API Google Maps.

1. Rendez-vous sur la [Google Cloud Console](https://console.cloud.google.com/).
2. Créez un nouveau projet.
3. Activez "Maps SDK for Android" et "Maps SDK for iOS".
4. Créez une clé API (Credentials).
5. Ouvrez le fichier `app.json` et remplacez `VOTRE_CLE_API_GOOGLE_ANDROID` et `VOTRE_CLE_API_GOOGLE_IOS` par votre clé API.

> **Note importante concernant iOS et Expo Go :**
> L'application Expo Go sur iOS n'inclut pas le SDK Google Maps. Par conséquent, lors de l'exécution via Expo Go sur un iPhone/iPad, l'application utilisera **Apple Maps** par défaut pour éviter tout plantage.
> Sur Android, elle utilisera **Google Maps**.
> Pour utiliser Google Maps sur iOS, vous devrez créer un "Development Build" personnalisé ou une version de production autonome.

## Lancer l'application

1. Démarrez le serveur de développement :
   ```bash
   npm start
   ```

2. Un QR code s'affichera dans le terminal.
   - **Android :** Scannez le QR code avec l'application Expo Go.
   - **iOS :** Scannez le QR code avec l'application Appareil Photo (qui vous proposera d'ouvrir Expo Go).

## Fonctionnalités

- Demande la permission de géolocalisation au démarrage.
- Affiche une carte (Google Maps sur Android, Apple Maps sur iOS Expo Go).
- Centre la carte sur la position actuelle de l'utilisateur.
- Affiche un marqueur sur la position de l'utilisateur.
