package com.beko.DemoBank_v1.controller_advisor;

import com.beko.DemoBank_v1.models.User;
import org.springframework.web.bind.annotation.ModelAttribute;

public class AdvisorController {

    @ModelAttribute("registerUser")
    public User getUserDefaults(){
        return  new User();
    }
}
