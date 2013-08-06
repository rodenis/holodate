/*!
 * xButton v0.1 ~ Copyright (c) 2013 Denis Rodin, http://galaxyard.com
 * Released under MIT license
 */

(function(){
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

    var XButton = function(el, relations, handler, btnDownClass){
        var btn = this.element = typeof el == 'object' ? el : document.getElementById(el);
        btn.btnData = {};
        btn.btnData.relations = relations;
        btn.btnData.style = btnDownClass;
        btn.btnData.handler = handler;
        btn.addEventListener(START_EV, touchHandler, false);
        btn.addEventListener(MOVE_EV, touchHandler, false);
        btn.addEventListener(END_EV, touchHandler, false);
        if (hasTouch) {
            btn.addEventListener(CANCEL_EV, touchHandler, false);
        }
    };

    XButton.prototype = {
        destroy : function() {
            var btn = this.element;
            btn.btnData = null;
            btn.removeEventListener(START_EV, touchHandler, false );
            btn.removeEventListener(MOVE_EV, touchHandler, false );
            btn.removeEventListener(END_EV, touchHandler, false );
            if (hasTouch) {
                btn.removeEventListener(CANCEL_EV, touchHandler, false);
            }
        }
    };

    function touchHandler(e) {
        var data = this.btnData,
            point = hasTouch ? e.touches[0] : e;

        if (e.type == START_EV) {
            addClass(data.style, this);
            data.x = point.pageX;
            data.y = point.pageY;
            data.cancel = false;
        } else if (e.type == MOVE_EV) {
            var dx = Math.abs(data.x - point.pageX);
            var dy = Math.abs(data.y - point.pageY);
            if (dx>10 || dy > 10) {
                data.cancel = true;
                removeClass(data.style, this);
            }
        } else if (e.type == END_EV) {
            if (!data.cancel) {
                removeClass(data.style, this);
                //execute handler
                data.handler.call(this, data.relations);
            }
        } else if (e.type == CANCEL_EV) {
            data.cancel = true;
            removeClass(data.style, this);
        }
    }

    function addClass( classname, element ) {
        if (classname == null || classname == '') return;
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
        if (classname == null || classname == '') return;
        var cn = element.className;
        var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
        cn = cn.replace( rxp, '' );
        element.className = cn;
    }

    window.XButton = function(element, relations, handler, style) {
        return new XButton(element, relations, handler, style);
    };
}());