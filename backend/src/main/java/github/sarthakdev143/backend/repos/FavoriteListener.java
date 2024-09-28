package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Favorite;
import github.sarthakdev143.backend.service.PrimarySequenceService;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;


@Component
public class FavoriteListener extends AbstractMongoEventListener<Favorite> {

    private final PrimarySequenceService primarySequenceService;

    public FavoriteListener(final PrimarySequenceService primarySequenceService) {
        this.primarySequenceService = primarySequenceService;
    }

    @Override
    public void onBeforeConvert(final BeforeConvertEvent<Favorite> event) {
        if (event.getSource().getFavoriteId() == null) {
            event.getSource().setFavoriteId(((int)primarySequenceService.getNextValue()));
        }
    }

}
