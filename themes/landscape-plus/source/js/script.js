(function ($) {
  /* toTop start */
  // When to show the scroll link
  // higher number = scroll link appears further down the page
  var upperLimit = 1000;
  // Our scroll link element
  var scrollElem = $("#totop");
  // Scroll to top speed
  var scrollSpeed = 500;
  // Show and hide the scroll to top link based on scroll position
  $(window).scroll(function () {
    var scrollTop = $(document).scrollTop();
    if (scrollTop > upperLimit) {
      $(scrollElem).stop().fadeTo(300, 1); // fade back in
    } else {
      $(scrollElem).stop().fadeTo(300, 0); // fade out
    }
  });

  // Scroll to top animation on click
  $(scrollElem).click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      scrollSpeed
    );
    return false;
  });
  /* toTop end */
  // Search
  var $searchWrap = $("#search-form-wrap");
  var isSearchAnim = false;
  var searchAnimDuration = 200;

  var startSearchAnim = function () {
    isSearchAnim = true;
  };

  var stopSearchAnim = function (callback) {
    setTimeout(function () {
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $("#nav-search-btn").on("click", function () {
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass("on");
    stopSearchAnim(function () {
      $(".search-form-input").focus();
    });
  });

  $(".search-form-input").on("blur", function () {
    startSearchAnim();
    $searchWrap.removeClass("on");
    stopSearchAnim();
  });

  // Caption
  $(".article-entry").each(function (i) {
    $(this)
      .find("img")
      .each(function () {
        if ($(this).parent().hasClass("fancybox")) return;

        var alt = this.alt;

        if (alt) $(this).after('<span class="caption">' + alt + "</span>");

        $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
      });

    $(this)
      .find(".fancybox")
      .each(function () {
        $(this).attr("rel", "article" + i);
      });
  });

  if ($.fancybox) {
    $(".fancybox").fancybox();
  }
})(jQuery);
