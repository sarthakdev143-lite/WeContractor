package github.sarthakdev.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class HomeController {

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/")
    public RedirectView redirectApi() {
        return new RedirectView("/api");
    }

    @ResponseBody
    @GetMapping("/api")
    public ModelAndView api() {
        System.out.println("\n\n# You Just Tested Api Running Status #\n");
        ModelAndView modelAndView = new ModelAndView("api-status");
        modelAndView.addObject("frontendUrl", frontendUrl);
        return modelAndView;
    }
}
