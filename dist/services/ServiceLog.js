"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var utils_1 = require("../utils/utils");
// 如果保存路径不存在则进行创建
var savePath = "".concat(__dirname, "/../../runtime/log");
(0, utils_1.touchPath)(savePath);
/**
 * 简单的日志写入类
 */
var ServiceLog = /** @class */ (function () {
    function ServiceLog() {
    }
    /**
     * 将异常写入到当天的日志
     * @param error 发生异常的错误实例
     */
    ServiceLog.writeToDay = function (error, other, path) {
        if (other === void 0) { other = ''; }
        var date = new Date();
        path = path || this.getToDayPath();
        var content = "".concat([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/'), " ").concat([date.getHours(), date.getMinutes(), date.getSeconds()].join(':'), " \n").concat(other, "\n").concat(error.stack, "\n\n");
        (0, fs_1.writeFile)(path, content, { flag: 'a' }, function () { });
    };
    /** 返回日志路径 */
    ServiceLog.getToDayPath = function () {
        var date = new Date();
        return "".concat(this.savePath, "/").concat([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'), ".txt");
    };
    // 日志保存的路径
    ServiceLog.savePath = savePath;
    return ServiceLog;
}());
exports["default"] = ServiceLog;
