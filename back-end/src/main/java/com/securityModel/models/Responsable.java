package com.securityModel.models;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;
import java.util.Date;
@Entity
public class Responsable extends User{
    private String nom;

    private  String prenom;

    private String matricule;

    private String department;

    private String designation;

    private Date date_naiss;

    private String post;

    private LocalDateTime date_embuche;
    private double salary;
    private String cin;
    private String phone;

    public Responsable() {
    }

    public Responsable(String username, String email, String password, String nom, String prenom, String matricule, String department, String designation, Date date_naiss, String post, LocalDateTime date_embuche, double salary, String cin, String phone) {
        super(username, email, password);
        this.nom = nom;
        this.prenom = prenom;
        this.matricule = matricule;
        this.department = department;
        this.designation = designation;
        this.date_naiss = date_naiss;
        this.post = post;
        this.date_embuche = date_embuche;
        this.salary = salary;
        this.cin = cin;
        this.phone = phone;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Date getDate_naiss() {
        return date_naiss;
    }

    public void setDate_naiss(Date date_naiss) {
        this.date_naiss = date_naiss;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public LocalDateTime getDate_embuche() {
        return date_embuche;
    }

    public void setDate_embuche(LocalDateTime date_embuche) {
        this.date_embuche = date_embuche;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
