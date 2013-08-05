
//Example usage: <img src="/resources/noWidget.png" alt="{[{id: '1', text: 'Bla'}, {id: '2', text: 'Yo ho'}]}" class="widget_PayPalOptionButton" />

function PayPalOptionButton(instanceId, data){
	var paypalUrl = (data.sandboxMode!=undefined&&(data.sandboxMode==true||data.sandboxMode=="true"))?"https://www.sandbox.paypal.com/cgi-bin/webscr":"https://www.paypal.com/cgi-bin/webscr";
	var productId = data.productId;
    var products = data.products;
    var buttonText = (data.buttonText!=undefined)?data.buttonText:"Purchase";
    //var products = [{id: 2, text: "Bla"}, {id: 2, text: "Bla"}];
    
    var autoSubmit = (data.autoSubmit!=undefined)?data.autoSubmit:true;
    var showButton = (data.showButton!=undefined)?data.showButton:true;
    this.invoiceE = undefined;
    var requestInvoiceE = F.receiverE();
    this.loader=function(){
    	var quantityB = DOM.get(instanceId+"_quantity")==undefined?F.constantB(1):F.extractValueE(instanceId+"_quantity").startsWith(1);
    	var productSelectedB = F.extractValueE(instanceId+"_products").startsWith(DOM.get(instanceId+"_products").value);
		
		productSelectedB.liftB(function(productSelected){
			jQuery("."+instanceId+"_options").hide();
			jQuery("#"+instanceId+"_"+productSelected).show();
		});
		
		
		var paypalHTMLVariablesB = F.liftB(function(optionSelected, quantity){
			return {productId: optionSelected, quantity: quantity};
		}, productSelectedB, quantityB);
    	var buttonClickedE = F.extractEventE(instanceId+"_button", "click").snapshotE(paypalHTMLVariablesB).mapE(function(variables){
        	DOM.get(instanceId+"_productId").value = variables.productId;	
        	DOM.get(instanceId+"_quantityField").value = variables.quantity;	
        	
        	for(var index in products){
    			var product = products[index];
    			if(product.id==variables.productId&&product.optionName!=undefined&&product.options!=undefined){
    				DOM.get(instanceId+"_form").innerHTML+="<input type='hidden' name='on0' value='"+product.optionName+"' /><input type='hidden' name='os0' value='"+DOM.get(instanceId+"_"+variables.productId).value+"' />";	
    			}
    		}
    		
        	return {};
        });   
        this.invoiceE = getAjaxRequestE(F.mergeE(requestInvoiceE, buttonClickedE.mapE(function(){return true;})), "/request/products_createInvoice").mapE(function(invoice){
        	DOM.get(instanceId+"_form").innerHTML+="<input type='hidden' name='invoice' value='"+invoice.invoiceId+"' />";
        	if(autoSubmit){
        		//log(DOM.get(instanceId+"_form"));
        		DOM.get(instanceId+"_form").submit();
        	}
        	return invoice;
        });  
    }
    this.setOptionValue = function(value){
    	DOM.get(instanceId+"_option").value = value;
    };
    this.requestInvoice = function(option){
    	requestInvoiceE.sendEvent((option==undefined?true:option));
    };
    this.getForm = function(){
    	return DOM.get(instanceId+"_form");
    };
    this.submit = function(){
    	DOM.get(instanceId+"_form").submit();
    	/*this.requestInvoice();
    	autoSubmit = true;*/
    }
    this.build=function(){
    	var quantity = "&nbsp;&nbsp;<span class=\"payPal_quantityField\">Quantity: <select id=\""+instanceId+"_quantity\">";
    	if((data.showQuantity!=undefined&&data.showQuantity)||(data.maxQuantity!=undefined)){
	    	var maxQuantity = (data.maxQuantity!=undefined&&typeof(data.maxQuantity)=='number'?data.maxQuantity:50)
	    	for(var i=1;i<=maxQuantity;i++){
	    		 quantity+="<option value=\""+i+"\">"+i+"</option>";
	    	}
	    	quantity+="</select></span>";
    	}
    	else{
    		quantity = "";
    	}
    	var options = "";
    	var productsSelect = "<select id=\""+instanceId+"_products\" style=\"display: "+((data.hideSingle!=undefined&&data.hideSingle&&products.length==1)?"none":"")+"\">";
    	for(var index in products){
    		var product = products[index];
    		 productsSelect+="<option value=\""+product.id+"\">"+product.text+"</option>";
    		 if(product.options!=undefined){
    		 	options+="<select id=\""+instanceId+"_"+product.id+"\" class=\""+instanceId+"_options\">";
    		 	for(var index in product.options){
    		 		var option = product.options[index];
    		 		var text = option[1];
    		 		var optionValue = option[0];
    		 		options+="<option value=\""+optionValue+"\">"+text+"</option>";
    		 	}
    		 	options+="</select>";
    		 }
    	}
    	if(options.length>0){
    		options = "<br />"+options;
    	}
    	productsSelect+="</select>";
        var html = ""+
"<form id=\""+instanceId+"_form\" action=\""+paypalUrl+"\" method=\"post\" style=\"display: none;\">"+
"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">"+ 
//"<input type=\"hidden\" name=\"custom\" value=\""+SETTINGS['user']['id']+"\">"+  
"<input type=\"hidden\" id=\""+instanceId+"_quantityField\" name=\"quantity\" value=\"\">"+
"<input type=\"hidden\" id=\""+instanceId+"_productId\" name=\"hosted_button_id\" value=\"\">"+
"<input type=\"image\" src=\"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">"+
"<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">"+
"</form>"+productsSelect+options+quantity+"<br /><br /><span id=\""+instanceId+"_button\" style=\"margin: 0 auto; "+(showButton?"":"display:none;")+"\" class=\"button\">"+buttonText+"</span>";   
        return html;
    }
    this.destroy=function(){
    }                                                    
}
WIDGETS.register("PayPalOptionButton", PayPalOptionButton); 


