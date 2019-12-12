pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "./AtomicPredicate.sol";
import "./NotPredicate.sol";


/**
 * Test(a)
 */
contract Test {
    bytes public TestFA = bytes("TestFA");
    bytes public TestF = bytes("TestF");

    UniversalAdjudicationContract AdjudicationContract;
    AtomicPredicate SU;
    AtomicPredicate LessThan;
    AtomicPredicate eval;
    AtomicPredicate Bytes;
    AtomicPredicate SameRange;
    AtomicPredicate IsValidSignature;
    NotPredicate Not;

    constructor(address _adjudicationContractAddress) {
        AdjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
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
        if(input0 == TestFA) {
            return getChildTestFA(inputs, challengeInput);
        }
        if(input0 == TestF) {
            return getChildTestF(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == TestFA) {
            decideTestFA(_inputs, _witness);
        }
        if(input0 == TestF) {
            decideTestF(_inputs, _witness);
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
     * Gets child of TestFA().
     */
    function getChildTestFA(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
        if(challengeInput == 0) {
            return type.Property({
                predicateAddress: Not,
                inputs: [abi.encode(type.Property({predicateAddress: Foo,inputs: [_inputs[1]]}))]
            });
        }
        if(challengeInput == 1) {
            return type.Property({
                predicateAddress: Not,
                inputs: [abi.encode(type.Property({predicateAddress: Bar,inputs: [_inputs[1]]}))]
            });
        }
    }
    /**
     * Gets child of TestF().
     */
    function getChildTestF(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
        require(A.decide(_inputs[1], challengeInput));
        return getChildTestFA([challengeInput,challengeInput], challengeInputs.subArray(1));
    }
    /**
     * Decides TestFA(TestFA,b).
     */
    function decideTestFA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective
        require(Foo.decide([_inputs[1]], _witness));
        require(Bar.decide([_inputs[1]], _witness));
    }
    /**
     * Decides TestF(TestF,a).
     */
    function decideTestF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
    }

}

