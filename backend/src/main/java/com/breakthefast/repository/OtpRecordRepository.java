package com.breakthefast.repository;

import com.breakthefast.entity.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRecordRepository extends JpaRepository<OtpRecord, UUID> {
    Optional<OtpRecord> findTopByPhoneNumberOrderByCreatedAtDesc(String phoneNumber);
    void deleteByPhoneNumber(String phoneNumber);
}
