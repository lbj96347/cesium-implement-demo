import React , {useEffect , useRef} from 'react'
import '../App.css';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YWM4Y2YxYS04YjdlLTQ0MjAtODJlOS1mYjUwNzRmZGQzZjAiLCJpZCI6Mzc1NDAsImlhdCI6MTYwNTE3ODcxNH0.gWSIgll89PeOxVEPFe-V7m7_CdupMqpCwnaeuMd16Tg';

async function loadModel(viewer , positionProperty ,start , stop) {
    // Load the glTF model from Cesium ion.
    const dataPoint = { longitude: -122.38985, latitude: 37.61864, height: -10.3 };
    const airplaneUri = await Cesium.IonResource.fromAssetId('185430');
    const airplaneEntity = viewer.entities.add({
        description: `First data point at (${dataPoint.longitude}, ${dataPoint.latitude})`,
        position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
        model: { uri: airplaneUri },
        // point: { pixelSize: 10, color: Cesium.Color.RED }
    });
    viewer.flyTo(airplaneEntity);

    // viewer.trackedEntity = airplaneEntity;
}

function App() {
    const cesiumContainer2=useRef(null);
    useEffect(() => {
        if(cesiumContainer2.current){
            const viewer = new Cesium.Viewer(cesiumContainer2.current, {
                terrainProvider: Cesium.createWorldTerrain()
            });
            const osmBuildings = viewer.scene.primitives.add(Cesium.createOsmBuildings());
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(-122.384, 37.62, 4000)
            });
            // const dataPoint = { longitude: -122.38985, latitude: 37.61864, height: -10.32 };
            // const pointEntity = viewer.entities.add({
            //     description: `First data point at (${dataPoint.longitude}, ${dataPoint.latitude})`,
            //     position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
            //     point: { pixelSize: 10, color: Cesium.Color.RED }
            // });
            // viewer.flyTo(pointEntity);
            loadModel(viewer);
        }
    },[cesiumContainer2]);

    return (
        <div id='cesiumContainer2' ref={cesiumContainer2} style={{width:'50%',float:'left'}}>
        </div>
    );
}

export default App;
