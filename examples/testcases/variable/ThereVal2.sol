pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "../Utils.sol";
import "./AtomicPredicate.sol";
import "./CompiledPredicate.sol";


/**
 * ThereValTest(a)
 */
contract ThereValTest {
    bytes public ThereValTestT = bytes("ThereValTestT");

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
        if(input0 == ThereValTestT) {
            return getChildThereValTestT(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == ThereValTestT) {
            decideThereValTestT(_inputs, _witness);
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
     * Gets child of ThereValTestT().
     */
    function getChildThereValTestT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
            types.Property memory inputPredicateProperty = abi.decode(_inputs[1], (types.Property));
            bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
            for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
                childInputs[i] = inputPredicateProperty.inputs[i];
            }
            childInputs[stateObject.inputs.length] = _inputs[];
            notInputs[0] = abi.encode(types.Property({
                predicateAddress: inputPredicateProperty.predicateAddress,
                inputs: childInputs
            }));
        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("b");
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
     * Decides ThereValTestT(ThereValTestT,a).
     */
    function decideThereValTestT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory quantifierInputs = new bytes[](1);
        quantifierInputs[0] = _witness[0];
        require(AtomicPredicate(B).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](1);
            childInputs[0] = witness[0];

            types.Property memory inputPredicateProperty = abi.decode(_inputs[1], (types.Property));
            bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
            for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
                childInputs[i] = inputPredicateProperty.inputs[i];
            }
            childInputs[stateObject.inputs.length] = _inputs[];
            require(CompiledPredicate(inputPredicateProperty.predicateAddress).decide(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }

}

