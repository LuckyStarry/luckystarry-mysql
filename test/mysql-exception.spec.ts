/* tslint:disable */
import { expect } from 'chai'
import { MySqlException } from '../src/mysql-exception'

describe('./src/mysql-exception', function () {
  it('存在 MySqlException', function () {
    expect(MySqlException).not.null
    expect(MySqlException).not.undefined
  })

  it('new MySqlException(null) 不报错', function () {
    expect(() => {
      new MySqlException(null)
    }).not.throw()
  })

  it('new MySqlException() 不报错', function () {
    expect(() => {
      new MySqlException(undefined)
    }).not.throw()
  })
})
