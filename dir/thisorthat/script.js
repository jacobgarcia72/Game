// Player Controller
var playerController = (function() {
  var players = [];
  var playerDetails = function(name, answers, score) {
    this.name = name;
    this.answers = answers;
    this.score = score;
  };

  return {
    addPlayer: function(name) {
      players.push(new playerDetails(name, [], 0));
    },

    addPoint: function(index) {
      players[index].score += 1;
    },

    recordChoice: function(curP, curQ, choice) {
      players[curP].answers[curQ] = choice;
    },

    player: function(index) {
      return {
        name: players[index].name,
        answers: players[index].answers,
        score: players[index].score
      }
    }
  };

})();


// ------------------------------------------------------


// Question Controller
var questionController = (function() {
  
  var questionBank = [
    'Cats','Dogs','Android','iPhone','Cars','Trucks','Mountains','Beach','Waffles','Pancakes','City','Country','Morning','Night','Apples','Oranges','\'NSYNC','Backstreet Boys','Whole Grain','White Bread','Nacho Cheese','Cool Ranch','Batman','Superman','Marvel','DC','Bowling','Laser Tag','Ferrari','Lamborghini','Summer','Winter','Spring','Fall','Police','Fire Fighters','Pirates','Ninjas','Pen','Pencil','Red','Blue','Blondes','Brunettes','Flight','Invisibility','Fortune','Fame','Book','Movie','Sports','Theatre','Hot Dog','Hamburger','Bacon','Sausage','Cake','Pie','Big Party','Small Gathering','Pizza','Tacos','Driver','Front Seat','Humor','Intelligence','Fruits','Veggies','Board Games','Video Games','Mac','PC','Soup','Salad','Soup','Sandwich','Ice Cream','Frozen Yogurt','Chocolate','Vanilla','Hamburger','Chicken Sandwich','Cheetos','Doritos','Mexican Food','Italian Food','M\&M\'s','Skittles','Spaghetti','Pizza','Ketchup','Mustard','Apple Juice','Orange Juice','Facial Hair','Clean Shaven','Curly Hair','Straight Hair','Purple','Green','Football','Basketball','Theme Park','Water Park','Fiction','Nonfiction','Rock','Hip Hop','Star Wars','Star Trek','Mall','Online Shopping','Dishes','Laundry','Bert','Ernie','Rain','Snow','Math','History','Peanut Butter','Jelly','Library','Museum','Horror','Comedy','Reading','Writing','Milk','Juice','Sweet','Sour','Beef','Chicken','Apple Pie','Pumpkin Pie','Baseball','Basketball','Sci-Fi','Fantasy','Nuts','Raisins','The Beatles','The Rolling Stones','Christmas','Halloween','Mercedes','BMW','Ford','Chevy','Podcasts','Radio','Simpsons','Family Guy','Disney','Dreamworks','Rare','Well-Done','Dinner and a Movie','Walk in the Park','The Office','Parks and Rec','Game Night','Movie Night','Neat Room','Messy Room','Mashed Potato','Baked Potato','French Fries','Tater Tots','Turkey','Ham','Thanksgiving','Christmas','Logic','Emotion','U2','Coldplay','Sad Songs','Happy Songs','Netflix','Chill','Sound of Music','Wizard of Oz','Crosswords','Sudoku','Order','Chaos','Dawn','Dusk','Early','Late','Pop','Indie','Rock','Country','Jazz','Classical','Cookies','Brownies','Mild','Spicy','Planning','Improvising','Swimming','Hiking','Classical','Rock & Roll','Colonial','Modern','Abstract','Concrete','Modern Art','Classic Art','Breakfast','Dinner','Dance Party','Pool Party','Practical Gifts','Sentimental Gifts','Chinese Food','Mexican Food','Chinese Food','Thai Food','AC/DC','Guns N\' Roses','Pancakes','French Toast'
  ];
console.log(questionBank.length/2)
  var questionSet = [];

  return {
    getNewQuestionSet: function(total) {
      var rndX;
      //select [totalquestions + 1] pairs from the bank (includes 1 pass)
      for (var i = 0; i <= (total * 2); i += 2) {
        rndX = (Math.floor(Math.random() * (questionBank.length/2)))*2;
        questionSet[i] = questionBank[rndX];
        questionSet[i + 1] = questionBank[rndX + 1];

        //delete question pair from bank so it won't be used twice
        questionBank.splice(rndX, 2);
      };
    },
    question: function(index) {
      return questionSet[index];
    }
  };

})();


// ------------------------------------------------------


