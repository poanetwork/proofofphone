function sendCodeBySMS(phone, changeStepNumber, cb) {
	$.post("/sendCodeBySMS", {
		"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
		"to": phone
	}, function( data ) {
	  	console.log( data );
	  	if (data.success) {
	  		changeStepNumber(+1, null);
	  		token.val(data.success.code);
	  		swal({   
				title: "Success",   
				text: "Code successfully sent by SMS",   
				type: "success"
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