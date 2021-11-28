var timer = 0;
var wordsString = "Австралия,автомат,агент,адвокат,Азия,акт,альбом,Альпы,Америка,амфибия,ангел,Англия,Антарктида,аппарат,Атлантида,Африка,ацтек,бабочка,база,Байкал,банк,баня,бар,барьер,бассейн,батарея,башня,берёза,Берлин,Бермуды,билет,биржа,блин,блок,боевик,бокс,болезнь,больница,бомба,боров,борт,ботинок,бочка,брак,бревно,бумага,бутылка,бык,вагон,вал,ведьма,век,венец,вертолёт,верфь,вес,ветер,взгляд,вид,вилка,вирус,вода,водолаз,вождь,воздух,война,волна,вор,время,высота,газ,галоп,гвоздь,гений,Германия,гигант,глаз,Голливуд,голова,горло,горн,гранат,гребень,Греция,гриф,груша,дама,декрет,день,десна,динозавр,диск,доктор,дракон,дробь,дума,дух,дыра,дятел,Европа,Египет,единорог,ёрш,жизнь,жила,жук,журавль,залог,замок,заноза,запад,запах,заяц,звезда,зебра,земля,знак,золото,зона,зуб,игла,игра,икра,Индия,институт,кабинет,кавалер,кадр,казино,камень,камера,канал,караул,карлик,карта,каша,кенгуру,кентавр,кетчуп,киви,кисть,кит,Китай,клетка,ключ,кокетка,кол,колода,колонна,кольцо,команда,конёк,контрабандист,концерт,кора,корабль,королева,король,корона,коса,кость,косяк,кошка,край,кран,крест,кролик,крошка,круг,крыло,кулак,курс,лад,лазер,лама,ласка,лев,лёд,лейка,лес,лимузин,линия,липа,лист,лицо,ложе,Лондон,лошадь,лук,луна,луч,масло,масса,мат,машина,мёд,медведь,Мексика,мелочь,место,механизм,микроскоп,миллионер,мир,морковь,мороженое,Москва,мост,мотив,мушка,мышь,налёт,наряд,небоскрёб,ниндзя,нож,номер,норка,нота,ночь,НьюЙорк,няня,область,облом,образ,образование,обрез,овсянка,огонь,Олимп,опера,операция,орган,орёл,осьминог,отель,падение,палата,палец,палочка,панель,пара,парашют,парк,партия,пассаж,паук,пачка,Пекин,перевод,перемена,перо,перчатка,пилот,пингвин,пирамида,пират,пистолет,плата,платье,площадь,пляж,побег,повар,подкова,подъём,покров,пол,поле,полис,полиция,помёт,порода,посольство,поток,почка,пояс,право,предложение,предприниматель,прибор,привод,призрак,принцесса,пришелец,пробка,проводник,проказа,прокат,проспект,профиль,путь,Пушкин,развод,разворот,рак,раковина,раствор,рейд,Рим,робот,рог,род,рок,рубашка,рукав,рулетка,рыба,рысь,рыцарь,салют,сантехник,Сатурн,свет,свидетель,секрет,секция,сердце,сеть,сила,скат,смерть,снаряд,снег,снеговик,собака,совет,солдат,соль,состав,спутник,среда,ссылка,стадион,стан,станок,ствол,стекло,стена,стойка,стол,стопа,стрела,строй,струна,стул,ступень,судьба,супергерой,такса,танец,тарелка,театр,телескоп,течение,титан,Токио,точка,трава,треугольник,труба,туба,тур,ударник,удел,узел,урал,урна,утка,утконос,учёный,учитель,факел,фаланга,фига,флейта,фокус,форма,Франция,хвост,хлопок,центр,церковь,частица,червь,шар,шоколад,шпагат,шпион,штат,шуба,экран,эльф,эфир,Юпитер,яблоко,яд,язык,якорь,ясли";

localStorage.setItem("playerList", "");
localStorage.setItem('stage', 0);
document.getElementById("player").value = "";

/*Утилитарные функции*/

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

		document.getElementById("input").hidden = true;
		document.getElementById("teams").hidden = false;

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
	document.getElementById("teams").hidden = true;
	document.getElementById("method").hidden = false;
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
		textString = teamA[parseInt(localStorage.getItem("currentPlayerA"))] + " из команды А " + method;
	} else if (localStorage.getItem("currentTeam") == "teamB") { //текст для комнды Б
		textString = teamB[parseInt(localStorage.getItem("currentPlayerB"))] + " из команды Б " + method;
	}

		document.getElementById("gameMethodText").innerText = textString;
}

function startRound() { //запуск раунда
	var wordsInGame = localReadArray("wordsInGame");

	document.getElementById("method").hidden = true;
	document.getElementById("round").hidden = false;
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

	document.getElementById("round").hidden = true;
	document.getElementById("result").hidden = false;

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
		document.getElementById("result").hidden = true;
		document.getElementById("method").hidden = false;
		preRound();
	} else {
		document.getElementById("result").hidden = true;
		document.getElementById("gameover").hidden = false;
		gameOver();
		localStorage.setItem('stage', 4);
	}
}

function gameOver() {
	var text = "";
	if (parseInt(localStorage.getItem("resultA")) > parseInt(localStorage.getItem("resultB"))) {
		text = "Со счетом " + localStorage.getItem("resultA") + ":" + localStorage.getItem("resultB") + " побеждает команда А";

	} else if (parseInt(localStorage.getItem("resultA")) < parseInt(localStorage.getItem("resultB"))) {
		text = "Со счетом " + localStorage.getItem("resultB") + ":" + localStorage.getItem("resultA") + " побеждает команда Б";

	} else if (parseInt(localStorage.getItem("resultA")) == parseInt(localStorage.getItem("resultB"))) {
		text = "Ничья со счетом " + localStorage.getItem("resultA") + ":" + localStorage.getItem("resultB");
	}

	document.getElementById("score").innerText = text;

}

function newGame() {
	document.getElementById("gameover").hidden = true;
	document.getElementById("input").hidden = false;
	document.getElementById("playerList").innerHTML = "";
	document.getElementById("teamAList").innerHTML = "";
	document.getElementById("teamBList").innerHTML = "";
	localStorage.setItem("playerList", "");
	localStorage.setItem('stage', 0);
}
