/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

define(['src/winjstoknockout-bridge/src/knockout.observablearray.dataadapter',
        'specs/spec.fakes'], function (da, fakes) {
            describe("Observable Array DataAdapter", function () {
                var obsArray = null;
                var adapter = null;

                beforeEach(function () {
                    obsArray = new ko.observableArray([1, 2, 3].map(function (itm) { return { val: itm } }));
                    adapter = new da.KnockoutObservableArrayAdapter(obsArray, function (itm) { return itm.val.toFixed(); });
                });

                it("initial map occurs correctly", function () {
                    var r0 = null;
                    var r1 = null;
                    var r2 = null;
                    var countRequest = null;

                    runs(function() {
                        adapter.itemsFromIndex(0, 0, 0).then(function(r) { r0 = r;});
                        adapter.itemsFromIndex(1, 0, 0).then(function (r) { r1 = r; });
                        adapter.itemsFromIndex(2, 0, 0).then(function (r) { r2 = r; });
                        adapter.getCount().then(function (r) { countRequest = r; });
                    });

                    waitsFor(function () {
                        return r0 != null & r1 != null & r2 != null && countRequest != null;
                    }, 'Results not assigned', 250);
                    
                    runs(function () {
                        expect(r0.offset).toBe(0);
                        expect(r1.offset).toBe(0);
                        expect(r2.offset).toBe(0);

                        expect(countRequest).toBe(3);

                        expect(r0.items.length).toBe(1);
                        expect(r1.items.length).toBe(1);
                        expect(r2.items.length).toBe(1);
                        expect(r0.items[0].data).toEqual({ val: 1 });
                        expect(r1.items[0].data).toEqual({ val: 2 });
                        expect(r2.items[0].data).toEqual({ val: 3 });

                        expect(r0.totalCount).toBe(3);
                        expect(r1.totalCount).toBe(3);
                        expect(r2.totalCount).toBe(3);
                    });
                });

                it("fetching items around main index works correctly", function () {
                    var r0 = null;
                    var r1 = null;
                    var r2 = null;

                    runs(function () {
                        adapter.itemsFromIndex(0, 0, 2).then(function (r) { r0 = r; });
                        adapter.itemsFromIndex(1, 1, 1).then(function (r) { r1 = r; });
                        adapter.itemsFromIndex(2, 2, 0).then(function (r) { r2 = r; });
                    });

                    waitsFor(function () {
                        return r0 != null & r1 != null & r2 != null;
                    }, 'Results not assigned', 250);

                    runs(function () {
                        expect(r0.offset).toBe(0);
                        expect(r1.offset).toBe(1);
                        expect(r2.offset).toBe(2);

                        expect(r0.items.length).toBe(3);
                        expect(r1.items.length).toBe(3);
                        expect(r2.items.length).toBe(3);

                        expect(r0.items[0].data).toEqual({ val: 1 });
                        expect(r0.items[1].data).toEqual({ val: 2 });
                        expect(r0.items[2].data).toEqual({ val: 3 });
                        expect(r1.items[0].data).toEqual({ val: 1 });
                        expect(r1.items[1].data).toEqual({ val: 2 });
                        expect(r1.items[2].data).toEqual({ val: 3 });
                        expect(r2.items[0].data).toEqual({ val: 1 });
                        expect(r2.items[1].data).toEqual({ val: 2 });
                        expect(r2.items[2].data).toEqual({ val: 3 });

                        expect(r0.totalCount).toBe(3);
                        expect(r1.totalCount).toBe(3);
                        expect(r2.totalCount).toBe(3);
                    });
                });

                it("notifies when items are added", function () {

                    var r = null;

                    runs(function () {
                        var notificationHandler = {
                            inserted: function (item, keyBefore, keyAfter, index) {
                                expect(item.data).toEqual({ val: 7 });
                                expect(index).toBe(3);
                                expect(keyBefore).toBe("3");
                            },
                            removed: function (key, index) {
                                expect(key).toBe("3");
                                expect(index).toBe(2);
                            }
                        };

                        adapter.setNotificationHandler(notificationHandler);

                        obsArray.push({ val: 7 });
                        obsArray.remove(function (itm) { return itm.val == 3;});

                        adapter.itemsFromIndex(0, 0, 2).then(function (result) { r = result; });
                    });

                    waitsFor(function () {
                        return r != null;
                    }, 'did no get result', 250);

                    runs(function () {
                        expect(r.offset).toBe(0);
                        expect(r.items.length).toBe(3);

                        expect(r.items[0].data).toEqual({ val: 1 });
                        expect(r.items[1].data).toEqual({ val: 2 });
                        expect(r.items[2].data).toEqual({ val: 7 });

                        expect(r.totalCount).toBe(3);
                    });
                });

                it("notifies when items are deleted", function () {

                });
            });
        });