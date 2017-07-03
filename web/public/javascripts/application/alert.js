function showAlert(err, msg, type) {
	if (err) console.log(err);
	if (err.type == "REQUEST_REJECTED") return;
	swal({
	  title: type?capitalizeFirstLetter(type):"Error",
	  text: msg?msg:err.message,
	  type: type?type:"error"
	});
}