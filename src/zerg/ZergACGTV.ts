import puppeteer from 'puppeteer'
import { ExceptionZerg } from '../exceptions'
import { InterfaceZerg } from '../interface/InterfaceZerg'
import {ServiceHTMLLog} from '../services/ServiceHTMLLog'
import { BaseZerg, getPlayIframeSrc } from './BaseZerg'

// 爬虫html副本保存类
const zergHTMLLog = new ServiceHTMLLog('zerg/www_agemys_com')

/** 源网站的解密方法 */
const parse_query_string = (query: string): string => {
    var vars = query.split("&");
    var query_string: any = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        if (typeof query_string[key] === "undefined") {
                query_string[key] = decodeURIComponent(value);
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string.url;
}

/**
 * 解析age.tv站点的详情与视频地址
 * 主站：https://www.agemys.com/
 * 备站：https://www.age.tv/
 */
export class ZergACGTV extends BaseZerg{

    /**
     * @params {string} 域名地址
     */
    domain: string = 'https://www.agemys.com/'

    /**
     * 通过ID获取番剧的详情
     * @param id {number|string} 站点获取的番剧id
     * @returns Promise<detail> | never
     * ```
     *     // 错误解析
     *     const detail1 = await ACGTV.getDetailById('不存在的番剧id') // 抛出异常 => throw new ExceptionACG.NotDetail()
     *     // 正常解析返回
     *     const detail2 = await ACGTV.getDetailById(20210179)
     *     {
     *      poster: 'https://sc04.alicdn.com/kf/H8a4cab72818b4bfdb01f06c25566888ah.jpg',
     *       title: '昨日青空',
     *       des: '《昨日青空》（——这，就是我们的故事）是根据口袋巧克力创作的同名绘本漫画改编的动画短片。该短片由七灵石动漫画（上海）有限公司负责制作，2014年1月在全网发布，时长为4:10。该片于2018年10月26日上映。\n这就是我们的故事。\n故事里的少年们生活在不算遥远的过去，一个青瓦小巷，墙皮斑驳的小城。那里阳光温暖却不浓烈。校门口的街边，总是弥漫着煎炸小食油腻腻的香气。男生们踩在发出各种声响的老旧自行车上高声谈笑，女生穿着永远宽大的校服，在婆娑的树影里微笑。风吹过身旁，才能看出她们瘦小纤细的轮廓……\n他们共同穿行在一段叫做高三的时光里。他们讨厌考试，担心分数。他们小心翼翼地喜欢着某人，但当亲密突然而至的时候又会怯而止步。他们好像有很多梦想，但是铺在前方的未来却很单调。他们总是愤力撞击着青春的牢笼！却找不到前行的方向……\n他们觉得一切很丑——\n——他们觉得，一切很美。\n翻开这个故事，你就像按下了关机键。\n关掉这个世界的纷繁和所有不及回味的快节奏交流，你才会看到自己的剪影，在黑色屏幕里静静的反光。在那段想要回忆却几乎要遗忘的时光里，在那种含蓄、静默的美好里，重新奔跑、眺望……\n这是一个发生在上世纪九十年代末，一个平凡、宁静的南方小县城的故事。 讲述了几位小城的高三学生，在面对如山的学业压力间隙中，萌芽的梦想、友谊和初恋，以及他们和大人世界的那道鸿沟。 他们在成长中，幸福和痛苦同时蜕变、升华……',
     *       list: [
     *           { 
     *               title: '播放列表3',
     *               li: [{ href: 'https://www.agemys.com/play/20180289?playid=3_1', title: '全集' } ]
     *           },
     *           {
     *               title: '播放列表4',
     *               li: [ { href: 'https://www.agemys.com/play/20180289?playid=4_1', title: '全集' } ] 
     *           }
     *      ]
     * }
     * ```
     */
    async getDetailById(id: number|string): Promise<InterfaceZerg.Detail|never>{
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        const url = this.domain + 'detail/' + id
        await page.goto(url);
        const detail = await page.evaluate(() => {
            const menuTitles = document.querySelectorAll('#menu0 li')
            const list: InterfaceZerg.ListProp[] = []
            document.querySelectorAll('.movurl ul').forEach(function(ul, index) {
                if (ul.children.length === 0) { return }
                const item = {
                    title: (menuTitles[index] as HTMLElement)?.innerText,
                    li: [] as InterfaceZerg.Li[]
                }
                for (let i = 0, len = ul.children.length; i < len; i++) {
                    let li = ul.children[i]
                    let a:HTMLAnchorElement = li.querySelector('a')!
                    item.li.push({
                        href: a.href,
                        title: a.innerText
                    })
                }
                list.push(item)
            })
            const detail = {
                poster: (document.querySelector('.poster') as HTMLImageElement )?.src,
                title: (document.querySelector('.detail_imform_name') as HTMLElement)?.innerText,
                des: (document.querySelector('.detail_imform_desc_pre p') as HTMLElement)?.innerText,
                list
            }
            if (!detail.title) { return }
            return detail
        })
        await browser.close()
        if (detail) { return detail }
        throw new ExceptionZerg.NotDetail()
    }

    /**
     * 根据站点播放详情页返回在线播放地址
     * @param url 站点的播放界面
     * @returns 视频的在线播放地址
     * ```
     *     const playSrc = ACGTV.getPlayLinkByUrl('https://www.agemys.com/play/20210155?playid=2_1')
     *     console.log(playSrc) // https://yun.66dm.net/SBDM/KenjanoDeshioNanoruKenja01.m3u8&vlt_l=0&vlt_r=0
     * ```
     */
    async getPlayLinkByUrl(url: string): Promise<string|never> {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        let errorHtml = ''

        try {
            const pageView1 = await getPlayIframeSrc(page, url, '#age_playfram')
            errorHtml = pageView1.html
            if (pageView1.src === '') { throw new ExceptionZerg.MissPlayLink() }
            let playUrl = parse_query_string(pageView1.src.replace(/.+\?/, ''))
            return playUrl
        } catch(e) {
            zergHTMLLog.write(e, errorHtml, url)
            throw new ExceptionZerg.MissPlayLink()
        }
    }
}
