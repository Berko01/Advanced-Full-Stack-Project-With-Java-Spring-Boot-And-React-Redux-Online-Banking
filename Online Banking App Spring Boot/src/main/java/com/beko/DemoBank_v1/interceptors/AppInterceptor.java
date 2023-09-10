package com.beko.DemoBank_v1.interceptors;


import com.beko.DemoBank_v1.controllers.AuthController;
import com.beko.DemoBank_v1.exception.CustomError;
import com.beko.DemoBank_v1.helpers.authorization.JwtService;
import com.beko.DemoBank_v1.models.User;
import com.beko.DemoBank_v1.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class AppInterceptor implements HandlerInterceptor{


    public UserRepository userRepository;

    @Autowired
    public AppInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    private JwtService jwtService = new JwtService();



    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException, CustomError {
        System.out.println("In Pre Handle Interceptor Method");

        //TODO: CHECK REQUEST URI:
        if(request.getRequestURI().startsWith("/app") || request.getRequestURI().startsWith("/transact") || request.getRequestURI().startsWith("/logout") || request.getRequestURI().startsWith("/account")){


            //Get Header:
            String header = request.getHeader("Authorization");

            //Check Is Token Included
            if(jwtService.isTokenIncluded(header)==false)
                throw new CustomError("You need to be logged in.",HttpServletResponse.SC_UNAUTHORIZED);

            System.out.println("Hereee is theeeeeeeeeeeeeeeeeee header: "+ header);
            //Get Access Token From Header
            String token = jwtService.getAccessTokenFromHeader(header);

            //Decode Token
            System.out.println("Jwt from logout: " + token);
            Claims claims = jwtService.decodeToken(token);
            String email = claims.getSubject(); //email burada

            //Get User By Email
            User user = userRepository.getUserDetails(email);

            //Open Session
            request.getSession().setAttribute("user",user);
            request.getSession().setAttribute("token",token);


            //TODO: Get Token Stored int Session:
            System.out.println("allahım lütfen token yazsın "+ request.getSession().getAttribute("token"));

            //TODO: Get User Object Stored In Session:
            System.out.println("allahım lütfen user yazsın "+ request.getSession().getAttribute("user"));

            //TODO: Validate Session Attributes / Objects:
            if(user == null ){
                throw new CustomError("You need to be logged in.",HttpServletResponse.SC_UNAUTHORIZED);
            }
            //End of Validate Session//Attributes
        }

        return true;
        // End of Check Request URI
    }
    //End Of Pre Handle Method


    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("After Handle Interceptor Method");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("After Completion Interceptor Method");
    }
}
//End of Interceptor Class