/* istanbul ignore file */
const gtm = () => {
  (function (w, d, s, l, i) {
    w[l] = w[l] || []
    w[l].push({
      'gtm.start':
                new Date().getTime(),
      event: 'gtm.js'
    })
    var f = d.getElementsByTagName(s)[0]
    // eslint-disable-next-line
    var j = d.createElement(s); var dl = l != 'dataLayer' ? '&l=' + l : ''
    // @ts-ignore
    j.async = true
    // @ts-ignore
    j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl
    // @ts-ignore
    f.parentNode.insertBefore(j, f)
  })(window, document, 'script', 'dataLayer', 'GTM-NDJKHWK')
}

export default gtm