// UI Controller
var uiController = (function() {

  var dom = {
    submitNames: 'submitNames',
    selectRounds: 'selectRounds',
    selectQuestions: 'selectQuestions',
    startRound: 'submitContinue',
    playerName: 'txtName',
    header: 'topHeader',
    sectionInstructions: 'sectionInstructions',
    sectionInputNames: 'sectionInputNames',
    sectionChoices: 'sectionThisOrThat',
    choice: 'choice',
    instructionsText: 'instructionsText',
    result: 'sectionResult',
    correct: 'correct',
    incorrect: 'incorrect',
    question: 'question',
    submitPass: 'submitPass',
    formPass: 'formPass',
    rowPass: 'rowPass',
    scoreboard: 'sectionScoreBoard',
    score0: 'scoreEntry0',
    score1: 'scoreEntry1',
    scoreboardContinue: 'frmScoreBoard',
    playAgain: 'frmPlayAgain',
    yesPlayAgain: 'yesPlayAgain',
    noPlayAgain: 'noPlayAgain'
  };
  var domID = function(id) { return document.getElementById(id); } //Make it easer to select elements from the DOM
  
  return {
    getDomStrings: function() {
      return dom;
    },

    displayInstructions: function(name, opponent, curR, totalRounds, guessing) {
      domID(dom.header).innerText = name + ':';
      if (guessing) {
        domID(dom.instructionsText).innerHTML = '<br>Now it\'s time to guess how ' + opponent + ' answered these questions!<br><br>';
      } else {
        domID(dom.instructionsText).innerHTML = '<span  class="blueText" style="font-weight: 800">Round ' + (curR + 1) + ' / ' + totalRounds + '</span><br>Answer each <span  class="blueText">This or That</span> question by tapping your preference from the two options shown. Don\'t think about your answer&mdash;just follow your first instinct. You get one pass per round.';
      }
    },

    displayChoices: function(text1, text2) {
      domID(dom.choice+'1').innerText=text1;
      domID(dom.choice+'2').innerText=text2;
    },

    displayResult: function(correct) {
      domID(dom.question).style.display = 'none';
      domID(dom.result).style.display = 'flex';
      if (correct) {
        domID(dom.correct).style.display = 'block';
        domID(dom.incorrect).style.display = 'none';
      } else {
        domID(dom.correct).style.display = 'none';
        domID(dom.incorrect).style.display = 'block';
      }
    },

    displayScoreboard: function(name0, score0, name1, score1, curR, totalRounds) {
      if (score0 >= score1) {
        domID(dom.score0).innerText = score0 + ' ' + name0;
        domID(dom.score1).innerText = score1 + ' ' + name1;
      } else {
        domID(dom.score0).innerText = score1 + ' ' + name1;
        domID(dom.score1).innerText = score0 + ' ' + name0;
      }
      domID(dom.scoreboard).style.display = 'block';
      if (curR < totalRounds) {
        domID(dom.header).innerText = 'Scores:';
      } else {
        domID(dom.header).innerText = 'Final Scores:';
        domID(dom.scoreboardContinue).style.display = 'none';
        domID(dom.playAgain).style.display = 'block';
      }
      
    }

  };

})();


// -------------------------------------------------------


