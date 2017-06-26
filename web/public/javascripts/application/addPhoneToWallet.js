function addPhoneToWallet(phone, wallet, code, changeStepNumber, cb) {
	$.post("/newPhoneToAddr", {
	 	"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
	 	"phone": phone,
	 	"wallet": wallet,
	 	"code": code
	}, function( data ) {
		cb();

		if (data.success) {
			changeStepNumber(+1, null);
		} else if (data.error.code == 1000) {
			swal({   
				title: "Warning",   
				text: data.error.message,   
				type: "warning"
			});
		} else {
			swal({   
				title: "Error",   
				text: data.error.message,   
				type: "error"
			});
		}
	});
}