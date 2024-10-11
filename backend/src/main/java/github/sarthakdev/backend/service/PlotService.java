package github.sarthakdev.backend.service;

import github.sarthakdev.backend.domain.Favorite;
import github.sarthakdev.backend.domain.Plot;
import github.sarthakdev.backend.domain.Transaction;
import github.sarthakdev.backend.domain.User;
import github.sarthakdev.backend.model.PlotDTO;
import github.sarthakdev.backend.repos.FavoriteRepository;
import github.sarthakdev.backend.repos.PlotRepository;
import github.sarthakdev.backend.repos.TransactionRepository;
import github.sarthakdev.backend.repos.UserRepository;
import github.sarthakdev.backend.util.NotFoundException;
import github.sarthakdev.backend.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PlotService {

    private final PlotRepository plotRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final FavoriteRepository favoriteRepository;

    public PlotService(final PlotRepository plotRepository, final UserRepository userRepository,
            final TransactionRepository transactionRepository,
            final FavoriteRepository favoriteRepository) {
        this.plotRepository = plotRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public List<PlotDTO> findAll() {
        final List<Plot> plots = plotRepository.findAll(Sort.by("plotId"));
        return plots.stream()
                .map(plot -> mapToDTO(plot, new PlotDTO()))
                .toList();
    }

    public PlotDTO get(final String plotId) {
        return plotRepository.findById(plotId)
                .map(plot -> mapToDTO(plot, new PlotDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final PlotDTO plotDTO) {
        final Plot plot = new Plot();
        mapToEntity(plotDTO, plot);
        plot.setPlotId(plotDTO.getPlotId());
        return plotRepository.save(plot).getPlotId();
    }

    public void update(final String plotId, final PlotDTO plotDTO) {
        final Plot plot = plotRepository.findById(plotId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(plotDTO, plot);
        plotRepository.save(plot);
    }

    public void delete(final String plotId) {
        plotRepository.deleteById(plotId);
    }

    private PlotDTO mapToDTO(final Plot plot, final PlotDTO plotDTO) {
        plotDTO.setPlotId(plot.getPlotId());
        plotDTO.setTitle(plot.getTitle());
        plotDTO.setLocation(plot.getLocation());
        plotDTO.setPrice(plot.getPrice());
        plotDTO.setPlotType(plot.getPlotType());
        plotDTO.setViewsCount(plot.getViewsCount());
        plotDTO.setDiscount(plot.getDiscount());
        plotDTO.setAmenities(plot.getAmenities());
        plotDTO.setImages(plot.getImages());
        plotDTO.setVideos(plot.getVideos());
        plotDTO.setTags(plot.getTags());
        plotDTO.setCreatedAt(plot.getCreatedAt());
        plotDTO.setCreatedBy(plot.getCreatedBy() == null ? null : plot.getCreatedBy().getUserId());
        return plotDTO;
    }

    private Plot mapToEntity(final PlotDTO plotDTO, final Plot plot) {
        plot.setTitle(plotDTO.getTitle());
        plot.setLocation(plotDTO.getLocation());
        plot.setPrice(plotDTO.getPrice());
        plot.setPlotType(plotDTO.getPlotType());
        plot.setViewsCount(plotDTO.getViewsCount());
        plot.setDiscount(plotDTO.getDiscount());
        plot.setAmenities(plotDTO.getAmenities());
        plot.setImages(plotDTO.getImages());
        plot.setVideos(plotDTO.getVideos());
        plot.setTags(plotDTO.getTags());
        plot.setCreatedAt(plotDTO.getCreatedAt());
        final User createdBy = plotDTO.getCreatedBy() == null ? null : userRepository.findById(plotDTO.getCreatedBy())
                .orElseThrow(() -> new NotFoundException("createdBy not found"));
        plot.setCreatedBy(createdBy);
        return plot;
    }

    public boolean plotIdExists(final String plotId) {
        return plotRepository.existsByPlotIdIgnoreCase(plotId);
    }

    public ReferencedWarning getReferencedWarning(final String plotId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Plot plot = plotRepository.findById(plotId)
                .orElseThrow(NotFoundException::new);
        final Transaction plotTransaction = transactionRepository.findFirstByPlot(plot);
        if (plotTransaction != null) {
            referencedWarning.setKey("plot.transaction.plot.referenced");
            referencedWarning.addParam(plotTransaction.getTransactionId());
            return referencedWarning;
        }
        final Favorite plotFavorite = favoriteRepository.findFirstByPlot(plot);
        if (plotFavorite != null) {
            referencedWarning.setKey("plot.favorite.plot.referenced");
            referencedWarning.addParam(plotFavorite.getFavoriteId());
            return referencedWarning;
        }
        return null;
    }

}
