package github.sarthakdev143.backend.service;

import github.sarthakdev143.backend.domain.Contractor;
import github.sarthakdev143.backend.domain.User;
import github.sarthakdev143.backend.model.ContractorDTO;
import github.sarthakdev143.backend.repos.ContractorRepository;
import github.sarthakdev143.backend.repos.UserRepository;
import github.sarthakdev143.backend.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ContractorService {

    private final ContractorRepository contractorRepository;
    private final UserRepository userRepository;

    public ContractorService(final ContractorRepository contractorRepository,
            final UserRepository userRepository) {
        this.contractorRepository = contractorRepository;
        this.userRepository = userRepository;
    }

    public List<ContractorDTO> findAll() {
        final List<Contractor> contractors = contractorRepository.findAll(Sort.by("contractorId"));
        return contractors.stream()
                .map(contractor -> mapToDTO(contractor, new ContractorDTO()))
                .toList();
    }

    public ContractorDTO get(final Integer contractorId) {
        return contractorRepository.findById(contractorId)
                .map(contractor -> mapToDTO(contractor, new ContractorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ContractorDTO contractorDTO) {
        final Contractor contractor = new Contractor();
        mapToEntity(contractorDTO, contractor);
        return contractorRepository.save(contractor).getContractorId();
    }

    public void update(final Integer contractorId, final ContractorDTO contractorDTO) {
        final Contractor contractor = contractorRepository.findById(contractorId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(contractorDTO, contractor);
        contractorRepository.save(contractor);
    }

    public void delete(final Integer contractorId) {
        contractorRepository.deleteById(contractorId);
    }

    private ContractorDTO mapToDTO(final Contractor contractor, final ContractorDTO contractorDTO) {
        contractorDTO.setContractorId(contractor.getContractorId());
        contractorDTO.setExpertise(contractor.getExpertise());
        contractorDTO.setCertifications(contractor.getCertifications());
        contractorDTO.setRatings(contractor.getRatings());
        contractorDTO.setCreatedAt(contractor.getCreatedAt());
        contractorDTO.setUpdatedAt(contractor.getUpdatedAt());
        contractorDTO.setUser(contractor.getUser() == null ? null : contractor.getUser().getUserId());
        return contractorDTO;
    }

    private Contractor mapToEntity(final ContractorDTO contractorDTO, final Contractor contractor) {
        contractor.setExpertise(contractorDTO.getExpertise());
        contractor.setCertifications(contractorDTO.getCertifications());
        contractor.setRatings(contractorDTO.getRatings());
        contractor.setCreatedAt(contractorDTO.getCreatedAt());
        contractor.setUpdatedAt(contractorDTO.getUpdatedAt());
        final User user = contractorDTO.getUser() == null ? null : userRepository.findById(contractorDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        contractor.setUser(user);
        return contractor;
    }

}
