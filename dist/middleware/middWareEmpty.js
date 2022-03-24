"use strict";
exports.__esModule = true;
exports.middWareEmpty = void 0;
// 未查询到的路由返回404
var middWareEmpty = function (ctx) {
    ctx.state = 404;
    ctx.body = '{"msg": "404 NOT FOUND", errorCode: 0}';
};
exports.middWareEmpty = middWareEmpty;
