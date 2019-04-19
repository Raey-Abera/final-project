document.getElementById("addPlayerInput").addEventListener('click', function(){
  var input = document.createElement('input');
  input.className += "playerInput"
  input.type = "text"
  input.placeholder = "players"
  input.name = "players[]"
  console.log('yo')

  var firstInputTag = document.getElementsByClassName('playerInput')[0];
  firstInputTag.parentNode.insertBefore(input, firstInputTag);
})

console.log('hello')
