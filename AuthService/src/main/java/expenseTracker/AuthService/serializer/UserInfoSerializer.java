package expenseTracker.AuthService.serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import expenseTracker.AuthService.eventProducer.UserInfoEvent;
import expenseTracker.AuthService.models.UserInfoDto;
import org.apache.kafka.common.serialization.Serializer;

import java.nio.charset.StandardCharsets;
import java.util.Map;

public class UserInfoSerializer implements Serializer<UserInfoEvent> {

    @Override
    public void configure(Map<String, ?> configs, boolean isKey){

    }

    @Override
    public byte[] serialize(String arg0, UserInfoEvent arg1) {
        if (arg1 == null) {
            throw new RuntimeException("UserInfoEvent cannot be null");
        }
        ObjectMapper mapper = new ObjectMapper();
        try{
            byte[] result = mapper.writeValueAsString(arg1).getBytes(StandardCharsets.UTF_8);
            return result;
        }catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException("Failed to serialize Event ",e);
        }
    }
    
    @Override
    public void close() {}
}
