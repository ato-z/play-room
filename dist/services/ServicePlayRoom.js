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
exports.ServicePlayRoom = void 0;
var config_1 = __importDefault(require("../config"));
var exceptions_1 = require("../exceptions");
var WS_CODE_1 = require("../menu/WS_CODE");
var decodeVideoDuration_1 = require("../utils/decodeVideoDuration");
var ServiceLog_1 = __importDefault(require("./ServiceLog"));
var ServiceRoom_1 = require("./ServiceRoom");
var ServiceWs_1 = require("./ServiceWs");
var roomMap = new Map();
var ServicePlayRoom = /** @class */ (function () {
    function ServicePlayRoom(room, playWs, chatWs) {
        this.liIndex = null;
        this.itemIndex = null;
        this.playLink = null;
        this.users = new Set();
        this.room = room;
        this.playWs = playWs;
        this.chatWs = chatWs;
    }
    /**
     * 加入到房间
     */
    ServicePlayRoom.prototype.join = function (user) {
        this.users.add(user);
        var msg = "".concat(user.udata.nickname, " \u8FDB\u5165\u623F\u95F4");
        this.chatWs.notify({ msg: msg }, WS_CODE_1.WS_CODE.USER_JOIN);
    };
    /**
     * 退出房间
     */
    ServicePlayRoom.prototype.out = function (user) {
        this.users["delete"](user);
        var msg = "".concat(user.udata.nickname, " \u9000\u51FA\u623F\u95F4");
        this.chatWs.notify({ msg: msg }, WS_CODE_1.WS_CODE.USER_OUT);
    };
    /**
     * 清空销毁房间
     */
    ServicePlayRoom.prototype.clear = function () {
        clearTimeout(this.unifiedTimeIndex);
        this.users.forEach(function (user) {
            user.playRoom = null;
        });
        this.users = new Set();
        roomMap["delete"](this.room.id);
    };
    /**
     * 根据房间id和用户id来对应一个单例实例
     * @param roomID
     * @param masterID
     * @returns
     * ```
     * const roomID = 1
     * const masterID = 1
     * const playRoom1 = ServicePlayRoom.of(roomID, masterID)
     * const playRoom2 = ServicePlayRoom.of(roomID, masterID)
     * console.log(playRoom1 === playRoom2) // true
     * ```
     */
    ServicePlayRoom.of = function (roomID, masterID) {
        return __awaiter(this, void 0, void 0, function () {
            var playWs, chatWs, room, playRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (roomMap.has(roomID)) {
                            return [2 /*return*/, roomMap.get(roomID)];
                        }
                        playWs = new ServiceWs_1.ServiceWs();
                        chatWs = new ServiceWs_1.ServiceWs();
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.get(roomID, masterID)];
                    case 1:
                        room = _a.sent();
                        playRoom = new ServicePlayRoom(room, playWs, chatWs);
                        roomMap.set(room.id, playRoom);
                        return [2 /*return*/, playRoom];
                }
            });
        });
    };
    /**
     * 返回当前房间的 websocker
     * @param addrss {strinig} ws服务根地址
     * @returns url字符串
     * ```
     * const roomID = 1
     * const masterID = 1
     * const playRoom = ServicePlayRoom.of(roomID, masterID)
     * console.log(playRoom.getCurrent('ws://127.0.0.1')) // ws://127.0.0.1:3002
     * ```
     */
    ServicePlayRoom.prototype.getCurrent = function (addrss) {
        var _a, _b;
        var _c = this, liIndex = _c.liIndex, itemIndex = _c.itemIndex, playLink = _c.playLink;
        var playWs = addrss + ((_a = this === null || this === void 0 ? void 0 : this.playWs) === null || _a === void 0 ? void 0 : _a.port);
        var chatWs = addrss + ((_b = this === null || this === void 0 ? void 0 : this.chatWs) === null || _b === void 0 ? void 0 : _b.port);
        var currentDate = new Date().getTime();
        var startDate = this.playStart ? this.playStart.getTime() : 0;
        return { liIndex: liIndex, itemIndex: itemIndex, playLink: playLink, currentDate: currentDate, startDate: startDate, playWs: playWs, chatWs: chatWs };
    };
    /**
     * 设置当前房间的播放地址
     * @param liIndex {number} 当前房间列表的下标索引
     * @param itemIndex {number} 当前房间列表内的项目下标索引
     */
    ServicePlayRoom.prototype.setPlayIndex = function (liIndex, itemIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var room, item, encodeLink, playLink, playDuration, playStart, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room = this.room;
                        if (liIndex > room.from_data.list.length) {
                            throw new exceptions_1.ParamExceotion('list索引超出边界');
                        }
                        item = room.from_data.list[liIndex];
                        if (itemIndex > item.li.length) {
                            throw new exceptions_1.ParamExceotion('item索引超出边界');
                        }
                        // 给用户切换预告
                        try {
                            this.playWs.notify({
                                msg: '即将播放下一集...'
                            }, WS_CODE_1.WS_CODE.BEFORE_SWITCH_PLAY);
                            this.unifiedTime();
                        }
                        catch (e) { }
                        encodeLink = item.li[itemIndex].href;
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.getPlayUrl(~~room.from, encodeLink)];
                    case 1:
                        playLink = _a.sent();
                        return [4 /*yield*/, (0, decodeVideoDuration_1.decodeVideoDuration)(playLink)];
                    case 2:
                        playDuration = _a.sent();
                        playStart = new Date();
                        // 重置新的播放链接
                        this.playLink = playLink;
                        this.playStart = playStart;
                        this.playDuration = playDuration;
                        this.liIndex = liIndex;
                        this.itemIndex = itemIndex;
                        data = { liIndex: liIndex, itemIndex: itemIndex, playLink: playLink, playStart: playStart.getTime() };
                        // 立即广播，切换音频
                        this.playWs.notify(data, WS_CODE_1.WS_CODE.SWITCH_PLAY);
                        // 间隔广播当前进度
                        this.unifiedTime();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 广播当前的播放进度
     */
    ServicePlayRoom.prototype.unifiedTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currnet, diffTime;
            var _this = this;
            return __generator(this, function (_a) {
                clearTimeout(this.unifiedTimeIndex);
                currnet = new Date();
                diffTime = this.playDuration - (currnet.getTime() - this.playStart.getTime());
                if (diffTime < config_1["default"].playVideoSleep / 1500) {
                    return [2 /*return*/, setTimeout(function () { return _this.nextPlay(); }, diffTime + config_1["default"].playVideoSleep)];
                }
                this.unifiedTimeIndex = setTimeout(function () {
                    try {
                        _this.playWs.notify({
                            currnet: currnet.getTime(),
                            start: _this.playStart.getTime()
                        }, WS_CODE_1.WS_CODE.UNIFIED_PLAY);
                        _this.unifiedTime();
                    }
                    catch (e) { }
                }, config_1["default"].playVideoSleep);
                return [2 /*return*/];
            });
        });
    };
    /** 播放下一个 */
    ServicePlayRoom.prototype.nextPlay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var li, nextItem, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (this.liIndex === null || this.itemIndex === null) {
                            return [2 /*return*/];
                        }
                        li = this.room.from_data.list[this.liIndex].li;
                        nextItem = this.itemIndex + 1;
                        if (!(nextItem >= li.length)) return [3 /*break*/, 2];
                        this.playWs.notify({
                            msg: '播放已结束，房间即将销毁'
                        }, WS_CODE_1.WS_CODE.MSG);
                        this.clear();
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.deleteByID(this.room.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        this.playWs.notify({
                            msg: '即将播放下一个视频'
                        }, WS_CODE_1.WS_CODE.MSG);
                        return [4 /*yield*/, this.setPlayIndex(this.liIndex, nextItem)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        ServiceLog_1["default"].writeToDay(e_1, '静默切换视频执行异常');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ServicePlayRoom;
}());
exports.ServicePlayRoom = ServicePlayRoom;
