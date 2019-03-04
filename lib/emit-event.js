export function emitEvent (el, eventName, canBubble = false, cancelable = false) {
  let event = document.createEvent('CustomEvent')
  event.initCustomEvent(eventName, canBubble, cancelable)
  el.dispatchEvent(event)
}
