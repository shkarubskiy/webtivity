const app = Vue.createApp({
  data() {
    return {
      // game data
      game: {
        teams: [
          {
            members: [],
            currentPlayer: 0,
          },
          {
            members: [],
            currentPlayer: 0,
          },
        ],
        players: [],
        words: [],
        roundData: {
          team: "",
          player: "",
          method: "",
        },
      },
      // screens for visibility control
      screens: {
        players: true,
        teams: false,
        preround: false,
      },
      input: "",
      error: {
        desc: "",
        show: false,
      },
      coin: 0,
    };
  },
  computed: {
    // recent players for datalist
    recentPlayers() {
      return this.loadLocalArray("recentPlayers").sort();
    },

    // elements for visibility control
    playersList() {
      return this.game.players.length > 0 ? true : false;
    },

    playersButtonAssign() {
      return this.game.players.length > 3 ? true : false;
    },
  },
  methods: {
    loadLocalArray(key) {
      if (localStorage.getItem(key) != null)
        return localStorage.getItem(key).split(",");
      else return [];
    },

    saveLocalArray(key, array) {
      localStorage.setItem(key, array.toString());
    },

    getRandomInt(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },

    addPlayerToList() {
      if (this.validateInput(this.input).result) {
        this.error.show = false;
        this.game.players.push(this.input);
        this.input = "";
        this.$refs.input.focus();
      } else {
        this.error.desc = this.validateInput(this.input).desc;
        this.error.show = true;
      }
    },

    deletePlayerFromList(index) {
      this.game.players.splice(index, 1);
    },

    validateInput(string) {
      if (this.game.players.includes(string))
        return { result: false, desc: "Имя не должно повторяться" };
      if (string == "")
        return { result: false, desc: "Имя не может быть пустым" };
      if (string.includes(","))
        return { result: false, desc: "Имя не может содержать запятые" };
      if (string.includes("|"))
        return { result: false, desc: "Имя не может содержать символ |" };
      if (string.length > 18)
        return { result: false, desc: "Имя слишком длинное" };
      return { result: true, desc: "OK" };
    },

    validatePlayersList(array) {
      return array.length < 4
        ? { result: false, desc: "Нужно больше игроков (Минимум 4)!" }
        : { result: true, desc: "OK" };
    },

    assignTeams(array) {
      if (this.validatePlayersList(array).result) {
        let buffer = array.slice(0);
        this.error.show = false;
        while (buffer.length > 0) {
          let rnd = this.getRandomInt(0, buffer.length - 1);
          this.game.teams[0].members.length <= this.game.teams[1].members.length
            ? this.game.teams[0].members.push(buffer[rnd])
            : this.game.teams[1].members.push(buffer[rnd]);
          buffer.splice(rnd, 1);
        }
        this.saveLocalArray("firstTeam", this.game.teams[0].members);
        this.saveLocalArray("secondTeam", this.game.teams[1].members);
        this.saveLocalArray("recentPlayers", this.getRecentPlayers());
        this.screens.players = false;
        this.screens.teams = true;
      } else {
        this.error.desc = this.validateInput(this.input).desc;
        this.error.show = true;
      }
    },

    clearLocalData() {
      localStorage.clear();
    },

    restoreLocalData() {
      this.game.teams[0].members = this.loadLocalArray("firstTeam");
      this.game.teams[1].members = this.loadLocalArray("secondTeam");
      this.game.players = this.game.teams[0].members.concat(
        this.game.teams[1].members
      );
      this.screens.players = false;
      this.screens.teams = true;
    },

    getRecentPlayers() {
      let recentPlayers = this.loadLocalArray("recentPlayers");
      for (let i = 0; i < this.game.players.length; i++) {
        if (!recentPlayers.includes(this.game.players[i]))
          recentPlayers.push(this.game.players[i]);
      }
      return recentPlayers;
    },

    fetchRandomWords(source, count) {
      let buffer = source.slice();
      let result = [];
      for (let i = 0; i < count * this.game.players.length; i++) {
        rnd = this.getRandomInt(0, parseInt(buffer.length) - 1);
        result.push(buffer[rnd]);
        buffer.splice(rnd, 1);
      }
      return result;
    },

    startGame() {
      this.words = this.fetchRandomWords(wordsPool.basic, 10);
      this.setTurnOrder() == 1
        ? (this.game.roundData.team = "первой команды")
        : (this.game.roundData.team = "второй команды");
    },

    setTurnOrder() {
      return this.getRandomInt(0, 1);
    },

    startPreround() {
      this.screens.teams = false;
      this.screens.preround = true;
    },
  },
});
app.mount("#app");

window.onbeforeunload = function () {
  return true;
};

