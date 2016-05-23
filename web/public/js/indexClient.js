$(document).ready(function() {
	var stepNum = $('#stepNum');
	var stepLabel = $('.POPLabel');
	var stepTitle = $('.POPTitle');

	var inputContainer = $('.inputContainer');
	var POPInputPhone = $('.POPInputPhone');
	var POPInputSMS = $('.POPInputSMS');
	var POPInputWallet = $('.POPInputWallet');
	var POPSubmit = $('#POPSubmit');

	var radioContainer = $('.radioContainer');
	var POPradios = $('.POPradio');
	var phoneRadio = $('#phoneRadio');
	var walletRadio = $('#walletRadio');

	var POPBottomDescriptionContainer = $('.POPBottomDescriptionContainer');
	var successContainer = $('.successContainer');
	var successTableCellWalletValue = $('.successTableCellWalletValue');
	var successTableCellPhoneValue = $('.successTableCellPhoneValue');
	var token = $('#token');
	var loader = $('.loader');
	var middleMainContainerInner = $('.middleMainContainerInner');
	var bottomDesc = $('#bottomDesc');
	var bottomDescAddition = $('#bottomDescAddition');
	var bottomDescAddition2 = $('#bottomDescAddition2');
	var githubRibbon = $('.githubRibbon');
	var copyTable = $('.copyTable');
	var copyTableCellWalletValue1 = $('.copyTableCellWalletValue1');
	var copyTableCellWalletValue2 = $('.copyTableCellWalletValue2');

	var POPTitleContainer = $('.POPTitleContainer');
	var POPTitleContainerShortend = $('.POPTitleContainerShortend');
	var POPDescContainer = $('.POPDescContainer');
	var POPDescContainerShortend = $('.POPDescContainerShortend');

	var step1CopyTable = $('#step1CopyTable');
	var step3CopyTable = $('#step3CopyTable');
	
	var checkButton = $('#verifyButton');

	//location.reload();
	var topLabel = $('.topLabel');
	var bottomLabelRight = $('.bottomLabelRight');
	var homeButton = $('.homeButton');
	
	var shareButton = $('.shareButton');
	
	var copyHashTable = $('#copyHashTable');
	var hashToAddress = "";

	var addressVal = $("#addressVal");

	var wallet = QueryString.wallet;
	if (wallet) {
		POPInputWallet.val(wallet);
		changeStepNumber(null, 5);
		walletRadioCheck();
		getPhoneByAddress(function(err, output) {
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
			if (!err) {
				if (output != 0) {
					POPInputPhone.val(output);
					changeStepNumber(null, 4);
				}
			}
		});
	}

	var clientCopyWallet = new ZeroClipboard( document.getElementById("copyWallet") );

	clientCopyWallet.on( "ready", function( readyEvent ) {
		clientCopyWallet.on( "beforecopy", function( event ) {
			var addr = addressVal.text();
			$("#copyWallet").attr("data-clipboard-text",addr);
	    });
	    clientCopyWallet.on( "aftercopy", function( event ) {
	      Materialize.toast('Address copied to buffer', 3000, 'rounded');
	    });
  	});

  	var clientShare = new ZeroClipboard( document.getElementById("POPShare") );

	clientShare.on( "ready", function( readyEvent ) {
		clientShare.on( "beforecopy", function( event ) {
			var host = "https://"+window.location.hostname;
			var newUrl = host + "/?wallet=" + successTableCellWalletValue.text().trim();
	      	$("#POPShare").attr("data-clipboard-text",newUrl);
	    });
	    clientShare.on( "aftercopy", function( event ) {
	      Materialize.toast('url copied to buffer', 3000, 'rounded');
	    });
  	});

  	phoneRadio.click(function(e) {
  		phoneRadioCheck();
  	});

  	function phoneRadioCheck() {
  		POPradios.each(function(e) {
  			$(this).find('.POPRadioInner').removeClass('POPradioSelected');
  			$(this).find('.POPRadioInner').addClass('POPradioUnselected');
  		});
  		phoneRadio.find('.POPRadioInner').removeClass('POPradioUnselected');
  		phoneRadio.find('.POPRadioInner').addClass('POPradioSelected');
  		POPInputPhone.removeClass('hide');
  		POPInputPhone.focus();
  		POPInputWallet.addClass('hide');
  		$("#radioCheckPhone").prop("checked", true);
  	}

  	walletRadio.click(function(e) {
  		walletRadioCheck();
  	});

  	function walletRadioCheck() {
  		POPradios.each(function(e) {
  			$(this).find('.POPRadioInner').removeClass('POPradioSelected');
  			$(this).find('.POPRadioInner').addClass('POPradioUnselected');
  		});
  		walletRadio.find('.POPRadioInner').removeClass('POPradioUnselected');
  		walletRadio.find('.POPRadioInner').addClass('POPradioSelected');
  		POPInputWallet.removeClass('hide');
  		POPInputWallet.focus();
  		POPInputPhone.addClass('hide');
  		$("#radioCheckWallet").prop("checked", true);
  	}

  	topLabel.click(function(e) {
  		location.reload();
  	});

  	bottomLabelRight.click(function(e) {
  		location.reload();
  	});

	githubRibbon.click(function(e) {
		window.open("https://github.com/blocknotary/proofofphone", "_blank");
	});

	homeButton.click(function(e) {
		location.reload();
	});

	checkButton.click(function(e) {
		changeStepNumber(null, 5);
	});

	POPSubmit.click(function(e) {
		submit();
	});

	POPInputPhone.keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
	    POPSubmit.click();
	    return false;  
	  }
	});

	POPInputSMS.keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
	    POPSubmit.click();
	    return false;  
	  }
	});

	POPInputWallet.keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
	    POPSubmit.click();
	    return false;  
	  }
	});

	function submit() {
		var visibleInput = $('input:visible');
		var curStepNum = parseInt(stepNum.val());
		if (visibleInput.val() != "") {
			middleMainContainerInner.fadeOut(500);
			loader.removeClass('hide');
			switch(curStepNum) {
				case 1:
					sendCodeBySMS(visibleInput.val());
					break;
				case 2:
					verifyCodeFromSMS();
					break;
				case 3:
					addPhoneToWallet();
					break;
				case 5:
					{
						var radioVal = $('input[name=radioCheck]:checked').val();
						if (radioVal == "wallet") {
							getPhoneByAddress();
						} else {
							getAddressByPhone();
						}
					}
					break;
				default:
					{
						middleMainContainerInner.fadeIn(500);
						loader.addClass('hide');
					}
					break;
			}
		} else {
			visibleInput.focus();
		}
	}

	function changeStepNumber(addition, absolute) {
		console.log(hashToAddress);
		var newStepVal = 0;
		if (addition)
			newStepVal = parseInt(stepNum.val()) + addition;
		else
			newStepVal = absolute;
		stepNum.val(newStepVal);
		var newStepNum = parseInt(stepNum.val());

		stepLabel.text("Step " + newStepNum);
		//POPInput.val("");
		switch(newStepNum) {
			case 1:
				{
					stepTitle.text("Submit your phone number");
					bottomDesc.text("Enter a phone number you'd like to join with your Ethereum address. We will send you an SMS. After verification, we will ask you to deposit  a service fee of 0.1 ether to a smart contract at the address");
					stepLabel.removeClass("hide");
					radioContainer.addClass("hide");
					inputContainer.show();
					POPBottomDescriptionContainer.show();
					POPInputPhone.removeClass('hide');
					POPInputPhone.focus();
					POPInputSMS.addClass('hide');
					POPInputWallet.addClass('hide');
					POPBottomDescriptionContainer.removeClass("hide");
					copyTable.show();
					step1CopyTable.removeClass("hide");
					step3CopyTable.addClass("hide");
					bottomDescAddition.addClass("hide");
					copyHashTable.addClass("hide");
					successContainer.addClass("hide");
					POPTitleContainerShortend.addClass("POPTitleContainer");
					POPTitleContainerShortend.removeClass("POPTitleContainerShortend");
					POPDescContainerShortend.addClass("POPDescContainer");
					POPDescContainerShortend.removeClass("POPDescContainerShortend");
				}
				break;
			case 2:
				{
					stepTitle.text("Submit received code");
					bottomDesc.text("Copy the code from the SMS to continue");
					stepLabel.removeClass("hide");
					radioContainer.addClass("hide");
					inputContainer.show();
					POPBottomDescriptionContainer.show();
					POPInputPhone.addClass('hide');
					POPInputSMS.removeClass('hide');
					POPInputSMS.focus();
					POPInputWallet.addClass('hide');
					POPBottomDescriptionContainer.removeClass("hide");
					step1CopyTable.addClass("hide");
					step3CopyTable.addClass("hide");
					bottomDescAddition.addClass("hide");
					copyHashTable.addClass("hide");
					successContainer.addClass("hide");
					POPTitleContainerShortend.addClass("POPTitleContainer");
					POPTitleContainerShortend.removeClass("POPTitleContainerShortend");
					POPDescContainerShortend.addClass("POPDescContainer");
					POPDescContainerShortend.removeClass("POPDescContainerShortend");
				}
				break;
			case 3:
				{
					stepTitle.text("Submit your Ethereum address");
					bottomDesc.text("Deposit service fee of 0.1 ETH to a smart contract with a message");
					
					$("#hashVal").text(hashToAddress);
					var clientCopyHash = new ZeroClipboard( document.getElementById("hashCopy") );

					clientCopyHash.on( "ready", function( readyEvent ) {
						clientCopyHash.on( "beforecopy", function( event ) {
							$("#hashCopy").attr("data-clipboard-text", hashToAddress);
					    });
					    clientCopyHash.on( "aftercopy", function( event ) {
					      Materialize.toast('message copied to buffer', 3000, 'rounded');
					    });
				  	});

					bottomDescAddition.html("at the address");
					stepLabel.removeClass("hide");
					radioContainer.addClass("hide");
					inputContainer.show();
					POPBottomDescriptionContainer.show();
					POPInputPhone.addClass('hide');
					POPInputSMS.addClass('hide');
					POPInputWallet.removeClass('hide');
					POPInputWallet.focus();
					POPBottomDescriptionContainer.removeClass("hide");
					step1CopyTable.addClass("hide");
					step3CopyTable.removeClass("hide");
					bottomDescAddition.removeClass("hide");
					copyHashTable.removeClass("hide");
					successContainer.addClass("hide");
					POPTitleContainerShortend.addClass("POPTitleContainer");
					POPTitleContainerShortend.removeClass("POPTitleContainerShortend");
					POPDescContainerShortend.addClass("POPDescContainer");
					POPDescContainerShortend.removeClass("POPDescContainerShortend");
				}
				break;
			case 4:
				{
					stepTitle.text("Success");
					stepLabel.addClass("hide");
					POPBottomDescriptionContainer.hide();
					/*bottomDescAddition2.html('There is a smart contract has the following public method signature:\
						<table cellspacing="0" cellpadding="0" class="copyTable nomargin" style="display: table;"><tbody class="copyTableBody"><tr><td class="copyTableCellWalletValue1">\
						hasPhone (address _addr)\
						</td></tr></tbody></table>\
						If the _addr is registered in the contract\'s Phone Registry, the hasPhone method returns true. Otherwise it returns false.');
					*/
					bottomDescAddition2.html('There is a smart contract deployed to the public ethereum Blockchain. You can find it here:\
						<table cellspacing="0" cellpadding="0" class="copyTable nomargin" style="display: table;"><tbody class="copyTableBody"><tr><td class="copyTableCellWalletValue2">' 
						+ copyTableCellWalletValue1.text() + 
						'</td><td id="copyWallet3" data-clipboard-text="'+ copyTableCellWalletValue1.text() + '" class="copyTableCellCopyButton"></td></tr></tbody></table>This contract has the following public method signature:\
						hasPhone (address _addr).<br/>\
						If the _addr is registered in the contract\'s Phone Registry, the hasPhone method returns true. Otherwise it returns false.');

					successTableCellWalletValue.text(POPInputWallet.val());
					successTableCellPhoneValue.text(POPInputPhone.val());
					radioContainer.addClass("hide");
					inputContainer.hide();
					POPBottomDescriptionContainer.addClass("hide");
					step1CopyTable.addClass("hide");
					step3CopyTable.addClass("hide");
					bottomDescAddition.addClass("hide");
					bottomDescAddition2.removeClass("hide");
					copyHashTable.addClass("hide");
					successContainer.removeClass("hide");
					POPTitleContainerShortend.addClass("POPTitleContainer");
					POPTitleContainerShortend.removeClass("POPTitleContainerShortend");
					POPDescContainerShortend.addClass("POPDescContainer");
					POPDescContainerShortend.removeClass("POPDescContainerShortend");

					var clientCopyWallet3 = new ZeroClipboard( $("#copyWallet3")[0] );

					clientCopyWallet3.on( "ready", function( readyEvent ) {
					    clientCopyWallet3.on( "aftercopy", function( event ) {
					      Materialize.toast('Address copied to buffer', 3000, 'rounded');
					    });
				  	});
				}
				break;
			case 5:
				{
					stepTitle.text("Check");
					bottomDesc.html('Enter a phone number or an ethereum address to continue. <br/>\
						There is a smart contract deployed to the public ethereum Blockchain. You can find it here:\
						<table cellspacing="0" cellpadding="0" class="copyTable nomargin" style="display: table;"><tbody class="copyTableBody"><tr><td class="copyTableCellWalletValue2">' 
						+ copyTableCellWalletValue1.text() + 
						'</td><td id="copyWallet2" data-clipboard-text="'+ copyTableCellWalletValue1.text() + '" class="copyTableCellCopyButton"></td></tr></tbody></table>This contract has the following public method signature:\
						hasPhone (address _addr).<br/>\
						If the _addr is registered in the contract\'s Phone Registry, the hasPhone method returns true. Otherwise it returns false.');

					POPBottomDescriptionContainer.show();
					stepLabel.addClass("hide");
					phoneRadioCheck();
					radioContainer.removeClass("hide");
					inputContainer.show();
					POPBottomDescriptionContainer.show();
					POPInputPhone.removeClass('hide');
					POPInputPhone.focus();
					POPInputSMS.addClass('hide');
					POPInputWallet.addClass('hide');
					POPBottomDescriptionContainer.removeClass("hide");
					step1CopyTable.addClass("hide");
					step3CopyTable.addClass("hide");
					bottomDescAddition.addClass("hide");
					bottomDescAddition2.addClass("hide");
					copyHashTable.addClass("hide");
					successContainer.addClass("hide");
					POPTitleContainer.addClass("POPTitleContainerShortend");
					POPTitleContainer.removeClass("POPTitleContainer");
					POPDescContainer.addClass("POPDescContainerShortend");
					POPDescContainer.removeClass("POPDescContainer");

					var clientCopyWallet2 = new ZeroClipboard( $("#copyWallet2")[0] );

					console.log(clientCopyWallet2);

					clientCopyWallet2.on( "ready", function( readyEvent ) {
						clientCopyWallet2.on( "aftercopy", function( event ) {
					      Materialize.toast('Address copied to buffer', 3000, 'rounded');
					    });
				  	});
				}
				break;
			default:
				{
					stepTitle.text("Submit your phone number");
					stepLabel.removeClass("hide");
					POPBottomDescriptionContainer.removeClass("hide");
					step1CopyTable.addClass("hide");
					step3CopyTable.addClass("hide");
					bottomDescAddition.addClass("hide");
					bottomDescAddition2.addClass("hide");
					copyHashTable.addClass("hide");
					successContainer.addClass("hide");
				}
				break;
		}
	}

	function sendCodeBySMS(phone) {
		$.post("/sendCodeBySMS", {
			"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
			"to": phone
		}, function( data ) {
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
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

	function verifyCodeFromSMS() {
		$.post("/verifyCodeFromSMS", {
			"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
			"code": POPInputSMS.val(),
		 	"phone": POPInputPhone.val()
		}, function( data ) {
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
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

	function addPhoneToWallet() {
		$.post("/newPhoneToAddr", {
		 	"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
		 	"phone": POPInputPhone.val(),
		 	"wallet": POPInputWallet.val(),
		 	"code": POPInputSMS.val()
		}, function( data ) {
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
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

	function getPhoneByAddress() {
		$.post("/getPhoneByAddress", {
			"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
			"wallet": POPInputWallet.val()
		}, function( data ) {
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
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

	function getAddressByPhone() {
		$.post("/getAddressByPhone", {
			"globalToken": "cba2c691-47df-41e7-bc97-a0818103ed14",
			"phone": POPInputPhone.val()
		}, function( data ) {
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');

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
});