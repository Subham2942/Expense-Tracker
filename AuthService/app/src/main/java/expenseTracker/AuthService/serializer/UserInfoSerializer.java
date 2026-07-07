package expenseTracker.AuthService.serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import expenseTracker.AuthService.models.UserInfoDto;
import org.apache.kafka.common.serialization.Serializer;

import java.nio.charset.StandardCharsets;
import java.util.Map;

public class UserInfoSerializer implements Serializer<UserInfoDto> {

    @Override
    public void configure(Map<String, ?> configs, boolean isKey){

    }

    @Override
    public byte[] serialize(String arg0, UserInfoDto arg1) {
        byte[] result = null;
        ObjectMapper mapper = new ObjectMapper();
        try{
            result = mapper.writeValueAsString(arg1).getBytes(StandardCharsets.UTF_8);
        }catch(Exception e){
            e.printStackTrace();
        }
        return result;
    }
    
    @Override
    public void close() {}
}
