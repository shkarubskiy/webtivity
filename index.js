var playerList = [];
var teamA = [];
var teamB = [];

var wordsString = "Австралия,автомат,агент,адвокат,Азия,акт,альбом,Альпы,Америка,амфибия,ангел,Англия,Антарктида,аппарат,Атлантида,Африка,ацтек,бабочка,база,Байкал,банк,баня,бар,барьер,бассейн,батарея,башня,берёза,Берлин,Бермуды,билет,биржа,блин,блок,боевик,бокс,болезнь,больница,бомба,боров,борт,ботинок,бочка,брак,бревно,бумага,бутылка,бык,вагон,вал,ведьма,век,венец,вертолёт,верфь,вес,ветер,взгляд,вид,вилка,вирус,вода,водолаз,вождь,воздух,война,волна,вор,время,высота,газ,галоп,гвоздь,гений,Германия,гигант,глаз,Голливуд,голова,горло,горн,гранат,гребень,Греция,гриф,груша,дама,декрет,день,десна,динозавр,диск,доктор,дракон,дробь,дума,дух,дыра,дятел,Европа,Египет,единорог,ёрш,жизнь,жила,жук,журавль,залог,замок,заноза,запад,запах,заяц,звезда,зебра,земля,знак,золото,зона,зуб,игла,игра,икра,Индия,институт,кабинет,кавалер,кадр,казино,камень,камера,канал,караул,карлик,карта,каша,кенгуру,кентавр,кетчуп,киви,кисть,кит,Китай,клетка,ключ,кокетка,кол,колода,колонна,кольцо,команда,конёк,контрабандист,концерт,кора,корабль,королева,король,корона,коса,кость,косяк,кошка,край,кран,крест,кролик,крошка,круг,крыло,кулак,курс,лад,лазер,лама,ласка,лев,лёд,лейка,лес,лимузин,линия,липа,лист,лицо,ложе,Лондон,лошадь,лук,луна,луч,масло,масса,мат,машина,мёд,медведь,Мексика,мелочь,место,механизм,микроскоп,миллионер,мир,морковь,мороженое,Москва,мост,мотив,мушка,мышь,налёт,наряд,небоскрёб,ниндзя,нож,номер,норка,нота,ночь,НьюЙорк,няня,область,облом,образ,образование,обрез,овсянка,огонь,Олимп,опера,операция,орган,орёл,осьминог,отель,падение,палата,палец,палочка,панель,пара,парашют,парк,партия,пассаж,паук,пачка,Пекин,перевод,перемена,перо,перчатка,пилот,пингвин,пирамида,пират,пистолет,плата,платье,площадь,пляж,побег,повар,подкова,подъём,покров,пол,поле,полис,полиция,помёт,порода,посольство,поток,почка,пояс,право,предложение,предприниматель,прибор,привод,призрак,принцесса,пришелец,пробка,проводник,проказа,прокат,проспект,профиль,путь,Пушкин,развод,разворот,рак,раковина,раствор,рейд,Рим,робот,рог,род,рок,рубашка,рукав,рулетка,рыба,рысь,рыцарь,салют,сантехник,Сатурн,свет,свидетель,секрет,секция,сердце,сеть,сила,скат,смерть,снаряд,снег,снеговик,собака,совет,солдат,соль,состав,спутник,среда,ссылка,стадион,стан,станок,ствол,стекло,стена,стойка,стол,стопа,стрела,строй,струна,стул,ступень,судьба,супергерой,такса,танец,тарелка,театр,телескоп,течение,титан,Токио,точка,трава,треугольник,труба,туба,тур,ударник,удел,узел,урал,урна,утка,утконос,учёный,учитель,факел,фаланга,фига,флейта,фокус,форма,Франция,хвост,хлопок,центр,церковь,частица,червь,шар,шоколад,шпагат,шпион,штат,шуба,экран,эльф,эфир,Юпитер,яблоко,яд,язык,якорь,ясли";

