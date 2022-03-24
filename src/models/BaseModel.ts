import config from '../config'
import { initDb } from 'mysql-curd'
import { ParamExceotion } from '../exceptions'

const db = initDb(config.database)

const { spotTable, C, U, R, D } = db

interface JobAttr {
    [prop: string] : (data: any, key: any, value: any) => any
}

/**
 * 模型基础类
 */
export class BaseModel{
    static spotTable = spotTable
    static C = C
    static U = U
    static R = R
    static D = D

    protected tableName: string

    protected spotTable: ReturnType<typeof spotTable>

    /**
     * 查询单条数据
     */
    public find: <T>(id: string|number) => Promise<T|null>

    /**
     * 查询多条
     */
    public selete: ReturnType<typeof R>

    /**
     * 写入数据
     */
    public insert: ReturnType<typeof C>

    /**
     * 更新数据
     */
    public update: ReturnType<typeof U>

    /**
     * 删除数据
     */
    public del: ReturnType<typeof D>

    constructor(tableName: string, {getAttr = {}, setAttr = {}}: {getAttr?: JobAttr, setAttr?: JobAttr} = {}) {
        this.tableName = tableName
        if (this.tableName === '') { throw new ParamExceotion('tableName 不能为空') }
        this.spotTable = spotTable(this.tableName, { getAttr, setAttr })
        this.biuldTool()
    }

    private biuldTool() {
        const spotTable = this.spotTable
        /** 查询 */
        const selete = R(spotTable)
        this.selete = selete
        this.find = <T>(id: string|number) => selete({and: {id}})
        .then(result => {
            if (result === null) { return null }
            return result[0] as T
        })

        /** 写入 */
        this.insert = C(spotTable)

        /** 更新 */
        this.update = U(spotTable)

        /** 删除 */
        this.del = D(spotTable)
    }
}