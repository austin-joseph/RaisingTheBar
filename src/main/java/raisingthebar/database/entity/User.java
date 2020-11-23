package raisingthebar.database.entity;

import org.springframework.data.annotation.Id;
import java.util.Set;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    @Indexed(unique = true, direction = IndexDirection.DESCENDING, dropDups = true)
    private String email;
    private String password;
    private boolean enabled;
    @DBRef
    private Set<Role> roles;
    private String resetToken;
    
    private String[] testsAssigned;

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
    
    public boolean isEnabled() {
        return enabled;
    }

    public Set<Role> getRoles() {
        return roles;
    }
    
    public String getResetToken() {
        return resetToken;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public void setTestsAssigned(String[] testsAssigned) {
        this.testsAssigned = testsAssigned;
    }

    public String[] getTestsAssigned() {
        return testsAssigned;
    } 
}