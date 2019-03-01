import { emitEvent } from './emit-event'

// 用于弹出元素的一些元素、属性名称常量
const POP_ACTION_ATTR = 'popup-action'
const POP_TARGET_ATTR = 'popup-target'

function getPopupAction (el) {
  return el.getAttribute(POP_ACTION_ATTR)
}

function getTargetSelector (el) {
  return el.getAttribute(POP_TARGET_ATTR)
}

function isMaskElement (el) {
  return el.matches('.modal-mask')
}

function isGroupElement (el) {
  return el.matches('.modal-mask,.dropdown-group,popup-group')
}

function queryPopupElement (parent) {
  return parent.querySelector('.modal-mask,.dropdown,[popup]') || false
}

function queryActiveElement () {
  return document.querySelector('.modal-mask.active,.dropdown.active,[popup-state=on]')
}

const DEFAULT_OPTIONS = {
  eventType: 'click'
}

function init (options) {
  const { eventType } = {
    ...options,
    ...DEFAULT_OPTIONS
  }

  document.addEventListener(eventType, event => {
    // originalEvent & originalTarget are exported by sparrow-claw
    const { originalEvent, originalTarget, target } = event

    let el = originalTarget || target

    let action // popup action
    let group // popup group element
    let popup // popup element
    let popupSelector

    if (isMaskElement(el)) {
      popup = el
      action = getPopupAction(el) || 'close'
    } else {
      while (el && el !== document && el !== document.body) {
        if (isGroupElement(el)) {
          group = el
          popup = isMaskElement(el) ? el : queryPopupElement(el)
          action = 'none'
          break
        }
        popupSelector = popupSelector || getTargetSelector
        el = el.parentNode
      }
    }
  })
}

export { init }
