/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

define(function () {
    // a fake listview that supports settings fake selections and notifying about a selection change.
    var FakeListView = WinJS.Class.define(function () {
        this.selection = {
            data: [],
            parent: this,
            getItems: function () {
                return WinJS.Promise.wrap(this.data);
            },
            add: function (item) { return WinJS.Promise.wrap(true); },
            remove: function (item) { return WinJS.Promise.wrap(true); },
            clear: function () { return WinJS.Promise.wrap(true); }
        };

    }, {
        setFakeSelection: function (fakeSelection) {
            this.selection.data = fakeSelection.map(function (itm) { return { data: itm }; });
            this.raiseFakeSelectionChanged();
        },
        raiseFakeSelectionChanged: function () {
            this.dispatchEvent('selectionchanged', {});
        }
    });
    WinJS.Class.mix(FakeListView, WinJS.Utilities.eventMixin);


    var FakeEventDispatcher = WinJS.Class.define(function () {
    }, {
        dispatchEvent: function (eventName) {
            this.dispatchEvent(eventName, {});
        }
    });
    WinJS.Class.mix(FakeEventDispatcher, WinJS.Utilities.eventMixin);
    

    return {
        FakeListView: FakeListView,
        FakeEventDispatcher: FakeEventDispatcher
    };
});