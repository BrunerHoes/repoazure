import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('La permission d\'accéder à la localisation a été refusée');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la position: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const reportPolice = async () => {
    try {
      // Obtenir la position actuelle précise pour le signalement
      let currentLoc = await Location.getCurrentPositionAsync({});
      const lat = currentLoc.coords.latitude;
      const lng = currentLoc.coords.longitude;

      // Injecter le script pour ajouter le marqueur
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          addPoliceMarker(${lat}, ${lng});
          true; // Note: required for injectJavaScript to work on some platforms
        `);
      }
      Alert.alert("Succès", "Police signalée à votre position !");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de récupérer la localisation.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const latitude = location?.coords?.latitude || 48.8566;
  const longitude = location?.coords?.longitude || 2.3522;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Map</title>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${latitude}, ${longitude}], 15);

          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          var userMarker = L.marker([${latitude}, ${longitude}]).addTo(map);
          userMarker.bindPopup("<b>Vous êtes ici</b>");

          // Icone personnalisée pour la police (rouge)
          var policeIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          // Fonction globale pour ajouter un marqueur police
          window.addPoliceMarker = function(lat, lng) {
            var marker = L.marker([lat, lng], {icon: policeIcon}).addTo(map);
            marker.bindPopup("<b>Police signalée !</b>").openPopup();
            map.setView([lat, lng], map.getZoom()); // Recentre sur le signalement
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={reportPolice}>
          <Text style={styles.buttonText}>👮 Signaler Police</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
