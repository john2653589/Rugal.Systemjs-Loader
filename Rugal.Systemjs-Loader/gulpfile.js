/// <binding BeforeBuild='clean-wwwroot/npm' AfterBuild='copy-wwwroot/npm' Clean='clean-wwwroot/npm' />

const Initer = require('@rugal.tu/gulp-initer');

Initer
    .AddFolder_Js('systemjs/dist')
    .InitTask();