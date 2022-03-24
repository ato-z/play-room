import { BaseZerg, getPlayIframeSrc } from "./BaseZerg"
import puppeteer from 'puppeteer'

import { InterfaceZerg } from '../interface/InterfaceZerg'
import { ServiceHTMLLog } from "../services/ServiceHTMLLog"
import { ExceptionZerg } from "../exceptions"

// 爬虫html副本保存类
const zergHTMLLog = new ServiceHTMLLog('zerg/www_malimali3_com')
/**
 * 解析malimali站点的详情与视频地址
 * 主站：https://www.malimali3.com/
 * 备站：https://www.malimali4.com
 */
export class ZergMaliMali extends BaseZerg{

    domain: string = 'https://www.malimali3.com'

    async getDetailById(id: string|number): Promise<InterfaceZerg.Detail|never>{
        const url = `${this.domain}/voddetail/${id}.html`
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.goto(url)
        const detail = await page.evaluate(():InterfaceZerg.Detail|undefined => {
            const list: InterfaceZerg.ListProp[] = []
            document.querySelectorAll('.playlist ul').forEach(function(ul, index) {
                if (ul.children.length === 0) { return }
                const item = {
                    title: '线路' + (++index),
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
                poster: (document.querySelector('.thumb img') as HTMLImageElement )?.src,
                title: (document.querySelector('.drama-tit h3') as HTMLElement)?.innerText || '',
                des: (document.querySelectorAll('.drama-data .intro')[1] as HTMLElement)?.innerText,
                list
            }
            if (!detail.title) { return }
            return detail
        })
        if (detail !== undefined) { return detail }
        throw new ExceptionZerg.NotDetail()
    }

    async getPlayLinkByUrl(url: string): Promise<string|never> {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
            //headless: false,
            ignoreDefaultArgs: ['--mute-image'],
            timeout: 0 
        })

        // 这个网站非常非常卡！必须用移动端的方式访问
        const page = await browser.newPage()
        await page.setUserAgent(this.userAgeent)
        let errorHtml = ''
        try {
            const pageView1 = await getPlayIframeSrc(page, url, '#playleft iframe')
            if (pageView1.src === '') { throw new Error('获取播放链接失败') }
            errorHtml = pageView1.html
            await browser.close()
            if (pageView1.src === '') { throw new ExceptionZerg.MissPlayLink() }
            const objLi: any = decodeURIComponent(pageView1.src).split(/[\?|\&]/).map(item => item.split('=')[1])
            return objLi[1]
        } catch(e) {
            zergHTMLLog.write(e, errorHtml, url)
            throw new ExceptionZerg.MissPlayLink()
        }
    }
}