var questionBank = [
  "What is a song that Name can never get tired of listening to?",
  "What would Name be doing for a living in an alternate reality?",
  "Question?",
  "How much does Name like waffles?",
  "How does Name get to Sesame Street?",
  "Who will Name eat?"
]

var domID = function(id) { return document.getElementById(id); } //Make it easer to select elements from the DOM


var numPlayers = localStorage.getItem('numPlayers'); // int: number of players
var pointsToWin; // int: number of points needed to win
var curPlayer; // int: current player's index
var question; // str: the current question players are asked
var playerPairs = []; //players will be paired of as arrays within an array
var player = [];
var playerDetails = function(name, answer, score, pair) {
  this.name = name;
  this.answer = answer;
  this.score = score;
  this.pair = pair;
}
var answerCaption = []; //captions to be placed on buttons on answer page
var scoreEntry = []; //entries to be placed on the score board
var gameOver = false;

// Prevent all forms from reloading
(function () {
  var tagForm = document.getElementsByTagName("form");
  for (var i = 0; i < tagForm.length; i++) {
      tagForm[i].addEventListener('submit', function(){
        event.preventDefault();
      });
  }
})();


// if you've already played, load form data from last game
if (numPlayers) {
  domID('txtNumPlayers').value = numPlayers;
  for (var i = 0; i < numPlayers; i += 1) {
    domID('txtName' + i).value = localStorage.getItem('player' + i + 'name');
  }
}

// GAMEPLAY FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////

function createPlayers(){
  for (var i = 0; i < numPlayers; i += 1) {
    //Add all player names to object array
    player.push(new playerDetails(domID('txtName' + i).value, '', 0, ''));
    //Store names for future access (if someone plays another game, name fields will be prepopulated)
    localStorage.setItem('player' + i + 'name', domID('txtName' + i).value);

  //addEventListeners for clicking on an Answer choice
    domID('frmAnswer' + i).addEventListener('submit', function(){
      if (this.children[0].value === player[player.findIndex(cur => cur.name===player[curPlayer].pair)].answer) {
        domID('correctHeader').innerHTML = rndCorrectHeader();
        domID('correctMessage').innerText = 'You\'ve earned a point!';
        player[curPlayer].score += 1;
        if (player[curPlayer].score === pointsToWin) {gameOver = true};
      } else {
        domID('correctHeader').innerHTML = rndWrongHeader();
        domID('correctMessage').innerText = rndWrongMessage();
      }
      domID('sectionAnswers').style.display = 'none';
      domID('sectionCorrect').style.display = 'block'; 
    });
  }

}

// randomize items and add those items to an array
function rndOrder(num, addItem) { // where addItem is a function that specifies what to do with random-indexed strings
  // create an array to hold all posible order numbers
  var indices = [];
  for (var i = 0; i < num; i += 1) {
    indices.push(i); 
  }
  
  var rndX; //variable for random calculations

  for (var i = 0; i < num; i += 1) { 
    //select a random order number from those remaining
    rndX = Math.floor(Math.random() * indices.length);
    var index = indices[rndX];
    //we now have a random index. What do we do with it?
    addItem(index);
    indices.splice(rndX,1); //remove order number chosen so it won't be used again
  }
}
//Functions that can be passed into rndOrder():
function addPlayer(index) {
  player.push(new playerDetails(player[index].name, player[index].answer, player[index].score, player[index].pair));
}
function addAnswerCaption(index) {
  answerCaption.push
  answerCaption.push(player[index].answer);
}
//shortcut to randomize player order
function rndPlayers() { 
  rndOrder(numPlayers, addPlayer);
  player.splice(0,numPlayers);  //delete the old player objects that were duplicated
  pairPlayers();
}

