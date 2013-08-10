/*!
 * HoloDateWidget v0.2.1 ~ Copyright (c) 2013 Denis Rodin, http://galaxyard.com
 * Released under MIT license
 */

(function(){
    /*var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';*/

    var defOptions = {
        onChange: function(val) {},
        defDate: new XDate(),
        locale: 'ru',
        dateFormat: 'dd/MM/yyyy',
        startYearOffset: -10,
        endYearOffset: +10
    };

    var HDW = function(el, options){
        this.element = typeof el == 'object' ? el : document.getElementById(el);
        this.options = extend(defOptions, options);
        XDate.defaultLocale = this.options.locale;

        if (this.element.value != null && this.element.value != '') {
            this.date = new XDate(this.element.value);
        } else {
            this.date = this.options.defDate;
        }

        var that = this, opt=that.options;

        if (opt.startYearOffset>=opt.endYearOffset) {
            opt.endYearOffset = opt.startYearOffset + 2;
        }
        that.startYear = that.date.getFullYear()+opt.startYearOffset;
        that.endYear = that.date.getFullYear()+opt.endYearOffset;

        this.element.readOnly = true;

        var hdw = document.createDocumentFragment();
        var dlg = newDiv('hdw-dialog hdw-theme', hdw);
        dlg.style.display = 'none';

        var btn = newDiv('hdw-btn theme', dlg);
        btn.innerText = 'OK';

        var title = newDiv('hdw-title theme', dlg);
        title.innerText = that.options.defDate.toString('ddd d MMMM, yyyy', that.options.locale);

        //day selector
        var daySel = newDiv('hdw-day-sel', dlg);
        newDiv('hdw-day-active theme', dlg);
        newDiv('hdw-day-grad theme', dlg);

        var scl =  newDiv('hdw-day-scl', daySel);
        var ul = newElement('ul','hdw-day-ul',scl);

        var li = newElement('li','hdw-day-li theme',ul);
        for (var i=1; i<32; ++i) {
            li = newElement('li','hdw-day-li theme',ul);
            li.innerText = i;
        }
        newElement('li','hdw-day-li theme',ul);

        //month selector
        var monthSel = newDiv('hdw-month-sel', dlg);
        newDiv('hdw-month-active theme', dlg);
        newDiv('hdw-month-grad theme', dlg);

        scl =  newDiv('hdw-month-scl', monthSel);
        ul = newElement('ul','hdw-month-ul',scl);

        li = newElement('li','hdw-month-li theme',ul);
        for (var i=1; i<13; ++i) {
            li = newElement('li','hdw-month-li theme',ul);
            li.innerText = i;
        }
        newElement('li','hdw-month-li theme',ul);

        //year selector
        var yearSel = newDiv('hdw-year-sel', dlg);
        newDiv('hdw-year-active theme', dlg);
        newDiv('hdw-year-grad theme', dlg);

        scl =  newDiv('hdw-year-scl', yearSel);
        ul = newElement('ul','hdw-year-ul',scl);

        li = newElement('li','hdw-year-li theme',ul);

        for (var i=that.startYear; i<=that.endYear; ++i) {
            li = newElement('li','hdw-year-li theme',ul);
            li.innerText = i;
        }
        newElement('li','hdw-year-li theme',ul);

        var ovl = newDiv('hdw-overlay', hdw);
        ovl.style.display = 'none';

        document.body.appendChild(hdw);

        this.dayScroll = new iScroll(daySel, {
            snap: 'li',
            momentum: true,
            hScrollbar: false,
            vScrollbar: false,
            hScroll: false,
            bounce: false,
            useTransition:true
        }, function(day) {
            that.date.setDate(day+1);
            updateDate(that.date, that, title);
        });

        this.monthScroll = new iScroll(monthSel, {
            snap: 'li',
            momentum: true,
            hScrollbar: false,
            vScrollbar: false,
            hScroll: false,
            bounce: false,
            useTransition:true
        }, function(month) {
            that.date.setMonth(month);
            updateDate(that.date, that, title);
        });

        this.yearScroll = new iScroll(yearSel, {
            snap: 'li',
            momentum: true,
            hScrollbar: false,
            vScrollbar: false,
            hScroll: false,
            bounce: false,
            useTransition:true
        }, function(yearNum) {
            that.date.setFullYear(that.startYear+yearNum);
            updateDate(that.date, that, title);
        });

        this.xbtn = XButton(btn, {dlg: dlg, ovl: ovl, hdw: this}, onOkBtnClick, 'btn-down');

        this.xElement = XButton(this.element, {dlg: dlg, ovl: ovl, that: that, title: title} , elClick, '');
    };

    HDW.prototype = {
        destroy: function(){
            this.xbtn.destroy();
            this.xbtn = null;
            this.dayScroll.destroy();
            this.dayScroll = null;
            this.monthScroll.destroy();
            this.monthScroll = null;
            this.yearScroll.destroy();
            this.yearScroll = null;
            this.xElement.destroy();
            this.xElement = null;
        }
    };

    function elClick(rel) {
        var dlg = rel.dlg,
            ovl = rel.ovl,
            that = rel.that,
            title = rel.title;

        ovl.style.display = 'block';
        dlg.style.display = 'block';
        ovl.style.opacity = 0.5;
        dlg.style.opacity = 1;

        setDate(that, title);
    }

    function onOkBtnClick(rel) {
        var dlg = rel.dlg;
        var ovl = rel.ovl;
        var hdw = rel.hdw;

        ovl.style.display = 'none';
        dlg.style.display = 'none';
        ovl.style.opacity = 0;
        dlg.style.opacity = 0;

        //set input date
        hdw.element.value = hdw.date.toString(hdw.options.dateFormat, hdw.options.locale);
        hdw.options.onChange(hdw.date);
    }

    function setDate(that, title) {
        var date = that.date;
        title.innerText = date.toString('ddd d MMMM, yyyy', that.options.locale);
        var day = date.getDate()-1;
        var month = date.getMonth();
        var yearNum = date.getFullYear() - that.startYear;

        that.dayScroll.refresh();
        that.dayScroll.scrollToPage(0, day, 0);

        that.monthScroll.refresh();
        that.monthScroll.scrollToPage(0, month, 0);

        that.yearScroll.refresh();
        that.yearScroll.scrollToPage(0, yearNum, 0);
    }

    function updateDate(date, that, title) {
        title.innerText = date.toString('ddd d MMMM, yyyy', that.options.locale);
    }

    /*function deliverTouchEvents(from, to) {
        var deliver = function(e) {
            to.dispatchEvent(e);
        }

        from.addEventListener(START_EV, deliver, true);
        from.addEventListener(MOVE_EV, deliver, true);
        from.addEventListener(END_EV, deliver, true);
        from.addEventListener(CANCEL_EV, deliver, true);
    }*/

    function newDiv(className, parent) {
        var div = document.createElement('div');
        div.className=className;
        parent.appendChild(div);
        return div;
    }

    function newElement(tag, className, parent) {
        var el = document.createElement(tag);
        el.className=className;
        parent.appendChild(el);
        return el;
    }

    function extend(destination, source) {
        for (var k in source) {
            if (source.hasOwnProperty(k)) {
                destination[k] = source[k];
            }
        }
        return destination;
    }

    window.HDW = function(element, options) {
        return new HDW(element, options);
    };

}());