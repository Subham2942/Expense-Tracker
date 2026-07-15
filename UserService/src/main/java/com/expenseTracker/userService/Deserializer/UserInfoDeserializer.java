package com.expenseTracker.userService.Deserializer;

import com.expenseTracker.userService.Entities.UserInfoDto;
import org.apache.kafka.common.serialization.Deserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;

public class UserInfoDeserializer implements Deserializer<UserInfoDto> {
    @Override
    public UserInfoDto deserialize(String arg0, byte[] arg1) {
        ObjectMapper mapper = new ObjectMapper();
        if (arg1 == null || arg1.length == 0) {
            throw new RuntimeException("Kafka message payload is empty");
        }
        try{
            System.out.println(new String(arg1, StandardCharsets.UTF_8));
            return mapper.readValue(arg1, UserInfoDto.class);
        }catch(Exception ex){
            throw new RuntimeException("Failed to deserialize UserInfoDto", ex);
        }
    }

}
