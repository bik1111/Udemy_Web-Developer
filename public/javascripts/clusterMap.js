mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'cluster-map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/dark-v10',
center: [-103.5917, 40.6699],
zoom: 3
});
 
map.addControl(new mapboxgl.NavigationControl());

//map.on은 감지할 수 있는 이벤트
map.on('load', () => {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
//Geojson 데이터에서 추가하고 cluster 옵션은 true로 설정.
map.addSource('campgrounds', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: campgrounds,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campgrounds',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
'circle-color': [
'step',
['get', 'point_count'],
'#00BCD4',
10,
'#2196F3',
30,
'#3F51B5'
],
'circle-radius': [
'step',
['get', 'point_count'],
//10개 미만의 캠핑장일 때 너비가 15px
15,
10,
20,
30,
25
]
}
});
 
//point count ->: 해당 클러스터 내 기재된 캠핑장 숫자

map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campgrounds',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
//single point (단일 지점)
id: 'unclustered-point',
type: 'circle',
source: 'campgrounds',
//point count 가 없을 때 표시.
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
//클러스터 클릭 시 확대
map.getSource('campgrounds ').getClusterExpansionZoom(
clusterId,
(err, zoom) => {
if (err) return;

//맵의 중앙지점 변경.
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
// 클러스터에 속하지 않은 단일 지점 클릭.
// 함수는 unclustered-point 를 클릭할 때 실행됨.

map.on('click', 'unclustered-point', (e) => {
const { popUpMarkup }= e.features[0].properties
const coordinates = e.features[0].geometry.coordinates.slice();

 
// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
//팝업 띄움
// 팝업을 통해 정보를 전달함.

new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(popUpMarkup)
.addTo(map);
});
 
//mouseenter 이벤트로 마우스를 맵이 아닌 클러스터에 갖다 댔을 떄 커서 스타일을 포인터로 바꿈.

map.on('mouseenter', 'clusters', () => {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
map.getCanvas().style.cursor = '';
});
});


