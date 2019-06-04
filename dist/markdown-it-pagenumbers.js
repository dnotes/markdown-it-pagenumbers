/*! markdown-it-pagenumbers 1.0.0  @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownItPagenumbers = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
