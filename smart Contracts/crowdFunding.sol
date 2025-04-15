// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract crowdFunding{
    address public oowner;
    constructor (){
        oowner=msg.sender;
    }

    function getOwner() public view returns (address){
        return oowner;
    }
    struct Campaign{
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping (uint => Campaign) public campaigns;

    uint256 public numberOfCampaigns=0;

    function createCampaign(address _owner,string memory _title,string memory _description, uint256 _target,uint256 _deadline, string memory _image) public returns (uint256){
        Campaign storage campaign=campaigns[numberOfCampaigns];
        require(campaign.deadline<block.timestamp,"deadline should be in future");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target=_target;
        campaign.deadline  = block.timestamp + _deadline ;
        campaign.image    = _image; 
        numberOfCampaigns++;

        return numberOfCampaigns-1;
    }
    
    

    function donateCampaign(uint256 _id)public payable {
        uint256 amount=msg.value;

        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        (bool sent, )=payable (campaign.owner).call{value:amount}("");
        if(sent){
            campaign.amountCollected=campaign.amountCollected+amount;
        }

    }

    function getDonators(uint256 _id)view public returns (address[]memory,uint256[] memory) {
        return (campaigns[_id].donators,campaigns[_id].donations);
    }

    function getCampaigns() public  view returns (Campaign[] memory){
        Campaign[] memory allCmapaigns=new Campaign[](numberOfCampaigns);

        for(uint i=0;i<numberOfCampaigns;i++){
            Campaign storage item=campaigns[i];
            allCmapaigns[i]=item;
        }
        return allCmapaigns;

    }

}