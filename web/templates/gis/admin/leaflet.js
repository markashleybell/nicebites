{% load l10n %}

{% block vars %}var {{ module }} = {};
{{ module }}.map = null; 
{{ module }}.tileUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
{{ module }}.subDomains = ['otile1','otile2','otile3','otile4'];
{{ module }}.attrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, ' +
                     '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, ' + 
                     '<a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';

{{ module }}.tiles = null;
{% endblock %}
{{ module }}.init = function(){

    {% if not is_point %}
    alert('Only point data is supported');
    {% endif %}

    var _lon = '-4.142275169805998';
    var _lat = '50.37027608930287';
    
    var pointRegex = /POINT \(([\-.0-9]+) ([\-.0-9]+)\)/;
var match = pointRegex.exec(django.jQuery('#{{ id }}').val());
if (match == null) {
    // alert('Invalid POINT');
} else {
    _lat = match[2];
    _lon = match[1];
}

    // The admin map for this geometry field.
    {% block map_creation %}
    {{ module }}.map = L.map('{{ id }}_map');
    {{ module }}.tiles = new L.TileLayer({{ module }}.tileUrl, {minZoom: 8, maxZoom: 18, attribution: {{ module }}.attrib, subdomains: {{ module }}.subDomains});
    {{ module }}.map.setView([_lat, _lon], 15);
    {{ module }}.map.addLayer({{ module }}.tiles);

    var _icon = new L.Icon({
                    iconUrl: 'http://leafletjs.com/dist/images/marker-icon.png',
                    iconSize: new L.Point(25, 41),
                    iconAnchor: new L.Point(12, 41),
                    popupAnchor: new L.Point(1, -34),
                    shadowUrl: 'http://leafletjs.com/dist/images/marker-shadow.png',
                    shadowSize: new L.Point(41, 41)
                });

        var _position = new L.LatLng(_lat, _lon);
                    var _marker = new L.Marker(_position, { icon: _icon, draggable: true });
                    {{ module }}.map.addLayer(_marker);

                    _marker.on('dragend', function (e) {
                     var coords = e.target.getLatLng();
                     _lat = coords.lat;
                     _lng = coords.lng;
                     // alert(_lat + ':' + _lng);
                     django.jQuery('#{{ id }}').val('POINT (' + _lon + ' ' + _lat + ')');
                    });
//marker.bindPopup('<h1>' + item.name + '</h1>' + item.postcode);
// _markers.push(marker);
                
    {% endblock %}    
}
