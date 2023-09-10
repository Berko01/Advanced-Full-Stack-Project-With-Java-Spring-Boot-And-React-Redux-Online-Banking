package com.beko.DemoBank_v1.controllers;


import com.beko.DemoBank_v1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class IndexController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public String getIndex(){
        return "Merhaba, Spring Boot JSON örnegi!";
    }

    @GetMapping("/verify")
    public ResponseEntity<?> getVerify(@RequestParam("token")String token, @RequestParam("code")String code){

        //Get Token In Database
        String dbToken = userRepository.checkToken(token);

        //Check If Token Is Valid:
        if(dbToken == null){
            return ResponseEntity.badRequest().body("This session has expire.");
        }
        //End of Check If Token is valid.

        //Update and Verify Account
        userRepository.verifyAccount(token,code);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification success." );
        System.out.println("In Verify Account Controller");
        return ResponseEntity.ok(response);


    }
}
