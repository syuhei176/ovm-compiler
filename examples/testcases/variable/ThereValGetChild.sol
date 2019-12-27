    /**
     * Gets child of ThereValTestT(ThereValTestT).
     */
    function getChildThereValTestT(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        bytes[] memory forAllSuchThatInputs = new bytes[](3);
        bytes[] memory notInputs = new bytes[](1);
        notInputs[0] = utils.prefixPrimitive(challengeInput);
        forAllSuchThatInputs[0] = bytes("");
        forAllSuchThatInputs[1] = bytes("a");
        forAllSuchThatInputs[2] = utils.prefixPrimitive(abi.encode(types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        })));
        return types.Property({
            predicateAddress: forAllSuchThatAddress,
            inputs: forAllSuchThatInputs
        });
    }
