window.onload = function(){
  var PRIV_KEY = "2c8d5833e87dc4cbd8548681f5b17e317150f69e";
  var API_KEY = "bf6dd07d4882ac98e389863aafd0ac0c";
  var ts = new Date().getTime();
  var url = "http://gateway.marvel.com/v1/public/characters?apikey=" + API_KEY;
  var hash = md5(ts + PRIV_KEY + API_KEY);
  url += "&ts="+ts+"&hash="+hash;
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(){
    if(request.status === 200){
      var jsonString = request.responseText;
      var characters = JSON.parse(jsonString);
      console.log(getData(characters.data.results));
      main(characters.data.results);
      new PieChart(getData(characters.data.results));
    }
  }
  request.send(null);
}
var md5 = function(value) {
    return CryptoJS.MD5(value).toString();
}



var main = function (charas) {
    populateSelect(charas);
    var cached = localStorage.getItem("selectedChara");
    var selected = charas[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#charas').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (charas) {
    var parent = document.querySelector('#charas');
    charas.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var chara = charas[index];
        updateDisplay(chara);
        localStorage.setItem("selectedChara",JSON.stringify(chara));
    });
}

var updateDisplay = function (chara) {

    var thumb = document.querySelector('#thumbnail img')
    var button = document.querySelector('#button')
    // var apple = document.querySelector('#apple')
    thumb.src = chara.thumbnail.path + "/standard_xlarge." + chara.thumbnail.extension
    // button.onclick = + chara.urls[0].url
    button.innerText = chara.name;
    // console.log(button);
    var tags = document.querySelectorAll('#info p');
    tags[2].innerText = null;
    var items = chara.comics.items
    // console.log(chara);
    // console.log(chara.urls[0]);
    tags[0].innerText = chara.name;
    // tags[1].innerText = " "
    for (var i = 0; i < items.length; i++) {
      tags[2].innerText += items[i].name + "\n";
    }

    tags[1].innerText = chara.urls[0].url
}

var PieChart = function(characters) {
  var container = document.getElementById('pieChart');

  var chart = new Highcharts.Chart({
    chart: {type: 'pie', renderTo: container},
    title: {text: 'Comic appearances'},
    series: [
      {
        name: "appearance",
        data: characters    
      }
    ]
  })
}

var getData = function(characters) {
  y = []
  for (var i = 0; i < characters.length; i++) {
    var voo = {name: characters[i].name, y: characters[i].stories.items.length}
    y.push(voo);
    // console.log(characters[i].stories.items.length);
  }
  // console.log(y);
  return y

}
