
JsLoader.AddMapping({
    'vue': 'app:vue',
    'vuetify': 'app:vuetify',
    'vuetify/components': 'app:vuetifyComponents',
    '@rugal.tu/vuemodel3': {
        url: '/npm/@rugal.tu/vuemodel3/dist/VueModel.sys.js',
        deps: 'vue',
    },
    '../dtvl/src/pv/dtvlpv': '/dtvl/src/pv/dtvlpv.js',
}, true).Init(() => {
    debugger;
})


JsLoader
    .AddLoad('page')
    .AddDeps('page', 'setup2')
    //.AddLoad(['setup2', 'page'])
    .Init(() => {
        console.log('init.js loaded');
    });