    /**
     * Decides EvalTestA(EvalTestA,a,b).
     */
    function decideEvalTestA(bytes[] memory _inputs, bytes[] memory _witness) public view returns (bool) {
        // And logical connective

        bytes[] memory childInputs0 = new bytes[](1);
        childInputs0[0] = _inputs[1];
        require(Foo.decide(childInputs0));


        require(adjudicationContract.isDecided(_inputs[2]));

        return true;
    }
