$(function(){

  //Data Controller
  var dataController = (function() {

    var getBank = function(bankType) {
      url = 'https://jacobgarcia72.github.io/Game/sidequest/data.json';

      $.getJSON(url)
      .done(function(data){
        if(bankType==='sideQuests') {
          sideQuestBank = data.sideQuests;
        } else {
          mainQuestBank = data.mainQuests;
        }
      })
      .fail(function(){
        if(bankType==='sideQuests') {
          sideQuestBank = [['[Error]','[Error: Failed to load.]']];
        } else {
          alert("Failed to load necessary data.");
          mainQuestBank = [{coins:0,pages:[{caption:'[Error: Failed to load.]',options:[{caption:'Continue',nextPage:2}]}]}];
        }
      });
    };

    var sideQuestBank;
    getBank('sideQuests');
    
    var mainQuestBank;
    getBank('mainQuests');

    var players = [];
    var Player = function(name, gender) {
      this.name = name;
      this.gender = gender;
      this.points = 10;
      this.quests = [];
    };

    var formatQuest = function(quest, playerIndex, type) {
      //create an array of all player indices expect curP
      var otherIndices = [];
      for (var i = 0; i < players.length; i++) {
        if (i !== playerIndex) {
          otherIndices.push(i);
        };
      };

      //create an array with curP at [0] and two randomly chosen players at [1] and [2]
      var playerIndices = [playerIndex];
      for (var i = 0; i < 2; i++) {
        var rndX = Math.floor(Math.random() * (otherIndices.length));
        var rndP = otherIndices[rndX];
        otherIndices.splice(rndX, 1);
        playerIndices.push(rndP);
      };


      //Format constructor
      var Format = function(name, gender) {
        this.name = name;
        if (gender==='he') {
          this.he = 'he';
          this.his = 'his';
          this.him = 'him';
          this.He = 'He';
          this.His = 'His';
        } else if (gender==='she') {
          this.he = 'she';
          this.his = 'her';
          this.him = 'her';
          this.He = 'She';
          this.His = 'Her';
        } else {
          this.he = 'they';
          this.his = 'their';
          this.him = 'them';
          this.He = 'They';
          this.His = 'Their';
        }
      };

      //create an Array of formatters from playerIndices
      var format = [];
      for (var i = 0; i < 3; i++) {
        var index = playerIndices[i];
        format.push(new Format(players[index].name, players[index].gender));
      };

      function formatText(text) {
        text = text.split('xx').join('</p><p>');
        //replace Name0, Name1, and Name2
        for (var i = 0; i <= 2; i++) {
          text = text.split('Name' + i).join(format[i].name)
            .split('He' + i).join(format[i].He)
            .split('His' + i).join(format[i].His)
            .split('he' + i).join(format[i].he)
            .split('his' + i).join(format[i].his)
            .split('him' + i).join(format[i].him);
        };
        return text;
      };
      

  
      if (type==='side'){
        //replace in quest[0] (short form) and quest[1] (long)
        quest[0] = formatText(quest[0]);
        quest[1] = formatText(quest[1]);

      } else if (type==='main') {

        for (var j = 0; j < quest.pages.length; j++) {
          quest.pages[j].caption = formatText(quest.pages[j].caption);

          //if a page has awards or penalties, the player indices in the awards/penalties arrays need to be replaced with the random players chosen 
          if (quest.pages[j].awards) {
            quest.pages[j].awards = replaceAwardIndices(quest.pages[j].awards);
          };
          if (quest.pages[j].penalties) {
            quest.pages[j].penalties = replaceAwardIndices(quest.pages[j].penalties);
          };

          quest.pages[j].awards
          for (var k = 0; k < quest.pages[j].options.length; k++) {
            quest.pages[j].options[k].caption = formatText(quest.pages[j].options[k].caption);
          }
        }
      }

      function replaceAwardIndices(arr) {
        var index;
        for (var i = 0; i <= 2; i++) {
          while(arr.indexOf(i) !== -1) {
            var index = arr.indexOf(i);
            arr[index] = 10 + i; //placeholder needed bc playerIndices may overlap indices being replaced
          }
        }
        for (var i = 0; i <= 2; i++) {
          while(arr.indexOf(10+i) !== -1) {
            var index = arr.indexOf(10+i);
            arr[index] = playerIndices[i];
          }
        }
        return arr;
      }
      
      return quest;
    };

    return {

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

      },

      getPlayerNamesArray: function() {
        var playerNames = [];
        for (var i = 0; i < players.length; i++) {
          playerNames.push(players[i].name);
        }
        return playerNames;
      },

      getSideQuest: function(playerIndex, price) {
        var rndX = Math.floor(Math.random() * (sideQuestBank.length));
        var newQuest = sideQuestBank[rndX]; //returns an array where [0] = short form, [1] = long form
        sideQuestBank.splice(rndX, 1);
        newQuest = formatQuest(newQuest, playerIndex, 'side'); 
        players[playerIndex].quests.push(newQuest);
        players[playerIndex].points -= price;
        
        if (sideQuestBank.length === 0) { // if the game has run out of side quests to use, 
          getBank('sideQuests'); // reset the bank
        }
      },

      getMainQuest: function(playerIndex) {

        var rndX = Math.floor(Math.random() * (mainQuestBank.length));
        var newQuest = mainQuestBank[rndX]; //returns an object
        mainQuestBank.splice(rndX, 1);
        newQuest = formatQuest(newQuest, playerIndex, 'main'); 

        if (mainQuestBank.length === 0) { // if the game has run out of main quests to use, 
          getBank('mainQuests'); // reset the bank
        }

        return newQuest;
      },

      addPoints: function(playerIndex, amount) {
        players[playerIndex].points += amount;
        if (players[playerIndex].points < 0) {
          players[playerIndex].points = 0;
        }
      },

      player: function(index) {
        return {
          name: players[index].name,
          points: players[index].points,
          quests: players[index].quests,
          gender: players[index].gender
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
      frmEnterPlayers: '#frmEnterPlayers',
      header: '#gameHeader',
      foot: '#foot',
      nextPlayer: '#nextPlayer',
      options: '#frmButtons',
      yes: '#submitYes',
      no: '#submitNo',
      trophy: '#trophyIcon',
      banner: '.gameBanner',
      btnNumPlayers: '.btnNum',
      btnGender: '.btnGender',
      gameElement: '.gameElement',
      iconContainer: '.iconContainer',
      playerNameInput: '.playerNameInput'
    };



    var showOptions = function(captions) {
      var html = '';

      for (var i = 0; i < captions.length; i++) {
        html += '<input type="submit" value="' + captions[i] + '" class="darkgreenHover" id="option' + i + '" data-index="' + i + '"><br>';
      }
      $(dom.options).html(html);
      $(dom.options).show();
    };

    return {

      getDoms: function() {
        return dom;
      },

      createPlayerInputs : function() {
        var html = '<div class="row">';
        for (var i = 0; i <= 8; i++) {
          var name = localStorage.getItem('player'+i+'name');
          if (!name) {name='';};
          var gender = localStorage.getItem('player'+i+'gender');
          if (!gender) {gender='';};
          var heClassSelected = gender === 'he' ? 'darkgreenSelected' : '';
          var sheClassSelected = gender === 'she' ? 'darkgreenSelected' : '';
          html += '<div class="col-50"><div id="rowPlayer' + i + '" style="display:none;"><input type="text" tabindex="' + (i + 1) + '" value="' + name + '" class="playerNameInput" id="txtName'+ i +'"><div data-index="'+ i +'" data-gender="'+ gender +'" id="gender'+ i +'"><input type="button" value="he" class="darkgreenHover btnGender ' + heClassSelected +'"><input type="button" value="she" class="darkgreenHover btnGender ' + sheClassSelected +'"></div></div></div>';
          if (i%2===1 && i) {
            html += '</div><div class="row">';
          }
        };
        html+="</div>";
        $(dom.nameInputs).html(html);
      },


      showScreen: function(screen) {
        $(dom.gameElement).hide(); //hide all elements, then we'll just show what we need

        switch (screen) {
          case 'inputPlayers':
            numPlayers = localStorage.getItem('numPlayers')//load number from previous game
            if (!numPlayers) {numPlayers=3};
            this.selectNumPlayers(numPlayers);
            $(dom.header).text("Number of Players:").show();
            $(dom.frmEnterPlayers + ',' + dom.continue + ',' + dom.foot).show();
            break;
          case 'instructions':
            var htmlInstructions = '<p>Each player begins the game with 10 coins and one side quest.</p><p>Coins are earned as the game goes on. Players can use coins to unlock more quests.</p><p>A player only needs to complete one side quest in order to win the game. Therefore, additional side quests will give you more chances of winning.</p><p>Side quests may be completed at any point, once the game begins. So try to fulfill your quests when your opponents least expect it.</p><p>Good luck!</p>';

            $(dom.header).text('Instructions');
            $(dom.instructions).html(htmlInstructions);
            $(dom.header + ',' + dom.instructions + ',' + dom.continue + ',' + dom.foot).show();
            break;
          case 'trophy':
              var htmlInstructions = '<p>When a player believes he or she has completed a side quest, tap the trophy icon on the top of the screen.</p><p>Let the game begin!</p>';
              $(dom.iconContainer).show();
              $(dom.iconContainer).animate({opacity: '1'}, {duration: 250});
              $(dom.banner).addClass('moveLeft');
              $(dom.header).text('Read Aloud:').show();
              $(dom.instructions).html(htmlInstructions).show();
              $(dom.continue + ',' + dom.foot).show();
              break;
          case 'passDeviceIntro':
          case 'passDevice':
            $(dom.header).text('Pass the device to');
            $(dom.continue + ' input').val('Continue');
            $(dom.header + ',' + dom.nextPlayer + ',' + dom.continue + ',' + dom.foot).show();
            break;
          case 'firstSideQuest1':
            $(dom.instructions).html('<p>You have been assigned a top secret side quest to complete. If you fulfill your mission, you win the game!</p><p>Make sure nobody else is looking over your shoulder, and tap "Continue" to reveal your side quest!</p>');
            $(dom.header + ',' + dom.instructions + ',' + dom.continue + ',' + dom.foot).show();
            break;
          case 'firstSideQuest2':
            $(dom.header).text('Your Quest:');
            $(dom.header + ',' + dom.instructions + ',' + dom.continue + ',' + dom.foot).show();
            break;
          case 'turnOptions':
            showOptions(['Continue Story','View Side Quests','Unlock Side Quests']);
            $(dom.header + ',' + dom.options).show();
        }
      },

      selectNumPlayers: function(numPlayers) {
        $('input[class *= "btnNum"]').removeClass("darkgreenSelected"); //deselect all buttons
        $(dom.btnNumPlayers+'[value="' + numPlayers + '"]').addClass("darkgreenSelected"); //show selected

        for (var i = 0; i < numPlayers; i++) {
          $('#rowPlayer' + i).show()
        }
        for (var i = numPlayers; i <= 8; i++) {
          $('#rowPlayer' + i).hide()
        }
      },

      selectGender: function(playerIndex, gender) {
        var otherGender = gender === 'he' ? 'she' : 'he';
        $('div#gender' + playerIndex + ' > input[value="' + otherGender + '"').removeClass("darkgreenSelected"); //deselect other gender
        $('div#gender' + playerIndex + ' > input[value="' + gender + '"').val(gender).addClass("darkgreenSelected"); //select gender
        $('div#gender' + playerIndex).data('gender', gender); //set gender
      },

      displayText: function(element,text) {
        $(element).html(text).show();
      },

      showSideQuests: function(quests, trophyMenuOpen) { //takes an array of quests (which include short and long form)
        var questShortForms = [];
        for (var i = 0; i < quests.length; i++) {
          questShortForms.push(quests[i][0]); //extract only the short forms of the array
        };
        showOptions(questShortForms);
        $(dom.instructions).hide();
        if (!trophyMenuOpen) {
          this.displayText(dom.header, 'Your Active Quests');
          $(dom.continue + ' input').val('Back');
        }
        $(dom.yesNo).hide();
        $(dom.continue + ',' + dom.foot).show();
        
      },

      showSideQuest: function(quest, trophyMenuOpen) { //takes the long form of a quest as a string
        if (trophyMenuOpen) {
          $(dom.header).text('Was this quest completed?').show();
          $(dom.continue).hide();
          $(dom.yes).val('Yes');
          $(dom.no).val('No');
          $(dom.yesNo).show();
        } else {
          $(dom.header).text('Your Quest:').show();
          $(dom.continue).show();
          $(dom.yesNo).hide();
          $(dom.continue + ' input').val('OK')
        }
        $(dom.instructions).html('<p>' + quest + '</p>').show();
        $(dom.options).hide();
        $(dom.foot).show();
      },

      showUnlockScreen: function(points) {
        $(dom.gameElement).hide(); 

        var html = '<p>You have <b>' + points + '</b> coins.</p><p>It costs <b>25</b> coins to unlock a new side quest.</p>';
        if (points < 25) {
          html+='<p>Sorry! Come back another time!</p>';
          $(dom.continue).show();
        } else {
          html+='<p>Would like to go ahead and unlock a new quest?</p>'
          $(dom.yesNo).show();
        };
        $(dom.header).text('Unlock Side Quests').show();
        $(dom.instructions).html(html).show();
        $(dom.yes).val('Yes');
        $(dom.no).val('No');
        $(dom.foot).show();
      },

      showMainQuest: function(quest, index) {
        $(dom.gameElement).hide(); 
        $(dom.header).text('Read Aloud:').show();
        $(dom.instructions).html('<p>' + quest.pages[index].caption + '</p><br>').show();

        if (quest.pages[index].options.length === 1) {
          //if there is one option, use the continue button
          $(dom.continue + ' input').val(quest.pages[index].options[0].caption);
          $(dom.continue).show();
        } else {  
          //if there are two options, use the yes/no buttons
          $(dom.yes).val(quest.pages[index].options[0].caption);
          $(dom.no).val(quest.pages[index].options[1].caption);
          $(dom.yesNo).show();
        };

        $(dom.foot).show();
        window.scrollTo(0,0); 
      },

      showTrophyMenu: function(players) {
        $(dom.gameElement).hide(); 
        $(dom.header).text('Do we have a winner?').show();
        $(dom.continue + ' input').val('Cancel');
        $(dom.continue + ',' + dom.foot).show();
        showOptions(players);
      }
    }

  })();



  //Global App Controller
  var controller = (function(dataCtrl, uiCtrl) {
    var dom = uiCtrl.getDoms();

    var currentScreen = "intro";
    var trophyMenu = {screen: '', open: false, playerIndex: 0, questIndex: 0}

    Screen = "";

    var curP = -1; //current Player index
    var currentPlayer = function(){
      return dataCtrl.player(curP);
    }
    var numPlayers=3;
    var mainQuest;
    var curPage; 

    var validateNames = function() {
      var num = $('.darkgreenSelected').val();
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
      numPlayers = $('.darkgreenSelected').val();
      var playerDetails = []; //array of names and genders
      for (var i = 0; i < numPlayers; i++) {
        playerDetails.push([
          $('#txtName'+ i).val(), //name
          $('#gender' + i).data('gender') //gender
        ]);
      };
      dataCtrl.createPlayers(playerDetails);
    };

    var stopTimer;
    var startTimer = function(seconds) {
      stopTimer=false;
      var timer = setInterval(function(){
        seconds-=1;
        $(dom.nextPlayer).html(seconds);
        if (seconds===0) {
          mainQuest.pages[curPage].options[0].timer=0;
          navigator.vibrate(1500);
          $(dom.continue + ' input').val('Continue');
        } 
        if (!seconds || stopTimer){
          clearInterval(timer);
        }
      }, 1000);
    }

    var loadNextPage = function(choice) {

      //see if there's a timer
      if (mainQuest.pages[curPage].options[choice].timer>0) {

        $(dom.gameElement).hide(); 
        var seconds = mainQuest.pages[curPage].options[choice].timer;
        $(dom.nextPlayer).text(seconds).show();
        $(dom.continue + ' input').val('Stop Timer');
        $(dom.foot + ',' + dom.continue).show();

        startTimer(seconds);

        return;
      }


      curPage = mainQuest.pages[curPage].options[choice].nextPage;

      //if new page > index of the last page, that means the quest is over
      if (curPage > mainQuest.pages.length - 1) {

        if (curP < numPlayers - 1) {
          curP += 1;
        } else {
          curP = 0;
        }

        currentScreen = 'passDevice';
        uiCtrl.displayText(dom.nextPlayer, currentPlayer().name);
        uiCtrl.showScreen(currentScreen);

      } else {
        //if there are awards given out on this page
        if (mainQuest.pages[curPage].awards) {
          var awardAmount = mainQuest.coins;
          //loop thru all players who are given an award
          for (var i = 0; i < mainQuest.pages[curPage].awards.length; i++) {
            playerIndex = mainQuest.pages[curPage].awards[i];
            dataCtrl.addPoints(playerIndex, awardAmount);
          }
        }
        //if there are penalties given out on this page
        if (mainQuest.pages[curPage].penalties) {
          var awardAmount = -(mainQuest.coins);
          //loop thru all players who are given a penalty
          for (var i = 0; i < mainQuest.pages[curPage].penalties.length; i++) {
            playerIndex = mainQuest.pages[curPage].penalties[i];
            dataCtrl.addPoints(playerIndex, awardAmount);
          }
        }
        uiCtrl.showMainQuest(mainQuest, curPage);
        
      }
    };

    var closeTrophyMenu = function() {
      trophyMenu.open = false;
      $(dom.iconContainer).animate({opacity: '1'}, {duration: 250});
      $(dom.banner).addClass('moveLeft');
      $(dom.continue + ' input').val('Continue');
      //if they were looking at something on the turn menu when they clicked the icon, just go back to the turn menu to avoid confusion
      if (currentScreen === 'viewSideQuest' || currentScreen === 'viewSideQuests' || currentScreen === 'unlockQuests') {
        currentScreen = 'turnOptions';
      };
    }

    var setEventListeners = function() {

      //trophy icon
      $(dom.trophy).on('click', function(){
        $(dom.iconContainer).animate({opacity: '0'}, {duration: 50});
        $(dom.banner).removeClass('moveLeft');
        var players = dataCtrl.getPlayerNamesArray();
        uiCtrl.showTrophyMenu(players);
        setEventListenersForOptions();
        trophyMenu.screen = 'trophy selectPlayer';
        trophyMenu.open = true;
      });

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

        if (trophyMenu.open) {

          closeTrophyMenu();

        } else {

          switch(currentScreen){
            case 'intro':
              currentScreen = 'inputPlayers';
              break;
            case 'inputPlayers':
              if (validateNames()) {
                currentScreen = "instructions";
                submitPlayerNames();
              } else {
                return; //abort if name forms weren't filled out properly
              }
              break;
            case 'instructions':
            case 'firstSideQuest2':
              if (curP < numPlayers - 1) {
                curP += 1;
                currentScreen = 'passDeviceIntro';
              } else {
                curP = 0;
                currentScreen = 'trophy';
              }
              break;
            case 'passDeviceIntro':
              dataCtrl.getSideQuest(curP,0); //give current player their first side quest at price=0
              currentScreen = 'firstSideQuest1';
              break;
            case 'firstSideQuest1':
              currentScreen = 'firstSideQuest2';
              break;
            case 'trophy':
              currentScreen = 'passDevice'
              break;
            case 'passDevice':
            case 'viewSideQuests':
            case 'unlockQuests':
              currentScreen = 'turnOptions';
              break;
            case 'viewSideQuest':
              currentScreen = 'viewSideQuests';
              break;
            case 'mainQuest':
              if ($(dom.continue + ' input').val() === 'Stop Timer'){ //if there's a timer and you clicked Stop
                stopTimer = true; //cut timer short
                mainQuest.pages[curPage].options[0].timer=0;
              };
              loadNextPage(0);
              return;
          };
        };

        showScreen(currentScreen);

      });

      //yesNo buttons
      $(dom.yesNo).on('submit', function(){
        var choice = $('input[type=submit]:focus').data('index');
        if (trophyMenu.open) {
          
          if (choice===0) {
            //We have a winner
            currentScreen = 'winner'
            trophyMenu.open=false;
          } else {
            closeTrophyMenu();
          }

          showScreen(currentScreen);

        } else {

          switch(currentScreen) {
            case 'unlockQuests':
              if (choice===0) {
                currentScreen = 'viewSideQuest';
                dataCtrl.getSideQuest(curP, 25);
                var newQuestIndex = currentPlayer().quests.length - 1;
                showScreen(currentScreen, newQuestIndex);
              } else if (choice===1) {
                currentScreen = 'turnOptions';
                showScreen(currentScreen);
              }
              break;
            case 'mainQuest':
              //go to the page the chosen option indicates
              loadNextPage(choice);
              break;
            case 'winner':
              if (choice===0) {
                location.reload();
              } else if (choice===1) {
                window.open('../index.html','_self');
              }
          }
        }

      });

    // text inputs
    $('input[type="text"]').focus(function() {
      $(dom.foot + ' footer').addClass('keyboardOpen');
      $(dom.foot + ' .whiteSpace').addClass('keyboardOpen');
    });
    $('input[type="text"]').blur(function() {
      $(dom.foot + ' footer').removeClass('keyboardOpen');
      $(dom.foot + ' .whiteSpace').removeClass('keyboardOpen');
    });

      //options
      setEventListenersForOptions();

    };

    //option buttons are rebuilt each time, so event listeners must be reset each time
    var setEventListenersForOptions = function() {
      $('[id^="option"]').on('click', function(){

        var i = $(this).data('index'); //get index of option chosen

        if (trophyMenu.open) {
          
          switch (trophyMenu.screen) {
            case 'trophy selectPlayer':
              trophyMenu.screen = 'trophy selectQuest';
              trophyMenu.playerIndex = i;
              showScreen(trophyMenu.screen, i);
              break;
            case 'trophy selectQuest':
              trophyMenu.screen = 'trophy displayQuest';
              trophyMenu.questIndex = i;
              showScreen(trophyMenu.screen, trophyMenu.playerIndex, i);
              break;
          }

        } else {

          switch ($(this).val()) {
            case 'Continue Story':
              currentScreen = 'mainQuest';
              mainQuest = dataCtrl.getMainQuest(curP); //returns an object
              curPage = 0;
              break;
            case 'View Side Quests':
              currentScreen = 'viewSideQuests';
              break;
            case 'Unlock Side Quests':
              currentScreen = 'unlockQuests';
              break;
            default:
              //if it gets to this point, we're looking at quest view
              currentScreen='viewSideQuest';
              $(dom.continue + ' input').val('OK');
              var i = $(this).data('index');
          }
          showScreen(currentScreen, i);
        }

        
      });
    };

    var showScreen = function(screen, i, j) { //i and j are indices that can be passed in as needed
      switch (screen){
        case 'trophy selectQuest':
          uiCtrl.displayText(dom.header, 'Which quest did ' + dataCtrl.player(i).gender + ' complete?');
          uiCtrl.showSideQuests(dataCtrl.player(i).quests, trophyMenu.open);
          setEventListenersForOptions();
          break;
        case 'trophy displayQuest':
          uiCtrl.showSideQuest(dataCtrl.player(i).quests[j][1], trophyMenu.open); //long form, 
          break;
        case 'viewSideQuests':
          uiCtrl.showSideQuests(currentPlayer().quests, trophyMenu.open);
          setEventListenersForOptions();
          break;
        case 'viewSideQuest':
          uiCtrl.showSideQuest(currentPlayer().quests[i][1], trophyMenu.open); //long form, 
          break;
        case 'unlockQuests':
          uiCtrl.showUnlockScreen(currentPlayer().points);
          break;
        case 'turnOptions':
          uiCtrl.displayText(dom.header, currentPlayer().name + '\'s Turn');
          uiCtrl.showScreen(screen);
          setEventListenersForOptions();
          break;
        case 'mainQuest':
          uiCtrl.showMainQuest(mainQuest, curPage);
          break;
        case 'passDevice':
        case 'passDeviceIntro':
          uiCtrl.displayText(dom.nextPlayer, currentPlayer().name);
          uiCtrl.showScreen(screen);
          break;
        case 'firstSideQuest1':
          uiCtrl.displayText(dom.header, currentPlayer().name + ',');
          uiCtrl.showScreen(screen);
          break;
        case 'firstSideQuest2':
          uiCtrl.displayText(dom.instructions, '<p>' + currentPlayer().quests[0][1] + '</p>'); //[first quest][long form]
          uiCtrl.showScreen(screen);
          break;
        case 'winner':
          uiCtrl.displayText(dom.header, 'Congratulations, ' + dataCtrl.player(trophyMenu.playerIndex).name + '!!');
          uiCtrl.displayText(dom.instructions, '<p>You are the Side Quest champion!<br><br><br>Play Again?</p>');
          break;
        default:
          uiCtrl.showScreen(screen);
      }
      window.scrollTo(0,0); 
    };

    return {
      init: function() {

        uiCtrl.createPlayerInputs();
        
        //prevent all forms from reloading
        $("form").on("submit", function(event){
          event.preventDefault();
        });
        
        setEventListeners();
        
      }
    }
  })(dataController, uiController);


  controller.init();

});