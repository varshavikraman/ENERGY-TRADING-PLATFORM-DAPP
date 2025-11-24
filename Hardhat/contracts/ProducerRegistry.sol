// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract ProducerRegistry {
    address public admin;

    enum Status { None, Pending, Approved, Rejected }

    struct Producer {
        string name;
        string location;
        uint256 capacity;
        string aadhaarHash;
        Status status;
    }

    mapping(address => Producer) public producers;
    mapping(address => bool) public hasRequested;
    address[] public pendingProducers;

    event ProducerRequested(address producer);
    event ProducerApproved(address producer);
    event ProducerRejected(address producer);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Unauthorised Access");
        _;
    }

    modifier onlyValidStatus(address producer, Status required) {
        require(producers[producer].status == required, "Invalid status");
        _;
    }

    // Producer Request approval
    function requestProducerApproval(
        string memory _name,
        string memory _location,
        uint256 _capacity,
        string memory _aadhaarHash
    ) external {

        Producer storage prod = producers[msg.sender];
        require(
            prod.status == Status.None || prod.status == Status.Rejected,
            "Cannot request again"
        );

        require(_capacity > 0, "Capacity must be greater than zero");

        require(bytes(_aadhaarHash).length > 0, "Docs hash required");

        prod.name = _name;
        prod.location = _location;
        prod.capacity = _capacity;
        prod.aadhaarHash = _aadhaarHash;
        prod.status = Status.Pending;

        pendingProducers.push(msg.sender);
        hasRequested[msg.sender] = true;

        emit ProducerRequested(msg.sender);

    }

    // Admin approve Producer
    function approveProducer(address producer) external onlyAdmin onlyValidStatus(producer, Status.Pending) {
        producers[producer].status = Status.Approved;

        _removePending(producer);
        emit ProducerApproved(producer);
    }

    // Admin reject Producer
    function rejectProducer(address producer) external onlyAdmin onlyValidStatus(producer, Status.Pending) {
        producers[producer].status = Status.Rejected;

        _removePending(producer);
        emit ProducerRejected(producer);
    }

    //Function to remove rejected and approved producer from pending
    function _removePending(address producer) internal {
        if (!hasRequested[producer]) return;

        hasRequested[producer] = false;

        uint256 len = pendingProducers.length;
        for (uint256 i = 0; i < len; i++) {
            if (pendingProducers[i] == producer) {
                pendingProducers[i] = pendingProducers[len - 1];
                pendingProducers.pop();
                break;
            }
        }
    }

    // Checking if producer is approved
    function isApprovedProducer(address producer) external view returns (bool) {
        return producers[producer].status == Status.Approved;
    }

    // Getting all Pending Producers
    function getPendingProducers() external view returns (address[] memory) {
        return pendingProducers;
    }

    // Getting full Producer Details
    function getProducerDetails(address producer) external view returns (
        string memory,
        string memory,
        uint256,
        string memory,
        Status
    ) {
        Producer memory prod = producers[producer];
        return (prod.name, prod.location, prod.capacity, prod.aadhaarHash, prod.status);
    }

}
