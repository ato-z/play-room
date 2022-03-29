"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ServiceWs = void 0;
var config_1 = __importDefault(require("../config"));
var exceptions_1 = require("../exceptions");
var WS_CODE_1 = require("../menu/WS_CODE");
var ws_1 = require("ws");
var start = config_1["default"].wxStartPort;
var ServiceWs = /** @class */ (function () {
    function ServiceWs() {
        this.wsList = [];
        var port = this.getPort();
        this.port = port;
        var wss = new ws_1.WebSocketServer({ port: port });
        this.wss = wss;
        this.init();
    }
    /**
     * 统一发送到客户的数据编码格式
     * @param data {any} 发送的数据
     * @param _code {number} 编码类型
     * @returns JSON.stringify({data, _code})
     * ```
     * ServiceWs.codeSendClientData({msg: 'opening...'}, 0) // => '{"code": 0, "data": {"msg": "opening"}}'
     * ```
     */
    ServiceWs.codeSendClientData = function (data, _code) {
        var code = _code || WS_CODE_1.WS_CODE.MSG;
        return JSON.stringify({ data: data, code: code });
    };
    /**
     * 向所有用户发起广播
     */
    ServiceWs.prototype.notify = function (data, code) {
        var wss = this.wss;
        wss.clients.forEach(function (ws) {
            ws.send(ServiceWs.codeSendClientData(data, code));
        });
    };
    /**
     * 初始化操作， 开启心跳包
     */
    ServiceWs.prototype.init = function () {
        var _this = this;
        var _a = this, wss = _a.wss, wsList = _a.wsList, port = _a.port;
        /** 每次链接成功后 */
        wss.on('connection', function (ws) {
            /** 监听用户发送的信息 */
            _this.onMeassage(ws);
            /** 标记活动用户 */
            ws.on('pong', function () {
                if (ws) {
                    Reflect.set(ws, 'isAlive', true);
                }
            });
            var linkNum = _this.wsList.length;
            wsList.push(ws);
            /** 链接成功发送一条消息 */
            ws.send(ServiceWs.codeSendClientData({ port: port, id: linkNum }, WS_CODE_1.WS_CODE.JOIN_ID));
        });
        /** 发送心跳包 */
        var IntervalHandle = function () {
            clearTimeout(_this.setIntervalIndex);
            wss.clients.forEach(function (ws) {
                if (Reflect.get(ws, 'isAlive').isAlive === false) {
                    return ws.terminate();
                }
                Reflect.set(ws, 'isAlive', false);
                ws.ping();
            });
            _this.setIntervalIndex = setTimeout(IntervalHandle, 30000);
        };
        IntervalHandle();
        /** 服务关闭时 */
        wss.on('close', function () {
            clearTimeout(_this.setIntervalIndex);
        });
    };
    ServiceWs.prototype.onMeassage = function (ws) {
        ws.onmessage = function (data) {
            try {
                var codeData = JSON.parse(data);
                if (codeData.target === undefined) {
                    throw new Error('target不能为空');
                }
            }
            catch (error) {
                ws.send(ServiceWs.codeSendClientData({ msg: error.message }, WS_CODE_1.WS_CODE.ERROR));
            }
        };
    };
    /**
     * 返回最近可用的一个端口号
     * @returns
     */
    ServiceWs.prototype.getPort = function () {
        var vals = Object.entries(ServiceWs.portOpen);
        var len = vals.length;
        if (len === 0) {
            return this.setPort(start);
        }
        if (len > config_1["default"].maxRoom) {
            throw new exceptions_1.ExceptionWSS.MaxConnect();
        }
        var i = 0;
        while (i < len) {
            var item = vals[i++];
            if (item[1] === false) {
                return this.setPort(item[0]);
            }
        }
        return this.setPort(start += 1);
    };
    /**
     * 把端口设置成不可用状态
     * @param val
     * @returns
     */
    ServiceWs.prototype.setPort = function (val) {
        ServiceWs.portOpen[val] = true;
        return parseInt(val);
    };
    /**
     * 关闭服务器
     */
    ServiceWs.prototype.close = function () {
        var _a = this, port = _a.port, wss = _a.wss;
        wss.close();
        ServiceWs.portOpen[port.toString()] = false;
        clearInterval(this.setIntervalIndex);
    };
    ServiceWs.portOpen = {};
    return ServiceWs;
}());
exports.ServiceWs = ServiceWs;
