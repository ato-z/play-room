import { match } from 'assert'
import { ZergMaliMali } from '../src/zerg/ZergMaliMali'

const zergMaliMali = new ZergMaliMali()
const detailId = 1358
// zergMaliMali.getDetailById(detailId).then(result => {
//     console.log(result.list[0])
// })


const playUrl = 'https://www.malimali3.com/play/1779-1-13.html'
zergMaliMali.getPlayLinkByUrl(playUrl).then(console.log)