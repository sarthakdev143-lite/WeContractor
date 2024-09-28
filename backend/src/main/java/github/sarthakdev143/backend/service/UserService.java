package github.sarthakdev143.backend.service;

import github.sarthakdev143.backend.domain.Contractor;
import github.sarthakdev143.backend.domain.Favorite;
import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.domain.Transaction;
import github.sarthakdev143.backend.domain.User;
import github.sarthakdev143.backend.model.UserDTO;
import github.sarthakdev143.backend.repos.ContractorRepository;
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
public class UserService {

    private final UserRepository userRepository;
    private final PlotRepository plotRepository;
    private final TransactionRepository transactionRepository;
    private final ContractorRepository contractorRepository;
    private final FavoriteRepository favoriteRepository;

    public UserService(final UserRepository userRepository, final PlotRepository plotRepository,
            final TransactionRepository transactionRepository,
            final ContractorRepository contractorRepository,
            final FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.plotRepository = plotRepository;
        this.transactionRepository = transactionRepository;
        this.contractorRepository = contractorRepository;
        this.favoriteRepository = favoriteRepository;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("userId"));
        return users.stream()
                .map(user -> mapToDTO(user, new UserDTO()))
                .toList();
    }

    public UserDTO get(final Integer userId) {
        return userRepository.findById(userId)
                .map(user -> mapToDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        return userRepository.save(user).getUserId();
    }

    public void update(final Integer userId, final UserDTO userDTO) {
        final User user = userRepository.findById(userId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userDTO, user);
        userRepository.save(user);
    }

    public void delete(final Integer userId) {
        userRepository.deleteById(userId);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPasswordHash(user.getPasswordHash());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setVerificationStatus(user.getVerificationStatus());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setUsername(userDTO.getUsername());
        user.setPasswordHash(userDTO.getPasswordHash());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        user.setVerificationStatus(userDTO.getVerificationStatus());
        user.setCreatedAt(userDTO.getCreatedAt());
        user.setUpdatedAt(userDTO.getUpdatedAt());
        return user;
    }

    public ReferencedWarning getReferencedWarning(final Integer userId) {
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
        final Contractor userContractor = contractorRepository.findFirstByUser(user);
        if (userContractor != null) {
            referencedWarning.setKey("user.contractor.user.referenced");
            referencedWarning.addParam(userContractor.getContractorId());
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
