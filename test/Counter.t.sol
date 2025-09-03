// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {MyToken} from "../src/Counter.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        token = new MyToken(owner);
    }

    // Basic ERC721 tests
    function test_Constructor() public {
        assertEq(token.name(), "MyToken");
        assertEq(token.symbol(), "MTK");
        assertEq(token.owner(), owner);
    }

    function test_SafeMint() public {
        uint256 tokenId = 1;
        
        token.safeMint(user1, tokenId);
        
        assertEq(token.ownerOf(tokenId), user1);
        assertEq(token.balanceOf(user1), 1);
    }

    function test_SafeMintOnlyOwner() public {
        uint256 tokenId = 1;
        
        vm.prank(user1);
        vm.expectRevert();
        token.safeMint(user2, tokenId);
    }

    function test_Pause() public {
        token.pause();
        assertTrue(token.paused());
    }

    function test_Unpause() public {
        token.pause();
        token.unpause();
        assertFalse(token.paused());
    }

    function test_PauseOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        token.pause();
    }

    function test_UnpauseOnlyOwner() public {
        token.pause();
        
        vm.prank(user1);
        vm.expectRevert();
        token.unpause();
    }

    function test_TransferWhenPaused() public {
        uint256 tokenId = 1;
        token.safeMint(user1, tokenId);
        
        token.pause();
        
        vm.prank(user1);
        vm.expectRevert();
        token.transferFrom(user1, user2, tokenId);
    }

    function test_Burn() public {
        uint256 tokenId = 1;
        token.safeMint(user1, tokenId);
        
        vm.prank(user1);
        token.burn(tokenId);
        
        vm.expectRevert();
        token.ownerOf(tokenId);
    }

    // Fuzz tests
    function testFuzz_SafeMint(uint256 tokenId) public {
        vm.assume(tokenId > 0); // Avoid tokenId 0 for simplicity
        
        token.safeMint(user1, tokenId);
        
        assertEq(token.ownerOf(tokenId), user1);
        assertEq(token.balanceOf(user1), 1);
    }

    function testFuzz_MultipleMints(uint256[] memory tokenIds) public {
        vm.assume(tokenIds.length <= 10); // Limit array size
        vm.assume(tokenIds.length > 0); // Ensure we have at least one token
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            vm.assume(tokenIds[i] > 0); // Avoid tokenId 0
            vm.assume(tokenIds[i] < type(uint256).max); // Avoid max uint256
        }
        
        // Check for duplicates and avoid them
        for (uint256 i = 0; i < tokenIds.length; i++) {
            for (uint256 j = i + 1; j < tokenIds.length; j++) {
                vm.assume(tokenIds[i] != tokenIds[j]);
            }
        }
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            token.safeMint(user1, tokenIds[i]);
        }
        
        assertEq(token.balanceOf(user1), tokenIds.length);
    }

    // Integration tests
    function test_CompleteWorkflow() public {
        uint256 tokenId1 = 1;
        uint256 tokenId2 = 2;
        
        // Mint tokens
        token.safeMint(user1, tokenId1);
        token.safeMint(user1, tokenId2);
        
        assertEq(token.balanceOf(user1), 2);
        
        // Transfer one token
        vm.prank(user1);
        token.transferFrom(user1, user2, tokenId1);
        
        assertEq(token.balanceOf(user1), 1);
        assertEq(token.balanceOf(user2), 1);
        assertEq(token.ownerOf(tokenId1), user2);
        assertEq(token.ownerOf(tokenId2), user1);
        
        // Burn remaining token
        vm.prank(user1);
        token.burn(tokenId2);
        
        assertEq(token.balanceOf(user1), 0);
    }

    function test_PauseUnpauseWorkflow() public {
        uint256 tokenId = 1;
        token.safeMint(user1, tokenId);
        
        // Pause and verify transfers are blocked
        token.pause();
        assertTrue(token.paused());
        
        vm.prank(user1);
        vm.expectRevert();
        token.transferFrom(user1, user2, tokenId);
        
        // Unpause and verify transfers work again
        token.unpause();
        assertFalse(token.paused());
        
        vm.prank(user1);
        token.transferFrom(user1, user2, tokenId);
        
        assertEq(token.ownerOf(tokenId), user2);
    }
}
