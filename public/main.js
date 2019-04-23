
const API_KEY = 'AIzaSyDLa-Y8sYQtEwMsS27acKPci1WHBQH_330';
let locate = "boston";
let longtitude ="", latitude = ""

let joinGame = document.getElementsByClassName("joinButton");
let removeMe = document.getElementsByClassName('removeMe')
let deleteGame = document.getElementsByClassName('deleteGame')

// fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=basketball+courts+near+boston&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=' + API_KEY)

fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locate}&key=${API_KEY}`)
.then(response1 => response1.json())
.then((response1) => {
  const {lat, lng} = response1.results[0].geometry.location
  // console.log(lat, lng)
  longtitude = lng;
  latitude = lat;
})
.then(() => {
  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longtitude}&radius=3000&type=park,gym,school&keyword=basketball+court&key= ${API_KEY}`)
  .then(response2 => response2.json())
  .then(response2 => {
    console.log(response2)
  })
})

Array.from(joinGame).forEach(function(element) {
      element.addEventListener('click', function(event){
        fetch('api/players', {// x is the route
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({// body property pulls thing being updated out of the body property, places it here and deletes
            "gameId": event.currentTarget.dataset.gameid,
            "userId": event.currentTarget.dataset.userid
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

Array.from(removeMe).forEach(function(element) {
  element.addEventListener('click', function(event){
    fetch('removal', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'gameId': event.currentTarget.dataset.gameid,
        'userId': event.currentTarget.dataset.userid
      })
    }).then(function(response){
      window.location.reload()
    })
  });
});

Array.from(deleteGame).forEach(function(element) {
  element.addEventListener('click', function(event){
    fetch('/api/gameDelete', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'gameId': event.currentTarget.dataset.gameid
      })
    }).then(function(response){
      window.location.reload()
    })
  });
});
