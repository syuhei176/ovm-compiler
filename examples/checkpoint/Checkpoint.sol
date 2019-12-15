pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "../Utils.sol";
import "./AtomicPredicate.sol";
import "./CompiledPredicate.sol";


/**
 * Checkpoint(B,C)
 */
contract Checkpoint {
    bytes public CheckpointFFO2A = bytes("CheckpointFFO2A");
    bytes public CheckpointFFO = bytes("CheckpointFFO");
    bytes public CheckpointFF = bytes("CheckpointFF");
    bytes public CheckpointF = bytes("CheckpointF");

    UniversalAdjudicationContract adjudicationContract;
    Utils utils;
    address LessThan = address(0x0000000000000000000000000000000000000000);
    address Equal = address(0x0000000000000000000000000000000000000000);
    address IsValidSignature = address(0x0000000000000000000000000000000000000000);
    address Bytes = address(0x0000000000000000000000000000000000000000);
    address SU = address(0x0000000000000000000000000000000000000000);
    address IsContainedPredicate = address(0x0000000000000000000000000000000000000000);
    address VerifyInclusionPredicate = address(0x0000000000000000000000000000000000000000);
    address IsValidStateTransitionPredicate = address(0x0000000000000000000000000000000000000000);
    address notAddress = address(0x0000000000000000000000000000000000000000);
    address andAddress = address(0x0000000000000000000000000000000000000000);
    address forAllSuchThatAddress = address(0x0000000000000000000000000000000000000000);

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress
    ) {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
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
        if(input0 == CheckpointFFO2A) {
            return getChildCheckpointFFO2A(inputs, challengeInput);
        }
        if(input0 == CheckpointFFO) {
            return getChildCheckpointFFO(inputs, challengeInput);
        }
        if(input0 == CheckpointFF) {
            return getChildCheckpointFF(inputs, challengeInput);
        }
        if(input0 == CheckpointF) {
            return getChildCheckpointF(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == CheckpointFFO2A) {
            decideCheckpointFFO2A(_inputs, _witness);
        }
        if(input0 == CheckpointFFO) {
            decideCheckpointFFO(_inputs, _witness);
        }
        if(input0 == CheckpointFF) {
            decideCheckpointFF(_inputs, _witness);
        }
        if(input0 == CheckpointF) {
            decideCheckpointF(_inputs, _witness);
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
     * Gets child of CheckpointFFO2A().
     */
    function getChildCheckpointFFO2A(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            types.Property memory inputPredicateProperty = abi.decode(_inputs[1], (types.Property));
            bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
            for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
                childInputs[i] = inputPredicateProperty.inputs[i];
            }
            childInputs[stateObject.inputs.length] = _inputs[2];
            notInputs[0] = abi.encode(types.Property({
                predicateAddress: inputPredicateProperty.predicateAddress,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            types.Property memory inputPredicateProperty = abi.decode(_inputs[3], (types.Property));
            bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
            for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
                childInputs[i] = inputPredicateProperty.inputs[i];
            }
            childInputs[stateObject.inputs.length] = _inputs[2];
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
     * Gets child of CheckpointFFO().
     */
    function getChildCheckpointFFO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        notInputs0[0] = _inputs[1];
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = CheckpointFFO2A;
        childInputs[1] = _inputs[2];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[3];
        childInputs[4] = _inputs[4];
        notInputs1[0] = abi.encode(type.Property({
            predicateAddress: CheckpointFFO2A,
            inputs: childInputs
        }));
        andInputs[1] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs1
        }));
        return type.Property({
            predicateAddress: andAddress,
            inputs: andInputs
        });
    }
    /**
     * Gets child of CheckpointFF().
     */
    function getChildCheckpointFF(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory quantifierInputs = new bytes[](3);
        quantifierInputs[0] = _inputs[1];
        quantifierInputs[1] = _inputs[2];
        quantifierInputs[2] = challengeInputs[0];
        require(AtomicPredicate(SU).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](5);
        childInputs[0] = CheckpointFFO;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[3];
        childInputs[3] = _inputs[4];
        childInputs[4] = _inputs[5];
        return getChildCheckpointFFO(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
    }
    /**
     * Gets child of CheckpointF().
     */
    function getChildCheckpointF(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory quantifierInputs = new bytes[](2);
        quantifierInputs[0] = _inputs[1];
        quantifierInputs[1] = challengeInputs[0];
        require(AtomicPredicate(LessThan).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](6);
        childInputs[0] = CheckpointFF;
        childInputs[1] = _inputs[1];
        childInputs[2] = _inputs[2];
        childInputs[3] = _inputs[3];
        childInputs[4] = _inputs[4];
        childInputs[5] = _inputs[5];
        return getChildCheckpointFF(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
    }
    /**
     * Decides CheckpointFFO2A(CheckpointFFO2A,verifyInclusion,su,eq,ZeroHash).
     */
    function decideCheckpointFFO2A(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective

        types.Property memory inputPredicateProperty = abi.decode(_inputs[1], (types.Property));
        bytes[] memory childInputs0 = new bytes[](inputPredicateProperty.inputs.length + 1);
        for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
            childInputs0[i] = inputPredicateProperty.inputs[i];
        }
        childInputs0[stateObject.inputs.length] = _inputs[2];
        require(CompiledPredicate(inputPredicateProperty.predicateAddress).decide(childInputs0, Utils.subArray(_witness, 1, _witness.length)));


        types.Property memory inputPredicateProperty = abi.decode(_inputs[3], (types.Property));
        bytes[] memory childInputs1 = new bytes[](inputPredicateProperty.inputs.length + 1);
        for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
            childInputs1[i] = inputPredicateProperty.inputs[i];
        }
        childInputs1[stateObject.inputs.length] = _inputs[2];
        require(CompiledPredicate(inputPredicateProperty.predicateAddress).decide(childInputs1, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides CheckpointFFO(CheckpointFFO,su,verifyInclusion,eq,ZeroHash).
     */
    function decideCheckpointFFO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        var result = false;
        bytes[] memory childInputs0 = new bytes[](0);

        result = result | [object Object].decide(childInputs);

        bytes[] memory childInputs1 = new bytes[](5);
        childInputs1[0] = CheckpointFFO2A;
        childInputs1[1] = _inputs[2];
        childInputs1[2] = _inputs[1];
        childInputs1[3] = _inputs[3];
        childInputs1[4] = _inputs[4];
        result = result | decideCheckpointFFO2A(childInputs, Utils.subArray(_witness, 1, _witness.length));

        require(result);
        return true;
    }
    /**
     * Decides CheckpointFF(CheckpointFF,B,C,verifyInclusion,eq,ZeroHash).
     */
    function decideCheckpointFF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        return false;
    }
    /**
     * Decides CheckpointF(CheckpointF,B,C,verifyInclusion,eq,ZeroHash).
     */
    function decideCheckpointF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        return false;
    }

}

