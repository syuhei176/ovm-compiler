pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "../Utils.sol";
import "./AtomicPredicate.sol";
import "./CompiledPredicate.sol";


/**
 * OrTest(a,b)
 */
contract OrTest {
    bytes public OrTestO = bytes("OrTestO");

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
        if(input0 == OrTestO) {
            return getChildOrTestO(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == OrTestO) {
            decideOrTestO(_inputs, _witness);
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
     * Gets child of OrTestO().
     */
    function getChildOrTestO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            notInputs0[0] = abi.encode(type.Property({
                predicateAddress: Foo,
                inputs: childInputs
            }));
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[2];
            notInputs1[0] = abi.encode(type.Property({
                predicateAddress: Bar,
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
     * Decides OrTestO(OrTestO,a,b).
     */
    function decideOrTestO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        var result = false;
        bytes[] memory childInputs0 = new bytes[](1);
            childInputs0[0] = _inputs[1];

        result = result | Foo.decide(childInputs);

        bytes[] memory childInputs1 = new bytes[](1);
            childInputs1[0] = _inputs[2];

        result = result | Bar.decide(childInputs);

        require(result);
        return true;
    }

}