/**
 *  PayPalBuyNowWidget
 * @constructor
 */     
function PayPalBuyNowWidget(instanceId, data){
	var paypalUrl = (data.sandboxMode!=undefined&&(data.sandboxMode==true||data.sandboxMode=="true"))?"https://www.sandbox.paypal.com/cgi-bin/webscr":"https://www.paypal.com/cgi-bin/webscr";
	var productId = data.productId;
    var options = (data.optionName==undefined)?"":"<input type=\"hidden\"name=\"on0\" value=\""+data.optionName+"\"><input type=\"hidden\" id=\""+instanceId+"_option\" name=\"os0\" value=\""+data.optionValue+"\" />";
    var buttonText = data.text==undefined||data.text.length===0?"Purchase Now":data.text; 
    var autoSubmit = (data.autoSubmit!=undefined)?data.autoSubmit:true;
    var showButton = (data.showButton!=undefined)?data.showButton:true;
    this.invoiceE = undefined;
    var requestInvoiceE = F.receiverE();
    this.loader=function(){
    	var buttonClickedE = F.extractEventE(instanceId+"_button", "click").mapE(function(){return {};});  
        this.invoiceE = getAjaxRequestE(F.mergeE(requestInvoiceE, buttonClickedE.mapE(function(){return true;})), "/request/products_createInvoice").mapE(function(invoice){
        	DOM.get(instanceId+"_form").innerHTML+="<input type='hidden' name='invoice' value='"+invoice.invoiceId+"' />";
        	if(autoSubmit){
        		DOM.get(instanceId+"_form").submit();
        	}
        	return invoice;
        });  
    }
    this.setOptionValue = function(value){
    	DOM.get(instanceId+"_option").value = value;
    };
    this.requestInvoice = function(option){
    	requestInvoiceE.sendEvent((option==undefined?true:option));
    };
    this.getForm = function(){
    	return DOM.get(instanceId+"_form");
    };
    this.submit = function(){
    	DOM.get(instanceId+"_form").submit();
    	/*this.requestInvoice();
    	autoSubmit = true;*/
    }
    this.build=function(){
    	
    	//var text = "";
    	var code = "";
        var url = "";
        var business = "";
        var accountLink = "";
        var buttonDesign = "";
        if(data!=undefined){
            code = data['code'];
            business = data['business'];
           // text = data['text'];
            url = data['url'];
            accountLink = data['accountLink'];
            buttonDesign = data['buttonDesign'];
        }
		var linkCode = "";
        if(accountLink==="accountcode"){
        	linkCode = "<input type=\"hidden\" name=\"hosted_button_id\" value=\""+code+"\">";
        }
        else if(accountLink==="businessname"){
        	linkCode = "<input type=\"hidden\" name=\"hosted_button_id\" value=\""+business+"\">";
        }
        
        var button = "";
        if(buttonDesign==="default"){
        	button = "<input type=\"image\" src=\"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">";
        }
        else if(buttonDesign==="imageurl"){
        	button = "<input type=\"image\" src=\""+url+"\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">";
        }
        var html = ""+
"<form id=\""+instanceId+"_form\" action=\""+paypalUrl+"\" method=\"post\" style=\"display: none;\">"+
"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">"+ 
//"<input type=\"hidden\" name=\"custom\" value=\""+SETTINGS['user']['id']+"\">"+  
linkCode+options+
"<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">"+
"</form><button id=\""+instanceId+"_button\" style=\"display:"+(buttonDesign==="customtext"?"block":"none")+";\">"+buttonText+"</button>"+button;
        return html;
    }
    this.destroy=function(){
    }                                                    
}





