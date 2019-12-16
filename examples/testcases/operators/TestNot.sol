pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * NotTest(a)
 */
contract NotTest {
    bytes public NotTestN = bytes("NotTestN");

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
        if(input0 == NotTestN) {
            return getChildNotTestN(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == NotTestN) {
            decideNotTestN(_inputs, _witness);
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
     * Gets child of NotTestN().
     */
    function getChildNotTestN(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes memory property;
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = _inputs[1];
        property = abi.encode(type.Property({
            predicateAddress: Foo,
            inputs: childInputs
        }));
        return property;
    }
    /**
     * Decides NotTestN(NotTestN,a).
     */
    function decideNotTestN(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        return false;
    }

}

