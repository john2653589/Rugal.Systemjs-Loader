type PromiseValue = {
    $promise: Promise<any> | (() => Promise<any>);
};
type JsMap = {
    url?: string;
    deps?: string | string[];
    load?: boolean;
    value?: object | PromiseValue;
    margin?: boolean;
};
declare class SystemJsLoader {
    System: any;
    JsMap: Record<string, JsMap>;
    LoadQueue: string[];
    AddPage(Option?: JsMap | string | object): this;
    AddMap(Id: string, Option?: JsMap | string | object, Load?: boolean): this;
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
