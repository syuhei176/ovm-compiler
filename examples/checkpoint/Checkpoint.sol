pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "../Utils.sol";
import "./AtomicPredicate.sol";
import "./CompiledPredicate.sol";


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
        if(input0 == CheckpointFO1N) {
            return getChildCheckpointFO1N(inputs, challengeInput);
        }
        if(input0 == CheckpointFO2FO1N) {
            return getChildCheckpointFO2FO1N(inputs, challengeInput);
        }
        if(input0 == CheckpointFO2FO) {
            return getChildCheckpointFO2FO(inputs, challengeInput);
        }
        if(input0 == CheckpointFO2F) {
            return getChildCheckpointFO2F(inputs, challengeInput);
        }
        if(input0 == CheckpointFO) {
            return getChildCheckpointFO(inputs, challengeInput);
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
        if(input0 == CheckpointFO1N) {
            decideCheckpointFO1N(_inputs, _witness);
        }
        if(input0 == CheckpointFO2FO1N) {
            decideCheckpointFO2FO1N(_inputs, _witness);
        }
        if(input0 == CheckpointFO2FO) {
            decideCheckpointFO2FO(_inputs, _witness);
        }
        if(input0 == CheckpointFO2F) {
            decideCheckpointFO2F(_inputs, _witness);
        }
        if(input0 == CheckpointFO) {
            decideCheckpointFO(_inputs, _witness);
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
     * Gets child of CheckpointFO1N().
     */
    function getChildCheckpointFO1N(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        bytes memory property;
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = _inputs[1];
        childInputs[1] = inputProperty2.inputs[2];
        property = abi.encode(type.Property({
            predicateAddress: LessThan,
            inputs: childInputs
        }));
        return property;
    }
    /**
     * Gets child of CheckpointFO2FO1N().
     */
    function getChildCheckpointFO2FO1N(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        bytes memory property;
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = _inputs[1];
        childInputs[1] = inputProperty2.inputs[0];
        childInputs[2] = inputProperty2.inputs[1];
        childInputs[3] = _inputs[3];
        property = abi.encode(type.Property({
            predicateAddress: IncludedWithin,
            inputs: childInputs
        }));
        return property;
    }
    /**
     * Gets child of CheckpointFO2FO().
     */
    function getChildCheckpointFO2FO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = CheckpointFO2FO1N;
        childInputs[1] = _inputs[1];
        childInputs[2] = _inputs[2];
        childInputs[3] = _inputs[3];
        notInputs0[0] = abi.encode(type.Property({
            predicateAddress: CheckpointFO2FO1N,
            inputs: childInputs
        }));
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        notInputs1[0] = _inputs[1];
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
     * Gets child of CheckpointFO2F().
     */
    function getChildCheckpointFO2F(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = CheckpointFO2FO;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        return getChildCheckpointFO2FO(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
    }
    /**
     * Gets child of CheckpointFO().
     */
    function getChildCheckpointFO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = CheckpointFO1N;
        childInputs[1] = _inputs[1];
        childInputs[2] = _inputs[2];
        notInputs0[0] = abi.encode(type.Property({
            predicateAddress: CheckpointFO1N,
            inputs: childInputs
        }));
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = CheckpointFO2F;
        childInputs[1] = _inputs[2];
        childInputs[2] = _inputs[1];
        notInputs1[0] = abi.encode(type.Property({
            predicateAddress: CheckpointFO2F,
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
     * Gets child of CheckpointF().
     */
    function getChildCheckpointF(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory childInputs = new bytes[](3);
        childInputs[0] = CheckpointFO;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        return getChildCheckpointFO(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
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
        var result = false;
        bytes[] memory childInputs0 = new bytes[](4);
        childInputs0[0] = CheckpointFO2FO1N;
        childInputs0[1] = _inputs[1];
        childInputs0[2] = _inputs[2];
        childInputs0[3] = _inputs[3];
        result = result | decideCheckpointFO2FO1N(childInputs, Utils.subArray(_witness, 1, _witness.length));

        bytes[] memory childInputs1 = new bytes[](0);

        result = result | [object Object].decide(childInputs);

        require(result);
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
        var result = false;
        bytes[] memory childInputs0 = new bytes[](3);
        childInputs0[0] = CheckpointFO1N;
        childInputs0[1] = _inputs[1];
        childInputs0[2] = _inputs[2];
        result = result | decideCheckpointFO1N(childInputs, Utils.subArray(_witness, 1, _witness.length));

        bytes[] memory childInputs1 = new bytes[](3);
        childInputs1[0] = CheckpointFO2F;
        childInputs1[1] = _inputs[2];
        childInputs1[2] = _inputs[1];
        result = result | decideCheckpointFO2F(childInputs, Utils.subArray(_witness, 1, _witness.length));

        require(result);
        return true;
    }
    /**
     * Decides CheckpointF(CheckpointF,su).
     */
    function decideCheckpointF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        return false;
    }

}

