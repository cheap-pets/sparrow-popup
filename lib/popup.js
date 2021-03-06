import devq from 'sparrow-device-query'
import { dispatchCustomEvent } from './custom-event'

// 点击事件名称
const clickEvent = devq.isMobile ? 'tap' : 'click'

// 用于弹出元素的一些元素、属性名称常量
const POP_ACTION_ATTR = 'popup-action'
const POP_TARGET_ATTR = 'popup-target'
// 兼容以前的 dropdown 命名
const DD_ACTION_ATTR = 'dropdown-action'
const DD_TARGET_ATTR = 'dropdown-target'
// 兼容以前的 modal 命名
const MODAL_ACTION_ATTR = 'modal-action'
const MODAL_TARGET_ATTR = 'modal-target'

function getAction (el) {
  return (
    el.getAttribute(POP_ACTION_ATTR) ||
    el.getAttribute(DD_ACTION_ATTR) ||
    el.getAttribute(MODAL_ACTION_ATTR)
  )
}

function getTargetSelector (el) {
  return (
    el.getAttribute(POP_TARGET_ATTR) ||
    el.getAttribute(DD_TARGET_ATTR) ||
    el.getAttribute(MODAL_TARGET_ATTR)
  )
}

function isGroupElement (el) {
  let classes = el.classList
  let attr = el.getAttribute('popup-group')
  return classes.contains('dropdown-group') || classes.contains('popup-group') || attr != null
}

function queryPopup (parent) {
  return parent.querySelector('.dropdown,.modal-mask,.popup,[popup]') || false
}

function queryActivePopup () {
  return document.querySelector('.dropdown.active,.popup.active,.active[popup]')
}

// 在document对象 click 或 tap 事件中处理弹出相关动作
document.addEventListener(clickEvent, function (event) {
  // 需要检查弹出属性的元素
  let el = event.originalTarget || event.srcElement || event.target
  // 弹出元素
  let popup
  // 弹出动作
  let action
  // 查找层级
  let level = 0
  while (el && el !== document && el !== document.body && el.parentNode !== document) {
    // && level < 5
    action || (action = getAction(el))
    if (el.classList.contains('modal-mask')) {
      level === 0 && (action || (action = 'close'))
      popup = el
    } else {
      if ('disabled' in el.attributes || el.classList.contains('disabled')) {
        break
      }
      const selector = getTargetSelector(el)
      if (selector) {
        popup = document.querySelector(selector) || false
      } else {
        isGroupElement(el) && (popup = queryPopup(el))
      }
      action || (popup && (action = 'open'))
    }
    el = popup || popup === false ? null : el.parentNode
    level++
  }
  // 获取并隐藏之前弹出的元素
  let last = queryActivePopup()
  if (last && last !== popup) {
    last.classList.remove('active')
  }
  // 操作当前组内下拉元素
  if (popup) {
    let popEvent
    switch (action) {
      case 'open':
        popEvent = 'show'
        popup.classList.add('active')
        break
      case 'toggle':
        const active = popup.classList.contains('active')
        popEvent = active ? 'hide' : 'show'
        popup.classList.toggle('active')
        break
      case 'close':
        popEvent = 'hide'
        popup.classList.remove('active')
        break
    }
    if (popEvent) {
      if (event.originalEvent) event.originalEvent.preventDefault()
      dispatchCustomEvent(popup, popEvent, false, false)
    }
  }
})

// 打开对话框和关闭对话框的方法
function showPopup (el, arg) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  el.classList.add('active')
  dispatchCustomEvent(el, 'show', false, false, arg)
}
function hidePopup (el, arg) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  el.classList.remove('active')
  dispatchCustomEvent(el, 'hide', false, false, arg)
}
// 兼容老的方法名
let modalOpen = showPopup
let modalClose = hidePopup

export { showPopup, hidePopup, modalOpen, modalClose }
