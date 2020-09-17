/* tslint:disable */
import { expect } from 'chai'
import { MySqlClient } from '../src/mysql-client'

describe('./src/mysql-client', function () {
  it('存在 MySqlClient', function () {
    expect(MySqlClient).not.null
    expect(MySqlClient).not.undefined
  })
})
