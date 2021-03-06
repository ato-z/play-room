/**
 * 基础异常类
 */
 export class BaseExceotion extends Error{
    msg = '网络异常～'
    errorCode = 999
    code = 500

    constructor(msg?: string, errorCode?:number, code?: number) {
        super(msg)
        if (msg) {  this.msg = msg }
        if (errorCode) {  this.errorCode = errorCode }
        if (code) {  this.code = code }
        Object.setPrototypeOf(this, BaseExceotion.prototype)
    }
}

/**
 * 参数校验错误类
 */
 export class ParamExceotion extends BaseExceotion{
    msg = '参数校验异常'
    errorCode = 10000
    code = 200
}

/**
 * 用户相关的异常
 */
export namespace ExceptionUser{

    export class MissSign extends BaseExceotion{
        code = 200
        msg = 'sign已失效,请重新登录～'
        errorCode = 20100;
    }

    export class MissUser extends BaseExceotion{
        code = 200
        msg = '当前sign已失效,请重新登录～'
        errorCode = 20200
    }
}

/**
 * token相关的异常
 */
 export namespace ExceptionToken{

    export class Miss extends BaseExceotion{
        code = 200
        msg = '当前token不存在或已过期'
        errorCode = 30100;
    }
}

/**
 * agetv站点的错误异常
 */
 export namespace ExceptionZerg{
    export class NotDetail extends BaseExceotion{
        code = 200
        msg = '嗨呀～内容跑掉了'
        errorCode = 40100
    }

    export class MissPlayLink extends BaseExceotion{
        code = 200
        msg = '嗨呀～播放链接不见了'
        errorCode = 40101
    }
}

/**
 * 房间相关的异常
 */
export namespace ExceptionRoom{
    export class NotDetail extends BaseExceotion{
        code = 200
        msg = '房间不存在或已被删除'
        errorCode = 50100
    }

    export class MissPlayLink extends BaseExceotion{
        code = 200
        msg = '找不到可播放链接'
        errorCode = 50101
    }

    export class NotJoinPlayRoom extends BaseExceotion{
        code = 200
        msg = '未加入放映厅'
        errorCode = 50200
    }

    export class WaitJoin extends BaseExceotion{
        code = 200
        msg = '放映厅正在初始化中...请稍后'
        errorCode = 50201
    }
}

/**
 * WebSocketServer的异常
 */
export namespace ExceptionWSS{
    export class MaxConnect extends BaseExceotion{
        code = 200
        msg = '当前房间已达上限'
        errorCode = 60000
    }
}