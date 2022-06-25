const app = Vue.createApp({
  data() {
    return {
      teams: [
        {
          members: [],
          currentPlayer: 0,
          name: "Первая команда",
        },
        {
          members: [],
          currentPlayer: 0,
          name: "Вторая команда",
        },
      ], // данные команд
      players: [], // данные всех игроков
      words: [], // слова для игры
      gameMethods: [
        "объясняет словами",
        "объясняет жестами",
        "объясняет рисунками",
      ], // возможные варианты объяснения слов
      round: {
        team: 0,
        player: 0,
        method: 0,
        word: "",
        failWords: [],
        timer: 50,
        pass: [],
        fail: [],
      }, // данные текущего раунда
      score: [0, 0],
      winner: null,
      screens: {
        players: true,
        teams: false,
        preround: false,
        round: false,
        endround: false,
        gameover: false,
      }, // данные отображения экранов
      error: {
        desc: "",
        show: false,
      }, //отображение ошибок
      timer: null,
    };
  },
  computed: {
    recentPlayers() {
      return this.loadLocalArray("recentPlayers").sort();
    }, //выгрузка списка игроков

    playersList() {
      return this.players.length > 0 ? true : false;
    }, //управление видимостью

    playersButtonAssign() {
      return this.players.length > 3 ? true : false;
    }, //управление видимостью

    spoilerButtonAssign() {
      if (
        localStorage.getItem("firstTeam") != null &&
        localStorage.getItem("secondTeam") != null
      )
        return true;
      return false;
    }, //управление видимостью

    timerLineWidth() {
      return `${2 * this.round.timer}%`;
    }, // визуализация таймера

    gameScore() {
      if (this.score[0] > this.score[1])
        return `${this.score[0]} - ${this.score[1]}`;
      else return `${this.score[1]} - ${this.score[0]}`;
    },
  },
  methods: {
    //общие методы
    // getRandomInt(min, max) {
    //   let rand = min - 0.5 + Math.random() * (max - min + 1);
    //   return Math.round(rand);
    // },

    //для формирования команд
    loadLocalArray(key) {
      if (localStorage.getItem(key) != null)
        return localStorage.getItem(key).split(",");
      else return [];
    },

    saveLocalArray(key, array) {
      localStorage.setItem(key, array.toString());
    },

    addPlayerToList() {
      if (this.validateInput(this.$refs.input.value).result) {
        this.error.show = false;
        this.players.push(this.$refs.input.value);
        console.log(this.$refs.input.value);
        this.$refs.input.value = "";
        this.$refs.input.focus();
      } else {
        this.error.desc = this.validateInput(this.$refs.input.value).desc;
        this.error.show = true;
      }
    },

    deletePlayerFromList(index) {
      this.players.splice(index, 1);
    },

    validateInput(string) {
      if (this.players.includes(string))
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
          let rnd = getRandomInt(0, buffer.length - 1);
          this.teams[0].members.length <= this.teams[1].members.length
            ? this.teams[0].members.push(buffer[rnd])
            : this.teams[1].members.push(buffer[rnd]);
          buffer.splice(rnd, 1);
        }
        this.saveLocalArray("firstTeam", this.teams[0].members);
        this.saveLocalArray("secondTeam", this.teams[1].members);
        this.saveLocalArray("recentPlayers", this.getRecentPlayers());
        this.screens.players = false;
        this.screens.teams = true;
      } else {
        this.error.desc = this.validateInput(this.$refs.input.value).desc;
        this.error.show = true;
      }
    },

    clearLocalData() {
      localStorage.clear();
    },

    restoreLocalData() {
      this.teams[0].members = this.loadLocalArray("firstTeam");
      this.teams[1].members = this.loadLocalArray("secondTeam");
      this.players = this.teams[0].members.concat(this.teams[1].members);
      this.screens.players = false;
      this.screens.teams = true;
    },

    getRecentPlayers() {
      let recentPlayers = this.loadLocalArray("recentPlayers");
      for (let i = 0; i < this.players.length; i++) {
        if (!recentPlayers.includes(this.players[i]))
          recentPlayers.push(this.players[i]);
      }
      return recentPlayers;
    },

    //для организации игры
    fetchRandomWords(source, count) {
      let buffer = source.slice();
      let result = [];
      for (let i = 0; i < count * this.players.length; i++) {
        rnd = getRandomInt(0, parseInt(buffer.length) - 1);
        result.push(buffer[rnd]);
        buffer.splice(rnd, 1);
      }
      return result;
    },

    setTurnOrder() {
      return getRandomInt(0, 1);
    },

    //для этапов игры
    startGame() {
      this.words = this.fetchRandomWords(wordsPool.basic, 10);
      this.setTurnOrder() == 1 ? (this.round.team = 0) : (this.round.team = 1);
      this.startPreround();
    },

    startPreround() {
      // if (this.round.team == 0) this.round.team == 1;
      // else this.round.team == 0;
      // this.round.player =
      //   this.teams[this.round.team].members[
      //     this.teams[this.round.team].currentPlayer
      //   ];
      this.round.player =
        this.teams[this.round.team].members[
          this.teams[this.round.team].currentPlayer
        ];
      this.round.method =
        this.gameMethods[getRandomInt(0, this.gameMethods.length - 1)];
      this.round.pass = [];
      this.round.fail = [];
      this.screens.teams = false;
      this.screens.endround = false;
      this.screens.preround = true;
    },

    // countTimer() {
    //   if (this.round.timer > 0) {
    //     setTimeout(() => {
    //       this.round.timer--;
    //       this.countTimer();
    //     }, 1000);
    //   } else this.endRound();
    // },

    countTimer() {
      if (this.round.timer > 0) {
        this.timer = setTimeout(() => {
          this.round.timer--;
          this.countTimer();
        }, 1000);
      } else this.endRound();
    },

    startRound() {
      this.round.word = this.words[0];
      this.screens.preround = false;
      this.screens.round = true;
      this.round.timer = 50;
      this.countTimer();
    },

    pressPass() {
      if (this.words.length > 1) {
        this.round.pass.push(this.round.word);
        this.words.shift();
        this.round.word = this.words[0];
      } else {
        this.round.pass.push(this.round.word);
        this.words.shift();
        this.endRound();
      }
    },
    pressFail() {
      this.round.fail.push(this.round.word);
      this.round.failWords.push(this.round.word);
      this.words.shift();
      if (this.round.fail.length == 3) {
        clearTimeout(this.timer);
        this.round.timer = 0;
        this.endRound();
      } else {
        this.round.word = this.words[0];
      }
    },

    endRound() {
      this.words.concat(this.round.failWords);
      this.round.failWords = [];
      this.score[this.round.team] =
        this.score[this.round.team] +
        this.round.pass.length -
        this.round.fail.length;
      if (
        this.teams[this.round.team].currentPlayer <
        this.teams[this.round.team].members.length - 1
      )
        this.teams[this.round.team].currentPlayer++;
      else this.teams[this.round.team].currentPlayer = 0;

      if (this.round.team == 0) this.round.team = 1;
      else if (this.round.team == 1) this.round.team = 0;
      this.screens.round = false;
      this.screens.endround = true;
    },

    nextRound() {
      if (this.words.length > 0) this.startPreround();
      else this.gameOver();
    },

    gameOver() {
      this.screens.endround = false;
      this.screens.gameover = true;
      if (this.score[0] > this.score[1]) this.winner = this.teams[0].name;
      else this.winner = this.teams[0].name;
    },
  },
});
app.mount("#app");

function getRandomInt(min, max) {
  let rnd = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rnd);
}

// window.onbeforeunload = function () {
//   return true;
// };

//let timer = 0;

/* 

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
