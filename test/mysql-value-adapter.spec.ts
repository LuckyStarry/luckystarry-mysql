/* tslint:disable */
import { expect } from 'chai'
import adapter, { MySqlValueAdapter } from '../src/mysql-value-adapter'

describe('./src/mysql-value-adapter', function () {
  it('存在默认导出', function () {
    expect(adapter).not.null
    expect(adapter).not.undefined
    expect(adapter).instanceof(MySqlValueAdapter)
  })

  it('存在 MySqlValueAdapter', function () {
    expect(MySqlValueAdapter).not.null
    expect(MySqlValueAdapter).not.undefined
  })
})
