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
    'Cats','Dogs','Android','iPhone','Cars','Trucks','Mountains','Beach','Waffles','Pancakes','City','Country','Morning','Night','Apples','Oranges','\'NSYNC','Backstreet Boys','Whole Grain','White Bread','Nacho Cheese','Cool Ranch','Batman','Superman','Marvel','DC','Bowling','Laser Tag','Ferrari','Lamborghini','Summer','Winter','Spring','Fall','Police','Fire Fighters','Pirates','Ninjas','Pen','Pencil','Red','Blue','Blondes','Brunettes','Flight','Invisibility','Fortune','Fame','Book','Movie','Sports','Theatre','Hot Dog','Hamburger','Bacon','Sausage','Cake','Pie','Big Party','Small Gathering','Pizza','Tacos','Driver','Front Seat','Humor','Intelligence','Fruits','Veggies','Board Games','Video Games','Mac','PC','Soup','Salad','Soup','Sandwich','Ice Cream','Frozen Yogurt','Chocolate','Vanilla','Hamburger','Chicken Sandwich','Cheetos','Doritos','Mexican Food','Italian Food','M\&M\'s','Skittles','Spaghetti','Pizza','Ketchup','Mustard','Apple Juice','Orange Juice','Facial Hair','Clean Shaven','Curly Hair','Straight Hair','Purple','Green','Football','Basketball','Theme Park','Water Park','Fiction','Nonfiction','Rock','Hip Hop','Star Wars','Star Trek','Mall','Online Shopping','Dishes','Laundry','Bert','Ernie','Rain','Snow','Math','History','Peanut Butter','Jelly','Library','Museum','Horror','Comedy','Reading','Writing','Milk','Juice','Sweet','Sour','Beef','Chicken','Apple Pie','Pumpkin Pie','Baseball','Basketball','Sci-Fi','Fantasy','Nuts','Raisins','The Beatles','The Rolling Stones','Christmas','Halloween','Mercedes','BMW','Ford','Chevy','Podcasts','Radio','Simpsons','Family Guy','Disney','Dreamworks','Rare','Well-Done','Dinner and a Movie','Walk in the Park','The Office','Parks and Rec','Game Night','Movie Night','Neat Room','Messy Room','Mashed Potato','Baked Potato','French Fries','Tater Tots','Turkey','Ham','Thanksgiving','Christmas','Logic','Emotion','U2','Coldplay','Sad Songs','Happy Songs','Netflix','Chill','Sound of Music','Wizard of Oz','Crosswords','Sudoku','Order','Chaos','Dawn','Dusk','Early','Late','Rock','Country','Jazz','Classical','Cookies','Brownies','Mild','Spicy','Planning','Improvising','Swimming','Hiking','Classical','Rock & Roll','Colonial','Modern','Abstract','Concrete','Modern Art','Classic Art','Breakfast','Dinner','Dance Party','Pool Party','Practical Gifts','Sentimental Gifts','Chinese Food','Mexican Food','Chinese Food','Thai Food','AC/DC','Guns N\' Roses','Pancakes','French Toast','Lightning Bugs','Fireflies','Highway','Freeway','Pop','Soda','Sneakers','Tennis Shoes','Chocolate','Strawberry','Johnny Cash','Willie Nelson','Iron Man','Captain America','Elvis','Michael Jackson','Bowser','Donkey Kong','Oprah','Ellen','Harry Potter','Lord of the Rings'
  ];

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
    banner: '#topHeader',
    gameBody: '#gameBody',
    gameElement: '.gameElement',
    header: '#gameHeader',
    inputForm: '#frmEnterPlayers',
    txtName: ['#txtName0','#txtName1'],
    instructions: '#instructions',
    nextPlayer: '#nextPlayer',
    gameBoard: '#thisOrThat',
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

    displayChoices: function(text1, text2) {
      $(dom.choice[0]).text(text1);
      $(dom.choice[1]).text(text2);
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
      $(dom.banner).text('This or That');
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
        $(dom.continue + ' input').val('Continue');
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
          $(dom.instructions).html('<p>In this game, you\'ll answer a series of <span class="blueText">This or That</span> questions, selecting your preference from two options.</p><p>Then you\'ll compete to see who knows the other best!</p>').show();
          $(dom.continue + ' input').val('Continue');
          break;
        case 'inputPlayers':
          $(dom.inputForm).show();
          break;
        case 'passDevice':
          $(dom.gameBody).show();
          $(dom.banner).text('This or That');
          $(dom.header).text('Pass the device to').show();
          $(dom.nextPlayer).text(player).show();
          $(dom.continue + ' input').val('Continue');
          break;
        case 'getReady':
          $(dom.banner).text(player);
          if (!guessing) {
            $(dom.header).text('Round ' + round + ' / ' + totalRounds).show();
            $(dom.instructions).html('<p>Answer each <span class="blueText">This or That</span> question by tapping your preference. Don\'t think about your answer. Just go with your first instinct.</p><p>You get one <span class="blueText">Pass</span> per round.</p>').show();
          } else {
            $(dom.instructions).html('<p>Now it\'s time to guess how ' + other + ' answered these questions!</p>').show();
          }
          $(dom.continue + ' input').val('Begin');
          break;
        case 'playing':
          $(dom.gameBoard).show();
          $(dom.gameBody).hide();
          $(dom.continue + ' input').val('Pass');
          if (guessing) {$(dom.banner).text(other + ' said...');};
          break;
      }
      $(dom.continue).show();
      //the footer should always show unless you're guessing
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
      uiCtrl.displayChoices(questionCtrl.question(curQ * 2), questionCtrl.question(curQ * 2 + 1));
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

    // text inputs
    $('input[type="text"]').focus(function() {
      $(dom.footer + ' footer').addClass('keyboardOpen');
      $(dom.footer + ' .whiteSpace').addClass('keyboardOpen');
    });
    $('input[type="text"]').blur(function() {
      $(dom.footer + ' footer').removeClass('keyboardOpen');
      $(dom.footer + ' .whiteSpace').removeClass('keyboardOpen');
    });

    //Play Again?
    $(dom.yesNo).on('submit', function(){
      var choice = $('input[type=submit]:focus').data('index');
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
      total.rounds = localStorage.getItem('totalrounds');
      if (!total.rounds) {total.rounds=5};
      $(dom.selectRounds).val(total.rounds);
      total.questions = localStorage.getItem('totalquestions');
      if (!total.questions) {total.questions=5};
      $(dom.selectQuestions).val(total.questions);

      setUpEventListeners();

      uiCtrl.showScreen('welcome');
     }
  };
})(playerController, questionController, uiController);

controller.init();