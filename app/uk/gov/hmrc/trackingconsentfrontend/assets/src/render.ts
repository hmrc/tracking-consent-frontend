const render = () => {
  const text = document.createTextNode('Hello World')
  const parentNode = document.body
  parentNode.insertBefore(text, parentNode.firstChild)
}

export default render
