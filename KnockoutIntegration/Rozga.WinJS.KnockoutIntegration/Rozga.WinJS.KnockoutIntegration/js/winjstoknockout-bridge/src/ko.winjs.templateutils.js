/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// This module contains helpers to bind Knockout.JS templates in the context of a WinJS ListView control.
'use strict';

define({

    // Renders the template with id templateId and binds it to the data object
    renderTemplateAndBind: function (templateId) {

        return function (itemPromise, recycled) {
            return new WinJS.Promise(function (c, e, p) {
                itemPromise.then(function (item) {

                    var element = recycled;
                    if (!element) {
                        var t = document.getElementById(templateId);
                        // clone the template element
                        var result = $(t.innerHTML).clone();
                        element = result[0];
                    } else {
                        // reusing the existing recycled element. assuming it is a pure MVVM design, rebinding it to 
                        // the new view model should just work
                    }

                    // ensuring we process all winjs controls before binding the knockout view model
                    WinJS.UI.processAll(element).then(function () {
                        ko.applyBindings(item.data, element);
                        c(element);
                    });
                });

            });
        };
    }
});