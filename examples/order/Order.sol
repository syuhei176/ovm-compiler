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
    address IsContained = address(0x0000000000000000000000000000000000000000);
    address VerifyInclusion = address(0x0000000000000000000000000000000000000000);
    address IsSameAmount = address(0x0000000000000000000000000000000000000000);
    address notAddress = address(0x0000000000000000000000000000000000000000);
    address andAddress = address(0x0000000000000000000000000000000000000000);
    address forAllSuchThatAddress = address(0x0000000000000000000000000000000000000000);
    address payoutCountractAddress;
    bool didInitialized = false;
    bytes TransactionAddress;
    address Withdraw;
    bytes swapAddress;

    constructor(
        address _adjudicationContractAddress,
        address _utilsAddress,
        address _notAddress,
        address _andAddress,
        address _forAllSuchThatAddress,
        bytes memory _TransactionAddress,
        address  _Withdraw,
        bytes memory _swapAddress
    ) public {
        adjudicationContract = UniversalAdjudicationContract(_adjudicationContractAddress);
        utils = Utils(_utilsAddress);
        notAddress = _notAddress;
        andAddress = _andAddress;
        forAllSuchThatAddress = _forAllSuchThatAddress;
        TransactionAddress = _TransactionAddress;
        Withdraw = _Withdraw;
        swapAddress = _swapAddress;
    }

    function setPredicateAddresses(
        address _isLessThan,
        address _equal,
        address _isValidSignature,
        address _isContained,
        address _verifyInclusion,
        address _isSameAmount,
        address _payoutCountractAddress
    ) public {
        require(!didInitialized, "didInitialized must be false");
        IsLessThan = _isLessThan;
        Equal = _equal;
        IsValidSignature = _isValidSignature;
        IsContained = _isContained;
        VerifyInclusion = _verifyInclusion;
        IsSameAmount = _isSameAmount;
        payoutCountractAddress = _payoutCountractAddress;
        didInitialized = true;
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
        bytes32 input0 = keccak256(inputs[0]);
        if(input0 == keccak256(OrderTA3TA4O2TA)) {
            return getChildOrderTA3TA4O2TA(inputs, challengeInput);
        }
        if(input0 == keccak256(OrderTA3TA4O2T)) {
            return getChildOrderTA3TA4O2T(inputs, challengeInput);
        }
        if(input0 == keccak256(OrderTA3TA4O)) {
            return getChildOrderTA3TA4O(inputs, challengeInput);
        }
        if(input0 == keccak256(OrderTA3TA)) {
            return getChildOrderTA3TA(inputs, challengeInput);
        }
        if(input0 == keccak256(OrderTA3T)) {
            return getChildOrderTA3T(inputs, challengeInput);
        }
        if(input0 == keccak256(OrderTA)) {
            return getChildOrderTA(inputs, challengeInput);
        }
        if(input0 == keccak256(OrderT)) {
            return getChildOrderT(inputs, challengeInput);
        }
        return getChildOrderTA3TA4O2TA(utils.subArray(inputs, 1, inputs.length), challengeInput);
    }

    /**
     * @dev check the property is true
     */
    function decide(bytes[] memory _inputs, bytes[] memory _witness) public view returns(bool) {
        bytes32 input0 = keccak256(_inputs[0]);
        if(input0 == keccak256(OrderTA3TA4O2TA)) {
            return decideOrderTA3TA4O2TA(_inputs, _witness);
        }
        if(input0 == keccak256(OrderTA3TA4O2T)) {
            return decideOrderTA3TA4O2T(_inputs, _witness);
        }
        if(input0 == keccak256(OrderTA3TA4O)) {
            return decideOrderTA3TA4O(_inputs, _witness);
        }
        if(input0 == keccak256(OrderTA3TA)) {
            return decideOrderTA3TA(_inputs, _witness);
        }
        if(input0 == keccak256(OrderTA3T)) {
            return decideOrderTA3T(_inputs, _witness);
        }
        if(input0 == keccak256(OrderTA)) {
            return decideOrderTA(_inputs, _witness);
        }
        if(input0 == keccak256(OrderT)) {
            return decideOrderT(_inputs, _witness);
        }
        return decideOrderTA3TA4O2TA(utils.subArray(_inputs, 1, _inputs.length), _witness);
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
     * Gets child of OrderTA3TA4O2TA(OrderTA3TA4O2TA,tx,c_su,maker).
     */
    function getChildOrderTA3TA4O2TA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        types.Property memory inputProperty2 = abi.decode(_inputs[2], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputsOf0 = new bytes[](2);
            childInputsOf0[0] = abi.encodePacked(inputProperty1.predicateAddress);
            childInputsOf0[1] = TransactionAddress;

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Equal,
                inputs: childInputsOf0
            }));

        }
        if(challengeInput == 1) {
            bytes[] memory childInputsOf1 = new bytes[](2);
            childInputsOf1[0] = inputProperty1.inputs[0];
            childInputsOf1[1] = inputProperty2.inputs[0];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Equal,
                inputs: childInputsOf1
            }));

        }
        if(challengeInput == 2) {
            bytes[] memory childInputsOf2 = new bytes[](2);
            childInputsOf2[0] = inputProperty1.inputs[1];
            childInputsOf2[1] = inputProperty2.inputs[1];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: IsContained,
                inputs: childInputsOf2
            }));

        }
        if(challengeInput == 3) {
            bytes[] memory childInputsOf3 = new bytes[](2);
            childInputsOf3[0] = inputProperty1.inputs[2];
            childInputsOf3[1] = inputProperty2.inputs[2];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Equal,
                inputs: childInputsOf3
            }));

        }
        if(challengeInput == 4) {
            bytes[] memory childInputsOf4 = new bytes[](2);
            childInputsOf4[0] = _inputs[1];
            childInputsOf4[1] = _inputs[3];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: IsValidSignature,
                inputs: childInputsOf4
            }));

        }
        return types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OrderTA3TA4O2T(OrderTA3TA4O2T,c_su,maker).
     */
    function getChildOrderTA3TA4O2T(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputsOf = new bytes[](4);
        childInputsOf[0] = OrderTA3TA4O2TA;
        childInputsOf[1] = bytes("__VARIABLE__tx");
        childInputsOf[2] = _inputs[1];
        childInputsOf[3] = _inputs[2];

        notInputs[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf
        }));

        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("tx");
        forAllSuchThatInputs[2] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        }));
        return types.Property({
            predicateAddress: forAllSuchThatAddress,
            inputs: forAllSuchThatInputs
        });
    }
    /**
     * Gets child of OrderTA3TA4O(OrderTA3TA4O,c_su,maker).
     */
    function getChildOrderTA3TA4O(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {

        bytes[] memory andInputs = new bytes[](2);
        bytes[] memory notInputs0 = new bytes[](1);
        bytes[] memory childInputsOf0 = new bytes[](1);
        childInputsOf0[0] = _inputs[1];

        notInputs0[0] = abi.encode(types.Property({
            predicateAddress: Withdraw,
            inputs: childInputsOf0
        }));

        andInputs[0] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs0
        }));
        bytes[] memory notInputs1 = new bytes[](1);
        bytes[] memory childInputsOf1 = new bytes[](3);
        childInputsOf1[0] = OrderTA3TA4O2T;
        childInputsOf1[1] = _inputs[1];
        childInputsOf1[2] = _inputs[2];

        notInputs1[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf1
        }));

        andInputs[1] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs1
        }));
        return types.Property({
            predicateAddress: andAddress,
            inputs: andInputs
        });
    }
    /**
     * Gets child of OrderTA3TA(OrderTA3TA,c_su,c_amount,maker,tx).
     */
    function getChildOrderTA3TA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        types.Property memory inputProperty1Child3 = abi.decode(inputProperty1.inputs[3], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputsOf0 = new bytes[](2);
            childInputsOf0[0] = abi.encodePacked(inputProperty1.predicateAddress);
            childInputsOf0[1] = swapAddress;

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Equal,
                inputs: childInputsOf0
            }));

        }
        if(challengeInput == 1) {
            bytes[] memory childInputsOf1 = new bytes[](2);
            childInputsOf1[0] = inputProperty1.inputs[1];
            childInputsOf1[1] = _inputs[2];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: IsSameAmount,
                inputs: childInputsOf1
            }));

        }
        if(challengeInput == 2) {
            bytes[] memory childInputsOf2 = new bytes[](2);
            childInputsOf2[0] = inputProperty1Child3.inputs[1];
            childInputsOf2[1] = _inputs[3];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: Equal,
                inputs: childInputsOf2
            }));

        }
        if(challengeInput == 3) {
            bytes[] memory childInputs = new bytes[](3);
            childInputs[0] = OrderTA3TA4O;
            childInputs[1] = _inputs[1];
            childInputs[2] = _inputs[3];
            return getChildOrderTA3TA4O(childInputs, utils.subArray(challengeInputs, 1, challengeInputs.length));
        }
        if(challengeInput == 4) {
            bytes[] memory childInputsOf4 = new bytes[](2);
            childInputsOf4[0] = _inputs[4];
            childInputsOf4[1] = inputProperty1Child3.inputs[0];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: IsValidSignature,
                inputs: childInputsOf4
            }));

        }
        return types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OrderTA3T(OrderTA3T,c_amount,maker,tx).
     */
    function getChildOrderTA3T(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputsOf = new bytes[](5);
        childInputsOf[0] = OrderTA3TA;
        childInputsOf[1] = bytes("__VARIABLE__c_su");
        childInputsOf[2] = _inputs[1];
        childInputsOf[3] = _inputs[2];
        childInputsOf[4] = _inputs[3];

        notInputs[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf
        }));

        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("c_su");
        forAllSuchThatInputs[2] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        }));
        return types.Property({
            predicateAddress: forAllSuchThatAddress,
            inputs: forAllSuchThatInputs
        });
    }
    /**
     * Gets child of OrderTA(OrderTA,min_block_number,b,max_block_number,c_amount,maker,tx).
     */
    function getChildOrderTA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputsOf0 = new bytes[](2);
            childInputsOf0[0] = _inputs[1];
            childInputsOf0[1] = _inputs[2];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: IsLessThan,
                inputs: childInputsOf0
            }));

        }
        if(challengeInput == 1) {
            bytes[] memory childInputsOf1 = new bytes[](2);
            childInputsOf1[0] = _inputs[2];
            childInputsOf1[1] = _inputs[3];

            notInputs[0] = abi.encode(types.Property({
                predicateAddress: IsLessThan,
                inputs: childInputsOf1
            }));

        }
        if(challengeInput == 2) {
            bytes[] memory childInputs = new bytes[](4);
            childInputs[0] = OrderTA3T;
            childInputs[1] = _inputs[4];
            childInputs[2] = _inputs[5];
            childInputs[3] = _inputs[6];
            return getChildOrderTA3T(childInputs, utils.subArray(challengeInputs, 1, challengeInputs.length));
        }
        return types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
    /**
     * Gets child of OrderT(OrderT,maker,c_token,c_amount,min_block_number,max_block_number,tx).
     */
    function getChildOrderT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        bytes[] memory childInputsOf = new bytes[](7);
        childInputsOf[0] = OrderTA;
        childInputsOf[1] = _inputs[4];
        childInputsOf[2] = bytes("__VARIABLE__b");
        childInputsOf[3] = _inputs[5];
        childInputsOf[4] = _inputs[3];
        childInputsOf[5] = _inputs[1];
        childInputsOf[6] = _inputs[6];

        notInputs[0] = abi.encode(types.Property({
            predicateAddress: address(this),
            inputs: childInputsOf
        }));

        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("b");
        forAllSuchThatInputs[2] = abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        }));
        return types.Property({
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
        require(AtomicPredicate(Equal).decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[0];
        childInputs1[1] = inputProperty2.inputs[0];
        require(AtomicPredicate(Equal).decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](2);
        childInputs2[0] = inputProperty1.inputs[1];
        childInputs2[1] = inputProperty2.inputs[1];
        require(AtomicPredicate(IsContained).decide(childInputs2));


        bytes[] memory childInputs3 = new bytes[](2);
        childInputs3[0] = inputProperty1.inputs[2];
        childInputs3[1] = inputProperty2.inputs[2];
        require(AtomicPredicate(Equal).decide(childInputs3));


        bytes[] memory childInputs4 = new bytes[](2);
        childInputs4[0] = _inputs[1];
        childInputs4[1] = _inputs[3];
        require(AtomicPredicate(IsValidSignature).decide(childInputs4));

        return true;
    }
    /**
     * Decides OrderTA3TA4O2T(OrderTA3TA4O2T,c_su,maker).
     */
    function decideOrderTA3TA4O2T(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](4);
        childInputs[0] = OrderTA3TA4O2TA;
        childInputs[1] = _witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        require(decideOrderTA3TA4O2TA(childInputs,  utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
    /**
     * Decides OrderTA3TA4O(OrderTA3TA4O,c_su,maker).
     */
    function decideOrderTA3TA4O(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check Or
        uint256 orIndex = abi.decode(_witness[0], (uint256));
        if(orIndex == 0) {

            bytes[] memory childInputs0 = new bytes[](1);
            childInputs0[0] = _inputs[1];
            require(AtomicPredicate(Withdraw).decide(childInputs0));

        }
        if(orIndex == 1) {
            bytes[] memory childInputs1 = new bytes[](3);
            childInputs1[0] = OrderTA3TA4O2T;
            childInputs1[1] = _inputs[1];
            childInputs1[2] = _inputs[2];
            require(decideOrderTA3TA4O2T(childInputs1,  utils.subArray(_witness, 1, _witness.length)));

        }
        return true;
    }
    /**
     * Decides OrderTA3TA(OrderTA3TA,c_su,c_amount,maker,tx).
     */
    function decideOrderTA3TA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        types.Property memory inputProperty1Child3 = abi.decode(inputProperty1.inputs[3], (types.Property));
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](2);
        childInputs0[0] = abi.encodePacked(inputProperty1.predicateAddress);
        childInputs0[1] = swapAddress;
        require(AtomicPredicate(Equal).decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = inputProperty1.inputs[1];
        childInputs1[1] = _inputs[2];
        require(AtomicPredicate(IsSameAmount).decide(childInputs1));


        bytes[] memory childInputs2 = new bytes[](2);
        childInputs2[0] = inputProperty1Child3.inputs[1];
        childInputs2[1] = _inputs[3];
        require(AtomicPredicate(Equal).decide(childInputs2));

            bytes[] memory childInputs3 = new bytes[](3);
        childInputs3[0] = OrderTA3TA4O;
        childInputs3[1] = _inputs[1];
        childInputs3[2] = _inputs[3];
        require(decideOrderTA3TA4O(childInputs3,  utils.subArray(_witness, 1, _witness.length)));


        bytes[] memory childInputs4 = new bytes[](2);
        childInputs4[0] = _inputs[4];
        childInputs4[1] = inputProperty1Child3.inputs[0];
        require(AtomicPredicate(IsValidSignature).decide(childInputs4));

        return true;
    }
    /**
     * Decides OrderTA3T(OrderTA3T,c_amount,maker,tx).
     */
    function decideOrderTA3T(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](5);
        childInputs[0] = OrderTA3TA;
        childInputs[1] = _witness[0];
        childInputs[2] = _inputs[1];
        childInputs[3] = _inputs[2];
        childInputs[4] = _inputs[3];
        require(decideOrderTA3TA(childInputs,  utils.subArray(_witness, 1, _witness.length)));

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
        require(AtomicPredicate(IsLessThan).decide(childInputs0));


        bytes[] memory childInputs1 = new bytes[](2);
        childInputs1[0] = _inputs[2];
        childInputs1[1] = _inputs[3];
        require(AtomicPredicate(IsLessThan).decide(childInputs1));

            bytes[] memory childInputs2 = new bytes[](4);
        childInputs2[0] = OrderTA3T;
        childInputs2[1] = _inputs[4];
        childInputs2[2] = _inputs[5];
        childInputs2[3] = _inputs[6];
        require(decideOrderTA3T(childInputs2,  utils.subArray(_witness, 1, _witness.length)));

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
        childInputs[2] = _witness[0];
        childInputs[3] = _inputs[5];
        childInputs[4] = _inputs[3];
        childInputs[5] = _inputs[1];
        childInputs[6] = _inputs[6];
        require(decideOrderTA(childInputs,  utils.subArray(_witness, 1, _witness.length)));

        return true;
    }

}

