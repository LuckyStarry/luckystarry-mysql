/* tslint:disable */
import { expect } from 'chai'
import { MySqlConnection } from '../src/mysql-connection'

describe('./src/mysql-connection', function () {
  it('存在 MySqlConnection', function () {
    expect(MySqlConnection).not.null
    expect(MySqlConnection).not.undefined
  })
})