// define function to randomly pair off players/////////////////////////////////////////////////////////////////
function pairPlayers(){


  //create array of all player indices
  var indices = [];
  for (var i = 0; i < numPlayers; i += 1) {
    indices.push(i); 
  }

  var rndX; //variable for random calculations
  for (var i = 0; i < numPlayers-1; i += 1) { //randomize pair for each player, but stop before last player

    //select a second player, not the same as the first
    rndX = Math.floor(Math.random() * (indices.length-1)); //do not include last index. Last index will be subbed in if a player is paired with himself
    
    var pairName = player[indices[rndX]].name;

    if (pairName === player[i].name) {
      rndX = indices.length - 1;  //if a player is paired with himself, sub in last index
      pairName = player[indices[rndX]].name;
    };

    indices.splice(rndX,1); //remove player index for player chosen so it won't be used again
    
    player[i].pair = pairName;
  }


  // once there is only 1 player left to pair...
  pairName = player[indices[0]].name;

  // see if player would be paired with himself
  if (pairName === player[numPlayers-1].name) {
  // if so, swap with a different player
    pairName = player[0].pair; //grab pair from the first player
    player[0].pair = player[numPlayers-1].name; //pair first player with last player
  }
  player[numPlayers-1].pair = pairName;

}
/// -(end pairPlayers())- ///

// define function to move to the next player
function nextPlayer() {
  curPlayer += 1;
  domID('headerPart2').innerHTML = player[curPlayer].name; //display name of current player on screen
}

//These 2 function will turn questions into 3rd or 2nd person statements:
function makeThirdPerson(str, name){
  return str.split('Name').join(name);
}
function makeSecondPerson(str){
  return str.split('Name\'s').join('your').split('Name').join('you').split('does').join('do');
}

function loadQuestion() {
  // Select and display a random question from the bank
  var rndQ = Math.floor(Math.random() * questionBank.length);
  question = questionBank[rndQ];

  questionBank.splice(rndQ, 1); //delete that question so it won't be used again

  domID('headerCaption').innerHTML = makeSecondPerson(question);
  domID('headerCaption').classList.add('questionText');
  rndPlayers(); //randomize players

  domID('headerPart1').innerHTML = 'Hey'; //display greeting

  curPlayer = -1 //start at 0 so that nextPlayer will move to 0
  nextPlayer(); //start with first player
}


// EVENT LISTENERS ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// NumPlayer => InputNames --------------------------------------------------
domID('frmNumPlayers').addEventListener('submit', function(){
  //don't continue if a number was left blank
  if (!domID('txtNumPlayers').value || !domID('txtPoints').value){return};

  // Set numPlayers & pointsToWin
  numPlayers = parseInt(domID('txtNumPlayers').value);
  pointsToWin = parseInt(domID('txtPoints').value);

  // Save numPlayers in local storage for future game recall
  localStorage.setItem('numPlayers', domID('txtNumPlayers').value);

  // Make Name inputs visible according to numPlayers
  for (var i = 0; i < numPlayers; i += 1) {
    domID('frmName' + i).style.display = 'block';
    //if there are 4, 7, or 8 players, arrange in 4 columns instead of 3
    if (numPlayers % 4 === 0 || numPlayers === 7) {
      domID('inputSection' + i).classList.replace('col-33','col-25');
    }
  }
  // Move to next section of the game
  domID('sectionNumPlayers').style.display = 'none';
  domID('sectionInputNames').style.display = 'block';
});



// InputNames => Questions -------------------------------------------------
domID('submitNames').addEventListener('submit', function(){
  //Make sure no text field is left blank
  for (var i = 0; i < numPlayers; i += 1) {
    if (domID('txtName' + i).value === '') {
      alert('You can\'t leave a name blank!');
      return;
    }
  } // Make sure no 2 players are given the same name
  for (var i = 0; i < numPlayers; i += 1) {
    for (var j = 0; i < numPlayers; i += 1) {
      if (i !== j && domID('txtName' + i).value === domID('txtName' + j).value) {
        alert('You can\'t have two players with the same name!');
        return;
      }
    }
  }


  createPlayers();
  loadQuestion();

  // Move to next section of the game
  domID('sectionInputNames').style.display = 'none';
  domID('sectionQuestions').style.display = 'block';

});


// Player Submits Answer -------------------------------------------------------
domID('frmAnswer').addEventListener('submit', function(){
  if (domID('txtAnswer').value==='') {
    alert('Oops! You forgot something! Answer the question, ' + player[curPlayer].name + '!');
    return;
  }

  player[curPlayer].answer = domID('txtAnswer').value; //store answer
  document.getElementById('txtAnswer').value = '' //and clear the textbox
  
  if (curPlayer !== numPlayers-1) { //see if you're on the last player
    nextPlayer(); // if not, select the next player
    
  } else {
    //otherwise, move to the Answers section!
    loadAnswers(); 
    curPlayer = -1;
    nextPlayer();
    domID('headerCaption').innerHTML = makeThirdPerson(question, player[curPlayer].pair);
    domID('sectionQuestions').style.display = 'none';
    domID('sectionAnswers').style.display = 'block'; 
  }

});

