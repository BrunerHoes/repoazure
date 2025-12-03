import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Demander la permission d'accéder à la localisation
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('La permission d\'accéder à la localisation a été refusée');
          setLoading(false);
          return;
        }

        // Obtenir la position actuelle
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la position: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  // HTML content for Leaflet map
  // We inject the user's latitude and longitude directly into the JS.
  const latitude = location?.coords?.latitude || 48.8566; // Default to Paris if null (fallback)
  const longitude = location?.coords?.longitude || 2.3522;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Map</title>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialize map
          var map = L.map('map').setView([${latitude}, ${longitude}], 13);

          // Add OpenStreetMap tiles
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);

          // Add marker at user position
          var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
          marker.bindPopup("<b>Vous êtes ici !</b>").openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
      />
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
});
