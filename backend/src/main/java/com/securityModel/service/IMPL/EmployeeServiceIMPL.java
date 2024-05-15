package com.securityModel.service.IMPL;

import com.securityModel.models.Employee;
import com.securityModel.payload.request.UpdateEmployeeRequest;
import com.securityModel.repository.EmployeeRepository;
import com.securityModel.repository.RoleRepository;
import com.securityModel.service.EmployeeService;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceIMPL implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Override
    public Employee create(Employee entity) {
        return employeeRepository.save(entity);
    }

    @Override
    public List<Employee> getall() {
        return employeeRepository.findAll();
    }

    public Employee getbyId(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id " + id));
        // Initialize roles to avoid LazyInitializationException
        Hibernate.initialize(employee.getRoles());
        return employee;
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

        // Update properties if they are not null
        Optional.ofNullable(updateRequest.getFirstname()).ifPresent(existingEmployee::setFirstname);
        Optional.ofNullable(updateRequest.getLastname()).ifPresent(existingEmployee::setLastname);
        Optional.ofNullable(updateRequest.getAddress()).ifPresent(existingEmployee::setAddress);
        Optional.ofNullable(updateRequest.getDepartment()).ifPresent(existingEmployee::setDepartment);
        Optional.ofNullable(updateRequest.getDate_birth()).ifPresent(existingEmployee::setDate_birth);
        Optional.ofNullable(updateRequest.getJob()).ifPresent(existingEmployee::setJob);
        Optional.ofNullable(updateRequest.getHire_date()).ifPresent(existingEmployee::setHire_date);
        Optional.ofNullable(updateRequest.getSalary()).ifPresent(salary -> {
            if (salary != 0.0) existingEmployee.setSalary(salary);
        });
        Optional.ofNullable(updateRequest.getId_card()).ifPresent(existingEmployee::setId_card);
        Optional.ofNullable(updateRequest.getPhone()).ifPresent(existingEmployee::setPhone);
        Optional.ofNullable(updateRequest.getImage()).ifPresent(existingEmployee::setImage);



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
