package com.ovs.Services;

import com.ovs.Entity.Candidate;
import com.ovs.Entity.Voter;
import com.ovs.Repository.CandidateRepository;
import com.ovs.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class votingService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CandidateRepository candidateRepository;

    public String castVote(Long userId, Long candidateId){
        Voter voter = userRepository.findById(userId).orElse(null);
        if(voter == null){
            return "User not found";
        }
        if(voter.getHasVoted()){
            return "User has already voted";
        }
        Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
        if(candidate == null){
            return "Candidate not found";
        }
        candidate.setVotes(candidate.getVotes() + 1);
        voter.setHasVoted(true);
        candidateRepository.save(candidate);
        userRepository.save(voter);
        return "Vote cast successfully";
    }

    public List<Candidate> getResults() {
        return candidateRepository.findAll();
    }

}
