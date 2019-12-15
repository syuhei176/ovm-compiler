    /**
     * Decides ThereValTestT(ThereValTestT,a).
     */
    function decideThereValTestT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory quantifierInputs = new bytes[](1);
        quantifierInputs[0] = _witness[0];
        require(AtomicPredicate(B).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](1);
        childInputs[0] = witness[0];

        types.Property memory inputPredicateProperty = abi.decode(_inputs[1], (types.Property));
        bytes[] memory childInputs = new bytes[](inputPredicateProperty.inputs.length + 1);
        for(uint256 i = 0;i < inputPredicateProperty.inputs.length;i++) {
            childInputs[i] = inputPredicateProperty.inputs[i];
        }
        childInputs[stateObject.inputs.length] = _inputs[];
        require(CompiledPredicate(inputPredicateProperty.predicateAddress).decide(childInputs, Utils.subArray(_witness, 1, _witness.length)));

        return true;
    }
