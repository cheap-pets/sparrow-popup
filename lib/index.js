import emitEvent from './emit-event'

// 用于弹出元素的一些元素、属性名称常量
const POPUP_ATTR = 'sparrow-popup'
const POPUP_ACTION_ATTR = 'popup-action'
const POPUP_TARGET_ATTR = 'popup-target'

const POPUP_SELECTOR = `[${POPUP_ATTR}]`
const POPUP_OPENED_SELECTOR = `[${POPUP_ATTR}=popup]`

const POPUP_OPEN_EVENT = 'popupopen'
const POPUP_CLOSE_EVENT = 'popupclose'

const DEFAULT_OPTIONS = {
  eventType: 'click'
}

function getPopupAction (el) {
  return el.getAttribute(POPUP_ACTION_ATTR)
}

function getPopupTarget (el) {
  const selector = el.getAttribute(POPUP_TARGET_ATTR)
  return selector ? document.querySelector(selector) : undefined
}

function isMaskElement (el) {
  return el.matches('.modal-mask, [sparrow-popup-mask]')
}

function isPopupElement (el) {
  return el.matches(POPUP_SELECTOR)
}

function setPopupState (el, action, originalEvent) {
  let popupEvent
  switch (action) {
    case 'open':
      el.setAttribute(POPUP_ATTR, 'popup')
      popupEvent = POPUP_OPEN_EVENT
      break
    case 'close':
      el.setAttribute(POPUP_ATTR, '')
      popupEvent = POPUP_CLOSE_EVENT
      break
    case 'toggle':
      const isOpened = el.getAttribute(POPUP_ATTR) === 'popup'
      el.setAttribute(POPUP_ATTR, isOpened ? '' : 'popup')
      popupEvent = isOpened ? POPUP_CLOSE_EVENT : POPUP_OPEN_EVENT
      break
  }
  if (popupEvent) {
    if (originalEvent) originalEvent.preventDefault()
    emitEvent(el, popupEvent)
  }
}

function whileParent (el, callbackFn) {
  // this loop will handle the initial el
  while (el && el !== document && el !== document.body) {
    if (callbackFn(el) === false) return false
    el = el.parentNode
  }
}

function deactiveOthers (popupEl) {
  document.querySelectorAll(POPUP_OPENED_SELECTOR).forEach(otherEl => {
    const ignore = whileParent(popupEl, el => el !== otherEl) === false
    if (!ignore) setPopupState(otherEl, 'close')
  })
}

function init (options) {
  const { eventType } = {
    ...options,
    ...DEFAULT_OPTIONS
  }

  document.addEventListener(eventType, event => {
    // originalEvent & originalTarget are exported by sparrow-claw
    let { originalEvent, originalTarget, target } = event
    target = originalTarget || target

    let action
    let popupEl

    if (isMaskElement(target)) {
      popupEl = target
      action = getPopupAction(target) || 'close'
    } else {
      whileParent(target, el => {
        if (isPopupElement(el)) {
          popupEl = el
          action = action || getPopupAction(el) || 'none'
        }
        if (!action) {
          action = getPopupAction(el)
          if (action) popupEl = getPopupTarget(el)
        }
        if (popupEl) return false
      })
    }
    deactiveOthers(popupEl)
    if (popupEl) setPopupState(popupEl, action, originalEvent)
  })
}

export { init }
