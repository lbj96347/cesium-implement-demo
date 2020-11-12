import React from 'react'
import './App.css';
// import * as Cesium from 'cesium';
// import "cesium/Build/Cesium/Widgets/widgets.css";
//
// window.CESIUM_BASE_URL = './public/Cesium';
//
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YWM4Y2YxYS04YjdlLTQ0MjAtODJlOS1mYjUwNzRmZGQzZjAiLCJpZCI6Mzc1NDAsImlhdCI6MTYwNTE3ODcxNH0.gWSIgll89PeOxVEPFe-V7m7_CdupMqpCwnaeuMd16Tg';
// // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
// const viewer = new Cesium.Viewer('cesiumContainer', {
//     terrainProvider: Cesium.createWorldTerrain()
// });
// // Add Cesium OSM Buildings, a global 3D buildings layer.
// const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
// // Fly the camera to San Francisco at the given longitude, latitude, and height.
// viewer.camera.flyTo({
//     destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
//     orientation : {
//         heading : Cesium.Math.toRadians(0.0),
//         pitch : Cesium.Math.toRadians(-15.0),
//     }
// });

function App() {
  return (
    <div id='cesiumContainer'>
        aaa
    </div>
  );
}

export default App;
