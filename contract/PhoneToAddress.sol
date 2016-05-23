contract PhoneToAddress {
        address owner;
        bytes dataEmpty;
        struct PhonePayment {
            uint phone;
            uint payment;
            bytes data;
        }
        mapping(address => PhonePayment) addresses;
        mapping(uint => address) public phones;
        function PhoneToAddress() {
            owner = msg.sender;
        }
        function newPhoneToAddr(address addr, uint phone) {
                if (msg.sender != owner) return;
                addresses[addr] = PhonePayment({phone: phone, payment: 0, data: dataEmpty});
                phones[phone] = addr;
        }
        function () {
            addresses[msg.sender] = PhonePayment({phone: 0, payment: msg.value/100000000000000000, data: msg.data});
        }
        function sendEtherToOwner() { 
            if (msg.sender != owner) return;                 
            owner.send(this.balance);
        }
        function getPhoneByAddress(address addr) constant returns(uint) {
            return addresses[addr].phone;
        }
        function getPaymentByAddress(address addr) constant returns(uint) {
            return addresses[addr].payment;
        }
        function getPaymentDataByAddress(address addr) constant returns(bytes) {
            return addresses[addr].data;
        }
        function hasPhone(address addr) constant returns(bool) {
            if (addresses[addr].phone != 0) {
                return true;
            } else {
                return false;
            }
        }
        function kill() {
            if (msg.sender != owner) return;
            selfdestruct(owner);   
        }
}