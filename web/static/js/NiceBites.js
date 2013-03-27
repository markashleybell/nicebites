var NiceBites = (function() {

    var _map = null;
    // This is the standard OpenMapQuest tile URL
    var _subDomains = ['otile1','otile2','otile3','otile4'];
    var _tileUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';

    // MapBox
    // var subDomains = ['a','b','c','d'];
    // var tileUrl = 'http://{s}.tiles.mapbox.com/v3/base.live-streets/{z}/{x}/{y}.png';

    var _attrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, ' +
                  '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, ' + 
                  '<a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';

    var _tiles = null;
    var _markers = [];
    var _log = [];

    return {
        init: function(mapDiv) {
            _map = L.map(mapDiv);
            _tiles = new L.TileLayer(_tileUrl, { minZoom: 8, maxZoom: 18, attribution: _attrib, subdomains: _subDomains });
            _map.addLayer(_tiles);
        },
        getLog: function() {
            return _log;
        },
        getClientPosition: function(callback) {
            if (navigator.geolocation) {
                var timeoutVal = 10 * 1000 * 1000;
                navigator.geolocation.getCurrentPosition(function(position){

                    var clientPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    _log.push('Retrieved position: ' + clientPosition);
                    callback(clientPosition);

                }, function(error) {
                    var errors = { 
                        1: 'Permission denied',
                        2: 'Position unavailable',
                        3: 'Request timeout'
                    };
                    _log.push('Error: ' + errors[error.code]);
                }, { 
                    enableHighAccuracy: true, 
                    timeout: timeoutVal, 
                    maximumAge: 0 
                });
            } else {
                _log.push('Geolocation is not supported by this browser');
            }
        },
        createIcon: function(colour) {
            return new L.Icon({
                iconUrl: '/static/img/marker-icon' + ((typeof colour === 'undefined') ? '' : '-' + colour) + '.png',
                iconSize: new L.Point(25, 41),
                iconAnchor: new L.Point(12, 41),
                popupAnchor: new L.Point(1, -34),
                shadowUrl: '/static/img/marker-shadow.png',
                shadowSize: new L.Point(41, 41)
            });
        },
        loadMarkers: function(area) {
            _map.setView([area.position.lat, area.position.lng], area.zoom);

            // Remove all the previous markers
            // TODO: This can be more efficient if we initially add markers to a layer group
            // See http://leafletjs.com/examples/layers-control.html
            for(var i=0; i<_markers.length; i++) {
                _map.removeLayer(_markers[i]);
            }

            $.ajax({
                url: '/region/' + area.regionId + '?lng=' + area.position.lng + '&lat=' + area.position.lat + '&distance=' + area.range,
                dataType: 'json',
                success: function (data, status, request) {

                    $.each(data, function(i, item) {

                        var position = new L.LatLng(item.lat, item.lng);
                        var marker = new L.Marker(position, { icon: NiceBites.createIcon() });
                        _map.addLayer(marker);
                        marker.bindPopup('<h1>' + item.name + '</h1>' + item.postcode);
                        _markers.push(marker);

                    });

                    var youMarker = new L.Marker(new L.LatLng(area.position.lat, area.position.lng), { icon: NiceBites.createIcon('red') });
                    _map.addLayer(youMarker);
                    youMarker.bindPopup('<h1>YOU ARE HERE</h1>');
                    _markers.push(youMarker);

                    if(typeof area.callback === 'function')
                        area.callback();
                },
                error: function (request, status, error) { }
            });
        }
    }

}());