function arrayToString(array) {
	var string = "";
	for (var i = 0; i < array.length; i++) {
		if (i == 0) {
			string = array[i];
		} else {
			string = string + "," + array[i];
		}
	}
	return string;
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function addPlayerToList() { //добавляем игроков в списки
	var player = document.getElementById("player").value;
	var playerDuplicated = false;

	for (var i = 0; i < playerList.length; i++) { //проверка на повторение имен
		if (playerList[i] == player) {
			playerDuplicated = true;
		} else {
			playerDuplicated = false;
		}
	}

	if ((playerList.length < 8) && (player != "") && !playerDuplicated) { //если все ок, добавляем имя в список
		playerList.push(player);

		var newPlayer = document.createElement("li");
		newPlayer.innerHTML = player;
		newPlayer.id = playerList.length;

		var deleteButton = document.createElement("input");
		deleteButton.value = "Удалить";
		deleteButton.type = "button";
		deleteButton.id = "del" + playerList.length;
		deleteButton.onclick = function() {
			deletedSymbol = +this.parentNode.id - 1;
			playerList.splice(deletedSymbol, 1);
			this.parentNode.remove();
		};

		document.getElementById("playerList").append(newPlayer);
		document.getElementById(playerList.length).appendChild(deleteButton);



	} else if (playerList.length >= 8) {
		alert("Максимум 8 игроков");
	} else if (player == "") {
		alert("Имя не введено");
	} else if (playerDuplicated) {
		alert("Имя не уникально");
	}
}

function teamAssign() { //распределяем игроков по командам
	localStorage.setItem('playerList', arrayToString(playerList));
	localStorage.setItem('stage', 1);

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

		localStorage.setItem('teamA', arrayToString(teamA));
		localStorage.setItem('teamB', arrayToString(teamB));

		addPlayerToTeamList(teamA, "teamAList");
		addPlayerToTeamList(teamB, "teamBList");
		document.getElementById("input").hidden = true;
		document.getElementById("teams").hidden = false;
	} else {
		alert("Слишком мало игроков");
	}

}

function addPlayerToTeamList(team, id) { //вывод списка команд
	for (i = 0; i < team.length; i++) {
		var newPlayer = document.createElement("li");
		newPlayer.innerHTML = team[i];
		document.getElementById(id).append(newPlayer);
	}
}

function wordsShuffle() { //тасовка слов
	var wordsArray = wordsString.split(',');
	var cardCount = playerList.length * 10;
	var wordsInGame = [];
	for (var i = 0; i < cardCount; i++) {
		rand = randomInteger(0, wordsArray.length);
		wordsInGame.push(wordsArray[rand]);
		wordsArray.splice(rand, 1);
	}
	localStorage.setItem('wordsInGame', arrayToString(wordsInGame));
}

function startGame() { //запуск игры
	localStorage.setItem("wordsDone", "");
	localStorage.setItem("wordsSkip", "");
	localStorage.setItem("resultA", "0");
	localStorage.setItem("resultB", "0");
	localStorage.setItem("currentPlayerA", "0");
	localStorage.setItem("currentPlayerB", "0");

	localStorage.setItem('stage', 2);
	document.getElementById("teams").hidden = true;
	document.getElementById("method").hidden = false;
	wordsShuffle();
	var rand = randomInteger(0, 1);
	if (rand == 0) {
		localStorage.setItem("currentTeam", "teamA");
	} else {
		localStorage.setItem("currentTeam", "teamB");
	}
	preRound ();
}

function preRound () { //вводная перед началом раунда
	var textString = "";
	var method = randomInteger(0, 2);

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
		textString = localStorage.getItem("currentPlayerA") + " из команды А " + method;
	} else { //текст для комнды Б
		textString = localStorage.getItem("currentPlayerB") + " из команды Б " + method;
	}

		document.getElementById("gameMethodText").innerText = textString;
}

function startRound() { //запуск раунда
	var wordsArray = localStorage.getItem('wordsInGame').split(',');

	document.getElementById("method").hidden = true;
	document.getElementById("round").hidden = false;
	document.getElementById("word").innerText = wordsArray[0];
	document.getElementById("timer").innerText = "60";

	var timer = setTimeout(secondsCount, 1000);

}

function secondsCount() { //обратный отсчет
	document.getElementById("timer").innerText = parseInt(document.getElementById("timer").innerText) - 1;
	if (document.getElementById("timer").innerText > "0") {
		var timer = setTimeout(secondsCount, 1000);
	} else {
		endRound();
	}
}

