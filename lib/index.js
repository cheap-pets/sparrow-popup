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

function isPopupGroup (el) {
  return el.classList.contains('dropdown-group') || el.classList.contains('popup-group')
}

function queryPopupElement (parent) {
  return parent.querySelector('.dropdown,.modal-mask,[popup]') || false
}

function queryActivePopup () {
  return document.querySelector('.dropdown.active,.active[popup]')
}

function handleEvent ({ originalEvent, originalTarget, target }) {
  let el = originalTarget || target // 需要检查弹出属性的元素
  let popup // 弹出元素
  let action // 弹出动作
  let level = 0 // 查找层级

  while (el && el !== document && el !== document.body && el.parentNode !== document) {
    // && level < 5
    action || (action = getPopupAction(el))
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
        isPopupGroup(el) && (popup = queryPopupElement(el))
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
        popEvent = 'popupshow'
        popup.classList.add('active')
        break
      case 'toggle':
        const active = popup.classList.contains('active')
        popEvent = active ? 'popuphide' : 'popupshow'
        popup.classList.toggle('active')
        break
      case 'close':
        popEvent = 'popuphide'
        popup.classList.remove('active')
        break
    }
    if (popEvent) {
      if (originalEvent) originalEvent.preventDefault()
      emitEvent(popup, popEvent)
    }
  }
}

function init ({ clickEvent = 'click' } = {}) {
  document.addEventListener(clickEvent, handleEvent)
}

// 打开对话框和关闭对话框的方法
function show (el) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  el.classList.add('active')
  emitEvent(el, 'popupshow')
}

function hide (el) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  el.classList.remove('active')
  emitEvent(el, 'popuphide')
}

export { init, show, hide }