/**
 *  PayPalBuyNowWidgetConfigurator
 * @constructor
 */                                                      
/*function PayPalBuyNowWidgetConfigurator(){
    var id = "PayPalBuyNowWidgetConfigurator";
    this['load'] = function(newData){}
    this['build'] = function(newData){
        var productId = "";
        var optionName = ""; 
        var text = "";    
        if(newData!=undefined){
            productId = newData['productId'];
            optionName = newData['optionName']; 
            text = newData['text'];   
        }
        return "Product Id: <input type=\"text\" id=\""+id+"_productId\" value=\""+productId+"\" /><br />"+
        "Option Name: <input type=\"text\" id=\""+id+"_optionName\" value=\""+optionName+"\" /><br />"+
        "Text: <input type=\"text\" value=\""+text+"\" id=\""+id+"_text\" />";    
              
        //   productId      optionName
    }
    this['getData'] = function(){
        return {"productId": document.getElementById(id+'_productId').value, "optionName": document.getElementById(id+'_optionName').value, "text": document.getElementById(id+'_text').value};
    }
    this['getName'] = function(){
        return "PayPal Buy Now Button";
    }
    this['getDescription'] = function(){
        return "A Pay Pal Widget With HTML Option Selector";
    }
    this['getPackage'] = function(){
        return "Products";
    }
    this['getPlaceholder'] = function(editor){
    	var data = this.getData();
    	var abbr = editor.document.createElement('img');
        abbr.setAttribute('src', "https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif");
        abbr.setAttribute('class', "widget_PayPalBuyNowWidget");
        abbr.setAttribute('alt', JSON.stringify(data).replace('"', "'"));
        return abbr;
    }
}*/                                             
function PayPalBuyNowWidgetConfigurator(){
	 var id = "BuyNowWidgetConfigurator";
	this['load'] = function(newData){
		var accountLinkB = F.extractValueB(id+'_accountLink');
		
		F.insertValueB(F.ifB(accountLinkB.liftB(function(accountLink){return accountLink==="accountcode"}), F.constantB('table-row'), F.constantB('none')), id+'_accountCodeDisplayRow', 'style', 'display');
		F.insertValueB(F.ifB(accountLinkB.liftB(function(accountLink){return accountLink==="businessname"}), F.constantB('table-row'), F.constantB('none')), id+'_businessNameDisplayRow', 'style', 'display');
		
		var buttonDesignB = F.extractValueB(id+'_buttonDesign');
		
		F.insertValueB(F.ifB(buttonDesignB.liftB(function(accountLink){return accountLink==="default"}), F.constantB('table-row'), F.constantB('none')), id+'_defaultDisplay', 'style', 'display');
		F.insertValueB(F.ifB(buttonDesignB.liftB(function(accountLink){return accountLink==="imageurl"}), F.constantB('table-row'), F.constantB('none')), id+'_CustomUrlDisplayRow', 'style', 'display');
		F.insertValueB(F.ifB(buttonDesignB.liftB(function(accountLink){return accountLink==="customtext"}), F.constantB('table-row'), F.constantB('none')), id+'_customTextDisplayRow', 'style', 'display');
		
		F.insertValueB(F.extractValueB(id+'_customTextButtonInput').liftB(function(text){return (text.length==0?"Buy Now":text);}), id+'_customTextButton', 'innerHTML');
	}
   
    this['build'] = function(newData){
        var code = "";
        var text = "";
        var url = "";
        var business = "";
        var accountLink = "";
        var buttonDesign = "";
        if(newData!=undefined){
            code = newData['code'];
            business = newData['business'];
            text = newData['text'];
            url = newData['url'];
            accountLink = newData['accountLink'];
            buttonDesign = newData['buttonDesign'];
        }
        

        return "<table style=\"text-align: left;\">"+
        "<tr><td>Account Link Type</td><td><select id=\""+id+"_accountLink\"><option value=\"accountcode\" "+(accountLink==="accountcode"?" selected=\"true\"":"")+">Account Code</option><option value=\"businessname\" "+(accountLink==="businessname"?" selected=\"true\"":"")+">Business Name</option></select></td></tr>"+
        "<tr id=\""+id+"_accountCodeDisplayRow\"><td>&nbsp;</td><td><input id=\""+id+"_accountCodeDisplay\" type=\"text\" size=\"40\" placeholder=\"Enter Account Code Here\" value=\""+code+"\" /></td></tr>"+
        "<tr id=\""+id+"_businessNameDisplayRow\"><td>&nbsp;</td><td><input id=\""+id+"_businessNameDisplay\" type=\"text\" size=\"40\" placeholder=\"Enter Business Name Here\" value=\""+business+"\" /></td></tr>"+
        "<tr><td>Button Design</td><td><select id=\""+id+"_buttonDesign\"><option value=\"default\" "+(buttonDesign==="default"?" selected=\"true\"":"")+">Default</option><option value=\"imageurl\" "+((buttonDesign==="imageurl")?" selected=\"true\"":"")+">Custom Image URL</option><option value=\"customtext\" "+(buttonDesign==="customtext"?" selected=\"true\"":"")+">Custom Text</option></select></td></tr>"+
        "<tr id=\""+id+"_defaultDisplay\"><td>&nbsp;</td><td><img src=\"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\" /></td></tr>"+
        "<tr id=\""+id+"_customTextDisplayRow\"><td>&nbsp;</td><td><button id=\""+id+"_customTextButton\"></button><br /><input id=\""+id+"_customTextButtonInput\" type=\"text\" placeholder=\"Enter Button Text Here\" value=\""+text+"\" /></td></tr>"+
        "<tr id=\""+id+"_CustomUrlDisplayRow\"><td>&nbsp;</td><td><input id=\""+id+"_customUrl\" size=\"40\" type=\"text\" value=\""+url+"\" placeholder=\"Enter URL Here\" /></td></tr>"+
        "</table>";
    }
    this['getData'] = function(){
        return {"accountLink": document.getElementById(id+'_accountLink').value,"buttonDesign": document.getElementById(id+'_buttonDesign').value, "code": document.getElementById(id+'_accountCodeDisplay').value, "business": document.getElementById(id+'_businessNameDisplay').value, "url": document.getElementById(id+'_customUrl').value, "text": document.getElementById(id+'_customTextButtonInput').value};
    }
    this['getName'] = function(){
        return "PayPal Buy Now Button";
    }
    this['getDescription'] = function(){
        return "A button that purchases a single item via paypal";
    }
    this['getPackage'] = function(){
        return "Products";
    }
    this['getPlaceholder'] = function(editor){
    	var data = this.getData();
    	if(data.buttonDesign==='customtext'){
    		var abbr = editor.document.createElement('button');
    		abbr.$.innerHTML = data.text;
    	}
    	else{
    		var abbr = editor.document.createElement('img');
	        abbr.setAttribute('src', (data.buttonDesign==='imageurl')?data.url:"https://www.paypal.com/en_US/i/btn/btn_buynow_LG.gif");
    	}
    	abbr.setAttribute('class', "widget_PayPalBuyNowWidget");
	    abbr.setAttribute('title', JSON.stringify(data).replace('"', "'"));
	    return abbr;
    }
} 
WIDGETS.register("PayPalBuyNowWidget", PayPalBuyNowWidget, PayPalBuyNowWidgetConfigurator); 



