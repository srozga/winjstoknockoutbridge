/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

define(['src/winjstoknockout-bridge/src/ko.listview.selectedbinding',
        'specs/spec.fakes'], function (sb, fakes) {
    describe("List View Selected Binding", function () {
        describe("Binding Utility Functions", function () {
            var listviewfake = null;

            beforeEach(function () {
                listviewfake = new fakes.FakeListView();
            });

            it("can bind single selected item", function () {
                var prop = ko.observable();
                var vm = {};

                prop(1);
                expect(prop()).toBe(1);
                
                // bind
                sb.listviewselectedbinder.bindSelectedItem(listviewfake, vm, prop);

                expect(prop()).toBe(null);

                listviewfake.setFakeSelection([1]);
                expect(prop()).toBe(1);
                listviewfake.setFakeSelection([]);
                expect(prop()).toBe(null);
                listviewfake.setFakeSelection([2,1,3]);
                expect(prop()).toBe(2);
                listviewfake.setFakeSelection([1,2,3,4,5,6,7,8,9,10]);
                expect(prop()).toBe(1);
            });

            it("can bind multiple selected items", function () {
                var prop = ko.observableArray([1,2,3]);
                var vm = {};

                expect(prop()).toEqual([1, 2, 3]);

                // bind
                sb.listviewselectedbinder.bindSelectedItems(listviewfake, vm, prop);

                expect(prop()).toEqual([]);

                listviewfake.setFakeSelection([1]);
                expect(prop()).toEqual([1]);
                listviewfake.setFakeSelection([]);
                expect(prop()).toEqual([]);
                listviewfake.setFakeSelection([2, 1, 3]);
                expect(prop()).toEqual([2, 1, 3]);
                listviewfake.setFakeSelection([2, 1, 3, 4, 5, 6, 7, 8, 9, 10]);
                expect(prop()).toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10]);
                listviewfake.setFakeSelection([3, 4, 5, 6, 7, 8, 9, 10]);
                expect(prop()).toEqual([3, 4, 5, 6, 7, 8, 9, 10]);
            });
        });

        describe("Merge Utility Functions", function () {
            var addnotificationcount = 0;
            var deletenotificationcount = 0;
            beforeEach(function () {
                addnotificationcount = 0;
                deletenotificationcount = 0;
            });

            it("can merge into empty array", function () {
                var src = [1, 2, 3];
                var target = ko.observableArray();

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);
            });

            it("can merge into array with some items", function () {
                var src = [1, 2, 3];
                var target = ko.observableArray([1,2]);

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);
            });

            it("results in no change if array the same", function () {
                var src = [1, 2, 3];
                var target = ko.observableArray([1, 2, 3]); 

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);
            });

            it("removes items if target has extra", function () {
                var src = [1, 2, 3];
                var target = ko.observableArray([1, 2, 3, 4, 5]);

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);
            });

            it("prepends items if order off (not a great name)", function () {
                var src = [1, 2, 3];
                var target = ko.observableArray([3]);

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);
            });

            it("merges out of order collections", function () {
                var src = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10];
                var target = ko.observableArray([2,1,3]);
                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);
                expect(target()).toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10]);
            });
            

            it("removes items if target has extra", function () {
                var src = [];
                var target = ko.observableArray([1, 2, 3, 4, 5]); 

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(0);
            });

            it("substitues items if none match", function () {
                var src = [1, 2, 3];
                var target = ko.observableArray([4,5,6]);

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);
            });

            it("notifies zero times if arrays the same", function () {
                var src = [1, 2, 3];

                var target = ko.observableArray([1, 2, 3]);
                target.subscribeArrayChanged(function add() {
                    addnotificationcount++;
                }, function remove() {
                    deletenotificationcount++;
                });

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);

                expect(addnotificationcount).toBe(0);
                expect(deletenotificationcount).toBe(0);
            });

            it("notifies same times as initial array if target empty", function () {
                var src = [1, 2, 3];

                var target = ko.observableArray();
                target.subscribeArrayChanged(function add() {
                    addnotificationcount++;
                }, function remove() {
                    deletenotificationcount++;
                });

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);

                expect(addnotificationcount).toBe(3);
                expect(deletenotificationcount).toBe(0);
            });

            it("notifies remove count times if source empty", function () {
                var src = [];

                var target = ko.observableArray([1,2,3]);
                target.subscribeArrayChanged(function add() {
                    addnotificationcount++;
                }, function remove() {
                    deletenotificationcount++;
                });

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(0);

                expect(addnotificationcount).toBe(0);
                expect(deletenotificationcount).toBe(3);
            });


            it("notifies remove and add count times if some removed and some added", function () {
                var src = [1,2,3];

                var target = ko.observableArray([3, 4, 6]);
                target.subscribeArrayChanged(function add() {
                    addnotificationcount++;
                }, function remove() {
                    deletenotificationcount++;
                });

                sb.listviewselectedbinder.mergeInOrderNoReplace(src, target);

                expect(target().length).toBe(3);
                expect(target()[0]).toBe(1);
                expect(target()[1]).toBe(2);
                expect(target()[2]).toBe(3);

                expect(addnotificationcount).toBe(2);
                expect(deletenotificationcount).toBe(2);
            });
        });
    });
});