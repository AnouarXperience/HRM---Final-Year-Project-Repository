package com.securityModel.service;

import com.securityModel.models.Responsable;
import com.securityModel.payload.request.UpdateEmployeeRequest;

public interface ResponsableService extends GenericService<Responsable> {

    Responsable updateResponsableDetails(Long id, UpdateEmployeeRequest updateRequest);
    boolean existsById(Long id);

    Responsable getById(Long id);
}
