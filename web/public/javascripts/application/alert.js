function showAlert(err, msg) {
	if (!err) {
		swal({
		  title: "Error",
		  text: msg,
		  type: "error"
		});
	}
	else {
		if (err.type != "REQUEST_REJECTED") {
			console.log(err);
			swal({
			  title: "Error",
			  text: msg,
			  type: "error"
			});
		}
	}
}