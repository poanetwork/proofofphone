function getAddressByPhone(phone, changeStepNumber, cb) {
	$.post("/getAddressByPhone", {
		"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
		"phone": phone
	}, function( data ) {
		cb();

		if (data.success) {
			if (data.success.addr != "0x0000000000000000000000000000000000000000") {
				POPInputWallet.val(data.success.addr);
				changeStepNumber(null, 4);
			} else {
				swal({   
					title: "Warning",   
					text: "This phone wasn't set for any wallet yet",   
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