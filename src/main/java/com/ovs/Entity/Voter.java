package com.ovs.Entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Voter {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String password;

    private String role = "USER";

    @ManyToMany
    @JoinTable(
            name = "voter_poll",
            joinColumns = @JoinColumn(name = "voter_id"),
            inverseJoinColumns = @JoinColumn(name = "poll_id")
    )
    private Set<Poll> votedPolls = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "voter_option",
            joinColumns = @JoinColumn(name = "voter_id"),
            inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private Set<Option> votedOptions = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Poll> getVotedPolls() {
        return votedPolls;
    }

    public void setVotedPolls(Set<Poll> votedPolls) {
        this.votedPolls = votedPolls;
    }

    public Set<Option> getVotedOptions() {
        return votedOptions;
    }

    public void setVotedOptions(Set<Option> votedOptions) {
        this.votedOptions = votedOptions;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
