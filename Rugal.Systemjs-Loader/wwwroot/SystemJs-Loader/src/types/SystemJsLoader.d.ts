type JsMap = {
    url?: string;
    deps?: string | string[];
    load?: boolean;
    value?: any;
    margin?: boolean;
};
declare class SystemJsLoader {
    System: any;
    JsMap: Record<string, JsMap>;
    LoadQueue: string[];
    AddPage(Option?: JsMap | string | object): this;
    AddMap(Id: string, Option?: JsMap | string | object): this;
    AddMapLoad(Id: string, Option?: JsMap | string | object): this;
    AddMapping(Maps: Record<string, JsMap | string | object>, Load?: boolean): this;
    AddLoad(UrlOrIds: string | string[]): this;
    LoadNow(UrlOrIds: string | string[], CompleteFunc?: Function): this;
    Init(CompleteFunc?: Function): this;
    AddDeps(Id: string, Deps: string | string[]): this;
    private $OrderDeps;
    private $RCS_OrderDeps;
    private $GenerateMap;
}
declare const JsLoader: SystemJsLoader;
export default JsLoader;
