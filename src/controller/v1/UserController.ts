import { POST, GET, route } from "awilix-koa";
import { Context } from "koa";
import { InterfaceUser } from "../../interface/InterfacaUser";
import { randomName, date } from "../../utils/utils";
import {USER_LEVEL} from '../../menu/USER_LEVEL';
import {ServiceUser} from '../../services/ServiceUser';
import {ServiceToken} from '../../services/ServiceToken'
import { ParamExceotion } from "../../exceptions";

/**
 * 用户相关的模块
 */
@route('/v1/user')
export class UserController{
    
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
    @route('/temporary')
    @GET()
    async autoRegister(): Promise<{sign: string}>{
        const password = ServiceUser.codePassword(`${Date.now()}${Math.random()}`)
        const userData: InterfaceUser.Detail = {
            nickname: randomName(),
            level: USER_LEVEL.TEMPRORAAY,
            create_date: date('y-m-d h:i:s'),
            password: password
        }
        const udata = await ServiceUser.createUser(userData)
        const sign = ServiceUser.codeLoginSign(udata)
        return { sign }
    }

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
    @route('/detail')
    @GET()
    async detail(ctx: Context): Promise<Partial<InterfaceUser.Detail>>{
        const token = ServiceToken.get(ctx.header.token as string)
        const userData:Partial<InterfaceUser.Detail> = await ServiceUser.get(token.id) 
        delete userData.password
        delete userData.delele_date
        return userData
    }

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
    @route('/upname')
    @POST()
    async upname(ctx: Context) {
        const body = ctx.bodyJSON
        if (!body?.nickname) { throw new ParamExceotion('nickname不能为空') }
        const nickname = body.nickname
        if (/^(.{1,8})$/.test(nickname) === false) { throw new ParamExceotion(' nickname字数必须大于0且小于9') }
        const token = ServiceToken.get(ctx.header.token as string)
        await ServiceUser.upData(token.id, {nickname})
        return {nickname}
    }

}