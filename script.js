var timer = 0;

localStorage.setItem("playerList", "");
localStorage.setItem("resultA", 0);
localStorage.setItem("resultB", 0);
localStorage.setItem("wordsDone", "");
localStorage.setItem("wordsSkip", "");
localStorage.setItem("teamA", "");
localStorage.setItem("teamB", "");
localStorage.setItem("currentPlayerA", 0);
localStorage.setItem("currentPlayerB", 0);
localStorage.setItem("currentTeam", "");
localStorage.setItem("wordsInGame", "");

/*Утилитарные функции*/

window.onbeforeunload = function() {
	return true;
};

function localWriteArray(localKey, array) {
	var string = "";
	for (var i = 0; i < array.length; i++) {
		if (i == 0) {
			string = array[i];
		} else {
			string = string + "," + array[i];
		}
	}
	localStorage.setItem(localKey, string);
}

function localReadArray(localKey) {
	var array = localStorage.getItem(localKey).split(',');
	if (array[0] == "") {
		array.splice(0, 1);
	}
	return array;
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function isDuplicated(array, item) {
	var result = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i] == item) {
			result = true;
		}
	}
	return result;
}

function hasComma(string) {
	var result = false;
	for (var i = 0; i < string.length; i++) {
		if (string[i] == ",") {
			result = true;
		}
	}
	return result;
}

function screenSwitch(lastScreen, nextScreen) {
	document.getElementById(lastScreen).hidden = true;
	document.getElementById(nextScreen).hidden = false;
}

/*Основные функции*/

function addPlayerToList() {
	var player = document.getElementById("player").value;
	var playerList = localReadArray("playerList");

	if ((playerList.length < 8)
		&& (player != "")
		&& !isDuplicated(playerList, player)
		&& !hasComma(player)) {
			playerList.push(player);

			var newPlayer = document.createElement("li");
			var deleteButton = document.createElement("a");
			var id = playerList.length - 1;

			document.getElementById("nextButton").hidden = false;

			newPlayer.innerHTML = player;
			newPlayer.id = id;

			deleteButton.href = "#";
			deleteButton.innerText = "[X]";
			deleteButton.onclick = function() {
				var id = this.parentNode.id;
				var playerList = localReadArray("playerList");
				playerList.splice(id, 1);
				this.parentNode.remove();
				localWriteArray("playerList", playerList);

				if (id < playerList.length) {
					for (var i = parseInt(id) + 1; i <= playerList.length; i++) {
						document.getElementById(i).id = parseInt(document.getElementById(i).id) - 1;
					}
				}

				if (playerList.length == 0) {
					document.getElementById("nextButton").hidden = true;
				}
			}

			document.getElementById("playerList").append(newPlayer);
			document.getElementById(id).appendChild(deleteButton);
			document.getElementById("player").value = "";
			document.getElementById("player").focus();

			localWriteArray("playerList", playerList);

	} else if (playerList.length >= 8) {
		alert("Максимум 8 игроков");

	} else if (player == "") {
		alert("Имя не введено");

	} else if (isDuplicated(playerList, player)) {
		alert("Имя не уникально");

	} else if (hasComma(player)) {
		alert("В имени не должно быть запятых");
	}
}

function addPlayerToTeamList(team, id) {
	for (i = 0; i < team.length; i++) {
		var newPlayer = document.createElement("li");
		newPlayer.innerHTML = team[i];
		document.getElementById(id).append(newPlayer);
	}
}

function teamAssign() {
	var playerList = localReadArray("playerList");
	var teamA = [];
	var teamB = [];
	var playerPool = playerList.slice();

	if (playerPool.length > 3) {
		while (playerPool.length != 0) {
			rand = randomInteger(0, playerPool.length - 1);
			teamA.push(playerPool[rand]);
			playerPool.splice(rand, 1);
			if (playerPool.length != 0){
				rand = randomInteger(0, playerPool.length - 1);
				teamB.push(playerPool[rand]);
				playerPool.splice(rand, 1);
			}
		}

		localWriteArray("teamA", teamA);
		localWriteArray("teamB", teamB);

		addPlayerToTeamList(teamA, "teamAList");
		addPlayerToTeamList(teamB, "teamBList");

		screenSwitch("input", "teams")

		localStorage.setItem('stage', 1);

	} else {
		alert("Слишком мало игроков");
	}


}

