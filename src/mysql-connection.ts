import * as mysql from 'mysql'

export class MySqlConnection {
  private connection: mysql.Connection
  public constructor(connection: mysql.Connection) {
    this.connection = connection
  }

  public async queryAsync<T>(sql: string, parameters?: any[]): Promise<{ results?: any; fields?: mysql.FieldInfo[] }> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, parameters || [], (error, results, fields) => {
        if (error) {
          reject(error)
        } else {
          resolve({ results, fields })
        }
      })
    })
  }

  public async beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction(async (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  public async commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.commit(async (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  public async rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.rollback(async (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
