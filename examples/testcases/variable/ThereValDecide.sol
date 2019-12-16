    /**
     * Decides ThereValTestT(ThereValTestT).
     */
    function decideThereValTestT(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // check ThereExistsSuchThat
        bytes[] memory childInputs = new bytes[](0);

        require(adjudicationContract.isDecided(challengeInput));

        return true;
    }