// Global App Controller
var controller = (function(playerCtrl, questionCtrl, uiCtrl) {
  var curQ = -1; //questison
  var curP = -1; //player
  var otherP = -1;
  var curR = -1; //round
  var total = {
    questions: 0,
    rounds: 0
  }
  var guessing = false; //true when a player is guessing what the other player said
  var passed = false; //true if a player passes a question during the round

  var dom = uiCtrl.getDomStrings();
  var domID = function(id) { return document.getElementById(id); } //Make it easer to select elements from the DOM

  var setUpEventListeners = function() {

    //Submit Names
    domID(dom.submitNames).addEventListener('submit', function(event) {
      // Make sure neither name is left blank
      if (!domID(dom.playerName + '0').value || !domID(dom.playerName + '1').value) {
        alert('You can\'t leave a name blank!');
        return;
      }
      // Make sure names are unique
      if (domID(dom.playerName + '0').value === domID(dom.playerName + '1').value) {
        alert('You can\'t use the same name!');
        return;
      }
      // Get player names
      playerCtrl.addPlayer(domID(dom.playerName + '0').value);
      playerCtrl.addPlayer(domID(dom.playerName + '1').value);

      // Save player names in local storage for future games
      localStorage.setItem('player0name', domID(dom.playerName + '0').value);
      localStorage.setItem('player1name', domID(dom.playerName + '1').value);

      //set and save totals
      total.rounds = domID(dom.selectRounds).value;
      total.questions = domID(dom.selectQuestions).value;
      localStorage.setItem('totalrounds', total.rounds);
      localStorage.setItem('totalquestions', total.questions);

      // Get questions for round 1
      questionCtrl.getNewQuestionSet(total.questions);

      // Show instructions
      uiCtrl.displayInstructions(domID(dom.playerName + '0').value, '', 0, total.rounds, false);
      domID(dom.sectionInputNames).style.display = 'none';
      domID(dom.sectionInstructions).style.display='block';

      // Set variables
      curP = 0; // first player
      otherP = 1; // second player
      curR = 0; // first round
    });

    //Begin Round
    domID(dom.startRound).addEventListener('submit', function(event) {
      domID(dom.sectionInstructions).style.display='none';
      domID(dom.sectionChoices).style.display='block';
      domID(dom.submitPass).disabled = false;
      // Show option to pass, if you're not guessing
      if (guessing) { 
        domID(dom.rowPass).style.display = 'none';
        domID(dom.header).innerText = playerCtrl.player(otherP).name + ' said...';
      } else { 
        domID(dom.rowPass).style.display = 'flex';
      }
      passed = false;
      curQ = -1;
      nextQuestion();
    });

    //Pass
    domID(dom.formPass).addEventListener('submit', function(event) {
      domID(dom.submitPass).disabled = true;
      passed = true;
      answerChoice(0); //record choice as 0, meaning passed
    });

    //Scoreboard -> Continue
    domID(dom.scoreboardContinue).addEventListener('submit', function(event) {
      questionCtrl.getNewQuestionSet(total.questions);
      guessing = false;
      uiCtrl.displayInstructions(playerCtrl.player(0).name, playerCtrl.player(1).name, curR, total.rounds, false);
      domID(dom.scoreboard).style.display = 'none';
      domID(dom.sectionInstructions).style.display='block';
    });

    // Answer choices
    domID(dom.choice + '1').addEventListener('click', function(event) {
      answerChoice(1);
    });
    domID(dom.choice + '2').addEventListener('click', function(event) {
      answerChoice(2);
    });

    function answerChoice(choice) {

      if (!guessing) {
        // if you're not on the guessing phase, record choices as answers
        playerCtrl.recordChoice(curP, curQ, choice);
        nextQuestion();
      } else {  
        // if you are on the guessing phase, see if you're correct
        var correct;
        if (playerCtrl.player(otherP).answers[curQ] === choice) {
          correct = true;
          playerCtrl.addPoint(curP);
        } else {
          correct = false;
        }
        uiCtrl.displayResult(correct);
        // show correct or incorrect for a second, then continue
        setTimeout(function(){
          domID(dom.question).style.display = 'flex';
          domID(dom.result).style.display = 'none';
          nextQuestion();
        }, 750);        

      }
      
      
    };

    var nextQuestion = function() {

      // if you're guessing and the next question is one the other player passed on, skip that question
      if (guessing && !passed && playerCtrl.player(otherP).answers[curQ + 1] === 0 && curQ < (total.questions - 1)) { 
        curQ += 1;
        passed = true;
      }

      if (curQ < total.questions - 1 || (curQ < total.questions && passed)) { //go up to 1 more question if a player passed a question
        curQ += 1;
        uiCtrl.displayChoices(questionCtrl.question(curQ * 2), questionCtrl.question(curQ * 2 + 1));
      } else {
        //finished questions
        if (curP === 1) { //second player
          curP = 0;
          otherP = 1;
          if (guessing) {
            curR += 1; //move to the next round
            guessing = false;
            domID(dom.sectionChoices).style.display = 'none';
            //display scores
            uiCtrl.displayScoreboard(playerCtrl.player(0).name, playerCtrl.player(0).score, playerCtrl.player(1).name, playerCtrl.player(1).score, curR, total.rounds);
            return;
          } else {
            guessing = true;
          }
        } else {
          curP = 1;
          otherP = 0;
        }
        uiCtrl.displayInstructions(playerCtrl.player(curP).name, playerCtrl.player(otherP).name, curR, total.rounds, guessing);
        domID(dom.sectionChoices).style.display = 'none';
        domID(dom.sectionInstructions).style.display='block';
      }
  
    };

    domID(dom.yesPlayAgain).onclick = function(){location.reload()};
    domID(dom.noPlayAgain).onclick = function(){window.open('../index.html','_self')};

  };

  


  return {
     init: function() {

      // Prevent all forms from reloading
      var tagForm = document.getElementsByTagName("form");
      for (var i = 0; i < tagForm.length; i++) {
        tagForm[i].addEventListener('submit', function(event){
          event.preventDefault();
        });
      }

      // if you've already played, load form data from last game
      domID(dom.playerName + '0').value = localStorage.getItem('player0name');
      domID(dom.playerName + '1').value = localStorage.getItem('player1name');
      domID(dom.selectRounds).value = localStorage.getItem('totalrounds');
      domID(dom.selectQuestions).value = localStorage.getItem('totalquestions');
      setUpEventListeners();
     }
  };
})(playerController, questionController, uiController);

controller.init();