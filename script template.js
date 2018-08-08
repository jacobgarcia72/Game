// Game Data Controller
var dataController = (function() {


})();


// ------------------------------------------------------


// UI Controller
var uiController = (function() {

  var dom = {

  };
  
  return {
    getDomStrings: function() {
      return dom;
    }

  };

})();


// -------------------------------------------------------


// Global App Controller
var controller = (function(dataCtrl, uiCtrl) {

  var setUpEventListeners = function() {
    var dom = uiCtrl.getDomStrings();
    var domID = function(id) { return document.getElementById(id); } //Make it easer to select elements from the DOM


  };


  return {
     init: function() {
      setUpEventListeners();
     }
  };
})(dataController, uiController);

controller.init();