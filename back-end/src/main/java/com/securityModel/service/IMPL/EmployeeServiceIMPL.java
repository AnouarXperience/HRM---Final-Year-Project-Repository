package com.securityModel.service.IMPL;

import com.securityModel.models.Employee;
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
}
