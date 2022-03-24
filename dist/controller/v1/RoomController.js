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
    * @api {GET} /v1/room/list 公共的房间列表
    * @apiName 房间列表
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiParam (url参数) {String} start  开始的条目,不能小于0
    * @apiParam (url参数) {String} count  获取的条目,最多获取50条
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    * {
    *      msg: 'ok',
    *      data: {
    *           list: [
    *               {
    *                   id: 1,
    *                   title: '房间标题',
    *                   des: '房间描述',
    *                   from: 1, // 数据来源
    *                   from_id: 1, // 来源id
    *                   master_id: 1, // 创建者的用户id
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
     * @api {POST} /v1/room/new 创建房间
     * @apiName 创建房间
     * @apiGroup Room
     * @apiVersion 1.0.0
     * @apiSuccess  {Number} code 成功时返回 200
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "token": "通过sign码可换取"
     * }
     *
     * @apiBody {String} title    房间标题
     * @apiBody {String} des      房间描述
     * @apiBody {Number} from     数据源头, 1: www.agemys.com
     * @apiBody {Number} from_id  数据的源头ID
     * @apiBody {String} open     '1':公开  '2': 私密
     *
     * @apiSuccessExample {type} Success-Response:
     * {
     *       "data": {
     *           "id": 1,
     *           "master_id": 1,
     *           "title": "房间标题",
     *           "des": "描述",
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
                                throw new exceptions_1.ParamExceotion(key + '不能为空');
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
    * @api {GET} /v1/room/detail 房间详情
    * @apiName 房间详情
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiParam (url参数) {String} room_id 房间id
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "id": 1, // 房间id
    *        "title": "房间标题",
    *        "des": "房间描述",
    *        "master_id": 1, // 房主id
    *        "is_master": true, // 房主为true 反之为false
    *        "create_date": "2022-03-01T08:54:48.000Z",
    *        "from_data": {
    *            "poster": "https://sc04.alicdn.com/kf/H6e5638a3490a4c4797d7e1bee334cab6J.jpg",
    *            "title": "空罐少女",
    *            "des": "《空罐少女》是由日本作家蓝上陆所作，并由铃平裕绘画插图的轻小说作品。\n一个平凡不足为奇的高中生喝汽水时，手里的哈密瓜味的汽水罐奇迹般的变成一个少女！因此翔成为了少女的主人，为了给少女一个安身的场所，让哈密瓜到学校上学，而翔的青梅竹马奈染弥却对哈密瓜的存在感到不爽。另外「空罐」间的战斗「空罐选拔赛」紧接著展开！反观不想战斗的翔，哈密瓜可是战意十足！空前绝饮、烦恼净空的恋爱喜剧就此开封！！\n从一味丢弃逐渐走向回收再利用。随着不断的进化，对物品细心保管、真心爱待的时代终于来临了！\n这其中还包括了被丢弃空罐的悲伤记忆。如果罐中的果汁被喝光的话自己就是不必要的了。但是不想这样！就算果汁被喝完了也想要自己被一直的细心对待。那样的念想不知不觉间使空罐发生了少女化...",
    *            "list": [
    *                {
    *                    "title": "播放列表2",
    *                    "li": [
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_1",
    *                            "title": "第01话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_2",
    *                            "title": "第02话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_3",
    *                            "title": "第03话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_4",
    *                            "title": "第04话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_5",
    *                            "title": "第05话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_6",
    *                            "title": "第06话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_7",
    *                            "title": "第07话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_8",
    *                            "title": "第08话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_9",
    *                            "title": "第09话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_10",
    *                            "title": "第10话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_11",
    *                            "title": "第11话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_12",
    *                            "title": "第12话"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=2_13",
    *                            "title": "OVA01"
    *                        }
    *                    ]
    *                },
    *                {
    *                    "title": "播放列表3",
    *                    "li": [
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_1",
    *                            "title": "第1集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_2",
    *                            "title": "第2集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_3",
    *                            "title": "第3集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_4",
    *                            "title": "第4集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_5",
    *                            "title": "第5集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_6",
    *                            "title": "第6集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_7",
    *                            "title": "第7集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_8",
    *                            "title": "第8集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_9",
    *                            "title": "第9集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_10",
    *                            "title": "第10集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_11",
    *                            "title": "第11集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_12",
    *                            "title": "第12集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=3_13",
    *                            "title": "OVA01"
    *                        }
    *                    ]
    *                },
    *                {
    *                    "title": "播放列表4",
    *                    "li": [
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_1",
    *                            "title": "第1集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_2",
    *                            "title": "第2集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_3",
    *                            "title": "第3集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_4",
    *                            "title": "第4集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_5",
    *                            "title": "第5集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_6",
    *                            "title": "第6集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_7",
    *                            "title": "第7集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_8",
    *                            "title": "第8集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_9",
    *                            "title": "第9集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_10",
    *                            "title": "第10集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_11",
    *                            "title": "第11集"
    *                        },
    *                        {
    *                            "href": "https://www.agemys.com/play/20090021?playid=4_12",
    *                            "title": "第12集"
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
                            throw new exceptions_1.ParamExceotion('room_id不能为空');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        return [4 /*yield*/, ServicePlayRoom_1.ServicePlayRoom.of(room_id, uid)];
                    case 2:
                        playRoom = _a.sent();
                        userService.joinInRoom(playRoom); // 当用户调用房间详情时，证明在房间内。自动加入到该房
                        return [2 /*return*/, Object.assign({}, playRoom.room)];
                }
            });
        });
    };
    /**
    * @api {GET} /v1/room/statu 房间当前状态
    * @apiName 房间当前状态
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiParam (url参数) {String} room_id 房间id
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "liIndex": null, // null表示当前没有播放列表
    *        "itemIndex": null, // 播放列表的下标
    *        "playLink": null, // 当前房间在播放的视频链接
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
                            throw new exceptions_1.ParamExceotion('room_id不能为空');
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
    * @api {POST} /v1/room/join_wss 加入房间的WebSocket服务
    * @apiName 加入房间的WebSocket服务
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiBody {Number} port  接口号：在WebSocket成功链接可获取
    * @apiBody {Number} id    属于该端口的键：在WebSocket成功链接可获取
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "已加入放映厅/聊天室"
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
                            return [2 /*return*/, { msg: '已加入聊天室' }];
                        }
                        if (playRoom.playWs.port === query.port && playRoom.playWs.wsList[query.id]) {
                            userService.playWs = query.id;
                            return [2 /*return*/, { msg: '已加入放映厅' }];
                        }
                        throw new exceptions_1.ParamExceotion('加入wss服务失败～');
                }
            });
        });
    };
    /**
    * @api {POST} /v1/room/switch_play 切换播放视频
    * @apiName 切换播放视频
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiBody {Number} liIndex   房间播放列表的下标
    * @apiBody {Number} itemIndex 房间播放列表内的子项下标
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "正在切换"
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
                            throw new exceptions_1.ParamExceotion('liIndex不能为空');
                        }
                        if (query.itemIndex === undefined) {
                            throw new exceptions_1.ParamExceotion('itemIndex不能为空');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        playRoom = userService.playRoom;
                        if (!playRoom) {
                            throw new exceptions_1.ParamExceotion('您暂未加入放映厅');
                        }
                        if (playRoom.room.master_id !== uid) {
                            throw new exceptions_1.ParamExceotion('只有房主才切换播放');
                        }
                        return [4 /*yield*/, playRoom.setPlayIndex(query.liIndex, query.itemIndex)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { msg: '正在切换...' }];
                }
            });
        });
    };
    /**
    * @api {GET} /v1/room/close 关闭房间
    * @apiName 关闭房间
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "房间已被销毁"
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
                            throw new exceptions_1.ParamExceotion('您暂未加入放映厅');
                        }
                        if (playRoom.room.master_id !== uid) {
                            throw new exceptions_1.ParamExceotion('只有房主才可以清空房间');
                        }
                        playRoom.clear();
                        return [4 /*yield*/, ServiceRoom_1.ServiceRoom.deleteByID(playRoom.room.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { msg: '房间已被销毁' }];
                }
            });
        });
    };
    /**
    * @api {POST} /v1/room/say 用户发言
    * @apiName 用户发言
    * @apiGroup Room
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiBody {String} msg 发送的讯息
    *
    * @apiSuccessExample {type} Success-Response:
    *{
    *    "data": {
    *        "msg": "已加入放映厅/聊天室"
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
                            throw new exceptions_1.ParamExceotion('说点啥吧～');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        uid = token.id;
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.of(uid)];
                    case 1:
                        userService = _a.sent();
                        playRoom = userService.playRoom;
                        if (!playRoom) {
                            throw new exceptions_1.ParamExceotion('您暂未加入放映厅');
                        }
                        sendData = {
                            nickname: userService.udata.nickname,
                            is_master: playRoom.room.master_id === uid,
                            msg: msg
                        };
                        playRoom.chatWs.notify(sendData, WS_CODE_1.WS_CODE.USER_SAY);
                        return [2 /*return*/, { msg: '就你话多!' }];
                }
            });
        });
    };
    /**
     * 基于当前服务端返回wss服务根地址
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
