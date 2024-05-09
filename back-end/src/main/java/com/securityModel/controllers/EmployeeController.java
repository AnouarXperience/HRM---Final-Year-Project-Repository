package com.securityModel.controllers;

import com.securityModel.models.Administrateur;
import com.securityModel.models.ERole;
import com.securityModel.models.Employee;
import com.securityModel.models.Role;
import com.securityModel.payload.request.SignupRequest;
import com.securityModel.payload.response.MessageResponse;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;
import com.securityModel.service.AdminService;
import com.securityModel.service.EmployeeService;
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
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/employee")
public class EmployeeController{
    @Autowired
    private EmployeeService employeeService;
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
    public List<Employee> ListEmployee() {
        return employeeService.getall();
    }

    @PostMapping("/save")
    public Employee saveEmployee(@RequestBody Employee e) {
        return employeeService.create(e);
    }

    @GetMapping("getone/{id}")
    public Employee getone(@PathVariable Long id) {
        return employeeService.getbyId(id);
    }

    @PutMapping("updatec/{idc}")
    public Employee updateEmployee(@PathVariable Long ide, @RequestBody Employee e) {
        e.setId(ide);
        return employeeService.update(e);
    }

    @DeleteMapping("delet/{id}")
    public HashMap<String, String> deletEmployee(@PathVariable Long id) {

        HashMap message = new HashMap();
        try {
            employeeService.delete(id);
            message.put("etat", "employee delete");
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
        Employee employee = new Employee(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getNom(), signUpRequest.getPrenom(), signUpRequest.getMatricule(), signUpRequest.getDepartment(),
                signUpRequest.getDesignation(), signUpRequest.getDate_naiss(), signUpRequest.getPost(),  signUpRequest.getDate_embuche() != null ? signUpRequest.getDate_embuche() : LocalDateTime.now(),
                signUpRequest.getSalary(), signUpRequest.getCin(), signUpRequest.getPhone());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        Role modRole = roleRepository.findByName(ERole.ROLE_Employee)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(modRole);
        employee.setRoles(roles);
        employeeService.create(employee);
        return ResponseEntity.ok(new MessageResponse("Employee registered successfully!,verife votre email for confirme"));
    }

}


















