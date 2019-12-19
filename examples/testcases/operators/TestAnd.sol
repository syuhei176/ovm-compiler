pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * AndTest(a,b)
 */
contract AndTest {
    bytes public AndTestA = bytes("AndTestA");

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

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        address _notAddress,
        address _andAddress,
        address _forAllSuchThatAddress
    ) public {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        notAddress = _notAddress;
        forAllSuchThatAddress = _forAllSuchThatAddress;
    }

    function setPredicateAddresses(
        address _isLessThan,
        address _equal,
        address _isValidSignature,
        address _isContained,
        address _verifyInclusion,
        address _isSameAmount
    ) public {
        IsLessThan = _isLessThan;
        Equal = _equal;
        IsValidSignature = _isValidSignature;
        IsContained = _isContained;
        VerifyInclusion = _verifyInclusion;
        IsSameAmount = _isSameAmount;
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
        bytes32 input0 = keccak256(inputs[0]);
        if(input0 == keccak256(AndTestA)) {
            return getChildAndTestA(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes[] memory _witness) public view returns(bool) {
        bytes32 input0 = keccak256(_inputs[0]);
        if(input0 == keccak256(AndTestA)) {
            return decideAndTestA(_inputs, _witness);
        }
        return false;
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
     * Gets child of AndTestA(AndTestA,a,b).
     */
    function getChildAndTestA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputsOf0 = new bytes[](1);
            childInputsOf0[0] = _inputs[1];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Foo,
                inputs: childInputsOf0
            }));

        }
        if(challengeInput == 1) {
            bytes[] memory childInputsOf1 = new bytes[](1);
            childInputsOf1[0] = _inputs[2];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Bar,
                inputs: childInputsOf1
            }));

        }
        return types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Decides AndTestA(AndTestA,a,b).
     */
    function decideAndTestA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](1);
        childInputs0[0] = _inputs[1];
        require(AtomicPredicate(Foo).decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](1);
        childInputs1[0] = _inputs[2];
        require(AtomicPredicate(Bar).decide(childInputs1));

        return true;
    }

}

