package github.sarthakdev.backend.repos;

import github.sarthakdev.backend.domain.Plot;
import github.sarthakdev.backend.domain.Transaction;
import github.sarthakdev.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TransactionRepository extends MongoRepository<Transaction, String> {

    Transaction findFirstByPlot(Plot plot);

    Transaction findFirstByBuyer(User user);

    Transaction findFirstBySeller(User user);

    boolean existsByTransactionIdIgnoreCase(String transactionId);

}
