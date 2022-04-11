const user = <%= user %>

io(user)

window.onscroll = () => {
  if (document.body.scrollHeight - window.scrollY === document.body.offsetHeight) {
    document.getElementById('scrollButton').style.visibility = 'hidden'
  } else document.getElementById('scrollButton').style.visibility = 'visible'
}

window.onload = () => {
  window.scroll({
    left: 0,
    top: document.body.scrollHeight,
    behavior: 'auto'
  })
  document.getElementById('scrollButton').style.visibility = 'hidden'
}
