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

    console.log();

    var pointRegex = /POINT \(([\-.0-9]+) ([\-.0-9]+)\)/;
var match = pointRegex.exec(django.jQuery('#{{ id }}').val());
if (match == null) {
    alert('Invalid POINT');
} 

    // The admin map for this geometry field.
    {% block map_creation %}
    {{ module }}.map = L.map('{{ id }}_map');
    {{ module }}.tiles = new L.TileLayer({{ module }}.tileUrl, {minZoom: 8, maxZoom: 18, attribution: {{ module }}.attrib, subdomains: {{ module }}.subDomains});
    {{ module }}.map.setView([match[2], match[1]], 15);
    {{ module }}.map.addLayer({{ module }}.tiles);
    {% endblock %}    
}
