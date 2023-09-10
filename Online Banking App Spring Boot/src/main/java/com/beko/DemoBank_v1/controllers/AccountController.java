package com.beko.DemoBank_v1.controllers;


import com.beko.DemoBank_v1.helpers.GenAccountNumber;
import com.beko.DemoBank_v1.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.beko.DemoBank_v1.models.User;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/create_account")
    public ResponseEntity createAccount(@RequestBody Map<String, String> requestMap, HttpSession session){
        String accountName = requestMap.get("account_name");
        String accountType = requestMap.get("account_type");

        //TODO: CHECK FOR EMPTY STRINGS:
        if(accountName.isEmpty() || accountType.isEmpty()){
            return ResponseEntity.badRequest().body("Account name cannot be Empty!");
        }

        //TODO: GET LOGGED IN USER:
        User user = (User) session.getAttribute("user");

        if(user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must login first."); // 401 Unauthorized

        //TODO: GET / GENERATE ACCOUNT NUMBER:
        int setAccountNumber = GenAccountNumber.generateAccountNumber();
        String bankAccountNumber = Integer.toString(setAccountNumber);
        int user_id = Integer.parseInt(user.getUser_id());

        //TODO: CREATE ACCOUNT:
        accountRepository.createBankAccount(user_id, bankAccountNumber, accountName, accountType);


        return ResponseEntity.ok(accountRepository.getUserAccountsById(user_id));

    }
}
