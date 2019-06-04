'use strict'

function addPagenumbers(state) {
  let newChildren
  let nestingLevel
  function _processChild(match) {
    let textNode, havePG = false
    if (match.indexOf('[pg') === -1) {
      textNode = new state.Token('text', '', 0)
      textNode.content = match
    } else {
      textNode = new state.Token('pagenumber', '', 0)
      textNode.content = match.replace(/^\[pg\s*([^\]]+)]/, '$1')
      havePG = true
    }
    newChildren.push(textNode)
    return havePG
  }
  for (let i = 0; i < state.tokens.length; i++) {
    let token = state.tokens[i]
    let havePG = false
    if (token.type === 'inline') {
      newChildren = []
      nestingLevel = 0
      for (let j = 0; j < token.children.length; j++) {
        let child = token.children[j]
        if (child.type === 'link_open' || child.type === 'link_close') {
          nestingLevel += child.nesting
          newChildren.push(child)
        } else if (nestingLevel === 0 && child.type === 'text' && child.content.indexOf('[pg') !== -1) {
          havePG = child
            .content
            .split(/(\[pg\s*[^\]]+\])/)
            .filter(e => e.length)
            .map(_processChild)
            .filter(e => e).length > 0 || havePG
        } else {
          newChildren.push(child)
        }
      }
      token.children = newChildren
      if (newChildren.length === 1 && havePG &&
          i > 0 && i < state.tokens.length - 1 &&
          state.tokens[i - 1].type === 'paragraph_open' && state.tokens[i + 1].type === 'paragraph_close') {
        state.tokens.splice(i - 1, 3, newChildren[0], new state.Token('softbreak'))
        i--
      }
    }
  }
}


module.exports = function plugin(md) {

  md.renderer.rules.pagenumber = function (tokens, idx) {
    return '<a data-pg="' + tokens[idx].content + '">' + tokens[idx].content + '</a>'
  }
  md.core.ruler.push('pagenumber', addPagenumbers)
}
