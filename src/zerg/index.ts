import { InterfaceZerg } from "../Interface/InterfaceZerg"
import { ROOM_FROM } from "../menu/ROOM_FROM"
import { ModelOnline } from "../models/ModelOnline"
import { ZergACGTV } from "./ZergACGTV"
import { ZergMaliMali } from "./ZergMaliMali"

const ACGTV = new ZergACGTV()
const MALI_MALI = new ZergMaliMali()
const modelOnlie = new ModelOnline('online')

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
        from_data = await ACGTV.getDetailById(from_id)
    }
    if (from === ROOM_FROM.MALI_MALI) {
        from_data = await MALI_MALI.getDetailById(from_id)
    }
    return from_data
}

export const getZergPlayUrl = async (from: number, tagerUrl: string): Promise<string|null> => {
    let playUrl : string|null = null
    if (from === ROOM_FROM.ONLINE) { return tagerUrl }
    if (from === ROOM_FROM.AGETV) {
        playUrl = await ACGTV.getPlayLinkByUrl(tagerUrl)
    }
    if (from === ROOM_FROM.MALI_MALI) {
        playUrl = await MALI_MALI.getPlayLinkByUrl(tagerUrl)
    }
    return playUrl
}