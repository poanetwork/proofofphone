function sendCodeBySMS(phone, cb) {
	//cb(null, "0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a");
	$.post("/sendCodeBySMS", {
		"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
		"to": phone
	}, function( data ) {
		console.log( data );
        if (data.success) cb(null, data.success.token);
        else cb(data.error, null);
	});
}