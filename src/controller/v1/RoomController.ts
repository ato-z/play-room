import { GET, POST, route } from "awilix-koa"
import { Context } from "koa"
import config from "../../config"
import { ExceptionRoom, ParamExceotion } from "../../exceptions"
import { InterfaceRoom } from "../../interface/InterfaceRoom"
import { WS_CODE } from "../../menu/WS_CODE"
import { ModelOnline } from "../../models/ModelOnline"
import { ServicePlayRoom } from "../../services/ServicePlayRoom"
import { ServiceRoom } from "../../services/ServiceRoom"
import { ServiceToken } from "../../services/ServiceToken"
import { ServiceUser } from "../../services/ServiceUser"

@route('/v1/room')
export class RoomController{

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
    @route('/list')
    @GET()
    async list(ctx: Context) {
        const query = ctx.request.query as unknown as InterfaceRoom.listQuery
        const start = Math.max(0, parseInt(query.start || '0'))
        const count = Math.min(50, parseInt(query.count || '10'))
        const list = await ServiceRoom.getList(start, count)
        return {list}
    }

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
    @route('/new')
    @POST()
    async create(ctx: Context) {
        const query: Record<string, any> = ctx.bodyJSON || {}
        const keys = ['title', 'des', 'from', 'from_id', 'open']
        keys.forEach(key => {
            if (query[key] === undefined) { throw new ParamExceotion(key + '不能为空') }
        })
        if (query.from === 0) {
            const modelOnlie = new ModelOnline('online')
            await modelOnlie.get(query.from_id) 
        }
        const token = ServiceToken.get(ctx.header.token as string)
        const data: InterfaceRoom.detail = Object.assign({
            master_id: token.id,
        }, query as InterfaceRoom.createProp)
        const newRoom = await ServiceRoom.create(data)
        return newRoom
    }


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
    @route('/detail')
    @GET()
    async detail(ctx: Context) {
        const room_id = parseInt(ctx.request.query.room_id as string) 
        if (!room_id) { throw new ParamExceotion('room_id不能为空') }
        const token = ServiceToken.get(ctx.header.token as string)
        const uid = token.id
        const userService = await ServiceUser.of(uid)
        const playRoom = await ServicePlayRoom.of(room_id, uid)
        userService.joinInRoom(playRoom) // 当用户调用房间详情时，证明在房间内。自动加入到该房
        return Object.assign({}, playRoom.room)
    }


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
    @route('/statu')
    @GET()
    async statu(ctx: Context) {
        const room_id = parseInt(ctx.request.query.room_id as string) 
        if (!room_id) { throw new ParamExceotion('room_id不能为空') }
        const token = ServiceToken.get(ctx.header.token as string)
        const playRoom = await ServicePlayRoom.of(room_id, token.id)
        return playRoom.getCurrent(this.codeWsURL(ctx))
    }

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
    @route('/join_wss')
    @POST()
    async joinWs(ctx: Context) {
        const query = ctx.bodyJSON as InterfaceRoom.joinWssQuery
        const token = ServiceToken.get(ctx.header.token as string)
        const uid = token.id
        const userService = await ServiceUser.of(uid)
        const {playRoom} = userService
        if (!playRoom) { throw new ExceptionRoom.NotJoinPlayRoom() }
        if (!playRoom.chatWs || !playRoom.playWs) { throw new ExceptionRoom.WaitJoin() }
        if (playRoom.chatWs.port === query.port && playRoom.chatWs.wsList[query.id]) {
            userService.charWs = query.id
            return {msg: '已加入聊天室'}
        }
        if (playRoom.playWs.port === query.port && playRoom.playWs.wsList[query.id]) {
            userService.playWs = query.id
            return {msg: '已加入放映厅'}
        }
        throw new ParamExceotion('加入wss服务失败～')
    }

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
    @route('/switch_play')
    @POST()
    async switchPlay(ctx: Context) {
        const query = ctx.bodyJSON || {} as InterfaceRoom.switchPlayQuery
        if (query.liIndex === undefined) { throw new ParamExceotion('liIndex不能为空') }
        if (query.itemIndex === undefined) { throw new ParamExceotion('itemIndex不能为空') }
        const token = ServiceToken.get(ctx.header.token as string)
        const uid = token.id
        const userService = await ServiceUser.of(uid)
        const playRoom = userService.playRoom
        if (!playRoom) { throw new ParamExceotion('您暂未加入放映厅') }
        if (playRoom.room.master_id !== uid) { throw new ParamExceotion('只有房主才切换播放') }
        await playRoom.setPlayIndex(query.liIndex, query.itemIndex)
        return {msg: '正在切换...'}
    }

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
    @route('/close')
    @GET()
    async closeRoom(ctx: Context) {
        const token = ServiceToken.get(ctx.header.token as string)
        const uid = token.id
        const userService = await ServiceUser.of(uid)
        const playRoom = userService.playRoom
        if (!playRoom) { throw new ParamExceotion('您暂未加入放映厅') }
        if (playRoom.room.master_id !== uid) { throw new ParamExceotion('只有房主才可以清空房间') }
        playRoom.clear()
        await ServiceRoom.deleteByID(playRoom.room.id)
        return {msg: '房间已被销毁'}
    }

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
    @route('/say')
    @POST()
    async say(ctx: Context) {
        const query = ctx.bodyJSON || {} as {msg: string}
        const msg = (query.msg || '').replace(/^\s+|\s+$/g, '')
        if (msg === '') { throw new ParamExceotion('说点啥吧～') }
        const token = ServiceToken.get(ctx.header.token as string)
        const uid = token.id
        const userService = await ServiceUser.of(uid)
        const playRoom = userService.playRoom
        if (!playRoom) { throw new ParamExceotion('您暂未加入放映厅') }
        const sendData = {
            nickname: userService.udata.nickname,
            is_master: playRoom.room.master_id === uid, msg
        }
        playRoom.chatWs.notify(sendData, WS_CODE.USER_SAY)
        return {msg: '就你话多!'}
    }

    /**
     * 基于当前服务端返回wss服务根地址
     * @param ctx 
     * @returns 
     */
    private codeWsURL(ctx: Context): string {
        const domain = (ctx.header.host || '').match(/^(.+)(\:\d+)$/)
        if (domain !== null) { return `ws://${domain[1]}:` }
        return `ws://${config.runIp}:`
    }
}