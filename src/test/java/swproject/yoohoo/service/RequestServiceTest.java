package swproject.yoohoo.service;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import swproject.yoohoo.controller.RecRequestForm;
import swproject.yoohoo.domain.Post;
import swproject.yoohoo.domain.Request;
import swproject.yoohoo.repository.RequestRepository;

import javax.persistence.EntityManager;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class RequestServiceTest {
    @Autowired RequestService requestService;
    @Autowired EntityManager em;

    @Test
    void recommendRequests() {
        LocalDate s=LocalDate.parse("2022-11-16", DateTimeFormatter.ISO_DATE);
        LocalDate e=LocalDate.parse("2022-11-22", DateTimeFormatter.ISO_DATE);
        RecRequestForm form=new RecRequestForm();
        form.setPost_id(24L);
        form.setStartDate(s);
        form.setEndDate(e);

        List<Request> recommended=requestService.recommendRequests(form);
        for (Request request : recommended) {
            System.out.println("추천: "+request.getId());
        }
    }
}