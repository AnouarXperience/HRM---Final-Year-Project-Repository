package com.securityModel.controllers;

import com.securityModel.models.Administrateur;
import com.securityModel.models.ERole;
import com.securityModel.models.Employee;
import com.securityModel.models.Role;
import com.securityModel.payload.request.SignupRequest;
import com.securityModel.payload.request.UpdateEmployeeRequest;
import com.securityModel.payload.response.MessageResponse;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;
import com.securityModel.service.AdminService;
import com.securityModel.service.EmployeeService;
import com.securityModel.utils.EmailService;

import com.securityModel.utils.StorgeService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

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

    @Autowired
    private StorgeService storgeService;

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


//    @PutMapping("/updateEmp/{id}")
//    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
//        Employee updatedEmployee = employeeService.updateEmployeeDetails(employeeDetails);
//        return ResponseEntity.ok(updatedEmployee);
//    }

    @GetMapping("/exists/username/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        boolean exists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, String>> deleteEmployee(@PathVariable Long id) {
        HashMap<String, String> message = new HashMap<>();
        try {
            employeeService.delete(id);
            message.put("etat", "employee deleted");
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            message.put("etat", "error");
            message.put("message", e.getMessage()); // Fournir plus de détails sur l'erreur
            return ResponseEntity.badRequest().body(message);
        }
    }


//   @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@ModelAttribute SignupRequest signUpRequest, @RequestParam("file") MultipartFile file) throws MessagingException {
//        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
//        }
//
//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
//        }
//       String fileName;
//       try {
//           fileName = storgeService.store(file);
//
//       } catch (Exception e) {
//           return ResponseEntity.badRequest().body(new MessageResponse("Error: File upload failed!"));
//       }
//        // Create new user's account
//        Employee employee = new Employee(signUpRequest.getUsername(), signUpRequest.getEmail(),
//                encoder.encode(signUpRequest.getPassword()),signUpRequest.setImage(fileName),signUpRequest.getNom(), signUpRequest.getPrenom(), signUpRequest.getMatricule(), signUpRequest.getDepartment(),
//                signUpRequest.getDesignation(), signUpRequest.getDate_naiss(), signUpRequest.getPost(),  signUpRequest.getDate_embuche() != null ? signUpRequest.getDate_embuche() : LocalDateTime.now(),
//                signUpRequest.getSalary(), signUpRequest.getCin(), signUpRequest.getPhone());
//
//        Set<String> strRoles = signUpRequest.getRole();
//        Set<Role> roles = new HashSet<>();
//        Role modRole = roleRepository.findByName(ERole.ROLE_Employee)
//                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//        roles.add(modRole);
//        employee.setRoles(roles);
//        employeeService.create(employee);
//       // mail confirmation
//       //user.setConfirm(false);
//       String from ="admin@gmail.com" ;
//       String to = signUpRequest.getEmail();
//       MimeMessage message = javaMailSender.createMimeMessage();
//       MimeMessageHelper helper = new MimeMessageHelper(message);
//       helper.setSubject("Confirmation Registration!");
//       helper.setFrom(from);
//       helper.setTo(to);
//       helper.setText("<HTML><body> <a href=\"http://localhost:8086/users/confirme?email="
//               +signUpRequest.getEmail()+"\">VERIFY</a></body></HTML>",true);
//
//       javaMailSender.send(message);
//
//        return ResponseEntity.ok(new MessageResponse("Employee registered successfully!,verife votre email for confirme"));
//    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@ModelAttribute SignupRequest signUpRequest, @RequestParam("file") MultipartFile file) throws MessagingException {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        String fileName;
        try {
            fileName = storgeService.store(file);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: File upload failed!"));
        }
        // Generate a temporary password
        String tempPassword = RandomStringUtils.randomAlphanumeric(10);

        // Ici, vous devez adapter la création de votre objet Employee selon votre constructeur réel.
        // La ligne suivante suppose que vous avez un setter pour 'image' dans votre objet Employee ou un constructeur adapté.
        Employee employee = new Employee(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(tempPassword),fileName, signUpRequest.getFirstname(), signUpRequest.getLastname(), signUpRequest.getAddress(), signUpRequest.getDepartment(),signUpRequest.getDate_birth(), signUpRequest.getJob(),  signUpRequest.getHire_date(),
                signUpRequest.getSalary(), signUpRequest.getId_card(), signUpRequest.getPhone());

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_Employee)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        employee.setRoles(roles);

        employeeService.create(employee);
