package com.beko.DemoBank_v1.helpers.authorization;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    // Güvenlik anahtarını oluşturun. Bu örnek için HMAC-SHA256 kullanılıyor.


    private String appSecret = "helloDarknessMyOldFriendIComeToTalkWithYouAgain";



    private long expiresIn = 604800;


    public String generateToken(String userEmail) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiresIn);

        Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);


        return Jwts.builder()
                .setSubject(userEmail)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256,appSecret)
                .compact();

    }

    public Claims decodeToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(appSecret)
                    .parseClaimsJws(token);
            return claimsJws.getBody();
        } catch (Exception e) {
            System.out.println("Token is not valid.");
            return null;
        }
    }

    public boolean isTokenIncluded(String req){
        if(req!=null)
            return true;
        return false;
    }

    public String getAccessTokenFromHeader(String req){
        String[] parts = req.split(" ");
        return parts[1];
    }






}