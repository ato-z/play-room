import {touchPath} from '../utils/utils'
import {writeFile} from 'fs'

export class ServiceHTMLLog {
    private savePath = `${__dirname}/../../runtime/zerg/acg`
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