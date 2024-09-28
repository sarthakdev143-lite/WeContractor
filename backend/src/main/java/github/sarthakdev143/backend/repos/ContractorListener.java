package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Contractor;
import github.sarthakdev143.backend.service.PrimarySequenceService;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;


@Component
public class ContractorListener extends AbstractMongoEventListener<Contractor> {

    private final PrimarySequenceService primarySequenceService;

    public ContractorListener(final PrimarySequenceService primarySequenceService) {
        this.primarySequenceService = primarySequenceService;
    }

    @Override
    public void onBeforeConvert(final BeforeConvertEvent<Contractor> event) {
        if (event.getSource().getContractorId() == null) {
            event.getSource().setContractorId(((int)primarySequenceService.getNextValue()));
        }
    }

}
