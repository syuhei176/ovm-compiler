pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "../DataTypes.sol";
import "../UniversalAdjudicationContract.sol";
import "./AtomicPredicate.sol";
import "./NotPredicate.sol";



/**
 * Order(maker,c_token,c_amount,min_block_number)
 */
contract Order {
  
    bytes32 public OrderTA2TA5O1A;
  
    bytes32 public OrderTA2TA5O2A1N;
  
    bytes32 public OrderTA2TA5O2A;
  
    bytes32 public OrderTA2TA5O;
  
    bytes32 public OrderTA2TA;
  
    bytes32 public OrderTA2T;
  
    bytes32 public OrderTA;
  
    bytes32 public OrderT;
  
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
      
      OrderTA2TA5O1A = keccak256("OrderTA2TA5O1A");
      
      OrderTA2TA5O2A1N = keccak256("OrderTA2TA5O2A1N");
      
      OrderTA2TA5O2A = keccak256("OrderTA2TA5O2A");
      
      OrderTA2TA5O = keccak256("OrderTA2TA5O");
      
      OrderTA2TA = keccak256("OrderTA2TA");
      
      OrderTA2T = keccak256("OrderTA2T");
      
      OrderTA = keccak256("OrderTA");
      
      OrderT = keccak256("OrderT");
      
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
      
        
        if(input0 == OrderTA2TA5O1A) {
          return getChildOrderTA2TA5O1A(inputs, challengeInput);
        }
        
        if(input0 == OrderTA2TA5O2A1N) {
          return getChildOrderTA2TA5O2A1N(inputs, challengeInput);
        }
        
        if(input0 == OrderTA2TA5O2A) {
          return getChildOrderTA2TA5O2A(inputs, challengeInput);
        }
        
        
        if(input0 == OrderTA2TA) {
          return getChildOrderTA2TA(inputs, challengeInput);
        }
        
        
        if(input0 == OrderTA) {
          return getChildOrderTA(inputs, challengeInput);
        }
        
    }

  /**
   * @dev check the property is true
   */
  function decideTrue(bytes[] memory _inputs, bytes memory _witness) public {
    bytes32 input0 = bytesToBytes32(_inputs[0]);
    
    if(input0 == OrderTA2TA5O1A) {
      decideTrueOrderTA2TA5O1A(_inputs, _witness);
    }
    
    if(input0 == OrderTA2TA5O2A1N) {
      decideTrueOrderTA2TA5O2A1N(_inputs, _witness);
    }
    
    if(input0 == OrderTA2TA5O2A) {
      decideTrueOrderTA2TA5O2A(_inputs, _witness);
    }
    
    if(input0 == OrderTA2TA5O) {
      decideTrueOrderTA2TA5O(_inputs, _witness);
    }
    
    if(input0 == OrderTA2TA) {
      decideTrueOrderTA2TA(_inputs, _witness);
    }
    
    if(input0 == OrderTA2T) {
      decideTrueOrderTA2T(_inputs, _witness);
    }
    
    if(input0 == OrderTA) {
      decideTrueOrderTA(_inputs, _witness);
    }
    
    if(input0 == OrderT) {
      decideTrueOrderT(_inputs, _witness);
    }
    
  }

  
  
    /**
     * Gets child of OrderTA2TA5O1A().
     */
    function getChildOrderTA2TA5O1A(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: withdraw,
              inputs: [_inputs[1]]
            })]
          });
        }
        
        if(challengeInput == 1) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: IsValidSignature,
              inputs: [_inputs[2],challengeInput]
            })]
          });
        }
        
      
    }
  
  /**
   * Decides OrderTA2TA5O1A(OrderTA2TA5O1A,c_su,tx).
   */
  function decideTrueOrderTA2TA5O1A(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check And
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: withdraw,
          inputs: [_inputs[1]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: IsValidSignature,
          inputs: [_inputs[2],challengeInput]
        }))));
      
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
    /**
     * Gets child of OrderTA2TA5O2A1N().
     */
    function getChildOrderTA2TA5O2A1N(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
      return type.Property({
        predicateAddress: withdraw,
        inputs: [_inputs[1]]
      });
      
    }
  
  /**
   * Decides OrderTA2TA5O2A1N(OrderTA2TA5O2A1N,c_su).
   */
  function decideTrueOrderTA2TA5O2A1N(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
  }
  
  
    /**
     * Gets child of OrderTA2TA5O2A().
     */
    function getChildOrderTA2TA5O2A(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: OrderTA2TA5O2A1N,
              inputs: [challengeInput,_inputs[1]]
            })]
          });
        }
        
        if(challengeInput == 1) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: IsValidSignature,
              inputs: [_inputs[2],_inputs[3]]
            })]
          });
        }
        
      
    }
  
  /**
   * Decides OrderTA2TA5O2A(OrderTA2TA5O2A,c_su,tx,maker).
   */
  function decideTrueOrderTA2TA5O2A(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check And
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: OrderTA2TA5O2A1N,
          inputs: [challengeInput,_inputs[1]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: IsValidSignature,
          inputs: [_inputs[2],_inputs[3]]
        }))));
      
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
  /**
   * Decides OrderTA2TA5O(OrderTA2TA5O,c_su,tx,maker).
   */
  function decideTrueOrderTA2TA5O(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check Or
    var result = false
      
    result = result | AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: OrderTA2TA5O1A,
        inputs: [challengeInput,_inputs[1],_inputs[2]]
      })))
      
    result = result | AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: OrderTA2TA5O2A,
        inputs: [challengeInput,_inputs[1],_inputs[2],_inputs[3]]
      })))
      
    require(result);
    AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
    /**
     * Gets child of OrderTA2TA().
     */
    function getChildOrderTA2TA(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: assert,
              inputs: [challengeInput,_inputs[2]]
            })]
          });
        }
        
        if(challengeInput == 1) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: checkAmount,
              inputs: [challengeInput,_inputs[3]]
            })]
          });
        }
        
        if(challengeInput == 2) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: gte,
              inputs: [challengeInput,_inputs[4]]
            })]
          });
        }
        
        if(challengeInput == 3) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: assert,
              inputs: [challengeInput,_inputs[5]]
            })]
          });
        }
        
        if(challengeInput == 4) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: OrderTA2TA5O,
              inputs: [challengeInput,_inputs[1],_inputs[6],_inputs[5]]
            })]
          });
        }
        
      
    }
  
  /**
   * Decides OrderTA2TA(OrderTA2TA,c_su,c_token,c_amount,min_block_number,maker,tx).
   */
  function decideTrueOrderTA2TA(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check And
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: assert,
          inputs: [challengeInput,_inputs[2]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: checkAmount,
          inputs: [challengeInput,_inputs[3]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: gte,
          inputs: [challengeInput,_inputs[4]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: assert,
          inputs: [challengeInput,_inputs[5]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: OrderTA2TA5O,
          inputs: [challengeInput,_inputs[1],_inputs[6],_inputs[5]]
        }))));
      
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
  /**
   * Decides OrderTA2T(OrderTA2T,c_token,c_amount,min_block_number,maker,tx).
   */
  function decideTrueOrderTA2T(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check ThereExistsSuchThat
      
      require(SU.decide(_witness));
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: OrderTA2TA,
        inputs: [_witness,_witness,_inputs[1],_inputs[2],_inputs[3],_inputs[4],_inputs[5]]
      }))));
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
    /**
     * Gets child of OrderTA().
     */
    function getChildOrderTA(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: SameRange,
              inputs: [_inputs[1],_inputs[2]]
            })]
          });
        }
        
        if(challengeInput == 1) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: OrderTA2T,
              inputs: [challengeInput,_inputs[3],_inputs[4],_inputs[5],_inputs[6],_inputs[1]]
            })]
          });
        }
        
      
    }
  
  /**
   * Decides OrderTA(OrderTA,tx,self,c_token,c_amount,min_block_number,maker).
   */
  function decideTrueOrderTA(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check And
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: SameRange,
          inputs: [_inputs[1],_inputs[2]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: OrderTA2T,
          inputs: [challengeInput,_inputs[3],_inputs[4],_inputs[5],_inputs[6],_inputs[1]]
        }))));
      
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
  /**
   * Decides OrderT(OrderT,self,c_token,c_amount,min_block_number,maker).
   */
  function decideTrueOrderT(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check ThereExistsSuchThat
      
      require(Bytes.decide(_witness));
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: OrderTA,
        inputs: [_witness,_witness,_inputs[1],_inputs[2],_inputs[3],_inputs[4],_inputs[5]]
      }))));
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
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

