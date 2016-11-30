/****************************************************************
Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
******************************************************************/
function formatNumber(number)
{
    var number = number.toFixed(2) + '';
    var x = number.split('.');
    var x1 = x[0];
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}
function cart( email , matauang) {
	var ongkir 			= $("[name='smanagerongkir']").val();
	this.totalItems 	= 0;
	this.totalPrice		= 0.00;
	this.totalWeight	= 0.0;
	this.totalShip		= ongkir;
	this.totalOrder 	= ongkir;
	this.items 			= new Array();
	this.userEmail 		= email;
	// order of columns, you change the order here or by accessing the value in your html
	this.ItemColumns = ['Image','Name','Price','Quantity','Weight','Total','Remove'];
	
	//alert("hi");
	/*	function to initialize the cart when the page is loaded  */
	this.initialize = function () {
		if( !readCookie("simpleCart") ) {
			this.totalItems  = 0;
			this.totalPrice = 0.00;
			this.totalWeight = 0.0;
		} else {
			data = readCookie("simpleCart").split("&");
			this.totalItems = data[0]*1;
			this.totalPrice = data[1]*1;
			this.totalWeight = data[2]*1;
			for(x=3;x < (data.length);x++) {
				newItem = new item();
				itemData = data[x].split(",");
				i=0;
				for(i=0;i<itemData.length;i++) {
					pair = itemData[i].split('=');
					newItem.addValue(pair[0],pair[1],pair[2]);
				}
				if(!newItem.getValue('name') || !newItem.getValue('price') || !newItem.getValue('weight') || !newItem.getValue('quantity')) {
					alert("item must have price, name, and quantity!");
					return false;
				}
				this.items[x-3] = newItem;
			}
			
		}
		this.setUpEvents();
		this.updateCookie();
		this.updatePageElements();
		return;
	};
	
	/* the two functions below are event listener functions.  when using 
	 * addEventListener, 'this' in the scope of the called function is either 
	 * the element with the listener or the document (in IE).  they simply avoid 
	 * using the this variable due to this scope issue.
	 */
	
	this.checkOutEvent = function() {
		simpleCart.checkOut();
		return false;
	};
	
	this.emptyEvent = function() {
		simpleCart.empty();
		return false;
	};
	
	/* set up the Event Listeners for the empty cart and checkout
	 * links in the page. 
	 */
	
	this.setUpEvents = function() {
			var x=0,element,elements = getElementsByClassName('simpleCart_total');

			x=0;
			elements = getElementsByClassName('simpleCart_checkout');
			for( x=0;x<elements.length;x++) {
				element = elements[x];
				if( element.addEventListener ) {
					element.addEventListener("click", this.checkOutEvent, false );
				} else if( element.attachEvent ) {
				  	element.attachEvent( "onclick", this.checkOutEvent );
				}
			}
			x=0;
			elements = getElementsByClassName('simpleCart_empty');
			for( x=0;x<elements.length;x++) {
				element = elements[x];
				if( element.addEventListener ) {
					element.addEventListener("click", this.emptyEvent, false );
				} else if( element.attachEvent ) {
				  	element.attachEvent( "onclick", this.emptyEvent );
				}
			}
			return;
	};
	
	/*	add an item to the shopping cart with the name and price.
	 *  if there is an item with the same value for every field, 
	 *  the quantity for that item will increase.  if any field 
	 *  is different, the item will be considered new.  if a quantity
	 *  is specified, that will be the quanitity of that item that 
	 *  that will be added.
	 */	
	this.add = function() {
		newItem = new item();
		var x=0;
		for(x=0;x<arguments.length;x++){
			temp = arguments[x];
			data = temp.split('=');
			newItem.addValue(data[0],data[1]);
		}
		
		// get ukuran dan type
		var check_one = document.getElementById('option_one');
		if(check_one) {
			var option1_html 	= document.getElementById('option_one_html').innerHTML;
			var option1_value 	= document.getElementById('option_one').value;	
			newItem.addValue('type', option1_html+' : '+option1_value);
		}
		var check_two = document.getElementById('option_two');
		if(check_two) {
			var option2_html 	= document.getElementById('option_two_html').innerHTML;
			var option2_value 	= document.getElementById('option_two').value;
			newItem.addValue('color', option2_html+' : '+option2_value);
		}

		if(!newItem.getValue('name') || !newItem.getValue('price') || !newItem.getValue('weight')) {
			alert('Item must have name, weight and price to be added to the cart!');
			return false;
		}
		//function notif
		showNotif();
		
		isnew = true;
		if(!newItem.getValue('quantity')) {
			newItem.addValue('quantity',1);
		}
		this.totalItems = this.totalItems + newItem.getValue('quantity');
		x=0;
		for( x=0;x < this.items.length;x++ ) {
			tempItem = this.items[x];
			if( tempItem.equalTo(newItem) ) {
				tempItem.addValue( 'quantity' , (parseInt(tempItem.getValue('quantity')) + parseInt(newItem.getValue('quantity')) ) );
				this.totalPrice = this.totalPrice + parseFloat( tempItem.getValue('price') );
				this.totalWeight = this.totalWeight + parseFloat( tempItem.getValue('weight') );
				isnew = false;
			}
		}
		if( isnew ) {
			this.items[this.items.length] = newItem;
			this.totalPrice = this.totalPrice + parseFloat(newItem.getValue('price'));
			this.totalWeight = this.totalWeight + parseFloat(newItem.getValue('weight'));
		}
		this.updateCookie();
		this.updatePageElements();
		return;
	};
	
	this.addItem = function(newItem) {
		var x=0;
		for(x=0;x<this.items.length;x++) {
			var tempItem = this.items[x];
			if( tempItem.equalTo(newItem) ){
				tempItem.addValue('quantity', parseInt(newItem.getValue('quantity')) + parseInt(tempItem.getValue('quantity')) );
				this.totalItems = this.totalItems + parseInt(newItem.getValue('quantity'));
				this.totalPrice = this.totalPrice + parseInt(newItem.getValue('quantity'))*parseFloat(newItem.getValue('price'));
				this.totalWeight = this.totalWeight + parseInt(newItem.getValue('quantity'))*parseFloat(newItem.getValue('weight'));
				return;
			}
		}
		this.items[this.items.length] = newItem;
		this.totalItems = this.totalItems + parseInt(newItem.getValue('quantity'));
		this.totalPrice = this.totalPrice + parseInt(newItem.getValue('quantity'))*parseFloat(newItem.getValue('price'));
		this.totalWeight = this.totalWeight + parseInt(newItem.getValue('quantity'))*parseFloat(newItem.getValue('weight'));
		return;
	};
	
	/* this function will update the cookie used to store the cart info
	 * when anything is changed in the cart. 
	 */ 
	this.updateCookie = function () {
		cookieString = String(this.totalItems) + "&" + String(this.totalPrice) + "&" + String(this.totalWeight);
		x=0;
		for(x=0;x<this.items.length;x++ ) {
			tempItem = this.items[x];
			cookieString = cookieString + "&" + tempItem.cookieString();
		}
		createCookie("simpleCart", cookieString, 30 );
	}
	
	// reset the variables of the cart, update the cookies
	this.empty = function () {
		this.items = new Array();
		this.totalItems = 0;
		this.totalPrice = 0.00;
		this.totalWeight = 0.0;
		this.updateCookie();
		this.updatePageElements();
		return false;
	};
	
	/* remove an item from the items array when an item
	 * is removed from the cart
	 */
	this.deleteItem = function( item ) {  
		found = false;
		var temp = new Array();
		for(x=0; x < this.items.length;x++ ) {
			tempItem = this.items[x];		
			if( tempItem.equalTo(item) ) {
				found = true;
				this.totalItems = this.totalItems - parseFloat(tempItem.getValue('quantity'));
				this.totalPrice = this.totalPrice - parseFloat(tempItem.getValue('price'));
				this.totalWeight = this.totalWeight - parseFloat(tempItem.getValue('weight'));
			}
			if( found ) {
				if( x < ( this.items.length - 1 ) ) {
					temp[x] = this.items[x+1];
				} 
			} else {
				temp[x] = this.items[x];
			}
		}
		this.items = temp;
		this.updateCookie();
		this.updatePageElements();
		return false;
	};
	
	// determine if there are any options 
	this.options = function() {
		var x=0;
		for(x=0;x<this.items.length;x++) {
			var temp = this.items[x];
			if( temp.optionList() ) {
				return true;
			}
		}
		return false;
	};

	function check_null(val) {
		if(val != null)
		{
			var value = "<br>"+val;
			return value;
		}
		else
		{
			value = "";
			return value;
		}
	}
	
	// update elements on html pages
	this.updatePageElements = function() {
		var x=0,element,elements = getElementsByClassName('simpleCart_total');
		for( x=0;x<elements.length;x++) {
			element = elements[x];
			element.innerHTML = this.returnTotalPrice();
		}
		var x=0,element,elements = getElementsByClassName('simpleCart_shipping');
		for( x=0;x<elements.length;x++) {
			element = elements[x];
			element.innerHTML = this.returnTotalShip();
		}
		var x=0,element,elements = getElementsByClassName('simpleCart_total_cart');
		for( x=0;x<elements.length;x++) {
			element = elements[x];
			element.innerHTML = this.returnTotalOrder();
		}
		x=0;
		elements = getElementsByClassName('simpleCart_quantity');
		for( x=0;x<elements.length;x++) {
			element = elements[x];
			element.innerHTML = String(this.totalItems);
		}
		elements = getElementsByClassName('fortotalPrice');
		for( x=0;x<elements.length;x++) {
			element = elements[x];
			element.innerHTML = String(this.returnTotalHarga());
		}
		elements = getElementsByClassName('simpleCart_weight');
		for( x=0;x<elements.length;x++) {
			element = elements[x];
			element.innerHTML = String(this.returnTotalWeight());
		}
		elements = getElementsByClassName('simpleCart_items');
		for( x=0;x<elements.length;x++) {
			cartTable = elements[x];
			newRow = document.createElement('div');
			var x=0,i=0;
			//delete all current rows
			while (cartTable.childNodes[0]) {
			    cartTable.removeChild(cartTable.childNodes[0]);
			}
			
			// create the header
			for( x=0;x<this.ItemColumns.length;x++) {
				if( this.ItemColumns[x] != 'Options' || this.options() ) {
					tempCell = document.createElement('div');
					tempCell.innerHTML = this.ItemColumns[x];
					tempCell.className = "item" + this.ItemColumns[x];
					newRow.appendChild(tempCell);
				}
			}
			newRow.className = "cartHeaders";
			cartTable.appendChild(newRow);
			
			// create a row for each item
			x=0;
			for( x=0;x<this.items.length;x++ ) 
			{
				tempItem = this.items[x];
				newRow = document.createElement('div');
				i=0;
				for(i=0;i<this.ItemColumns.length;i++) {
					tempCell = document.createElement('div');
					tempCell.className = "item" + this.ItemColumns[i];
					if( this.ItemColumns[i] == 'Image' ) {
						if( tempItem.getValue('image') ) {
							tempCell.innerHTML = '<img src="' + tempItem.getValue('image') + '" />';
						}
					}
					if( this.ItemColumns[i] == 'Name' ) {
						tempCell.innerHTML = "<b>"+tempItem.getValue('name')+"</b>"+check_null(tempItem.getValue('type'))+check_null(tempItem.getValue('color'));
					} else if (	this.ItemColumns[i] == 'Price' ) {
						tempCell.innerHTML = this.returnFormattedPrice( tempItem.getValue('price'));
					} else if ( this.ItemColumns[i] == 'Options' && this.options() ) {
						tempCell.innerHTML = tempItem.optionList();
					} else if (	this.ItemColumns[i] == 'Quantity' ) {
						tempCell.innerHTML = '<input type="number" onblur="simpleCart.updateQuantity(' + tempItem.functionString() +',\'new_quantity=\' + this.value);cekHarga();return false;"value="' + tempItem.getValue('quantity') + '" />';
					} else if (	this.ItemColumns[i] == 'Weight' ) {
						tempCell.innerHTML = this.returnFormattedWeight( tempItem.getValue('weight'))+" kg";
					} else if (	this.ItemColumns[i] == 'Total' ) {
						tempCell.innerHTML = this.returnFormattedPrice( tempItem.getValue('quantity')* tempItem.getValue('price') );
					} else if (	this.ItemColumns[i] == 'Remove' ) {
						tempCell.innerHTML = '<a class="removeButton" onclick="simpleCart.updateQuantity(' + tempItem.functionString() +',\'new_quantity=0\');cekHarga();return false;">Remove</a>';
					}
					newRow.appendChild(tempCell);
				}
				newRow.className = "itemContainer"
				cartTable.appendChild(newRow);
			}
			// create totals row
			newRow = document.createElement('div');
			tempCell = document.createElement('div');
			tempCell.innerHTML = String(this.totalItems);
			tempCell.className = "totalItems";
			newRow.appendChild(tempCell);
			tempCell = document.createElement('div');
			tempCell.innerHTML = this.returnTotalPrice();
			tempCell.className = "totalPrice";
			newRow.appendChild(tempCell);
			tempCell = document.createElement('div');
			tempCell.innerHTML = this.returnTotalWeight();
			tempCell.className = "totalWeight";
			newRow.appendChild(tempCell);
			newRow.className = "totalRow";
			cartTable.appendChild(newRow);	
		}
		elements = getElementsByClassName('simpleCart_table');
		for( x=0;x<elements.length;x++) {
			cartTable = elements[x];
			var x=0,i=0;
			//delete all current rows
			while (cartTable.childNodes[0]) {
			    cartTable.removeChild(cartTable.childNodes[0]);
			}
			
			newRow = document.createElement('tr');
			// create the header
			for( x=0;x<6;x++) {
				if( this.ItemColumns[x] != 'Options' || this.options() ) {
					tempCell = document.createElement('th');
					tempCell.innerHTML = this.ItemColumns[x];
					tempCell.className = "item" + this.ItemColumns[x];
					newRow.appendChild(tempCell);
				}
			}
			newRow.className = "thead";
			cartTable.appendChild(newRow);
			
			// create a row for each item
			x=0;
			for( x=0;x<this.items.length;x++ ) 
			{
				tempItem = this.items[x];
				newRow = document.createElement('tr');
				i=0;
				for(i=0;i<6;i++) {
					tempCell = document.createElement('td');
					tempCell.className = "item" + this.ItemColumns[i];
					if( this.ItemColumns[i] == 'Image' ) {
						if( tempItem.getValue('image') ) {
							tempCell.innerHTML = '<img src="' + tempItem.getValue('image') + '" />';
						}
					}
					if( this.ItemColumns[i] == 'Name' ) {
						tempCell.innerHTML = tempItem.getValue('name');
					} else if (	this.ItemColumns[i] == 'Price' ) {
						tempCell.innerHTML = this.returnFormattedPrice( tempItem.getValue('price'));
					} else if (	this.ItemColumns[i] == 'Quantity' ) {
						tempCell.innerHTML = tempItem.getValue('quantity');
					} else if (	this.ItemColumns[i] == 'Weight' ) {
						tempCell.innerHTML = this.returnFormattedWeight( tempItem.getValue('weight'))+" kg";
					} else if (	this.ItemColumns[i] == 'Total' ) {
						tempCell.innerHTML = this.returnFormattedPrice( tempItem.getValue('quantity')* tempItem.getValue('price') );
					}
					newRow.appendChild(tempCell);
				}
				newRow.className = "cartHeaders"
				cartTable.appendChild(newRow);
			}
		}
		return false;	
	};
	
	// return the cart total just number
	this.returnTotalHarga = function() {
		return this.totalPrice;
	};
	// return the cart total 
	this.returnTotalPrice = function() {
		return this.returnFormattedPrice( this.totalPrice );	
	};
	// return the cart total 
	this.returnTotalWeight = function() {
		return this.returnFormattedWeight( this.totalWeight );	
	};
	// return the ongkir 
	this.returnTotalShip = function() {
		return this.returnFormattedPrice( this.totalShip );	
	};
	// return the order 
	this.returnTotalOrder = function() {
		return this.returnFormattedPrice( this.totalOrder );	
	};
	// return a price with the format $xxx.xx
	this.returnFormattedPrice = function( price ) {
		temp = Math.round(price*100);
		change = String(temp%100);
		if( change.length == 0) {
			change = "00";
		} else if( change.length == 1) {
			change = "0" + change;
		}
		temp = formatNumber(temp/100);
		return matauang + temp + "." + change;
	};
	// return a price with the format $xxx.xx
	this.returnFormattedWeight = function( weight ) {
		var newnumber = new Number(weight+'').toFixed(parseInt(2));
		var temp =  parseFloat(newnumber);
		return temp;
	};
	
	this.updateQuantity = function() {
		newItem = new item();
		x=0;
		for(x=0;x<arguments.length;x++){
			temp = arguments[x];
			data = temp.split('=');
			if( data[0] == 'new_quantity') {
				var new_quantity = data[1];
			} else {
				newItem.addValue(data[0],data[1]);
			}
		}
		if( new_quantity < 1 ) {
			this.deleteItem( newItem );
			return;
		}
		newQuan = new_quantity - newItem.getValue('quantity');
		newItem.addValue('quantity', newQuan );
		this.addItem(newItem);
		this.updateCookie();
		this.updatePageElements();
		return false;
	}
	
	// send user to paypal checkout with all the items in the cart
	this.checkOut = function() { 
		if( this.totalItems == 0 ){
			alert("Your cart is empty!");
			return false;
		} 
		var winpar = "scrollbars,location,resizable,status";
		var i,j=0,des,counter;
		var strn  = "https://www.paypal.com/cgi-bin/webscr?cmd=_cart" +
		   			"&upload=1" +
		        	"&business=" + this.userEmail + 
					"&currency_code=USD" +
		  			"&lc=US";
		counter = 0;
		for (counter = 0; counter < this.items.length; counter++) { 
			tempItem = this.items[counter];
			j = counter + 1; 
			strn = strn + 	"&item_name_"    + j + "=" + tempItem.getValue('name') +
		                	"&item_number_"  + j + "=" + j +
		                	"&quantity_"     + j + "=" + tempItem.getValue('quantity') +
		                	"&amount_"       + j + "=" + this.returnFormattedPrice(tempItem.getValue('price') ) +
		      				"&no_shipping_"  + j + "=" + "0" +
							"&no_note_"   	 + j + "=" + "1";
			if( tempItem.optionList() ) {
				strn = strn + "&on0_"		+ j + "=" + "Options" +
				 			  "&os0_"		+ j + "=" + tempItem.optionList();
			}			
				
		}
		window.open (strn, "paypal", winpar);
		return false;
	};
}
/*************************************************************************************************
         This is the item class.  It will contain an array of name-value pairs.
 *************************************************************************************************/

