    /**
     * Gets child of Bind2TestA(Bind2TestA,a).
     */
    function getChildBind2TestA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        types.Property memory inputProperty1Child1 = abi.decode(inputProperty1.inputs[1], (types.Property));
        uint256 challengeInput = utils.bytesToUint(challengeInputs[0]);
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputsOf0 = new bytes[](1);
            childInputsOf0[0] = inputProperty1.inputs[0];

            notInputs[0] = utils.prefixPrimitive(abi.encode(types.Property({
                predicateAddress: Foo,
                inputs: childInputsOf0
            })));

        }
        if(challengeInput == 1) {
            bytes[] memory childInputsOf1 = new bytes[](1);
            childInputsOf1[0] = inputProperty1Child1.inputs[2];

            notInputs[0] = utils.prefixPrimitive(abi.encode(types.Property({
                predicateAddress: Bar,
                inputs: childInputsOf1
            })));

        }
        return types.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
