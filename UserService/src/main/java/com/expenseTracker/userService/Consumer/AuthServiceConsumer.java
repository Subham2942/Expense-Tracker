package com.expenseTracker.userService.Consumer;

import com.expenseTracker.userService.Entities.UserInfoDto;
import com.expenseTracker.userService.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceConsumer {
    private final UserRepository userRepository;

    @Autowired
    AuthServiceConsumer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @KafkaListener(topics="${spring.kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(UserInfoDto eventData) {
        try{
            userRepository.save(eventData);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
