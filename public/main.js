
const API_KEY = 'AIzaSyDLa-Y8sYQtEwMsS27acKPci1WHBQH_330';
let locate = "boston";
let longtitude ="", latitude = ""

//variable to hold radius for courts
//

// fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=basketball+courts+near+boston&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=' + API_KEY)


fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locate}&key=${API_KEY}`)
.then(response1 => response1.json())
.then((response1) => {
  const {lat, lng} = response1.results[0].geometry.location
  console.log(lat, lng)
  longtitude = lng;
  latitude = lat;
})
.then(() => {
  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longtitude}&radius=3000&type=park,gym,school&keyword=basketball+court&key= ${API_KEY}`)
  .then(response2 => response2.json())
  .then(response2 => {
    console.log(response2)
  })
}
)

// Promise.all([
//   fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locate}&key=${API_KEY}`),
//   fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=42.359375,-71.059227&radius=3000&type=park,gym,school&keyword=basketball+court&key= ${API_KEY}`)
// ])
// .then(response => response.json())
// .then(res => {
//   // console.log(response)
//   const {results} = response;
//   // console.log(results[0].geometry.location)
//   latitude = results[0].geometry.location.lat;
//   longtitude = results[1].geometry.location.lng
//   console.log(latitude)
// })
// .then(allResponses => {
//   allResponses => allResponses.json()
//   .then(json => {
//     console.log(json)
//     const response1 = allResponses[0]
//     console.log(allResponses.json())
//     const response2 = allResponses[1]
//     console.log(response1, response2)
//
//   })
// })
// .catch( err => {
//   console.log(err)
// })



// fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locate}&key=${API_KEY}`).then(response => response.json())
// .then(response => {
//   // console.log(response)
//   const {results} = response;
//   // console.log(results[0].geometry.location)
//   latitude = results[0].geometry.location.lat;
//   longtitude = results[0].geometry.location.lng
//   return response
// })
// .then(fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=42.359375,-71.059227&radius=3000&type=park,gym,school&keyword=basketball+court&key=' + API_KEY)
// .then(response => response.json())
// .then(json => {
//   console.log(json)
//   for (let i = 0; i < json.results.length; i++) {
//     console.log("geometry:", json.results[i].geometry.location, "\nname:", json.results[i].name, "\nphotos:", json.results[i].photos, "\nvicinity:", json.results[i].vicinity, "\nid:", json.results[i].id, "\nopening_hours:", json.results[i].opening_hours, "\ntypes:", json.results[i].types);
//   }
// })
// .then(json => console.dir(json))
// .catch(err => console.log("ERROR:", err));
// })

// fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locate}&key=${API_KEY}`)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(JSON.stringify(myJson));
//   });



//original fetch
//

// "https://maps.googleapis.com/maps/api/geocode/json?address=Winnetka&key=YOUR_API_KEY"
