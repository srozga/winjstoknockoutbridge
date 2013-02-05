/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(['src/winjstoknockout-bridge/src/ko.winjs.wincontrol.bindings',
        'specs/spec.fakes'], function (base, fakes) {

            describe("Binding Helper", function () {
                describe("One Way Binding to Property", function () {

                    it("binds value without converter", function () {
                        var target = { value: 10 };
                        var source = ko.observable(20);

                        expect(target.value).toBe(10);

                        base.bindOneWay(target, 'value', source);

                        expect(target.value).toBe(20);

                        source(40);
                        expect(target.value).toBe(40);

                        target.value = 50;
                        expect(source()).toBe(40);

                        source(60);
                        expect(target.value).toBe(60);
                    });

                    it("uses converter in one way binding", function () {
                        var target = { value: true };
                        var source = ko.observable(20);
                        var converter = function (num) { return num > 0;}

                        base.bindOneWay(target, 'value', source, converter);

                        expect(target.value).toBe(true);

                        source(40);
                        expect(target.value).toBe(true);

                        source(-100);
                        expect(target.value).toBe(false);

                        source(100);
                        expect(target.value).toBe(true);
                    });

                    it("accepts null converter", function () {
                        var target = { value: 10 };
                        var source = ko.observable(20);

                        expect(target.value).toBe(10);

                        base.bindOneWay(target, 'value', source, null);

                        expect(target.value).toBe(20);

                        source(40);
                        expect(target.value).toBe(40);

                        target.value = 50;
                        expect(source()).toBe(40);

                        source(60);
                        expect(target.value).toBe(60);

                    });


                    it("cleanly disposes", function () {
                        var target = { value: 10 };
                        var source = ko.observable(20);

                        expect(target.value).toBe(10);

                        var b = base.bindOneWay(target, 'value', source);

                        expect(target.value).toBe(20);

                        b.dispose();

                        source(40);
                        expect(target.value).toBe(20);

                    });
                });
                describe("Two Way Binding to Property", function () {

                    var source;
                    var target;
                    var binding;

                    beforeEach(function () {
                        target = new fakes.FakeEventDispatcher();
                        target.value = 10;
                        source = ko.observable(20);
                    });

                    it("binds two way to property", function () {
                        expect(target.value).toBe(10);

                        binding = base.bindTwoWay(target, 'value', ['change'], source);

                        expect(target.value).toBe(20);

                        source(40);
                        expect(target.value).toBe(40);

                        target.value = 50;
                        expect(source()).toBe(40);

                        target.dispatchEvent('change');
                        expect(source()).toBe(50);

                        source(60);
                        expect(target.value).toBe(60);

                    });

                    it("accepts null converters", function () {
                        expect(target.value).toBe(10);

                        binding = base.bindTwoWay(target, 'value', ['change'], source, null, null);

                        expect(target.value).toBe(20);

                        source(40);
                        expect(target.value).toBe(40);

                        target.value = 50;
                        expect(source()).toBe(40);

                        target.dispatchEvent('change');
                        expect(source()).toBe(50);

                        source(60);
                        expect(target.value).toBe(60);
                    });


                    it("accepts converters", function () {
                        binding = base.bindTwoWay(target, 'value', ['change'], source, function (o) {
                            return o > 0;
                        }, function (o) {
                            if (o) return 1; return -1;
                        });

                        expect(target.value).toBe(true);

                        source(-40);
                        expect(target.value).toBe(false);

                        target.value = true;
                        expect(source()).toBe(-40);
                        target.dispatchEvent('change');
                        expect(source()).toBe(1);

                        target.value = false;
                        target.dispatchEvent('change');
                        expect(source()).toBe(-1);

                        source(60);
                        expect(target.value).toBe(true);
                    });

                    it("cleanly disposes two way to property binding", function () {
                        expect(target.value).toBe(10);

                        binding = base.bindTwoWay(target, 'value', ['change'], source);

                        expect(target.value).toBe(20);

                        target.value = 50;
                        target.dispatchEvent('change');
                        expect(source()).toBe(50);

                        binding.dispose();

                        target.value = 60;
                        target.dispatchEvent('change');
                        expect(source()).toBe(50);

                        source(100);
                        expect(target.value).toBe(60);
                    });
                });

                describe("One Way Binding to Method", function () {
                    var source;
                    var target;
                    var binding;

                    beforeEach(function () {
                        target = new fakes.FakeEventDispatcher();
                        target.dotrue = function () { console.log("true"); }
                        target.dofalse = function () { console.log("false"); }
                        spyOn(target, 'dotrue');
                        spyOn(target, 'dofalse');

                        source = ko.observable(true);
                        binding = base.bindOneWayToMethod(target, source, function (control, propertyValue) {
                            if (propertyValue) control.dotrue();
                            else control.dofalse();
                        });
                    });

                    it("binds one way to method", function () {
                        expect(target.dofalse.calls.length).toBe(0);
                        expect(target.dotrue.calls.length).toBe(1);

                        source(false);

                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(1);

                        source(true);

                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(2);

                        source(true);

                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(2); // change should not be raised
                    });

                    it("disconnects binding on dispose", function () {
                        source(false);
                        source(true);
                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(2);

                        binding.dispose();

                        source(false);
                        source(true);
                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(2);


                    });
                });

                describe("Two Way Binding to Method", function () {
                    var target;
                    var source;
                    var binding;

                    beforeEach(function () {
                        target = new fakes.FakeEventDispatcher();
                        target.dotrue = function () { console.log("true"); }
                        target.dofalse = function () { console.log("false"); }
                        spyOn(target, 'dotrue');
                        spyOn(target, 'dofalse');

                        source = ko.observable(true);
                        binding = base.bindTwoWayToMethod(target, source, function (control, propertyValue) {
                            if (propertyValue) control.dotrue();
                            else control.dofalse();
                        },
                        ['true', 'false'],
                        function (control, eventName) {
                            if (eventName == 'true') return true;
                            else if (eventName == 'false') return false;
                            throw new Exception();
                        });
                    });
                    

                    it("binds two way to method", function () {
                        expect(target.dofalse.calls.length).toBe(0);
                        expect(target.dotrue.calls.length).toBe(1);

                        source(false);

                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(1);

                        source(true);

                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(2);

                        source(true);

                        expect(target.dofalse.calls.length).toBe(1);
                        expect(target.dotrue.calls.length).toBe(2); // change should not be raised

                        // now we push out some events

                        target.dispatchEvent('true');
                        expect(source()).toBe(true); // no change because it's already true
                        target.dispatchEvent('false');
                        expect(source()).toBe(false);

                        expect(target.dofalse.calls.length).toBe(2);
                        expect(target.dotrue.calls.length).toBe(2);

                        source(false);
                        expect(target.dofalse.calls.length).toBe(2);
                        expect(target.dotrue.calls.length).toBe(2);
                        source(true);
                        source(false);
                        expect(target.dofalse.calls.length).toBe(3);
                        expect(target.dotrue.calls.length).toBe(3);

                        target.dispatchEvent('true');
                        expect(source()).toBe(true); // no change because it's already true
                        expect(target.dofalse.calls.length).toBe(3);
                        expect(target.dotrue.calls.length).toBe(4);
                    });

                    it("disconnects binding on dispose", function () {
                        source(false);
                        source(true);
                        source(true);

                        target.dispatchEvent('false');
                        expect(source()).toBe(false);

                        expect(target.dofalse.calls.length).toBe(2);
                        expect(target.dotrue.calls.length).toBe(2);

                        source(true);
                        source(false);
                        expect(target.dofalse.calls.length).toBe(3);
                        expect(target.dotrue.calls.length).toBe(3);

                        binding.dispose();

                        target.dispatchEvent('true');
                        expect(source()).toBe(false); 
                        expect(target.dofalse.calls.length).toBe(3);
                        expect(target.dotrue.calls.length).toBe(3);

                        source(true);
                        source(false);
                        expect(target.dofalse.calls.length).toBe(3);
                        expect(target.dotrue.calls.length).toBe(3);
                    });
                });
            });
        });