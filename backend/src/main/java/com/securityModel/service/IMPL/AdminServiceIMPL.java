package com.securityModel.service.IMPL;

import com.securityModel.models.Administrateur;
import com.securityModel.repository.AdminRepository;
import com.securityModel.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceIMPL implements AdminService {
   @Autowired
   private AdminRepository adminRepository;
    @Override
    public Administrateur create(Administrateur entity) {
       return adminRepository.save(entity);

    }
    @Override
    public List<Administrateur> getall() {
        return adminRepository.findAll();
    }
    @Override
    public Administrateur getbyId(Long id) {
        return adminRepository.findById(id).orElseThrow(()->new RuntimeException("id not found"));
    }

    @Override
    public Administrateur update(Administrateur entity) {
        return adminRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        adminRepository.deleteById(id);

    }
}
