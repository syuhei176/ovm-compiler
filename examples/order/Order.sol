pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { DataTypes as types } from "ovm-contracts/DataTypes.sol";
import "ovm-contracts/UniversalAdjudicationContract.sol";
import "ovm-contracts/Utils.sol";
import "ovm-contracts/Predicate/AtomicPredicate.sol";
import "ovm-contracts/Predicate/CompiledPredicate.sol";


/**
 * Order(c_amount,c_token,maker,min_block_number,tx)
 */
contract Order {
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
    bytes swapAddress;
    bytes Withdraw;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        bytes _swapAddress,
        bytes _Withdraw
    ) {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        swapAddress = _swapAddress;
        Withdraw = _Withdraw;
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
     * Gets child of OrderTA().
     */
    function getChildOrderTA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
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
            childInputs[0] = inputProperty1.inputs[0];
            childInputs[1] = _inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[1];
            childInputs[1] = _inputs[3];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsSameAmount,
                inputs: childInputs
            }));
        }
        if(challengeInput == 3) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[4];
            childInputs[1] = inputProperty1.inputs[2];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: IsLessThan,
                inputs: childInputs
            }));
        }
        if(challengeInput == 4) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1Child3.inputs[1];
            childInputs[1] = _inputs[5];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Equal,
                inputs: childInputs
            }));
        }
        if(challengeInput == 5) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Withdraw,
                inputs: childInputs
            }));
        }
        if(challengeInput == 6) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[6];
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
     * Gets child of OrderT().
     */
    function getChildOrderT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = OrderTA;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[2];
        childInputs[3] = _inputs[1];
        childInputs[4] = _inputs[4];
        childInputs[5] = _inputs[3];
        childInputs[6] = _inputs[5];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: OrderTA,
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
     * Decides OrderTA(OrderTA,c_su,c_token,c_amount,min_block_number,maker,tx).
     */
    function decideOrderTA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = abi.encodePacked(inputProperty1.predicateAddress);
        childInputs0[1] = swapAddress;
        require(Equal.decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[0];
        childInputs1[1] = _inputs[2];
        require(Equal.decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](2);
        childInputs2[0] = inputProperty1.inputs[1];
        childInputs2[1] = _inputs[3];
        require(IsSameAmount.decide(childInputs2));


        bytes[] memory childInputs3 = new bytes[](2);
        childInputs3[0] = _inputs[4];
        childInputs3[1] = inputProperty1.inputs[2];
        require(IsLessThan.decide(childInputs3));


        bytes[] memory childInputs4 = new bytes[](2);
        childInputs4[0] = inputProperty1Child3.inputs[1];
        childInputs4[1] = _inputs[5];
        require(Equal.decide(childInputs4));


        bytes[] memory childInputs5 = new bytes[](1);
        childInputs5[0] = _inputs[1];
        require(Withdraw.decide(childInputs5));


        bytes[] memory childInputs6 = new bytes[](2);
        childInputs6[0] = _inputs[6];
        childInputs6[1] = inputProperty1Child3.inputs[0];
        require(IsValidSignature.decide(childInputs6));

        return true;
    }
    /**
     * Decides OrderT(OrderT,c_amount,c_token,maker,min_block_number,tx).
     */
    function decideOrderT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](7);
        childInputs[0] = OrderTA;
        childInputs[1] = witness[0];
        childInputs[2] = _inputs[2];
        childInputs[3] = _inputs[1];
        childInputs[4] = _inputs[4];
        childInputs[5] = _inputs[3];
        childInputs[6] = _inputs[5];
        require(decideOrderTA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }

}

/**
 * Withdraw(c_su,maker)
 */
