/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// The set of view models used by the todo list app
'use strict';

define(function () {
    function TodoItemViewModel() {
        this.title = ko.observable('');
        this.completed = ko.observable(false);
        this.averageRating = ko.observable(3);
        this.maxRating = ko.observable(5);
        this.enableClear = ko.observable(true);
        this.userRating = ko.observable();
    }

    function TodoItemListViewModel() {
        var self = this;

        this.selectedItems = ko.observableArray();
        this.todoItems = ko.observableArray();


        this.completedItemsCount = ko.computed(function () {
            return self.todoItems().filter(function (item) { return item.completed(); }).length + '';
        });
        this.outstandingItemsCount = ko.computed(function () {
            return self.todoItems().filter(function (item) { return !item.completed(); }).length + '';
        });
        this.areNoItemsSelected = ko.computed(function () {
            return self.selectedItems().length == 0;
        });
    }

    function addItem(todoItemTitle) {
        if (todoItemTitle.length == 0) return;
        if (this.todoItems().some(function (item) { return item.title() == todoItemTitle; })) return;

        var item = new TodoItemViewModel();
        item.title(todoItemTitle);
        this.todoItems.push(item);
    }

    function removeSelectedItems() {
        var self = this;
        this.selectedItems().map(function (item) { return item;}).forEach(function (item) {
            self.todoItems.remove(item);
        });
    }

    TodoItemListViewModel.prototype.addItem = addItem;
    TodoItemListViewModel.prototype.removeSelectedItems = removeSelectedItems;


    return {
        TodoItemViewModel: TodoItemViewModel,
        TodoItemListViewModel: TodoItemListViewModel
    };
});
