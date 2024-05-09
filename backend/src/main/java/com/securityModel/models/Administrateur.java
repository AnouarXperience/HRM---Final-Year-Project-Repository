package com.securityModel.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
public class Administrateur extends User{

    public Administrateur() {
    }

    public Administrateur(String username, String email, String password, String image) {
        super(username, email, password, image);
    }
}
