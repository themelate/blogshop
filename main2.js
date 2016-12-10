function addScript(e,t){var n=$(window).width();if(n>=t){if(!document.getElementsByTagName||!document.createElement||!document.appendChild){return false}else{var r=document.createElement("script");r.type="text/javascript";r.src=e;document.getElementsByTagName("head")[0].appendChild(r);return true}}}function swipe(){if($("#wrapper").css("left")=="0px"){$("#wrapper").fadeIn(300).animate({left:"220px"},{queue:false,duration:150});$("#wrapper").attr("onclick","swipe()")}else{$("#wrapper").fadeIn(300).animate({left:"0px"},{queue:false,duration:150});$("#wrapper").removeAttr("onclick")}}function review(e){if(e=="deskripsi"){$("#deskripsi").addClass("active");$(".deskripsi").show();$("#review").removeClass("active");$(".review").hide()}else if(e=="review"){$("#deskripsi").removeClass("active");$(".deskripsi").hide();$("#review").addClass("active");$(".review").show()}}(function(e){var t=false;e(window).scroll(function(){if(!t){var n=e(window).scrollTop();if(n<450){e(".top").stop(true).animate({opacity:0},10)}else{e(".top").stop(true).animate({opacity:1},300)}}})})(jQuery);$(document).ready(function(){var e=$(".secondary-menu").find("ul").html();var t=$(".primary-menu").find("ul").html();$("#menu").html("<h3>Menu</h3><ul>"+e+t+"</ul>");var n=$(".deskrip").html();$(".deskripsi").html(n);var r=$(".harga").html();$(".price").html(r);$(".hGfzU").html("Blogshop Template By <a href='http://www.themelate.com'>Themelate</a>");$("a[href=#top]").click(function(){$("html, body").animate({scrollTop:0},"slow");return false})});

// resize
function resizeThumb(el, from, to) {
    $(el).each(function() {
        $(this).attr({
            'src': $(this).attr('src').replace('/s'+from+'-c/', '/s'+to+'-c/'),
            'width': to, 'height': 'auto'
        });
		$(this).attr({
            'src': $(this).attr('src').replace('/w'+from+'-h'+from+'-p/', '/w'+to+'-h'+to+'-p/'),
            'width': to, 'height': 'auto'
        });
    });
}
// show notif
function showNotif()
{
	if($('.notifMsg').css('display') == 'none')
	{
		$('.notifMsg').css('bottom','-100px');
		$('.notifMsg').fadeIn(200).animate({'bottom':'20px'},{queue:false,duration:200});
		$('.notifMsg').delay(7000).fadeOut(500);
	}
}
$( document ).ready(function() {
  if(type == 'nocart') {
    $('#buy').removeAttr('href');
    $('#buy').removeAttr('onclick');
    $('#buy').attr('href', link_cart);
	$('#buy').attr('target', '_blank');
  }
});
