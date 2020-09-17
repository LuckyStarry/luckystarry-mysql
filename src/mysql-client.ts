import mysql, { PoolConfig } from 'mysql'
import { MySqlConnection } from './mysql-connection'
import { MySqlException } from './mysql-exception'
import adapter, { MySqlValueAdapter } from './mysql-value-adapter'
export class MySqlClient {
  private pool: mysql.Pool
  private config: PoolConfig | string
  private adapter: MySqlValueAdapter = adapter
  public constructor(config?: PoolConfig | string) {
    this.config = config || process.env.MYSQL_CONNECTION
  }

  public get Pool(): mysql.Pool {
    if (!this.pool) {
      if (!this.config) {
        throw new Error('必须配置 MySQL 的连接字符串。')
      }
      this.pool = mysql.createPool(this.config)
    }
    return this.pool
  }

  public async transactAsync<T>(process: (connection: MySqlConnection) => Promise<T>): Promise<T> {
    return await this.executeAsync(async (connection) => {
      return new Promise(async (resolve, reject) => {
        if (connection) {
          await connection.beginTransaction()
          try {
            let result = await process(connection)
            await connection.commit()
            resolve(result)
          } catch (error) {
            await connection.rollback()
            if (error instanceof MySqlException) {
              reject(error)
            } else {
              reject(new MySqlException({ sql: '', process: 'transactAsync', inner: error }))
            }
          }
        } else {
          reject(new MySqlException({ sql: '', process: 'getConnection' }))
        }
      })
    })
  }

  public async executeAsync<T>(process: (connection: MySqlConnection) => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.Pool.getConnection(async (error, connection) => {
        if (error) {
          reject(new MySqlException({ sql: '', process: 'executeAsync', inner: error }))
        } else {
          if (connection) {
            try {
              resolve(await process(new MySqlConnection(connection)))
            } catch (e) {
              if (e instanceof MySqlException) {
                reject(e)
              } else {
                reject(new MySqlException({ sql: '', process: 'executeAsync', inner: e }))
              }
            } finally {
              connection.release()
            }
          } else {
            reject(new MySqlException({ sql: '', process: 'getConnection' }))
          }
        }
      })
    })
  }

  public async allAsync<T>(sql: string, parameters?: any[]): Promise<T[]> {
    return await this.executeAsync(async (connection) => {
      try {
        let { results } = await connection.queryAsync(sql, parameters)
        if (results && results.length) {
          let list = []
          for (let item of results) {
            for (let column in item) {
              if (column) {
                item[column] = this.adapter.transfer(item[column])
              }
            }
            list.push(item)
          }
          return list
        }
        return null
      } catch (error) {
        throw new MySqlException({ sql, parameters, process: 'allAsync', inner: error })
      }
    })
  }

  public async queryAsync<T>(sql: string, parameters?: any[]): Promise<{ list: T[]; count: number }> {
    return await this.executeAsync(async (connection) => {
      try {
        let { results } = await connection.queryAsync(sql, parameters)
        if (results && results.length === 2) {
          let count = results[0][0]['__COUNT']
          let list = []
          for (let item of results[1]) {
            for (let column in item) {
              if (column) {
                item[column] = this.adapter.transfer(item[column])
              }
            }
            list.push(item)
          }
          return { list, count }
        }
        return null
      } catch (error) {
        throw new MySqlException({ sql, parameters, process: 'queryAsync', inner: error })
      }
    })
  }

  public async getCountAsync(sql: string, parameters?: any[]): Promise<number> {
    return await this.executeAsync(async (connection) => {
      try {
        let { results, fields } = await connection.queryAsync(sql, parameters)
        if (results && fields && results.length && fields.length) {
          if (fields.length === 1 && results.length === 1) {
            let row = results[0]
            let name = fields[0].name
            return row[name]
          }
        }
        throw new MySqlException({ message: '获取 Count 失败, 检索结果的字段及行数不正确。', sql, parameters, process: 'getCountAsync' })
      } catch (error) {
        if (error instanceof MySqlException) {
          throw error
        }
        throw new MySqlException({ sql, process: 'getCountAsync', parameters, inner: error })
      }
    })
  }

  public async queryFirstAsync<T>(sql: string, parameters?: any[]): Promise<T> {
    let results = await this.allAsync<T>(sql, parameters)
    if (results && results.length) {
      return results.shift()
    } else {
      throw new MySqlException({ message: '获取首行数据失败, 检索结果为空。', sql, parameters, process: 'queryFirstAsync' })
    }
  }

  public async queryFirstOrDefaultAsync<T>(sql: string, parameters?: any[], defaultValue?: T): Promise<T> {
    let results = await this.allAsync<T>(sql, parameters)
    if (results && results.length) {
      return results.shift()
    } else {
      return defaultValue
    }
  }

  public async insertAsync(sql: string, parameters?: any[]): Promise<number> {
    return await this.executeAsync(async (connection) => {
      try {
        let { results } = await connection.queryAsync(sql, parameters)
        return results.insertId
      } catch (error) {
        throw new MySqlException({ message: '插入数据失败。', sql, parameters, process: 'insertAsync' })
      }
    })
  }

  public async executeNonQueryAsync(sql: string, parameters?: any[]): Promise<number> {
    return await this.executeAsync(async (connection) => {
      try {
        let { results } = await connection.queryAsync(sql, parameters)
        return results.affectedRows
      } catch (error) {
        throw new MySqlException({ message: '执行SQL失败。', sql, parameters, process: 'executeNonQueryAsync' })
      }
    })
  }
}
