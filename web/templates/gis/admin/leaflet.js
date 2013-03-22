{% load l10n %}

{% block vars %}var {{ module }} = {};
{{ module }}.map = null; 
{{ module }}.tileUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
{{ module }}.subDomains = ['otile1','otile2','otile3','otile4'];
{{ module }}.attrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, ' +
                     '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, ' + 
                     '<a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';

{{ module }}.tiles = null;
{{ module }}.marker = null;
{{ module }}.lat = '50.37027608930287';
{{ module }}.lng = '-4.142275169805998';
{% endblock %}

{{ module }}.locateByPostcode = function(_postcode) {

    var coords;

    _postcode = django.jQuery.trim(_postcode.replace(/\s+/gi, '')).toUpperCase();

    if (!_postcode.match(/^\b([A-Z]{1,2}[0-9][A-Z0-9]?)[\s+]?([0-9][ABD-HJLNP-UW-Z]{2})\b$/i))
    {
        alert('You must enter a valid postcode.');
        return;
    }

    django.jQuery.ajax({
        url: 'http://markashleybell.iriscouch.com/os_data/_design/data/_view/bypostcode?key=%22' + _postcode + '%22',
        dataType: 'jsonp',
        success: function (data, status, request) {

            var row = data.rows[0].value;

            coords = new L.LatLng(row.lat, row.lng);

            {{ module }}.map.panTo(coords);

            {{ module }}.marker.setLatLng(coords);

            django.jQuery('#{{ id }}').val('SRID=4326;POINT (' + coords.lng + ' ' + coords.lat + ')');

        },
        error: function (request, status, error) { }
    });

};

{{ module }}.init = function(){

    {% if not is_point %}
    alert('Only point data is supported');
    {% endif %}

    var pointRegex = /POINT \(([\-.0-9]+) ([\-.0-9]+)\)/;
var match = pointRegex.exec(django.jQuery('#{{ id }}').val());
if (match == null) {
    // alert('Invalid POINT');
} else {
    {{ module }}.lat = match[2];
    {{ module }}.lng = match[1];
}

    // The admin map for this geometry field.
    {% block map_creation %}
    {{ module }}.map = L.map('{{ id }}_map');
    {{ module }}.tiles = new L.TileLayer({{ module }}.tileUrl, {minZoom: 8, maxZoom: 18, attribution: {{ module }}.attrib, subdomains: {{ module }}.subDomains});
    {{ module }}.map.setView([{{ module }}.lat, {{ module }}.lng], 15);
    {{ module }}.map.addLayer({{ module }}.tiles);

    var _icon = new L.Icon({
                    iconUrl: 'http://leafletjs.com/dist/images/marker-icon.png',
                    iconSize: new L.Point(25, 41),
                    iconAnchor: new L.Point(12, 41),
                    popupAnchor: new L.Point(1, -34),
                    shadowUrl: 'http://leafletjs.com/dist/images/marker-shadow.png',
                    shadowSize: new L.Point(41, 41)
                });

                    var _position = new L.LatLng({{ module }}.lat, {{ module }}.lng);
                    {{ module }}.marker = new L.Marker(_position, { icon: _icon, draggable: true });
                    {{ module }}.map.addLayer({{ module }}.marker);

                    {{ module }}.marker.on('dragend', function (e) {
                     var coords = e.target.getLatLng();
                     {{ module }}.lat = coords.lat;
                     {{ module }}.lng = coords.lng;
                     // alert(_lat + ':' + _lng);
                     django.jQuery('#{{ id }}').val('SRID=4326;POINT (' + {{ module }}.lng + ' ' + {{ module }}.lat + ')');
                    });
//marker.bindPopup('<h1>' + item.name + '</h1>' + item.postcode);
// _markers.push(marker);
                
    {% endblock %}    
}
