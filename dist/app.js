"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var awilix_1 = require("awilix");
var awilix_koa_1 = require("awilix-koa");
var middWareCrossDomain_1 = require("./middleware/middWareCrossDomain");
var middWareEmpty_1 = require("./middleware/middWareEmpty");
var middWareException_1 = require("./middleware/middWareException");
var middWareToken_1 = require("./middleware/middWareToken");
var middWareResquestBody_1 = require("./middleware/middWareResquestBody");
var middWareResult_1 = require("./middleware/middWareResult");
var koa_1 = __importDefault(require("koa"));
var config_1 = __importDefault(require("./config"));
var app = new koa_1["default"]();
/** 中间件处理流程 */
app.use(middWareCrossDomain_1.middWareCrossDomain); // 跨域
app.use(middWareException_1.middWareException); // 异常
app.use(middWareToken_1.middWareToken); // token处理
app.use(middWareResquestBody_1.middWareResquestBody); // 请求体
app.use(middWareResult_1.middWareResult); // 返回格式
/** ioc */
// 创建容器
var contriller = (0, awilix_1.createContainer)();
// 路由注入容器中
app.use((0, awilix_koa_1.scopePerRequest)(contriller));
// 加载控制器路由
app.use((0, awilix_koa_1.loadControllers)("".concat(__dirname, "/controller/*/*"), {
    formatName: 'camelCase',
    resolverOptions: {
        lifetime: awilix_1.Lifetime.SINGLETON
    }
}));
/** 404 放置最后 */
app.use(middWareEmpty_1.middWareEmpty);
/** 开启服务 */
var ip = config_1["default"].runIp;
var port = config_1["default"].runPort;
app.listen(port, ip, function () {
    console.log("http://".concat(ip, ":").concat(port));
});
