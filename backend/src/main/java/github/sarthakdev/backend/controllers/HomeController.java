package github.sarthakdev.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class HomeController {

    @GetMapping("/")
    public RedirectView redirectApi() {
        return new RedirectView("/api");
    }

    @ResponseBody
    @GetMapping("/api")
    public String api() {
        System.out.println("\n\n# You Just Tested Api Running Status #\n");
        return "Api is Working! 👍";
    }
}
