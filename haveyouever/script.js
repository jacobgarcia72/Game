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
    'gone skydiving','gone bungee jumping','gone ziplining','gotten fired','been in handcuffs','smoked weed','seen the Grand Canyon','been inside a limo','ridden in an ambulence','been on TV','kissed a stranger','been skinny dipping','cheated on a test','shoplifted','made a prank phone call','been the cause of a collision with another vehicle','broken a bone','had a major surgery','ridden a horse','been to a nude beach','flipped off a cop','had a fake ID','toilet papered somebody\'s house or car','egged somebody\'s house','been arrested','had to get stiches','lied in an interview to get a job','owned a hamster','gone skiing','gone water skiing','gone snowboarding','run a marathon','lived in another country','traveled abroad','seen the Golden Gate Bridge','killed and eaten an animal','shot a bow and arrow','given someone a fake number','had a surprise birthday party','dined and dashed','totaled a car in an accident','been kicked out of a bar','had acupuncture','played poker','slept on the job','hitchhiked','sung karaoke in a public venue','done stand-up comedy','done improv comedy','been on the radio','been on a motorcycle','been in a YouTube video','donated blood','peed in a pool','been on a train','voted third party','been or tried to be a vegan or vegetarian','won money off of scratch off tickets','pooped a pair of pants','walked around barefoot in public','been fishing','picked up a hitchhiker','eaten an insect','been in a helicopter','met a celebrity','snuck into a movie','ridden a mechanical bull','gone cliff jumping','crashed a wedding','played Dungeons and Dragons','sung on stage','been canoeing or kayaking','been on a photo scavenger hunt','gone caving','caught fireflies','speed dated','called the cops on someone','been to New York City','been to China','had an exotic pet','been to Mexico','driven more than 100 MPH (160 km/h)','been in a band','had a tattoo removed','played Truth or Dare','built a sandcastle','slept under a bridge','been on a cruise','gotten evicted','run from the cops','walked out of a movie','fallen asleep at the wheel','gotten someone else fired','had a crush on a friend\'s parent','thrown up at an amusement park','sent someone to the hospital','lied about a family member dying to get out of something','broken a window','had a near-death experience','seen a tornado','fallen down the stairs','gone on a blind date','lied to get out of a traffic ticket','gotten locked out of the house and gone through the window','ridden an animal other than a horse','had an article published in a newspaper or magazine','forged someone else\'s signature','failed a course in college','slept in a tent','pulled the fire alarm','kept a consistent blog','kept a consistent journal/diary','worked in fast food','worked in retail','pretended to be sick to get out of work','driven for Uber or Lyft'
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
    banner: '#topHeader',
    gameBody: '#gameBody',
    gameElement: '.gameElement',
    header: '#gameHeader',
    inputForm: '#frmEnterPlayers',
    txtName: ['#txtName0','#txtName1'],
    instructions: '#instructions',
    nextPlayer: '#nextPlayer',
    gameBoard: '#thisOrThat',
    questionText: '#questionText',
    choice: ['#choice1','#choice2'],
    question: '#question',
    result: '#result',
    correct: '#correct',
    incorrect: '#incorrect',
    scoreboard: '#scoreBoard',
    score: ['#scoreEntry0','#scoreEntry1'],
    footer: '#foot',
    continue: '#frmContinue',
    yesNo: '#frmYesNo',
    selectRounds: '#selectRounds',
    selectQuestions: '#selectQuestions'
  };

  
  return {
    getDomStrings: function() {
      return dom;
    },

    displayQuestion: function(text, name, guessing) {
      guessing ? $(dom.questionText).text('Has ' + name + ' ever ' + text + '?') : $(dom.questionText).text('Have you ever ' + text + '?'); 
    },

    displayResult: function(correct) {
      $(dom.question).hide();
      $(dom.result).show();
      if (correct) {
        $(dom.incorrect).hide();
        $(dom.correct).show();
      } else {
        $(dom.incorrect).show();
        $(dom.correct).hide();
      }
    },

    displayScoreboard: function(name0, score0, name1, score1, curR, totalRounds) {
      $(dom.gameBody).show();
      $(dom.gameElement).hide();
      if (score0 >= score1) {
        $(dom.score[0]).text(name0 + ': ' + score0);
        $(dom.score[1]).text(name1 + ': ' + score1);
      } else {
        $(dom.score[1]).text(name0 + ': ' + score0);
        $(dom.score[0]).text(name1 + ': ' + score1);
      }
      $(dom.scoreboard).show();
      if (curR < totalRounds) {
        $(dom.header).text('Scores:').show();
        $(dom.continue).show();
      } else {
        $(dom.header).text('Final Scores:').show();
        $(dom.instructions).html("<p>Play Again?</p>").show();
        $(dom.yesNo).show();
      }
      $(dom.footer).show();
      window.scrollTo(0,0); 
    },

    showScreen: function(screen, player, other, round, totalRounds, guessing) {
      $(dom.gameElement).hide();

      switch (screen) {
        case 'welcome':
          $(dom.header).text('Welcome!').show();
          $(dom.instructions).html('<p>In this game, you\'ll answer a series of <span class="blueText">Have You Ever</span> questions.</p><p>Then you\'ll compete to see who knows the other best!</p>').show();
          break;
        case 'inputPlayers':
          $(dom.inputForm).show();
          break;
        case 'passDevice':
          $(dom.gameBody).show();
          $(dom.banner).text('Have You Ever');
          $(dom.header).text('Pass the device to').show();
          $(dom.nextPlayer).text(player).show();
          $(dom.continue + ' input').val('Continue');
          break;
        case 'getReady':
          $(dom.banner).text(player);
          if (!guessing) {
            $(dom.header).text('Round ' + round + ' / ' + totalRounds).show();
            $(dom.instructions).html('<p>Answer each <span class="blueText">Have You Ever</span> question by tapping Yes or No.</p><p>You get one <span class="blueText">Pass</span> per round.</p>').show();
          } else {
            $(dom.instructions).html('<p>Now it\'s time to guess how ' + other + ' answered these questions!</p>').show();
          }
          $(dom.continue + ' input').val('Begin');
          break;
        case 'playing':
          $(dom.gameBoard).show();
          $(dom.gameBody).hide();
          $(dom.continue + ' input').val('Pass');
          break;
      }
      $(dom.continue).show();
      //the footer should always show unless your guessing
      if (!(guessing && screen==='playing')) {
        $(dom.footer).show();
      }
      window.scrollTo(0,0); 
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
  var curS = 'welcome'; //screen
  var total = {
    questions: 0,
    rounds: 0
  }
  var guessing = false; //true when a player is guessing what the other player said
  var passed = false; //true if a player passes a question during the round

  var dom = uiCtrl.getDomStrings();

  var validateNames = function(name0,name1) {
    // Make sure neither name is left blank
    if (!name0 || !name1) {
      alert('You can\'t leave a name blank!');
      return false;
    }
    // Make sure names are unique
    if (name0 === name1) {
      alert('You can\'t use the same name!');
      return false;
    }
    return true;
  }

  var startGame = function() {

    if (!validateNames($(dom.txtName[0]).val(), $(dom.txtName[1]).val())) {
      throw "Invalid";
    }
    
    for(var i = 0; i < 2; i++) {
      // Get player names
      playerCtrl.addPlayer($(dom.txtName[i]).val());
      // Save player names in local storage for future games
      localStorage.setItem('player' + i + 'name', $(dom.txtName[i]).val());
    }

    //set and save totals
    total.rounds = $(dom.selectRounds).val();
    total.questions = $(dom.selectQuestions).val();
    localStorage.setItem('totalrounds', total.rounds);
    localStorage.setItem('totalquestions', total.questions);

    // Get questions for round 1
    questionCtrl.getNewQuestionSet(total.questions);

    // Set variables
    curP = 0; // first player
    otherP = 1; // second player
    curR = 0; // first round
  }

  var startPlaying = function() {
    passed = false;
    curQ = -1;
    nextQuestion();
  }


  var pass = function() {
    $(dom.continue + ' input').prop("disabled", true);
    passed = true;
    answerChoice(0); //record choice as 0, meaning passed
  } 

  
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
          guessing = false;
          curR += 1; //move to the next round
          //display scores
          curS = 'scores';
          uiCtrl.displayScoreboard(playerCtrl.player(0).name, playerCtrl.player(0).score, playerCtrl.player(1).name, playerCtrl.player(1).score, curR, total.rounds);
          return;
        } else {
          guessing = true;
        }
      } else {
        curP = 1;
        otherP = 0;
      }
      curS = 'passDevice';
      $(dom.continue + ' input').prop("disabled", false);
      uiCtrl.showScreen('passDevice', playerCtrl.player(curP).name);
    }

  };

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
        $(dom.question).show();
        $(dom.result).hide();
        nextQuestion();
      }, 750);        
    }
  };

  var setUpEventListeners = function() {

    $(dom.continue).on('submit', function(){
      switch (curS) {
        case 'welcome':
          curS = 'inputPlayers';
          uiCtrl.showScreen(curS);
          return; //players aren't defined yet
        case 'inputPlayers':
          try {
            startGame();
            curS = 'passDevice';
          } catch(err) {
            return; //abort if name forms weren't filled out properly
          }
          break;
        case 'passDevice':
          curS = 'getReady';
          break;
        case 'getReady':
          curS = 'playing';
          startPlaying();
          break;
        case 'playing':
          pass();
          return;
        case 'scores':
          curS = 'passDevice';
          questionCtrl.getNewQuestionSet(total.questions);
          break;
      }
      uiCtrl.showScreen(curS, playerCtrl.player(curP).name, playerCtrl.player(otherP).name, curR+1, total.rounds, guessing);
    });

    // Answer choices
    $(dom.choice[0]).on('click', function(event) {
      answerChoice(1);
    });
    $(dom.choice[1]).on('click', function(event) {
      answerChoice(2);
    });

    $(dom.yesNo).on('submit', function(){
      var choice = $(document.activeElement).data('index');
      if (choice===0) {
        location.reload();
      } else if (choice===1) {
        window.open('../index.html','_self');
      }
    });
  };

  


  return {
     init: function() {

      //prevent all forms from reloading
      $("form").on("submit", function(event){
        event.preventDefault();
      });

      // if you've already played, load form data from last game
      for(var i = 0; i < 2; i++) {
        // Get player names
        $(dom.txtName[i]).val(localStorage.getItem('player' + i + 'name'));
      }
      $(dom.selectRounds).val(localStorage.getItem('totalrounds'));
      $(dom.selectQuestions).val(localStorage.getItem('totalquestions'));

      setUpEventListeners();

      uiCtrl.showScreen('welcome');
     }
  };
})(playerController, questionController, uiController);

controller.init();