// function shuffle(words, count) {
//   let buffer = words.slice();
//   let result = [];
//   let cardCount = 0;
//   if (count > 0) cardCount = count * 10;
//   for (let i = 0; i < cardCount; i++) {
//     rnd = getRandomInt(0, parseInt(buffer.length) - 1);
//     result.push(words[rnd]);
//     buffer.splice(rnd, 1);
//   }
//   return result;
// }

var timer = 0;

// let gameData = {
//   firstTeam: {
//     players: loadLocalArray("firstTeam"),
//     currentPlayer: 0,
//   },
//   secondTeam: {
//     players: loadLocalArray("secondTeam"),
//     currentPlayer: 0,
//   },
//   players: 0,
//   words: [],
//   playWords: [],
//   currentTeam: "",
// };

// gameData.players = gameData.firstTeam.length + gameData.secondTeam.length;
// gameData.words = wordsPool.basic;
// gameData.playWords = shuffle(gameData.words, gameData.players);
// gameData.currentTeam = setTurnOrder();
// startPreRound(gameData);

/* localStorage.setItem('playerList', '');
localStorage.setItem('resultA', 0);
localStorage.setItem('resultB', 0);
localStorage.setItem('wordsDone', '');
localStorage.setItem('wordsSkip', '');
localStorage.setItem('teamA', '');
localStorage.setItem('teamB', '');
localStorage.setItem('currentPlayerA', 0);
localStorage.setItem('currentPlayerB', 0);
localStorage.setItem('currentTeam', '');
localStorage.setItem('wordsInGame', ''); */

/*Утилитарные функции*/

/* window.onbeforeunload = function() {
	return true;
}; */

/* function localWriteArray(localKey, array) {
  var string = '';
  for (var i = 0; i < array.length; i++) {
    if (i == 0) {
      string = array[i];
    } else {
      string = string + ',' + array[i];
    }
  }
  localStorage.setItem(localKey, string);
}

function localReadArray(localKey) {
  var array = localStorage.getItem(localKey).split(',');
  if (array[0] == '') {
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
    if (string[i] == ',') {
      result = true;
    }
  }
  return result;
}

function screenSwitch(lastScreen, nextScreen) {
  document.getElementById(lastScreen).hidden = true;
  document.getElementById(nextScreen).hidden = false;
} */

/*Основные функции*/

/* function addPlayerToList() {
  var player = document.getElementById('player').value;
  var playerList = localReadArray('playerList');

  if (
    playerList.length < 8 &&
    player != '' &&
    !isDuplicated(playerList, player) &&
    !hasComma(player)
  ) {
    playerList.push(player);

    var newPlayer = document.createElement('li');
    var deleteButton = document.createElement('a');
    var id = playerList.length - 1;

    document.getElementById('nextButton').hidden = false;

    newPlayer.innerHTML = player;
    newPlayer.id = id;

    deleteButton.href = '#';
    deleteButton.innerText = '[X]';
    deleteButton.onclick = function () {
      var id = this.parentNode.id;
      var playerList = localReadArray('playerList');
      playerList.splice(id, 1);
      this.parentNode.remove();
      localWriteArray('playerList', playerList);

      if (id < playerList.length) {
        for (var i = parseInt(id) + 1; i <= playerList.length; i++) {
          document.getElementById(i).id =
            parseInt(document.getElementById(i).id) - 1;
        }
      }

      if (playerList.length == 0) {
        document.getElementById('nextButton').hidden = true;
      }
    };

    document.getElementById('playerList').append(newPlayer);
    document.getElementById(id).appendChild(deleteButton);
    document.getElementById('player').value = '';
    document.getElementById('player').focus();

    localWriteArray('playerList', playerList);
  } else if (playerList.length >= 8) {
    alert('Максимум 8 игроков');
  } else if (player == '') {
    alert('Имя не введено');
  } else if (isDuplicated(playerList, player)) {
    alert('Имя не уникально');
  } else if (hasComma(player)) {
    alert('В имени не должно быть запятых');
  }
}

function addPlayerToTeamList(team, id) {
  for (i = 0; i < team.length; i++) {
    var newPlayer = document.createElement('li');
    newPlayer.innerHTML = team[i];
    document.getElementById(id).append(newPlayer);
  }
}

function teamAssign() {
  var playerList = localReadArray('playerList');
  var teamA = [];
  var teamB = [];
  var playerPool = playerList.slice();

  if (playerPool.length > 3) {
    while (playerPool.length != 0) {
      rand = randomInteger(0, playerPool.length - 1);
      teamA.push(playerPool[rand]);
      playerPool.splice(rand, 1);
      if (playerPool.length != 0) {
        rand = randomInteger(0, playerPool.length - 1);
        teamB.push(playerPool[rand]);
        playerPool.splice(rand, 1);
      }
    }

    localWriteArray('teamA', teamA);
    localWriteArray('teamB', teamB);

    addPlayerToTeamList(teamA, 'teamAList');
    addPlayerToTeamList(teamB, 'teamBList');

    screenSwitch('input', 'teams');

    localStorage.setItem('stage', 1);
  } else {
    alert('Слишком мало игроков');
  }
} */