function item () {
	this.names	= new Array();
	this.values	= new Array();
	
	/* add a name-value pair to the item,
	 * return false and alert if the names 
	 * and values don't match.
	 */
	this.addValue = function(name,value) {
		if( this.names.length != this.values.length ) {
			alert("name and value array lengths do not match for this item!");
			return false;
		}
		found = false;
		var a=0;
		for(a=0;a<this.names.length;a++) {
			if( this.names[a] == name ) {
				this.values[a] = value;
				return;
			}
		}
		if( !found ) {
			this.names[this.names.length]	= name;
			this.values[this.values.length]	= value;
		}
		return;
	};
	

	
	/* return the value associated with the
	 * name key, return null if the name is not
	 * found
	 */
	this.getValue = function(name) {
		var g=0;
		for(g=0;g<this.names.length;g++) {
			if(name==this.names[g]) {
				return this.values[g];
			}
		}
		return null;
	};
	
	/* return true if the item is equal to 
	 * the item passed in, false otherwise 
	 */
	this.equalTo = function(item) {
		if(this.getSize() != item.getSize() ) {
			return false;
		} 
		var q=0;
		for(q=0;q<this.names.length;q++) {
			if( this.names[q] != 'quantity' && (item.getValue(this.names[q]) != this.values[q]) ) {
				return false;
			}
		}
		return true;
	};

	this.getSize = function() {
		return this.names.length;
	};
	
	this.cookieString = function() {
		returnString = '';
		var i=0;
		returnString = this.names[i] + "=" + this.values[i];
		i=1;
		for(i=1;i<this.names.length;i++) {
			returnString = returnString + "," + this.names[i] + "=" + this.values[i];
		}
		return returnString;
	};
	
	this.functionString = function() {
		returnString = '\'';
		var f=0;
		returnString = '\'' + this.names[f] + "=" + this.values[f];
		f=1;
		for(f=1;f<this.names.length;f++) {
			returnString = returnString + "','" + this.names[f] + "=" + this.values[f];
		}
		returnString = returnString + '\'';
		return returnString;
	}
	
	this.optionList = function() {
		returnString = '';
		if( this.getSize() < 4 ) {
			return null;
		}
		var o=0;
		for(o=0;o<this.names.length;o++) {
			if(this.names[o] != 'quantity' && this.names[o] != 'price' && this.names[o] != 'weight' && this.names[o] != 'name' && this.names[o] != 'image') {
				returnString = returnString + this.names[o] + ':' + this.values[o] + ', ';
			}
		}
		while(returnString.charAt(returnString.length-1)==',' || returnString.charAt(returnString.length-1)==' ' || returnString.charAt(returnString.length)==':'){
			returnString = returnString.substring(0,returnString.length-1);
		}
		return returnString;
	};
}
	

//*************************************************************************************************
// Thanks to Peter-Paul Koch for these cookie functions! (http://www.quirksmode.org/js/cookies.html)
//*************************************************************************************************
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

//*************************************************************************************************
/*
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
*/	
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|"+matauang+")"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};
//*************************************************************************************************

function createCart(){
	simpleCart.initialize();
	return;
}
var ElementCheckInterval = setInterval("simpleCart.updatePageElements()", 10000);
window.onload = createCart;
