package com.securityModel.controllers;

import com.securityModel.models.ERole;
import com.securityModel.models.Employee;
import com.securityModel.models.Responsable;
import com.securityModel.models.Role;
import com.securityModel.payload.request.SignupRequest;
import com.securityModel.payload.request.UpdateEmployeeRequest;
import com.securityModel.payload.response.MessageResponse;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;

import com.securityModel.service.ResponsableService;
import com.securityModel.utils.EmailService;
import com.securityModel.utils.StorgeService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.apache.commons.io.FilenameUtils;
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
import org.apache.commons.lang3.RandomStringUtils;
import java.time.LocalDateTime;
import java.util.*;

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
    private StorgeService storgeService;

    @Autowired
    EmailService emailService;
    @Autowired
    JavaMailSender javaMailSender;


    @GetMapping("/all")
    public List<Responsable> ListResponsable() {
        return responsableService.getall();
    }

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
    public ResponseEntity<?> registerUser(@ModelAttribute SignupRequest signUpRequest, @RequestParam("file") MultipartFile file) throws MessagingException {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        String fileName = storgeService.store(file);

        // Generate a temporary password
        String tempPassword = RandomStringUtils.randomAlphanumeric(10);

        // Create new user's account
        Responsable responsable = new Responsable(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(tempPassword), fileName, signUpRequest.getFirstname(), signUpRequest.getLastname(), signUpRequest.getAddress(), signUpRequest.getDepartment(),signUpRequest.getDate_birth(), signUpRequest.getJob(),  signUpRequest.getHire_date(),
                signUpRequest.getSalary(), signUpRequest.getId_card(), signUpRequest.getPhone());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        Role modRole = roleRepository.findByName(ERole.ROLE_Responsable)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(modRole);
        responsable.setRoles(roles);
        responsableService.create(responsable);

        // Send confirmation email with temporary password
        String from = "admin@gmail.com";
        String to = signUpRequest.getEmail();
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setSubject("Confirmation Registration!");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setText("<HTML><body>Votre nom d'utilisateur : " + signUpRequest.getUsername() +
                "<br>Votre mot de passe temporaire : " + tempPassword +
                "<br><a href=\"http://localhost:8086/users/confirme?email="
                + signUpRequest.getEmail() + "\">Cliquez ici pour vérifier votre compte</a></body></HTML>", true);
        javaMailSender.send(message);

        return ResponseEntity.ok(new MessageResponse("Responsable registered successfully! Please verify your email and log in with the temporary password provided."));
    }
    @PutMapping("/updateRes/{id}")
    public ResponseEntity<?> updateUser(@ModelAttribute UpdateEmployeeRequest updateRequest, @RequestParam(value = "file", required = false) MultipartFile file) {
        // Check if the user exists
        if (!userRepository.existsById(updateRequest.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Employee not found!"));
        }
        Responsable existingRes = responsableService.getById(updateRequest.getId());
        // Handle file upload
        if (file != null && !file.isEmpty()) {
            String fileName;
            try {
                fileName = storgeService.store(file);
                existingRes.setImage(fileName); // Met à jour l'image uniquement si un fichier est fourni
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: File upload failed!"));
            }
        }


        // Retrieve the existing employee from the database


        // Update the employee with new data
        existingRes.setFirstname(updateRequest.getFirstname());
        existingRes.setLastname(updateRequest.getLastname());
        existingRes.setAddress(updateRequest.getAddress());
        existingRes.setDepartment(updateRequest.getDepartment());
        existingRes.setDate_birth(updateRequest.getDate_birth());
        existingRes.setJob(updateRequest.getJob());
        existingRes.setHire_date(updateRequest.getHire_date());
        existingRes.setSalary(updateRequest.getSalary());
        existingRes.setId_card(updateRequest.getId_card());
        existingRes.setPhone(updateRequest.getPhone());

        // Set the image file name
        // existingEmployee.setImage(fileName);

        // Save the updated employee
        responsableService.update(existingRes);

        return ResponseEntity.ok(new MessageResponse("Responsable updated successfully!"));
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
