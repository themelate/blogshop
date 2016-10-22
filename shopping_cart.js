function scs()
{
	simpleCart.empty();
	$('#pembayaran').show();
	$('#pemesanan').hide();
	$('#mycart').hide();
}
function opensucces() {
  var $_GET = {};
	if(document.location.toString().indexOf('?') !== -1) {
	    var query = document.location
	                   .toString()
	                   // get the query string
	                   .replace(/^.*?\?/, '')
	                   // and remove any existing hash string (thanks, @vrijdenker)
	                   .replace(/#.*$/, '')
	                   .split('&');
	
	    for(var i=0, l=query.length; i<l; i++) {
	       var aux = decodeURIComponent(query[i]).split('=');
	       $_GET[aux[0]] = aux[1];
	    }
	}
	//get the 'index' query parameter
	if($_GET['success'] == "do")
	{
		scs();
	}
	else if($_GET['success'] == "not")
	{
		alert('Invoice not send!');
	}
}
$(document).ready(function(){
	//open pembayaran where success
	opensucces();
	//ajax
	$("#shopping_cart_form_biasa").submit(function(event){
		event.preventDefault();
		$("#loading-process").show();
		// jika salah satu kosong untuk mengisi
		var smanagertypemark    		= $("[name='smanagertypemark']").val();
		var smanagertypecart    		= $("[name='smanagertypecart']").val();
		var smanagertotal      			= $("[name='smanagertotal']").val();
		var smanageremail    			= cartEmail;
		var smanagerisicart    			= $("[name='smanagerisicart']").val();
		var smanagerpaymin    			= $("[name='smanagerpaymin']").val();
		var smanagerlanguage			= $("[name='smanagerlanguage']").val();
		var smanagertitel	       		= $("[name='smanagertitel']").val();
		var smanagerlogo	       		= $("[name='smanagerlogo']").val();
		var smanageraddress    			= $("[name='smanageraddress']").val();
		var smanagersurel       		= $("[name='smanagersurel']").val();
		var smanagernami	       		= $("[name='smanagernami']").val();
		var smanagerhenpon 	      		= $("[name='smanagerhenpon']").val();
		var smanagergriyo       		= $("[name='smanagergriyo']").val();
		var smanagerpostal       		= $("[name='smanagerpostal']").val();
		var smanagermsg       			= $("[name='smanagermsg']").val();
		var smanagerurl       			= $("[name='smanagerurl']").val();

	    $.ajax({
	      	url: "http://files.themelate.com/blogshop/checkout.php?from=ajax",
	      	type: "POST",
	      	data: {smanagertypemark:smanagertypemark,smanagertypecart:smanagertypecart,smanagertotal:smanagertotal,smanageremail:smanageremail,smanagerisicart:smanagerisicart,smanagerpaymin:smanagerpaymin,smanagerlanguage:smanagerlanguage,smanagertitel:smanagertitel,smanagerlogo:smanagerlogo,smanageraddress:smanageraddress,smanagersurel:smanagersurel,smanagernami:smanagernami,smanagerhenpon:smanagerhenpon,smanagergriyo:smanagergriyo,smanagerpostal:smanagerpostal,smanagermsg:smanagermsg,smanagerurl:smanagerurl},
	      	success:function(result,status) {
				$("#loading-process").hide();
	      		response = result.split("|");
				if(response[0] == '"1')
				{
					//alert(response[1]);
					// ajax pengiriman pemesanan
					scs();
				}
				else	
				{
					alert(response[1]);
				}
			}
	    });
	});
});
function shopping_cart (step) {
	if(step == "mycart")
	{
		$('#mycart').show();
		$('#pemesanan').hide();
		$('#pembayaran').hide();
	}
	else if(step == "pemesanan")
	{
		// jika item kosong tidak bisa ke pemesanan
		var item_cart = document.getElementById("jumlah_item");
		if(item_cart.innerHTML == "0")
		{
			alert("Your cart is empty!");
		}
		else 
		{
			// get detail
			var detail_cart 		= document.getElementById("tableCart");
			var detail_payment 		= document.getElementById("cart-payment");
			var order_total_count 	= document.getElementById("cart_total");
			$("[name='smanagerisicart']").val(detail_cart.innerHTML);
			$("[name='smanagerpaymin']").val(detail_payment.innerHTML);
			$("[name='smanagertotal']").val(order_total_count.innerHTML);
			// get url
			pathArray = window.location.href.split( '/' );
			protocol = pathArray[0];
			host = pathArray[2];
			url = protocol + '//' + host;
			$("[name='smanagerurltoko']").val(url);
			// open tab
			$('#pemesanan').show();
			$('#mycart').hide();
			$('#pembayaran').hide();
		}
	}
}