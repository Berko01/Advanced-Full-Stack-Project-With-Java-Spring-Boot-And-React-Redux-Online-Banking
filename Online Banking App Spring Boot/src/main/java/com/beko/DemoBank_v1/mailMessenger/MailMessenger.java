package com.beko.DemoBank_v1.mailMessenger;

import org.springframework.mail.javamail.JavaMailSender;
import com.beko.DemoBank_v1.config.MailConfig;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

public class MailMessenger {
    public static void htmlEmailMessenger(String from, String toMail, String subject, String body) throws MessagingException {
        //Get Mail Config:
        JavaMailSender sender = MailConfig.getMailConfig();
        //Set Mime Message:
        MimeMessage message= sender.createMimeMessage();
        MimeMessageHelper htmlMessage = new MimeMessageHelper(message, true);

        //Set Mail Attributes / Properties:
        htmlMessage.setTo(toMail);
        htmlMessage.setFrom(from);
        htmlMessage.setSubject(subject);
        htmlMessage.setText(body, true);
        //Send Message:
        sender.send(message);
    }
    //End Of HTML Email Message Method
}
