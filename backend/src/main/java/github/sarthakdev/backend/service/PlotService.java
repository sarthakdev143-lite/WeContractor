package github.sarthakdev.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import github.sarthakdev.backend.dto.PlotDTO;
import github.sarthakdev.backend.dto.PlotOwner;
import github.sarthakdev.backend.exception.UsernameNotFoundException;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.repository.PlotRepository;
import github.sarthakdev.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class PlotService {

    private final PlotRepository plotRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public Plot savePlot(PlotDTO plotDTO, User user) {
        System.out.println("\n\nRequest to save new Plot :-");
        printPlotDTO(plotDTO);

        System.out.println("\n\nMapping DTO to Plot...\n\n");
        // Map PlotDTO to Plot entity
        Plot plot = mapToPlot(plotDTO);
        System.out.println("\n\nSuccessfully Mapped DTO to Plot.\n\n\n");

        // Initialize plot list if null and add plot
        List<Plot> plots = user.getPlots();
        if (plots == null) {
            System.out.println("\n\nUser has currently no Plots..!!\n\n");
            plots = new ArrayList<>();
        }
        plots.add(plot);
        user.setPlots(plots);
        System.out
                .println("\n\nSuccessfully Added Plot to User's Plots\n\n\nUpdated User's Plots : " + user.getPlots());
        plot.setPlotOwner(new PlotOwner(user.getFullName(), user.getUsername(), user.getEmail(), user.getVerified(),
                user.getProfilePictureUrl(), user.getPhoneNumber()));
        System.out.printf("\n\nSuccessfully Set ` %s ` the Owner of Plot ` %s `.\n\n\n",
                plot.getPlotOwner().getFullName(), plot.getTitle());

        User updatedUser = userService.findUserByUsername(user.getUsername());
        if (updatedUser != null) {
            if (userRepository.save(updatedUser) != null)
                System.out.println("\n\nSuccessfully updated User.\n\n");
            else
                System.out.println("\n\nFailed to update User.\n\n");
        } else {
            System.out.println("\n\nUser not found in database.\n\n");
            throw new UsernameNotFoundException("User who is registering the plot is not in DB. Something is wrong.");
        }

        // Log the plot and user information
        System.out.printf("\n\nSaving Plot :- \n%s\n\nPlot Created By :-\n%s\n\n", printPlot(plot),
                UserService.printUserDetails(user));

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

    public static void printPlotDTO(PlotDTO plotDTO) {
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

    public static String printPlot(Plot plot) {
        StringBuilder sb = new StringBuilder();

        sb.append("====================================\n");
        sb.append(String.format("Created By  : %s\n", plot.getPlotOwner().getFullName()));
        sb.append(String.format("Title       : %s\n", plot.getTitle()));
        sb.append(String.format("Description : %s\n", plot.getDescription()));
        sb.append(String.format("Length      : %.2f\n", plot.getLength()));
        sb.append(String.format("Breadth     : %.2f\n", plot.getBreadth()));
        sb.append(String.format("Location    : %s\n", plot.getLocation()));
        sb.append(String.format("Price       : %.2f\n", plot.getPrice()));
        sb.append(String.format("Plot Type   : %s\n", plot.getPlotType()));
        sb.append(String.format("Discount    : %.2f%%\n", plot.getDiscount()));

        // Pretty print lists (Amenities, Image URLs, Video URLs, Tags)
        appendList(sb, "Amenities", plot.getAmenities());
        appendList(sb, "Image URLs", plot.getImageUrls());
        appendList(sb, "Video URLs", plot.getVideoUrls());
        appendList(sb, "Tags", plot.getTags());

        sb.append("====================================\n");

        return sb.toString();
    }

    private static void appendList(StringBuilder sb, String label, List<String> list) {
        sb.append(label).append(" : \n");
        if (list != null && !list.isEmpty()) {
            for (String item : list) {
                sb.append("  - ").append(item).append("\n");
            }
        } else {
            sb.append("  No items available\n");
        }
    }

    public static void printList(String label, List<String> list) {
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
