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
    'gone skydiving','gone bungee jumping','gone ziplining','gotten fired','been in handcuffs','smoked weed','seen the Grand Canyon','been inside a limo','ridden in an ambulence','been on TV','kissed a stranger','been skinny dipping','cheated on a test','shoplifted','made a prank phone call','been the cause of a collision with another vehicle','broken a bone','had a major surgery','ridden a horse','been naked at a beach','flipped off a cop','had a fake ID','toilet papered somebody\'s house or car','egged somebody\'s house','been arrested','had to get stiches','lied in an interview to get a job','owned a hamster','gone skiing','gone water skiing','gone snowboarding','run a marathon','lived in another country','traveled abroad','seen the Golden Gate Bridge','killed and eaten an animal','shot a bow and arrow','given someone a fake number','had a surprise birthday party','dined and dashed','totaled a car in an accident','been kicked out of a bar','had acupuncture','played poker','slept on the job','hitchhiked','sung karaoke in a public venue','done stand-up comedy','done improv comedy','been on the radio','been on a motorcycle','been in a YouTube video','donated blood','peed in a pool','been on a train','voted third party','been or tried to be a vegan or vegetarian','won money off of scratch off tickets','pooped a pair of pants','walked around barefoot in public','been fishing','picked up a hitchhiker','eaten an insect','been in a helicopter','met a celebrity','snuck into a movie','ridden a mechanical bull','gone cliff jumping','crashed a wedding','played Dungeons and Dragons','sung on stage','been canoeing or kayaking','been on a photo scavenger hunt','gone caving','caught fireflies','speed dated','called the cops on someone','been to New York City','been to China','had an exotic pet','been to Mexico','driven more than 100 MPH (160 km/h)','been in a band','had a tattoo removed','played Truth or Dare','built a sandcastle','slept under a bridge','been on a cruise','gotten evicted','ran from the cops','walked out of a movie','fallen asleep at the wheel','gotten someone else fired','had a crush on a friend\'s parent','thrown up at an amusement park','sent someone to the hospital','lied about a family member dying to get out of something','broken a window','had a near-death experience','seen a tornado','fallen down the stairs','gone on a blind date','lied to get out of a traffic ticket','gotten locked out of the house and gone through the window','ridden an animal other than a horse','had an article published in a newspaper or magazine','forged someone else\'s signature','failed a course in college','slept in a tent','pulled the fire alarm','kept a consistent blog','kept a consistent journal/diary','worked in fast food','worked in retail','pretended to be sick to get out of work','driven for Uber or Lyft'
  ];

  var questionSet = [];

  return {
    getNewQuestionSet: function(total) {
      var rndX;
      //select [totalquestions + 1] from the bank (includes 1 pass)
      for (var i = 0; i <= total; i += 1) {
        rndX = Math.floor(Math.random() * (questionBank.length));
        questionSet[i] = questionBank[rndX];

        //delete question from bank so it won't be used twice
        questionBank.splice(rndX, 1);
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
    questionText: 'questionText',
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
        domID(dom.instructionsText).innerHTML = '<span  class="blueText" style="font-weight: 800">Round ' + (curR + 1) + ' / ' + totalRounds + '</span><br>Answer each <span  class="blueText">Have You Ever</span> question by tapping Yes or No. You get one pass per round.';
      }
    },

    displayQuestion: function(text, name, guessing) {
      guessing ? domID(dom.questionText).innerText = 'Has ' + name + ' ever ' + text + '?' : domID(dom.questionText).innerText = 'Have you ever ' + text + '?'; 
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
        uiCtrl.displayQuestion(questionCtrl.question(curQ), playerCtrl.player(otherP).name, guessing);
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