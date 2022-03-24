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
exports.__esModule = true;
exports.ServiceRoom = void 0;
var exceptions_1 = require("../exceptions");
var ROOM_OPEN_1 = require("../menu/ROOM_OPEN");
var ROOM_FROM_1 = require("../menu/ROOM_FROM");
var ModelRoom_1 = require("../models/ModelRoom");
var utils_1 = require("../utils/utils");
var index_1 = require("../zerg/index");
var ServiceRoom = /** @class */ (function () {
    function ServiceRoom() {
    }
    /**
     * @param start {number} 从第几条开始
     * @param count   {number} 获取多少条
     * @returns 不为空返回数组，空返回null
     * ```
     *  const rooms = ModelRoom.select({open: '1'}, 10) // 从下标为0开始获取10条
     *  const rooms2 = ModelRoom.select({open: '1'}, 10, 10) // 从下标为10开始获取10条
     * ```
     */
    ServiceRoom.getList = function (start, count) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ModelRoom_1.ModelRoom.select({
                            open: ROOM_OPEN_1.ROOM_OPEN.PUBLIC
                        }, start, count)];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list];
                }
            });
        });
    };
    /**
     * 创建房间
     * @param data
     * @returns InterfaceRoom.detail
     */
    ServiceRoom.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var roomID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.create_date = (0, utils_1.date)('y-m-d h:i:s');
                        return [4 /*yield*/, ModelRoom_1.ModelRoom.create(data)];
                    case 1:
                        roomID = _a.sent();
                        return [2 /*return*/, Object.assign({ id: roomID }, data)];
                }
            });
        });
    };
    /**
     * 获取房间详情
     * @param room_id {number} 房间id
     * @param current_uid  {number} 当前用户id
     * @returns
     */
    ServiceRoom.get = function (room_id, current_uid) {
        return __awaiter(this, void 0, void 0, function () {
            var room, title, des, create_date, open, id, master_id, _from, is_master, from_data, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ModelRoom_1.ModelRoom.get(room_id)];
                    case 1:
                        room = _a.sent();
                        if (room === null) {
                            throw new exceptions_1.ExceptionRoom.NotDetail();
                        }
                        title = room.title, des = room.des, create_date = room.create_date, open = room.open, id = room.id, master_id = room.master_id;
                        _from = ~~room.from;
                        is_master = master_id === current_uid;
                        if (!(_from === ROOM_FROM_1.ROOM_FROM.ONLINE)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, index_1.getZergDetail)(_from, room.from_id)];
                    case 2:
                        from_data = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, (0, index_1.getZergDetail)(_from, room.from_id)];
                    case 4:
                        from_data = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (from_data === null) {
                            throw new exceptions_1.ExceptionRoom.NotDetail('数据异常');
                        }
                        data = {
                            id: id,
                            master_id: master_id,
                            is_master: is_master,
                            from: _from,
                            title: title,
                            des: des,
                            open: open,
                            create_date: create_date,
                            from_data: from_data
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 播放链接
     * @param form
     * @param targetUrl
     * @returns
     */
    ServiceRoom.getPlayUrl = function (from, targetUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var playUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_1.getZergPlayUrl)(from, targetUrl)];
                    case 1:
                        playUrl = _a.sent();
                        if (playUrl === null) {
                            throw new exceptions_1.ExceptionRoom.MissPlayLink();
                        }
                        return [2 /*return*/, playUrl];
                }
            });
        });
    };
    /**
     * 关闭房间
     */
    ServiceRoom.deleteByID = function (room_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ModelRoom_1.ModelRoom["delete"](room_id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ServiceRoom;
}());
exports.ServiceRoom = ServiceRoom;
