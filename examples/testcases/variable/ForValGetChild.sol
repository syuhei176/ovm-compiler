    /**
     * Gets child of ForValTestF().
     */
    function getChildForValTestF(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory quantifierInputs = new bytes[](2);
        quantifierInputs[0] = _inputs[1];
        quantifierInputs[1] = challengeInputs[0];
        require(AtomicPredicate(A).decide(quantifierInputs));
        bytes[] memory notInputs = new bytes[](1);
        notInputs[0] = challengeInput
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
