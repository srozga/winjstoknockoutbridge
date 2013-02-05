/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// Code adapted from https://github.com/SteveSanderson/knockout/issues/502 and http://jsfiddle.net/mbest/Jq3ru/
'use strict';

define(function () {
    ko.observableArray.fn.subscribeArrayChanged = function (addCallback, deleteCallback) {
        var previousValue = undefined;
        this.subscribe(function (_previousValue) {
            previousValue = _previousValue.slice(0);
        }, undefined, 'beforeChange');
        this.subscribe(function (latestValue) {
            var editScript = ko.utils.compareArrays(previousValue, latestValue);
            for (var i = 0, j = editScript.length; i < j; i++) {

                var editEntry = editScript[i];

                switch (editEntry.status) {
                    case "retained":
                        break;
                    case "deleted":
                        if (deleteCallback)
                            deleteCallback(editEntry.index, editEntry.value);
                        break;
                    case "added":
                        if (addCallback)
                            addCallback(editEntry.index, editEntry.value);
                        break;
                }
            }
            previousValue = undefined;
        });
    };
    return {};
});