function done() { //если слово угадано
	var wordsArray = localStorage.getItem('wordsInGame').split(',');
	var wordsDone = localStorage.getItem('wordsDone').split(',');

	if (wordsDone[0] == "") {
		wordsDone.splice(0, 1);
	}

	if (wordsArray.length > 1) {
		wordsDone.push(wordsArray[0]);
		wordsArray.splice(0, 1);

		localStorage.setItem("wordsDone", arrayToString(wordsDone));
		localStorage.setItem("wordsInGame", arrayToString(wordsArray));
		document.getElementById("word").innerText = wordsArray[0];

	} else if (wordsArray.length == 1) {
		wordsDone.push(wordsArray[0]);
		wordsArray.splice(0, 1);

		localStorage.setItem("wordsDone", arrayToString(wordsDone));
		localStorage.setItem("wordsInGame", arrayToString(wordsArray));

		endRound();
	}
	/*while (wordsArray.length > 0) {
		wordsDone.push(wordsArray[0]);
		wordsArray.splice(0, 1);

		localStorage.setItem("wordsDone", arrayToString(wordsDone));
		localStorage.setItem("wordsInGame", arrayToString(wordsArray));
		document.getElementById("word").innerText = wordsArray[0];
	}
	if (wordsArray.length == 0) {
		endRound();
	}*/
}

function skip() { //если слово пропущено
	var wordsArray = localStorage.getItem('wordsInGame').split(',');
	var wordsSkip = localStorage.getItem('wordsSkip').split(',');

	if (wordsSkip[0] == "") {
		wordsSkip.splice(0, 1);
	}

	if (wordsArray.length > 1) {
		wordsSkip.push(wordsArray[0]);
		wordsArray.splice(0, 1);

		localStorage.setItem("wordsSkip", arrayToString(wordsSkip));
		localStorage.setItem("wordsInGame", arrayToString(wordsArray));
		document.getElementById("word").innerText = wordsArray[0];

	} else if (wordsArray.length == 1) {
		wordsSkip.push(wordsArray[0]);
		wordsArray.splice(0, 1);

		localStorage.setItem("wordsSkip", arrayToString(wordsSkip));
		localStorage.setItem("wordsInGame", arrayToString(wordsArray));

		endRound();
	}
	/*while (wordsArray.length > 0) {

		wordsSkip.push(wordsArray[0]);
		wordsArray.splice(0, 1);

		localStorage.setItem("wordsSkip", arrayToString(wordsSkip));
		localStorage.setItem("wordsInGame", arrayToString(wordsArray));
		document.getElementById("word").innerText = wordsArray[0];
	}
		if (wordsArray.length == 0) {
			endRound();
		}*/
}

function endRound () {
	var wordsArray = localStorage.getItem('wordsInGame').split(',');
	var wordsDone = localStorage.getItem("wordsDone").split(",");
	var wordsSkip = localStorage.getItem("wordsSkip").split(",");

	if (wordsDone[0] == "") {
		wordsDone.splice(0, 1);
	}

	if (wordsSkip[0] == "") {
		wordsSkip.splice(0, 1);
	}

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
		localStorage.setItem("currentTeam", "teamB");

		if (localStorage.getItem("currentPlayerA") == (parseInt(localStorage.getItem("teamA").split(",").length) - 1)) {
			localStorage.setItem("currentPlayerA", "0");

		} else {
			localStorage.setItem("currentPlayerA", parseInt(localStorage.getItem("currentPlayerA")) + 1);
		}

	} else if (localStorage.getItem("currentTeam") == "teamB") {
		localStorage.setItem("resultB", parseInt(localStorage.getItem("resultB")) + parseInt(wordsDone.length)  - parseInt(wordsSkip.length));
		localStorage.setItem("currentTeam", "teamA");

		if (localStorage.getItem("currentPlayerB") == (parseInt(localStorage.getItem("teamB").split(",").length) - 1)) {
			localStorage.setItem("currentPlayerB", "0");

		} else {
			localStorage.setItem("currentPlayerB", parseInt(localStorage.getItem("currentPlayerB")) + 1);
		}
	}

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
