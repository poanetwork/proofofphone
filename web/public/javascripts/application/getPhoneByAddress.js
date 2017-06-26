function getPhoneByAddress(wallet, changeStepNumber, cb) {
	$.post("/getPhoneByAddress", {
		"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
		"wallet": wallet
	}, function( data ) {
		cb();

		if (data.success) {
			if (data.success.phone != 0) {
				POPInputPhone.val(data.success.phone);
				changeStepNumber(null, 4);
			} else {
				swal({   
					title: "Warning",   
					text: "Phone wasn't set for this wallet yet",   
					type: "warning"
				});
			}
			
		} else {
			swal({   
				title: "Error",   
				text: data.error.message,   
				type: "error"
			});
		}
	});
}