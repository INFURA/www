/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.5
 * Copyright 2017. MIT licensed.
 */


(function ($, window, document, require, undefined) {
  'use strict';


/**
 * Load Bootstrap JS as requrired.
 */
  function loadBootstrap(bootstrapModules) {
    var bootstrapLoad = [];
    if (bootstrapModules.length > 0) {

      bootstrapModules.forEach(function(el, ind){
        bootstrapLoad[ind] = 'assets/js/bootstrap/' + el + '.min.js';
      });

      require(bootstrapLoad, function(){
        if (bootstrapModules.indexOf('tooltip') !== -1 ) {
          $('[data-toggle="tooltip"]').tooltip();
        }
        if (bootstrapModules.indexOf('popover') !== -1) {
          if (bootstrapModules.indexOf('tooltip') === -1){
            window.alert('Bootstrap load Error: popover requires tooltip.');
          }
          $('[data-toggle="popover"]').popover();
        }
      });
    }
  }


  // DOM READY.
  $(function () {
    loadBootstrap([
      //   'transition',
      //   'alert',
      //   'button',
      //   'carousel',
      //   'collapse',
      //   'dropdown',
      //   'modal',
      //   'tab',
      //   'affix',
      //   'scrollspy',
      //   'tooltip',
      //   'popover' // Requires tooltip!
    ]);
  });

})(jQuery, window, document, window.require);
