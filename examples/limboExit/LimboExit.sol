pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * LimboExit(prev_su,tx,su)
 */
contract LimboExit {
    bytes public LimboExitO2A = bytes("LimboExitO2A");
    bytes public LimboExitO = bytes("LimboExitO");

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
    bytes Exit;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        bytes _Exit
    ) {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        Exit = _Exit;
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
        if(input0 == LimboExitO2A) {
            return getChildLimboExitO2A(inputs, challengeInput);
        }
        if(input0 == LimboExitO) {
            return getChildLimboExitO(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == LimboExitO2A) {
            decideLimboExitO2A(_inputs, _witness);
        }
        if(input0 == LimboExitO) {
            decideLimboExitO(_inputs, _witness);
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
     * Gets child of LimboExitO2A().
     */
    function getChildLimboExitO2A(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            notInputs[0] = _inputs[1];
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            childInputs[1] = _inputs[2];
            childInputs[2] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsValidStateTransition,
                inputs: childInputs
            }));
        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Exit,
                inputs: childInputs
            }));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of LimboExitO().
     */
    function getChildLimboExitO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = _inputs[1];
        notInputs0[0] = abi.encode(type.Property({
            predicateAddress: Exit,
            inputs: childInputs
        }));
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = LimboExitO2A;
        childInputs[1] = _inputs[1];
        childInputs[2] = _inputs[2];
        childInputs[3] = _inputs[3];
        notInputs1[0] = abi.encode(type.Property({
            predicateAddress: LimboExitO2A,
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
     * Decides LimboExitO2A(LimboExitO2A,prev_su,tx,su).
     */
    function decideLimboExitO2A(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective

        require(adjudicationContract.isDecided(_inputs[1]));


        bytes[] memory childInputs1 = new bytes[](3);
        childInputs1[0] = _inputs[1];
        childInputs1[1] = _inputs[2];
        childInputs1[2] = _inputs[3];
        require(IsValidStateTransition.decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](1);
        childInputs2[0] = _inputs[3];
        require(Exit.decide(childInputs2));

        return true;
    }
    /**
     * Decides LimboExitO(LimboExitO,prev_su,tx,su).
     */
    function decideLimboExitO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        uint256 orIndex = abi.decode(witness[0], (uint256));
        if(orIndex == 0) {
            bytes[] memory childInputs0 = new bytes[](1);
            childInputs0[0] = _inputs[1];

            bytes[] memory childInputs0 = new bytes[](1);
            childInputs0[0] = _inputs[1];
            require(Exit.decide(childInputs0));

        }
        if(orIndex == 1) {
            bytes[] memory childInputs1 = new bytes[](4);
            childInputs1[0] = LimboExitO2A;
            childInputs1[1] = _inputs[1];
            childInputs1[2] = _inputs[2];
            childInputs1[3] = _inputs[3];
            require(decideLimboExitO2A(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        }
        return true;
    }

}

