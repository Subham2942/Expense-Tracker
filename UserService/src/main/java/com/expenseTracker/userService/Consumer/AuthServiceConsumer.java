package com.expenseTracker.userService.Consumer;

import com.expenseTracker.userService.Entities.UserInfo;
import com.expenseTracker.userService.Entities.UserInfoDto;
import com.expenseTracker.userService.Repository.UserRepository;
import com.expenseTracker.userService.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceConsumer {

    @Autowired
    private UserService userService;


    @KafkaListener(topics = "${spring.kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(UserInfoDto eventData) {
        try{
            // Todo: Make it transactional, to handle idempotency and validate email, phoneNumber etc
            userService.createOrUpdateUser(eventData);
        }catch(Exception ex){
            ex.printStackTrace();
            System.out.println("AuthServiceConsumer: Exception is thrown while consuming kafka event");
        }
    }
}
