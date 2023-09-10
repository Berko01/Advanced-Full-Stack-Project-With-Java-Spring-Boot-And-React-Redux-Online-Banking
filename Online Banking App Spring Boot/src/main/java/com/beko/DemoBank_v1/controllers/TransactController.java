package com.beko.DemoBank_v1.controllers;

import com.beko.DemoBank_v1.models.PaymentRequest;
import com.beko.DemoBank_v1.models.TransferRequest;
import com.beko.DemoBank_v1.models.User;
import com.beko.DemoBank_v1.repository.AccountRepository;
import com.beko.DemoBank_v1.repository.PaymentRepository;
import com.beko.DemoBank_v1.repository.TransactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/transact")
public class TransactController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TransactRepository transactRepository;

    User user;
    int user_id;
    double currentBalance;
    double newBalance;
    LocalDateTime currentDateTime = LocalDateTime.now();

    @PostMapping("/deposit")
    public ResponseEntity deposit(@RequestBody Map<String, String> requestMap, HttpSession session) {

        String depositAmount = requestMap.get("deposit_amount");
        String accountID = requestMap.get("account_id");

        //TODO: CHECK FOR EMPTY STRINGS:
        if (depositAmount.isEmpty() || accountID.isEmpty()) {
            return ResponseEntity.badRequest().body("Deposit amount and account ID cannot be empty.");
        }

        //TODO: GET LOGGED INT USER:

        user = (User) session.getAttribute("user");


        //TODO: GET CURRENT ACCOUNT BALANCE:
        int acc_id = Integer.parseInt(accountID);
        user_id = Integer.parseInt(user.getUser_id());

        double depositAmountValue = Double.parseDouble(depositAmount);

        //TODO: CHECK IF DEPOSIT AMOUNT IS 0 (ZERO):
        if (depositAmountValue == 0) {
            return ResponseEntity.badRequest().body("Deposit amount cannot be zero.");
        }

        //TODO: UPDATE BALANCE:
        currentBalance = accountRepository.getAccountBalance(user_id, acc_id);
        newBalance = currentBalance + depositAmountValue;

        //Update Account:
        accountRepository.changeAccountsBalanceById(newBalance, acc_id);

        //Log Successfull Transaction:
        transactRepository.logTransaction(acc_id, "deposit", depositAmountValue, "online", "success", "Deposit Transaction Successfull", currentDateTime);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Amount Deposited Successfully.");
        response.put("accounts", accountRepository.getUserAccountsById(user_id)); // Token'i JSON yanıtının içine ekleyin

        return ResponseEntity.ok(response);

    }
    //End Of Deposits.

    @PostMapping("/transfer")
    ResponseEntity transfer(@RequestBody TransferRequest request, HttpSession session) {

        String transfer_from = request.getSourceAccount();
        String transfer_to = request.getTargetAccount();
        String transfer_amount = request.getAmount();

        //TODO: CHECK FOR EMPTY FIELDS
        if (transfer_from.isEmpty() || transfer_to.isEmpty() || transfer_amount.isEmpty()) {
            return ResponseEntity.badRequest().body("The account transferring from and to along with the amount cannot be empty!");
        }
        //TODO: CONVERT VARIABLES:
        int transferFromId = Integer.parseInt(transfer_from);
        int transferToId = Integer.parseInt(transfer_to);
        double transferAmount = Double.parseDouble(transfer_amount);

        //TODO: CHECK IF TRANSFERRING INTO THE SAME ACCOUNT
        if (transferFromId == transferToId) {
            return ResponseEntity.badRequest().body("Cannot Transfer Into The Same Account, Please select the appropriate account to perform transfer.");

        }

        //TODO: CHECK FOR 0 (ZERO) VALUES:
        if (transferAmount == 0) {
            return ResponseEntity.badRequest().body("Cannot Transfer an amount of 0 (Zero) value, please enter a value greater than.");
        }

        //TODO: GET LOGGED IN USER:
        user = (User) session.getAttribute("user");

        //TODO: GET CURRENT BALANCE:
        user_id = Integer.parseInt(user.getUser_id());
        double currentBalanceOfAccountTransferringFrom = accountRepository.getAccountBalance(user_id, transferFromId);


        //TODO: CHECK IF TRANSFER AMOUNT IS MORE THAN CURRENT BALANCE:
        if (currentBalanceOfAccountTransferringFrom < transferAmount) {
            //Log Failed Transaction
            transactRepository.logTransaction(transferFromId, "transfer", transferAmount, "online", "failed", "Insufficient funds.", currentDateTime);
            return ResponseEntity.badRequest().body("You have insufficient Funds to perform this transfer.");
        }

        double currentBalanceOfAccountTransferringTo = accountRepository.getAccountBalance(user_id, transferToId);

        //TODO: SET NEW BALANCE

        double newBalanceOfAccountTransferringFrom = currentBalanceOfAccountTransferringFrom - transferAmount;

        double newBalanceOfAccountTransferringTo = currentBalanceOfAccountTransferringTo + transferAmount;

        //Changed The Balance Of The Account Transferring From:
        accountRepository.changeAccountsBalanceById(newBalanceOfAccountTransferringFrom, transferFromId);

        //Changed The Balance Of The Account Transferring To:
        accountRepository.changeAccountsBalanceById(newBalanceOfAccountTransferringTo, transferToId);

        //Log Successfull Transaction:
        transactRepository.logTransaction(transferFromId, "Transfer", transferAmount, "online", "success", "Transfer Transaction Successfull", currentDateTime);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Transfer completed successfully.");
        response.put("accounts", accountRepository.getUserAccountsById(user_id)); // Token'i JSON yanıtının içine ekleyin

        return ResponseEntity.ok(response);

    }
    //END OF TRANSFER METHOD

    @PostMapping("/withdraw")
    ResponseEntity transfer(@RequestBody Map<String, String> requestMap, HttpSession session) {

        String withdrawalAmount = requestMap.get("withdrawal_amount");
        String accountId = requestMap.get("account_id");

        //TODO: CHECK FOR EMPTY FIELDS
        if (withdrawalAmount.isEmpty() || accountId.isEmpty()) {
            return ResponseEntity.badRequest().body("Account withdrawing from and withdrawal amount cannot be empty!");
        }
        //TODO: CONVERT VARIABLES:
        int account_id = Integer.parseInt(accountId);
        double withdrawal_amount = Double.parseDouble(withdrawalAmount);

        //TODO: CHECK FOR 0 (ZERO) VALUES:
        if (withdrawal_amount == 0) {
            return ResponseEntity.badRequest().body("Withdrawal amount cannot be 0 value.");

        }

        //TODO: GET LOGGED IN USER:
        user = (User) session.getAttribute("user");

        //TODO: GET CURRENT BALANCE:
        user_id = Integer.parseInt(user.getUser_id());
        currentBalance = accountRepository.getAccountBalance(user_id, account_id);

        //TODO: CHECK IF WITHDRAW AMOUNT IS MORE THAN CURRENT BALANCE:
        if (currentBalance < withdrawal_amount) {
            //Log Failed Transaction
            transactRepository.logTransaction(account_id, "withdrawal", withdrawal_amount, "online", "failed", "Insufficient funds.", currentDateTime);
            return ResponseEntity.badRequest().body("You have insufficient Funds to perform this transfer.");
        }

        //TODO: SET NEW BALANCE
        double newBalance = currentBalance - withdrawal_amount;

        //Changed The Balance Of The Account Transferring From:
        accountRepository.changeAccountsBalanceById(newBalance, account_id);


        //Withdrawal Successfull Transaction
        transactRepository.logTransaction(account_id, "Withdrawal", withdrawal_amount,"online","success","Withdrawal Transaction Successfull",currentDateTime);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Withdrawal Successfull!");
        response.put("accounts", accountRepository.getUserAccountsById(user_id)); // Token'i JSON yanıtının içine ekleyin

        return ResponseEntity.ok(response);

    }
    //End Of Withdrawal Method.

    @PostMapping("/payment")
    ResponseEntity transfer(@RequestBody PaymentRequest request, HttpSession session) {

        String beneficiary = request.getBeneficiary();
        String account_number = request.getAccount_number();
        String account_id = request.getAccount_id();
        String reference = request.getReference();
        String payment_amount = request.getPayment_amount();


        //TODO: CHECK FOR EMPTY FIELDS
        if (beneficiary.isEmpty() || account_number.isEmpty() || account_id.isEmpty() || payment_amount.isEmpty()) {
            return ResponseEntity.badRequest().body("Beneficiary, account number, account paying from and account payment amount cannot be empty.");
        }
        //TODO: CONVERT VARIABLES:
        int accountID = Integer.parseInt(account_id);
        double paymentAmount = Double.parseDouble(payment_amount);

        //TODO: CHECK FOR 0 (ZERO) VALUES:
        if (paymentAmount == 0) {
            return ResponseEntity.badRequest().body("Payment amount cannot be 0.");

        }

        //TODO: GET LOGGED IN USER:
        user = (User) session.getAttribute("user");

        //TODO: GET CURRENT BALANCE:
        user_id = Integer.parseInt(user.getUser_id());
        currentBalance = accountRepository.getAccountBalance(user_id, accountID);

        //TODO: CHECK IF PAYMENT AMOUNT IS MORE THAN CURRENT BALANCE:
        if (currentBalance < paymentAmount) {
            String reasonCode = "Coult not Processed Payment due to insufficient funds.";
            paymentRepository.makePayment(accountID, beneficiary, account_number, paymentAmount, reference, "failed", reasonCode, currentDateTime);
            //Log Failed Transaction
            transactRepository.logTransaction(accountID, "Payment", paymentAmount, "online", "failed", "Insufficient funds.", currentDateTime);
            return ResponseEntity.badRequest().body("You have insufficient Funds to perform this payment.");
        }

        //TODO: SET NEW BALANCE FOR ACCOUNT PAYING FROM:
        newBalance = currentBalance - paymentAmount;

        //TODO: UPDATE ACCOUNT PAYING FROM:
        accountRepository.changeAccountsBalanceById(newBalance, accountID);

        //TODO: MAKE PAYMENT:
        String reasonCode = "Payment Processed Successfully!";

        paymentRepository.makePayment(accountID, beneficiary, account_number, paymentAmount, reference, "success", reasonCode, currentDateTime);

        //Log successfull transaction:
        transactRepository.logTransaction(accountID, "Payment", paymentAmount,"online","success","Payment Transaction Successfull",currentDateTime);

        Map<String, Object> response = new HashMap<>();
        response.put("message", reasonCode);
        response.put("accounts", accountRepository.getUserAccountsById(user_id)); // Token'i JSON yanıtının içine ekleyin




        return ResponseEntity.ok(response);

    }
    //End Of Payment Method.


}
