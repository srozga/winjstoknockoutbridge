/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// koobservablearray page
// Utilizies the knockout viewmodels and a presenter to hook up knockout's observable array into a WinJS ListView
'use strict';

(function () {
    WinJS.UI.Pages.define("/pages/koobservablearray/koobservablearray.html", {
        ready: function (element, options) {
            require(['pages/koobservablearray/todo-models'], function (models, presenter) {
                var listview = $('#listview')[0].winControl;
                var vm = new models.TodoItemListViewModel();
                ko.applyBindings(vm, $('section[role=main]')[0]);
                ko.applyBindings(vm, $('#appbar')[0]);
            });
        }
    });
})();
