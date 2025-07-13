// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title TrustChainWallet
 * @dev Social recovery smart wallet with guardian-based multisig recovery.
 */
contract TrustChainWallet is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private guardians;
    uint256 public recoveryThreshold;
    mapping(address => bool) public recoveryApprovals;
    uint256 public approvalsCount;
    address public pendingOwner;

    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);
    event RecoveryInitiated(address indexed newOwner);
    event RecoveryApproved(address indexed guardian);
    event RecoveryCompleted(address indexed newOwner);

    constructor(address[] memory _guardians, uint256 _threshold, address initialOwner) Ownable(initialOwner) {
        require(_guardians.length >= _threshold, "Threshold too high");
        for (uint256 i = 0; i < _guardians.length; i++) {
            guardians.add(_guardians[i]);
            emit GuardianAdded(_guardians[i]);
        }
        recoveryThreshold = _threshold;
    }

    function addGuardian(address guardian) external onlyOwner {
        require(guardians.add(guardian), "Already a guardian");
        emit GuardianAdded(guardian);
    }

    function removeGuardian(address guardian) external onlyOwner {
        require(guardians.remove(guardian), "Not a guardian");
        emit GuardianRemoved(guardian);
    }

    function initiateRecovery(address newOwner) external {
        require(guardians.contains(msg.sender), "Not a guardian");
        pendingOwner = newOwner;
        approvalsCount = 0;
        for (uint256 i = 0; i < guardians.length(); i++) {
            recoveryApprovals[guardians.at(i)] = false;
        }
        emit RecoveryInitiated(newOwner);
    }

    function approveRecovery() external {
        require(guardians.contains(msg.sender), "Not a guardian");
        require(pendingOwner != address(0), "No recovery in progress");
        require(!recoveryApprovals[msg.sender], "Already approved");
        recoveryApprovals[msg.sender] = true;
        approvalsCount++;
        emit RecoveryApproved(msg.sender);
        if (approvalsCount >= recoveryThreshold) {
            _completeRecovery();
        }
    }

    function _completeRecovery() internal {
        _transferOwnership(pendingOwner);
        emit RecoveryCompleted(pendingOwner);
        pendingOwner = address(0);
    }

    function isGuardian(address guardian) external view returns (bool) {
        return guardians.contains(guardian);
    }

    function getGuardians() external view returns (address[] memory) {
        address[] memory result = new address[](guardians.length());
        for (uint256 i = 0; i < guardians.length(); i++) {
            result[i] = guardians.at(i);
        }
        return result;
    }

    // Allow contract to receive ETH/BDAG
    receive() external payable {}
    fallback() external payable {}
}
