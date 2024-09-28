package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.domain.Transaction;
import github.sarthakdev143.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TransactionRepository extends MongoRepository<Transaction, Integer> {

    Transaction findFirstByPlot(Plot plot);

    Transaction findFirstByBuyer(User user);

    Transaction findFirstBySeller(User user);

}
