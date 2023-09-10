package com.beko.DemoBank_v1.controllers;

import com.beko.DemoBank_v1.helpers.Token;
import com.beko.DemoBank_v1.helpers.authorization.JwtService;
import com.beko.DemoBank_v1.models.User;
import com.beko.DemoBank_v1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class AuthController {


    private UserRepository userRepository;


    public JwtService jwtService;

    @Autowired
    public AuthController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }





    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> requestMap ,
                                   HttpSession session, HttpServletResponse response){

        String email = requestMap.get("email");
        String password = requestMap.get("password");




        //TODO: VALIDATE INPUT FIELDS / FORM DATA:
        if(email.isEmpty() || email== null || password.isEmpty() || password == null){
            return ResponseEntity.badRequest().body("Username or Password Cannot Be Empty.");
        }
        //TODO: CHECK IF EMAIL EXIST:
        String getEmailInDatabase = userRepository.getUserEmail(email);

        //Check If Email Exists:
        if(getEmailInDatabase != null)
        {
            //Get Password In Database:
            String getPasswordInDatabase = userRepository.getUserPassword(getEmailInDatabase);

            //Validate Password:
            if(!BCrypt.checkpw(password,getPasswordInDatabase)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect Username or Password");
            }
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
        // End Of Check Email Exists


        //TODO: CHECK IF USER ACCOUNT IS VERIFIED:
        int verified = userRepository.isVerified(getEmailInDatabase);

        //Check if Account is verified
        if(verified !=1){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account verification required.");
        }
        //End of Check if Account is verified


        //TODO: PROCEED TO LOG THE USER IN:
        User user = userRepository.getUserDetails(getEmailInDatabase);

        //Generate Jwt
        String jwt = jwtService.generateToken(user.getEmail());
        System.out.println("Jwt from login: " + jwt);
        System.out.println(jwtService.decodeToken(jwt));
        //Set Token String
        String token = Token.generateToken();
        //Send Token

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Authentication confirmed" );
        responseBody.put("access_token", jwt); // Token'i JSON yanıtının içine ekleyin





        //Set Session Attributes:
        session.setAttribute("user", user);
        System.out.println(user);
        session.setAttribute("token", jwt);
        session.setAttribute("authenticated", true);




        return ResponseEntity.ok(responseBody); // Çerezi başlığa ekleyin


    }
    //End of Authentication

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session){

        System.out.println("Merhaba berkin bu logout kısmındaki token yani başardın" + session.getAttribute("token"));
        session.invalidate();

        return ResponseEntity.ok("Logged out successfully.");

    }
}
