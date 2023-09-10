package com.beko.DemoBank_v1.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.beko.DemoBank_v1.models.User;

import javax.transaction.Transactional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    @Query(value="SELECT email FROM users WHERE email = :email", nativeQuery = true)
    String getUserEmail(@Param("email")String email);

    @Query(value="SELECT password FROM users WHERE email = :email", nativeQuery = true)
    String getUserPassword(@Param("email")String email);

    @Query(value="SELECT verified FROM users WHERE email = :email", nativeQuery = true)
    int isVerified(@Param("email")String email);

    @Query(value="SELECT * FROM users WHERE email = :email", nativeQuery = true)
    User getUserDetails(@Param("email")String email);

    @Modifying
    @Query(value = "INSERT INTO users (first_name, last_name, email, password, token, code) VALUES" +
            "(:first_name, :last_name, :email, :password, :token, :code)",nativeQuery = true)
    @Transactional
    void registerUser(@Param("first_name")String first_name,
                      @Param("last_name")String last_name,
                      @Param("email")String email,
                      @Param("password")String password,
                      @Param("token")String token,
                      @Param("code")String code);


    @Modifying
    @Query(value = "UPDATE users SET token=null,code=null, verified=1, verified_at=Now(), updated_at=Now() WHERE "+
            "token= :token AND code= :code", nativeQuery = true)
    @Transactional
    void verifyAccount(@Param("token")String token, @Param("code")String code);

    @Query(value = "SELECT token FROM users WHERE token = :token",nativeQuery = true)
    String checkToken(@Param("token")String token);
}