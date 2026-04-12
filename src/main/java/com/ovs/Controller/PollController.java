package com.ovs.Controller;

import com.ovs.Entity.Option;
import com.ovs.Entity.Poll;
import com.ovs.Services.PollService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polls")
public class PollController {

    private final PollService pollService;

    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    // === Admin Endpoints ===

    // Create a new poll
    @PostMapping
    public Poll createPoll(@RequestBody Poll poll) {
        return pollService.createPoll(poll);
    }

    // Add a new option to an existing poll
    @PostMapping("/{pollId}/options")
    public Poll addOption(@PathVariable Long pollId, @RequestBody Option option) {
        return pollService.addOptionToPoll(pollId, option);
    }

    // Delete a poll
    @DeleteMapping("/{pollId}")
    public void deletePoll(@PathVariable Long pollId) {
        pollService.deletePoll(pollId);
    }

    // === User Endpoints ===

    // Get all polls
    @GetMapping
    public List<Poll> getAllPolls() {
        return pollService.getAllPolls();
    }

    // Get poll details with options
    @GetMapping("/{pollId}")
    public Poll getPollById(@PathVariable Long pollId) {
        return pollService.getPollById(pollId);
    }

    // Vote in a poll
    @PostMapping("/{pollId}/vote")
    public String vote(@PathVariable Long pollId,
                       @RequestParam Long optionId,
                       @RequestParam Long userId) {
        return pollService.vote(pollId, optionId, userId);
    }

    // Get user votes
    @GetMapping("/user-votes/{userId}")
    public Map<String, List<Long>> getUserVotes(@PathVariable Long userId) {
        return pollService.getUserVotes(userId);
    }

    // Get poll results
    @GetMapping("/{pollId}/results")
    public Map<String, Object> getPollResults(@PathVariable Long pollId) {
        return pollService.getPollResults(pollId);
    }

    @ExceptionHandler(RuntimeException.class)
    public org.springframework.http.ResponseEntity<String> handleException(RuntimeException ex) {
        return org.springframework.http.ResponseEntity.badRequest().body(ex.getMessage());
    }
}

