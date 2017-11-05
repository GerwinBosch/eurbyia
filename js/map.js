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

map.on('click', function(e) {

    setProgress(10);

    var ndvi = getData(e.latlng.lat, e.latlng.lng, "ddl.copLandSseriesNdviGlobal.NDVI");
    setProgress(40);

    var leafArea = getData(e.latlng.lat, e.latlng.lng, "ddl.copLandSseriesLaiGlobal.LAI");
    setProgress(60);

    var airPollution = getData(e.latlng.lat, e.latlng.lng, "ddl.simS5seriesForAirQualityGlob.no2");

    var greenIndex;
    if (ndvi < 0) {
        greenIndex = "Low";
    } else if (ndvi < 0.5) {
        greenIndex = "Medium";
    } else {
        greenIndex = "High";
    }

    // 0.273773998 Light
    var leafAreaIndex;
    if (leafArea < 0.3) {
        leafAreaIndex = "Low";
    } else if (leafArea < 0.6) {
        leafAreaIndex = "Medium";
    } else {
        leafAreaIndex = "High";
    }

    // 1.7199168E-8 Dark
    // 3.9698367E-8 Light
    var airPollutionIndex;
    if (airPollution > 3E-8) {
        airPollutionIndex = "Low";
    } else if (airPollution > 2E-8) {
        airPollutionIndex = "Medium";
    } else {
        airPollutionIndex = "High";
    }

    L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
        .bindPopup("<b>Green Index</b>: "+greenIndex+"</br>" +
            "<b>Land-surface Temparature</b>: Low</br>" +
            "<b>Flood Risk</b>: Low</br>" +
            "<b>Leaf Area</b>: "+leafAreaIndex+"</br>" +
            "<b>Air Pollution</b>: "+airPollutionIndex+"</br>" +
            "<b>Green roof is not essential</b></br>").openPopup();

    setProgress(100);

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