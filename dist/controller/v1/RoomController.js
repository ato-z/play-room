"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.RoomController = void 0;
var awilix_koa_1 = require("awilix-koa");
var config_1 = __importDefault(require("../../config"));
var exceptions_1 = require("../../exceptions");
var WS_CODE_1 = require("../../menu/WS_CODE");
var ModelOnline_1 = require("../../models/ModelOnline");
var ServicePlayRoom_1 = require("../../services/ServicePlayRoom");
var ServiceRoom_1 = require("../../services/ServiceRoom");
var ServiceToken_1 = require("../../services/ServiceToken");
var ServiceUser_1 = require("../../services/ServiceUser");
var RoomController = /** @class */ (function () {
    function RoomController() {
    }
    /**
    * @api {GET} /v1/room/list ?????????????????????
    * @apiName ????????????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiParam (url??????) {String} start  ???????????????,????????????0
    * @apiParam (url??????) {String} count  ???????????????,????????????50???
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    * {
    *      msg: 'ok',
    *      data: {
    *           list: [
    *               {
    *                   id: 1,
    *                   title: '????????????',
    *                   des: '????????????',
    *                   from: 1, // ????????????
    *                   from_id: 1, // ??????id
    *                   master_id: 1, // ??????????????????id
    *                   create_date: '2022/03/01'
    *               },
    *               ...
    *           ]
    *      },
    *      errorCode: 0
    * }
    */
    RoomController.prototype.list = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, start, count, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.request.query;
                        start = Math.max(0, parseInt(query.start || '0'));
                        count = Math.min(50, parseInt(query.count || '10'));
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.getList(start, count)];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, { list: list }];
                }
            });
        });
    };
    /**
     * @api {POST} /v1/room/new ????????????
     * @apiName ????????????
     * @apiGroup Room
     * @apiVersion 1.0.0
     * @apiSuccess  {Number} code ??????????????? 200
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "token": "??????sign????????????"
     * }
     *
     * @apiBody {String} title    ????????????
     * @apiBody {String} des      ????????????
     * @apiBody {Number} from     ????????????, 1: www.agemys.com
     * @apiBody {Number} from_id  ???????????????ID
     * @apiBody {String} open     '1':??????  '2': ??????
     *
     * @apiSuccessExample {type} Success-Response:
     * {
     *       "data": {
     *           "id": 1,
     *           "master_id": 1,
     *           "title": "????????????",
     *           "des": "??????",
     *           "from": 1,
     *           "from_id": 20090021,
     *           "open": "1",
     *           "create_date": "2022-03-01 17:15:19"
     *       },
     *       "msg": "ok",
     *       "errorCode": 0
     *   }
    */
    RoomController.prototype.create = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, keys, modelOnlie, token, data, newRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.bodyJSON || {};
                        keys = ['title', 'des', 'from', 'from_id', 'open'];
                        keys.forEach(function (key) {
                            if (query[key] === undefined) {
                                throw new exceptions_1.ParamExceotion(key + '????????????');
                            }
                        });
                        if (!(query.from === 0)) return [3 /*break*/, 2];
                        modelOnlie = new ModelOnline_1.ModelOnline('online');
                        return [4 /*yield*/, modelOnlie.get(query.from_id)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        data = Object.assign({
                            master_id: token.id
                        }, query);
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.create(data)];
                    case 3:
                        newRoom = _a.sent();
                        return [2 /*return*/, newRoom];
                }
            });
        });
    };
    /**
    * @api {GET} /v1/room/detail ????????????
    * @apiName ????????????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiParam (url??????) {String} room_id ??????id
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "id": 1, // ??????id
    *        "title": "????????????",
    *        "des": "????????????",
    *        "master_id": 1, // ??????id
    *        "is_master": true, // ?????????true ?????????false
    *        "create_date": "2022-03-01T08:54:48.000Z",
    *        "from_data": {
    *            "poster": "https://sc04.alicdn.com/kf/H6e5638a3490a4c4797d7e1bee334cab6J.jpg",
    *            "title": "????????????",
    *            "des": "??????????????????????????????????????????????????????????????????????????????????????????????????????\n?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\n????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????\n????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????...",
    *            "list": [
    *                {
    *                    "title": "????????????2",
    *                    "li": [
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_1",
    *                            "title": "???01???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_2",
    *                            "title": "???02???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_3",
    *                            "title": "???03???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_4",
    *                            "title": "???04???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_5",
    *                            "title": "???05???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_6",
    *                            "title": "???06???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_7",
    *                            "title": "???07???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_8",
    *                            "title": "???08???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_9",
    *                            "title": "???09???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_10",
    *                            "title": "???10???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_11",
    *                            "title": "???11???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_12",
    *                            "title": "???12???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_13",
    *                            "title": "OVA01"
    *                        }
    *                    ]
    *                },
    *                {
    *                    "title": "????????????3",
    *                    "li": [
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_1",
    *                            "title": "???1???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_2",
    *                            "title": "???2???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_3",
    *                            "title": "???3???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_4",
    *                            "title": "???4???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_5",
    *                            "title": "???5???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_6",
    *                            "title": "???6???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_7",
    *                            "title": "???7???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_8",
    *                            "title": "???8???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_9",
    *                            "title": "???9???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_10",
    *                            "title": "???10???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_11",
    *                            "title": "???11???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_12",
    *                            "title": "???12???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_13",
    *                            "title": "OVA01"
    *                        }
    *                    ]
    *                },
    *                {
    *                    "title": "????????????4",
    *                    "li": [
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_1",
    *                            "title": "???1???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_2",
    *                            "title": "???2???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_3",
    *                            "title": "???3???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_4",
    *                            "title": "???4???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_5",
    *                            "title": "???5???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_6",
    *                            "title": "???6???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_7",
    *                            "title": "???7???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_8",
    *                            "title": "???8???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_9",
    *                            "title": "???9???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_10",
    *                            "title": "???10???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_11",
    *                            "title": "???11???"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_12",
    *                            "title": "???12???"
    *                        }
    *                    ]
    *                }
    *            ]
    *        },
    *        "open": "1"
    *    },
    *    "msg": "ok",
    *    "errorCode": 0
    *}
    */
    RoomController.prototype.detail = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var room_id, token, uid, userService, playRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room_id = parseInt(ctx.request.query.room_id);
                        if (!room_id) {
                            throw new exceptions_1.ParamExceotion('room_id????????????');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        return [4 /*yield*/, ServicePlayRoom_1.ServicePlayRoom.of(room_id, uid)];
                    case 2:
                        playRoom = _a.sent();
                        userService.joinInRoom(playRoom); // ???????????????????????????????????????????????????????????????????????????
                        return [2 /*return*/, Object.assign({}, playRoom.room)];
                }
            });
        });
    };
    /**
    * @api {GET} /v1/room/statu ??????????????????
    * @apiName ??????????????????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiParam (url??????) {String} room_id ??????id
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "liIndex": null, // null??????????????????????????????
    *        "itemIndex": null, // ?????????????????????
    *        "playLink": null, // ????????????????????????????????????
    *        "playWs": "wx://127.0.0.1:3002",
    *        "chatWs": "wx://127.0.0.1:3003",
    *   },
    *   "msg": "ok",
    *   "errorCode": 0
    * }
    * */
    RoomController.prototype.statu = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var room_id, token, playRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room_id = parseInt(ctx.request.query.room_id);
                        if (!room_id) {
                            throw new exceptions_1.ParamExceotion('room_id????????????');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        return [4 /*yield*/, ServicePlayRoom_1.ServicePlayRoom.of(room_id, token.id)];
                    case 1:
                        playRoom = _a.sent();
                        return [2 /*return*/, playRoom.getCurrent(this.codeWsURL(ctx))];
                }
            });
        });
    };
    /**
    * @api {POST} /v1/room/join_wss ???????????????WebSocket??????
    * @apiName ???????????????WebSocket??????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiBody {Number} port  ???????????????WebSocket?????????????????????
    * @apiBody {Number} id    ???????????????????????????WebSocket?????????????????????
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "??????????????????/?????????"
    *   },
    *   "msg": "ok",
    *   "errorCode": 0
    * }
    * */
    RoomController.prototype.joinWs = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, token, uid, userService, playRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.bodyJSON;
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        playRoom = userService.playRoom;
                        if (!playRoom) {
                            throw new exceptions_1.ExceptionRoom.NotJoinPlayRoom();
                        }
                        if (!playRoom.chatWs || !playRoom.playWs) {
                            throw new exceptions_1.ExceptionRoom.WaitJoin();
                        }
                        if (playRoom.chatWs.port === query.port && playRoom.chatWs.wsList[query.id]) {
                            userService.charWs = query.id;
                            return [2 /*return*/, { msg: '??????????????????' }];
                        }
                        if (playRoom.playWs.port === query.port && playRoom.playWs.wsList[query.id]) {
                            userService.playWs = query.id;
                            return [2 /*return*/, { msg: '??????????????????' }];
                        }
                        throw new exceptions_1.ParamExceotion('??????wss???????????????');
                }
            });
        });
    };
    /**
    * @api {POST} /v1/room/switch_play ??????????????????
    * @apiName ??????????????????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiBody {Number} liIndex   ???????????????????????????
    * @apiBody {Number} itemIndex ????????????????????????????????????
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "????????????"
    *   },
    *   "msg": "ok",
    *   "errorCode": 0
    * }
    * */
    RoomController.prototype.switchPlay = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, token, uid, userService, playRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.bodyJSON || {};
                        if (query.liIndex === undefined) {
                            throw new exceptions_1.ParamExceotion('liIndex????????????');
                        }
                        if (query.itemIndex === undefined) {
                            throw new exceptions_1.ParamExceotion('itemIndex????????????');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        playRoom = userService.playRoom;
                        if (!playRoom) {
                            throw new exceptions_1.ParamExceotion('????????????????????????');
                        }
                        if (playRoom.room.master_id !== uid) {
                            throw new exceptions_1.ParamExceotion('???????????????????????????');
                        }
                        return [4 /*yield*/, playRoom.setPlayIndex(query.liIndex, query.itemIndex)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { msg: '????????????...' }];
                }
            });
        });
    };
    /**
    * @api {GET} /v1/room/close ????????????
    * @apiName ????????????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "??????????????????"
    *   },
    *   "msg": "ok",
    *   "errorCode": 0
    * }
    * */
    RoomController.prototype.closeRoom = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var token, uid, userService, playRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        playRoom = userService.playRoom;
                        if (!playRoom) {
                            throw new exceptions_1.ParamExceotion('????????????????????????');
                        }
                        if (playRoom.room.master_id !== uid) {
                            throw new exceptions_1.ParamExceotion('?????????????????????????????????');
                        }
                        playRoom.clear();
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.deleteByID(playRoom.room.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { msg: '??????????????????' }];
                }
            });
        });
    };
    /**
    * @api {POST} /v1/room/say ????????????
    * @apiName ????????????
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code ??????????????? 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "??????sign????????????"
    * }
    *
    * @apiBody {String} msg ???????????????
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "??????????????????/?????????"
    *   },
    *   "msg": "ok",
    *   "errorCode": 0
    * }
    * */
    RoomController.prototype.say = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, msg, token, uid, userService, playRoom, sendData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.bodyJSON || {};
                        msg = (query.msg || '').replace(/^\s+|\s+$/g, '');
                        if (msg === '') {
                            throw new exceptions_1.ParamExceotion('???????????????');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        playRoom = userService.playRoom;
                        if (!playRoom) {
                            throw new exceptions_1.ParamExceotion('????????????????????????');
                        }
                        sendData = {
                            nickname: userService.udata.nickname,
                            is_master: playRoom.room.master_id === uid,
                            msg: msg
                        };
                        playRoom.chatWs.notify(sendData, WS_CODE_1.WS_CODE.USER_SAY);
                        return [2 /*return*/, { msg: '????????????!' }];
                }
            });
        });
    };
    /**
     * ???????????????????????????wss???????????????
     * @param ctx
     * @returns
     */
    RoomController.prototype.codeWsURL = function (ctx) {
        var domain = (ctx.header.host || '').match(/^(.+)(\:\d+)$/);
        if (domain !== null) {
            return "ws://".concat(domain[1], ":");
        }
        return "ws://".concat(config_1["default"].runIp, ":");
    };
    __decorate([
        (0, awilix_koa_1.route)('/list'),
        (0, awilix_koa_1.GET)()
    ], RoomController.prototype, "list");
    __decorate([
        (0, awilix_koa_1.route)('/new'),
        (0, awilix_koa_1.POST)()
    ], RoomController.prototype, "create");
    __decorate([
        (0, awilix_koa_1.route)('/detail'),
        (0, awilix_koa_1.GET)()
    ], RoomController.prototype, "detail");
    __decorate([
        (0, awilix_koa_1.route)('/statu'),
        (0, awilix_koa_1.GET)()
    ], RoomController.prototype, "statu");
    __decorate([
        (0, awilix_koa_1.route)('/join_wss'),
        (0, awilix_koa_1.POST)()
    ], RoomController.prototype, "joinWs");
    __decorate([
        (0, awilix_koa_1.route)('/switch_play'),
        (0, awilix_koa_1.POST)()
    ], RoomController.prototype, "switchPlay");
    __decorate([
        (0, awilix_koa_1.route)('/close'),
        (0, awilix_koa_1.GET)()
    ], RoomController.prototype, "closeRoom");
    __decorate([
        (0, awilix_koa_1.route)('/say'),
        (0, awilix_koa_1.POST)()
    ], RoomController.prototype, "say");
    RoomController = __decorate([
        (0, awilix_koa_1.route)('/v1/room')
    ], RoomController);
    return RoomController;
}());
exports.RoomController = RoomController;
