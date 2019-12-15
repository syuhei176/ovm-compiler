    /**
     * Gets child of BindAndTestA().
     */
    function getChildBindAndTestA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        types.Property memory inputProperty1 = abi.decode(_inputs[1], (types.Property));
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[0];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Foo,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = inputProperty1.inputs[1];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Bar,
                inputs: childInputs
            }));
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
