<template>
  <div class="h-64 rounded-lg overflow-hidden">
    <l-map :zoom="zoom" :center="[lat, lng]" :use-global-leaflet="false">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :lat-lng="[lat, lng]" :icon="icon" :title="placeName"></l-marker>
    </l-map>
  </div>
</template>
 
<script>
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

export default {
  name: 'DetailMap',
  components: { LMap, LTileLayer, LMarker },
  props: {
    lat: { type: [Number, String], required: true },
    lng: { type: [Number, String], required: true },
    placeName: { type: String, default: '' }
  },
  data() {
    return {
      zoom: 13, // Closer zoom for a specific location
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      icon: new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    };
  }
}
</script>