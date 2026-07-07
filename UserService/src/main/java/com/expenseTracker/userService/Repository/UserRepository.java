package com.expenseTracker.userService.Repository;

import com.expenseTracker.userService.Entities.UserInfoDto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<UserInfoDto, String> {
    UserInfoDto findByUserId(String userId);
}
