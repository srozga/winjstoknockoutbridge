/* Copyright (c) 2013 Szymon Rozga
 * http://srozgawinjssamples.codeplex.com/
 *
 * See the file LICENSE.txt for copying permission. */

// stripped down version of Microsoft's default.js auto-generated file
(function () {
    'use strict';

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            args.setPromise(WinJS.UI.processAll().then(function () {
                return nav.navigate(Application.navigator.home);
            }));
        }
    });

    app.onerror = function (customEventObject) {
        // tell windows we've handled it and not to crash
        // http://social.msdn.microsoft.com/Forums/pl/winappswithhtml5/thread/9eff78a5-bb85-44a2-b3c2-d09c9af6c227
        return new WinJS.Promise(function (c, e, p) {
            c();
        });
    };
    app.start();
})();
