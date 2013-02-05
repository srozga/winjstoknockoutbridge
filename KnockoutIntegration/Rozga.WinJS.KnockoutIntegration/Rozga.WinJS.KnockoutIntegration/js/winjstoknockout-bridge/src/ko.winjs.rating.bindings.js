/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(['./ko.winjs.wincontrol.bindings'], function (base) {
    ko.bindingHandlers.winjs_averageRating = base.createOneWayHandler('averageRating');
    ko.bindingHandlers.winjs_maxRating = base.createOneWayHandler('maxRating');
    ko.bindingHandlers.winjs_userRating = base.createTwoWayHandler('userRating', ['change']);
    ko.bindingHandlers.winjs_enableClear = base.createOneWayHandler('enableClear');
    ko.bindingHandlers.winjs_tooltipStrings = base.createOneWayHandler('tooltipStrings');
});