/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(function () {
    var returnKeyCode = 13;

    ko.bindingHandlers.inputelenterpressed = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var inputel = $(element);
            var handler = valueAccessor();

            inputel.keypress(function (ev) {
                if (ev.which != returnKeyCode) return;
                ev.preventDefault();

                var value = inputel.val();
                handler(value);
                inputel.val('');
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // no op
        }
    };
    return {};
});