import config from "../config"
import { InterfaceZerg } from "../Interface/InterfaceZerg"
import { ROOM_FROM } from "../menu/ROOM_FROM"
import { ModelOnline } from "../models/ModelOnline"
import './ZergACGTV'
import './ZergMaliMali'
import { exec } from "child_process"
import { ExceptionZerg } from "../exceptions"

const modelOnlie = new ModelOnline('online')

const cacheCmd = new Map()
const callCmd = (cmd, err): Promise<string> => {
    if (cacheCmd.has(cmd)) { return Promise.resolve(cacheCmd.get(cmd)) }
    return new Promise((resolve, reject) => {
        exec(cmd, (_err, stdout, stderr) => {
            if (_err || stdout === '') { reject(err) } 
            const result = stdout.replace(/^\s+|\s+$|\n/gm, '')
            cacheCmd.set(cmd, result)
            resolve(result)
        })
    })
}

export const getZergDetail = async (from: number, from_id: string|number): Promise<InterfaceZerg.Detail|null> => {
    let from_data: InterfaceZerg.Detail|null = null
    if (from === ROOM_FROM.ONLINE) {
        const list = await modelOnlie.get(~~from_id)
        from_data = {
            list,
            poster: '', title: '', des: ''
        }
    }
    if (from === ROOM_FROM.AGETV) {
        const dir = [config.root, '../scripts/fromAcgTVFan.js'].join('\/')
        const cmd = `node ${dir} ${from_id}` 
        const dataJSON = await callCmd(cmd, ExceptionZerg.MissPlayLink)
        from_data = JSON.parse(dataJSON) as unknown as InterfaceZerg.Detail
    }
    if (from === ROOM_FROM.MALI_MALI) {
        const dir = [config.root, '../scripts/fromMaliMaliFan.js'].join('\/')
        const cmd = `node ${dir} ${from_id}` 
        const dataJSON = await callCmd(cmd, ExceptionZerg.MissPlayLink)
        from_data = JSON.parse(dataJSON) as unknown as InterfaceZerg.Detail
    }
    return from_data
}

export const getZergPlayUrl = async (from: number, tagerUrl: string): Promise<string|null> => {
    let playUrl : string|null = null
    if (from === ROOM_FROM.ONLINE) { return tagerUrl }
    if (from === ROOM_FROM.AGETV) {
        const dir = [config.root, '../scripts/fromAcgTVFan.js'].join('\/')
        const cmd = `node ${dir} ${tagerUrl}` 
        playUrl = await callCmd(cmd, ExceptionZerg.MissPlayLink)
    }
    if (from === ROOM_FROM.MALI_MALI) {
        const dir = [config.root, '../scripts/fromMaliMaliFan.js'].join('\/')
        const cmd = `node ${dir} ${tagerUrl}` 
        playUrl = await callCmd(cmd, ExceptionZerg.MissPlayLink)
    }
    return playUrl
}