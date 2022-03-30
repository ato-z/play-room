const {ZergMaliMali} = require("../dist/zerg/ZergMaliMali")

const zergMaliMali = new ZergMaliMali()
const args = process.argv
const arg = args.pop()

const echo = (data) => {
    if (data instanceof Error) {
        data = data.message
    }
    if (typeof data !== 'string') {
        data = JSON.stringify(data)
    }
    console.log(data)
}

/**
 * 获取详情
 * 执行方式一： node ./scripts/fromAgeFan.js 1358
 */
const intArg = parseInt(arg)

/**
 * 获取播放链接
 * 执行方式二： node ./scripts/fromAgeFan.js https://www.malimali3.com/play/1779-1-13.html
 */
const strArg = arg

let currentPromise
if (isNaN(intArg) === false) { //获取详情
    currentPromise = zergMaliMali.getDetailById(intArg)
    .then(echo)
    .catch(() => echo(null))
}
else { //  获取播放链接 
    currentPromise = zergMaliMali.getPlayLinkByUrl(strArg)
    .then(echo)
    .catch(() => echo(null))
}

// 关闭进程
currentPromise.finally(() => process.exit())