package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.service.PrimarySequenceService;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;


@Component
public class PlotListener extends AbstractMongoEventListener<Plot> {

    private final PrimarySequenceService primarySequenceService;

    public PlotListener(final PrimarySequenceService primarySequenceService) {
        this.primarySequenceService = primarySequenceService;
    }

    @Override
    public void onBeforeConvert(final BeforeConvertEvent<Plot> event) {
        if (event.getSource().getPlotId() == null) {
            event.getSource().setPlotId(((int)primarySequenceService.getNextValue()));
        }
    }

}
