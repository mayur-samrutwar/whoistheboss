// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title WITB Contest
 * @notice A daily contest system where users stake ETH to participate and winners claim prizes
 * @dev Implements gas-optimized winner tracking
 */
contract WITBContest is Ownable, ReentrancyGuard, Pausable {
    // Constants
    uint256 public constant STAKE_AMOUNT = 0.01 ether;
    uint256 public constant PRIZE_AMOUNT = 0.05 ether;
    uint256 public constant INITIAL_CONTEST_ID = 19102024;
    
    struct Participant {
        bool hasStaked;
        uint256 score;
        string imageUrl;
    }
    
    struct Contest {
        uint256 contestId;
        bool hasWinnerClaimed;
        address winner;  // Default is address(0)
        address[] participantList;
        mapping(address => Participant) participants;
    }
    
    // State variables
    mapping(uint256 => Contest) public contests;
    uint256 public latestContestId;
    uint256[] private pastContestIds;  // Track past contest IDs for gas-efficient retrieval
    
    // Events
    event ContestCreated(uint256 indexed contestId, uint256 timestamp);
    event ParticipantJoined(uint256 indexed contestId, address indexed participant);
    event ScoreSubmitted(uint256 indexed contestId, address indexed participant, uint256 score);
    event PrizeClaimed(uint256 indexed contestId, address indexed winner, uint256 amount);
    event ContractFunded(address indexed funder, uint256 amount);
    event LatestContestUpdated(uint256 indexed oldContestId, uint256 indexed newContestId, address winner);
    event WinnerUpdated(uint256 indexed contestId, address indexed winner);
    
    // Errors
    error InsufficientStakeAmount();
    error AlreadyParticipated();
    error ContestNotFound();
    error NotStaked();
    error OngoingContest();
    error NotWinner();
    error PrizeAlreadyClaimed();
    error InsufficientContractBalance();
    error InvalidContestId();
    error ContestDateTooOld();
    error FutureContestNotAllowed();
    
    constructor() Ownable(msg.sender) {
        // Initialize with the first contest
        latestContestId = INITIAL_CONTEST_ID;
        contests[INITIAL_CONTEST_ID].contestId = INITIAL_CONTEST_ID;
        contests[INITIAL_CONTEST_ID].hasWinnerClaimed = false;
        contests[INITIAL_CONTEST_ID].winner = address(0);
        
        emit ContestCreated(INITIAL_CONTEST_ID, block.timestamp);
    }
    
    /**
     * @notice Compares two contest IDs (DDMMYYYY format) to determine which is more recent
     * @param contestId1 First contest ID
     * @param contestId2 Second contest ID
     * @return int -1 if contestId1 is earlier, 0 if equal, 1 if contestId1 is later
     */
    function _compareContestDates(uint256 contestId1, uint256 contestId2) private pure returns (int) {
        uint256 year1 = contestId1 % 10000;
        uint256 month1 = (contestId1 % 1000000) / 10000;
        uint256 day1 = contestId1 / 1000000;
        
        uint256 year2 = contestId2 % 10000;
        uint256 month2 = (contestId2 % 1000000) / 10000;
        uint256 day2 = contestId2 / 1000000;
        
        if (year1 < year2) return -1;
        if (year1 > year2) return 1;
        if (month1 < month2) return -1;
        if (month1 > month2) return 1;
        if (day1 < day2) return -1;
        if (day1 > day2) return 1;
        return 0;
    }
    
    /**
     * @notice Determines the winner of a contest based on highest score
     * @param contestId The ID of the contest
     * @return winner The address of the winner
     */
    function _determineWinner(uint256 contestId) private view returns (address winner) {
        Contest storage contest = contests[contestId];
        uint256 highestScore = 0;
        
        for (uint256 i = 0; i < contest.participantList.length; i++) {
            address participant = contest.participantList[i];
            uint256 score = contest.participants[participant].score;
            if (score > highestScore) {
                highestScore = score;
                winner = participant;
            }
        }
        
        return winner;
    }
    
    /**
     * @notice Validates if the contest date is valid for participation
     * @param contestId The contest ID to validate
     */
    function _validateContestDate(uint256 contestId) private view {
        int comparison = _compareContestDates(contestId, latestContestId);
        if (comparison < 0) {
            revert ContestDateTooOld();
        }
        if (comparison > 1) {  // More than 1 day in the future
            revert FutureContestNotAllowed();
        }
    }
    
    /**
     * @notice Creates a new contest if the date is valid and contest doesn't exist
     * @param contestId The ID of the contest in DDMMYYYY format
     */
    function _createContestIfNotExists(uint256 contestId) private {
        _validateContestDate(contestId);
        
        if (contests[contestId].contestId == 0) {
            // Update winner of the previous contest before creating new one
            if (contestId > latestContestId) {
                address previousWinner = _determineWinner(latestContestId);
                contests[latestContestId].winner = previousWinner;
                pastContestIds.push(latestContestId);  // Add to past contests array
                emit WinnerUpdated(latestContestId, previousWinner);
            }
            
            contests[contestId].contestId = contestId;
            contests[contestId].hasWinnerClaimed = false;
            contests[contestId].winner = address(0);
            
            // Update latestContestId if new contest is more recent
            if (_compareContestDates(contestId, latestContestId) > 0) {
                uint256 oldContestId = latestContestId;
                latestContestId = contestId;
                emit LatestContestUpdated(oldContestId, contestId, contests[oldContestId].winner);
            }
            
            emit ContestCreated(contestId, block.timestamp);
        }
    }
    
    /**
     * @notice Validates the contest ID format (DDMMYYYY)
     * @param contestId The ID to validate
     */
    function _validateContestId(uint256 contestId) private pure {
        uint256 day = contestId / 1000000;
        uint256 month = (contestId % 1000000) / 10000;
        uint256 year = contestId % 10000;
        
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2024) {
            revert InvalidContestId();
        }
        
        // Additional validation for months with 30 days
        if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) {
            revert InvalidContestId();
        }
        
        // February validation (including leap year)
        if (month == 2) {
            bool isLeapYear = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
            if ((isLeapYear && day > 29) || (!isLeapYear && day > 28)) {
                revert InvalidContestId();
            }
        }
    }
    
    /**
     * @notice Gets all winners from past contests
     * @return contestIds Array of all past contest IDs
     * @return winners Array of winner addresses corresponding to the contest IDs
     */
    function getAllWinners() 
        external 
        view 
        returns (uint256[] memory contestIds, address[] memory winners) 
    {
        uint256 length = pastContestIds.length;
        contestIds = new uint256[](length);
        winners = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 contestId = pastContestIds[i];
            contestIds[i] = contestId;
            winners[i] = contests[contestId].winner;
        }
        
        return (contestIds, winners);
    }
    
    /**
     * @notice Allows users to participate in a contest by staking ETH
     * @param contestId The ID of the contest to participate in (DDMMYYYY format)
     */
    function participate(uint256 contestId) external payable nonReentrant whenNotPaused {
        if (msg.value != STAKE_AMOUNT) {
            revert InsufficientStakeAmount();
        }
        
        _validateContestId(contestId);
        _createContestIfNotExists(contestId);
        
        Contest storage currentContest = contests[contestId];
        if (currentContest.participants[msg.sender].hasStaked) {
            revert AlreadyParticipated();
        }
        
        currentContest.participants[msg.sender].hasStaked = true;
        currentContest.participants[msg.sender].score = 0;
        currentContest.participants[msg.sender].imageUrl = "";
        currentContest.participantList.push(msg.sender);
        
        emit ParticipantJoined(contestId, msg.sender);
    }
    
    /**
     * @notice Allows participants to submit their score and image URL for a contest
     * @param contestId The ID of the contest
     * @param score The participant's score
     * @param imageUrl The URL of the participant's image
     */
    function submitScore(uint256 contestId, uint256 score, string calldata imageUrl) external whenNotPaused {
        Contest storage contest = contests[contestId];
        if (!contest.participants[msg.sender].hasStaked) {
            revert NotStaked();
        }
        
        contest.participants[msg.sender].score = score;
        contest.participants[msg.sender].imageUrl = imageUrl;
        
        emit ScoreSubmitted(contestId, msg.sender, score);
    }
    
    /**
     * @notice Allows winners to claim their prize for past contests
     * @param contestId The ID of the contest to claim the prize for
     */
    function claimPrizeForContest(uint256 contestId) external nonReentrant whenNotPaused {
        if (contestId >= latestContestId) {
            revert OngoingContest();
        }
        
        Contest storage contest = contests[contestId];
        if (contest.contestId == 0) {
            revert ContestNotFound();
        }
        
        if (contest.hasWinnerClaimed) {
            revert PrizeAlreadyClaimed();
        }
        
        if (contest.winner != msg.sender) {
            revert NotWinner();
        }
        
        if (address(this).balance < PRIZE_AMOUNT) {
            revert InsufficientContractBalance();
        }
        
        contest.hasWinnerClaimed = true;
        
        (bool success, ) = payable(contest.winner).call{value: PRIZE_AMOUNT}("");
        require(success, "Prize transfer failed");
        
        emit PrizeClaimed(contestId, contest.winner, PRIZE_AMOUNT);
    }
    
    /**
     * @notice Allows contract owner to withdraw all funds
     */
    function claimFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to claim");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Fund transfer failed");
    }
    
    /**
     * @notice Allows contract owner to fund the contract
     */
    function fundContract() external payable onlyOwner {
        emit ContractFunded(msg.sender, msg.value);
    }
    
    /**
     * @notice Allows owner to pause the contract in case of emergency
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Allows owner to unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice Gets participant details for a specific contest
     * @param contestId The ID of the contest
     * @param participant The address of the participant
     */
    function getParticipant(uint256 contestId, address participant) 
        external 
        view 
        returns (bool hasStaked, uint256 score, string memory imageUrl) 
    {
        Contest storage contest = contests[contestId];
        Participant storage p = contest.participants[participant];
        return (p.hasStaked, p.score, p.imageUrl);
    }

    /**
     * @notice Checks if a contest exists
     * @param contestId The ID of the contest to check
     * @return bool True if the contest exists
     */
    function contestExists(uint256 contestId) external view returns (bool) {
        return contests[contestId].contestId != 0;
    }
}