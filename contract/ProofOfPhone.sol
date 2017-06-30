pragma solidity ^0.4.11;

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
        
        function activatePair(bytes32 token) {
            if (tokens[token].addr != msg.sender) throw;
            phoneAddressPair[tokens[token].phone] = tokens[token].addr;
            addressPhonePair[tokens[token].addr] = tokens[token].phone;
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