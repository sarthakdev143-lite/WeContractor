package github.sarthakdev.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import github.sarthakdev.backend.dto.PlotListDTO;
import github.sarthakdev.backend.dto.PlotDTO;
import github.sarthakdev.backend.dto.PlotInUserDTO;
import github.sarthakdev.backend.dto.PlotOwner;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import github.sarthakdev.backend.repository.PlotRepository;
import github.sarthakdev.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class PlotService {

    private final PlotRepository plotRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<Plot> getAllPlots() {
        return plotRepository.findAll();
    }

    @Transactional
    public PlotDTO getPlotById(ObjectId id, Boolean noViewIncrement) {
        Optional<Plot> plot = plotRepository.findById(id);
        if (noViewIncrement == null || !noViewIncrement)
            plot.get().setTotalViews(plot.get().getTotalViews() + 1);
        PlotDTO plotDTO = mapToDTO(plotRepository.save(plot.get()));
        System.out.println("\n\nReturning PlotDTO :-\n" + plotDTO);
        return plotDTO;
    }

    @Transactional
    public Plot savePlot(PlotListDTO plotListDTO, User user) {
        System.out.println("\n\nRequest to save new Plot :-");
        printPlotListDTO(plotListDTO);

        System.out.println("\n\nMapping DTO to Plot...\n\n");
        // Map PlotListDTO to Plot entity
        Plot plot = mapToPlot(plotListDTO);
        System.out.println("\n\nSuccessfully Mapped DTO to Plot.\n\n\n");

        plot.setPlotOwner(new PlotOwner(user.getFullName(), user.getUsername(), user.getEmail(), user.getVerified(),
                user.getProfilePictureUrl(), user.getPhoneNumber()));
        System.out.printf("\n\nSuccessfully Set ` %s ` the Owner of Plot ` %s `.\n\n\n",
                plot.getPlotOwner().getFullName(), plot.getTitle());

        plot = plotRepository.save(plot);

        // Initialize plot list if null and add plot
        List<PlotInUserDTO> plots = user.getPlots();
        if (plots == null) {
            System.out.println("\n\nUser has currently no Plots..!!\n\n");
            plots = new ArrayList<>();
        }
        plots.add(new PlotInUserDTO(plot.getId(), plot.getTitle(), plot.getIsSold()));
        user.setPlots(plots);
        System.out
                .println("\n\nSuccessfully Added Plot to User's Plots\n\n\nUpdated User's Plots : " + user.getPlots());

        if (user != null) {
            if (userRepository.save(user) != null)
                System.out.println("\n\nSuccessfully updated User.\n\n");
            else
                System.out.println("\n\nFailed to update User.\n\n");
        }

        // Log the plot and user information
        System.out.printf("\n\nSaving Plot :- \n%s\n\nPlot Created By :-\n%s\n\n", printPlot(plot),
                UserService.printUserDetails(user));

        // Save the plot entity to the database
        return plot;
    }


    private PlotDTO mapToDTO(Plot plot) {
        PlotDTO plotDTO = new PlotDTO();

        plotDTO.setTitle(plot.getTitle());
        plotDTO.setDescription(plot.getDescription());
        plotDTO.setLocation(plot.getLocation());
        plotDTO.setPlotType(plot.getPlotType());
        plotDTO.setPrice(plot.getPrice());
        plotDTO.setDiscount(plot.getDiscount());
        plotDTO.setLength(plot.getLength());
        plotDTO.setBreadth(plot.getBreadth());
        plotDTO.setPlotOwner(plot.getPlotOwner());
        plotDTO.setRating(plot.getRating());
        plotDTO.setImageUrls(plot.getImageUrls());
        plotDTO.setVideoUrls(plot.getVideoUrls());
        plotDTO.setAmenities(plot.getAmenities());
        plotDTO.setPriceHistory(plot.getPriceHistory());
        plotDTO.setIsSold(plot.getIsSold());
        plotDTO.setTotalViews(plot.getTotalViews());
        plotDTO.setCreatedAt(plot.getCreatedAt());
        return plotDTO;
    }

    private Plot mapToPlot(PlotListDTO plotListDTO) {
        Plot plot = new Plot();
        plot.setTitle(plotListDTO.getTitle());
        plot.setDescription(plotListDTO.getDescription());
        plot.setLength(plotListDTO.getLength());
        plot.setBreadth(plotListDTO.getBreadth());
        plot.setLocation(plotListDTO.getLocation());
        plot.setPrice(plotListDTO.getPrice());
        plot.setPlotType(plotListDTO.getPlotType());
        plot.setDiscount(plotListDTO.getDiscount());
        plot.setAmenities(plotListDTO.getAmenities());
        plot.setImageUrls(plotListDTO.getImages());
        plot.setVideoUrls(plotListDTO.getVideos());
        plot.setTags(plotListDTO.getTags());

        return plot;
    }

    public static void printPlotListDTO(PlotListDTO plotListDTO) {
        System.out.println("====================================");
        System.out.printf("Title       : %s\n", plotListDTO.getTitle());
        System.out.printf("Description : %s\n", plotListDTO.getDescription());
        System.out.printf("Length      : %.2f\n", plotListDTO.getLength());
        System.out.printf("Breadth     : %.2f\n", plotListDTO.getBreadth());
        System.out.printf("Location    : %s\n", plotListDTO.getLocation());
        System.out.printf("Price       : %.2f\n", plotListDTO.getPrice());
        System.out.printf("Plot Type   : %s\n", plotListDTO.getPlotType());
        System.out.printf("Discount    : %.2f%%\n", plotListDTO.getDiscount());
        // Pretty print lists (Amenities, Image URLs, Video URLs, Tags)
        printList("Amenities", plotListDTO.getAmenities());
        printList("Image URLs", plotListDTO.getImages());
        printList("Video URLs", plotListDTO.getVideos());
        printList("Tags", plotListDTO.getTags());

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
