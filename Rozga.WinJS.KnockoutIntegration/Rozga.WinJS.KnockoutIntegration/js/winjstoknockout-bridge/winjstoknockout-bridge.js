/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

'use strict';

define([
    'require', // need this one to use relative paths below

    './src/knockout.observablearray.dataadapter',
    './src/ko.input.enterpressed',
    './src/ko.listview.selectedbinding',
    './src/ko.observablearray.subscribe',

    // bindings 
    './src/ko.winjs.appbar.menu.bindings',
    './src/ko.winjs.appbarandmenucommand.bindings',
    './src/ko.winjs.datepicker.bindings',
    './src/ko.winjs.listview.bindings',
    './src/ko.winjs.rating.bindings',
    './src/ko.winjs.wincontrol.bindings',

    './src/ko.winjs.templateutils'
]);