package com.securityModel.controllers;

import com.securityModel.models.ERole;
import com.securityModel.models.Employee;
import com.securityModel.models.Responsable;
import com.securityModel.models.Role;
import com.securityModel.payload.request.SignupRequest;
import com.securityModel.payload.response.MessageResponse;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;

import com.securityModel.service.ResponsableService;
import com.securityModel.utils.EmailService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/responsable")
public class ResponsableController {
    @Autowired
    private ResponsableService responsableService;

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
    public List<Responsable> ListResponsable() {
        return responsableService.getall();
    }

    @PostMapping("/save")
    public Responsable saveEmployee(@RequestBody Responsable R) {
        return responsableService.create(R);
    }

    @GetMapping("getone/{id}")
    public Responsable getone(@PathVariable Long id) {
        return responsableService.getbyId(id);
    }

    @PutMapping("updatec/{idc}")
    public Responsable updateResponsable(@PathVariable Long idR, @RequestBody Responsable R) {
        R.setId(idR);
        return responsableService.update(R);
    }

    @DeleteMapping("delet/{id}")
    public HashMap<String, String> deletResponsable(@PathVariable Long id) {

        HashMap message = new HashMap();
        try {
            responsableService.delete(id);
            message.put("etat", "responsable delete");
            return message;
        } catch (Exception e) {
            message.put("etat", "Error");
            return message;
        }
    }










      @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws MessagingException {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        com.securityModel.models.Responsable responsable = new com.securityModel.models.Responsable(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getNom(), signUpRequest.getPrenom(), signUpRequest.getMatricule(), signUpRequest.getDepartment(),
                signUpRequest.getDesignation(), signUpRequest.getDate_naiss(), signUpRequest.getPost(),  signUpRequest.getDate_embuche() != null ? signUpRequest.getDate_embuche() : LocalDateTime.now(),
                signUpRequest.getSalary(), signUpRequest.getCin(), signUpRequest.getPhone());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        Role modRole = roleRepository.findByName(ERole.ROLE_Responsable)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(modRole);
        responsable.setRoles(roles);
        responsableService.create(responsable);
        return ResponseEntity.ok(new MessageResponse("Responsable registered successfully!,verife votre email for confirme"));
    }


}
