package com.securityModel.service.IMPL;

import com.securityModel.models.Responsable;
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
        return null;
    }

    @Override
    public Responsable getbyId(Long id) {
        return null;
    }

    @Override
    public Responsable update(Responsable entity) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
