/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(['./ko.winjs.wincontrol.bindings'], function (base) {
    ko.bindingHandlers.winjs_hidden = base.createOneWayHandler('hidden');
    ko.bindingHandlers.winjs_selected = base.createOneWayHandler('selected');
    ko.bindingHandlers.winjs_label = base.createOneWayHandler('label');
    ko.bindingHandlers.winjs_icon = base.createOneWayHandler('icon');
    ko.bindingHandlers.winjs_section = base.createOneWayHandler('section');
    ko.bindingHandlers.winjs_tooltip = base.createOneWayHandler('tooltip');
    ko.bindingHandlers.winjs_extraClass = base.createOneWayHandler('extraClass');
});