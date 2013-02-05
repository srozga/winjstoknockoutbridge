/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// Work in progress of binding a winjs list view to a property on a knockout view model. for now supports one way binding. 
// TODO: need to work on two way binding.
'use strict';

define(function () {
    var listviewselectedbinder = {

        // binds the viewmodel's target property to the listview's selection
        bindSelectedItems: function (listview, viewModel, target) {
            var handler = function () {
                listview.selection.getItems().then(function (items) {
                    var mapped = items.map(function (itm) { return itm.data; });
                    listviewselectedbinder.mergeInOrderNoReplace(mapped, target);
                });
            };
            // we create the selectedItems property on the target object
            viewModel.___selectionhandler = handler;

            // run the handler once for the initial bind
            handler();

            // subscribe to selection changed event
            listview.addEventListener('selectionchanged', handler, false)
        },

        // binds the viewmodel's target property to the listview selection's first selected item
        // this is inteded for single selection scenarios
        bindSelectedItem: function (listview, viewModel, target) {
            var handler = function () {
                listview.selection.getItems().then(function (items) {
                    if (items == null || items.length == 0) { target(null); }
                    else {
                        target(items[0].data);
                    }
                });
            };
            // we create the selectedItems property on the target object
            viewModel.___selectionhandler = handler;

            // let's call the handler once to ensure a binds occurs
            handler();

            // now subscribe
            listview.addEventListener('selectionchanged', handler, false)
        },

        // unbindgs the selectionchanged event.
        unbindselected: function (listview, viewModel) {
            listview.removeEventListener('selectionchanged', viewModel.___selectionhandler);
        },

        // utility function to merge an array into a ko observable array. if items already exists in target, ensures
        // it does not get removed. at most it gets moved.
        // assumes order of items in src, target will be in the same order.
        // for example: say target is [2, 1, 3] if source contains the digits 2, 1 and 3, they have to be in the same order within
        // the src. [2, 1, 3] or  [2, 5 , 1 ,3] or [2 ,3] or [1, 3], etc.
        mergeInOrderNoReplace: function (source, target) {
            // remove all items that don't exist in items from selectedItems
            target.remove(function (item) {
                var index = source.indexOf(item);
                return index < 0;
            });

            // add remaining items from the selection that don't exist, IN ORDER
            for (var i = 0; i < source.length; i++) {
                var itm = source[i];

                if (target().length <= i) {
                    target.push(itm);
                } else {
                    var selectedItem = target()[i];
                    if (selectedItem != itm) {
                        target.splice(i, 0, itm); // add item at index i
                    }
                }
            }
        }
    };

    /* If you are trying to bind listviewselected to an observable array, it will populate the array with all selected items. If
     * you bind listviewselected to an observable, it will only bind the first value of the selection; this is intended for 
     * single item selection. */
    ko.bindingHandlers.listviewselected = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var listview = element.winControl;
            var value = valueAccessor();

            if ($.isArray(value())) {
                listviewselectedbinder.bindSelectedItems(listview, viewModel, value);
            } else if (ko.isObservable(value)) {
                listviewselectedbinder.bindSelectedItem(listview, viewModel, value);
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // nothing for this binding
        }
    };

    return { listviewselectedbinder: listviewselectedbinder };
});