package com.ovs.Services;

import com.ovs.Entity.Option;
import com.ovs.Entity.Poll;
import com.ovs.Entity.Voter;
import com.ovs.Repository.OptionRepository;
import com.ovs.Repository.PollRepository;
import com.ovs.Repository.VoterRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PollService {

    @Autowired private PollRepository pollRepo;
    @Autowired private OptionRepository optionRepo;
    @Autowired private VoterRepository voterRepo;

    public Poll createPoll(Poll poll) {
        if (poll.getOptions() != null) {
            for (Option option : poll.getOptions()) {
                option.setPoll(poll);
            }
        }
        return pollRepo.save(poll);
    }

    public Poll getPoll(Long pollId) {
        return pollRepo.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
    }

    public String vote(Long pollId, Long optionId, Long userId) {
        Voter voter = voterRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (voter.getVotedPolls().contains(poll)) {
            throw new RuntimeException("User already voted in this poll");
        }

        Option option = optionRepo.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));
        if (!option.getPoll().getId().equals(pollId)) {
            throw new RuntimeException("Option does not belong to this poll");
        }

        option.setVotes(option.getVotes() + 1);
        optionRepo.save(option);

        voter.getVotedPolls().add(poll);
        voter.getVotedOptions().add(option);
        voterRepo.save(voter);

        return "Vote cast successfully";
    }

    public List<Option> getResults(Long pollId) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        return poll.getOptions();
    }

    public List<Poll> getAllPolls() {
        return pollRepo.findAll();
    }

    // Get poll by ID
    public Poll getPollById(Long pollId) {
        return pollRepo.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
    }

    // Add option to a poll
    @Transactional
    public Poll addOptionToPoll(Long pollId, Option option) {
        Poll poll = getPollById(pollId);
        option.setPoll(poll);
        optionRepo.save(option);
        poll.getOptions().add(option);
        return poll;
    }

    @Transactional
    public void deletePoll(Long pollId) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        // Remove references from voters to avoid constraint violations
        List<Voter> voters = voterRepo.findAll();
        for (Voter voter : voters) {
            voter.getVotedPolls().remove(poll);
            voter.getVotedOptions().removeIf(option -> option.getPoll().getId().equals(pollId));
            voterRepo.save(voter);
        }

        pollRepo.delete(poll);
    }

    public Map<String, List<Long>> getUserVotes(Long userId) {
        Voter voter = voterRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, List<Long>> result = new HashMap<>();
        result.put("votedPolls", voter.getVotedPolls().stream().map(Poll::getId).toList());
        result.put("votedOptions", voter.getVotedOptions().stream().map(Option::getId).toList());
        return result;
    }

    // Get poll results
    public Map<String, Object> getPollResults(Long pollId) {
        Poll poll = getPollById(pollId);

        Map<String, Object> result = new HashMap<>();
        result.put("pollId", poll.getId());
        result.put("question", poll.getDescription());

        List<Map<String, Object>> optionsResults = new ArrayList<>();
        for (Option option : poll.getOptions()) {
            Map<String, Object> opt = new HashMap<>();
            opt.put("optionId", option.getId());
            opt.put("text", option.getText());
            opt.put("votes", option.getVotes());
            optionsResults.add(opt);
        }
        result.put("results", optionsResults);

        return result;
    }

}