/* function wordsShuffle() {
  var playerList = localReadArray('playerList');
  var wordsArray = wordsString.split(',');
  var cardCount = playerList.length * 10;
  var wordsInGame = [];
  for (var i = 0; i < cardCount; i++) {
    rand = randomInteger(0, parseInt(wordsArray.length) - 1);
    wordsInGame.push(wordsArray[rand]);
    wordsArray.splice(rand, 1);
  }
  localWriteArray('wordsInGame', wordsInGame);
} */

/* function startGame() {
  localStorage.setItem('wordsDone', '');
  localStorage.setItem('wordsSkip', '');
  localStorage.setItem('resultA', '0');
  localStorage.setItem('resultB', '0');
  localStorage.setItem('currentPlayerA', '0');
  localStorage.setItem('currentPlayerB', '0');

  if (randomInteger(0, 1) == 0) {
    localStorage.setItem('currentTeam', 'teamA');
  } else {
    localStorage.setItem('currentTeam', 'teamB');
  }

  wordsShuffle();
  preRound();

  screenSwitch('teams', 'method');
  localStorage.setItem('stage', 2);
}

function preRound() {
  //вводная перед началом раунда
  var textString = '';
  var method = randomInteger(0, 2);
  var teamA = localReadArray('teamA');
  var teamB = localReadArray('teamB');

  localStorage.setItem('wordsDone', '');
  localStorage.setItem('wordsSkip', '');

  if (method == 0) {
    //случайный выбор способа объяснения
    method = 'объясняет словами.';
  } else if (method == 1) {
    method = 'объясняет жестами.';
  } else if ((method = 2)) {
    method = 'объясняет рисунками.';
  }

  if (localStorage.getItem('currentTeam') == 'teamA') {
    //текст для команды А
    document.getElementById('currentPlayer').innerText =
      teamA[parseInt(localStorage.getItem('currentPlayerA'))];
    document.getElementById('currentTeam').innerText = 'Красивые';
    document.getElementById('gameMethodText').innerText = method;

    document.getElementById('currentPlayer').style.background = '#FFD6DD';
    document.getElementById('currentTeam').style.background = '#FFD6DD';
  } else if (localStorage.getItem('currentTeam') == 'teamB') {
    //текст для комнды Б
    document.getElementById('currentPlayer').innerText =
      teamA[parseInt(localStorage.getItem('currentPlayerA'))];
    document.getElementById('currentTeam').innerText = 'Умные';
    document.getElementById('gameMethodText').innerText = method;

    document.getElementById('currentPlayer').style.background = '#C4D0FB';
    document.getElementById('currentTeam').style.background = '#C4D0FB';
  }
}

function startRound() {
  //запуск раунда
  var wordsInGame = localReadArray('wordsInGame');

  screenSwitch('method', 'round');
  document.getElementById('word').innerText = wordsInGame[0];
  document.getElementById('timer').innerText = '60';

  var timer = setTimeout(secondsCount, 1000);
}

function secondsCount() {
  //обратный отсчет
  document.getElementById('timer').innerText =
    parseInt(document.getElementById('timer').innerText) - 1;
  if (document.getElementById('timer').innerText > '0') {
    timer = setTimeout(secondsCount, 1000);
  } else {
    endRound();
  }
}

function done() {
  //если слово угадано
  var wordsInGame = localReadArray('wordsInGame');
  var wordsDone = localReadArray('wordsDone');

  if (wordsInGame.length > 1) {
    wordsDone.push(wordsInGame[0]);
    wordsInGame.splice(0, 1);

    localWriteArray('wordsDone', wordsDone);
    localWriteArray('wordsInGame', wordsInGame);
    document.getElementById('word').innerText = wordsInGame[0];
  } else if (wordsInGame.length == 1) {
    wordsDone.push(wordsInGame[0]);
    wordsInGame.splice(0, 1);

    localWriteArray('wordsDone', wordsDone);
    localWriteArray('wordsInGame', wordsInGame);

    endRound();
  }
  localStorage.setItem('stage', 3);
}

function skip() {
  //если слово пропущено
  var wordsInGame = localReadArray('wordsInGame');
  var wordsSkip = localReadArray('wordsSkip');

  if (wordsInGame.length > 1) {
    wordsSkip.push(wordsInGame[0]);
    wordsInGame.splice(0, 1);

    localWriteArray('wordsSkip', wordsSkip);
    localWriteArray('wordsInGame', wordsInGame);
    document.getElementById('word').innerText = wordsInGame[0];
  } else if (wordsInGame.length == 1) {
    wordsSkip.push(wordsInGame[0]);
    wordsInGame.splice(0, 1);

    localWriteArray('wordsSkip', wordsSkip);
    localWriteArray('wordsInGame', wordsInGame);

    endRound();
  }
  localStorage.setItem('stage', 3);
}

function endRound() {
  clearTimeout(timer);
  var wordsArray = localReadArray('wordsInGame');
  var wordsDone = localReadArray('wordsDone');
  var wordsSkip = localReadArray('wordsSkip');

  document.getElementById('doneList').innerHTML = '';
  document.getElementById('skipList').innerHTML = '';

  screenSwitch('round', 'result');

  if (wordsDone.length > 0) {
    document.getElementById('doneWords').hidden = false;
  } else {
    document.getElementById('doneWords').hidden = true;
  }

  if (wordsSkip.length > 0) {
    document.getElementById('skipWords').hidden = false;
  } else {
    document.getElementById('skipWords').hidden = true;
  }

  for (var i = 0; i < wordsDone.length; i++) {
    if (wordsDone[i] != '') {
      var word = document.createElement('li');
      word.innerHTML = wordsDone[i];
      document.getElementById('doneList').append(word);
    }
  }

  for (var i = 0; i < wordsSkip.length; i++) {
    if (wordsSkip[i] != '') {
      var word = document.createElement('li');
      word.innerHTML = wordsSkip[i];
      document.getElementById('skipList').append(word);
    }
  }

  if (localStorage.getItem('currentTeam') == 'teamA') {
    localStorage.setItem(
      'resultA',
      parseInt(localStorage.getItem('resultA')) +
        parseInt(wordsDone.length) -
        parseInt(wordsSkip.length)
    );
    localStorage.setItem('wordsDone', '');
    localStorage.setItem('wordsSkip', '');
    localStorage.setItem('currentTeam', 'teamB');

    if (
      localStorage.getItem('currentPlayerA') ==
      parseInt(localReadArray('teamA').length) - 1
    ) {
      localStorage.setItem('currentPlayerA', '0');
    } else {
      localStorage.setItem(
        'currentPlayerA',
        parseInt(localStorage.getItem('currentPlayerA')) + 1
      );
    }
  } else if (localStorage.getItem('currentTeam') == 'teamB') {
    localStorage.setItem(
      'resultB',
      parseInt(localStorage.getItem('resultB')) +
        parseInt(wordsDone.length) -
        parseInt(wordsSkip.length)
    );
    localStorage.setItem('wordsDone', '');
    localStorage.setItem('wordsSkip', '');
    localStorage.setItem('currentTeam', 'teamA');

    if (
      localStorage.getItem('currentPlayerB') ==
      parseInt(localReadArray('teamB').length) - 1
    ) {
      localStorage.setItem('currentPlayerB', '0');
    } else {
      localStorage.setItem(
        'currentPlayerB',
        parseInt(localStorage.getItem('currentPlayerB')) + 1
      );
    }
  }
  localStorage.setItem('stage', 4);
}

function nextRound() {
  if (localStorage.getItem('wordsInGame') != '') {
    screenSwitch('result', 'method');
    preRound();
  } else {
    screenSwitch('result', 'gameover');
    gameOver();
    localStorage.setItem('stage', 4);
  }
}

function gameOver() {
  var text = '';
  if (
    parseInt(localStorage.getItem('resultA')) >
    parseInt(localStorage.getItem('resultB'))
  ) {
    text =
      'Со счетом ' +
      localStorage.getItem('resultA') +
      ':' +
      localStorage.getItem('resultB') +
      '<br>побеждает команда';
    document.getElementById('score').innerHTML = text;
    document.getElementById('winner').innerText = 'Красивые';
    document.getElementById('winner').style.background = '#FFD6DD';
  } else if (
    parseInt(localStorage.getItem('resultA')) <
    parseInt(localStorage.getItem('resultB'))
  ) {
    text =
      'Со счетом ' +
      localStorage.getItem('resultB') +
      ':' +
      localStorage.getItem('resultA') +
      '<br>побеждает команда';
    document.getElementById('score').innerHTML = text;
    document.getElementById('winner').innerText = 'Умные';
    document.getElementById('winner').style.background = '#C4D0FB';
  } else if (
    parseInt(localStorage.getItem('resultA')) ==
    parseInt(localStorage.getItem('resultB'))
  ) {
    text =
      'Ничья со счетом ' +
      localStorage.getItem('resultA') +
      ':' +
      localStorage.getItem('resultB');
    document.getElementById('winner').hidden = true;
  }
}

function newGame() {
  screenSwitch('gameover', 'input');
  document.getElementById('playerList').innerHTML = '';
  document.getElementById('teamAList').innerHTML = '';
  document.getElementById('teamBList').innerHTML = '';
  localStorage.setItem('playerList', '');
  localStorage.setItem('stage', 0);
}
 */
