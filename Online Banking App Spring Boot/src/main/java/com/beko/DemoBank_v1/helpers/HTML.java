package com.beko.DemoBank_v1.helpers;

public class HTML {

    public static String htmlEmailTemplate(String token, String code) {
        String url = "http://127.0.0.1:8070/verify?token=" + token + "&code=" + code;
        String emailTemplate = "<html><body>" +
                "<h1>Hos Geldiniz!</h1>" +
                "<p>Lütfen hesabinizi doğrulamak icin aşagidaki baglantiya tiklayin:</p>" +
                "<a href='" + url + "'>Hesabinizi Doğrulayin</a>" +
                "</body></html>";;
        return emailTemplate;
    }
}

