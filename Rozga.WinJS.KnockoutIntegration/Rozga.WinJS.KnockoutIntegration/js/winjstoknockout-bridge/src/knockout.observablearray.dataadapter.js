/*
KnockoutObservableArrayAdapter
http://srozgawinjssamples.codeplex.com/
Copyright (C) 2013, Szymon Rozga

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


This code depends on the functionality provided in ko.observablearray.suscribe.js

*/
'use strict';

define(function () {
    function KnockoutObservableArrayAdapter(observableArray, keySelector) {
        this._keySelector = keySelector;
        this._observableArray = observableArray;
        this._observableArray.subscribeArrayChanged(this._handleItemAdded.bind(this), this._handleItemDeleted.bind(this));
    };

    function _isValidIndex(index) {
        var count = this._observableArray().length;
        if (index >= count || index < 0) return false;
        return true;
    }
    function _handleItemAdded(index, value) {
        if (this._notificationHandler) {
            var prevKey = this._isValidIndex(index - 1) ? this._keySelector(this._observableArray()[index - 1]) : null;
            var nextKey = this._isValidIndex(index + 1) ? this._keySelector(this._observableArray()[index + 1]) : null;

            this._notificationHandler.inserted({
                index: index,
                key: this._keySelector(value),
                data: value
            }, prevKey, nextKey, index);
        }
    }
    function _handleItemDeleted(index, value) {
        if (this._notificationHandler) {
            this._notificationHandler.removed(this._keySelector(value), index);
        }
    }
    function itemsFromIndex(requestIndex, countBefore, countAfter) {
        var that = this;
        var count = this._observableArray().length;
        if (requestIndex >= count || requestIndex < 0) {
            return WinJS.Promise.wrapError('Request index out of bounds');
        }

        var firstIndex = requestIndex - countBefore;
        if (firstIndex < 0) firstIndex = 0;

        var lastIndex = requestIndex + countAfter;
        if (lastIndex >= count) lastIndex = count - 1;

        var fetchedItems = [];
        for (var i = firstIndex; i <= lastIndex; i++) {
            var data = this._observableArray()[i];

            fetchedItems.push({
                data: data,
                index: i,
                key: this._keySelector(data)
            });
        }

        return WinJS.Promise.wrap({
            offset: requestIndex - firstIndex,
            items: fetchedItems,
            totalCount: count
        });
    }
    function getCount() {
        return WinJS.Promise.wrap(this._observableArray().length);
    }
    function setNotificationHandler(handler) {
        this._notificationHandler = handler;
    }

    KnockoutObservableArrayAdapter.prototype._isValidIndex = _isValidIndex;
    KnockoutObservableArrayAdapter.prototype._handleItemAdded = _handleItemAdded;
    KnockoutObservableArrayAdapter.prototype._handleItemDeleted = _handleItemDeleted;
    KnockoutObservableArrayAdapter.prototype.itemsFromIndex = itemsFromIndex;
    KnockoutObservableArrayAdapter.prototype.getCount = getCount;
    KnockoutObservableArrayAdapter.prototype.setNotificationHandler = setNotificationHandler;

    var KnockoutObservableArrayDataSource = WinJS.Class.derive(WinJS.UI.VirtualizedDataSource, function (observableArray, keySelector) {
        this._baseDataSourceConstructor(new KnockoutObservableArrayAdapter(observableArray, keySelector));
    });
    return {
        KnockoutObservableArrayDataSource: KnockoutObservableArrayDataSource,
        KnockoutObservableArrayAdapter: KnockoutObservableArrayAdapter
    }
});