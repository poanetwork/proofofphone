function verifyCodeFromSMS(code, phone, changeStepNumber, cb) {
	$.post("/verifyCodeFromSMS", {
		"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
		"code": code,
	 	"phone": phone
	}, function( data ) {
		cb();
	  	console.log( data );
	  	if (data.success) {
	  		hashToAddress = data.success.message;
			console.log(hashToAddress);
	  		changeStepNumber(+1, null);
	  		token.val(data.success.code);
	  		swal({   
				title: "Success",   
				text: "Code successfully verified",   
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