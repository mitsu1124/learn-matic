pragma solidity ^0.5.11;

contract IStateSender {
    function syncState(address receiver, bytes calldata data) external;
    function register(address sender, address receiver) public;
}

contract Sender {
    address public stateSenderContract = 0xEAa852323826C71cd7920C3b4c007184234c3945;
    address public receiver = 0xc75740b826776a32498cB1ECf8122494F28c9C85;

    uint public states = 0;

    function sendState(bytes calldata data) external {
        states = states + 1;
        IStateSender(stateSenderContract).syncState(receiver, data);
    }
}