package com.lawconnect.lawconnect_backend.services;

import com.lawconnect.lawconnect_backend.models.User;
import com.lawconnect.lawconnect_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public void addUser(User user) {
        userRepository.save(user);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(long id) {
        Optional<User> user = userRepository.findById(id);
        User user1 = null;
        if(user.isPresent()){
            user1 = user.get();
        }
        return user1;
    }

    public User updateUser(String email,User userDetails) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + email));

        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setContactNo(userDetails.getContactNo());
        existingUser.setAge(userDetails.getAge());

        return userRepository.save(existingUser);
    }

    public User updatePassword(long id,User user){
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ud : "+id));
        existingUser.setPassword(user.getPassword());
        return userRepository.save(existingUser);
    }

    public User getUserByEmail(String username) {
        Optional<User> user = userRepository.findByEmail(username);
        User user1 = null;
        if(user.isPresent()){
            user1 = user.get();
        }
        return user1;
    }
}
