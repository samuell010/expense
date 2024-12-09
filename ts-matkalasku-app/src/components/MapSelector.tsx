import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./MapSelector.css";
import L from "leaflet";

interface MapSelectorProps {
  center: [number, number];
  zoom: number;
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
  onClose: () => void;
}

const SearchControl: React.FC<{
  onLocationSelect: MapSelectorProps["onLocationSelect"];
}> = ({ onLocationSelect }) => {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      showPopup: false,
      marker: {
        draggable: true,
      },
      popupFormat: ({ query, result }) => result.label,
      resultFormat: ({ result }) => result.label,
      maxMarkers: 1,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: "Enter address or place name",
      keepResult: true,
    });

    map.addControl(searchControl);

    const addMarker = (lat: number, lng: number) => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current); // Remove previous marker
      }

      const newMarker = L.marker([lat, lng]).addTo(map);
      // .bindPopup(popupInfo || `Latitude: ${lat}, Longitude: ${lng}`)
      // .openPopup(); // Automatically open the popup
      markerRef.current = newMarker;
    };

    map.on("geosearch/showlocation", (event) => {
      const lat = event.location?.y;
      const lng = event.location?.x;
      if (lat !== undefined && lng !== undefined) {
        addMarker(lat, lng);
        onLocationSelect({ lat, lng });
      }
    });

    map.on("click", (event) => {
      const { lat, lng } = event.latlng;
      addMarker(lat, lng);
      onLocationSelect({ lat, lng });
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};

const MapSelector: React.FC<MapSelectorProps> = ({
  center,
  zoom,
  onLocationSelect,
  onClose,
}) => {
  return (
    <div style={{ position: "relative", height: "50vh", width: "100%" }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "black",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchControl onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
