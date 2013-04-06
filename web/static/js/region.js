$(function () {

    var regionPosition = {
        lat: '50.36833260763417',
        lng: '-4.140386894659514'
    };

    // Proportionally resize the map when the window size changes
    // $(window).bind('resize', function (e) {
    //     _mapContainer.css({ height: (_mapContainer.width() / 3) });
    // });

    // $(window).trigger('resize');

    // Initially load the map centred on the region
    NiceBites.init('map', regionPosition, 15);
    
    // Bind the range buttons
    $('#distance-selector button').on('click', function(evt) {
        evt.preventDefault();
        var r = $(this).data('distance');

        NiceBites.loadMarkers({ 
            range: r,
            regionId: 1,
            callback: function() {
                console.log('Adjusted range to ' + r + 'km');
            }
        });
    });
});