package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.User;
import github.sarthakdev143.backend.service.PrimarySequenceService;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;


@Component
public class UserListener extends AbstractMongoEventListener<User> {

    private final PrimarySequenceService primarySequenceService;

    public UserListener(final PrimarySequenceService primarySequenceService) {
        this.primarySequenceService = primarySequenceService;
    }

    @Override
    public void onBeforeConvert(final BeforeConvertEvent<User> event) {
        if (event.getSource().getUserId() == null) {
            event.getSource().setUserId(((int)primarySequenceService.getNextValue()));
        }
    }

}
