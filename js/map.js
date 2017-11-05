var rc = new RamaniAPI();
rc.init({
    username:'ecoroof',
    apiKey:'06f22ffbb8d053e86246e1f86e8b2862',
    package:'com.ecoroof.ramaniapi'
});
var map = rc.map({
    center : new L.LatLng(52.3730636,4.8912412),
    baselayer : 'osm'
});
rc.getTile({
    db: "ecoroof",
    layer: 'ddl.copLandSseriesNdviGlobal.NDVI'
});

function getAsyncMap(lat,long,layer, callBack){
  return new Promise(function(resolve) {
    callBack(getData(lat,long,layer));
    resolve(1);
  })
}
var callBacks =0;
var ndvi;
var leafArea;
var airPollution;
var greenIndex ="calculating";
var leafAreaIndex="calculating";
var airPollutionIndex="calculating";
function ndviCallback(data, e) {
  ndvi = data;
  callBacks++;
  if (ndvi < 0) {
    greenIndex = "Low";
  } else if (ndvi < 0.5) {
    greenIndex = "Medium";
  } else {
    greenIndex = "High";
  }
  console.log('done green');
calculate(e);
}
function leafAreaCallback(data, e){
  leafArea=data;
  callBacks++;
  // 0.273773998 Light
  if (leafArea < 0.3) {
    leafAreaIndex = "Low";
  } else if (leafArea < 0.6) {
    leafAreaIndex = "Medium";
  } else {
    leafAreaIndex = "High";
  }
  console.log('done leaf');
  calculate(e);
}
function airPollutionCallback(data, e){
  airPollution=data;
  callBacks++;
  if (airPollution > 3E-8) {
    airPollutionIndex = "Low";
  } else if (airPollution > 2E-8) {
    airPollutionIndex = "Medium";
  } else {
    airPollutionIndex = "High";
  }
  console.log('done air');
  calculate(e);
}
function calculate(e){
  setProgress(25 *callBacks);
  if(callBacks === 2) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
    .bindPopup(
        "<b>Land-surface Temperature</b>: Low</br>" +
        "<b>Water Saving</b>: Absent</br>" +
        "<b>Leaf Area</b>: "+leafAreaIndex+"</br>" +
        "<b>Air Pollution</b>: "+airPollutionIndex+"</br>" +
        "<b>Greenness roof</b>: Absent</br><a href='#' id='getReport'>Get Report</a>").openPopup();

    setProgress(100);
  }
}

map.on('click', function(e) {
    callBacks=0;
    greenIndex ="calculating";
    leafAreaIndex="calculating";
    setProgress(0);
     //getAsyncMap(e.latlng.lat, e.latlng.lng, "ddl.copLandSseriesNdviGlobal.NDVI",(data) => ndviCallback(data,e));
     getAsyncMap(e.latlng.lat, e.latlng.lng, "ddl.copLandSseriesLaiGlobal.LAI", (data) => leafAreaCallback(data, e));
     getAsyncMap(e.latlng.lat, e.latlng.lng, "ddl.simS5seriesForAirQualityGlob.no2", (data) =>airPollutionCallback(data, e))

    // 1.7199168E-8 Dark
    // 3.9698367E-8 Light
});

function getData(lat, lng, layerID) {
    var info = rc.getFeatureInfo(new L.LatLng(lat, lng), { layer: layerID, info_format : 'text/json' });
    return info.features[0].featureInfo[0].value;
}

function setProgress(val) {
    $('.progress-bar').attr('aria-valuenow', val);
    $('.progress-bar').width(val+'%');
    $('.progress-bar').text(val+'%');
}