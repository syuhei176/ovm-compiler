pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "../Utils.sol";
import "./AtomicPredicate.sol";
import "./CompiledPredicate.sol";


/**
 * Ownership(owner)
 */
contract Ownership {
    bytes public OwnershipTA2T = bytes("OwnershipTA2T");
    bytes public OwnershipTA = bytes("OwnershipTA");
    bytes public OwnershipT = bytes("OwnershipT");

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

    constructor(address _adjudicationContractAddress, address _utilsAddress) {
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
        if(input0 == OwnershipTA2T) {
            return getChildOwnershipTA2T(inputs, challengeInput);
        }
        if(input0 == OwnershipTA) {
            return getChildOwnershipTA(inputs, challengeInput);
        }
        if(input0 == OwnershipT) {
            return getChildOwnershipT(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == OwnershipTA2T) {
            decideOwnershipTA2T(_inputs, _witness);
        }
        if(input0 == OwnershipTA) {
            decideOwnershipTA(_inputs, _witness);
        }
        if(input0 == OwnershipT) {
            decideOwnershipT(_inputs, _witness);
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
     * Gets child of OwnershipTA2T().
     */
    function getChildOwnershipTA2T(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = _inputs[1];
        childInputs[1] = _inputs[2];
        childInputs[2] = challengeInputs[0];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: IsValidSignature,
            inputs: childInputs
        }));
        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("signature");
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
     * Gets child of OwnershipTA().
     */
    function getChildOwnershipTA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            childInputs[1] = _inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: StateUpdate,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](3);
            childInputs[0] = OwnershipTA2T;
            childInputs[1] = _inputs[1];
            childInputs[2] = _inputs[3];
            return getChildOwnershipTA2T(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OwnershipT().
     */
    function getChildOwnershipT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = OwnershipTA;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: OwnershipTA,
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
     * Decides OwnershipTA2T(OwnershipTA2T,tx,owner).
     */
    function decideOwnershipTA2T(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory quantifierInputs = new bytes[](1);
        quantifierInputs[0] = _witness[0];
        require(AtomicPredicate(Bytes).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](3);
        childInputs[0] = _inputs[1];
        childInputs[1] = _inputs[2];
        childInputs[2] = witness[0];

        bytes[] memory childInputs = new bytes[](3);
        childInputs[0] = _inputs[1];
        childInputs[1] = _inputs[2];
        childInputs[2] = witness[0];
        require(IsValidSignature.decide(childInputs));

        return true;
    }
    /**
     * Decides OwnershipTA(OwnershipTA,tx,su,owner).
     */
    function decideOwnershipTA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = _inputs[1];
        childInputs0[1] = _inputs[2];
        require(StateUpdate.decide(childInputs0));

        require(decideOwnershipTA2T(childInputs1, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides OwnershipT(OwnershipT,su,owner).
     */
    function decideOwnershipT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory quantifierInputs = new bytes[](1);
        quantifierInputs[0] = _witness[0];
        require(AtomicPredicate(Bytes).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = OwnershipTA;
        childInputs[1] = witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        require(decideOwnershipTA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }

}

