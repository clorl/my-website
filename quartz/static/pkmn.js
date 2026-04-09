document.addEventListener("nav", function() {
	const ENDPOINT = "https://pokeapi.co/api/v2/";
	function log(t, c="") {
		pkmnLog.innerText = t;
		if (c) {
			pkmnLog.style.color = c;
		} else {
			pkmnLog.style.color = "inherit";
		}
	}

	pkmnSubmit.onclick = async e => {
		const name = pkmnName.value.trim().toLowerCase();
		if (!pkmnName) return log("You didn’t give me a Pokémon name", "red");
		try {
			const response = await fetch(`${ENDPOINT}pokemon/${name}`); 
			
			if (response.status === 404) return log(`I cannot find any Pokémon named ${pkmnName}, try another one`, "red");
			if (response.status === 408) return log("The server took too long to respond so it stopped to request, too bad.");
			if (response.status === 413) return log("The Pokémon name you gave exceeds the max length allowed for a request!");
			if (response.status === 429) return log("The API server thinks you’re doing too many requests, so it won’t respond anymore");
			if (response.status >= 500) return log("The API server has a problem and cannot respond");
			if (response.status >= 400) return log("There was an error but I don’t know what it was", "red");
			
			const data = await response.json();
			const { height, weight, types, moves } = data;

      // Fix the ternary (?) and the nested data access (.type.name)
      const typeLabel = types.length > 1 ? "types are" : "type is";
      const typeList = types.map(t => t.type.name).join(", ");
        
      // Use the 'moves' array, not 'types'
      const randomMove = moves.sort(() => 0.5 - Math.random())[0].move.name;

      log(`\n${pkmnName.value} has a height of ${height * 10}cm and weighs ${weight / 10.0}kg. Its ${typeLabel} ${typeList}. One of the moves it can learn is ${randomMove}.`);
		} catch (e) {
			log(`There was an error when requesting the API. Usually this is handled properly by the developer behind your back. Here is the error that I received: ${e.message}`, "red");
		}
	};
});
