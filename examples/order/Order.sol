pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * Order(maker,c_token,c_amount,min_block_number,max_block_number,tx)
 */
contract Order {
    bytes public OrderTA3TA4O2TA = bytes("OrderTA3TA4O2TA");
    bytes public OrderTA3TA4O2T = bytes("OrderTA3TA4O2T");
    bytes public OrderTA3TA4O = bytes("OrderTA3TA4O");
    bytes public OrderTA3TA = bytes("OrderTA3TA");
    bytes public OrderTA3T = bytes("OrderTA3T");
    bytes public OrderTA = bytes("OrderTA");
    bytes public OrderT = bytes("OrderT");

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
    bytes TransactionAddress;
    bytes Withdraw;
    bytes swapAddress;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        bytes _TransactionAddress,
        bytes _Withdraw,
        bytes _swapAddress
    ) {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        TransactionAddress = _TransactionAddress;
        Withdraw = _Withdraw;
        swapAddress = _swapAddress;
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
        if(input0 == OrderTA3TA4O2TA) {
            return getChildOrderTA3TA4O2TA(inputs, challengeInput);
        }
        if(input0 == OrderTA3TA4O2T) {
            return getChildOrderTA3TA4O2T(inputs, challengeInput);
        }
        if(input0 == OrderTA3TA4O) {
            return getChildOrderTA3TA4O(inputs, challengeInput);
        }
        if(input0 == OrderTA3TA) {
            return getChildOrderTA3TA(inputs, challengeInput);
        }
        if(input0 == OrderTA3T) {
            return getChildOrderTA3T(inputs, challengeInput);
        }
        if(input0 == OrderTA) {
            return getChildOrderTA(inputs, challengeInput);
        }
        if(input0 == OrderT) {
            return getChildOrderT(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == OrderTA3TA4O2TA) {
            decideOrderTA3TA4O2TA(_inputs, _witness);
        }
        if(input0 == OrderTA3TA4O2T) {
            decideOrderTA3TA4O2T(_inputs, _witness);
        }
        if(input0 == OrderTA3TA4O) {
            decideOrderTA3TA4O(_inputs, _witness);
        }
        if(input0 == OrderTA3TA) {
            decideOrderTA3TA(_inputs, _witness);
        }
        if(input0 == OrderTA3T) {
            decideOrderTA3T(_inputs, _witness);
        }
        if(input0 == OrderTA) {
            decideOrderTA(_inputs, _witness);
        }
        if(input0 == OrderT) {
            decideOrderT(_inputs, _witness);
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
     * Gets child of OrderTA3TA4O2TA().
     */
    function getChildOrderTA3TA4O2TA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = abi.encodePacked(inputProperty1.predicateAddress);
            childInputs[1] = TransactionAddress;
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[0];
            childInputs[1] = inputProperty2.inputs[0];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[1];
            childInputs[1] = inputProperty2.inputs[1];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsContained,
                inputs: childInputs
            }));
        }
        if(challengeInput == 3) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[2];
            childInputs[1] = inputProperty2.inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 4) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            childInputs[1] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsValidSignature,
                inputs: childInputs
            }));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OrderTA3TA4O2T().
     */
    function getChildOrderTA3TA4O2T(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = OrderTA3TA4O2TA;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: OrderTA3TA4O2TA,
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
     * Gets child of OrderTA3TA4O().
     */
    function getChildOrderTA3TA4O(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = _inputs[1];
        notInputs0[0] = abi.encode(type.Property({
            predicateAddress: Withdraw,
            inputs: childInputs
        }));
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = OrderTA3TA4O2T;
        childInputs[1] = _inputs[1];
        childInputs[2] = _inputs[2];
        notInputs1[0] = abi.encode(type.Property({
            predicateAddress: OrderTA3TA4O2T,
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
     * Gets child of OrderTA3TA().
     */
    function getChildOrderTA3TA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = abi.encodePacked(inputProperty1.predicateAddress);
            childInputs[1] = swapAddress;
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[1];
            childInputs[1] = _inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsSameAmount,
                inputs: childInputs
            }));
        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1Child3.inputs[1];
            childInputs[1] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 3) {
            bytes[] memory childInputs = new bytes[](3);
            childInputs[0] = OrderTA3TA4O;
            childInputs[1] = _inputs[1];
            childInputs[2] = _inputs[3];
            return getChildOrderTA3TA4O(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
        }
        if(challengeInput == 4) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[4];
            childInputs[1] = inputProperty1Child3.inputs[0];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsValidSignature,
                inputs: childInputs
            }));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OrderTA3T().
     */
    function getChildOrderTA3T(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = OrderTA3TA;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        childInputs[4] = _inputs[3];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: OrderTA3TA,
            inputs: childInputs
        }));
        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("c_su");
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
     * Gets child of OrderTA().
     */
    function getChildOrderTA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            childInputs[1] = _inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsLessThan,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[2];
            childInputs[1] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsLessThan,
                inputs: childInputs
            }));
        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](4);
            childInputs[0] = OrderTA3T;
            childInputs[1] = _inputs[4];
            childInputs[2] = _inputs[5];
            childInputs[3] = _inputs[6];
            return getChildOrderTA3T(childInputs, Utils.subArray(challengeInputs, 1, challengeInputs.length));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OrderT().
     */
    function getChildOrderT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = OrderTA;
        childInputs[1] = _inputs[4];
        childInputs[2] = challengeInputs[0];
        childInputs[3] = _inputs[5];
        childInputs[4] = _inputs[3];
        childInputs[5] = _inputs[1];
        childInputs[6] = _inputs[6];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: OrderTA,
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
     * Decides OrderTA3TA4O2TA(OrderTA3TA4O2TA,tx,c_su,maker).
     */
    function decideOrderTA3TA4O2TA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = abi.encodePacked(inputProperty1.predicateAddress);
        childInputs0[1] = TransactionAddress;
        require(Equal.decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[0];
        childInputs1[1] = inputProperty2.inputs[0];
        require(Equal.decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](2);
        childInputs2[0] = inputProperty1.inputs[1];
        childInputs2[1] = inputProperty2.inputs[1];
        require(IsContained.decide(childInputs2));


        bytes[] memory childInputs3 = new bytes[](2);
        childInputs3[0] = inputProperty1.inputs[2];
        childInputs3[1] = inputProperty2.inputs[2];
        require(Equal.decide(childInputs3));


        bytes[] memory childInputs4 = new bytes[](2);
        childInputs4[0] = _inputs[1];
        childInputs4[1] = _inputs[3];
        require(IsValidSignature.decide(childInputs4));

        return true;
    }
    /**
     * Decides OrderTA3TA4O2T(OrderTA3TA4O2T,c_su,maker).
     */
    function decideOrderTA3TA4O2T(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = OrderTA3TA4O2TA;
        childInputs[1] = witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        require(decideOrderTA3TA4O2TA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides OrderTA3TA4O(OrderTA3TA4O,c_su,maker).
     */
    function decideOrderTA3TA4O(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        uint256 orIndex = abi.decode(witness[0], (uint256));
        if(orIndex == 0) {
            bytes[] memory childInputs0 = new bytes[](1);
            childInputs0[0] = _inputs[1];

            bytes[] memory childInputs0 = new bytes[](1);
            childInputs0[0] = _inputs[1];
            require(Withdraw.decide(childInputs0));

        }
        if(orIndex == 1) {
            bytes[] memory childInputs1 = new bytes[](3);
            childInputs1[0] = OrderTA3TA4O2T;
            childInputs1[1] = _inputs[1];
            childInputs1[2] = _inputs[2];
            require(decideOrderTA3TA4O2T(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        }
        return true;
    }
    /**
     * Decides OrderTA3TA(OrderTA3TA,c_su,c_amount,maker,tx).
     */
    function decideOrderTA3TA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = abi.encodePacked(inputProperty1.predicateAddress);
        childInputs0[1] = swapAddress;
        require(Equal.decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[1];
        childInputs1[1] = _inputs[2];
        require(IsSameAmount.decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](2);
        childInputs2[0] = inputProperty1Child3.inputs[1];
        childInputs2[1] = _inputs[3];
        require(Equal.decide(childInputs2));

        require(decideOrderTA3TA4O(childInputs3, Utils.subArray(_witness, 1, _witness.length)));


        bytes[] memory childInputs4 = new bytes[](2);
        childInputs4[0] = _inputs[4];
        childInputs4[1] = inputProperty1Child3.inputs[0];
        require(IsValidSignature.decide(childInputs4));

        return true;
    }
    /**
     * Decides OrderTA3T(OrderTA3T,c_amount,maker,tx).
     */
    function decideOrderTA3T(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](5);
        childInputs[0] = OrderTA3TA;
        childInputs[1] = witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        childInputs[4] = _inputs[3];
        require(decideOrderTA3TA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides OrderTA(OrderTA,min_block_number,b,max_block_number,c_amount,maker,tx).
     */
    function decideOrderTA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = _inputs[1];
        childInputs0[1] = _inputs[2];
        require(IsLessThan.decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = _inputs[2];
        childInputs1[1] = _inputs[3];
        require(IsLessThan.decide(childInputs1));

        require(decideOrderTA3T(childInputs2, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides OrderT(OrderT,maker,c_token,c_amount,min_block_number,max_block_number,tx).
     */
    function decideOrderT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](7);
        childInputs[0] = OrderTA;
        childInputs[1] = _inputs[4];
        childInputs[2] = witness[0];
        childInputs[3] = _inputs[5];
        childInputs[4] = _inputs[3];
        childInputs[5] = _inputs[1];
        childInputs[6] = _inputs[6];
        require(decideOrderTA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }

}

