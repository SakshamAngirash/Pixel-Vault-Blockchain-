pragma solidity ^0.8.7;

//SPDX-License-Identifier:MIT
contract Upload {
    struct Access {
        address user; //address of user
        bool access; //allowed or denied
    }
    mapping(address => string[]) value; // list of images (url)
    mapping(address => Access[]) accessList; // list of addresses and there access status
    mapping(address => mapping(address => bool)) ownership; //creates and 2d array of access status
    //ownership[add1][add2]=true/false
    mapping(address => mapping(address => bool)) previousData;

    //take record of previous state since we keeping all info on blockchain

    function add(address _user, string memory img) public {
        value[_user].push(img);
    }

    function allow(address user) public {
        ownership[msg.sender][user] = true; // given the ownership
        if (previousData[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true)); //push it to acceslist
            previousData[msg.sender][user] = true; //will give access to previous data
        }
    }

    function disallow(address user) public {
        ownership[msg.sender][user] = false;
        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false; //false all data
            }
        }
    }

    function share() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }

    function display(address _user) external view returns (string[] memory) {
        require(
            _user == msg.sender || ownership[_user][msg.sender],
            "Cannot access this file"
        );
        return value[_user];
    }
}
//0x5FbDB2315678afecb367f032d93F642f64180aa3
