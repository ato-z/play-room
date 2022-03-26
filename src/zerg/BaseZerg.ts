import { InterfaceZerg } from '../interface/InterfaceZerg'
import puppeteer from 'puppeteer'

export abstract class  BaseZerg{

    protected userAgeent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X; zh-CN) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19B74 UCBrowser/13.6.4.1594 Mobile AliApp(TUnionSDK/0.1.20.4)------------------------------------------Mozilla/5.0 (Linux; U; Android 11; zh-CN; Mi 10 Build/RKQ1.200826.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 UCBrowser/13.6.7.1148 Mobile Safari/537.36'

    abstract domain: string

    abstract getDetailById (id: number|string) : Promise<InterfaceZerg.Detail|never>

    abstract getPlayLinkByUrl(url: string): Promise<string|never>
}

export const getPlayIframeSrc = async (page: puppeteer.Page, url: string, selectors: string) => {
    await page.goto(url)
    const codeResult = await page.evaluate((selectors): Promise<any> => {
        const iframe = document.querySelector(selectors) as HTMLIFrameElement
        return new Promise(function(resovle, reject) {
            const startDate = Date.now()
            const getSrc = () => {
                if (iframe.src) { return resovle(iframe.src) }
                if (Date.now() - startDate > 1000) {
                    reject(new Error('网络超时'))
                } else {
                    requestAnimationFrame(getSrc)
                }
            }
            getSrc()
        }).then(src => {
            return {html: document.documentElement.innerHTML, src}
        }).catch(error => {
            return {html: document.documentElement.innerHTML, src: ''}
        })
    }, selectors)
    return codeResult
}