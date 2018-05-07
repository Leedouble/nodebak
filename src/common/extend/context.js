// add context function
module.exports = {
  get wxAppletCode() {
    return this.headers[think.config('headerWxCode')]
  }
}
