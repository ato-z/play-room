"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.BaseModel = void 0;
var config_1 = __importDefault(require("../config"));
var mysql_curd_1 = require("mysql-curd");
var exceptions_1 = require("../exceptions");
var db = (0, mysql_curd_1.initDb)(config_1["default"].database);
var spotTable = db.spotTable, C = db.C, U = db.U, R = db.R, D = db.D;
/**
 * 模型基础类
 */
var BaseModel = /** @class */ (function () {
    function BaseModel(tableName, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.getAttr, getAttr = _c === void 0 ? {} : _c, _d = _b.setAttr, setAttr = _d === void 0 ? {} : _d;
        this.tableName = tableName;
        if (this.tableName === '') {
            throw new exceptions_1.ParamExceotion('tableName 不能为空');
        }
        this.spotTable = spotTable(this.tableName, { getAttr: getAttr, setAttr: setAttr });
        this.biuldTool();
    }
    BaseModel.prototype.biuldTool = function () {
        var spotTable = this.spotTable;
        /** 查询 */
        var selete = R(spotTable);
        this.selete = selete;
        this.find = function (id) { return selete({ and: { id: id } })
            .then(function (result) {
            if (result === null) {
                return null;
            }
            return result[0];
        }); };
        /** 写入 */
        this.insert = C(spotTable);
        /** 更新 */
        this.update = U(spotTable);
        /** 删除 */
        this.del = D(spotTable);
    };
    BaseModel.spotTable = spotTable;
    BaseModel.C = C;
    BaseModel.U = U;
    BaseModel.R = R;
    BaseModel.D = D;
    return BaseModel;
}());
exports.BaseModel = BaseModel;
