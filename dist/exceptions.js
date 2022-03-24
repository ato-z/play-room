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
exports.__esModule = true;
exports.ExceptionWSS = exports.ExceptionRoom = exports.ExceptionZerg = exports.ExceptionToken = exports.ExceptionUser = exports.ParamExceotion = exports.BaseExceotion = void 0;
/**
 * 基础异常类
 */
var BaseExceotion = /** @class */ (function (_super) {
    __extends(BaseExceotion, _super);
    function BaseExceotion(msg, errorCode, code) {
        var _this = _super.call(this, msg) || this;
        _this.msg = '网络异常～';
        _this.errorCode = 999;
        _this.code = 500;
        if (msg) {
            _this.msg = msg;
        }
        if (errorCode) {
            _this.errorCode = errorCode;
        }
        if (code) {
            _this.code = code;
        }
        Object.setPrototypeOf(_this, BaseExceotion.prototype);
        return _this;
    }
    return BaseExceotion;
}(Error));
exports.BaseExceotion = BaseExceotion;
/**
 * 参数校验错误类
 */
var ParamExceotion = /** @class */ (function (_super) {
    __extends(ParamExceotion, _super);
    function ParamExceotion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.msg = '参数校验异常';
        _this.errorCode = 10000;
        _this.code = 200;
        return _this;
    }
    return ParamExceotion;
}(BaseExceotion));
exports.ParamExceotion = ParamExceotion;
/**
 * 用户相关的异常
 */
var ExceptionUser;
(function (ExceptionUser) {
    var MissSign = /** @class */ (function (_super) {
        __extends(MissSign, _super);
        function MissSign() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = 'sign已失效,请重新登录～';
            _this.errorCode = 20100;
            return _this;
        }
        return MissSign;
    }(BaseExceotion));
    ExceptionUser.MissSign = MissSign;
    var MissUser = /** @class */ (function (_super) {
        __extends(MissUser, _super);
        function MissUser() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '当前sign已失效,请重新登录～';
            _this.errorCode = 20200;
            return _this;
        }
        return MissUser;
    }(BaseExceotion));
    ExceptionUser.MissUser = MissUser;
})(ExceptionUser = exports.ExceptionUser || (exports.ExceptionUser = {}));
/**
 * token相关的异常
 */
var ExceptionToken;
(function (ExceptionToken) {
    var Miss = /** @class */ (function (_super) {
        __extends(Miss, _super);
        function Miss() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '当前token不存在或已过期';
            _this.errorCode = 30100;
            return _this;
        }
        return Miss;
    }(BaseExceotion));
    ExceptionToken.Miss = Miss;
})(ExceptionToken = exports.ExceptionToken || (exports.ExceptionToken = {}));
/**
 * agetv站点的错误异常
 */
var ExceptionZerg;
(function (ExceptionZerg) {
    var NotDetail = /** @class */ (function (_super) {
        __extends(NotDetail, _super);
        function NotDetail() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '嗨呀～内容跑掉了';
            _this.errorCode = 40100;
            return _this;
        }
        return NotDetail;
    }(BaseExceotion));
    ExceptionZerg.NotDetail = NotDetail;
    var MissPlayLink = /** @class */ (function (_super) {
        __extends(MissPlayLink, _super);
        function MissPlayLink() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '嗨呀～播放链接不见了';
            _this.errorCode = 40101;
            return _this;
        }
        return MissPlayLink;
    }(BaseExceotion));
    ExceptionZerg.MissPlayLink = MissPlayLink;
})(ExceptionZerg = exports.ExceptionZerg || (exports.ExceptionZerg = {}));
/**
 * 房间相关的异常
 */
var ExceptionRoom;
(function (ExceptionRoom) {
    var NotDetail = /** @class */ (function (_super) {
        __extends(NotDetail, _super);
        function NotDetail() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '房间不存在或已被删除';
            _this.errorCode = 50100;
            return _this;
        }
        return NotDetail;
    }(BaseExceotion));
    ExceptionRoom.NotDetail = NotDetail;
    var MissPlayLink = /** @class */ (function (_super) {
        __extends(MissPlayLink, _super);
        function MissPlayLink() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '找不到可播放链接';
            _this.errorCode = 50101;
            return _this;
        }
        return MissPlayLink;
    }(BaseExceotion));
    ExceptionRoom.MissPlayLink = MissPlayLink;
    var NotJoinPlayRoom = /** @class */ (function (_super) {
        __extends(NotJoinPlayRoom, _super);
        function NotJoinPlayRoom() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '未加入放映厅';
            _this.errorCode = 50200;
            return _this;
        }
        return NotJoinPlayRoom;
    }(BaseExceotion));
    ExceptionRoom.NotJoinPlayRoom = NotJoinPlayRoom;
    var WaitJoin = /** @class */ (function (_super) {
        __extends(WaitJoin, _super);
        function WaitJoin() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '放映厅正在初始化中...请稍后';
            _this.errorCode = 50201;
            return _this;
        }
        return WaitJoin;
    }(BaseExceotion));
    ExceptionRoom.WaitJoin = WaitJoin;
})(ExceptionRoom = exports.ExceptionRoom || (exports.ExceptionRoom = {}));
/**
 * WebSocketServer的异常
 */
var ExceptionWSS;
(function (ExceptionWSS) {
    var MaxConnect = /** @class */ (function (_super) {
        __extends(MaxConnect, _super);
        function MaxConnect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.code = 200;
            _this.msg = '当前房间已达上限';
            _this.errorCode = 60000;
            return _this;
        }
        return MaxConnect;
    }(BaseExceotion));
    ExceptionWSS.MaxConnect = MaxConnect;
})(ExceptionWSS = exports.ExceptionWSS || (exports.ExceptionWSS = {}));
