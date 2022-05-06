"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ZergMaliMali = void 0;
var BaseZerg_1 = require("./BaseZerg");
var puppeteer_1 = __importDefault(require("puppeteer"));
var ServiceHTMLLog_1 = require("../services/ServiceHTMLLog");
var exceptions_1 = require("../exceptions");
// 爬虫html副本保存类
var zergHTMLLog = new ServiceHTMLLog_1.ServiceHTMLLog('zerg/www_malimali3_com');
// 从html副本中匹配src
var decodeSrcByHtml = function (html) {
    var reg = /(?<=<td id="playleft".+?<iframe.+?src=")(.+?)(?=")/;
    var match = html.match(reg);
    if (match === null) {
        return '';
    }
    return match[0];
};
/**
 * 解析malimali站点的详情与视频地址
 * 主站：https://www.malimali3.com/
 * 备站：https://www.malimali4.com
 */
var ZergMaliMali = /** @class */ (function (_super) {
    __extends(ZergMaliMali, _super);
    function ZergMaliMali() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.domain = 'https://www.malimali3.com';
        return _this;
    }
    ZergMaliMali.prototype.getDetailById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, browser, page, detail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.domain, "/voddetail/").concat(id, ".html");
                        return [4 /*yield*/, puppeteer_1["default"].launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(url)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c;
                                var list = [];
                                document.querySelectorAll('.playlist ul').forEach(function (ul, index) {
                                    if (ul.children.length === 0) {
                                        return;
                                    }
                                    var item = {
                                        title: '线路' + (++index),
                                        li: []
                                    };
                                    for (var i = 0, len = ul.children.length; i < len; i++) {
                                        var li = ul.children[i];
                                        var a = li.querySelector('a');
                                        item.li.push({
                                            href: a.href,
                                            title: a.innerText
                                        });
                                    }
                                    list.push(item);
                                });
                                var detail = {
                                    poster: (_a = document.querySelector('.thumb img')) === null || _a === void 0 ? void 0 : _a.src,
                                    title: ((_b = document.querySelector('.drama-tit h3')) === null || _b === void 0 ? void 0 : _b.innerText) || '',
                                    des: (_c = document.querySelectorAll('.drama-data .intro')[1]) === null || _c === void 0 ? void 0 : _c.innerText,
                                    list: list
                                };
                                if (!detail.title) {
                                    return;
                                }
                                return detail;
                            })];
                    case 4:
                        detail = _a.sent();
                        if (detail !== undefined) {
                            detail.poster = '/v1/media/img?target=' + encodeURIComponent(detail.poster);
                            return [2 /*return*/, detail];
                        }
                        throw new exceptions_1.ExceptionZerg.NotDetail();
                }
            });
        });
    };
    ZergMaliMali.prototype.getPlayLinkByUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var browser, page, errorHtml, pageView1, src, objLi, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, puppeteer_1["default"].launch({
                            args: ['--no-sandbox', '--disable-setuid-sandbox'],
                            ignoreHTTPSErrors: true,
                            //headless: false,
                            ignoreDefaultArgs: ['--mute-image'],
                            timeout: 0
                        })
                        // 这个网站非常非常卡！必须用移动端的方式访问
                    ];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        return [4 /*yield*/, page.setUserAgent(this.userAgeent)];
                    case 3:
                        _a.sent();
                        errorHtml = '';
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, (0, BaseZerg_1.getPlayIframeSrc)(page, url, '#playleft iframe')];
                    case 5:
                        pageView1 = _a.sent();
                        errorHtml = pageView1.html;
                        src = pageView1.src || decodeSrcByHtml(pageView1.html);
                        return [4 /*yield*/, browser.close()];
                    case 6:
                        _a.sent();
                        if (src === '') {
                            throw new exceptions_1.ExceptionZerg.MissPlayLink();
                        }
                        objLi = src.split(/[\?|\&]/).map(function (item) { return item.split('=')[1]; });
                        return [2 /*return*/, objLi[1]];
                    case 7:
                        e_1 = _a.sent();
                        zergHTMLLog.write(e_1, errorHtml, url);
                        throw new exceptions_1.ExceptionZerg.MissPlayLink();
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return ZergMaliMali;
}(BaseZerg_1.BaseZerg));
exports.ZergMaliMali = ZergMaliMali;
