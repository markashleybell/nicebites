$(function () {

    // Bind the distance buttons in the header bar
    $('#distance-selector button').on('click', function(evt) {
        evt.preventDefault();
        NiceBites.loadMarkersWithin($(this).data('distance'));
    });

    //_mapContainer = $('#map-container');

    // Proportionally resize the map when the window size changes
    // $(window).bind('resize', function (e) {
    //     _mapContainer.css({ height: (_mapContainer.width() / 3) });
    // });

    // $(window).trigger('resize');

    NiceBites.init('map', 1);
});