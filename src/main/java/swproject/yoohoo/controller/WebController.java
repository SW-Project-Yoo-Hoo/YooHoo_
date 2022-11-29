package swproject.yoohoo.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class WebController implements ErrorController {
    @GetMapping({"/", "error"})
    public String index(){
        return "index.html";
    }

    @RequestMapping(value = "/error")
    public String handleNoHandleFoundException(HttpServletResponse response, HttpServletRequest request) {
        return "/error";
    }
}