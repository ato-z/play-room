import { GET, POST, route } from "awilix-koa"
import { Context } from "koa"
import { ParamExceotion } from "../../exceptions"
import {interfaceMedia} from "../../interface/interfaceMedia"
import { date } from "../../utils/utils"
import { getZergDetail, getZergPlayUrl } from '../../zerg/index'
import {ModelOnline} from '../../models/ModelOnline'
import { ROOM_FROM } from "../../menu/ROOM_FROM"
import http from 'http'

@route('/v1/media')
export class MediaController{

    /**
     * 验证视频的from是否在爬虫列表中
     * @param _from 
     */
    private hasInVideoFrom(_from: number): void|never {
        if (ROOM_FROM[_from] === undefined) {
            throw new ParamExceotion('暂不支持from=' + _from + '的数据')
        }
    }

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
    @route('/video')
    @GET()
    async getVideo(ctx: Context) {
        const query = ctx.request.query as unknown as interfaceMedia.videoQuery
        const _from = parseInt(query.from)
        const video_id = parseInt(query.video_id)
        this.hasInVideoFrom(_from)
        if (!video_id) { throw new ParamExceotion('video_id不能为空') }
        const data = await getZergDetail(_from, video_id)
        return data
    }

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
    @route('/decode_play')
    @POST()
    async decodePlayLink(ctx: Context) {
        const query = ctx.bodyJSON as interfaceMedia.playQuery
        const _from = parseInt(query.from)
        this.hasInVideoFrom(_from)
        if (!query.target) { throw new ParamExceotion('target不能为空') }
        const data = await getZergPlayUrl(_from, query.target)
        return data
    }

    @route('/add')
    @POST()
    async add(ctx: Context) {
        const query = ctx.bodyJSON as {list: Array<string> }
        const list = (query?.list || [])
        if (list.length === 0) { throw new ParamExceotion('list不能为空') }
        const li = list.join(',')
        const create_date = date('y-m-d h:i:s')
        const modelOnlie = new ModelOnline('online')
        const res = await modelOnlie.insert({li, create_date})
        return {id: res.insertId}
    }
}