/**
 *  ProductWidget
 * @constructor
 */ 
function ViewCartWidget(instanceId, data){
    var id = instanceId+"_container";
    
    var identifier = (data.accountLink==='accountcode')?"<input type=\"hidden\" name=\"encrypted\" value=\""+data.code+"\">":"<input type=\"hidden\" name=\"business\" value=\""+data.business+"\">"
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){           //<input type=\"hidden\" name=\"encrypted\" value=\""+code+"\">
        return "<form target=\"paypal\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\">"+identifier+"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"><input class=\"viewCart\" type=\"image\" src=\"https://www.paypal.com/en_US/i/btn/btn_viewcart_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\"></form>";
    }                         
}
                     
/**
 *  ViewCartWidgetConfigurator
 * @constructor
 */                                                      
function ViewCartWidgetConfigurator(){
	 var id = "ViewCartWidgetConfigurator";
	this['load'] = function(newData){
		var accountLinkB = F.extractValueB(id+'_accountLink');
		
		F.insertValueB(F.ifB(accountLinkB.liftB(function(accountLink){return accountLink==="accountcode"}), F.constantB('table-row'), F.constantB('none')), id+'_accountCodeDisplayRow', 'style', 'display');
		F.insertValueB(F.ifB(accountLinkB.liftB(function(accountLink){return accountLink==="businessname"}), F.constantB('table-row'), F.constantB('none')), id+'_businessNameDisplayRow', 'style', 'display');
		
		var buttonDesignB = F.extractValueB(id+'_buttonDesign');
		
		F.insertValueB(F.ifB(buttonDesignB.liftB(function(accountLink){return accountLink==="default"}), F.constantB('table-row'), F.constantB('none')), id+'_defaultDisplay', 'style', 'display');
		F.insertValueB(F.ifB(buttonDesignB.liftB(function(accountLink){return accountLink==="imageurl"}), F.constantB('table-row'), F.constantB('none')), id+'_CustomUrlDisplayRow', 'style', 'display');
		F.insertValueB(F.ifB(buttonDesignB.liftB(function(accountLink){return accountLink==="customtext"}), F.constantB('table-row'), F.constantB('none')), id+'_customTextDisplayRow', 'style', 'display');
		
		F.insertValueB(F.extractValueB(id+'_customTextButtonInput').liftB(function(text){return (text.length==0?"Buy Now":text);}), id+'_customTextButton', 'innerHTML');
	}
   
    this['build'] = function(newData){
        var code = "";
        var text = "";
        var url = "";
        var business = "";
        var accountLink = "";
        var buttonDesign = "";
        if(newData!=undefined){
            code = newData['code'];
            business = newData['business'];
            text = newData['text'];
            url = newData['url'];
            accountLink = newData['accountLink'];
            buttonDesign = newData['buttonDesign'];
        }
        

        return "<table style=\"text-align: left;\">"+
        "<tr><td>Account Link Type</td><td><select id=\""+id+"_accountLink\"><option value=\"accountcode\" "+(accountLink==="accountcode"?" selected=\"true\"":"")+">Account Code</option><option value=\"businessname\" "+(accountLink==="businessname"?" selected=\"true\"":"")+">Business Name</option></select></td></tr>"+
        "<tr id=\""+id+"_accountCodeDisplayRow\"><td>&nbsp;</td><td><input id=\""+id+"_accountCodeDisplay\" type=\"text\" size=\"40\" placeholder=\"Enter Account Code Here\" value=\""+code+"\" /></td></tr>"+
        "<tr id=\""+id+"_businessNameDisplayRow\"><td>&nbsp;</td><td><input id=\""+id+"_businessNameDisplay\" type=\"text\" size=\"40\" placeholder=\"Enter Business Name Here\" value=\""+business+"\" /></td></tr>"+
        "<tr><td>Button Design</td><td><select id=\""+id+"_buttonDesign\"><option value=\"default\" "+(buttonDesign==="default"?" selected=\"true\"":"")+">Default</option><option value=\"imageurl\" "+((buttonDesign==="imageurl")?" selected=\"true\"":"")+">Custom Image URL</option><option value=\"customtext\" "+((buttonDesign==="customtext")?" selected=\"true\"":"")+">Custom Text</option></select></td></tr>"+
        "<tr id=\""+id+"_defaultDisplay\"><td>&nbsp;</td><td><img src=\"https://www.paypal.com/en_US/i/btn/btn_viewcart_LG.gif\" /></td></tr>"+
        "<tr id=\""+id+"_customTextDisplayRow\"><td>&nbsp;</td><td><button id=\""+id+"_customTextButton\"></button><br /><input id=\""+id+"_customTextButtonInput\" type=\"text\" placeholder=\"Enter Button Text Here\" value=\""+text+"\" /></td></tr>"+
        "<tr id=\""+id+"_CustomUrlDisplayRow\"><td>&nbsp;</td><td><input id=\""+id+"_customUrl\" size=\"40\" type=\"text\" value=\""+url+"\" placeholder=\"Enter URL Here\" /></td></tr>"+
        "</table>";
    }
    this['getData'] = function(){
    	log(DOM.get(id+"_buttonDesign"));
        return {accountLink: document.getElementById(id+'_accountLink').value,buttonDesign: document.getElementById(id+'_buttonDesign').value, code: document.getElementById(id+'_accountCodeDisplay').value, business: document.getElementById(id+'_businessNameDisplay').value, url: document.getElementById(id+'_customUrl').value, text: document.getElementById(id+'_customTextButtonInput').value};
    }
    this['getName'] = function(){
        return "PayPal View Cart Button";
    }
    this['getDescription'] = function(){
        return "A button that takes you to your shopping cart";
    }
    this['getPackage'] = function(){
        return "Products";
    }
    this['getPlaceholder'] = function(editor){
    	var data = this.getData();
    	if(data.buttonDesign==='customtext'){
    		var abbr = editor.document.createElement('button');
    		abbr.$.innerHTML = data.text;
    	}
    	else{
    		var abbr = editor.document.createElement('img');
	        abbr.setAttribute('src', (data.buttonDesign==='imageurl')?data.url:"https://www.paypal.com/en_US/i/btn/btn_viewcart_LG.gif");
    	}
    	abbr.setAttribute('class', "widget_ViewCartWidget");
	    abbr.setAttribute('alt', JSON.stringify(data).replace('"', "'"));
	    return abbr;
    }
} 
WIDGETS.register("ViewCartWidget", ViewCartWidget, ViewCartWidgetConfigurator);





