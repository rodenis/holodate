/*!
 * xButton v0.1 ~ Copyright (c) 2013 Denis Rodin, http://galaxyard.com
 * Released under MIT license
 */

(function(){
    var XButton = function(el, relations, handler, btnDownClass){
        var btn = this.element = typeof el == 'object' ? el : document.getElementById(el);;
        btn.btnData = {};
        btn.btnData.relations = relations;
        btn.btnData.style = btnDownClass;
        btn.btnData.handler = handler;
        btn.addEventListener('touchstart', touchHandler, false);
        btn.addEventListener('touchmove', touchHandler, false);
        btn.addEventListener('touchend', touchHandler, false);
    };

    XButton.prototype = {
        destroy : function() {
            this.element.btnData = null;
            this.element.removeEventListener('touchstart', touchHandler, false );
            this.element.removeEventListener('touchmove', touchHandler, false );
            this.element.removeEventListener('touchend', touchHandler, false );
        }
    };

    function touchHandler(e) {
        var data = this.btnData;
        if (e.type == 'touchstart') {
            addClass(data.style, this);
            data.x = e.touches[0].pageX;
            data.y = e.touches[0].pageY;
            data.cancel = false;
        } else if (e.type == 'touchmove') {
            var dx = Math.abs(data.x - e.touches[0].pageX);
            var dy = Math.abs(data.y - e.touches[0].pageY);
            if (dx>10 || dy > 10) {
                data.cancel = true;
                removeClass(data.style, this);
            }
        } else if (e.type == 'touchend') {
            if (!data.cancel) {
                removeClass(data.style, this);
                //execute handler
                data.handler(data.relations);
            }
        } else if (e.type == 'touchcancel') {
            data.cancel = true;
            removeClass(data.style, this);
        }
    }

    function addClass( classname, element ) {
        var cn = element.className;
        //test for existance
        if( cn.indexOf( classname ) != -1 ) {
            return;
        }
        //add a space if the element already has class
        if( cn != '' ) {
            classname = ' '+classname;
        }
        element.className = cn+classname;
    }

    function removeClass( classname, element ) {
        var cn = element.className;
        var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
        cn = cn.replace( rxp, '' );
        element.className = cn;
    }

    window.XButton = function(element, relations, handler, style) {
        return new XButton(element, relations, handler, style);
    };
}());