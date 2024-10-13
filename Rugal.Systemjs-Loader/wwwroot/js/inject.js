

JsLoader.AddMapping({
    setup: {
        url: '/js/setup.js',
    },
    setup2: {
        url: '/js/setup2.js',
        deps: ['setup'],
    },
});