function wordsShuffle() {
	var playerList = localReadArray("playerList");
	var wordsArray = wordsString.split(',');
	var cardCount = playerList.length * 10;
	var wordsInGame = [];
	for (var i = 0; i < cardCount; i++) {
		rand = randomInteger(0, parseInt(wordsArray.length) - 1);
		wordsInGame.push(wordsArray[rand]);
		wordsArray.splice(rand, 1);
	}
	localWriteArray("wordsInGame", wordsInGame);
}

function startGame() {
	localStorage.setItem("wordsDone", "");
	localStorage.setItem("wordsSkip", "");
	localStorage.setItem("resultA", "0");
	localStorage.setItem("resultB", "0");
	localStorage.setItem("currentPlayerA", "0");
	localStorage.setItem("currentPlayerB", "0");

	if (randomInteger(0, 1) == 0) {
		localStorage.setItem("currentTeam", "teamA");
	} else {
		localStorage.setItem("currentTeam", "teamB");
	}

	wordsShuffle();
	preRound ();

	screenSwitch("teams", "method")
	localStorage.setItem('stage', 2);
}

function preRound () { //вводная перед началом раунда
	var textString = "";
	var method = randomInteger(0, 2);
	var teamA = localReadArray("teamA");
	var teamB = localReadArray("teamB");

	localStorage.setItem("wordsDone", "");
	localStorage.setItem("wordsSkip", "");

	if (method == 0) { //случайный выбор способа объяснения
		method = "объясняет словами.";
	} else if (method == 1) {
		method = "объясняет жестами.";
	} else if (method = 2) {
		method = "объясняет рисунками.";
	}

	if (localStorage.getItem("currentTeam") == "teamA") { //текст для команды А
		document.getElementById("currentPlayer").innerText = teamA[parseInt(localStorage.getItem("currentPlayerA"))];
		document.getElementById("currentTeam").innerText = "Красивые";
		document.getElementById("gameMethodText").innerText = method;

		document.getElementById("currentPlayer").style.background = "#FFD6DD";
		document.getElementById("currentTeam").style.background = "#FFD6DD";

	} else if (localStorage.getItem("currentTeam") == "teamB") { //текст для комнды Б
		document.getElementById("currentPlayer").innerText = teamA[parseInt(localStorage.getItem("currentPlayerA"))];
		document.getElementById("currentTeam").innerText = "Умные";
		document.getElementById("gameMethodText").innerText = method;

		document.getElementById("currentPlayer").style.background = "#C4D0FB";
		document.getElementById("currentTeam").style.background = "#C4D0FB";
	}


}

function startRound() { //запуск раунда
	var wordsInGame = localReadArray("wordsInGame");

	screenSwitch("method", "round")
	document.getElementById("word").innerText = wordsInGame[0];
	document.getElementById("timer").innerText = "60";

	var timer = setTimeout(secondsCount, 1000);

}

function secondsCount() { //обратный отсчет
	document.getElementById("timer").innerText = parseInt(document.getElementById("timer").innerText) - 1;
	if (document.getElementById("timer").innerText > "0") {
		timer = setTimeout(secondsCount, 1000);
	} else {
		endRound();
	}
}

function done() { //если слово угадано
	var wordsInGame = localReadArray("wordsInGame");
	var wordsDone = localReadArray("wordsDone");

	if (wordsInGame.length > 1) {
		wordsDone.push(wordsInGame[0]);
		wordsInGame.splice(0, 1);

		localWriteArray("wordsDone", wordsDone);
		localWriteArray("wordsInGame", wordsInGame);
		document.getElementById("word").innerText = wordsInGame[0];

	} else if (wordsInGame.length == 1) {
		wordsDone.push(wordsInGame[0]);
		wordsInGame.splice(0, 1);

		localWriteArray("wordsDone", wordsDone);
		localWriteArray("wordsInGame", wordsInGame);

		endRound();
	}
	localStorage.setItem('stage', 3);
}

function skip() { //если слово пропущено
	var wordsInGame = localReadArray("wordsInGame");
	var wordsSkip = localReadArray("wordsSkip");

	if (wordsInGame.length > 1) {
		wordsSkip.push(wordsInGame[0]);
		wordsInGame.splice(0, 1);

		localWriteArray("wordsSkip", wordsSkip);
		localWriteArray("wordsInGame", wordsInGame);
		document.getElementById("word").innerText = wordsInGame[0];

	} else if (wordsInGame.length == 1) {
		wordsSkip.push(wordsInGame[0]);
		wordsInGame.splice(0, 1);

		localWriteArray("wordsSkip", wordsSkip);
		localWriteArray("wordsInGame", wordsInGame);

		endRound();
	}
	localStorage.setItem('stage', 3);
}

