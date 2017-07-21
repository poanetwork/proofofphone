pragma solidity ^0.4.13;

contract ProofOfPhone {
        struct PhoneAddr {
            uint phone;
            address addr;
        }
        mapping(address => uint) public addressPhonePair;
        mapping(uint => address) public phoneAddressPair;
        mapping(bytes32 => PhoneAddr) private tokens;
        
        function newToken(uint phone, bytes32 token) {
            tokens[token] = PhoneAddr({phone: phone, addr: msg.sender});
        }
        
        function activatePair(string code) {
            require(tokens[sha3(code)].addr == msg.sender);
            phoneAddressPair[tokens[sha3(code)].phone] = tokens[sha3(code)].addr;
            addressPhonePair[tokens[sha3(code)].addr] = tokens[sha3(code)].phone;
        }

        function getPhoneByAddress(address addr) constant returns(uint) {
            return addressPhonePair[addr];
        }
        
        function getAddressByPhone(uint phone) constant returns(address) {
            return phoneAddressPair[phone];
        }
        
        function hasPhone(address addr) constant returns(bool) {
            if (addressPhonePair[addr] != 0) {
                return true;
            } else {
                return false;
            }
        }
}