document.addEventListener( 'DOMContentLoaded', function(){
    document.removeEventListener( 'DOMContentLoaded', arguments.callee, false );
    docReady();
}, false );


function docReady() {
    var picker = document.getElementById('date');

    HDW(picker, {startYearOffset: -100});
}