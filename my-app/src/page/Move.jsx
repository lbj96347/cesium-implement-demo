import React , {useEffect , useRef} from 'react'
import '../App.css';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YWM4Y2YxYS04YjdlLTQ0MjAtODJlOS1mYjUwNzRmZGQzZjAiLCJpZCI6Mzc1NDAsImlhdCI6MTYwNTE3ODcxNH0.gWSIgll89PeOxVEPFe-V7m7_CdupMqpCwnaeuMd16Tg';

async function loadModel(viewer , positionProperty ,start , stop) {
    // Load the glTF model from Cesium ion.
    const airplaneUri = await Cesium.IonResource.fromAssetId('185333');
    const airplaneEntity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ]),
        position: positionProperty,
        // Attach the 3D model instead of the green point.
        model: { uri: airplaneUri },
        // Automatically compute the orientation from the position.
        orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        path: new Cesium.PathGraphics({ width: 3 })
    });

    viewer.trackedEntity = airplaneEntity;
}

function Index() {
    const cesiumContainer=useRef(null);
    useEffect(() => {
        if(cesiumContainer.current){
            // STEP 4 CODE (replaces steps 2 and 3)
// Keep your `Cesium.Ion.defaultAccessToken = 'your_token_here'` line from before here.
            const viewer = new Cesium.Viewer(cesiumContainer.current, {
                terrainProvider: Cesium.createWorldTerrain()
            });
            const osmBuildings = viewer.scene.primitives.add(Cesium.createOsmBuildings());

            const flightData = [{longitude:113.821705,latitude:22.638172,height:10000},{longitude:113.928032,latitude:22.309817,height:1000}];

            /* Initialize the viewer clock:
              Assume the radar samples are 30 seconds apart, and calculate the entire flight duration based on that assumption.
              Get the start and stop date times of the flight, where the start is the known flight departure time (converted from PST
                to UTC) and the stop is the start plus the calculated duration. (Note that Cesium uses Julian dates. See
                https://simple.wikipedia.org/wiki/Julian_day.)
              Initialize the viewer's clock by setting its start and stop to the flight start and stop times we just calculated.
              Also, set the viewer's current time to the start time and take the user to that time.
            */
            const timeStepInSeconds = 1*60*60;
            const totalSeconds = timeStepInSeconds * (flightData.length - 1);
            const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
            const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
            viewer.timeline.zoomTo(start, stop);
// Speed up the playback speed 50x.
            viewer.clock.multiplier = 50;
// Start playing the scene.
            viewer.clock.shouldAnimate = true;

// The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
            const positionProperty = new Cesium.SampledPositionProperty();

            for (let i = 0; i < flightData.length; i++) {
                const dataPoint = flightData[i];

                // Declare the time for this individual sample and store it in a new JulianDate instance.
                const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
                const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
                // Store the position along with its timestamp.
                // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
                positionProperty.addSample(time, position);

                viewer.entities.add({
                    description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
                    position: position,
                    point: { pixelSize: 10, color: Cesium.Color.RED }
                });
            }

// STEP 6 CODE (airplane entity)
            loadModel(viewer , positionProperty ,start , stop);
            // loadModel2(viewer , positionProperty ,start , stop);

        }
    },[cesiumContainer]);

    return (
        <div id='cesiumContainer' ref={cesiumContainer} style={{width:'50%',float:'left'}}>
        </div>
    );
}

export default Index;
