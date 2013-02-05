/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(['./ko.winjs.wincontrol.bindings'], function (base) {
    ko.bindingHandlers.winjs_current = base.createTwoWayHandler('current', ['change']);
    ko.bindingHandlers.winjs_calendar = base.createOneWayHandler('calendar');
    ko.bindingHandlers.winjs_datePattern = base.createOneWayHandler('datePattern');
    ko.bindingHandlers.winjs_maxYear = base.createOneWayHandler('maxYear');
    ko.bindingHandlers.winjs_minYear = base.createOneWayHandler('minYear');
    ko.bindingHandlers.winjs_monthPattern = base.createOneWayHandler('monthPattern');
    ko.bindingHandlers.winjs_yearPattern = base.createOneWayHandler('yearPattern');
});