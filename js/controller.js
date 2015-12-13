(function(angular) {
    'use strict';

    function MirrorCtrl(AnnyangService, $scope, $timeout, Pi) {
        var _this = this;
        var DEFAULT_COMMAND_TEXT = 'Say "What can I say?" to see a list of commands...';
        $scope.listening = false;
        $scope.debug = false;
        $scope.complement = "Hi, ...."
        $scope.focus = "default";
        $scope.user = {};
        $scope.interimResult = DEFAULT_COMMAND_TEXT;

        $scope.colors=["#6ed3cf", "#9068be", "#e1e8f0", "#e62739"];

        //Update the time
        var tick = function() {
            $scope.date = new Date();
            $timeout(tick, 1000 * 60);
        };

        // Reset the command text
        var restCommand = function(){
          $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        _this.init = function() {
           
            var defaultView = function() {
                console.debug("Ok, going to default view...");
                $scope.focus = "default";
            }

            

            // List commands
            AnnyangService.addCommand('What can I say', function() {
                console.debug("Here is a list of commands...");
                console.log(AnnyangService.commands);
                $scope.focus = "commands";
            });

            // Go back to default view
            AnnyangService.addCommand('Go home', defaultView);

            // Hide everything and "sleep"
            AnnyangService.addCommand('Go to sleep', function() {
                console.debug("Ok, going to sleep...");
                $scope.focus = "sleep";
            });

            // Go back to default view
            AnnyangService.addCommand('Wake up', defaultView);

            // Clear log of commands
            AnnyangService.addCommand('Clear results', function(task) {
                 console.debug("Clearing results");
                 _this.clearResults()
            });

            // Check the time
            AnnyangService.addCommand('what time is it', function(task) {
                 console.debug("It is", moment().format('h:mm:ss a'));
                 _this.clearResults();
            });

            AnnyangService.addCommand('turn off pink lights', function(task) {
                 _this.clearResults();
                 $.ajax({
                  method: "POST",
                  url: "http://tree.local/api/pin/value",
                  data: JSON.stringify({ pin: "8", value: "1" }),
                  dataType: "JSON"
                })
                  .done(function( msg ) {
                    console.log('this'); 
                  });
            });

            AnnyangService.addCommand('turn on pink lights', function(task) {
                 _this.clearResults();
                 $.ajax({
                  method: "POST",
                  url: "http://tree.local/api/pin/value",
                  data: JSON.stringify({ pin: "8", value: "0" }),
                  dataType: "JSON"
                })
                  .done(function( msg ) {
                    console.log('this'); 
                  });
            });

            AnnyangService.addCommand('turn off multi color lights', function(task) {
                 _this.clearResults();
                 $.ajax({
                  method: "POST",
                  url: "http://tree.local/api/pin/value",
                  data: JSON.stringify({ pin: "9", value: "1" }),
                  dataType: "JSON"
                })
                  .done(function( msg ) {
                    console.log('this'); 
                  });
            });

            AnnyangService.addCommand('turn on multi color lights', function(task) {
                 _this.clearResults();
                 $.ajax({
                  method: "POST",
                  url: "http://tree.local/api/pin/value",
                  data: JSON.stringify({ pin: "9", value: "0" }),
                  dataType: "JSON"
                })
                  .done(function( msg ) {
                    console.log('color lights on'); 
                  });
            });

            



            // Turn lights off
            AnnyangService.addCommand('(turn) (the) :state (the) light(s) *action', function(state, action) {
                HueService.performUpdate(state + " " + action);
            });

            // Fallback for all commands
            AnnyangService.addCommand('*allSpeech', function(allSpeech) {
                console.debug(allSpeech);
                _this.addResult(allSpeech);
            });

            var resetCommandTimeout;
            //Track when the Annyang is listening to us
            AnnyangService.start(function(listening){
                $scope.listening = listening;
            }, function(interimResult){
                $scope.interimResult = interimResult;
                $timeout.cancel(resetCommandTimeout);
            }, function(result){
                $scope.interimResult = result[0];
                resetCommandTimeout = $timeout(restCommand, 5000);
            });
        };

        _this.addResult = function(result) {
            _this.results.push({
                content: result,
                date: new Date()
            });
        };

        _this.clearResults = function() {
            _this.results = [];
        };

        _this.init();
    }

    angular.module('SmartMirror')
        .controller('MirrorCtrl', MirrorCtrl);

}(window.angular));
