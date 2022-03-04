import {date, touchPath} from '../utils/utils'
import {writeFile} from 'fs'

// 如果保存路径不存在则进行创建
const savePath = `${__dirname}/../../runtime/zerg_acg`


export class ServiceHTMLLog {
    private savePath = `${__dirname}/../../runtime/`
    constructor(path: string) {
        this.savePath += path
        touchPath(this.savePath)
    }

    write(error: Error, html: string, url: string) {
        const content = ` ${html}
        ${error.stack}
        `
        const path = this.savePath + '/' + Date.now() + '_' + encodeURIComponent(url) + '.html'
        writeFile(path, content, {flag: 'w'}, () => {})
    }
}