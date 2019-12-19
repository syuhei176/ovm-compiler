pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * StateUpdate(token,range,block_number,so)
 */
contract StateUpdate {
    bytes public StateUpdateTA = bytes("StateUpdateTA");
    bytes public StateUpdateT = bytes("StateUpdateT");

    UniversalAdjudicationContract adjudicationContract;
    Utils utils;
    address IsLessThan = address(0x0000000000000000000000000000000000000000);
    address Equal = address(0x0000000000000000000000000000000000000000);
    address IsValidSignature = address(0x0000000000000000000000000000000000000000);
    address IncludedWithin = address(0x0000000000000000000000000000000000000000);
    address IsContained = address(0x0000000000000000000000000000000000000000);
    address VerifyInclusion = address(0x0000000000000000000000000000000000000000);
    address IsValidStateTransition = address(0x0000000000000000000000000000000000000000);
    address IsSameAmount = address(0x0000000000000000000000000000000000000000);
    address notAddress = address(0x0000000000000000000000000000000000000000);
    address andAddress = address(0x0000000000000000000000000000000000000000);
    address forAllSuchThatAddress = address(0x0000000000000000000000000000000000000000);
    bytes TransactionAddress;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        bytes _TransactionAddress
    ) {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        TransactionAddress = _TransactionAddress;
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
        bytes32 input0 = bytesToBytes32(inputs[0]);
        if(input0 == StateUpdateTA) {
            return getChildStateUpdateTA(inputs, challengeInput);
        }
        if(input0 == StateUpdateT) {
            return getChildStateUpdateT(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == StateUpdateTA) {
            decideStateUpdateTA(_inputs, _witness);
        }
        if(input0 == StateUpdateT) {
            decideStateUpdateT(_inputs, _witness);
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
     * Gets child of StateUpdateTA().
     */
    function getChildStateUpdateTA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = abi.encodePacked(inputProperty1.predicateAddress);
            childInputs[1] = TransactionAddress;
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[0];
            childInputs[1] = _inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[1];
            childInputs[1] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsContained,
                inputs: childInputs
            }));
        }
        if(challengeInput == 3) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[2];
            childInputs[1] = _inputs[4];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 4) {
            types.Property memory inputPredicateProperty = abi.decode(_inputs[5], (types.Property));
            bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
            for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
                childInputs[i] = inputPredicateProperty.inputs[i];
            }
            childInputs[stateObject.inputs.length] = _inputs[1];
            notInputs[0] = abi.encode(types.Property({
                predicateAddress: inputPredicateProperty.predicateAddress,
                inputs: childInputs
            }));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of StateUpdateT().
     */
    function getChildStateUpdateT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = StateUpdateTA;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        childInputs[4] = _inputs[3];
        childInputs[5] = _inputs[4];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: StateUpdateTA,
            inputs: childInputs
        }));
        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("tx");
        forAllSuchThatInputs[2] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        }));
        return type.Property({
            predicateAddress: forAllSuchThatAddress,
            inputs: forAllSuchThatInputs
        });
    }
    /**
     * Decides StateUpdateTA(StateUpdateTA,tx,token,range,block_number,so).
     */
    function decideStateUpdateTA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = abi.encodePacked(inputProperty1.predicateAddress);
        childInputs0[1] = TransactionAddress;
        require(Equal.decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[0];
        childInputs1[1] = _inputs[2];
        require(Equal.decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](2);
        childInputs2[0] = inputProperty1.inputs[1];
        childInputs2[1] = _inputs[3];
        require(IsContained.decide(childInputs2));


        bytes[] memory childInputs3 = new bytes[](2);
        childInputs3[0] = inputProperty1.inputs[2];
        childInputs3[1] = _inputs[4];
        require(Equal.decide(childInputs3));


        types.Property memory inputPredicateProperty = abi.decode(_inputs[5], (types.Property));
        bytes[] memory childInputs4 = new bytes[](inputPredicateProperty.inputs.length + 1);
        for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
            childInputs4[i] = inputPredicateProperty.inputs[i];
        }
        childInputs4[stateObject.inputs.length] = _inputs[1];
        require(CompiledPredicate(inputPredicateProperty.predicateAddress).decide(childInputs4, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides StateUpdateT(StateUpdateT,token,range,block_number,so).
     */
    function decideStateUpdateT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](6);
        childInputs[0] = StateUpdateTA;
        childInputs[1] = witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        childInputs[4] = _inputs[3];
        childInputs[5] = _inputs[4];
        require(decideStateUpdateTA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }

}

