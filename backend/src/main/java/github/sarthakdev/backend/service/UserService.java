package github.sarthakdev.backend.service;

import github.sarthakdev.backend.domain.Favorite;
import github.sarthakdev.backend.domain.Plot;
import github.sarthakdev.backend.domain.Role;
import github.sarthakdev.backend.domain.Transaction;
import github.sarthakdev.backend.domain.User;
import github.sarthakdev.backend.model.UserDTO;
import github.sarthakdev.backend.repos.FavoriteRepository;
import github.sarthakdev.backend.repos.PlotRepository;
import github.sarthakdev.backend.repos.RoleRepository;
import github.sarthakdev.backend.repos.TransactionRepository;
import github.sarthakdev.backend.repos.UserRepository;
import github.sarthakdev.backend.util.NotFoundException;
import github.sarthakdev.backend.util.ReferencedWarning;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PlotRepository plotRepository;
    private final TransactionRepository transactionRepository;
    private final FavoriteRepository favoriteRepository;

    public UserService(final UserRepository userRepository, final RoleRepository roleRepository,
            final PlotRepository plotRepository, final TransactionRepository transactionRepository,
            final FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.plotRepository = plotRepository;
        this.transactionRepository = transactionRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("userId"));
        return users.stream()
                .map(user -> mapToDTO(user, new UserDTO()))
                .toList();
    }

    public UserDTO get(final String userId) {
        return userRepository.findById(userId)
                .map(user -> mapToDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        user.setUserId(userDTO.getUserId());
        return userRepository.save(user).getUserId();
    }

    public void update(final String userId, final UserDTO userDTO) {
        final User user = userRepository.findById(userId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userDTO, user);
        userRepository.save(user);
    }

    public void delete(final String userId) {
        userRepository.deleteById(userId);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPasswordHash(user.getPasswordHash());
        userDTO.setEmail(user.getEmail());
        userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
        userDTO.setTwoStepVerification(user.getTwoStepVerification());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUserRoleRoles(user.getUserRoleRoles().stream()
                .map(role -> role.getRoleId())
                .toList());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setUsername(userDTO.getUsername());
        user.setPasswordHash(userDTO.getPasswordHash());
        user.setEmail(userDTO.getEmail());
        user.setProfilePictureUrl(userDTO.getProfilePictureUrl());
        user.setTwoStepVerification(userDTO.getTwoStepVerification());
        user.setCreatedAt(userDTO.getCreatedAt());
        final List<Role> userRoleRoles = iterableToList(roleRepository.findAllById(
                userDTO.getUserRoleRoles() == null ? Collections.emptyList() : userDTO.getUserRoleRoles()));
        if (userRoleRoles.size() != (userDTO.getUserRoleRoles() == null ? 0 : userDTO.getUserRoleRoles().size())) {
            throw new NotFoundException("one of userRoleRoles not found");
        }
        user.setUserRoleRoles(new HashSet<>(userRoleRoles));
        return user;
    }

    private <T> List<T> iterableToList(final Iterable<T> iterable) {
        final List<T> list = new ArrayList<T>();
        iterable.forEach(item -> list.add(item));
        return list;
    }

    public boolean userIdExists(final String userId) {
        return userRepository.existsByUserIdIgnoreCase(userId);
    }

    public ReferencedWarning getReferencedWarning(final String userId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final User user = userRepository.findById(userId)
                .orElseThrow(NotFoundException::new);
        final Plot createdByPlot = plotRepository.findFirstByCreatedBy(user);
        if (createdByPlot != null) {
            referencedWarning.setKey("user.plot.createdBy.referenced");
            referencedWarning.addParam(createdByPlot.getPlotId());
            return referencedWarning;
        }
        final Transaction buyerTransaction = transactionRepository.findFirstByBuyer(user);
        if (buyerTransaction != null) {
            referencedWarning.setKey("user.transaction.buyer.referenced");
            referencedWarning.addParam(buyerTransaction.getTransactionId());
            return referencedWarning;
        }
        final Transaction sellerTransaction = transactionRepository.findFirstBySeller(user);
        if (sellerTransaction != null) {
            referencedWarning.setKey("user.transaction.seller.referenced");
            referencedWarning.addParam(sellerTransaction.getTransactionId());
            return referencedWarning;
        }
        final Favorite userFavorite = favoriteRepository.findFirstByUser(user);
        if (userFavorite != null) {
            referencedWarning.setKey("user.favorite.user.referenced");
            referencedWarning.addParam(userFavorite.getFavoriteId());
            return referencedWarning;
        }
        return null;
    }

}
