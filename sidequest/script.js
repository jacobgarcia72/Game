$(function(){

  //Data Controller
  var dataController = (function() {
    var getSideQuestBank = function() {
      var bank = [];

      $.ajax('data.json', {
        async: false,
        dataType: 'json',
        method: 'GET',
        success: function(retrievedData){
          bank = retrievedData.sideQuests;
        },
        error: function(){
          bank = [['','Data did not properly load.'],['','Data did not properly load.']];
        }
      });

      return bank;
    };

    var getMainQuestBank = function(){
      var bank = [];

      $.ajax('data.json', {
        async: false,
        dataType: 'json',
        method: 'GET',
        success: function(retrievedData){
          bank = retrievedData.mainQuests;
        },
        error: function(){
          alert("Failed to load necessary data.");
        }
      });

      if (bank.length > 0) {
        return bank;
      }
      return [{
        "coins": 4,
        "pages": 
        [
          {
            "caption": "Name0, as you know, Name1 has not been laughing enough. This needs to change.xxYou've been assigned the task of making Name1 laugh.xxPass the device to Name2 to read the next page of instructions.",
            "options": 
            [
              {
                "caption": "Continue",
                "nextPage": 1
              }
            ]
          },
          {
            "caption": "Name2, you will be the judge. Here are the rules.xxName0 has 30 seonds to make Name1 laugh.xxHe0 can't touch him1, but other than that, he0 can do whatever it takes to get Name1 to laugh.xxWhen Name0 is ready, start the timer!",
            "options": 
            [
              {
                "caption": "Start Timer",
                "timer": 30,
                "nextPage": 2
              }
            ]
          },
          {
            "caption": "Name2, did Name1 laugh?",
            "options": 
            [
              {
                "caption": "Yes",
                "nextPage": 3
              },
              {
                "caption": "No",
                "nextPage": 4
              }
            ]
          },
          {
            "awards": [0],
            "caption": "Congratulations, Name0!xxYou have succeeded in your mission and have been awarded 4 coins!",
            "options": 
            [
              {
                "caption": "Continue",
                "nextPage": 4
              }
            ]
          }
      ]}
  
  
  
    ]
    };

    var sideQuestBank = getSideQuestBank();
    var mainQuestBank = getMainQuestBank();

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

      createPlayers: function(playerDetails) { //takes an array of [name, gender]
        for (var i = 0; i < playerDetails.length; i++) {
          var name = playerDetails[i][0]; //name
          var gender = playerDetails[i][1]; //gender
          players.push(new Player(name, gender)); //name, gender'
          //save info for future games
          localStorage.setItem('player' + i + 'name', name);
          localStorage.setItem('player' + i + 'gender', gender);
          localStorage.setItem('numPlayers', playerDetails.length);
        };

        //give each player their first side quest. Must be done after ALL players are added so that side quests can be formatted with opponents' names
        for (var i = 0; i < playerDetails.length; i++) {
          this.getSideQuest(i, 0); 
        }
      },

      getPlayerNamesArray: function() {
        var playerNames = [];
        for (var i = 0; i < players.length; i++) {
          playerNames.push(players[i].name);
        }
        return playerNames;
      },

      getSideQuest: function(playerIndex, price) {
        if (sideQuestBank.length === 0) { // if the game has run out of side quests to use, 
          sideQuestBank = getSideQuestBank(); // reset the bank
        }

        var rndX = Math.floor(Math.random() * (sideQuestBank.length));
        newQuest = sideQuestBank[rndX]; //returns an array where [0] = short form, [1] = long form
        sideQuestBank.splice(rndX, 1);
        newQuest = formatQuest(newQuest, playerIndex, 'side'); 
        players[playerIndex].quests.push(newQuest);
        players[playerIndex].points -= price;
      },

      getMainQuest: function(playerIndex) {
        if (mainQuestBank.length === 0) { // if the game has run out of main quests to use, 
          mainQuestBank = getMainQuestBank(); // reset the bank
        }

        var rndX = Math.floor(Math.random() * (mainQuestBank.length));
        newQuest = mainQuestBank[rndX]; //returns an object
        mainQuestBank.splice(rndX, 1);
        newQuest = formatQuest(newQuest, playerIndex, 'main'); 
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

    var domID = {
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
      trophy: '#trophyIcon'
    };
    var domClass = {
      banner: '.gameBanner',
      btnNumPlayers: '.btnNum',
      btnGender: '.btnGender',
      gameElement: '.gameElement',
      iconContainer: '.iconContainer'
    };



    var showOptions = function(captions) {
      var html = '';

      for (var i = 0; i < captions.length; i++) {
        html += '<input type="submit" value="' + captions[i] + '" class="darkgreenHover" id="option' + i + '" data-index="' + i + '"><br>';
      }
      $(domID.options).html(html);
      $(domID.options).show();
      // $('[id^="option"]').hide();
      // for (var i = 0; i < num; i++) {
      //   $('#option' + i).val(captions[i]);
      //   $('#option' + i).show();
      //   $(domID.options).show();
      //};
    };

    return {

      getDomIDs: function() {
        return domID;
      },

      getDomClasses: function() {
        return domClass;
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
        $(domID.nameInputs).html(html);
      },


      showScreen: function(screen) {
        $(domClass.gameElement).hide(); //hide all elements, then we'll just show what we need

        switch (screen) {
          case 'inputPlayers':
            numPlayers = localStorage.getItem('numPlayers')//load number from previous game
            if (!numPlayers) {numPlayers=3};
            this.selectNumPlayers(numPlayers);
            $(domID.header).text("Number of Players:").show();
            $(domID.frmEnterPlayers + ',' + domID.continue + ',' + domID.foot).show();
            break;
          case 'instructions':
            var htmlInstructions = '<p>Each player begins the game with 10 coins and one side quest.</p><p>Coins are earned as the game goes on. Players can use coins to unlock more quests.</p><p>A player only needs to complete one side quest in order to win the game. Therefore, additional side quests will give you more chances of winning.</p><p>Side quests may be completed at any point, once the game begins. So try to fulfill your quests when your opponents least expect it.</p><p>Good luck!</p>';

            $(domID.header).text('Instructions');
            $(domID.instructions).html(htmlInstructions);
            $(domID.header + ',' + domID.instructions + ',' + domID.continue + ',' + domID.foot).show();
            break;
          case 'trophy':
              var htmlInstructions = '<p>When a player believes he or she has completed a side quest, tap the trophy icon on the top of the screen.</p><p>Let the game begin!</p>';
              $(domClass.iconContainer).show();
              $(domClass.iconContainer).animate({opacity: '1'}, {duration: 250});
              $(domClass.banner).addClass('moveLeft');
              $(domID.header).text('Read Aloud:').show();
              $(domID.instructions).html(htmlInstructions).show();
              $(domID.continue + ',' + domID.foot).show();
              break;
          case 'passDeviceIntro':
          case 'passDevice':
            $(domID.header).text('Pass the device to');
            $(domID.continue + ' input').val('Continue');
            $(domID.header + ',' + domID.nextPlayer + ',' + domID.continue + ',' + domID.foot).show();
            break;
          case 'firstSideQuest1':
            $(domID.instructions).html('<p>You have been assigned a top secret side quest to complete. If you fulfill your mission, you win the game!</p><p>Make sure nobody else is looking over your shoulder, and tap "Continue" to reveal your side quest!</p>');
            $(domID.header + ',' + domID.instructions + ',' + domID.continue + ',' + domID.foot).show();
            break;
          case 'firstSideQuest2':
            $(domID.header).text('Your Quest:');
            $(domID.header + ',' + domID.instructions + ',' + domID.continue + ',' + domID.foot).show();
            break;
          case 'turnOptions':
            showOptions(['Continue Story','View Side Quests','Unlock Side Quests']);
            $(domID.header + ',' + domID.options).show();
        }
      },

      selectNumPlayers: function(numPlayers) {
        $('input[class *= "btnNum"]').removeClass("darkgreenSelected"); //deselect all buttons
        $(domClass.btnNumPlayers+'[value="' + numPlayers + '"]').addClass("darkgreenSelected"); //show selected

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
        $(domID.instructions).hide();
        if (!trophyMenuOpen) {
          this.displayText(domID.header, 'Your Active Quests');
          $(domID.continue + ' input').val('Back');
        }
      
        $(domID.continue + ',' + domID.foot).show();
        
      },

      showSideQuest: function(quest, trophyMenuOpen) { //takes the long form of a quest as a string
        if (trophyMenuOpen) {
          $(domID.header).text('Was this quest completed?').show();
          $(domID.continue).hide();
          $(domID.yes).val('Yes');
          $(domID.no).val('No');
          $(domID.yesNo).show();
        } else {
          $(domID.header).text('Your Quest:').show();
          $(domID.continue).show();
          $(domID.continue + ' input').val('OK')
        }
        $(domID.instructions).html('<p>' + quest + '</p>').show();
        $(domID.options).hide();
        $(domID.foot).show();
      },

      showUnlockScreen: function(points) {
        $(domClass.gameElement).hide(); 

        var html = '<p>You have <b>' + points + '</b> coins.</p><p>It costs <b>25</b> coins to unlock a new side quest.</p>';
        if (points < 25) {
          html+='<p>Sorry! Come back another time!</p>';
          $(domID.continue).show();
        } else {
          html+='<p>Would like to go ahead and unlock a new quest?</p>'
          $(domID.yesNo).show();
        };
        $(domID.header).text('Unlock Side Quests').show();
        $(domID.instructions).html(html).show();
        $(domID.yes).val('Yes');
        $(domID.no).val('No');
        $(domID.foot).show();
      },

      showMainQuest: function(quest, index) {
        $(domClass.gameElement).hide(); 
        $(domID.header).text('Read Aloud:').show();
        $(domID.instructions).html('<p>' + quest.pages[index].caption + '</p><br>').show();

        if (quest.pages[index].options.length === 1) {
          //if there is one option, use the continue button
          $(domID.continue + ' input').val(quest.pages[index].options[0].caption);
          $(domID.continue).show();
        } else {  
          //if there are two options, use the yes/no buttons
          $(domID.yes).val(quest.pages[index].options[0].caption);
          $(domID.no).val(quest.pages[index].options[1].caption);
          $(domID.yesNo).show();
        };

        $(domID.foot).show();
        window.scrollTo(0,0); 
      },

      showTrophyMenu: function(players) {
        $(domClass.gameElement).hide(); 
        $(domID.header).text('Do we have a winner?').show();
        $(domID.continue + ' input').val('Cancel');
        $(domID.continue + ',' + domID.foot).show();
        showOptions(players);
      }
    }

  })();



  //Global App Controller
  var controller = (function(dataCtrl, uiCtrl) {
    var domID = uiCtrl.getDomIDs();
    var domClass = uiCtrl.getDomClasses();

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

    var loadNextPage = function(choice) {
      
      //see if there's a timer
      if (mainQuest.pages[curPage].options[choice].timer>0) {

        $(domClass.gameElement).hide(); 
        $(domID.nextPlayer).text(mainQuest.pages[curPage].options[choice].timer).show();
        $(domID.continue + ' input').val('Stop Timer');
        $(domID.foot + ',' + domID.continue).show();

        var timer = setInterval(function(){
          mainQuest.pages[curPage].options[choice].timer-=1;
          if ($(domID.nextPlayer).text()==='1') {
            navigator.vibrate(1500);
            $(domID.continue + ' input').val('Continue');
          }
          if (mainQuest.pages[curPage].options[choice].timer >= 0){
            $(domID.nextPlayer).text(mainQuest.pages[curPage].options[choice].timer);
          } else {
            clearInterval(timer);
          }
        }, 1000);


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
        uiCtrl.displayText(domID.nextPlayer, currentPlayer().name);
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
      $(domClass.iconContainer).animate({opacity: '1'}, {duration: 250});
      $(domClass.banner).addClass('moveLeft');
      $(domID.continue + ' input').val('Continue');
      //if they were looking at something on the turn menu when they clicked the icon, just go back to the turn menu to avoid confusion
      if (currentScreen === 'viewSideQuest' || currentScreen === 'viewSideQuests' || currentScreen === 'unlockQuests') {
        currentScreen = 'turnOptions';
      };
    }

    var setEventListeners = function() {

      //trophy icon
      $(domID.trophy).on('click', function(){
        $(domClass.iconContainer).animate({opacity: '0'}, {duration: 50});
        $(domClass.banner).removeClass('moveLeft');
        var players = dataCtrl.getPlayerNamesArray();
        uiCtrl.showTrophyMenu(players);
        setEventListenersForOptions();
        trophyMenu.screen = 'trophy selectPlayer';
        trophyMenu.open = true;
      });

      //num of player buttons
      $(domClass.btnNumPlayers).on('click', function(){
        var numPlayers = $(this).val();
        uiCtrl.selectNumPlayers(numPlayers);
      });

      //gender buttons
      $(domClass.btnGender).on('click', function(){
        var gender = $(this).val();
        var playerIndex = $(this).parent().data('index');
        uiCtrl.selectGender(playerIndex, gender);
      });

      //continue button
      $(domID.continue).on('submit', function(){

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
              if ($(domID.continue + ' input').val() === 'Stop Timer'){ //if there's a timer and you clicked Stop
                mainQuest.pages[curPage].options[0].timer = 0; //cut timer short
              };
              loadNextPage(0);
              return;
          };
        };

        showScreen(currentScreen);

      });

      //yesNo buttons
      $(domID.yesNo).on('submit', function(){
        $(domID.yes).removeClass('')

        var choice = $(document.activeElement).data('index');
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
              $(domID.continue + ' input').val('OK');
              var i = $(this).data('index');
          }
          showScreen(currentScreen, i);
        }

        
      });
    };

    var showScreen = function(screen, i, j) { //i and j are indices that can be passed in as needed
      switch (screen){
        case 'trophy selectQuest':
          uiCtrl.displayText(domID.header, 'Which quest did ' + dataCtrl.player(i).gender + ' complete?');
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
          uiCtrl.displayText(domID.header, currentPlayer().name + '\'s Turn');
          uiCtrl.showScreen(screen);
          setEventListenersForOptions();
          break;
        case 'mainQuest':
          uiCtrl.showMainQuest(mainQuest, curPage);
          break;
        case 'passDevice':
        case 'passDeviceIntro':
          uiCtrl.displayText(domID.nextPlayer, currentPlayer().name);
          uiCtrl.showScreen(screen);
          break;
        case 'firstSideQuest1':
          uiCtrl.displayText(domID.header, currentPlayer().name + ',');
          uiCtrl.showScreen(screen);
          break;
        case 'firstSideQuest2':
          uiCtrl.displayText(domID.instructions, '<p>' + currentPlayer().quests[0][1] + '</p>'); //[first quest][long form]
          uiCtrl.showScreen(screen);
          break;
        case 'winner':
          uiCtrl.displayText(domID.header, 'Congratulations, ' + dataCtrl.player(trophyMenu.playerIndex).name + '!!');
          uiCtrl.displayText(domID.instructions, '<p>You are the Side Quest champion!<br><br><br>Play Again?</p>');
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