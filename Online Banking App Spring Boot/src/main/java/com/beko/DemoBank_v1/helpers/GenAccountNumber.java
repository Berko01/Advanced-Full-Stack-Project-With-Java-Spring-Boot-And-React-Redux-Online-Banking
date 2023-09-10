package com.beko.DemoBank_v1.helpers;

import java.util.Random;

public class GenAccountNumber {

    public static int generateAccountNumber(){
        int accountNumber;
        Random random = new Random();
        int bound = 1000;
        accountNumber = bound * random.nextInt(bound);
        return accountNumber;
    }
    //End of Generate Account Number
}