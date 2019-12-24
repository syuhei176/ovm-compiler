export default `pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import {DataTypes as types} from "ovm-contracts/DataTypes.sol";

contract Utils {
    function bytesToAddress(bytes memory addressBytes)
        public
        pure
        returns (address addr)
    {
        assembly {
            addr := mload(add(addressBytes, 20))
        }
    }

    function bytesToBytes32(bytes memory source)
        public
        pure
        returns (bytes32 result)
    {
        if (source.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytesToUint(bytes memory source)
        public
        pure
        returns (uint256 result)
    {
        require(source.length >= 32);
        assembly {
            result := mload(add(source, 0x20))
        }
    }

    function getPropertyId(types.Property memory _property)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(_property));
    }

    function isPlaceholder(bytes memory target) public pure returns (bool) {
        return
            keccak256(subBytes(target, 0, 1)) ==
            keccak256(bytes("V"));
    }

    function isLabel(bytes memory target) public pure returns (bool) {
        return
            keccak256(subBytes(target, 0, 1)) ==
            keccak256(bytes("L"));
    }

    function isPrimitive(bytes memory target) public pure returns (bool) {
        return
            keccak256(subBytes(target, 0, 1)) ==
            keccak256(bytes("P"));
    }

    function getInputValue(bytes memory target)
        public
        pure
        returns (bytes memory)
    {
        return subBytes(target, 1, target.length);
    }

    function subBytes(bytes memory target, uint256 startIndex, uint256 endIndex)
        private
        pure
        returns (bytes memory)
    {
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = target[i];
        }
        return result;
    }

    function subArray(
        bytes[] memory target,
        uint256 startIndex,
        uint256 endIndex
    ) public pure returns (bytes[] memory) {
        bytes[] memory result = new bytes[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = target[i];
        }
        return result;
    }
}
`
