package com.ovs.Repository;

import com.ovs.Entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Voter, Long> {
    Optional<Voter> findByUsername(String username);

}
