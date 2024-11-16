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
    AddMap(Id, Option, Load = false) {
        let AddOption = this.$GenerateMap(Id, Option);
        AddOption.load ??= Load;
        if (Id in this.JsMap == false || !AddOption.margin)
            this.JsMap[Id] = AddOption;
        else {
            let MarginMap = this.JsMap[Id];
            MarginMap.url ??= AddOption.url;
            MarginMap.deps ??= AddOption.deps;
            MarginMap.load ??= AddOption.load;
            MarginMap.value ??= AddOption.value;
            MarginMap.margin ??= AddOption.margin;
            MarginMap.force ??= AddOption.force;
            AddOption = MarginMap;
        }
        if (AddOption.force == true && !AddOption.url.match(/^app:/g)) {
            let HasQuery = AddOption.url.includes('?');
            let Id = this.$GenerateId();
            AddOption.url += HasQuery ? `&id=${Id}` : `?id=${Id}`;
        }
        let NewMap = {};
        NewMap[Id] = AddOption.url;
        this.System.addImportMap({
            imports: {
                ...NewMap,
            }
        });
        if (AddOption.value != null)
            this.System.set(AddOption.url, AddOption.value);
        if (AddOption.load)
            this.AddLoad(Id);
        return this;
    }
    AddMapping(Maps, Load = false) {
        let AllKeys = Object.keys(Maps);
        for (let Key of AllKeys) {
            let MapValue = Maps[Key];
            this.AddMap(Key, MapValue, Load);
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
        for (let Id of UrlOrIds) {
            let GetMap = this.JsMap[Id];
            if (GetMap.url.match(/^app:/g) && GetMap.value == null)
                continue;
            if (ImportTask == null)
                ImportTask = this.System.import(Id);
            else
                ImportTask = ImportTask.then((Module) => {
                    if (Module.$promise instanceof Promise)
                        return Module.$promise
                            .then(() => this.System.import(Id))
                            .catch(() => this.System.import(Id));
                    if (typeof Module.$promise == 'function')
                        return Module.$promise()
                            .then(() => this.System.import(Id))
                            .catch(() => this.System.import(Id));
                    else
                        return this.System.import(Id);
                });
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
        else if (Option instanceof Promise) {
            Result.value = {
                $promise: Option,
            };
        }
        else if ('url' in Option ||
            'deps' in Option ||
            'load' in Option ||
            'value' in Option ||
            'margin' in Option)
            Result = Option;
        else
            Result.value = Option;
        Result.margin ??= true;
        Result.url ??= `app:${Id}`;
        return Result;
    }
    $GenerateId() {
        let NewId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            let RandomValue = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            let Id = char === 'x' ? RandomValue : (RandomValue & 0x3) | 0x8;
            return Id.toString(16);
        });
        return NewId;
    }
}
const JsLoader = new SystemJsLoader();
window.JsLoader = JsLoader;
exports.default = JsLoader;
//# sourceMappingURL=SystemJsLoader.js.map