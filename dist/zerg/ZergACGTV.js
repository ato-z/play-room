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
exports.ZergACGTV = void 0;
var puppeteer_1 = __importDefault(require("puppeteer"));
var exceptions_1 = require("../exceptions");
var ServiceHTMLLog_1 = require("../services/ServiceHTMLLog");
var BaseZerg_1 = require("./BaseZerg");
// 爬虫html副本保存类
var zergHTMLLog = new ServiceHTMLLog_1.ServiceHTMLLog('zerg/www_agemys_com');
/** 源网站的解密方法 */
var parse_query_string = function (query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
        }
        else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
        }
        else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string.url;
};
/**
 * 解析age.tv站点的详情与视频地址
 * 主站：https://www.agemys.com/
 * 备站：https://www.age.tv/
 */
var ZergACGTV = /** @class */ (function (_super) {
    __extends(ZergACGTV, _super);
    function ZergACGTV() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @params {string} 域名地址
         */
        _this.domain = 'https://www.agemys.com/';
        return _this;
    }
    /**
     * 通过ID获取番剧的详情
     * @param id {number|string} 站点获取的番剧id
     * @returns Promise<detail> | never
     * ```
     *     // 错误解析
     *     const detail1 = await ACGTV.getDetailById('不存在的番剧id') // 抛出异常 => throw new ExceptionACG.NotDetail()
     *     // 正常解析返回
     *     const detail2 = await ACGTV.getDetailById(20210179)
     *     {
     *      poster: 'https://sc04.alicdn.com/kf/H8a4cab72818b4bfdb01f06c25566888ah.jpg',
     *       title: '昨日青空',
     *       des: '《昨日青空》（——这，就是我们的故事）是根据口袋巧克力创作的同名绘本漫画改编的动画短片。该短片由七灵石动漫画（上海）有限公司负责制作，2014年1月在全网发布，时长为4:10。该片于2018年10月26日上映。\n这就是我们的故事。\n故事里的少年们生活在不算遥远的过去，一个青瓦小巷，墙皮斑驳的小城。那里阳光温暖却不浓烈。校门口的街边，总是弥漫着煎炸小食油腻腻的香气。男生们踩在发出各种声响的老旧自行车上高声谈笑，女生穿着永远宽大的校服，在婆娑的树影里微笑。风吹过身旁，才能看出她们瘦小纤细的轮廓……\n他们共同穿行在一段叫做高三的时光里。他们讨厌考试，担心分数。他们小心翼翼地喜欢着某人，但当亲密突然而至的时候又会怯而止步。他们好像有很多梦想，但是铺在前方的未来却很单调。他们总是愤力撞击着青春的牢笼！却找不到前行的方向……\n他们觉得一切很丑——\n——他们觉得，一切很美。\n翻开这个故事，你就像按下了关机键。\n关掉这个世界的纷繁和所有不及回味的快节奏交流，你才会看到自己的剪影，在黑色屏幕里静静的反光。在那段想要回忆却几乎要遗忘的时光里，在那种含蓄、静默的美好里，重新奔跑、眺望……\n这是一个发生在上世纪九十年代末，一个平凡、宁静的南方小县城的故事。 讲述了几位小城的高三学生，在面对如山的学业压力间隙中，萌芽的梦想、友谊和初恋，以及他们和大人世界的那道鸿沟。 他们在成长中，幸福和痛苦同时蜕变、升华……',
     *       list: [
     *           {
     *               title: '播放列表3',
     *               li: [{ href: 'https://www.agemys.com/play/20180289?playid=3_1', title: '全集' } ]
     *           },
     *           {
     *               title: '播放列表4',
     *               li: [ { href: 'https://www.agemys.com/play/20180289?playid=4_1', title: '全集' } ]
     *           }
     *      ]
     * }
     * ```
     */
    ZergACGTV.prototype.getDetailById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var browser, page, url, detail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, puppeteer_1["default"].launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        url = this.domain + 'detail/' + id;
                        return [4 /*yield*/, page.goto(url)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c;
                                var menuTitles = document.querySelectorAll('#menu0 li');
                                var list = [];
                                document.querySelectorAll('.movurl ul').forEach(function (ul, index) {
                                    var _a;
                                    if (ul.children.length === 0) {
                                        return;
                                    }
                                    var item = {
                                        title: (_a = menuTitles[index]) === null || _a === void 0 ? void 0 : _a.innerText,
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
                                    poster: (_a = document.querySelector('.poster')) === null || _a === void 0 ? void 0 : _a.src,
                                    title: (_b = document.querySelector('.detail_imform_name')) === null || _b === void 0 ? void 0 : _b.innerText,
                                    des: (_c = document.querySelector('.detail_imform_desc_pre p')) === null || _c === void 0 ? void 0 : _c.innerText,
                                    list: list
                                };
                                if (!detail.title) {
                                    return;
                                }
                                return detail;
                            })];
                    case 4:
                        detail = _a.sent();
                        return [4 /*yield*/, browser.close()];
                    case 5:
                        _a.sent();
                        if (detail) {
                            return [2 /*return*/, detail];
                        }
                        throw new exceptions_1.ExceptionZerg.NotDetail();
                }
            });
        });
    };
    /**
     * 根据站点播放详情页返回在线播放地址
     * @param url 站点的播放界面
     * @returns 视频的在线播放地址
     * ```
     *     const playSrc = ACGTV.getPlayLinkByUrl('https://www.agemys.com/play/20210155?playid=2_1')
     *     console.log(playSrc) // https://yun.66dm.net/SBDM/KenjanoDeshioNanoruKenja01.m3u8&vlt_l=0&vlt_r=0
     * ```
     */
    ZergACGTV.prototype.getPlayLinkByUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var browser, page, errorHtml, pageView1, playUrl, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, puppeteer_1["default"].launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _a.sent();
                        errorHtml = '';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, (0, BaseZerg_1.getPlayIframeSrc)(page, url, '#age_playfram')];
                    case 4:
                        pageView1 = _a.sent();
                        errorHtml = pageView1.html;
                        if (pageView1.src === '') {
                            throw new exceptions_1.ExceptionZerg.MissPlayLink();
                        }
                        playUrl = parse_query_string(pageView1.src.replace(/.+\?/, ''));
                        return [2 /*return*/, playUrl];
                    case 5:
                        e_1 = _a.sent();
                        zergHTMLLog.write(e_1, errorHtml, url);
                        throw new exceptions_1.ExceptionZerg.MissPlayLink();
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ZergACGTV;
}(BaseZerg_1.BaseZerg));
exports.ZergACGTV = ZergACGTV;
