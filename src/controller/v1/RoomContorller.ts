import { route } from "awilix-koa";
import { Context } from "koa";
import { interfaceRoom } from "../../interface/interfaceRoom";
import { ROOM_OPEN } from "../../menu/ROOM_OPEN";
import { ModelRoom } from "../../models/ModelRoom";

@route('/v1/room')
export class RoomController{

    /**
    * @api {GET} /v1/room/list 公共的房间列表
    * @apiName 房间列表
    * @apiGroup Room
    * @apiVersion 1.0.0
    * 
    * @apiParam (url参数) {String} start  开始的条目
    * @apiParam (url参数) {String} count  获取的条目
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
    *      data: {list: []},
    *      errorCode: 0
    * }
    */
    @route('/list')
    async list(ctx: Context) {
        const query = ctx.request.query as unknown as interfaceRoom.listQuery
        const start = parseInt(query.start || '0')
        const count = parseInt(query.count || '10')
        return ModelRoom.select({open: ROOM_OPEN.PUBLIC}, start, count)
    }
}