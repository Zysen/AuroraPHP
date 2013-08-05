<?php
	$products_requestHandlers = array();


    $page->registerScript("plugins/paypal/paypal.js", true, true);
	$page->registerCSS("plugins/paypal/paypal.css");
	$requestManager->registerRequestHandler("products_createInvoice", "products_createInvoice");
    function products_createInvoice($path){
    	global $current_user;
		$price = 100;
		$user_id = $current_user->get_SqlId();
		$ip = $_SERVER['REMOTE_ADDR'];
		if(array_key_exists("optionValue", $_POST)){
			$optionValue = mysql_real_escape_string($_POST['optionValue']);
		}
		else{
			$optionValue = "";
		}
		$query = "INSERT INTO `paypal_invoices` (`invoice_id`, `user_id`, `ip_address`, `timestamp`, `total`, `paid`, `payment_type`, `payment_date`, `payment_status`, `payer_status`, `first_name`, `last_name`, `payer_email`, `payer_id`, `business`, `receiver_email`, `receiver_id`, `residence_country`, `tax`, `mc_currency`, `mc_fee`, `mc_gross`, `mc_handling`, `mc_shipping`, `txn_type`, `txn_id`, `notify_version`, `verify_sign`, `charset`, `optionValue`) VALUES (NULL, '$user_id', '$ip', CURRENT_TIMESTAMP, '$price', '0', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '$optionValue');";
		mysql_query($query);				
		echo mysql_error();
		$invoiceId = mysql_insert_id();
		echo json_encode(array("invoiceId"=>$invoiceId));
}
$requestManager->registerRequestHandler("paypal_IPN", "paypal_IPN");
    function paypal_IPN($path){
    	global $current_user;
		global $settings;
    		
    	$ipn_post_data = $_POST;
		// Choose url
		if($settings['paypal_sandboxmode']==1||$settings['paypal_sandboxmode']=="1")
		    $url = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
		else
		    $url = 'https://www.paypal.com/cgi-bin/webscr';
		
		AuroraLog("PAYPAL", "IPN ACCESSED $url");
		
		// Set up request to PayPal
		$request = curl_init();
		curl_setopt_array($request, array
		(
		    CURLOPT_URL => $url,
		    CURLOPT_POST => TRUE,
		    CURLOPT_POSTFIELDS => http_build_query(array('cmd' => '_notify-validate') + $ipn_post_data),
		    CURLOPT_RETURNTRANSFER => TRUE,
		    CURLOPT_HEADER => FALSE/*,
		    CURLOPT_SSL_VERIFYPEER => TRUE,
		    CURLOPT_CAINFO => 'cacert.pem',*/
		));
		
		AuroraLog("PAYPAL", "Response received");
		
		// Execute request and get response and status code
		$response = curl_exec($request);
		$status   = curl_getinfo($request, CURLINFO_HTTP_CODE);
AuroraLog("PAYPAL", "Status: $status, Response: $response");
		// Close connection
		curl_close($request);
		
		if($status == 200 && $response == 'VERIFIED')
		{
			
			//Log(json_encode($response));
			$ipn_data = $ipn_post_data;
		    if(array_key_exists('charset', $ipn_data) && ($charset = $ipn_data['charset']))
				{
					AuroraLog("PAYPAL", "charset $charset");
				    // Ignore if same as our default
				    if($charset == 'utf-8')
				        return;

					$invoice_id = $ipn_data['invoice'];
					$total = 0;
					$ip = $SERVER['REMOTE_ADDR'];
					$paid = mysql_real_escape_string($ipn_data['paid']);
					$payment_type = mysql_real_escape_string($ipn_data['payment_type']);
					$payment_date = mysql_real_escape_string($ipn_data['payment_date']);
					$payment_status = mysql_real_escape_string($ipn_data['payment_status']);
					$payer_status = mysql_real_escape_string($ipn_data['payer_status']);
					$first_name = mysql_real_escape_string($ipn_data['first_name']);
					$last_name = mysql_real_escape_string($ipn_data['last_name']);
					$payer_email = mysql_real_escape_string($ipn_data['payer_email']);
					$payer_id = mysql_real_escape_string($ipn_data['payer_id']);
					$business = mysql_real_escape_string($ipn_data['business']);
					$receiver_email = mysql_real_escape_string($ipn_data['receiver_email']);
					$receiver_email = mysql_real_escape_string($ipn_data['receiver_email']);
					$receiver_id = mysql_real_escape_string($ipn_data['receiver_id']);
					$residence_country = mysql_real_escape_string($ipn_data['residence_country']);
					$tax = mysql_real_escape_string($ipn_data['tax']);
					$mc_currency = mysql_real_escape_string($ipn_data['mc_currency']);
					$mc_fee = mysql_real_escape_string($ipn_data['mc_fee']);
					$mc_gross = mysql_real_escape_string($ipn_data['mc_gross']);
					$mc_handling = mysql_real_escape_string($ipn_data['mc_handling']);
					$mc_shipping = mysql_real_escape_string($ipn_data['mc_shipping']);
					$txn_type = mysql_real_escape_string($ipn_data['txn_type']);
					$txn_id = mysql_real_escape_string($ipn_data['txn_id']);
					$notify_version = mysql_real_escape_string($ipn_data['notify_version']);
					$verify_sign = mysql_real_escape_string($ipn_data['verify_sign']);
					$charset = mysql_real_escape_string($ipn_data['charset']);

					if($ipn_data['payment_status']=="Completed"){
						$item_number = $ipn_data['item_number'];
						//mysql_query("UPDATE `products_invoices` SET `total` = '$mc_gross', `paid` = '1' WHERE `products_invoices`.`invoice_id` = $invoiceId;");//AND `user_id`=$userId 
						$query = "INSERT INTO `paypal_invoices` (`invoice_id`, `user_id`, `ip_address`, `timestamp`, `total`, `paid`, `payment_type`, `payment_date`, `payment_status`, `payer_status`, `first_name`, `last_name`, `payer_email`, `payer_id`, `business`, `receiver_email`, `receiver_id`, `residence_country`, `tax`, `mc_currency`, `mc_fee`, `mc_gross`, `mc_handling`, `mc_shipping`, `txn_type`, `txn_id`, `notify_version`, `verify_sign`, `charset`) VALUES ('$invoice_id', '$user_id', '$ip', CURRENT_TIMESTAMP, '$total', '$paid', '$payment_type', '$payment_date', '$payment_status', '$payer_status', '$first_name', '$last_name', '$payer_email', '$payer_id', '$business', '$receiver_email', '$receiver_id', '$residence_country', '$tax', '$mc_currency', '$mc_fee', '$mc_gross', '$mc_handling', '$mc_shipping', '$txn_type', '$txn_id', '$notify_version', '$verify_sign', '$charset') ON DUPLICATE KEY UPDATE `payment_type`='$payment_type', `payment_date`='$payment_date',`payment_status`='$payment_status', `payer_status`='$payer_status', `first_name`='$first_name', `last_name`='$last_name', `payer_email`='$payer_email', `payer_id`='$payer_id', `business`='$business', `receiver_email`='$receiver_email', `receiver_id`='$receiver_id', `residence_country`='$residence_country', `tax`='$tax', `mc_currency`='$mc_currency', `mc_fee`='$mc_fee', `mc_gross`='$mc_gross', `mc_handling`='$mc_handling', `mc_shipping`='$mc_shipping', `txn_type`='$txn_type', `txn_id`='$txn_id', `notify_version`='$notify_version', `verify_sign`='$verify_sign', `charset`='$charset';";
						mysql_query($query);
						AuroraLog("PAYPAL", mysql_error());
					}
					foreach($products_requestHandlers as $callback){
						AuroraLog("PAYPAL", $callback);
						$callback($ipn_data);
					}
				}
		}
		else
		{
		    // Not good. Ignore, or log for investigation...
		}
    }




?>