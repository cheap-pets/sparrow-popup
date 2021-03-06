import devq from 'sparrow-device-query'
import { modalOpen } from './popup'

// 点击事件名称
const clickEvent = devq.isMobile ? 'tap' : 'click'

// 消息对话框
let sysDialog
let callbackHandler
function createSysDialog () {
  if (sysDialog) return
  let el = document.createElement('div')
  el.className = 'modal-mask'
  el.innerHTML =
    '<div class="dialog">' +
    '<div class="dialog-header"><span></span><a class="dialog-close-btn" modal-action="close"></a></div>' +
    '<div class="dialog-body"><div class="dialog-message" style="padding: 10px;"></div></div>' +
    '<div class="dialog-footer">' +
    '<a class="btn btn-primary btn-ok" modal-action="close">确定</a>' +
    '<a class="btn ' + (devq.isMobile ? 'btn-link' : 'btn-outline') + ' btn-cancel" modal-action="close">取消</a>' +
    '</div>' +
    '</div>'
  document.body.appendChild(el)
  el.addEventListener(clickEvent, function (event) {
    if (!callbackHandler) return
    let eventEl = event.originalTarget || event.srcElement || event.target
    let cls = eventEl.classList
    let act
    if (
      cls.contains('modal-mask') ||
      cls.contains('btn-cancel') ||
      cls.contains('dialog-close-btn')
    ) {
      act = 'cancel'
    } else if (cls.contains('btn-ok')) {
      act = 'ok'
    }
    if (act) callbackHandler(act)
  })
  sysDialog = el
}

function showDialog (messageType, message, callback) {
  if (!sysDialog) createSysDialog()
  let h = sysDialog.querySelector('.dialog-header>span')
  let btnOk = sysDialog.querySelector('.btn-ok')
  let btnCancel = sysDialog.querySelector('.btn-cancel')
  callbackHandler = callback
  switch (messageType) {
    case 'alert':
      h.innerText = '提示'
      btnOk.className = 'btn btn-primary btn-ok'
      btnCancel.classList.add('hidden')
      break
    case 'confirm':
      h.innerText = '确认提示'
      btnOk.className = 'btn btn-primary btn-ok'
      btnCancel.classList.remove('hidden')
      break
    case 'warn':
      h.innerText = '确认警告'
      btnOk.className = 'btn btn-negative btn-ok'
      btnCancel.classList.remove('hidden')
      break
  }
  sysDialog.querySelector('.dialog-message').innerText = message
  modalOpen(sysDialog)
}

// 快速浮动消息
let sysMessagePanel
let floatTimer
function createSysMessagePanel () {
  if (sysMessagePanel) return
  let el = document.createElement('div')
  el.className = 'float-message'
  document.body.appendChild(el)
  sysMessagePanel = el
}

function quickMessage (message, type) {
  if (!sysMessagePanel) createSysMessagePanel()
  sysMessagePanel.innerText = message
  let cls = 'float-message active ' + type
  sysMessagePanel.className = cls
  if (floatTimer) clearTimeout(floatTimer)
  floatTimer = setTimeout(() => {
    sysMessagePanel.className = 'float-message'
  }, 2500)
}

if (document.body) {
  createSysDialog()
  createSysMessagePanel()
} else {
  window.addEventListener('load', function () {
    createSysDialog()
    createSysMessagePanel()
  })
}

export function alert (message, callback) {
  showDialog('alert', message, callback)
}
export function confirm (message, callback) {
  showDialog('confirm', message, callback)
}
export function warn (message, callback) {
  showDialog('warn', message, callback)
}
export function showMessage (message, type) {
  quickMessage(message, type || 'info')
}
