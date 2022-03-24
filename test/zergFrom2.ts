import { ZergMaliMali } from '../src/zerg/ZergMaliMali'

const zergMaliMali = new ZergMaliMali()
const detailId = 1358
// zergMaliMali.getDetailById(detailId).then(result => {
//     console.log(result.list[0])
// })


const playUrl = 'https://www.malimali3.com/play/1358-1-14.html'
zergMaliMali.getPlayLinkByUrl(playUrl).then(console.log)