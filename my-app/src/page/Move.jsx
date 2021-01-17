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
        // orientation: new Cesium.VelocityOrientationProperty(positionProperty),
        path: new Cesium.PathGraphics({ width: 3 })
		
		
    });
	//样条插值的使用
	airplaneEntity.position.setInterpolationOptions({
	interpolationDegree : 2,
	interpolationAlgorithm : Cesium.HermitePolynomialApproximation
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

            //飞行轨迹为8个点的情况
			const flightData = [
				{longitude:-74.0145,latitude:40.7135,height:400},
				{longitude:-74.0145,latitude:40.7125,height:400},
				{longitude:-74.014,latitude:40.712,height:400},
				{longitude:-74.013,latitude:40.712,height:400},
				{longitude:-74.0125,latitude:40.7125,height:400},
				{longitude:-74.0125,latitude:40.7135,height:400},
				{longitude:-74.013,latitude:40.714,height:400},
				{longitude:-74.014,latitude:40.714,height:400},
				{longitude:-74.0145,latitude:40.7135,height:400}
				];
			
				//飞行轨迹为16点的情况
			// const flightData = [
			// 	{longitude:-74.019,latitude:40.7,height:400},
			// 	{longitude:-74.0188,latitude:40.6997,height:400},
			// 	{longitude:-74.0186,latitude:40.6994,height:400},
			// 	{longitude:-74.0183,latitude:40.6992,height:400},
			// 	{longitude:-74.018,latitude:40.699,height:400},
			// 	{longitude:-74.0177,latitude:40.6992,height:400},
			// 	{longitude:-74.0174,latitude:40.6994,height:400},
			// 	{longitude:-74.0172,latitude:40.6997,height:400},
			// 	{longitude:-74.017,latitude:40.7,height:400},
			// 	{longitude:-74.0172,latitude:40.7003,height:400},
			// 	{longitude:-74.0174,latitude:40.7006,height:400},
			// 	{longitude:-74.0177,latitude:40.7008,height:400},
			// 	{longitude:-74.018,latitude:40.701,height:400},
			// 	{longitude:-74.0183,latitude:40.7008,height:400},
			// 	{longitude:-74.0186,latitude:40.7006,height:400},
			// 	{longitude:-74.0188,latitude:40.7003,height:400},
			// 	{longitude:-74.019,latitude:40.7,height:400}
			// 	];
			//飞行轨迹4点形成原型
			// const flightData = [
			// 	{longitude:-74.019,latitude:40.7,height:400},
			// 	{longitude:-74.018,latitude:40.699,height:400},
			// 	{longitude:-74.017,latitude:40.7,height:400},
			// 	{longitude:-74.018,latitude:40.701,height:400},
			// 	{longitude:-74.019,latitude:40.7,height:400}
			// 	];
            
            const timeStepInSeconds = 1*60*60;
            const totalSeconds = timeStepInSeconds * (flightData.length - 1);
            const start = Cesium.JulianDate.fromIso8601("2021-01-16T23:00:00Z");
            const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
            viewer.timeline.zoomTo(start, stop);
			// Speed up the playback speed 150x.
            viewer.clock.multiplier = 150;
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
                    point: { pixelSize: 5, color: Cesium.Color.white,scale:0.5 },
					//调转机头
					orientation: Cesium.Transforms.headingPitchRollQuaternion(
						position,
						new Cesium.HeadingPitchRoll(
							Cesium.Math.toRadians(0),
							Cesium.Math.toRadians(0),
							Cesium.Math.toRadians(90 + i*45)
						)
					),
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