function endRound () {
	clearTimeout(timer);
	var wordsArray = localReadArray("wordsInGame");
	var wordsDone = localReadArray("wordsDone");
	var wordsSkip = localReadArray("wordsSkip")

	document.getElementById("doneList").innerHTML = "";
	document.getElementById("skipList").innerHTML = "";

	screenSwitch("round", "result")

	if (wordsDone.length > 0) {
		document.getElementById("doneWords").hidden = false;
	} else {
		document.getElementById("doneWords").hidden = true;
	}

	if (wordsSkip.length > 0) {
		document.getElementById("skipWords").hidden = false;
	} else {
		document.getElementById("skipWords").hidden = true;
	}



	for (var i = 0; i < wordsDone.length; i++) {
		if (wordsDone[i] != "") {
			var word = document.createElement("li");
			word.innerHTML = wordsDone[i];
			document.getElementById("doneList").append(word);
		}
	}

	for (var i = 0; i < wordsSkip.length; i++) {
		if (wordsSkip[i] != "") {
			var word = document.createElement("li");
			word.innerHTML = wordsSkip[i];
			document.getElementById("skipList").append(word);
		}
	}

	if (localStorage.getItem("currentTeam") == "teamA") {
		localStorage.setItem("resultA", parseInt(localStorage.getItem("resultA")) + parseInt(wordsDone.length) - parseInt(wordsSkip.length));
		localStorage.setItem("wordsDone", "");
		localStorage.setItem("wordsSkip", "");
		localStorage.setItem("currentTeam", "teamB");

		if (localStorage.getItem("currentPlayerA") == (parseInt(localReadArray("teamA").length) - 1)) {
			localStorage.setItem("currentPlayerA", "0");

		} else {
			localStorage.setItem("currentPlayerA", parseInt(localStorage.getItem("currentPlayerA")) + 1);
		}

	} else if (localStorage.getItem("currentTeam") == "teamB") {
		localStorage.setItem("resultB", parseInt(localStorage.getItem("resultB")) + parseInt(wordsDone.length)  - parseInt(wordsSkip.length));
		localStorage.setItem("wordsDone", "");
		localStorage.setItem("wordsSkip", "");
		localStorage.setItem("currentTeam", "teamA");

		if (localStorage.getItem("currentPlayerB") == (parseInt(localReadArray("teamB").length) - 1)) {
			localStorage.setItem("currentPlayerB", "0");

		} else {
			localStorage.setItem("currentPlayerB", parseInt(localStorage.getItem("currentPlayerB")) + 1);
		}
	}
	localStorage.setItem('stage', 4);
}

function nextRound() {
	if (localStorage.getItem("wordsInGame") != "") {
		screenSwitch("result", "method")
		preRound();
	} else {
		screenSwitch("result", "gameover")
		gameOver();
		localStorage.setItem('stage', 4);
	}
}

function gameOver() {
	var text = "";
	if (parseInt(localStorage.getItem("resultA")) > parseInt(localStorage.getItem("resultB"))) {
		text = "Со счетом " + localStorage.getItem("resultA") + ":" + localStorage.getItem("resultB") + "<br>побеждает команда";
		document.getElementById("score").innerHTML = text;
		document.getElementById("winner").innerText = "Красивые";
		document.getElementById("winner").style.background = "#FFD6DD";

	} else if (parseInt(localStorage.getItem("resultA")) < parseInt(localStorage.getItem("resultB"))) {
		text = "Со счетом " + localStorage.getItem("resultB") + ":" + localStorage.getItem("resultA") + "<br>побеждает команда";
		document.getElementById("score").innerHTML = text;
		document.getElementById("winner").innerText = "Умные";
		document.getElementById("winner").style.background = "#C4D0FB";
	} else if (parseInt(localStorage.getItem("resultA")) == parseInt(localStorage.getItem("resultB"))) {
		text = "Ничья со счетом " + localStorage.getItem("resultA") + ":" + localStorage.getItem("resultB");
		document.getElementById("winner").hidden = true;
	}



}

function newGame() {
	screenSwitch("gameover", "input")
	document.getElementById("playerList").innerHTML = "";
	document.getElementById("teamAList").innerHTML = "";
	document.getElementById("teamBList").innerHTML = "";
	localStorage.setItem("playerList", "");
	localStorage.setItem('stage', 0);
}
