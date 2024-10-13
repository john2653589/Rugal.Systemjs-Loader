type JsMap = {
    url?: string;
    deps?: string | string[];
    load?: boolean;
    value?: any;
    margin?: boolean,
}
class SystemJsLoader {

    System: any = (window as any).System;
    JsMap: Record<string, JsMap> = {};
    LoadQueue: string[] = [];

    public AddPage(Option?: JsMap | string | object) {
        this.AddMap('page', Option);
        return this;
    }
    public AddMap(Id: string, Option?: JsMap | string | object) {
        let NewMap: Record<string, string> = {};
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
    public AddMapLoad(Id: string, Option?: JsMap | string | object) {
        this.AddMap(Id, Option);
        this.AddLoad(Id);
        return this;
    }
    public AddMapping(Maps: Record<string, JsMap | string | object>, Load: boolean = false) {
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
    public AddLoad(UrlOrIds: string | string[]) {
        if (typeof (UrlOrIds) == 'string')
            UrlOrIds = [UrlOrIds];

        for (let Js of UrlOrIds)
            this.LoadQueue.push(Js);

        return this;
    }

    public LoadNow(UrlOrIds: string | string[], CompleteFunc?: Function) {
        if (typeof (UrlOrIds) == 'string')
            UrlOrIds = [UrlOrIds];

        UrlOrIds = this.$OrderDeps(UrlOrIds);
        let ImportTask: Promise<any> = null;
        for (let Js of UrlOrIds) {
            if (ImportTask == null)
                ImportTask = this.System.import(Js) as Promise<any>;
            else
                ImportTask = ImportTask.then(() => this.System.import(Js) as Promise<any>);
        }

        if (CompleteFunc != null) {
            if (ImportTask != null)
                ImportTask.then(() => CompleteFunc());
            else
                CompleteFunc();
        }

        return this;
    }
    public Init(CompleteFunc?: Function) {
        this.LoadNow(this.LoadQueue, CompleteFunc);
        return this;
    }
    public AddDeps(Id: string, Deps: string | string[]) {
        let GetMap = this.JsMap[Id];
        if (GetMap == null) {
            this.JsMap[Id] = {};
        }
        this.JsMap[Id].deps = Deps;
        return this;
    }

    private $OrderDeps(UrlOrIds: string[]): string[] {
        let CloneQueue = [...UrlOrIds];
        let Result: string[] = [];
        while (CloneQueue.length > 0) {
            let Id = CloneQueue.shift();
            let DepsQueue = this.$RCS_OrderDeps(Id);
            for (let Deps of DepsQueue)
                if (!Result.includes(Deps))
                    Result.push(Deps);
        }
        return Result;
    }
    private $RCS_OrderDeps(Id: string, Result?: string[]) {
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
    private $GenerateMap(Id: string, Option: JsMap | string | object): JsMap {
        let Result: JsMap = {};
        if (Option == null)
            return Result;

        if (typeof (Option) == 'string')
            Result.url = Option;
        else {
            let AnyOption = Option as any;
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
(window as any).JsLoader = JsLoader;
export default JsLoader;
