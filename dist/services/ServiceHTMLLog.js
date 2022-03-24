"use strict";
exports.__esModule = true;
exports.ServiceHTMLLog = void 0;
var utils_1 = require("../utils/utils");
var fs_1 = require("fs");
var ServiceHTMLLog = /** @class */ (function () {
    function ServiceHTMLLog(path) {
        this.savePath = "".concat(__dirname, "/../../runtime/zerg/acg");
        this.savePath += path;
        (0, utils_1.touchPath)(this.savePath);
    }
    ServiceHTMLLog.prototype.write = function (error, html, url) {
        var content = " ".concat(html, "\n        ").concat(error.stack, "\n        ");
        var path = this.savePath + '/' + Date.now() + '_' + encodeURIComponent(url) + '.html';
        (0, fs_1.writeFile)(path, content, { flag: 'w' }, function () { });
    };
    return ServiceHTMLLog;
}());
exports.ServiceHTMLLog = ServiceHTMLLog;
