$(document).ready(function(){
	wH = $(window).height();
	navH = $('#table_of_contents').height();
	footerH = $('footer').height();
	iframeNewHeight = wH - navH - footerH;
	url = window.location.href;
	url = url.replace(/.*url=/i,'');
	$('#exercise_container').attr('src',url).css('height',iframeNewHeight + 'px');
});