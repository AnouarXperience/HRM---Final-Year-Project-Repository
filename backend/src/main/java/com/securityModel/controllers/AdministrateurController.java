package com.securityModel.controllers;

import com.securityModel.models.Administrateur;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;
import com.securityModel.service.AdminService;
import com.securityModel.utils.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/administrateur")
public class AdministrateurController {
    @Autowired
    private AdminService adminService;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    EmailService emailService;
    @Autowired
    JavaMailSender javaMailSender;

    @GetMapping("/all")
    public List<Administrateur> ListAdministrateur(){
        return adminService.getall();
    }
    @PostMapping("/save")
    public Administrateur saveAdministrateur(@RequestBody Administrateur a){
        return adminService.create(a);
    }
    @GetMapping("getone/{id}")
    public Administrateur getone(@PathVariable Long id){
        return adminService.getbyId(id);
    }
    @PutMapping("updatec/{idc}")
    public Administrateur updateAdministrateur(@PathVariable Long idc , @RequestBody Administrateur a){
        a.setId(idc);
        return  adminService.update(a);
    }
    @DeleteMapping("delet/{id}")
    public HashMap<String,String> deleteAdministrateur(@PathVariable Long id) {

        HashMap message = new HashMap();
        try {
            adminService.delete(id);
            message.put("etat", "admistrateur delet");
            return message;
        } catch (Exception e) {
            message.put("etat", "Error");
            return message;
        }
    }















}
