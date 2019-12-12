pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "./AtomicPredicate.sol";
import "./NotPredicate.sol";



/**
 * EvalTest(a,b)
 */
contract EvalTest {
  
    bytes32 public EvalTestA;
  
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
      
      EvalTestA = keccak256("EvalTestA");
      
    }
    /**
    * @dev Validates a child node of the property in game tree.
    */
    function isValidChallenge(
        bytes[] memory _inputs,
        bytes memory _challengeInput,
        types.Property memory _challenge
    ) public returns (bool) {
        require(
          keccak256(abi.encode(getChild(_inputs, _challengeInput))) == keccak256(abi.encode(_challenge)),
          "_challenge must be valud child of game tree"
        );
        return true;
    }

    function getChild(bytes[] memory inputs, bytes memory challengeInput) private returns (types.Property memory) {
      bytes32 input0 = bytesToBytes32(inputs[0]);
      
        
        if(input0 == EvalTestA) {
          return getChildEvalTestA(inputs, challengeInput);
        }
    }

  /**
   * @dev check the property is true
   */
  function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
    bytes32 input0 = bytesToBytes32(_inputs[0]);
    
    if(input0 == EvalTestA) {
      decideEvalTestA(_inputs, _witness);
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
     * Gets child of EvalTestA().
     */
    function getChildEvalTestA(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
      
          return type.Property({
            predicateAddress: Not,
            inputs: [abi.encode(type.Property({predicateAddress: Foo,inputs: [_inputs[1]]}))]
          });
      
        }
        
        if(challengeInput == 1) {
      
          return type.Property({
            predicateAddress: Not,
            inputs: [_inputs[2]]
          });
      
        }
        
      
    }
  
  /**
   * Decides EvalTestA(EvalTestA,a,b).
   */
  function decideEvalTestA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
    
      // And logical connective
      
      require(Foo.decide([_inputs[1]], _witness));
      
      require([object Object].decide([], _witness));
      
    
  }
  
}