function loadAnswers() {
  
  answerCaption = [];

  rndOrder(numPlayers, addAnswerCaption);

  // Make answers visible according to numPlayers
  for (var i = 0; i < numPlayers; i += 1) {
    domID('answerSection' + i).style.display = 'block';
    domID('submitAnswer' + i).value = answerCaption[i];
    //if there are 3 players, arrange in 1 column instead of 2
    if (numPlayers === 3) {
      domID('answerSection' + i).classList.replace('col-50','col-100');
    }
  }
}


function rndCorrectHeader() {
  var message = [
    'Congrats!',
    'You\'re Awesome!',
    'That\'s Right!',
    'That\'s Correct!',
    'You So Right!'
  ]
  var rndX = Math.floor(Math.random() * message.length);
  return message[rndX];
}
function rndCorrectMessage() {
  var message = [
    'You\'ve earned a point!',
    'Point for you!',
    'You know your friends so well!',
    'Have a point!',
    'You get a point!',
    'Enjoy that point you earned!'
  ]
  var rndX = Math.floor(Math.random() * message.length);
  return message[rndX];
}
function rndWrongHeader() {
  var message = [
    'Nope!',
    'Incorrect!',
    'Sorry!',
    'Wrong Answer!',
    'Really, ' + player[curPlayer].name + '?',
  ]
  var rndX = Math.floor(Math.random() * message.length);
  return message[rndX];
}
function rndWrongMessage() {
  var message = [
    'No point for you!',
    'Guess you don\t know ' + player[curPlayer].pair + ' as well as you thought!',
    'You really should get to know ' + player[curPlayer].pair + ' better!',
    'Better luck next time!',
    'Yeah, that\'s not right at all!',
    'Come on. You can do better!',
    'We expected better things from you!'
  ]
  var rndX = Math.floor(Math.random() * message.length);
  return message[rndX];
}

domID('frmCorrect').addEventListener('submit', function(){
  domID('sectionCorrect').style.display = 'none';
  if (curPlayer !== numPlayers-1) { //see if you're on the last player
    nextPlayer(); // if not, go to next player
    domID('headerCaption').innerHTML = makeThirdPerson(question, player[curPlayer].pair);
    domID('sectionAnswers').style.display = 'block'; 
  } else {
    //otherwise, move to the Score board!
    getScoreEntries();
    for (var i = 0; i < numPlayers; i += 1) {
      domID('scoreEntry' + i).innerHTML = scoreEntry[i];
      domID('sectionScoreEntry' + i).style.display = 'block';
    }

    if (gameOver) {
      domID('headerPart1').innerHTML = 'Good';
      domID('headerPart2').innerHTML = 'Game!';
      domID('frmScoreBoard').style.display = 'none';
      domID('frmPlayAgain').style.display = 'block'; 
    } else {
      domID('headerPart1').innerHTML = 'Score';
      domID('headerPart2').innerHTML = 'Board';
    }
    domID('headerCaption').style.display = 'none';
    domID('sectionScoreBoard').style.display = 'block'; 
  }
});
function getScoreEntries() {
  var score = [-1]; // make an index of scores to compare to. (players with a score of 0 will be added once they're compared to -1)
  scoreEntry = []; //empty score entries array
  for (var i = 0; i < numPlayers; i += 1) {
    for (var j = 0; j < score.length; j += 1) {
      if (player[i].score > score[j]) {
        score.splice(j, 0, player[i].score);
        scoreEntry.splice(j, 0, player[i].score + ' ' + player[i].name);
        break;
      }
    }
  }
}


domID('frmScoreBoard').addEventListener('submit', function(){
  loadQuestion()
  domID('headerCaption').style.display = 'block';
  domID('sectionScoreBoard').style.display = 'none';
  domID('sectionQuestions').style.display = 'block';
});

domID('yesPlayAgain').onclick = function(){location.reload()};
domID('noPlayAgain').onclick = function(){window.open('../index.html','_self')};
