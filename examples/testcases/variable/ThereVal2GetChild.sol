    /**
     * Gets child of ThereValTestT().
     */
    function getChildThereValTestT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        types.Property memory inputPredicateProperty = abi.decode(_inputs[1], (types.Property));
        bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
        for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
            childInputs[i] = inputPredicateProperty.inputs[i];
        }
        childInputs[stateObject.inputs.length] = _inputs[];
        notInputs[0] = abi.encode(types.Property({
            predicateAddress: inputPredicateProperty.predicateAddress,
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
