import React, { useState } from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { Earth } from "../src/components/earth";
import { SearchBar } from "./components/SearchBar";
import { fetchCoordinates } from "./components/geocoding";
import { fetchWeather } from "./components/fetchWeather";
import { Vector3 } from "three";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const WeatherPopup = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ffffff;
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 10;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
  background: linear-gradient(145deg, #f3f4f6, #e2e8f0);

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
  }
`;

const PopupTitle = styled.h3`
  margin-top: 0;
  color: #343a40;
  font-size: 1.25rem;
  font-weight: bold;
`;

const PopupText = styled.p`
  margin: 5px 0;
  color: #495057;
  font-size: 1rem;
`;

const Strong = styled.span`
  font-weight: bold;
`;

function App() {
  const [pinPosition, setPinPosition] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSearch = async (query) => {
    try {
      const { lat, lng } = await fetchCoordinates(query);
      console.log(`Fetched coordinates: Latitude: ${lat}, Longitude: ${lng}`);

      const radius = 1.5; // Earth radius
      const phi = (90 - lat) * (Math.PI / 180); // Convert latitude to radians
      const theta = (lng + 180) * (Math.PI / 180); // Convert longitude to radians

      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      console.log(`Converted coordinates: X: ${x}, Y: ${y}, Z: ${z}`);
      setPinPosition(new Vector3(x, y, z));
      const weatherData = await fetchWeather(lat, lng);
      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleWeatherDataUpdate = (data) => {
    setWeatherData(data);
    setPopupVisible(true);
  };

  return (
    <>
      <CanvasContainer>
        <SearchBar onSearch={handleSearch} />
        <Canvas>
          <Earth pinPosition={pinPosition} setPinPosition={setPinPosition} onWeatherDataUpdate={handleWeatherDataUpdate} />
        </Canvas>
        {popupVisible && weatherData && (
          <WeatherPopup>
            <PopupTitle>Weather Details</PopupTitle>
            <PopupText><Strong>Location:</Strong> {weatherData.data[0].city_name}</PopupText>
            <PopupText><Strong>Temperature:</Strong> {weatherData.data[0].temp}°C</PopupText>
            <PopupText><Strong>Description:</Strong> {weatherData.data[0].weather.description}</PopupText>
          </WeatherPopup>
        )}
      </CanvasContainer>
    </>
  );
}

export default App;

