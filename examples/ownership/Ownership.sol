pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * Ownership(owner,tx)
 */
contract Ownership {
    bytes public OwnershipT = bytes("OwnershipT");

    UniversalAdjudicationContract adjudicationContract;
    Utils utils;
    address IsLessThan = address(0x0000000000000000000000000000000000000000);
    address Equal = address(0x0000000000000000000000000000000000000000);
    address IsValidSignature = address(0x0000000000000000000000000000000000000000);
    address IsContained = address(0x0000000000000000000000000000000000000000);
    address VerifyInclusion = address(0x0000000000000000000000000000000000000000);
    address IsSameAmount = address(0x0000000000000000000000000000000000000000);
    address notAddress = address(0x0000000000000000000000000000000000000000);
    address andAddress = address(0x0000000000000000000000000000000000000000);
    address forAllSuchThatAddress = address(0x0000000000000000000000000000000000000000);
    address public payoutContractAddress;
    bool isInitialized = false;
    bytes secp256k1;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        address _notAddress,
        address _andAddress,
        address _forAllSuchThatAddress,
        bytes memory _secp256k1
    ) public {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        notAddress = _notAddress;
        andAddress = _andAddress;
        forAllSuchThatAddress = _forAllSuchThatAddress;
        secp256k1 = _secp256k1;
    }

    function setPredicateAddresses(
        address _isLessThan,
        address _equal,
        address _isValidSignature,
        address _isContained,
        address _verifyInclusion,
        address _isSameAmount,
        address _payoutContractAddress
    ) public {
        require(!isInitialized, "isInitialized must be false");
        IsLessThan = _isLessThan;
        Equal = _equal;
        IsValidSignature = _isValidSignature;
        IsContained = _isContained;
        VerifyInclusion = _verifyInclusion;
        IsSameAmount = _isSameAmount;
        payoutContractAddress = _payoutContractAddress;
        isInitialized = true;
    }
    
    /**
     * @dev Validates a child node of the property in game tree.
     */
    function isValidChallenge(
        bytes[] memory _inputs,
        bytes[] memory _challengeInput,
        types.Property memory _challenge
    ) public returns (bool) {
        require(
            keccak256(abi.encode(getChild(_inputs, _challengeInput))) == keccak256(abi.encode(_challenge)),
            "_challenge must be valud child of game tree"
        );
        return true;
    }
    
    function getChild(
        bytes[] memory inputs,
        bytes[] memory challengeInput
    ) private returns (types.Property memory) {
        if(!utils.isLabel(inputs[0]) || inputs[0].length >= 20) {
            return getChildOwnershipT(inputs, challengeInput);
        }
        bytes32 input0 = keccak256(utils.getInputValue(inputs[0]));
        if(input0 == keccak256(OwnershipT)) {
            return getChildOwnershipT(utils.subArray(inputs, 1, inputs.length), challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes[] memory _witness) public view returns(bool) {
        if(!utils.isLabel(_inputs[0]) || _inputs[0].length >= 20) {
            return decideOwnershipT(_inputs, _witness);
        }
        bytes32 input0 = keccak256(utils.getInputValue(_inputs[0]));
        if(input0 == keccak256(OwnershipT)) {
            return decideOwnershipT(utils.subArray(_inputs, 1, _inputs.length), _witness);
        }
    }

    function decideTrue(bytes[] memory _inputs, bytes[] memory _witness) public {
        require(decide(_inputs, _witness), "must be true");
        types.Property memory property = types.Property({
            predicateAddress: address(this),
            inputs: _inputs
        });
        adjudicationContract.setPredicateDecision(utils.getPropertyId(property), true);
    }

    /**
     * Gets child of OwnershipT(OwnershipT,owner,tx).
     */
    function getChildOwnershipT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputsOf = new bytes[](4);
        childInputsOf[0] = _inputs[2];
        childInputsOf[1] = bytes("Vsig");
        childInputsOf[2] = _inputs[1];
        childInputsOf[3] = utils.prefixConstant(secp256k1);

        notInputs[0] = abi.encode(types.Property({
            predicateAddress: IsValidSignature,
            inputs: childInputsOf
        }));

        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("sig");
        forAllSuchThatInputs[2] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        }));
        return types.Property({
            predicateAddress: forAllSuchThatAddress,
            inputs: forAllSuchThatInputs
        });
    }
    /**
     * Decides OwnershipT(OwnershipT,owner,tx).
     */
    function decideOwnershipT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat

        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = _inputs[2];
        childInputs[1] = _witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = utils.prefixConstant(secp256k1);
        require(
            AtomicPredicate(IsValidSignature).decide(childInputs),
            "IsValidSignature must be true"
        );

        return true;
    }

}

