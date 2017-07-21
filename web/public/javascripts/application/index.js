//launches main proofofphone application
function startDapp(web3, isOraclesNetwork) {
	console.log(web3);
	var sender;
	$(function() {
		if (!isOraclesNetwork) return;
		//gets accounts, chosen at Oracles plugin
		getAccounts(function(accounts) {
			//gets Ethereum config data
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
		var loader = $('.loader');
		var middleMainContainerInner = $('.middleMainContainerInner');
		var bottomDesc = $('#bottomDesc');
		var bottomDescAddition = $('#bottomDescAddition');
		var bottomDescAddition2 = $('#bottomDescAddition2');
		var POPTitleContainer = $('.POPTitleContainer');
		var POPTitleContainerShortend = $('.POPTitleContainerShortend');
		var POPDescContainer = $('.POPDescContainer');
		var POPDescContainerShortend = $('.POPDescContainerShortend');

		var step1CopyTable = $('#step1CopyTable');
		var step3CopyTable = $('#step3CopyTable');
		
		var addr = $("#addressVal").text();
		$("#copyWallet").attr("data-clipboard-text", addr);

		function getConfigCallBack(web3, accounts, config) {
			console.log(accounts);
			if (accounts.length == 1) {
				sender = accounts[0];
				POPInputWallet.val(sender);
			} else showAlert(null, chooseAccountAlertText, "warning");

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

			buildCopyWalletControl("copyWallet");
			buildCopyURLControl("POPShare");

		  	phoneRadio.click(function(e) {
		  		phoneRadioCheck();
		  	});

		  	walletRadio.click(function(e) {
		  		walletRadioCheck();
		  	});

		  	$('.topLabel').click(function(e) {
		  		location.reload();
		  	});

		  	$('.bottomLabelRight').click(function(e) {
		  		location.reload();
		  	});

			$('.githubRibbon').click(function(e) {
				window.open(githubURL, "_blank");
			});

			$('.homeButton').click(function(e) {
				location.reload();
			});

			$('#verifyButton').click(function(e) {
				changeStepNumber(null, 4);
			});

			POPSubmit.click(function(e) {
				submit(config, sender);
			});

			POPInputPhone.keypress(inputKeyPressEvent);
			POPInputSMS.keypress(inputKeyPressEvent);
			POPInputWallet.keypress(inputKeyPressEvent);
		}

		function inputKeyPressEvent(e) {
			var key = e.which;
		 	if (key == 13) { // the enter key code
		    	POPSubmit.click();
		    	return false;  
		  	}
		}

		function phoneRadioCheck() {
	  		unselectPOPRadios();
	  		phoneRadio.find('.POPRadioInner').removeClass('POPradioUnselected');
	  		phoneRadio.find('.POPRadioInner').addClass('POPradioSelected');
	  		POPInputPhone.removeClass('hide');
	  		POPInputPhone.focus();
	  		POPInputWallet.addClass('hide');
	  		$("#radioCheckPhone").prop("checked", true);
	  	}

	  	function walletRadioCheck() {
	  		unselectPOPRadios();
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

			if (visibleInput.val() == "") return visibleInput.focus();

			middleMainContainerInner.fadeOut(500);
			loader.removeClass('hide');
			switch(curStepNum) {
				case 1: {
					var phoneNumber = parseInt(visibleInput.val());
					sendCodeBySMS(phoneNumber, sendCodeBySMSCallback);
				} break;
				case 2: {
					var code = parseInt(POPInputSMS.val());
					//var token = web3.sha3(code);
					verifyCodeFromSMS(web3, config, sender, code, verifyCodeFromSMSCallback);
				} break;
				case 4:
					{
						var radioVal = $('input[name=radioCheck]:checked').val();
						if (radioVal == "wallet") {
							getPhoneByAddress(web3, config, sender, POPInputWallet.val(), getPhoneByAddressCallback);
						} else {
							getAddressByPhone(web3, config, sender, POPInputPhone.val(), getAddressByPhoneCallback);
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
		}

		function changeStepNumber(addition, absolute) {
			var newStepVal = 0;
			if (addition) newStepVal = parseInt(stepNum.val()) + addition;
			else newStepVal = absolute;
			stepNum.val(newStepVal);
			var newStepNum = parseInt(stepNum.val());

			stepLabel.text("Step " + newStepNum);
			switch(newStepNum) {
				case 2:
					{
						stepTitle.text(secondStepTitleText);
						bottomDesc.text(secondStepTitleDescription);
						stepLabel.removeClass("hide");
						radioContainer.addClass("hide");
						inputContainer.show();
						POPBottomDescriptionContainer.show();
						POPInputPhone.addClass('hide');
						POPInputSMS.removeClass('hide');
						POPInputSMS.focus();
						POPInputWallet.addClass('hide');
						step1CopyTable.hide();
						step3CopyTable.addClass("hide");
						bottomDescAddition.addClass("hide");
						successContainer.addClass("hide");
						POPTitleContainerShortend.addClass("POPTitleContainer");
						POPTitleContainerShortend.removeClass("POPTitleContainerShortend");
						POPDescContainerShortend.addClass("POPDescContainer");
						POPDescContainerShortend.removeClass("POPDescContainerShortend");
					}
					break;
				case 3:
					{
						stepTitle.text(thirdStepTitleText);
						stepLabel.addClass("hide");
						POPBottomDescriptionContainer.hide();
						bottomDescAddition2.html(bottomMainText);
						bottomDescAddition2.removeClass("hide");
						$('.successTableCellWalletValue').text(POPInputWallet.val());
						var host = "https://" + window.location.hostname;
						var newUrl = host + "/?wallet=" + POPInputWallet.val().trim();
				      	$("#POPShare").attr("data-clipboard-text", newUrl);

						$('.successTableCellPhoneValue').text(POPInputPhone.val());
						radioContainer.addClass("hide");
						inputContainer.hide();
						step1CopyTable.hide();
						step3CopyTable.addClass("hide");
						bottomDescAddition.addClass("hide");
						successContainer.removeClass("hide");
						POPTitleContainerShortend.addClass("POPTitleContainer");
						POPTitleContainerShortend.removeClass("POPTitleContainerShortend");
						POPDescContainerShortend.addClass("POPDescContainer");
						POPDescContainerShortend.removeClass("POPDescContainerShortend");

						buildCopyWalletControl("copyWallet3");
					}
					break;
				case 4:
					{
						stepTitle.text("Check");
						bottomDesc.html(bottomCheckPageText);

						stepLabel.addClass("hide");
						phoneRadioCheck();
						radioContainer.removeClass("hide");
						inputContainer.show();
						POPBottomDescriptionContainer.show();
						POPInputPhone.removeClass('hide');
						POPInputPhone.focus();
						POPInputSMS.addClass('hide');
						POPInputWallet.addClass('hide');
						step1CopyTable.hide();
						step3CopyTable.addClass("hide");
						bottomDescAddition.addClass("hide");
						bottomDescAddition2.addClass("hide");
						successContainer.addClass("hide");
						POPTitleContainer.addClass("POPTitleContainerShortend");
						POPTitleContainer.removeClass("POPTitleContainer");
						POPDescContainer.addClass("POPDescContainerShortend");
						POPDescContainer.removeClass("POPDescContainer");

						buildCopyWalletControl("copyWallet2");
					}
					break;
				default:
					{
						stepTitle.text(defaultStepTitleText);
						stepLabel.removeClass("hide");
						POPBottomDescriptionContainer.show();
						step1CopyTable.hide();
						step3CopyTable.addClass("hide");
						bottomDescAddition.addClass("hide");
						bottomDescAddition2.addClass("hide");
						successContainer.addClass("hide");
					}
					break;
			}
		}

		function unselectPOPRadios() {
			POPradios.each(function(e) {
	  			$(this).find('.POPRadioInner').removeClass('POPradioSelected');
	  			$(this).find('.POPRadioInner').addClass('POPradioUnselected');
	  		});
		}

		function sendCodeBySMSCallback(err, token) {
			if (err) {
				middleMainContainerInner.fadeIn(500);
				loader.addClass('hide');
				return showAlert(err, err.message);
			}
			addToken(web3, config, sender, phoneNumber, token, function(err, txHash) {
				if (err) {
					showAlert(err, err.message);
					middleMainContainerInner.fadeIn(500);
					loader.addClass('hide');
					return;
				}
				if (txHash) {
					getTxCallBack(txHash, function() {
						changeStepNumber(+1, null);
						middleMainContainerInner.fadeIn(500);
						loader.addClass('hide');
						showAlert(null, codeSuccessfullySentBySMSText, "success");
					});
				}
			});
		}

		function verifyCodeFromSMSCallback(err, txHash) {
			if (err) {
				showAlert(null, invalidCodeEnteredText);
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
		}

		function getAddressByPhoneCallback(err, addr) {
			if (err) return showAlert(err, err.message);
			if (addr != "0x0000000000000000000000000000000000000000" && addr != "0x") {
				POPInputWallet.val(addr);
				changeStepNumber(null, 3);
			} else showAlert(null, phoneIsNotSetText, "warning");
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
		}

		function getPhoneByAddressCallback(err, phone) {
			if (err) return showAlert(err, err.message);
			console.log(phone);
			if (phone != 0) {
				POPInputPhone.val(phone);
				changeStepNumber(null, 3);
			} else showAlert(null, walletIsNotSetText, "warning");
			middleMainContainerInner.fadeIn(500);
			loader.addClass('hide');
		}

		function buildCopyWalletControl(id) {
			var copyWallet = document.getElementById(id);
			var clientCopyWallet = new Clipboard(copyWallet);
			clientCopyWallet.on( "success", function( readyEvent ) {
				Materialize.toast(addressCopiedToBufferText, 3000, 'rounded');
		  	});
		}

		function buildCopyURLControl(id) {
			var POPShare = document.getElementById(id);
			var clientShare = new Clipboard( POPShare );
		  	
		  	clientShare.on( "success", function( event ) {
		      Materialize.toast(URLCopiedToBufferText, 3000, 'rounded');
		    });
		}
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});