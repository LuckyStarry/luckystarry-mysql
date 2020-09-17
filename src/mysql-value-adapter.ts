export class MySqlValueAdapter {
  public transfer(value: any): any {
    if (value) {
      if (typeof value.readInt8 === 'function') {
        return !!value.readInt8()
      }
    }
    return value
  }
}

export default new MySqlValueAdapter()
