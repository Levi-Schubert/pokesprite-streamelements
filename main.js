//global setting variables need to be defined as to not cause nullpointer errors
let totalEvents = 0,
    imgHeight = 200,
    xPosition = 0,
    yPosition = 0,
    fadeoutTime = 999,
    pokeLoaded = true,
    pokeList = [],
    pokeFuzz = null,
    pokeId = [],
    pokeMap = new Map(),
    defaultPokemon = "eevee",
    widgetAuthor = "aMiniCthulhu",
    widgetName = "Drifting Sands - Pokemon Redemption";


window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }

    var pokemon = checkForPokemonAndGetName(obj.detail)

    if (pokemon !== null && pokeLoaded) {
        addEvent(pokemon);
    }
});

window.addEventListener('onWidgetLoad', function (obj) {

    const fieldData = obj.detail.fieldData;
    imgHeight = fieldData.imgHeight;
    xPosition = fieldData.xPosition;
    yPosition = fieldData.yPosition;
    fadeoutTime = fieldData.fadeoutTime;
    defaultPokemon = fieldData.defaultPokemon;
    showDebug = fieldData.showDebug;
  
  
  	// Creates random pokemon is random is the default
  	if (defaultPokemon == 'random') {
    const characters ='abcdefghijklmnopqrstuvw'
    let output = '';
    for (let i = 0; i < 6; i++) {
        output += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    defaultPokemon = output
    let elem = document.querySelector('.main-container')
    const a = document.createElement('span')
    a.innerHTML = defaultPokemon
    elem.appendChild(a)
    }
  
    try{
        pokeLoaded = loadPokemonList(fieldData.acceptedPokemon);
        pokeFuzz = FuzzySet(pokeList);
    }catch(ex){
        if(showDebug){
            let elem = document.querySelector('.error');
            elem.prepend(`<p class="debug"> ${ex.toString()}</p>`);
        }
    }

    if (pokeLoaded) {
        addEvent(defaultPokemon);
    }
    
});


function addEvent(pokemon) {
    totalEvents += 1; //increment global event ID counter
    let element;
    let elem = document.querySelector('.main-container');

    let pokeImg = findMatch(pokemon);//findMatch("text");
    if(pokeImg != undefined){
      	element = buildPokemonElement(pokeImg);
      	if (totalEvents >= 1){
        	elem.innerHTML = "";
      	}
      	elem.innerHTML = elem.innerHTML + element;
		if (fadeoutTime !== 999) {
            $('.main-container').addClass("fadeOutClass");
        }
    }
}


function checkForPokemonAndGetName(data){

	try{
		if(data.event.data.tags["custom-reward-id"] == "6da39422-72c1-4811-b113-bb572a95f97d" && data.event.renderedText){
			if(data.event.renderedText.length > 0){
					return data.event.renderedText;
			}
		}
	}catch(ex){
		return null;
	}
    return null;
}

function findMatch(text){
    let match = "",
    	closest = "",
        multiWordClosest = "";
 	let elem = document.querySelector('.error');
    
  	if(pokeFuzz != null){ //if fuzzy list loaded
      	if(text.split(" ").length > 1){
       		let word = text.split(" ")[0];
          	let words = text.split(" ")[0] + text.split(" ")[1];
       		closest = pokeFuzz.get(word);
          	multiWordClosest = pokeFuzz.get(words);
          	if(closest != null && closest.length >= 1 && multiWordClosest != null && multiWordClosest.length >= 1){
              if(closest[0][0] > multiWordClosest[0][0]){
              	match = closest[0][1];
              }else{
              	match = multiWordClosest[0][1];
              }

            }
      	}else{
         	closest = pokeFuzz.get(text);
	       	if(closest != null && closest.length >= 1){
				match = closest[0][1]
            }
        }

      	if(match != "" && match.length > 0){
	        let index = pokeList.indexOf(match);
          	if(index > -1){
              return pokeId[index];
            }
        }
        return undefined;
        
    }else{
    	closest = pokeList.indexOf(text.toLowerCase());
  
    	if(closest > -1 ){
        	match = pokeId[closest]
    	}
      
    	if(closest > -1 && match != undefined){
    	    return match;
	    }else{
        	if(showDebug){
            	let elem = document.querySelector('.error');
            	elem.prepend(`<p class="debug">ERROR: ${text.toLowerCase()} not found.</p>`);
        	}
        	return undefined;
    	}
    }
}

function loadPokemonList(src){
    let templist = src;
    if(templist){
        if(templist.length > 0){
            let splitArr = templist.split('|');
            let map = document.querySelector(".map")
            splitArr.forEach(data => {
                let name="", id="", split;
                split = data.split(',')
                if(split.length > 0){
                    name = split[0];
                    id = split[1];
                }

                if(name != "" && id != ""){
                    pokeList.push(name.toLowerCase());
                  	pokeId.push(id)
                }
            });
          	
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
    
}

function buildPokemonElement(id){
    let element = `<div class="poke-container" id="event-${totalEvents}">
        <img class="poke-img" src="https://www.pokencyclopedia.info/sprites/spin-off/ani_md-rt/ani_mdrt_${id}_ss.gif"}" />
    </div>`;

    return element;
}



