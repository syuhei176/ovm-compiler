    /**
     * Decides ThereValTestT(ThereValTestT).
     */
    function decideThereValTestT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory quantifierInputs = new bytes[](1);
        quantifierInputs[0] = _witness[0];
        require(AtomicPredicate(A).decide(quantifierInputs));
        bytes[] memory childInputs = new bytes[](0);

        require(adjudicationContract.isDecided(challengeInput));

        return true;
    }
