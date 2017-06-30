//launches main application
function startDapp(web3, isOraclesNetwork) {
	console.log(web3);
	var sender;
	$(function() {
		if (!isOraclesNetwork) return;
		getAccounts(function(accounts) {
			getConfig(function(config) {
				getConfigCallBack(web3, accounts, config);	
			});
		});

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
		copyTableCellWalletValue1.text("0xf7e9626dbaeb1a6c8b3d02379eb54b81f16e785f");
		var copyTableCellWalletValue2 = $('.copyTableCellWalletValue2');

		var POPTitleContainer = $('.POPTitleContainer');
		var POPTitleContainerShortend = $('.POPTitleContainerShortend');
		var POPDescContainer = $('.POPDescContainer');
		var POPDescContainerShortend = $('.POPDescContainerShortend');

		var step1CopyTable = $('#step1CopyTable');
		var step3CopyTable = $('#step3CopyTable');
		
		var checkButton = $('#verifyButton');

		var topLabel = $('.topLabel');
		var bottomLabelRight = $('.bottomLabelRight');
		var homeButton = $('.homeButton');
		
		var shareButton = $('.shareButton');
		
		var copyHashTable = $('#copyHashTable');
		
		var checkboxContainer = $(".checkboxContainer");
		var POPcheckbox = $(".POPcheckbox");
		var privacyPolicyCheckbox = $("#privacyPolicyCheckbox");

		var addressVal = $("#addressVal");

		function getConfigCallBack(web3, accounts, config) {
			console.log(accounts);
			if (accounts.length == 1) {
				sender = accounts[0];
				POPInputWallet.val(sender);
			} else {
				swal("Warning", "You haven't chosen any account in Oracles plugin. Please, choose your account in Oracles plugin and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
			}

			var wallet = QueryString.wallet;
			if (wallet) {
				POPInputWallet.val(wallet);
				changeStepNumber(null, 4);
				walletRadioCheck();
				getPhoneByAddress(web3, config, sender, POPInputWallet.val(), function(err, phone) {
					middleMainContainerInner.fadeIn(500);
					loader.addClass('hide');
					if (!err) {
						if (phone != 0) {
							POPInputPhone.val(phone);
							changeStepNumber(null, 3);
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

		  	POPcheckbox.click(function(e) {
		  		if ($(this).find(".POPcheckboxSelected")[0]) {
		  			$(this).find(".POPcheckboxSelected").addClass("POPcheckboxUnselected");
		  			$(this).find(".POPcheckboxSelected").removeClass("POPcheckboxSelected");
		  			privacyPolicyCheckbox.prop( "checked", false );
		  		} else {
		  			$(this).find(".POPcheckboxUnselected").addClass("POPcheckboxSelected");
		  			$(this).find(".POPcheckboxUnselected").removeClass("POPcheckboxUnselected");
		  			privacyPolicyCheckbox.prop( "checked", true );
		  		}
		  	});

		  	walletRadio.click(function(e) {
		  		walletRadioCheck();
		  	});

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
				changeStepNumber(null, 4);
			});

			POPSubmit.click(function(e) {
				submit(config, sender);
			});

			POPInputPhone.keypress(function (e) {
			 var key = e.which;
			 	if (key == 13) { // the enter key code
			    	POPSubmit.click();
			    	return false;  
				}
			});

			POPInputSMS.keypress(function (e) {
			 	var key = e.which;
			 	if (key == 13) { // the enter key code
			    	POPSubmit.click();
			    	return false;  
				}
			});

			POPInputWallet.keypress(function (e) {
			 	var key = e.which;
			 	if (key == 13) { // the enter key code
			    	POPSubmit.click();
			    	return false;  
			  	}
			});
		}

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

	  	function submit(config, sender) {
			var visibleInput = $('input:visible');
			var curStepNum = parseInt(stepNum.val());
			if (visibleInput.val() != "") {
				middleMainContainerInner.fadeOut(500);
				loader.removeClass('hide');
				switch(curStepNum) {
					case 1: {
						var phoneNumber = parseInt(visibleInput.val());
						sendCodeBySMS(phoneNumber, function(err, token) {
							if (err) {
								middleMainContainerInner.fadeIn(500);
								loader.addClass('hide');
								return showAlert(err, err.message);
							}
							addToken(web3, config, sender, phoneNumber, token, function(err, txHash) {
								if (err) {
									if (err.type != "REQUEST_REJECTED") showAlert(err, err.message);
									middleMainContainerInner.fadeIn(500);
									loader.addClass('hide');
									return;
								}
								if (txHash) {
									getTxCallBack(txHash, function() {
										changeStepNumber(+1, null);
										middleMainContainerInner.fadeIn(500);
										loader.addClass('hide');
										swal({   
											title: "Success",   
											text: "Code successfully sent by SMS",   
											type: "success"
										});
									});
								}
							});
						});
					} break;
					case 2: {
						var code = POPInputSMS.val();
						var token = web3.sha3(code);
						verifyCodeFromSMS(web3, config, sender, token, function(err, txHash) {
							if (err) {
								if (err.type != "REQUEST_REJECTED") showAlert(null, "Invalid code entered");
								middleMainContainerInner.fadeIn(500);
								loader.addClass('hide');
								return;
							}
							if (txHash) {
								getTxCallBack(txHash, function() {
									changeStepNumber(+1, null);
									middleMainContainerInner.fadeIn(500);
									loader.addClass('hide');
								});
							}
						});
					} break;
					case 4:
						{
							var radioVal = $('input[name=radioCheck]:checked').val();
							if (radioVal == "wallet") {
								getPhoneByAddress(web3, config, sender, POPInputWallet.val(), function(err, phone) {
									if (err) return showAlert(err, err.message);
									console.log(phone);
									if (phone != 0) {
										POPInputPhone.val(phone);
										changeStepNumber(null, 3);
									} else {
										swal({   
											title: "Warning",   
											text: "Phone wasn't set for this wallet yet",   
											type: "warning"
										});
									}
									middleMainContainerInner.fadeIn(500);
									loader.addClass('hide');
								});
							} else {
								getAddressByPhone(web3, config, sender, POPInputPhone.val(), function(err, addr) {
									if (err) return showAlert(err, err.message);
									if (addr != "0x0000000000000000000000000000000000000000" && addr != "0x") {
										POPInputWallet.val(addr);
										changeStepNumber(null, 3);
									} else {
										swal({   
											title: "Warning",   
											text: "This phone wasn't set for any wallet yet",   
											type: "warning"
										});
									}
									middleMainContainerInner.fadeIn(500);
									loader.addClass('hide');
								});
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
			} else visibleInput.focus();
		}

		function changeStepNumber(addition, absolute) {
			var newStepVal = 0;
			if (addition) newStepVal = parseInt(stepNum.val()) + addition;
			else newStepVal = absolute;
			stepNum.val(newStepVal);
			var newStepNum = parseInt(stepNum.val());

			stepLabel.text("Step " + newStepNum);
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
						checkboxContainer.removeClass("hide");
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
						checkboxContainer.addClass("hide");
					}
					break;
				case 3:
					{
						stepTitle.text("Success");
						stepLabel.addClass("hide");
						POPBottomDescriptionContainer.hide();
						bottomDescAddition2.html('There is a smart contract deployed to the Oracles network. You can find it here:\
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
						checkboxContainer.addClass("hide");

						var clientCopyWallet3 = new ZeroClipboard( $("#copyWallet3")[0] );

						clientCopyWallet3.on( "ready", function( readyEvent ) {
						    clientCopyWallet3.on( "aftercopy", function( event ) {
						      Materialize.toast('Address copied to buffer', 3000, 'rounded');
						    });
					  	});
					}
					break;
				case 4:
					{
						stepTitle.text("Check");
						bottomDesc.html('Enter a phone number or an Ethereum address to continue. <br/>\
							There is a smart contract deployed to the Oracles network. You can find it here:\
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
					  	checkboxContainer.addClass("hide");
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
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});