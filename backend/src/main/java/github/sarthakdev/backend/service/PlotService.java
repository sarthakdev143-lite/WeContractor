package github.sarthakdev.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import github.sarthakdev.backend.dto.PlotDTO;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.repository.PlotRepository;
import github.sarthakdev.backend.repository.UserRepository;
import jakarta.validation.Valid;

@Service
@RequiredArgsConstructor
public class PlotService {

    private final PlotRepository plotRepository;
    private final UserRepository userRepository;

    @Transactional
    public Plot savePlot(@Valid PlotDTO plotDTO) {
        // Map PlotDTO to Plot entity
        Plot plot = mapToPlot(plotDTO);

        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        // Validate that user exists
        if (user == null) {
            System.out.printf("\n\nAuthentication : %s\nUsername : %s\n\n", authentication, username);
            throw new IllegalStateException("Authenticated user not found.");
        }

        // Initialize plot list if null and add plot
        List<Plot> plots = user.getPlots();
        if (plots == null)
            plots = new ArrayList<>();
        plots.add(plot);
        user.setPlots(plots);
        plot.setCreatedBy(user);

        // Log the plot and user information
        System.out.println("\n\nSaving Plot :- \n" + plot + "\n\nPlot Created By :-\n"
                + UserService.printUserDetails(user) + "\n\n");

        // Save the plot entity to the database
        return plotRepository.save(plot);
    }

    private Plot mapToPlot(PlotDTO plotDTO) {
        Plot plot = new Plot();

        plot.setTitle(plotDTO.getTitle());
        plot.setDescription(plotDTO.getDescription());
        plot.setLength(plotDTO.getLength());
        plot.setBreadth(plotDTO.getBreadth());
        plot.setLocation(plotDTO.getLocation());
        plot.setPrice(plotDTO.getPrice());
        plot.setPlotType(plotDTO.getPlotType());
        plot.setDiscount(plotDTO.getDiscount());
        plot.setAmenities(plotDTO.getAmenities());
        plot.setImageUrls(plotDTO.getImages());
        plot.setVideoUrls(plotDTO.getVideos());
        plot.setTags(plotDTO.getTags());

        return plot;
    }

    public void printPlotDTO(PlotDTO plotDTO) {
        System.out.println("====================================");
        System.out.printf("Title       : %s\n", plotDTO.getTitle());
        System.out.printf("Description : %s\n", plotDTO.getDescription());
        System.out.printf("Length      : %.2f\n", plotDTO.getLength());
        System.out.printf("Breadth     : %.2f\n", plotDTO.getBreadth());
        System.out.printf("Location    : %s\n", plotDTO.getLocation());
        System.out.printf("Price       : %.2f\n", plotDTO.getPrice());
        System.out.printf("Plot Type   : %s\n", plotDTO.getPlotType());
        System.out.printf("Discount    : %.2f%%\n", plotDTO.getDiscount());
        // Pretty print lists (Amenities, Image URLs, Video URLs, Tags)
        printList("Amenities", plotDTO.getAmenities());
        printList("Image URLs", plotDTO.getImages());
        printList("Video URLs", plotDTO.getVideos());
        printList("Tags", plotDTO.getTags());

        System.out.println("====================================");
    }

    public void printList(String label, List<String> list) {
        if (list != null && !list.isEmpty()) {
            System.out.println(label + ":");
            for (String item : list) {
                System.out.println("  - " + item);
            }
        } else {
            System.out.println(label + ": None");
        }
    }

}
