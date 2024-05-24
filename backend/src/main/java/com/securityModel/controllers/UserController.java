package com.securityModel.controllers;


import com.securityModel.models.User;
import com.securityModel.payload.request.ChangePasswordRequest;
import com.securityModel.repository.UserRepository;
import com.securityModel.service.UserService;
import com.securityModel.utils.StorgeService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private StorgeService storgeService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    JavaMailSender javaMailSender;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/all")
    public List<User> ListUser() {
        return userService.getall();
    }

    @PostMapping("/save")
    public User saveUser(@RequestBody User u) {
        return userService.create(u);
    }

//    @PostMapping("/saveimguser")
//    public User saveimguser(User u, @RequestParam("file") MultipartFile file) {
//        String image = storgeService.store(file);
//        u.setImage(image);
//        return userService.create(u);
//    }

    @GetMapping("/getone/{id}")
    public User getone(@PathVariable Long id) {
        return userService.getbyId(id);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PutMapping("/updateu/{idc}")
    public User updateUser(@PathVariable Long idc, @RequestBody User u) {
        u.setId(idc);
        return userService.update(u);
    }

    @DeleteMapping("/delet/{id}")
    public HashMap<String, String> deletuser(@PathVariable Long id) {

        HashMap message = new HashMap();
        try {
            userService.delete(id);
            message.put("etat", "user delet");
            return message;
        } catch (Exception e) {
            message.put("etat", "Error");
            return message;
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setStatus(status.get("status"));
            userRepository.save(user);
            return ResponseEntity.ok("User status updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/confirme")
    public RedirectView confirmemail(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setConfirme(true);
            userService.create(user);
            return new RedirectView("http://localhost:4200/login?confirmed=true");
        }else{
            throw new RuntimeException("email non confirme");
        }

    }

    @PostMapping("/forgetpassword")
    public  HashMap<String,String> forgetpassword(@RequestBody Map<String, String> body) throws MessagingException {
        String email = body.get("email");
        HashMap message = new HashMap();
        User userexisting = userRepository.findByEmail(email);
        if (userexisting == null){
            message.put("user","user not found");
            return message;
        }
        UUID Token =UUID.randomUUID();
        String token = RandomCodeGenerator.generateRandomCode();
        userexisting.setPasswordResetToken(token);
        userexisting.setId(userexisting.getId());
        String from ="no-reply@digid.com" ;
        String to = userexisting.getEmail();
        String resetLink = "http://localhost:4200/resetpassword?token=" + token;
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setSubject("Password Reset Request");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setText("<html><head><style>"
                + "a {"
                + "  background-color: #73e2f0;"
                + "  border: 1px solid black;"
                + "  border-radius: 5px;"
                + "  color: black;"
                + "  text-align: center;"
                + "  text-decoration: none;"
                + "  display: inline-block;"
                + "  padding: 10px 40px;"
                + "  font-size: 20px;"
                + "  cursor: pointer;" // Ajout du style pour le pointeur
                + "}"
                + "</style></head><body>"
                + "<h2><font color='black'>You requested a password reset. Use the code below to set your new password:</font></h2>"
                + "<a><b>" + token + "</b></a>"
                + "</body></html>", true);
        javaMailSender.send(mimeMessage);

        userRepository.saveAndFlush(userexisting);
        message.put("user","user found, check your eamil");
        return message;
    }
    @PostMapping("/resetpassword")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String verificationCode = body.get("verificationCode");
            String newPassword = body.get("newPassword");
            User user = userRepository.findByPasswordResetToken(verificationCode);
            System.out.println("Request received - Code: " + verificationCode + ", New Password: " + newPassword);

            if (user != null && newPassword != null && !newPassword.isEmpty()) {
                user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
                user.setPasswordResetToken(null);
                userRepository.save(user);
                System.out.println("Password reset successful for user: " + user.getId());
                response.put("message", "Password has been successfully reset.");
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Failed to reset password - Invalid code or password.");
                response.put("error", new ErrorModel("Invalid code or password", "ValidationError"));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            response.put("error", "An error occurred while resetting password.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/changepassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .map(user -> {
                    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(new ErrorModel("current password", "Current password is incorrect."));
                    }
                    if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(new ErrorModel("Invalid password", "New password must be different from the current password."));
                    }
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(user);
                    return ResponseEntity.ok(Collections.singletonMap("message", "Password successfully updated."));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "User not found.")));
    }















}
