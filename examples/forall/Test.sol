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
  
    bytes32 public TestFA;
  
    bytes32 public TestF;
  
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
      
      TestFA = keccak256("TestFA");
      
      TestF = keccak256("TestF");
      
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
  function decideTrue(bytes[] memory _inputs, bytes memory _witness) public {
    bytes32 input0 = bytesToBytes32(_inputs[0]);
    
    if(input0 == TestFA) {
      decideTrueTestFA(_inputs, _witness);
    }
    
    if(input0 == TestF) {
      decideTrueTestF(_inputs, _witness);
    }
    
  }

  
  
    /**
     * Gets child of TestFA().
     */
    function getChildTestFA(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: Foo,
              inputs: [_inputs[1]]
            })]
          });
        }
        
        if(challengeInput == 1) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: Bar,
              inputs: [_inputs[1]]
            })]
          });
        }
        
      
    }
  
  /**
   * Decides TestFA(TestFA,b).
   */
  function decideTrueTestFA(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check And
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: Foo,
          inputs: [_inputs[1]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: Bar,
          inputs: [_inputs[1]]
        }))));
      
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
    /**
     * Gets child of TestF().
     */
    function getChildTestF(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
      require(A.decide(_inputs[1], challengeInput));
      return type.Property({
        predicateAddress: Not,
        inputs: [type.Property({
          predicateAddress: TestFA,
          inputs: [challengeInput,challengeInput]
        })]
      });
      
    }
  
  /**
   * Decides TestF(TestF,a).
   */
  function decideTrueTestF(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
  }
  

  function bytesToBytes32(bytes memory source) returns (bytes32 result) {
    if (source.length == 0) {
        return 0x0;
    }

    assembly {
        result := mload(add(source, 32))
    }
  }
}

