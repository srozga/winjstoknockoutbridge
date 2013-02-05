/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define(['./knockout.observablearray.dataadapter', './ko.winjs.templateutils'], function (koarraydapter, tmpl) {
    ko.bindingHandlers.winjs_datasource = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var listview = element.winControl;
            var obsArray = valueAccessor();

            listview.itemDataSource = new koarraydapter.KnockoutObservableArrayDataSource(obsArray, function (d) { return d.title(); });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // nothing for this binding
        }
    };

    ko.bindingHandlers.winjs_itemtemplate = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var listview = element.winControl;
            var templateId = valueAccessor();

            listview.itemTemplate = tmpl.renderTemplateAndBind(templateId);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // nothing for this binding
        }
    };
    return {};
});