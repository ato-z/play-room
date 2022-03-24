"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ServiceUser = void 0;
var sha_js_1 = __importDefault(require("sha.js"));
var ModelUser_1 = require("../models/ModelUser");
var config_1 = __importDefault(require("../config"));
var exceptions_1 = require("../exceptions");
var userMap = new Map();
var modelUser = new ModelUser_1.ModelUser('user');
var ServiceUser = /** @class */ (function () {
    function ServiceUser(uid) {
        this.playRoom = null;
        this.playWs = null;
        this.charWs = null;
        this.uid = uid;
    }
    /**
     * 加入房间
     */
    ServiceUser.prototype.joinInRoom = function (playRoom) {
        var prevPlayRoom = this.playRoom;
        if (prevPlayRoom && prevPlayRoom !== playRoom) { // 如果存在上一个房间则退出
            prevPlayRoom.out(this);
        }
        this.playRoom = playRoom;
        playRoom.join(this);
    };
    /**
     * 初始化方法
     */
    ServiceUser.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var udata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, modelUser.get(this.uid)];
                    case 1:
                        udata = _a.sent();
                        this.udata = udata;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 创建一个用户实例
     * @param uid
     * @returns
     */
    ServiceUser.of = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (userMap.has(uid)) {
                            return [2 /*return*/, userMap.get(uid)];
                        }
                        user = new this(uid);
                        userMap.set(uid, user);
                        return [4 /*yield*/, user.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    /**
     * 获取用户信息
     * @param uid {number} 用户id
     * @returns 用户信息
     * ```
     * const udata = ServiceUser.get(1) // 获取用户id为1的数据
     * ```
     */
    ServiceUser.get = function (uid) {
        return this.userModel.get(uid);
    };
    /**
     * 更新用户信息
     * @param uid  {number} 用户id
     * @param updata {object} 更新的字段对象
     * @returns 更新的条目
     * ```
     * ServiceUser.upData(1, {nickname: '修改昵称'})
     * ```
     */
    ServiceUser.upData = function (uid, updata) {
        return this.userModel.update(updata, { and: { id: uid } });
    };
    /**
     * 对普通的字符串进行hash加密
     * @param pass {string} 需要加密的普通字符串
     * @returns 加密后的64位hex字符
     * ```
     * ServiceUser.codePassword('123456') // 000c5e2e844afd8f13eb5ff595a7d613e272ec93d3996f1a3c43448b89ab1849
     * ```
     */
    ServiceUser.codePassword = function (pass) {
        return new sha_js_1["default"].sha256()
            .update("".concat(config_1["default"].hash).concat(pass))
            .digest('hex');
    };
    /**
     * 添加用户并返回其新增的id
     * @param udata
     * @returns 用户的新增id
     */
    ServiceUser.createUser = function (udata) {
        return __awaiter(this, void 0, void 0, function () {
            var resultHeader, id, _udata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.insert(udata)];
                    case 1:
                        resultHeader = _a.sent();
                        id = resultHeader.insertId;
                        _udata = Object.assign({ id: id }, udata);
                        return [2 /*return*/, _udata];
                }
            });
        });
    };
    /**
     * 用户登录密钥
     */
    ServiceUser.codeLoginSign = function (udata) {
        var hash = config_1["default"].hash;
        var id = udata.id;
        var pass = udata.password.replace(/g/ig, '');
        var keyIndex = hash.charCodeAt(id % hash.length);
        var hashVal = this.charCodeVal(hash);
        var sign = [pass, Date.now().toString(16), (hashVal + id * keyIndex).toString(16), keyIndex.toString(16)].join('g');
        return sign;
    };
    /**
     * 解密登录密钥
     */
    ServiceUser.decodeLoginSign = function (sign) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, codeSign, pass, create_time, codeId, keyIndex, _create_time, _codeId, _keyIndex, hashVal, uid, udata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = config_1["default"].hash;
                        codeSign = sign.split('g');
                        if (codeSign.length !== 4) {
                            throw new exceptions_1.ExceptionUser.MissSign('无效的sign码');
                        }
                        pass = codeSign[0], create_time = codeSign[1], codeId = codeSign[2], keyIndex = codeSign[3];
                        _create_time = parseInt('0x' + create_time);
                        if (config_1["default"].signTime !== 0 && _create_time + config_1["default"].signTime > Date.now()) {
                            throw new exceptions_1.ExceptionUser.MissSign('登录已失效');
                        }
                        _codeId = parseInt('0x' + codeId);
                        _keyIndex = parseInt('0x' + keyIndex);
                        hashVal = ServiceUser.charCodeVal(hash);
                        uid = (_codeId - hashVal) / _keyIndex;
                        return [4 /*yield*/, this.userModel.get(uid)];
                    case 1:
                        udata = _a.sent();
                        if (udata.password !== pass) {
                            throw new exceptions_1.ExceptionUser.MissSign('密码已被更改');
                        }
                        return [2 /*return*/, udata];
                }
            });
        });
    };
    /**
     * 对每个字符的ASCII码相加并返回
     * @param str {string} 字符串
     * @returns str字符串每个字符串的ASCII码相加后的结果
     * ```
     * ServiceUser.charCodeVal('ab')// a + b => 97 + 98 => 195
     * ```
     */
    ServiceUser.charCodeVal = function (str) {
        return str.split('').map(function (str) {
            return str.charCodeAt(0);
        }).reduce(function (prev, curr) { return prev + curr; });
    };
    ServiceUser.userModel = modelUser;
    return ServiceUser;
}());
exports.ServiceUser = ServiceUser;
