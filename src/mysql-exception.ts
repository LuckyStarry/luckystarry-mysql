export class MySqlException extends Error {
  private process: string
  private sql: string
  private parameters: any
  private inner: Error
  public constructor(payload: { message?: string; sql: string; parameters?: any; process: string; inner?: Error }) {
    payload = Object.assign({}, payload, { message: 'SQL执行出现异常' })
    super(payload.message || 'SQL执行出现异常')
    this.sql = payload.sql || ''
    this.parameters = payload.parameters || null
    this.process = payload.process || 'UNKNOWN'
    this.inner = payload.inner || null
  }

  public get Process(): string {
    return this.process
  }

  public get Sql(): string {
    return this.sql
  }

  public get Parameters(): any {
    return this.parameters
  }

  public get InnerException(): Error {
    return this.inner
  }
}
