package github.sarthakdev.backend.dto;

import java.util.Set;

import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankAccount {
    private ObjectId id;
    private ObjectId userId; 
    private String accountHolderName; 
    private Set<ObjectId> roleIds; 
    private String email;
    private String password; 
    private Double balance;
}
