package com.securityModel.service;

import com.securityModel.models.Employee;
import com.securityModel.payload.request.UpdateEmployeeRequest;

public interface EmployeeService extends GenericService<Employee> {
    Employee updateEmployeeDetails(Long id, UpdateEmployeeRequest updateRequest);
    boolean existsById(Long id);

    Employee getById(Long id);
}
