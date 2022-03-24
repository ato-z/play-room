import { InterfaceZerg } from "../interface/InterfaceZerg"
import { ExceptionRoom } from "../exceptions"
import { BaseModel } from "./BaseModel"
export class ModelOnline extends BaseModel{
    
    protected tableName = 'online'

    async get(id: number): Promise<InterfaceZerg.ListProp[]|never>{
        const detail = await this.find<{id: number, li: string}>(id)
        if (detail === null) { throw new ExceptionRoom.MissPlayLink() }
        const li: InterfaceZerg.Li[] = detail.li.split(',').map((href, index) => {
            return {
                title: index < 9 ? '0' + index : index,
                href
            } as InterfaceZerg.Li
        })
        return [{
            title: '在线播放', li
        }]
    }
}