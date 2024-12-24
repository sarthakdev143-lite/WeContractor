package github.sarthakdev.backend.service;

import github.sarthakdev.backend.dto.FavoriteDTO;
import github.sarthakdev.backend.model.Favorite;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.repository.FavoriteRepository;
import github.sarthakdev.backend.repository.PlotRepository;
import github.sarthakdev.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PlotRepository plotRepository;

    @Transactional
    public void addToFavorites(String username, String plotId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Plot plot = plotRepository.findById(new ObjectId(plotId))
                .orElseThrow(() -> new RuntimeException("Plot not found"));

        System.out.println("\n\nAdding Plot : " + plot.getTitle() + "\nto Favorite of User : " + user.getUsername());

        // Check if already favorited
        if (favoriteRepository.existsByUserAndPlot(user, plot)) {
            throw new RuntimeException("Plot already in favorites");
        }

        Favorite favorite = new Favorite(user, plot);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFromFavorites(String username, String plotId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Plot plot = plotRepository.findById(new ObjectId(plotId))
                .orElseThrow(() -> new RuntimeException("Plot not found"));

        favoriteRepository.deleteByUserAndPlot(user, plot);
    }

    @Transactional(readOnly = true)
    public List<FavoriteDTO> getUserFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return favoriteRepository.findByUser(user).stream()
                .map(favorite -> FavoriteDTO.builder()
                        .plotId(favorite.getPlot().getId().toString())
                        .plotName(favorite.getPlot().getTitle()) 
                        .favoritedAt(favorite.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(String username, String plotId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Plot plot = plotRepository.findById(new ObjectId(plotId))
                .orElseThrow(() -> new RuntimeException("Plot not found"));

        return favoriteRepository.existsByUserAndPlot(user, plot);
    }
}