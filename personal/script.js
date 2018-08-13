$(function(){


    //Data Controller
    var dataController = (function() {
      var getQuestionBank = function() {
        return [
        "What is a song that Jacob can never get tired of listening to?",
        "What would Jacob be doing for a living in an alternate reality?",
        "What does Jacob wish he would spend more time doing?",
        "Describe Jacob's favorite shirt.",
        "What would be unique about Jacob's dream house?",
        "Where has Jacob never been that he's always wanted to go?",
        "What job does Jacob feel like he would be terrible at?",
        "What's Jacob's favorite drink?",
        "What is some place that Jacob hopes he never has to go back to?",
        "Gun to Jacob's head, he has to recite one song perfectly word for word if he wants to live. What song does he choose?",
        "What takes up too much of Jacob's time?",
        "What does Jacob wish more people knew?",
        "What is Jacob's dream car?",
        "What is Jacob most looking forward to right now?",
        "What's a website that Jacob goes to often that other people don't?",
        "What's a song that Jacob loves that's kind of embarrassing to admit?",
        "If Jacob had a superpower, what would it be?",
        "What is one of Jacob's greatest regrets?",
        "What is one of Jacob's proudest accomplishments from the past five years?",
        "What is something weird or unusual that Jacob finds attractive?",
        "What is something Jacob hopes he accomplishes before he dies?",
        "What is a toy from Jacob's childhood that he remembers fondly?",
        "What show does Jacob still have fond memories of watching as a kid?",
        "Who does Jacob think would be really fun to see in concert, but he's never seen them?",
        "If Jacob was in charge of providing dinner for this group, what would everyone be eating?",
        "What's Jacob's go-to place for lunch?",
        "What is Jacob's favorite restaurant?",
        "Where can Jacob often be found on a weekend night?",
        "What does Jacob think would make his job a lot more exciting?",
        "If Jacob could change one thing about his life, what would it be?",
        "What is a weird quirk about Jacob?",
        "What is something Jacob enjoys doing in his free time that not everyone knows he does?",
        "Where does Jacob go to feel more at peace with his life?",
        "If Jacob could change something about his past, what would it be?",
        "What is a goal that Jacob has that he is working towards?",
        "What is something Jacob wants to see before he dies?",
        "If Jacob were president, what would be his top issue?",
        "What do a lot of people like that Jacob doesn't like?",
        "What is Jacob's favorite fast food place?",
        "What is currently Jacob's favorite song?",
        "What is currently Jacob's favorite show?",
        "Where would Jacob spend more time if he could?",
        "What was something Jacob loved when he was younger that he doesn't care too much for anymore?",
        "What is Jacob afraid of?",
        "Besides money, what would Jacob like to be given as a gift?",
        "What would be Jacob's ideal place to take a date?",
        "What is something Jacob owns that means a lot to him?",
        "What does Jacob typically listen to while he is driving?",
        "What does Jacob typically get to drink when he gets fast food?",
        "What's a song that makes Jacob sad?",
        "What's a song that always puts Jacob in a good mood?",
        "What keeps Jacob up at night?",
        "Jacob's playlist is filled with: __________?",
        "Jacob has one day to live. What is he doing?",
        "What is something Jacob likes about his appearance?",
        "If Jacob could take a day trip right now, where would he go?",
        "What will Jacob be doing after he retires?",
        "What does Jacob want to do after this game?",
        "What is the worst job Jacob ever had?",
        "What is something Jacob has always wanted to do better he hasn't gotten around to yet?",
        "If Jacob had to spend $10,000 in one day, how would he spend it?",
        "What is the first thing Jacob likes to do it the morning?",
        "What song gets Jacob pumped up?",
        "If Jacob had to move to another country, where would it be?"
        ]; // use he is for he's!
      }
      

      var questionBank = getQuestionBank();

      var players = [];

      var Player = function(name, gender) {
        this.name = name;
        this.gender = gender;
        this.answer = '';
        this.points = 0;
        this.pairIndex = 0;
      }

      var createArrayOfIndices = function(num) {
        var indices = [];
        for (var i = 0; i < num; i++) {
          indices.push(i); 
        }
        return indices;
      }

      var randomizeOrder = function(arr) {
        var indices = createArrayOfIndices(arr.length);

        var newArr = [];
        for (var i = 0; i < arr.length; i ++) {
          var rndX; //variable for random calculations
          rndX = Math.floor(Math.random() * indices.length);
          var index = indices[rndX];
          newArr.push(arr[index]);
          indices.splice(rndX,1); //remove order number chosen so it won't be used again
        }
        return newArr;
      }

      var pairPlayers = function() {
        var indices = createArrayOfIndices(players.length);
        var lastPlayer = players.length-1;
        
        for (var i = 0; i < lastPlayer; i++) { //randomize pair for each player, but stop before last player

          while (true) {
            var rndX = Math.floor(Math.random() * (indices.length)); 
            var pair = indices[rndX];
            //as long as pair index is not player's index, we're good
            if (pair !== i) {
              indices.splice(rndX,1); //remove player index for player chosen so it won't be used again
              players[i].pairIndex = pair;
              break;
            } 
          }
        }

        // once there is only 1 player left to pair...
        var pair = indices[0];

        // see if last player would be paired with himself
        if (pair === lastPlayer) {
        // if so, swap with a random player
          var rndX = Math.floor(Math.random() * lastPlayer); 
          players[lastPlayer].pairIndex = players[rndX].pairIndex; //grab pair from the rnd player
          players[rndX].pairIndex = lastPlayer; //finish swap
        } else {
          players[lastPlayer].pairIndex = pair;
        }
      }

      //use for 'You' or 'They' to drop the -s at the end of a verb (e.g. he eats => you eat)
      var dropTheS = function(text, pronoun) {
        text = text.split(pronoun + ' ');

        for (var i = 1; i < text.length; i++) {
          //get the index of the last letter of the word immediately after 'you'
          var lastLetter = text[i].length - 1;
          if (text[i].indexOf(' ') > 0 && text[i].indexOf(' ') - 1 < lastLetter) {lastLetter = text[i].indexOf(' ') - 1;}; 
          if (text[i].indexOf('?') > 0 && text[i].indexOf('?') - 1 < lastLetter) {lastLetter = text[i].indexOf('?') - 1;}; 
          if (text[i].indexOf(',') > 0 && text[i].indexOf(',') - 1 < lastLetter) {lastLetter = text[i].indexOf(',') - 1;}; 
          if (text[i].indexOf('.') > 0 && text[i].indexOf('.') - 1 < lastLetter) {lastLetter = text[i].indexOf('.') - 1;}; 

          if (text[i][lastLetter] === 's') { //if there's an s at the end
            //if it ends in -shes, -sses, -xes, -ces (finishes, tosses, fixes, etc.)
            if (text[i].substring(lastLetter-3,lastLetter+1) === 'shes' || text[i].substring(lastLetter-3,lastLetter+1) === 'sses' || text[i].substring(lastLetter-2,lastLetter+1) === 'ces' || text[i].substring(lastLetter-2,lastLetter+1) === 'xes') { 
              text[i] = text[i].slice(0,lastLetter-1) + text[i].slice(lastLetter+1); // erase -es
            } else {
              text[i] = text[i].slice(0,lastLetter) + text[i].slice(lastLetter+1); // erase -s
            }
          }
        }
        text = text.join(pronoun + ' '); //put string back together
        return text;
      }

      return {

        randomizePlayers: function() {
          var playerIndices = createArrayOfIndices(players.length);
          playerIndices = randomizeOrder(playerIndices);

          for (var i = 0; i < playerIndices.length; i ++) {
            players.push(players[playerIndices[i]]); 
          }
          players.splice(0,playerIndices.length);

          pairPlayers();
        },

        getQuestion: function() {

          if (questionBank.length === 0) { // if the game has run out of questions to use, 
            questionBank = getSideQuestBank(); // reset the bank
          }
  
          var rndX = Math.floor(Math.random() * (questionBank.length));
          var question = questionBank[rndX]; //returns a string
          questionBank.splice(rndX, 1);
          return question;
        },

        makeThirdPerson: function(text, name, gender) {
          if (gender=='he') {
            return text.split('Jacob').join(name).split(' he is ').join(' he\'s ');
          } else if (gender=='she') {
            return text.split('Jacob').join(name).split(' he is ').join(' she\'s ').split(' his ').join(' her ').split(' he ').join(' she ').split(' him').join(' her').split(' he\'s ').join(' she\'s ');
          } else {
            text = text.split('Jacob').join(name).split(' he is ').join(' they\'re ').split(' his ').join(' their ').split(' he ').join(' they ').split(' them').join(' their').split(' he\'s ').join(' they\'ve ').split(' they has').join(' they have').split('does they').join('do they').split('they does').join('they do').split(' they goes').join(' they go').split(' they was').join(' they were').split(' was they ').join(' were they ').split(' is they').join(' are they');
            text = dropTheS(text, 'they');
            return text;
          }
        },

        makeSecondPerson: function(text) {
          text = text.split('Jacob\'s').join('your').split('Jacob').join('you').split(' he is ').join(' you\'re ').split(' has').join(' have').split(' his ').join(' your ').split(' he ').join(' you ').split(' him').join(' you').split(' he\'s ').join(' you\'ve ').split(' is you ').join(' are you ').split(' you was').join(' you were').split(' was you ').join(' were you ').split('does you').join('do you').split('you does').join('you do').split(' you goes').join(' you go');

          text = dropTheS(text, 'you');

          //capitalize 'you' if it's the first word
          if (text.substring(0,3)==='you') {
            text = 'Y' + text.slice(1);
          }
          return text;
        },
  
        createPlayers: function(playerDetails) { //takes an array of [[name, gender], ...]
          for (var i = 0; i < playerDetails.length; i++) {
            var name = playerDetails[i][0]; //name
            var gender = playerDetails[i][1]; //gender
            players.push(new Player(name, gender)); //name, gender'
            //save info for future games
            localStorage.setItem('player' + i + 'name', name);
            localStorage.setItem('player' + i + 'gender', gender);
            localStorage.setItem('numPlayers', playerDetails.length);
          };
          this.randomizePlayers();
        },

        addPoint: function(playerIndex) {
          players[playerIndex].points += 1;
        },

        submitAnswer: function(answer, playerIndex) {
          players[playerIndex].answer = answer;
        },

        //returns array of answers in a random order
        getAnswers: function() {
          var answers = [];
          for (var i = 0; i < players.length; i++) {
            answers.push(players[i].answer);
          }
          answers = randomizeOrder(answers);
          return answers;
        },

        //returns array of player names and scores in descending order
        getPlayerScores: function() {
          var scores = [['', -1]];

          for (var i = 0; i < players.length; i++) {
            for (var j = 0; j < scores.length; j++) {
              if (players[i].points > scores[j][1]) {
                scores.splice(j, 0, [players[i].name, players[i].points]);
                break;
              }
            }
          }
          scores.pop(); //at this point the placeholder (['',-1]) should be at the end
          return scores;
        },
  
        player: function(index) {
          return {
            name: players[index].name,
            points: players[index].points,
            gender: players[index].gender,
            answer: players[index].answer,
            pair: {
              index: players[index].pairIndex,
              name: players[players[index].pairIndex].name,
              gender: players[players[index].pairIndex].gender,
              answer: players[players[index].pairIndex].answer
            }
          }
        }

      }
    })();


    //UI Controller
    var uiController = (function() {

      var dom = {
        nameInputs: '#nameInputs',
        continue: '#frmContinue',
        yesNo: '#frmYesNo',
        instructions: '#instructions',
        answerBox: '#answerBox',
        scoreBoard: '#scoreBoard',
        frmEnterPlayers: '#frmEnterPlayers',
        header: '#gameHeader',
        footer: '#foot',
        nextPlayer: '#nextPlayer',
        options: '#frmButtons',
        yes: '#submitYes',
        no: '#submitNo',
        banner: ['.gameBanner','#gameBanner1','#gameBanner2'],
        btnNumPlayers: '.btnNum',
        btnGender: '.btnGender',
        gameElement: '.gameElement',
        playerNameInput: '.playerNameInput',
        numRounds: '#numRounds'
      };

      var rndMessage = function(type, name) {
        var messages = [];
        switch (type) {
          case 'correctHead':
            messages = [
              'Congrats, ' + name + '!',
              'You\'re Awesome!',
              'That\'s Right!',
              'That\'s Correct!',
              'You So Right!',
              'Go ' + name + '!',
              'Score!'
            ];
            break;
          case 'correctBody':
            messages = [
              'You\'ve earned a point!',
              'Point for you!',
              'Have a point!',
              'You get a point!',
              'Enjoy that point you earned!',
              'That\'s a classic ' + name + ' answer!',
              'You know ' + name + ' so well!'
            ];
            break;
          case 'incorrectHead':
            messages = [
              'Nope!',
              'Incorrect!',
              'Too Bad!',
              'Wrong Answer!',
              'Really, ' + name + '?'
            ];
            break;
          case 'incorrectBody':
            messages = [
              'No point for you!',
              'Guess you don\'t know ' + name + ' as well as you thought you did!',
              'You really should get to know ' + name + ' better!',
              'Better luck next time!',
              'Yeah, that\'s not right at all!',
              'Come on. You can do better!',
              'We expected better things from you!'
            ];
            break;
        }
        var rndX = Math.floor(Math.random() * (messages.length)); 
        return messages[rndX];
      }

      
      return {

        getDomStrings: function() {
          return dom;
        },
  
        createPlayerInputs : function() {
          var html = '<div class="row">';
          for (var i = 0; i <= 8; i++) {
            var name = localStorage.getItem('player'+i+'name');
            if (!name) {name='';};
            var gender = localStorage.getItem('player'+i+'gender');
            if (!gender) {gender='';};
            var heClassSelected = gender === 'he' ? 'greenSelected' : '';
            var sheClassSelected = gender === 'she' ? 'greenSelected' : '';
            html += '<div class="col-50"><div id="rowPlayer' + i + '" style="display:none;"><input type="text" tabindex="' + (i + 1) + '" value="' + name + '" class="playerNameInput" id="txtName'+ i +'"><div data-index="'+ i +'" data-gender="'+ gender +'" id="gender'+ i +'"><input type="button" value="he" class="greenHover btnGender ' + heClassSelected +'"><input type="button" value="she" class="greenHover btnGender ' + sheClassSelected +'"></div></div></div>';
            if (i%2===1 && i) {
              html += '</div><div class="row">';
            }
          };
          html+="</div>";
          $(dom.nameInputs).html(html);
        },


        selectNumPlayers: function(numPlayers) {
          $('input[class *= "btnNum"]').removeClass("greenSelected"); //deselect all buttons
          $(dom.btnNumPlayers+'[value="' + numPlayers + '"]').addClass("greenSelected"); //show selected
  
          for (var i = 0; i < numPlayers; i++) {
            $('#rowPlayer' + i).show()
          }
          for (var i = numPlayers; i <= 8; i++) {
            $('#rowPlayer' + i).hide()
          }
        },

        selectGender: function(playerIndex, gender) {
          var otherGender = gender === 'he' ? 'she' : 'he';
          $('div#gender' + playerIndex + ' > input[value="' + otherGender + '"').removeClass("greenSelected"); //deselect other gender
          $('div#gender' + playerIndex + ' > input[value="' + gender + '"').val(gender).addClass("greenSelected"); //select gender
          $('div#gender' + playerIndex).data('gender', gender); //set gender
        },

        showOptions: function(captions) {
          var html = '';
          for (var i = 0; i < captions.length; i++) {
            html += '<input type="submit" value="' + captions[i] + '" class="greenHover" id="option' + i + '" data-index="' + i + '"><br>';
          };
          $(dom.options).html(html).show();
        },

        displayScoreboard: function(playerScores, curR, totalRounds) {
          $(dom.gameElement).hide();
          $(dom.scoreBoard).html('');
          
          for (var i = 0; i<playerScores.length; i++) {
            $(dom.scoreBoard).append('<p id="scoreEntry' + i + '">' + playerScores[i][0] + ':&nbsp;&nbsp;' + playerScores[i][1] + '</p>').show();
          }

          $(dom.banner[2]).text('Scores');
          if (curR < totalRounds) {
            $(dom.banner[1]).text('');
            /////show scores
            $(dom.continue + ' input').val('Continue');
            $(dom.continue).show();
          } else {
            $(dom.banner[1]).text('Final');
            $(dom.instructions).html("<p>Play Again?</p>").show();
            $(dom.yesNo).show();
          }
          $(dom.footer).show();
          window.scrollTo(0,0); 
        },

        showScreen: function(screen, player, text, round, totalRounds) {
          $(dom.gameElement).hide();

          switch (screen) {
            case 'welcome':
              $(dom.header).text('Welcome!').show();
              $(dom.instructions).html('<p>How well do you know your friend group?</p><p>This is the place to find out!</p><p>In this game, you\'ll answer some personal questions about yourself, then figure out who said what!</p>').show();
              break;
            case 'inputPlayers':
              numPlayers = localStorage.getItem('numPlayers')//load number from previous game
              if (!numPlayers) {numPlayers=3}; //default
              this.selectNumPlayers(numPlayers);
              $(dom.header).text("Number of Players:").show();
              $(dom.frmEnterPlayers).show();
              break;
            case 'instructions':
              $(dom.banner[1]).text('Read');
              $(dom.banner[2]).text('Aloud');
              $(dom.header).text('Instructions:').show();
              $(dom.instructions).html('<p>At the start of each round, a new question will be read to the group.</p><p>Don\'t answer the question out loud. Each player will have the opportunity to enter his or her answer secretly.</p><p>Once all answers have been recorded, players will take turns guessing who said what.</p><p>At the end of ' + totalRounds + ' rounds, the player with the most correct guesses wins!</p>').show();
              $(dom.continue + ' input').val('Continue');
              break;
            case 'guessingIntro':
              $(dom.banner[1]).text('Read');
              $(dom.banner[2]).text('Aloud');
              $(dom.header).text('Instructions:').show();
              $(dom.instructions).html('<p>Now it\'s time to figure out who said what!</p><p>Each player will guess what one other player said.</p><p>This half of the round is not secret. Read your question and your guess out loud so other players can follow along.</p>').show();
              $(dom.continue + ' input').val('Continue');
              break;
            case 'question':
              $(dom.banner[1]).text('Read');
              $(dom.banner[2]).text('Aloud');
              if (round===0) {
                $(dom.header).text('First Question:').show();
              } else if (round===totalRounds-1) {
                $(dom.header).text('Final Question:').show();
              } else {
                $(dom.header).text('Next Question:').show();
              }
              $(dom.instructions).html('<p>' + text + '</p>').show();
              $(dom.continue + ' input').val('Continue');
              break;
            case 'passDevice':
              $(dom.banner[1]).text('Round');
              var roundNumbers = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'];
              $(dom.banner[2]).text(roundNumbers[round]);
              $(dom.header).text('Pass the device to').show();
              $(dom.nextPlayer).text(player).show();
              $(dom.continue + ' input').val('Continue');
              break;
            case 'inputAnswer':
              $(dom.banner[1]).text('Hey');
              $(dom.banner[2]).text(player);
              $(dom.instructions).html('<p>' + text + '</p>').show();
              $(dom.continue + ' input').val('Submit');
              $(dom.answerBox).val('').show();
              break;
            case 'guessAnswer':
              $(dom.banner[1]).text('Hey');
              $(dom.banner[2]).text(player);
              $(dom.instructions).html('<p>' + text + '</p>').show();
              $(dom.options).show();
              break;
            case 'correct':
              $(dom.header).text(rndMessage('correctHead', player)).show();
              $(dom.instructions).html('<p>' + rndMessage('correctBody', text) + '</p>').show();
              $(dom.continue + ' input').val('Continue');
              break;
            case 'incorrect':
              $(dom.header).text(rndMessage('incorrectHead', player)).show();
              $(dom.instructions).html('<p>' + rndMessage('incorrectBody', text) + '</p>').show();
              $(dom.continue + ' input').val('Continue');
              break;
          }

          if (screen !== 'guessAnswer') {
            $(dom.continue).show();
            $(dom.footer).show();
          }

          window.scrollTo(0,0); 
        }

      }

    })();


    //Global App Controller
    var controller = (function(dataCtrl, uiCtrl) {

      var currentScreen = 'welcome';
      var curR = 0;
      var curP = 0;
      var numPlayers = 3;
      var currentPlayer = function(){
        return dataCtrl.player(curP);
      }
      var totalRounds = 5;
      var question = '';
      var guessing = false; //true when a player is guessing what the other player said
      var dom = uiCtrl.getDomStrings();

      var nextPlayer = function() {
        if (curP===numPlayers-1) {
          curP = 0;
          if (guessing) {
            guessing = false;
            curR += 1;
            question = dataCtrl.getQuestion();
          } else {
            guessing = true;
          }
        } else {
          curP += 1;
        }
      }

      var validateNames = function() {
        var num = $('.greenSelected').val();
        var names = [];
        for (var i = 0; i < num; i++) {
          var newName = $('#txtName'+ i).val();
          if (!newName) {
            alert('You can\'t leave a name blank!');
            return false;
          } else {
            names.push(newName);
          }
        };
        for (var i = 0; i < num; i++) {
          for (var j = 0; j < num; j++) {
            if (i !== j && names[i]===names[j]) {
              alert('You can\'t have more than one player with the same name!');
              return false;
            }
          }
        }
        return true;
      };



      //submit player names
      var submitPlayerNames = function(){
        numPlayers = $('.greenSelected').val();
        var playerDetails = []; //array of names and genders
        for (var i = 0; i < numPlayers; i++) {
          playerDetails.push([
            $('#txtName'+ i).val(), //name
            $('#gender' + i).data('gender') //gender
          ]);
        };
        dataCtrl.createPlayers(playerDetails);
      };

      var setRounds = function(){
        totalRounds = $(dom.numRounds).val();
        localStorage.setItem('numRounds',totalRounds);
      };
      var getRounds = function(){
        totalRounds = localStorage.getItem('numRounds');
        if (!totalRounds) {
            totalRounds=5;
          };
        $(dom.numRounds).val(totalRounds);
      };

      var submitAnswer = function(answer){
        if (!answer) {
          alert('Oops! You forgot something! Answer the question, ' + currentPlayer().name + '!');
          return false;
        }
        dataCtrl.submitAnswer(answer, curP);
        nextPlayer();
        return true;
      };

      var submitGuess = function(correct){
        if (correct) {
          dataCtrl.addPoint(curP);
          currentScreen = 'correct';
        } else {
          currentScreen = 'incorrect';
        }
        uiCtrl.showScreen(currentScreen, currentPlayer().name, currentPlayer().pair.name);
        nextPlayer();
      };

      var setEventListeners = function() {
        
        //num of player buttons
        $(dom.btnNumPlayers).on('click', function(){
          var numPlayers = $(this).val();
          uiCtrl.selectNumPlayers(numPlayers);
        });
  
        //gender buttons
        $(dom.btnGender).on('click', function(){
          var gender = $(this).val();
          var playerIndex = $(this).parent().data('index');
          uiCtrl.selectGender(playerIndex, gender);
        });

        //continue button
        $(dom.continue).on('submit', function(){
          var text = '';

          switch(currentScreen){
            case 'welcome':
              currentScreen = 'inputPlayers';
              getRounds();
              uiCtrl.showScreen(currentScreen);
              return; //players aren't defined yet
            case 'inputPlayers':
              if (validateNames()) {
                currentScreen = 'instructions';
                submitPlayerNames();
                setRounds();
                question = dataCtrl.getQuestion();
                text = dataCtrl.makeSecondPerson(question);
              } else {
                return; //abort if name forms weren't filled out properly
              }
              break;
            case 'passDevice': 
              if (guessing) {
                currentScreen = 'guessAnswer';
                text = dataCtrl.makeThirdPerson(question, currentPlayer().pair.name, currentPlayer().pair.gender);
                uiCtrl.showOptions(dataCtrl.getAnswers());
                setEventListenersForOptions();
              } else {
                currentScreen = 'inputAnswer';
                text = dataCtrl.makeSecondPerson(question);
              }
              break;
            case 'inputAnswer':
              if (submitAnswer($(dom.answerBox).val())) {
                if (curR === 0 && curP === 0) { //give an introduction to how the guessing round works on the first go through
                  currentScreen = 'guessingIntro';
                } else {
                  currentScreen = 'passDevice';
                }
              } else {
                return; //abort if answer was left blank
              }
              break;
            case 'correct':
            case 'incorrect':
              if (curP === 0) {
                currentScreen = 'scores';
                uiCtrl.displayScoreboard(dataCtrl.getPlayerScores(), curR, totalRounds);
                return;
              } else {
                currentScreen = 'passDevice';
              }
              break;
            case 'instructions':
            case "scores":
              currentScreen = 'question';
              text = dataCtrl.makeSecondPerson(question);
              break;
            case "question":
            case 'guessingIntro':
              currentScreen = 'passDevice';
              break;
          }

          uiCtrl.showScreen(currentScreen, currentPlayer().name, text, curR, totalRounds);
        });

        //Play Again?
        $(dom.yesNo).on('submit', function(){
          var choice = $(document.activeElement).data('index');
          if (choice===0) {
            location.reload();
          } else if (choice===1) {
            window.open('../index.html','_self');
          }
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
      }

      var setEventListenersForOptions = function() {
        $('[id^="option"]').on('click', function(){
          var correct = ($(this).val().trim().toLowerCase() === currentPlayer().pair.answer.trim().toLowerCase());
          submitGuess(correct);
        });
      }

      return {
        init: function() {
  
          uiCtrl.createPlayerInputs();
          
          //prevent all forms from reloading
          $("form").on("submit", function(event){
            event.preventDefault();
          });
          
          setEventListeners();

          uiCtrl.showScreen('welcome');

        }
      }
    })(dataController, uiController);


    controller.init();

});