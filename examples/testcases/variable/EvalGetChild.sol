    /**
     * Gets child of EvalTestA().
     */
    function getChildEvalTestA(bytes[] memory _inputs, bytes[] memory challengeInputs) private returns (types.Property memory) {
        uint256 challengeInput = abi.decode(challengeInputs[0], (uint256));
        bytes[] memory notInputs = new bytes[](1);
        if(challengeInput == 0) {
            bytes[] memory childInputs = new bytes[](2);
            childInputs[0] = _inputs[1];
            notInputs[0] = abi.encode(type.Property({
                predicateAddress: Foo,
                inputs: childInputs
            }));
        }
        if(challengeInput == 1) {
            notInputs[0] = _inputs[2];
        }
        return type.Property({
            predicateAddress: notAddress,
            inputs: notInputs
        });
    }