contract Withdraw {
    bytes public WithdrawO1A = bytes("WithdrawO1A");
    bytes public WithdrawO2TA = bytes("WithdrawO2TA");
    bytes public WithdrawO2T = bytes("WithdrawO2T");
    bytes public WithdrawO = bytes("WithdrawO");

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
    bytes DepositExists;
    bytes TransactionAddress;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        bytes _Exit,
        bytes _DepositExists,
        bytes _TransactionAddress
    ) {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        Exit = _Exit;
        DepositExists = _DepositExists;
        TransactionAddress = _TransactionAddress;
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
        if(input0 == WithdrawO1A) {
            return getChildWithdrawO1A(inputs, challengeInput);
        }
        if(input0 == WithdrawO2TA) {
            return getChildWithdrawO2TA(inputs, challengeInput);
        }
        if(input0 == WithdrawO2T) {
            return getChildWithdrawO2T(inputs, challengeInput);
        }
        if(input0 == WithdrawO) {
            return getChildWithdrawO(inputs, challengeInput);
        }
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes memory _witness) public view returns(bool) {
        bytes32 input0 = bytesToBytes32(_inputs[0]);
        if(input0 == WithdrawO1A) {
            decideWithdrawO1A(_inputs, _witness);
        }
        if(input0 == WithdrawO2TA) {
            decideWithdrawO2TA(_inputs, _witness);
        }
        if(input0 == WithdrawO2T) {
            decideWithdrawO2T(_inputs, _witness);
        }
        if(input0 == WithdrawO) {
            decideWithdrawO(_inputs, _witness);
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
     * Gets child of WithdrawO1A().
     */
    function getChildWithdrawO1A(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Exit,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[0];
            childInputs[1] = inputProperty1.inputs[1];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: DepositExists,
                inputs: childInputs
            }));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of WithdrawO2TA().
     */
    function getChildWithdrawO2TA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
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
     * Gets child of WithdrawO2T().
     */
    function getChildWithdrawO2T(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = WithdrawO2TA;
        childInputs[1] = challengeInputs[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        notInputs[0] = abi.encode(type.Property({
            predicateAddress: WithdrawO2TA,
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
     * Gets child of WithdrawO().
     */
    function getChildWithdrawO(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = WithdrawO1A;
        childInputs[1] = _inputs[1];
        notInputs0[0] = abi.encode(type.Property({
            predicateAddress: WithdrawO1A,
            inputs: childInputs
        }));
        andInputs[0] = abi.encode(type.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputs = new bytes[](2);
        childInputs[0] = WithdrawO2T;
        childInputs[1] = _inputs[1];
        childInputs[2] = _inputs[2];
        notInputs1[0] = abi.encode(type.Property({
            predicateAddress: WithdrawO2T,
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
     * Decides WithdrawO1A(WithdrawO1A,c_su).
     */
    function decideWithdrawO1A(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](1);
        childInputs0[0] = _inputs[1];
        require(Exit.decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[0];
        childInputs1[1] = inputProperty1.inputs[1];
        require(DepositExists.decide(childInputs1));

        return true;
    }
    /**
     * Decides WithdrawO2TA(WithdrawO2TA,tx,c_su,maker).
     */
    function decideWithdrawO2TA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
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
     * Decides WithdrawO2T(WithdrawO2T,c_su,maker).
     */
    function decideWithdrawO2T(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = WithdrawO2TA;
        childInputs[1] = witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        require(decideWithdrawO2TA(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides WithdrawO(WithdrawO,c_su,maker).
     */
    function decideWithdrawO(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        uint256 orIndex = abi.decode(witness[0], (uint256));
        if(orIndex == 0) {
            bytes[] memory childInputs0 = new bytes[](2);
            childInputs0[0] = WithdrawO1A;
            childInputs0[1] = _inputs[1];
            require(decideWithdrawO1A(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        }
        if(orIndex == 1) {
            bytes[] memory childInputs1 = new bytes[](3);
            childInputs1[0] = WithdrawO2T;
            childInputs1[1] = _inputs[1];
            childInputs1[2] = _inputs[2];
            require(decideWithdrawO2T(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        }
        return true;
    }

}

