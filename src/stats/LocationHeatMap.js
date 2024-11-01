import React, { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import stateBoundaries from "../us-states-with-abbreviations.json"; // Import the GeoJSON file with state boundaries

const US_STATE_ABBREVIATIONS = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

// Extract states from location text
function extractStateAbbreviations(text) {
  const regex = /\b[A-Z]{2}\b/g;
  const matches = text.match(regex);
  return matches
    ? matches.filter((match) => US_STATE_ABBREVIATIONS.includes(match))
    : [];
}

// LocationHeatMap Component
const LocationHeatMap = ({ jobData }) => {
  // Count job postings per state
  const stateCounts = useMemo(() => {
    const counts = {};
    jobData.forEach((job) => {
      const states = extractStateAbbreviations(job.location); // Assumes job.location is a text
      states.forEach((state) => {
        counts[state] = (counts[state] || 0) + 1;
      });
    });
    return counts;
  }, [jobData]);

  // Color each state based on the number of job postings
  const getColor = (count) => {
    return count > 100
      ? "#800026"
      : count > 50
      ? "#BD0026"
      : count > 20
      ? "#E31A1C"
      : count > 10
      ? "#FC4E2A"
      : count > 5
      ? "#FD8D3C"
      : count > 0
      ? "#FEB24C"
      : "#FFEDA0";
  };

  // Style each state with color based on job postings
  const style = (feature) => {
    const stateAbbreviation = feature.properties.STUSPS;
    const count = stateCounts[stateAbbreviation] || 0;
    return {
      fillColor: getColor(count),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  // Define the onEachFeature function to add tooltips
  const onEachFeature = (feature, layer) => {
    const stateAbbreviation = feature.properties.STUSPS;
    const stateName = feature.properties.name; // Assuming the name is in the properties
    const count = stateCounts[stateAbbreviation] || 0;

    // Bind a tooltip to the layer
    layer.bindTooltip(`${stateName}: ${count} jobs`, {
      permanent: false,
      direction: "top",
    });
  };

  return (
    <MapContainer
      center={[37.8, -96]}
      zoom={4}
      style={{ height: "500px", width: "50%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={stateBoundaries}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default LocationHeatMap;
