import svgCaptcha from 'svg-captcha'

export function createCaptcha() {
  return svgCaptcha.createMathExpr({
    size: 4,
    ignoreChars: '0o1iIl',
    noise: 2,
    color: true,
    background: '#eee',
    fontSize: 50,
    width: 110,
    height: 38,
  })
}

export function createMathExpr() {
  const options = {}
  return svgCaptcha.createMathExpr(options)
}
