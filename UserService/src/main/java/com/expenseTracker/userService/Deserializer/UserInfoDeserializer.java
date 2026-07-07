package com.expenseTracker.userService.Deserializer;

import com.expenseTracker.userService.Entities.UserInfoDto;
import org.apache.kafka.common.serialization.Deserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;

public class UserInfoDeserializer implements Deserializer<UserInfoDto> {
    @Override
    public UserInfoDto deserialize(String arg0, byte[] arg1) {
        ObjectMapper mapper = new ObjectMapper();
        UserInfoDto user = null;
        try{
            System.out.println(new String(arg1, StandardCharsets.UTF_8));
            user = mapper.readValue(arg1, UserInfoDto.class);
        }catch(Exception ex){
            System.out.println(ex.getMessage());
        }

        return user;
    }

}
