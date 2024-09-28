package github.sarthakdev143.backend.rest;

import github.sarthakdev143.backend.model.FavoriteDTO;
import github.sarthakdev143.backend.service.FavoriteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/favorites", produces = MediaType.APPLICATION_JSON_VALUE)
public class FavoriteResource {

    private final FavoriteService favoriteService;

    public FavoriteResource(final FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getAllFavorites() {
        return ResponseEntity.ok(favoriteService.findAll());
    }

    @GetMapping("/{favoriteId}")
    public ResponseEntity<FavoriteDTO> getFavorite(
            @PathVariable(name = "favoriteId") final Integer favoriteId) {
        return ResponseEntity.ok(favoriteService.get(favoriteId));
    }

    @PostMapping
    public ResponseEntity<Integer> createFavorite(
            @RequestBody @Valid final FavoriteDTO favoriteDTO) {
        final Integer createdFavoriteId = favoriteService.create(favoriteDTO);
        return new ResponseEntity<>(createdFavoriteId, HttpStatus.CREATED);
    }

    @PutMapping("/{favoriteId}")
    public ResponseEntity<Integer> updateFavorite(
            @PathVariable(name = "favoriteId") final Integer favoriteId,
            @RequestBody @Valid final FavoriteDTO favoriteDTO) {
        favoriteService.update(favoriteId, favoriteDTO);
        return ResponseEntity.ok(favoriteId);
    }

    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> deleteFavorite(
            @PathVariable(name = "favoriteId") final Integer favoriteId) {
        favoriteService.delete(favoriteId);
        return ResponseEntity.noContent().build();
    }

}
