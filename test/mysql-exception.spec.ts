/* tslint:disable */
import { expect } from 'chai'
import { MySqlException } from '../src/mysql-exception'

describe('./src/mysql-exception', function () {
  it('存在 MySqlException', function () {
    expect(MySqlException).not.null
    expect(MySqlException).not.undefined
  })
})
