// # API Resource #
// manage user related API requests
'use strict';
// {pin: 8, value: 0}
angular.module('SmartMirror')
  .factory('Pi', function($resource){
    return $resource('http://tree.local/api/pin/value', {pin: '@pin', value: '@value'},
      // ## custom routes ##
      {
        // activate pink
        pink:           
        {method:'POST', url: 'http://tree.local/api/pin/value'},	
    
        // activate multi
        multi:
        {method: 'POST', url: 'http://tree.local/api/pin/value'},

      }
    );
  });