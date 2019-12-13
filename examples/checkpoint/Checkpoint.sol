pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "./AtomicPredicate.sol";
import "./NotPredicate.sol";



/**
 * Checkpoint(B,C)
 */
contract Checkpoint {
  
    bytes32 public CheckpointFFO2A;
  
    bytes32 public CheckpointFFO;
  
    bytes32 public CheckpointFF;
  
    bytes32 public CheckpointF;
  
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
      
      CheckpointFFO2A = keccak256("CheckpointFFO2A");
      
      CheckpointFFO = keccak256("CheckpointFFO");
      
      CheckpointFF = keccak256("CheckpointFF");
      
      CheckpointF = keccak256("CheckpointF");
      
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
      
        
        if(input0 == CheckpointFFO2A) {
          return getChildCheckpointFFO2A(inputs, challengeInput);
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
    function getChildCheckpointFFO2A(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
      
          return type.Property({
            predicateAddress: Not,
            inputs: [_inputs[1]]
          });
      
        }
        
        if(challengeInput == 1) {
      
          return type.Property({
            predicateAddress: Not,
            inputs: [_inputs[3]]
          });
      
        }
        
      
    }
  
  /**
   * Decides CheckpointFFO2A(CheckpointFFO2A,verifyInclusion,su,eq,ZeroHash).
   */
  function decideCheckpointFFO2A(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
    
      // And logical connective
      
      require([object Object].decide([_inputs[2]], _witness));
      
      require([object Object].decide([_inputs[2],_inputs[4]], _witness));
      
    
  }
  
  
  /**
   * Decides CheckpointFFO(CheckpointFFO,su,verifyInclusion,eq,ZeroHash).
   */
  function decideCheckpointFFO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
    
      // check Or
    var result = false
      
    result = result | require([object Object].decide([], _witness))
      
    result = result | require(CheckpointFFO2A.decide([challengeInput,_inputs[2],_inputs[1],_inputs[3],_inputs[4]], _witness))
      
    require(result);
    
  }
  
  
    /**
     * Gets child of CheckpointFF().
     */
    function getChildCheckpointFF(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
        require(SU.decide(_inputs[1],_inputs[2], challengeInput));
        return getChildCheckpointFFO([challengeInput,challengeInput,_inputs[3],_inputs[4],_inputs[5]], challengeInputs.subArray(1));
            
    }
  
  /**
   * Decides CheckpointFF(CheckpointFF,B,C,verifyInclusion,eq,ZeroHash).
   */
  function decideCheckpointFF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
    
  }
  
  
    /**
     * Gets child of CheckpointF().
     */
    function getChildCheckpointF(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
        require(LessThan.decide(_inputs[1], challengeInput));
        return getChildCheckpointFF([challengeInput,_inputs[1],_inputs[2],_inputs[3],_inputs[4],_inputs[5]], challengeInputs.subArray(1));
            
    }
  
  /**
   * Decides CheckpointF(CheckpointF,B,C,verifyInclusion,eq,ZeroHash).
   */
  function decideCheckpointF(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
    
  }
  
}

