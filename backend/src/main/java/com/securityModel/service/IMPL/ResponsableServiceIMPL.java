package com.securityModel.service.IMPL;

import com.securityModel.models.Responsable;
import com.securityModel.payload.request.UpdateEmployeeRequest;
import com.securityModel.repository.ResponsableRepository;

import com.securityModel.service.ResponsableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponsableServiceIMPL implements ResponsableService {

    @Autowired
    private ResponsableRepository responsableRepository;


    @Override
    public Responsable create(Responsable entity) {
        return responsableRepository.save(entity);
    }

    @Override
    public List<Responsable> getall() {
        return responsableRepository.findAll();
    }

    @Override
    public Responsable getbyId(Long id) {
        return responsableRepository.findById(id).orElseThrow(() -> new RuntimeException("id not found"));
    }

    @Override
    public Responsable update(Responsable entity) {
        return responsableRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        responsableRepository.deleteById(id);
    }


    @Override
    public Responsable updateResponsableDetails(Long id, UpdateEmployeeRequest updateRequest) {
        Responsable existingRes = responsableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Now, update the existing employee with values from the updateRequest
        // Check for null to avoid overwriting existing values with null
        if (updateRequest.getFirstname() != null) {
            existingRes.setFirstname(updateRequest.getFirstname());
        }
        if (updateRequest.getLastname() != null) {
            existingRes.setLastname(updateRequest.getLastname());
        }
        if (updateRequest.getAddress() != null) {
            existingRes.setAddress(updateRequest.getAddress());
        }
        if (updateRequest.getDepartment() != null) {
            existingRes.setDepartment(updateRequest.getDepartment());
        }
        if (updateRequest.getDate_birth() != null) {
            existingRes.setDate_birth(updateRequest.getDate_birth());
        }
        if (updateRequest.getJob() != null) {
            existingRes.setJob(updateRequest.getJob());
        }
        if (updateRequest.getHire_date() != null) {
            existingRes.setHire_date(updateRequest.getHire_date());
        }
        if (updateRequest.getSalary() != 0.0) {
            existingRes.setSalary(updateRequest.getSalary());
        }
        if (updateRequest.getId_card() != null) {
            existingRes.setId_card(updateRequest.getId_card());
        }
        if (updateRequest.getPhone() != null) {
            existingRes.setPhone(updateRequest.getPhone());
        }
        // Assuming the image is handled elsewhere or you're setting the image path directly
        if (updateRequest.getImage() != null) {
            existingRes.setImage(updateRequest.getImage());
        }

        // Save the updated employee back to the repository
        return responsableRepository.save(existingRes);
    }

    @Override
    public boolean existsById(Long id) {
        return responsableRepository.existsById(id);
    }

    @Override
    public Responsable getById(Long id) {
        return responsableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("responsable not found with id: " + id));
    }
}
