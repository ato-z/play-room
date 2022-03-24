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
exports.__esModule = true;
exports.MediaController = void 0;
var awilix_koa_1 = require("awilix-koa");
var exceptions_1 = require("../../exceptions");
var utils_1 = require("../../utils/utils");
var index_1 = require("../../zerg/index");
var ModelOnline_1 = require("../../models/ModelOnline");
var ROOM_FROM_1 = require("../../menu/ROOM_FROM");
var MediaController = /** @class */ (function () {
    function MediaController() {
    }
    /**
     * 验证视频的from是否在爬虫列表中
     * @param _from
     */
    MediaController.prototype.hasInVideoFrom = function (_from) {
        if (ROOM_FROM_1.ROOM_FROM[_from] === undefined) {
            throw new exceptions_1.ParamExceotion('暂不支持from=' + _from + '的数据');
        }
    };
    /**
    * @api {GET} /v1/media/video 获取视频素材
    * @apiName 获取视频素材
    * @apiGroup Media
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "content-type": "application/json",
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiParam (url参数) {String} from 数据来源。 1:https://www.agemys.com
    * @apiParam (url参数) {String} video_id 解析的视频id
    *
    * @apiSuccessExample {type} Success-Response:
    * {
    *   "data": {
    *       "poster":"https://tvax3.sinaimg.cn/large/008kBpBlgy1gv9d0btd7xj607409wmxn02.jpg",
    *       "title":"世界尽头的圣骑士",
    *       "des":"电视动画《世界尽头的圣骑士》改编自同名轻小说，于2021年4月宣布动画化。\n曾经灭亡的死者之街。\n那里有一个孩子和三个不死的人。\n被曾经作为英雄的不死者们养育的少年。\n继承技能继承知识，注入爱的少年成长。\n阐发了下去，不死者的过去，奥秘的谜。\n当知道那一切的时候，少年踏上了通往圣骑士的道路。\n一个温馨和带有伤感的一个故事。",
    *       "list":[
    *           {
    *               "title":"播放列表1",
    *               "li":[
    *                   {"href":"https://www.agemys.com/play/20210179?playid=1_1","title":"PV1"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=1_2","title":"PV2"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=1_3","title":"PV4"}
    *               ]
    *           },
    *           {
    *               "title":"播放列表2",
    *               "li":[
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_1","title":"第1集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_2","title":"第2集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_3","title":"第3集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_4","title":"第4集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_5","title":"第5集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_6","title":"第6集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_7","title":"第7集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_8","title":"第8集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_9","title":"第9集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_10","title":"第10集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_11","title":"第11集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=2_12","title":"第12集"}
    *               ]
    *           },
    *           {
    *               "title":"播放列表4",
    *               "li":[
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_1","title":"第1集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_2","title":"第2集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_3","title":"第3集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_4","title":"第4集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_5","title":"第5集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_6","title":"第6集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_7","title":"第7集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_8","title":"第8集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_9","title":"第9集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_10","title":"第10集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_11","title":"第11集"},
    *                   {"href":"https://www.agemys.com/play/20210179?playid=4_12","title":"第12集"}
    *               ]
    *           }
    *       ]
    *   },
    *   "msg":"ok",
    *   "errorCode":0
    * }
    */
    MediaController.prototype.getVideo = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _from, video_id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.request.query;
                        _from = parseInt(query.from);
                        video_id = parseInt(query.video_id);
                        this.hasInVideoFrom(_from);
                        if (!video_id) {
                            throw new exceptions_1.ParamExceotion('video_id不能为空');
                        }
                        return [4 /*yield*/, (0, index_1.getZergDetail)(_from, video_id)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
    * @api {POST} /v1/media/decode_play 解析视频播放链接
    * @apiName 解析视频播放链接
    * @apiGroup Media
    * @apiVersion 1.0.0
    *
    * @apiBody {String} form  数据来源。 1:https://www.agemys.com
    * @apiBody {String} target  需要解析的原视频播放地址
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "content-type": "application/json",
    *   "token": "通过sign码可换取"
    * }
    *
    * @apiSuccessExample {type} Success-Response:
    * {
    *      msg: 'ok',
    *      data: {link: 'https://www.iqiyi.com/v_1jx6rv5vcv4.html&vlt_l=0&vlt_r=0'},
    *      errorCode: 0
    * }
    */
    MediaController.prototype.decodePlayLink = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _from, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.bodyJSON;
                        _from = parseInt(query.from);
                        this.hasInVideoFrom(_from);
                        if (!query.target) {
                            throw new exceptions_1.ParamExceotion('target不能为空');
                        }
                        return [4 /*yield*/, (0, index_1.getZergPlayUrl)(_from, query.target)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    MediaController.prototype.add = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, list, li, create_date, modelOnlie, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = ctx.bodyJSON;
                        list = ((query === null || query === void 0 ? void 0 : query.list) || []);
                        if (list.length === 0) {
                            throw new exceptions_1.ParamExceotion('list不能为空');
                        }
                        li = list.join(',');
                        create_date = (0, utils_1.date)('y-m-d h:i:s');
                        modelOnlie = new ModelOnline_1.ModelOnline('online');
                        return [4 /*yield*/, modelOnlie.insert({ li: li, create_date: create_date })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, { id: res.insertId }];
                }
            });
        });
    };
    __decorate([
        (0, awilix_koa_1.route)('/video'),
        (0, awilix_koa_1.GET)()
    ], MediaController.prototype, "getVideo");
    __decorate([
        (0, awilix_koa_1.route)('/decode_play'),
        (0, awilix_koa_1.POST)()
    ], MediaController.prototype, "decodePlayLink");
    __decorate([
        (0, awilix_koa_1.route)('/add'),
        (0, awilix_koa_1.POST)()
    ], MediaController.prototype, "add");
    MediaController = __decorate([
        (0, awilix_koa_1.route)('/v1/media')
    ], MediaController);
    return MediaController;
}());
exports.MediaController = MediaController;
