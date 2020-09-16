/* tslint:disable */
import { expect } from 'chai'
import MySqlClient from '../src/index'

describe('Index', function () {
  it('存在 默认导出', function () {
    expect(MySqlClient).not.null
    expect(MySqlClient).not.undefined
  })
})
