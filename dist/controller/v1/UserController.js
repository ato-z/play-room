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
exports.UserController = void 0;
var awilix_koa_1 = require("awilix-koa");
var utils_1 = require("../../utils/utils");
var USER_LEVEL_1 = require("../../menu/USER_LEVEL");
var ServiceUser_1 = require("../../services/ServiceUser");
var ServiceToken_1 = require("../../services/ServiceToken");
var exceptions_1 = require("../../exceptions");
/**
 * 用户相关的模块
 */
var UserController = /** @class */ (function () {
    function UserController() {
    }
    /**
    * @api {GET} /v1/user/temporary 注册临时用户
    * @apiName 注册临时用户
    * @apiGroup User
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    *
    * @apiSuccessExample {type} Success-Response:
    * {
    *      msg: 'ok',
    *      data: {sign: '用来换取token的sign密钥，过期时间很长。用户修改了密码会失效'},
    *      errorCode: 0
    * }
    */
    UserController.prototype.autoRegister = function () {
        return __awaiter(this, void 0, void 0, function () {
            var password, userData, udata, sign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = ServiceUser_1.ServiceUser.codePassword("".concat(Date.now()).concat(Math.random()));
                        userData = {
                            nickname: (0, utils_1.randomName)(),
                            level: USER_LEVEL_1.USER_LEVEL.TEMPRORAAY,
                            create_date: (0, utils_1.date)('y-m-d h:i:s'),
                            password: password
                        };
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.createUser(userData)];
                    case 1:
                        udata = _a.sent();
                        sign = ServiceUser_1.ServiceUser.codeLoginSign(udata);
                        return [2 /*return*/, { sign: sign }];
                }
            });
        });
    };
    /**
    * @api {GET} /v1/user/detail 获取用户信息
    * @apiName 获取用户信息
    * @apiGroup User
    * @apiVersion 1.0.0
    *
    * @apiSuccess  {Number} code 成功时返回 200
    * @apiHeaderExample {json} Header-Example:
    * {
    *   "content-type": "application/json",
    *   "token": "通过sign码可换取"
    * }
    * @apiSuccessExample {type} Success-Response:
    * {
    *      msg: 'ok',
    *      data: {
    *           "id": 1,
    *           "nickname": "用户昵称",
    *           "level": -1,
    *           "create_date": "2022-03-23T03:57:27.000Z"
    *      },
    *      errorCode: 0
    * }
    */
    UserController.prototype.detail = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var token, userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.get(token.id)];
                    case 1:
                        userData = _a.sent();
                        delete userData.password;
                        delete userData.delele_date;
                        return [2 /*return*/, userData];
                }
            });
        });
    };
    /**
    * @api {POST} /v1/user/upname 更新用户昵称
    * @apiName 更新用户昵称
    * @apiGroup User
    * @apiVersion 1.0.0
    *
    * @apiBody {String} nickname   用户昵称
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
    *      data: {nickname: '更新的用户名'},
    *      errorCode: 0
    * }
    */
    UserController.prototype.upname = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var body, nickname, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ctx.bodyJSON;
                        if (!(body === null || body === void 0 ? void 0 : body.nickname)) {
                            throw new exceptions_1.ParamExceotion('nickname不能为空');
                        }
                        nickname = body.nickname;
                        if (/^(.{1,8})$/.test(nickname) === false) {
                            throw new exceptions_1.ParamExceotion(' nickname字数必须大于0且小于9');
                        }
                        token = ServiceToken_1.ServiceToken.get(ctx.header.token);
                        return [4 /*yield*/, ServiceUser_1.ServiceUser.upData(token.id, { nickname: nickname })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { nickname: nickname }];
                }
            });
        });
    };
    __decorate([
        (0, awilix_koa_1.route)('/temporary'),
        (0, awilix_koa_1.GET)()
    ], UserController.prototype, "autoRegister");
    __decorate([
        (0, awilix_koa_1.route)('/detail'),
        (0, awilix_koa_1.GET)()
    ], UserController.prototype, "detail");
    __decorate([
        (0, awilix_koa_1.route)('/upname'),
        (0, awilix_koa_1.POST)()
    ], UserController.prototype, "upname");
    UserController = __decorate([
        (0, awilix_koa_1.route)('/v1/user')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
