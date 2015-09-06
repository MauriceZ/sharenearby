Meteor.utils = {
  isScrolledIntoView: function($elem, offset) {
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom - (offset || 0)) && (elemTop >= docViewTop));
  },

  scrollToBottom: function($elem) {
    if ($elem[0])
      $elem[0].scrollTop = $elem[0].scrollHeight;
  }
};
