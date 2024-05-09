package com.securityModel.service.IMPL;

import com.securityModel.models.Employee;
import com.securityModel.payload.request.UpdateEmployeeRequest;
import com.securityModel.repository.EmployeeRepository;
import com.securityModel.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class EmployeeServiceIMPL implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;
    @Override
    public Employee create(Employee entity) {
        return employeeRepository.save(entity);
    }

    @Override
    public List<Employee> getall() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getbyId(Long id) {
        return employeeRepository.findById(id).orElseThrow(()->new RuntimeException("id not found"));
    }

    @Override
    public Employee update(Employee entity) {
        return employeeRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }


    @Override
    public Employee updateEmployeeDetails(Long id, UpdateEmployeeRequest updateRequest) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Now, update the existing employee with values from the updateRequest
        // Check for null to avoid overwriting existing values with null
        if (updateRequest.getFirstname() != null) {
            existingEmployee.setFirstname(updateRequest.getFirstname());
        }
        if (updateRequest.getLastname() != null) {
            existingEmployee.setLastname(updateRequest.getLastname());
        }
        if (updateRequest.getAddress() != null) {
            existingEmployee.setAddress(updateRequest.getAddress());
        }
        if (updateRequest.getDepartment() != null) {
            existingEmployee.setDepartment(updateRequest.getDepartment());
        }
        if (updateRequest.getDate_birth() != null) {
            existingEmployee.setDate_birth(updateRequest.getDate_birth());
        }
        if (updateRequest.getJob() != null) {
            existingEmployee.setJob(updateRequest.getJob());
        }
        if (updateRequest.getHire_date() != null) {
            existingEmployee.setHire_date(updateRequest.getHire_date());
        }
        if (updateRequest.getSalary() != 0.0) {
            existingEmployee.setSalary(updateRequest.getSalary());
        }
        if (updateRequest.getId_card() != null) {
            existingEmployee.setId_card(updateRequest.getId_card());
        }
        if (updateRequest.getPhone() != null) {
            existingEmployee.setPhone(updateRequest.getPhone());
        }
        // Assuming the image is handled elsewhere or you're setting the image path directly
        if (updateRequest.getImage() != null) {
            existingEmployee.setImage(updateRequest.getImage());
        }

        // Save the updated employee back to the repository
        return employeeRepository.save(existingEmployee);
    }


    @Override
    public boolean existsById(Long id) {
        return employeeRepository.existsById(id);
    }

    @Override
    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

    }
}
