# Application Map Mobile (React Native + Expo + OpenStreetMap)

Cette application est une démo utilisant React Native, Expo et OpenStreetMap (via Leaflet dans une WebView) pour afficher une carte interactive centrée sur la localisation de l'utilisateur.

## Prérequis

- Node.js installé sur votre machine.
- Un smartphone avec l'application "Expo Go" installée (disponible sur Play Store et App Store).
- Une connexion Internet (pour charger les tuiles OpenStreetMap).

## Installation

1. Naviguez dans le dossier du projet :
   ```bash
   cd MapApp
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Fonctionnalités

- **Pas de Clé API requise** : Utilise OpenStreetMap qui est gratuit et ouvert.
- **Géolocalisation** : Utilise le module natif de l'appareil pour obtenir la position GPS.
- **Carte Interactive** : Affichage via Leaflet.js, permettant le zoom et le déplacement.
- **Marqueur** : Indique la position actuelle de l'utilisateur.

## Lancer l'application

1. Démarrez le serveur de développement :
   ```bash
   npm start
   ```

2. Un QR code s'affichera dans le terminal.
   - **Android :** Scannez le QR code avec l'application Expo Go.
   - **iOS :** Scannez le QR code avec l'application Appareil Photo (qui vous proposera d'ouvrir Expo Go).

## Notes Techniques

L'application utilise `react-native-webview` pour afficher une page HTML locale contenant la logique Leaflet. Cela permet d'utiliser l'API OpenStreetMap standard sans complexité native supplémentaire.
La position de l'utilisateur est récupérée via `expo-location` (React Native) puis injectée dynamiquement dans le code HTML/JS de la carte.
