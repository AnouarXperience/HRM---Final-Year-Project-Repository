package com.securityModel.controllers;


import com.securityModel.models.Candidate;
import com.securityModel.models.Email;
import com.securityModel.repository.CandidateRepository;
import com.securityModel.service.CandidateService;
import com.securityModel.utils.EmailService;
import com.securityModel.utils.StorgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    EmailService emailService;
    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    private StorgeService storgeService;


    @GetMapping("/all")
    public List<Candidate> ListCandidate(){
        return candidateService.getall();
    }

    @PostMapping("/save")
    public Candidate saveCandidate(@RequestParam("firstname") String firstname,
                                   @RequestParam("lastname") String lastname,
                                   @RequestParam("date_birth") String date_birth,
                                   @RequestParam("email") String email,
                                   @RequestParam("phone") String phone,
                                   @RequestParam("level") String level,
                                   @RequestParam("diplomatitle") String diplomatitle,
                                   @RequestParam("university") String university,
                                   @RequestParam("yearsexperience") int yearsexperience,
                                   @RequestParam("experiences") String experiences,
                                   @RequestParam("subject_ref") String subject_ref,
                                   @RequestParam(value = "cv", required = false) MultipartFile cv,
                                   @RequestParam(value = "coverletter", required = false) MultipartFile coverletter) throws IOException {

        Candidate candidate = new Candidate();
        candidate.setFirstname(firstname);
        candidate.setLastname(lastname);
        candidate.setDate_birth(date_birth);
        candidate.setEmail(email);
        candidate.setPhone(phone);
        candidate.setLevel(level);
        candidate.setDiplomatitle(diplomatitle);
        candidate.setUniversity(university);
        candidate.setYearsexperience(yearsexperience);
        candidate.setExperiences(experiences);
        candidate.setSubject_ref(subject_ref);
        candidate.setStatus("Pending");

        if (cv != null && !cv.isEmpty()) {
            String cvPath = storgeService.store(cv,false);
            candidate.setCv(cvPath);
        }
        if (coverletter != null && !coverletter.isEmpty()) {
            String coverLetterPath = storgeService.store(coverletter,false);
            candidate.setCoverletter(coverLetterPath);
        }

        return candidateService.create(candidate);
    }




    @GetMapping("getone/{id}")
    public Candidate getCandidateById(@PathVariable Long id){
        return candidateService.getbyId(id);
    }




    @PutMapping("updateCandidate/{id}")
    public Candidate updateCandidate(@PathVariable Long id, @RequestBody Candidate candidateDetails) {
        Candidate candidate = candidateService.getbyId(id);
        candidate.setFirstname(candidateDetails.getFirstname());
        candidate.setLastname(candidateDetails.getLastname());
        candidate.setDate_birth(candidateDetails.getDate_birth());
        candidate.setEmail(candidateDetails.getEmail());
        candidate.setPhone(candidateDetails.getPhone());
        candidate.setCv(candidateDetails.getCv());
        candidate.setCoverletter(candidateDetails.getCoverletter());
        candidate.setLevel(candidateDetails.getLevel());
        candidate.setDiplomatitle(candidateDetails.getDiplomatitle());
        candidate.setUniversity(candidateDetails.getUniversity());
        candidate.setYearsexperience(candidateDetails.getYearsexperience());
        candidate.setExperiences(candidateDetails.getExperiences());
        candidate.setSubject_ref(candidateDetails.getSubject_ref());

        return candidateService.update(candidate);
    }

    @DeleteMapping("delete/{id}")
    public void deleteCandidate(@PathVariable Long id) {
        candidateService.delete(id);
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = storgeService.loadFile(filename, false); // false assuming it's not an image

        String contentType = "application/pdf"; // Adjust this based on your file type

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCandidateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Candidate candidate = candidateRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Candidate not found"));

            candidate.setStatus(status);
            candidateRepository.save(candidate);

            // Return a JSON response
            return ResponseEntity.ok(Collections.singletonMap("message", "Status updated successfully"));
        } catch (Exception e) {
            // Return a JSON response for errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "Failed to update status"));
        }
    }




    @PostMapping("/confirm")
    public ResponseEntity<Void> sendConfirmationEmail(@RequestBody Candidate candidate) {
        Email email = new Email();
        email.setSubject("Confirmation of Internship Offer");

        String startDate = "12-06-2024";

        String emailContent = "<div style='font-family:Arial,sans-serif;'>" +
                "<img src='cid:logo' style='width:50px;height:auto;'><br><br>" +
                "Dear " + candidate.getFirstname() + " " + candidate.getLastname() + ",<br><br>" +
                "We are pleased to inform you that you have been selected for an internship position at DIGID as an intern. After you choose the subject " + candidate.getSubject_ref() + ", the start date will be " + startDate + ".<br><br>" +
                "We are excited to welcome you to our team and are confident that this experience will be mutually beneficial.<br><br>" +
                "Should you have any questions before your start date, please do not hesitate to reach out.<br><br>" +
                "Best regards,<br>" +
                "DIGID" +
                "</div>" +
                "<br><br>" +
                "<div style='font-family:Arial,sans-serif;font-size:small;color:gray;'>" +
                "This message is intended only for the individual addressed. If you have received this email by mistake, please notify the sender and delete this email from your system." +
                "</div>";

        email.setContent(emailContent);
        email.setTo(candidate.getEmail());
        email.setFrom("no-reply@digid.com"); // Ensure this email address is configured in your email server
        email.setHtml(true); // Ensure the email service sends the email as HTML

        emailService.sendHtmlMessageWithInlineImage(email, "upload/images/Picture1.png", "logo");
        return ResponseEntity.ok().build(); // Ensure you return a 200 OK status
    }

    @PostMapping("/reject")
    public ResponseEntity<Void> sendRejectionEmail(@RequestBody Candidate candidate) {
        Email email = new Email();
        email.setSubject("Internship Application Status");

        String emailContent = "<div style='font-family:Arial,sans-serif;'>" +
                "<img src='cid:logo' style='width:50px;height:auto;'><br><br>" +
                "Dear " + candidate.getFirstname() + " " + candidate.getLastname() + ",<br><br>" +
                "Thank you for your interest in the internship position at DIGID. After careful consideration, we regret to inform you that we are unable to offer you an internship at this time.<br><br>" +
                "We appreciate your application and wish you all the best in your future endeavors.<br><br>" +
                "Best regards,<br>" +
                "DIGID" +
                "</div>" +
                "<br><br>" +
                "<div style='font-family:Arial,sans-serif;font-size:small;color:gray;'>" +
                "This message is intended only for the individual addressed. If you have received this email by mistake, please notify the sender and delete this email from your system." +

                "</div>";

        email.setContent(emailContent);
        email.setTo(candidate.getEmail());
        email.setFrom("no-reply@digid.com"); // Ensure this email address is configured in your email server
        email.setHtml(true); // Ensure the email service sends the email as HTML

        emailService.sendHtmlMessageWithInlineImage(email, "upload/images/Picture1.png", "logo");
        return ResponseEntity.ok().build(); // Ensure you return a 200 OK status
    }





}
