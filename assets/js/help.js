$(document).ready(function(){

  // add class to all code tags
  $('code, pre').addClass('language-markup', function(){
    // then load prism syntax highlighting
    var script = document.createElement('script');
    script.src = prismUrl;
    document.getElementsByTagName('head')[0].appendChild(script);
  });

});