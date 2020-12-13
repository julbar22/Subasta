pragma solidity >=0.4.25 <0.7.0;

import "./Subasta.sol";

contract ManagerSubastas {
    struct Contrato {
        string name;
        uint256 auctionStart;
        uint256 auctionEnd;
        string description;
    }
    mapping(address => Contrato) newContracts;
    address[] public newContractsAccts;

    function createContract(
        uint256 _biddingTime,
        address payable _beneficiary,
        string memory nameContract,
        string memory description
    ) public returns (address) {
        address newContract = address(new Subasta(_biddingTime, _beneficiary));
        uint256 fechaActual = now;
        newContracts[newContract] = Contrato(
            nameContract,
            fechaActual,
            fechaActual + _biddingTime,
            description
        );
        newContractsAccts.push(newContract);
        return newContract;
    }

    function getContracts() public returns (address[] memory) {
        return newContractsAccts;
    }

    function getContractByAddress(address _address)
        public
        returns (
            string memory,
            uint256,
            uint256,
            string memory
        )
    {
        return (
            newContracts[_address].name,
            newContracts[_address].auctionStart,
            newContracts[_address].auctionEnd,
            newContracts[_address].description
        );
    }
}
