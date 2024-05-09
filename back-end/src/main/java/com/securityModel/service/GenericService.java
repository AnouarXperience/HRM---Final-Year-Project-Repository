package com.securityModel.service;

import java.util.List;

public interface GenericService<T>{

    T create(T entity);
    List<T> getall();

    T getbyId(Long id);

    T update(T entity);

    void delete(Long id);

}