/**
 * Exit_correspondent(c_su,maker)
 */
contract Exit_correspondent {
  
    bytes32 public Exit_correspondentO1A;
  
    bytes32 public Exit_correspondentO2T;
  
    bytes32 public Exit_correspondentO;
  
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
      
      Exit_correspondentO1A = keccak256("Exit_correspondentO1A");
      
      Exit_correspondentO2T = keccak256("Exit_correspondentO2T");
      
      Exit_correspondentO = keccak256("Exit_correspondentO");
      
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
      
        
        if(input0 == Exit_correspondentO1A) {
          return getChildExit_correspondentO1A(inputs, challengeInput);
        }
        
        
    }

  /**
   * @dev check the property is true
   */
  function decideTrue(bytes[] memory _inputs, bytes memory _witness) public {
    bytes32 input0 = bytesToBytes32(_inputs[0]);
    
    if(input0 == Exit_correspondentO1A) {
      decideTrueExit_correspondentO1A(_inputs, _witness);
    }
    
    if(input0 == Exit_correspondentO2T) {
      decideTrueExit_correspondentO2T(_inputs, _witness);
    }
    
    if(input0 == Exit_correspondentO) {
      decideTrueExit_correspondentO(_inputs, _witness);
    }
    
  }

  
  
    /**
     * Gets child of Exit_correspondentO1A().
     */
    function getChildExit_correspondentO1A(bytes[] memory _inputs, bytes memory challengeInput) private returns (types.Property memory) {
      
        
        if(challengeInput == 0) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: exit,
              inputs: [_inputs[1]]
            })]
          });
        }
        
        if(challengeInput == 1) {
          return type.Property({
            predicateAddress: Not,
            inputs: [type.Property({
              predicateAddress: deposit_exists,
              inputs: [challengeInput,challengeInput]
            })]
          });
        }
        
      
    }
  
  /**
   * Decides Exit_correspondentO1A(Exit_correspondentO1A,c_su).
   */
  function decideTrueExit_correspondentO1A(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check And
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: exit,
          inputs: [_inputs[1]]
        }))));
      
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
          predicateAddress: deposit_exists,
          inputs: [challengeInput,challengeInput]
        }))));
      
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
  /**
   * Decides Exit_correspondentO2T(Exit_correspondentO2T,c_su,maker).
   */
  function decideTrueExit_correspondentO2T(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check ThereExistsSuchThat
      
      require(Tx.decide(_witness, _witness));
      require(AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: IsValidSignature,
        inputs: [_inputs[2]]
      }))));
      AdjudicationContract.setPredicateDecision(propertyHash, true);
    
  }
  
  
  /**
   * Decides Exit_correspondentO(Exit_correspondentO,c_su,maker).
   */
  function decideTrueExit_correspondentO(bytes[] memory _inputs, bytes memory _witness) public {
      bytes32 propertyHash = keccak256(abi.encode(types.Property({
        predicateAddress: address(this),
        inputs: _inputs
      })));
      // check property is true
    
      // check Or
    var result = false
      
    result = result | AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: Exit_correspondentO1A,
        inputs: [challengeInput,_inputs[1]]
      })))
      
    result = result | AdjudicationContract.isDecided(keccak256(abi.encode({
        predicateAddress: Exit_correspondentO2T,
        inputs: [challengeInput,_inputs[1],_inputs[2]]
      })))
      
    require(result);
    AdjudicationContract.setPredicateDecision(propertyHash, true);
    
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

