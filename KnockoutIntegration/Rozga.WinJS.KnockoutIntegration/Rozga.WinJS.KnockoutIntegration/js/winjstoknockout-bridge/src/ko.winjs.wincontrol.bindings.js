/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(function () {
    function Binding() {
        this.control = null;
        this.controlAttr = null;
        this.property = null;
        this.kosubscription = null;
        this.handlerRefs = [];
    }

    Binding.prototype.registerHandler = function (eventName, handler) {
        this.handlerRefs.push({ eventName: eventName, handler: handler });
    };

    Binding.prototype.dispose = function () {
        this.handlerRefs.forEach(function (ref) {
            this.control.removeEventListener(ref.eventName, ref.handler, false);
        }.bind(this));

        this.handlerRefs.splice(0, this.handlerRefs.length);
        this.handlerRefs = null;

        if (this.kosubscription != null) {
            this.kosubscription.dispose();
            this.kosubscription = null;
        }
        this.control = null;
        this.controlAttr = null;
        this.property = null;
    };

    function identity(o) { return o; }

    function bindOneWay(control, controlAttr, property, converter) {
        var conv = converter == undefined || converter == null ? identity : converter;
        var handler = function (val) {
            control[controlAttr] = conv(property());
        };
        control[controlAttr] = conv(property());

        var binding = new Binding();
        binding.kosubscription = property.subscribe(handler);
        return binding;
    }


    function bindTwoWay(control, controlAttr, controlChangeEvents, property, converter, backConverter) {
        var conv = converter == undefined || converter == null ? identity : converter;
        var backconv = backConverter == undefined || backConverter == null ? identity : backConverter;

        var handler = function (val) {
            control[controlAttr] = conv(property());
        };
        control[controlAttr] = conv(property());

        var binding = new Binding();
        binding.kosubscription = property.subscribe(handler);
        binding.control = control;
        binding.controlAttr = controlAttr;

        controlChangeEvents.forEach(function (eventName) {
            var evHandler = function () {
                property(backconv(control[controlAttr]));
            };
            binding.registerHandler(eventName, evHandler);
            control.addEventListener(eventName, evHandler, false);
        });
        return binding;
    }

    function bindOneWayToMethod(control, property, translator) {
        var binding = new Binding();
        var handler = function (val) {
            translator(control, property());
        };
        binding.kosubscription = property.subscribe(handler);
        translator(control, property());
        return binding;
    }

    function bindTwoWayToMethod(control, property, translator, controlChangeEvents, oppostiteTranslator) {
        var binding = new Binding();
        var handler = function (val) {
            translator(control, property());
        };
        translator(control, property());
        binding.kosubscription = property.subscribe(handler);
        binding.control = control;

        controlChangeEvents.forEach(function (eventName) {
            var evHandler = function () {
                property(oppostiteTranslator(control, eventName));
            };
            binding.registerHandler(eventName, evHandler);
            control.addEventListener(eventName, evHandler, false);
        });
        return binding;
    }

    function createTwoWayToMethodHandler(controlChangeEvents, translator, oppositeTranslator) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                bindTwoWayToMethod(element.winControl, valueAccessor(), translator, controlChangeEvents, oppositeTranslator);
            },
            update: function () {
                // noop
            }
        };
    }
    function createOneWayToMethodHandler(controlAttr, translator) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                bindOneWayToMethod(element.winControl, valueAccessor(), translator);
            },
            update: function () {
                // noop
            }
        };
    }

    function createTwoWayHandler(controlAttr, controlChangeEvents) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                bindTwoWay(element.winControl, controlAttr, controlChangeEvents, valueAccessor());
            },
            update: function () {
                // noop
            }
        };
    }
    function createOneWayHandler(controlAttr) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                bindOneWay(element.winControl, controlAttr, valueAccessor());
            },
            update: function () {
                // noop
            }
        };
    }

    ko.bindingHandlers.winjs_disabled = createOneWayHandler('disabled');

    return {
        bindOneWay: bindOneWay,
        bindTwoWay: bindTwoWay,
        bindOneWayToMethod: bindOneWayToMethod,
        bindTwoWayToMethod: bindTwoWayToMethod,
        createOneWayHandler: createOneWayHandler,
        createTwoWayHandler: createTwoWayHandler,
        createOneWayToMethodHandler: createOneWayToMethodHandler,
        createTwoWayToMethodHandler: createTwoWayToMethodHandler
    }
});