// Send confirmation email with temporary password
// Prepare and send the confirmation email
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setSubject("Please confirm your account to join our family and gain access to our services");

// Set sender name and email address
        helper.setFrom("DIGID HR Department <no-reply@digid.com>");

        helper.setTo(signUpRequest.getEmail());
        helper.setText("<HTML><BODY>" +
                "<H2>Welcome to DIGID! We're thrilled to have you join our family.!</H2>" +
                "<p>Here are your login details:</p>" +
                "<ul><li>Username: " + signUpRequest.getUsername() + "</li>" +
                "<li>Temporary password: " + tempPassword + "</li></ul>" +
                "<p>Please click the link below to verify your email and complete your registration:</p>" +
                "<a href=\"http://localhost:8086/users/confirme?email=" + signUpRequest.getEmail() + "\">Verify Your Account</a></BODY></HTML>", true);
        javaMailSender.send(message);

        return ResponseEntity.ok(new MessageResponse("Employee registered successfully!, verify your email for confirmation"));
    }

    @PutMapping("/updateEmp/{id}")
    public ResponseEntity<?> updateUser(@ModelAttribute UpdateEmployeeRequest updateRequest,   @RequestParam(value = "file", required = false) MultipartFile file) {
        // Check if the user exists
        if (!userRepository.existsById(updateRequest.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Employee not found!"));
        }
        Employee existingEmployee = employeeService.getById(updateRequest.getId());
        // Handle file upload
        if (file != null && !file.isEmpty()) {
            String fileName;
            try {
                fileName = storgeService.store(file);
                existingEmployee.setImage(fileName); // Met à jour l'image uniquement si un fichier est fourni
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: File upload failed!"));
            }
        }


        // Retrieve the existing employee from the database


        // Update the employee with new data
        existingEmployee.setFirstname(updateRequest.getFirstname());
        existingEmployee.setLastname(updateRequest.getLastname());
        existingEmployee.setAddress(updateRequest.getAddress());
        existingEmployee.setDepartment(updateRequest.getDepartment());
        existingEmployee.setDate_birth(updateRequest.getDate_birth());
        existingEmployee.setJob(updateRequest.getJob());
        existingEmployee.setHire_date(updateRequest.getHire_date());
        existingEmployee.setSalary(updateRequest.getSalary());
        existingEmployee.setId_card(updateRequest.getId_card());
        existingEmployee.setPhone(updateRequest.getPhone());

        // Set the image file name
       // existingEmployee.setImage(fileName);

        // Save the updated employee
        employeeService.update(existingEmployee);

        return ResponseEntity.ok(new MessageResponse("Employee updated successfully!"));
    }



    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> loadfile(@PathVariable String filename ) {
        Resource res = storgeService.loadFile(filename);
        HttpHeaders httpHeaders = new HttpHeaders();
        Map<String, String> extensionToContentType = new HashMap<>();
        extensionToContentType.put("pdf", "application/pdf");
        extensionToContentType.put("jpg", "image/jpeg");
        extensionToContentType.put("jpeg", "image/jpeg");
        extensionToContentType.put("png", "image/png");
// Obtenez l'extension du fichier à partir du nom de fichier
        String fileExtension = FilenameUtils.getExtension(filename);
// Obtenez le type de contenu à partir de la correspondance
        String contentType = extensionToContentType.getOrDefault(fileExtension.toLowerCase(),
                MediaType.APPLICATION_OCTET_STREAM_VALUE);
// Définissez le type de contenu dans les en-têtes de réponse
        httpHeaders.setContentType(MediaType.parseMediaType(contentType));
        return ResponseEntity.ok().headers(httpHeaders).body(res);
    }

}


















