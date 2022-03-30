
/**
 * 扫描局域网内ip段的地址
 */
const { exec } = require("child_process")

/**
 * 获取详情
 * 执行方式： node ./scripts/ipFilter.js 192.168.100.
 */
const ipPrefix = process.argv[ process.argv.length - 1]
new Promise(resolve => {
  let i = 0
  const ipPool = []
  const ping = () => {
    if (i > 255) { return resolve(ipPool) }
    const ip = ipPrefix + (++i)
    exec(`ping -c 1 ${ip}`, function(err, stdout, stderr) {
      if (err === null && stdout) {
        console.log(ip, '✔️')
        ipPool.push(ip)
      } else {
        console.log(ip, '✖️')
      }
      process.nextTick(ping)
    })
  }
  ping()
  // ping() // 可以开启多个查询
}).then(console.log)
.finally(() => process.exit())