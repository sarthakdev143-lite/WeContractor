package github.sarthakdev.backend.controller;

import github.sarthakdev.backend.dto.FavoriteDTO;
import github.sarthakdev.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "${allowed.origins}")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/add/{plotId}")
    public ResponseEntity<?> addToFavorites(@PathVariable String plotId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        try {
            favoriteService.addToFavorites(username, plotId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove/{plotId}")
    public ResponseEntity<?> removeFromFavorites(@PathVariable String plotId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        try {
            favoriteService.removeFromFavorites(username, plotId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getUserFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<FavoriteDTO> favorites = favoriteService.getUserFavorites(username);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/check/{plotId}")
    public ResponseEntity<Boolean> isFavorite(@PathVariable String plotId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        boolean isFavorite = favoriteService.isFavorite(username, plotId);
        return ResponseEntity.ok(isFavorite);
    }
}