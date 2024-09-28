package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Transaction;
import github.sarthakdev143.backend.service.PrimarySequenceService;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;


@Component
public class TransactionListener extends AbstractMongoEventListener<Transaction> {

    private final PrimarySequenceService primarySequenceService;

    public TransactionListener(final PrimarySequenceService primarySequenceService) {
        this.primarySequenceService = primarySequenceService;
    }

    @Override
    public void onBeforeConvert(final BeforeConvertEvent<Transaction> event) {
        if (event.getSource().getTransactionId() == null) {
            event.getSource().setTransactionId(((int)primarySequenceService.getNextValue()));
        }
    }

}
