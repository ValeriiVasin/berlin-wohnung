$(document).ready(function(){
    /* MAIN NAVIGATION DROPDOWN */
    $(function(){
        $(".content-navi-top ul.level1 li").hover(function(){
            $(this).addClass("hover");
            $('ul:first',this).css('visibility', 'visible');
        }, function(){
            $(this).removeClass("hover");
            $('ul:first',this).css('visibility', 'hidden');
        });
        $(".content-navi-top ul.level1 li ul li:has(ul)").addClass("arrow");
    });

    $('.toggleform').each(function(){
        $(this).bind('click', function(){
            $(this).parent().find('form').slideToggle();
            var span = $(this).find('span');
            span.text(span.text() === "%" ? "#" : "%");
        });
    });
    
    $('#geolocateuser').click(function() {
        berlin.service.googleMap.actions.geolocateUser();
    });
    
    /*$(".map-max").colorbox({
        html:'<div id="map-max" class="gmap-full"></div>',
        fixed: true,
        width: '90%',
        height: '90%',
        onComplete:function(){ 
            createMap('map-max', {showMaxLink : false});
            $('#map-max').css('height', $('#map-max').parent().height());
            google.maps.event.trigger(document.getElementById('map-max'), 'resize');
        }
      });*/
      
      $('#extendetsearch-controls').toggle();
      $('#extendetsearch-container a').show().click(function() {
        $('#extendetsearch-controls').slideToggle(300);
      });;
      
});

function createMap(mapId, options) {
    berlin.service.googleMap.initMap(mapId, options);
    return;
}

function initialize(options) {
    options = options || {};
    options.showMaxLink = true;
    createMap('gmap',  options);
}
  
function toggleGmap() {
    berlin.service.googleMap.actions.toggleGmap();
    return false;
}

function toggleOptions() {
    berlin.service.googleMap.actions.toggleOptions();
    return false;
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
       m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
         })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-43703317-1', 'berlin.de');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');

jQuery(function() {
    var $ = jQuery;
    $("#gmap").each(function() {
        ga('send', 'event', 'gmap', 'gmapDisplay', this.className, 1);
    });
});
