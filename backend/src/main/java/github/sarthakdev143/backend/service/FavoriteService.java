package github.sarthakdev143.backend.service;

import github.sarthakdev143.backend.domain.Favorite;
import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.domain.User;
import github.sarthakdev143.backend.model.FavoriteDTO;
import github.sarthakdev143.backend.repos.FavoriteRepository;
import github.sarthakdev143.backend.repos.PlotRepository;
import github.sarthakdev143.backend.repos.UserRepository;
import github.sarthakdev143.backend.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PlotRepository plotRepository;

    public FavoriteService(final FavoriteRepository favoriteRepository,
            final UserRepository userRepository, final PlotRepository plotRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.plotRepository = plotRepository;
    }

    public List<FavoriteDTO> findAll() {
        final List<Favorite> favorites = favoriteRepository.findAll(Sort.by("favoriteId"));
        return favorites.stream()
                .map(favorite -> mapToDTO(favorite, new FavoriteDTO()))
                .toList();
    }

    public FavoriteDTO get(final Integer favoriteId) {
        return favoriteRepository.findById(favoriteId)
                .map(favorite -> mapToDTO(favorite, new FavoriteDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final FavoriteDTO favoriteDTO) {
        final Favorite favorite = new Favorite();
        mapToEntity(favoriteDTO, favorite);
        return favoriteRepository.save(favorite).getFavoriteId();
    }

    public void update(final Integer favoriteId, final FavoriteDTO favoriteDTO) {
        final Favorite favorite = favoriteRepository.findById(favoriteId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(favoriteDTO, favorite);
        favoriteRepository.save(favorite);
    }

    public void delete(final Integer favoriteId) {
        favoriteRepository.deleteById(favoriteId);
    }

    private FavoriteDTO mapToDTO(final Favorite favorite, final FavoriteDTO favoriteDTO) {
        favoriteDTO.setFavoriteId(favorite.getFavoriteId());
        favoriteDTO.setCreatedAt(favorite.getCreatedAt());
        favoriteDTO.setUser(favorite.getUser() == null ? null : favorite.getUser().getUserId());
        favoriteDTO.setPlot(favorite.getPlot() == null ? null : favorite.getPlot().getPlotId());
        return favoriteDTO;
    }

    private Favorite mapToEntity(final FavoriteDTO favoriteDTO, final Favorite favorite) {
        favorite.setCreatedAt(favoriteDTO.getCreatedAt());
        final User user = favoriteDTO.getUser() == null ? null : userRepository.findById(favoriteDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        favorite.setUser(user);
        final Plot plot = favoriteDTO.getPlot() == null ? null : plotRepository.findById(favoriteDTO.getPlot())
                .orElseThrow(() -> new NotFoundException("plot not found"));
        favorite.setPlot(plot);
        return favorite;
    }

}
