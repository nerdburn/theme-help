$(document).ready(function(){
  var window_site_data = window.SITEDATA
  var base_url = (window_site_data.debug ? 'http://postachio.local:5000/' : 'http://postach.io/')
  var $typeahead_search = $('[data-typeahead]')
  var toc = $('.toc');
  var items = $('.toc-items');
  var trigger = $('.toc h2');
  var message = $('.toggle-message');
  var icon = $('.toggle-icon');
  var content = $('.content');

  // hide header on scroll
  $(window).scroll(function(event){
    var st = $(this).scrollTop();

    if(st >= 146) {
      toc.addClass('fixed');
      content.css('padding-top', (toc.height() + 2) + 'px');
      //if(items.is(':visible'))
      //    trigger.click();
    } else {
      toc.removeClass('fixed');
      content.css({ paddingTop: 0 });
    }

  });

  // hide / show items
  trigger.on('click', function(e){
    e.preventDefault();
    if(items.is(':visible')) {
      items.hide();
      message.html('Show');
      icon.html('navigatedown');
    } else {
      items.show();
      message.html('Hide');
      icon.html('navigateup');
    }
  });

  var filterData = function(parsedResponse) {
    console.log(parsedResponse.articles)
    return $.map(parsedResponse.articles, function(article) {
      return {
        value: article.title,
        tokens: article.title.split(' '),
        title: article.title,
        url: article.url,
        created_at: article.created_at
      }
    })
  }

  var fetchData = {
    cacheKey: 'articles',
    url: base_url + 'api/posts',
    ttl: 0,
    ajax: {
      type: "GET",
      dataType: "jsonp",
      data: {
        'a': window_site_data.s_aid,
        's': window_site_data.s
      },
      xhrFields: {
        withCredentials: true
      }
    },
    filter: filterData
  }

  var articles = new Bloodhound({
    datumTokenizer: function(d) { return d.tokens },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: fetchData
    // remote: fetchData
  })

  articles.initialize()

  $typeahead_search.typeahead({
    highlight: true
  }, {
    source: articles.ttAdapter(),
    templates: {
      suggestion: Handlebars.compile([
        '<p class="article-title"><a href="{{ url }}">{{ title }}</a></p>',
        '<p class="article-date">Published: {{ created_at }}</p>'
      ].join(''))
    }
  })
  .on('typeahead:selected', function(obj, datum, name) {
      window.location.href = datum.url
  })
})
