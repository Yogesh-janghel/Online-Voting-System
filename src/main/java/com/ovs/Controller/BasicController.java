package com.ovs.Controller;

import com.ovs.Entity.Candidate;
import com.ovs.Entity.Voter;
import com.ovs.Repository.CandidateRepository;
import com.ovs.Repository.UserRepository;
import com.ovs.Services.votingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BasicController {
    @Autowired
    private votingService votingService;
    @Autowired private CandidateRepository candidateRepo;
    @Autowired private UserRepository userRepo;

    // Register a new User
    @PostMapping("/users")
    public Voter registerUser(@RequestBody Voter voter) {
        return userRepo.save(voter);
    }

    // Add a Candidate (admin)
    @PostMapping("/candidates")
    public Candidate addCandidate(@RequestBody Candidate candidate) {
        return candidateRepo.save(candidate);
    }

    // Cast a vote
    @PostMapping("/vote")
    public String vote(@RequestParam Long userId, @RequestParam Long candidateId) {
        return votingService.castVote(userId, candidateId);
    }

    // View results
    @GetMapping("/results")
    public List<Candidate> results() {
        return votingService.getResults();
    }
}
