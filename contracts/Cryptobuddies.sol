// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract Cryptobuddies is ERC721("Cryptobuddies", "CBUDDY") {
    uint256 tokenId;
    post[] public posts;

    struct post{
        string name;
        string description;
        uint256 likes;
        string[] comments;
        address fromAddress;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name":', '"', posts[_tokenId].name, '",'  '"description":' , '"',  posts[_tokenId].description, '"', ',' ,
            
            '"attributes":', '[', '{', '"trait_type":', '"likes",' , '"value":', Strings.toString(posts[_tokenId].likes), '}', ']' , '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function writepost(string memory prefName, string memory prefDesc) public {
        _safeMint(msg.sender, tokenId);
        posts.push(post({
            name: prefName,
            description: prefDesc,
            likes: 0,
            comments: new string[](0),
            fromAddress: msg.sender
        }));
        tokenId = tokenId + 1;
    }

    function like(uint postIndex) public {
        posts[postIndex].likes += 1;
    }

    function addComment(uint256 postIndex, string memory prefComments) public {
        posts[postIndex].comments.push(prefComments);
    }

    function getAllposts() public view returns(post[] memory) {
        return posts;
    }
}