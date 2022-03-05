import {exec} from 'child_process'
/**
 * 根据时间字符串计算出对应的毫秒
 * @param date {string} 时间字符串 00:22:52.10
 * @returns 相加的毫秒数
 * ```
 * decodeDateToTime('00:22:52.10') // => 1372010
 * ```
 */
const decodeDateToTime = (date: string) => {
    const [times, ms] = date.split('.')
    const vals = times.split(':')
    let val = parseInt(ms) || 0
    let current
    let deep = 0
    while(current = vals.pop()) {
        const pow = deep === 0 ? 1 : Math.pow(60, deep)
        const currentVal = parseInt(current) * pow
        val += currentVal * 1000
        deep += 1
    }
    return val
}

/**
 * 计算线上视频时长的助手函数后期实现
 * 服务端需先安装 ffmpeg
 * @param url 
 * @returns 
 */
export const decodeVideoDuration = async (url: string) => {
    return new Promise((resovle, reject) => {
        exec(`ffmpeg -i ${url}`, function(err, stdout, stderr){
            let duration: any = null
            if (err !== null) {
                const regDuration =/Duration\: ([0-9\:\.]+),/
                duration = regDuration.exec(err.message)
                if (duration == null) { return reject(err) }
            } else {
                const reslut = stderr.toString();
                const regDuration =/Duration\: ([0-9\:\.]+),/
                duration = regDuration.exec(reslut)
            }
            if(duration !== null){
                var dateStr = duration[1];
                //获得时长
                resovle(decodeDateToTime(dateStr))
            }
            reject(new Error('解析失败'))
        })
    }).catch(() => 120 * 60 * 1000)
}
