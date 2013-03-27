$(function () {

    

    //_mapContainer = $('#map-container');

    // Proportionally resize the map when the window size changes
    // $(window).bind('resize', function (e) {
    //     _mapContainer.css({ height: (_mapContainer.width() / 3) });
    // });

    // $(window).trigger('resize');

    // Initially load the map centred on the region
    NiceBites.init('map');
    NiceBites.loadMarkers({
        lat: '50.36833260763417',
        lng: '-4.140386894659514',
        zoom: 15,
        range: 5,
        regionId: 1,
        callback: function() {
            console.log('Initial Map');
            NiceBites.getClientPosition(function(pos) {
                NiceBites.loadMarkers({
                    lat: pos.lat,
                    lng: pos.lng,
                    zoom: 15,
                    range: 5,
                    regionId: 1,
                    callback: function() {
                        console.log('Got Client Position');
                    }
                });
            });
        }
    });
    

    // Bind the distance buttons in the header bar
    $('#distance-selector button').on('click', function(evt) {
        evt.preventDefault();
        NiceBites.loadMarkers(clientPosition, $(this).data('distance'));
    });
});