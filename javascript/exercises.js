$(document).ready(function(){
	var wH = $(window).height();
	var navH = $('#table_of_contents').height();
	var footerH = $('footer').height();
	var iframeNewHeight = wH - navH - footerH;
	var url = window.location.href;
	url = url.replace(/.*url=/i,'');
	$('#exercise_container').attr('src',url).css('height',iframeNewHeight + 'px');
});