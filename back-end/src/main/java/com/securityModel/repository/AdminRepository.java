package com.securityModel.repository;

import com.securityModel.models.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Administrateur,Long> {
}
