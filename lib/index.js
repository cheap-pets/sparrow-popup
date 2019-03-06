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

function setPopupState (el, action, event) {
  const isOpened = el.getAttribute(POPUP_ATTR) === 'popup'
  let popupState
  switch (action) {
    case 'open':
      if (!isOpened) popupState = 'popup'
      break
    case 'close':
      if (isOpened) popupState = ''
      break
    case 'toggle':
      popupState = isOpened ? '' : 'popup'
      break
  }
  if (popupState !== undefined) {
    if (emitEvent(el, popupState === 'popup' ? POPUP_OPEN_EVENT : POPUP_CLOSE_EVENT) !== false) {
      el.setAttribute(POPUP_ATTR, popupState)
      if (Object(event).originalTouchEvent) event.originalTouchEvent.preventDefault()
    }
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

export function init (options) {
  const { eventType } = {
    ...options,
    ...DEFAULT_OPTIONS
  }

  document.addEventListener(eventType, event => {
    // originalTouchEvent & originalTouchTarget are exported by sparrow-claw
    const target = event.originalTouchTarget || event.target

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
    if (popupEl) setPopupState(popupEl, action, event)
  })

  document.addEventListener('keyup', event => {
    if (event.keyCode === 27) {
      const popups = []
      document.querySelectorAll(POPUP_OPENED_SELECTOR).forEach(el => {
        if (!el.querySelector(POPUP_OPENED_SELECTOR)) {
          popups.push(el)
        }
      })
      popups.forEach(el => setPopupState(el, 'close'))
    }
  })
}

function isHTMLElement (target) {
  return target instanceof HTMLElement
}

function isString (target) {
  return Object.prototype.toString.call(target).toLowerCase() === '[object string]'
}

function queryTarget (target) {
  return isHTMLElement(target)
    ? target
    : (isString(target) ? document.querySelector(target) : null)
}

export function show (target) {
  const el = queryTarget(target)
  if (el && emitEvent(el, POPUP_OPEN_EVENT) !== false) el.setAttribute('sparrow-popup', 'popup')
}

export function hide (target, forceHide) {
  const el = queryTarget(target)
  if (el && el.getAttribute('sparrow-popup') !== undefined &&
    (emitEvent(el, POPUP_CLOSE_EVENT) !== false || forceHide)) el.setAttribute('sparrow-popup', 'popup')
}
