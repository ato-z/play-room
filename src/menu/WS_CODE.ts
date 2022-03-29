export enum WS_CODE{

    ERROR = -1, // 错误信息

    MSG = 1, // 公告

    JOIN_ID = 101, // 用户创建了wss服务的动作，并返回加入房间的验证信息

    USER_JOIN = 102, // 用户通过校验并加入房间

    USER_OUT = 103, // 用户退出了房间

    BEFORE_SWITCH_PLAY = 200, // 预备播放地址

    SWITCH_PLAY = 201, // 切换播放地址

    UNIFIED_PLAY = 202, // 统一播放进度

    USER_SAY = 301, // 用户在房间发言
}