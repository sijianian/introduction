'use strict';

requirejs.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': 'jquery',
        'fullpage': 'fullPage',
        'materialize': 'materialize'

    },
    shim: {
        'fullpage': ['jquery'],
        'materialize': ['jquery']
    }
});

requirejs(['jquery', 'fullpage', 'materialize'], function ($) {
    $(function () {
        var runPage = new FullPage({
            id: 'pageContain', // id of contain
            slideTime: 1000, // time of slide
            continuous: true, // create an infinite feel with no endpoints
            effect: { // slide effect
                transform: {
                    translate: 'Y', // 'X'|'Y'|'XY'|'none'
                    scale: [.1, 1], // [scalefrom, scaleto]
                    rotate: [60, 0] // [rotatefrom, rotateto]
                },
                opacity: [0, 1] // [opacityfrom, opacityto]
            },
            mode: 'wheel,touch,nav:navBar', // mode of fullpage
            easing: 'ease-in-out' // easing('ease','ease-in','ease-in-out' or use cubic-bezier like [.33, 1.81, 1, 1];
        });
        $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .1, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            endingTop: '10%' });
    });
});
//# sourceMappingURL=base.js.map
