"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemJsLoader {
    System = window.System;
    JsMap = {};
    LoadQueue = [];
    AddPage(Option) {
        this.AddMap('page', Option);
        return this;
    }
    AddMap(Id, Option) {
        let NewMap = {};
        let AddOption = this.$GenerateMap(Id, Option);
        if (Id in this.JsMap == false || !AddOption.margin)
            this.JsMap[Id] = AddOption;
        else {
            let GetMap = this.JsMap[Id];
            GetMap.url ??= AddOption.url;
            GetMap.deps ??= AddOption.deps;
            GetMap.load ??= AddOption.load;
            GetMap.value ??= AddOption.value;
            GetMap.margin ??= AddOption.margin;
            AddOption = GetMap;
        }
        NewMap[Id] = AddOption.url;
        this.System.addImportMap({
            imports: {
                ...NewMap,
            }
        });
        if (AddOption.value != null)
            this.System.set(AddOption.url, AddOption.value);
        return this;
    }
    AddMapLoad(Id, Option) {
        this.AddMap(Id, Option);
        this.AddLoad(Id);
        return this;
    }
    AddMapping(Maps, Load = false) {
        let AllKeys = Object.keys(Maps);
        for (let Key of AllKeys) {
            let MapValue = Maps[Key];
            let AddMap = this.$GenerateMap(Key, MapValue);
            AddMap.load ??= Load;
            if (AddMap.load)
                this.AddMapLoad(Key, AddMap);
            else
                this.AddMap(Key, AddMap);
        }
        return this;
    }
    AddLoad(UrlOrIds) {
        if (typeof (UrlOrIds) == 'string')
            UrlOrIds = [UrlOrIds];
        for (let Js of UrlOrIds)
            this.LoadQueue.push(Js);
        return this;
    }
    LoadNow(UrlOrIds, CompleteFunc) {
        if (typeof (UrlOrIds) == 'string')
            UrlOrIds = [UrlOrIds];
        UrlOrIds = this.$OrderDeps(UrlOrIds);
        let ImportTask = null;
        for (let Js of UrlOrIds) {
            if (ImportTask == null)
                ImportTask = this.System.import(Js);
            else
                ImportTask = ImportTask.then(() => this.System.import(Js));
        }
        if (CompleteFunc != null) {
            if (ImportTask != null)
                ImportTask.then(() => CompleteFunc());
            else
                CompleteFunc();
        }
        return this;
    }
    Init(CompleteFunc) {
        this.LoadNow(this.LoadQueue, CompleteFunc);
        return this;
    }
    AddDeps(Id, Deps) {
        let GetMap = this.JsMap[Id];
        if (GetMap == null) {
            this.JsMap[Id] = {};
        }
        this.JsMap[Id].deps = Deps;
        return this;
    }
    $OrderDeps(UrlOrIds) {
        let CloneQueue = [...UrlOrIds];
        let Result = [];
        while (CloneQueue.length > 0) {
            let Id = CloneQueue.shift();
            let DepsQueue = this.$RCS_OrderDeps(Id);
            for (let Deps of DepsQueue)
                if (!Result.includes(Deps))
                    Result.push(Deps);
        }
        return Result;
    }
    $RCS_OrderDeps(Id, Result) {
        Result ??= [];
        let JsSet = this.JsMap[Id];
        if (JsSet == null || JsSet.deps == null) {
            if (!Result.includes(Id))
                Result.splice(0, 0, Id);
            return Result;
        }
        let QueryDeps = JsSet.deps;
        if (typeof (QueryDeps) == 'string')
            QueryDeps = [QueryDeps];
        for (let Deps of QueryDeps)
            this.$RCS_OrderDeps(Deps, Result);
        if (!Result.includes(Id))
            Result.push(Id);
        return Result;
    }
    $GenerateMap(Id, Option) {
        let Result = {};
        if (Option == null)
            return Result;
        if (typeof (Option) == 'string')
            Result.url = Option;
        else {
            let AnyOption = Option;
            if ('url' in AnyOption ||
                'deps' in AnyOption ||
                'load' in AnyOption ||
                'value' in AnyOption ||
                'margin' in AnyOption)
                Result = Option;
            else
                Result.value = Option;
        }
        Result.margin ??= true;
        Result.url ??= `app:${Id}`;
        return Result;
    }
}
const JsLoader = new SystemJsLoader();
window.JsLoader = JsLoader;
exports.default = JsLoader;
//# sourceMappingURL=SystemJsLoader.js.map