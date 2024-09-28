package github.sarthakdev143.backend.service;

import github.sarthakdev143.backend.domain.Favorite;
import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.domain.Transaction;
import github.sarthakdev143.backend.domain.User;
import github.sarthakdev143.backend.model.PlotDTO;
import github.sarthakdev143.backend.repos.FavoriteRepository;
import github.sarthakdev143.backend.repos.PlotRepository;
import github.sarthakdev143.backend.repos.TransactionRepository;
import github.sarthakdev143.backend.repos.UserRepository;
import github.sarthakdev143.backend.util.NotFoundException;
import github.sarthakdev143.backend.util.ReferencedWarning;
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

    public PlotDTO get(final Integer plotId) {
        return plotRepository.findById(plotId)
                .map(plot -> mapToDTO(plot, new PlotDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final PlotDTO plotDTO) {
        final Plot plot = new Plot();
        mapToEntity(plotDTO, plot);
        return plotRepository.save(plot).getPlotId();
    }

    public void update(final Integer plotId, final PlotDTO plotDTO) {
        final Plot plot = plotRepository.findById(plotId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(plotDTO, plot);
        plotRepository.save(plot);
    }

    public void delete(final Integer plotId) {
        plotRepository.deleteById(plotId);
    }

    private PlotDTO mapToDTO(final Plot plot, final PlotDTO plotDTO) {
        plotDTO.setPlotId(plot.getPlotId());
        plotDTO.setTitle(plot.getTitle());
        plotDTO.setSize(plot.getSize());
        plotDTO.setLocation(plot.getLocation());
        plotDTO.setPrice(plot.getPrice());
        plotDTO.setAvailability(plot.getAvailability());
        plotDTO.setZoningInformation(plot.getZoningInformation());
        plotDTO.setAmenities(plot.getAmenities());
        plotDTO.setImages(plot.getImages());
        plotDTO.setVideos(plot.getVideos());
        plotDTO.setCreatedAt(plot.getCreatedAt());
        plotDTO.setUpdatedAt(plot.getUpdatedAt());
        plotDTO.setCreatedBy(plot.getCreatedBy() == null ? null : plot.getCreatedBy().getUserId());
        return plotDTO;
    }

    private Plot mapToEntity(final PlotDTO plotDTO, final Plot plot) {
        plot.setTitle(plotDTO.getTitle());
        plot.setSize(plotDTO.getSize());
        plot.setLocation(plotDTO.getLocation());
        plot.setPrice(plotDTO.getPrice());
        plot.setAvailability(plotDTO.getAvailability());
        plot.setZoningInformation(plotDTO.getZoningInformation());
        plot.setAmenities(plotDTO.getAmenities());
        plot.setImages(plotDTO.getImages());
        plot.setVideos(plotDTO.getVideos());
        plot.setCreatedAt(plotDTO.getCreatedAt());
        plot.setUpdatedAt(plotDTO.getUpdatedAt());
        final User createdBy = plotDTO.getCreatedBy() == null ? null : userRepository.findById(plotDTO.getCreatedBy())
                .orElseThrow(() -> new NotFoundException("createdBy not found"));
        plot.setCreatedBy(createdBy);
        return plot;
    }

    public ReferencedWarning getReferencedWarning(final Integer plotId) {
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