/*<form target="_self" action="https://www.paypal.com/cgi-bin/webscr"  
        method="post">  
  
    <!-- Identify your business so that you can collect the payments. -->  
    <input type="hidden" name="business" value="kin@kinskards.com">  
  
    <!-- Specify a PayPal Shopping Cart View Cart button. -->  
    <input type="hidden" name="cmd" value="_cart">  
    <input type="hidden" name="display" value="1">  
  
    <!-- Display the View Cart button. -->  
    <input type="image" name="submit" border="0"  
        src="https://www.paypal.com/en_US/i/btn/btn_viewcart_LG.gif"   
        alt="PayPal - The safer, easier way to pay online">  
    <img alt="" border="0" width="1" height="1"  
        src="https://www.paypal.com/en_US/i/scr/pixel.gif" >  
</form> */





function PayPalOrderStatusChecker(instanceId, data){
    this.loader = function(){
	    if(getVars.tx!=undefined){
	    	var transactionId = getVars.tx;
	    	var serverResponseE = getAjaxRequestE(F.oneE().mapE(function(){return {tx: transactionId}}), "/request/paypal_paymentreturn").mapE(function(response){
		    	log("Server Response");
		    	log(response);
		    });
    	}
    }
    this.build=function(){}
    this.destroy=function(){
    }                                                    
}
WIDGETS.register("PayPalOrderStatusChecker", PayPalOrderStatusChecker); 