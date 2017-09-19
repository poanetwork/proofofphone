const contractAddress = "0x6d57f4a5509f80966ea0abefa71a67526e7bf549"; // Oracles network ProofOfPhone contract address
const bottomMainText = `There is a smart contract deployed to the Oracles network. You can find it here:
<table cellspacing="0" cellpadding="0" class="copyTable nomargin" style="display: table;">
	<tbody class="copyTableBody">
		<tr>
			<td class="copyTableCellWalletValue2">` + contractAddress + `</td>
			<td id="copyWallet3" data-clipboard-text="`+ contractAddress + `" class="copyTableCellCopyButton"></td>
		</tr>
	</tbody>
</table>
This contract has the following public method signature: hasPhone (address _addr).<br/>
If the _addr is registered in the contract\'s Phone Registry, the hasPhone method returns true. Otherwise it returns false.`
const bottomCheckPageText = 'Enter a phone number or an Ethereum address to continue. <br/>' + bottomMainText;
const githubURL = "https://github.com/blocknotary/proofofphone";
const chooseAccountAlertText = "You haven't chosen any account in Oracles plugin. Please, choose your account in Oracles plugin and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
const addressCopiedToBufferText = "Address copied to buffer";
const URLCopiedToBufferText = "url copied to buffer";
const codeSuccessfullySentBySMSText = "Code was successfully sent by SMS";
const invalidCodeEnteredText = "Invalid code entered";
const walletIsNotSetText = "Phone wasn't set for this wallet yet";
const phoneIsNotSetText = "This phone wasn't set for any wallet yet";
const defaultStepTitleText = "Submit your phone number";
const secondStepTitleText = "Submit received code";
const secondStepTitleDescription = "Copy the code from the SMS to continue";
const thirdStepTitleText = "Success";
