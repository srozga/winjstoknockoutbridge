/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// this covers the appbar and menu controls
'use strict';

define(['./ko.winjs.wincontrol.bindings'], function (base) {
    ko.bindingHandlers.winjs_sticky = base.createOneWayHandler('sticky');
    ko.bindingHandlers.winjs_placement = base.createOneWayHandler('placement');
    ko.bindingHandlers.winjs_anchor = base.createOneWayHandler('anchor');
    ko.bindingHandlers.winjs_alignment = base.createOneWayHandler('alignment');

    ko.bindingHandlers.winjs_commandcontainer_hidden = base.createTwoWayToMethodHandler(['aftershow', 'afterhide'],
        function(control, propertyValue) {
            if(propertyValue) control.hide();
            else control.show();
        },
        function(control, eventName) {
            if(eventName == 'aftershow') return false;
            else return true;
        });
});