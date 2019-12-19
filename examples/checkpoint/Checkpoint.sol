pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * Checkpoint(su)
 */
contract Checkpoint {
    bytes public CheckpointFO1N = bytes("CheckpointFO1N");
    bytes public CheckpointFO2FO1N = bytes("CheckpointFO2FO1N");
    bytes public CheckpointFO2FO = bytes("CheckpointFO2FO");
    bytes public CheckpointFO2F = bytes("CheckpointFO2F");
    bytes public CheckpointFO = bytes("CheckpointFO");
    bytes public CheckpointF = bytes("CheckpointF");

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
    address IncludedWithin;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        address _notAddress,
        address _andAddress,
        address _forAllSuchThatAddress,
        address  _IncludedWithin
    ) public {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        notAddress = _notAddress;
        andAddress = _andAddress;
        forAllSuchThatAddress = _forAllSuchThatAddress;
        IncludedWithin = _IncludedWithin;
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
        if(input0 == keccak256(CheckpointFO1N)) {
            return getChildCheckpointFO1N(inputs, challengeInput);
        }
        if(input0 == keccak256(CheckpointFO2FO1N)) {
            return getChildCheckpointFO2FO1N(inputs, challengeInput);
        }
        if(input0 == keccak256(CheckpointFO2FO)) {
            return getChildCheckpointFO2FO(inputs, challengeInput);
        }
        if(input0 == keccak256(CheckpointFO2F)) {
            return getChildCheckpointFO2F(inputs, challengeInput);
        }
        if(input0 == keccak256(CheckpointFO)) {
            return getChildCheckpointFO(inputs, challengeInput);
        }
        if(input0 == keccak256(CheckpointF)) {
            return getChildCheckpointF(inputs, challengeInput);
        }
        return getChildCheckpointFO1N(utils.subArray(inputs, 1, inputs.length), challengeInput);
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes[] memory _witness) public view returns(bool) {
        bytes32 input0 = keccak256(_inputs[0]);
        if(input0 == keccak256(CheckpointFO1N)) {
            return decideCheckpointFO1N(_inputs, _witness);
        }
        if(input0 == keccak256(CheckpointFO2FO1N)) {
            return decideCheckpointFO2FO1N(_inputs, _witness);
        }
        if(input0 == keccak256(CheckpointFO2FO)) {
            return decideCheckpointFO2FO(_inputs, _witness);
        }
        if(input0 == keccak256(CheckpointFO2F)) {
            return decideCheckpointFO2F(_inputs, _witness);
        }
        if(input0 == keccak256(CheckpointFO)) {
            return decideCheckpointFO(_inputs, _witness);
        }
        if(input0 == keccak256(CheckpointF)) {
            return decideCheckpointF(_inputs, _witness);
        }
        return decideCheckpointFO1N(utils.subArray(_inputs, 1, _inputs.length), _witness);
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
     * Gets child of CheckpointFO1N(CheckpointFO1N,b,su).
     */
    function getChildCheckpointFO1N(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        bytes memory property;
        bytes[] memory childInputsOf = new bytes[](2);
        childInputsOf[0] = _inputs[1];
        childInputsOf[1] = inputProperty2.inputs[2];

        property = abi.encode(types.Property({
            predicateAddress: IsLessThan,
            inputs: childInputsOf
        }));

        return abi.decode(property, (types.Property));
    }
    /**
     * Gets child of CheckpointFO2FO1N(CheckpointFO2FO1N,old_su,su,b).
     */
    function getChildCheckpointFO2FO1N(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        bytes memory property;
        bytes[] memory childInputsOf = new bytes[](4);
        childInputsOf[0] = _inputs[1];
        childInputsOf[1] = inputProperty2.inputs[0];
        childInputsOf[2] = inputProperty2.inputs[1];
        childInputsOf[3] = _inputs[3];

        property = abi.encode(types.Property({
            predicateAddress: IncludedWithin,
            inputs: childInputsOf
        }));

        return abi.decode(property, (types.Property));
    }
    /**
     * Gets child of CheckpointFO2FO(CheckpointFO2FO,old_su,su,b).
     */
    function getChildCheckpointFO2FO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputsOf0 = new bytes[](4);
        childInputsOf0[0] = CheckpointFO2FO1N;
        childInputsOf0[1] = _inputs[1];
        childInputsOf0[2] = _inputs[2];
        childInputsOf0[3] = _inputs[3];

        notInputs0[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf0
        }));

        andInputs[0] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        notInputs1[0] = _inputs[1];
        andInputs[1] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs1
        }));
        return types.Property({
            predicateAddress: andAddress,
            inputs: andInputs
        });
    }
    /**
     * Gets child of CheckpointFO2F(CheckpointFO2F,su,b).
     */
    function getChildCheckpointFO2F(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = CheckpointFO2FO;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        return getChildCheckpointFO2FO(childInputs, utils.subArray(challengeInputs, 1, challengeInputs.length));
    }
    /**
     * Gets child of CheckpointFO(CheckpointFO,b,su).
     */
    function getChildCheckpointFO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputsOf0 = new bytes[](3);
        childInputsOf0[0] = CheckpointFO1N;
        childInputsOf0[1] = _inputs[1];
        childInputsOf0[2] = _inputs[2];

        notInputs0[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf0
        }));

        andInputs[0] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputsOf1 = new bytes[](3);
        childInputsOf1[0] = CheckpointFO2F;
        childInputsOf1[1] = _inputs[2];
        childInputsOf1[2] = _inputs[1];

        notInputs1[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf1
        }));

        andInputs[1] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs1
        }));
        return types.Property({
            predicateAddress: andAddress,
            inputs: andInputs
        });
    }
    /**
     * Gets child of CheckpointF(CheckpointF,su).
     */
    function getChildCheckpointF(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory childInputs = new bytes[](3);
        childInputs[0] = CheckpointFO;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        return getChildCheckpointFO(childInputs, utils.subArray(challengeInputs, 1, challengeInputs.length));
    }
    /**
     * Decides CheckpointFO1N(CheckpointFO1N,b,su).
     */
    function decideCheckpointFO1N(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        return false;
    }
    /**
     * Decides CheckpointFO2FO1N(CheckpointFO2FO1N,old_su,su,b).
     */
    function decideCheckpointFO2FO1N(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        return false;
    }
    /**
     * Decides CheckpointFO2FO(CheckpointFO2FO,old_su,su,b).
     */
    function decideCheckpointFO2FO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        uint256 orIndex = abi.decode(_witness[0], (uint256));
        if(orIndex == 0) {
            bytes[] memory childInputs0 = new bytes[](4);
            childInputs0[0] = CheckpointFO2FO1N;
            childInputs0[1] = _inputs[1];
            childInputs0[2] = _inputs[2];
            childInputs0[3] = _inputs[3];
            require(decideCheckpointFO2FO1N(childInputs0,  utils.subArray(_witness, 1, _witness.length)));

        }
        if(orIndex == 1) {

            require(adjudicationContract.isDecidedById(keccak256(_inputs[1])));

        }
        return true;
    }
    /**
     * Decides CheckpointFO2F(CheckpointFO2F,su,b).
     */
    function decideCheckpointFO2F(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        return false;
    }
    /**
     * Decides CheckpointFO(CheckpointFO,b,su).
     */
    function decideCheckpointFO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        uint256 orIndex = abi.decode(_witness[0], (uint256));
        if(orIndex == 0) {
            bytes[] memory childInputs0 = new bytes[](3);
            childInputs0[0] = CheckpointFO1N;
            childInputs0[1] = _inputs[1];
            childInputs0[2] = _inputs[2];
            require(decideCheckpointFO1N(childInputs0,  utils.subArray(_witness, 1, _witness.length)));

        }
        if(orIndex == 1) {
            bytes[] memory childInputs1 = new bytes[](3);
            childInputs1[0] = CheckpointFO2F;
            childInputs1[1] = _inputs[2];
            childInputs1[2] = _inputs[1];
            require(decideCheckpointFO2F(childInputs1,  utils.subArray(_witness, 1, _witness.length)));

        }
        return true;
    }
    /**
     * Decides CheckpointF(CheckpointF,su).
     */
    function decideCheckpointF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        return false;
    }

}

