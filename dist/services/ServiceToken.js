"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ServiceToken = void 0;
var sha_js_1 = __importDefault(require("sha.js"));
var config_1 = __importDefault(require("../config"));
var exceptions_1 = require("../exceptions");
var ModelUser_1 = require("../models/ModelUser");
var loginMap = new Map();
var modelUser = new ModelUser_1.ModelUser('user');
var ServiceToken = /** @class */ (function () {
    function ServiceToken() {
    }
    /**
     * 获取token详情
     * @param token {string} token键
     * @returns
     */
    ServiceToken.get = function (token) {
        this.hasIn(token);
        return loginMap.get(token);
    };
    /**
     * 校验token是否有效
     * @param token {string} token键
     * @returns 不存在抛出异常
     */
    ServiceToken.hasIn = function (token) {
        if (loginMap.has(token) === false) {
            throw new exceptions_1.ExceptionToken.Miss();
        }
        return true;
    };
    /**
     * 用户登录到token，返回token到密钥
     * @param udata {InterfaceUser.Detail} 用户信息
     * @returns 一串不等长的密钥
     * ```
     * const udata = await ModuleUser.find(1)
     * ServiceToken.login(udata) // tokenKey => 1as14as14aaeef11454646456462164
     * ```
     */
    ServiceToken.login = function (udata) {
        var id = udata.id, level = udata.level, nickname = udata.nickname;
        var tokenKey = this.codeTokenKey(udata);
        var current = Date.now();
        var tokenDatail = {
            id: id,
            level: level,
            nickname: nickname,
            exp_time: config_1["default"].expTime + current
        };
        loginMap.set(tokenKey, tokenDatail);
        return tokenKey;
    };
    /**
     * 根据用户特征来返回一段token密钥
     * @param udata {InterfaceUser.Detail} 用户信息
     * @returns 一串不等长的密钥
     * ```
     * const udata = await ModuleUser.find(1)
     * ServiceToken.codeTokenKey(udata) // tokenKey => 1as14as14aaeef11454646456462164
     * ```
     */
    ServiceToken.codeTokenKey = function (udata) {
        var currnt = Date.now();
        return new sha_js_1["default"].sha256()
            .update("".concat(currnt).concat(udata.id))
            .digest('hex');
    };
    return ServiceToken;
}());
exports.ServiceToken = ServiceToken;
