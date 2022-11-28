package swproject.yoohoo.service;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import swproject.yoohoo.controller.PostController;
import swproject.yoohoo.controller.RecPostForm;
import swproject.yoohoo.domain.Category;
import swproject.yoohoo.domain.Post;

import javax.persistence.EntityManager;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class PostServiceTest {

    @Autowired
    PostService postService;
    @Autowired
    EntityManager em;

    @Test
    void recommendOne() {
       /* List<PostController.CategoryName> categories=new ArrayList<>();
        categories.add(new PostController.CategoryName("chair"));
        categories.add(new PostController.CategoryName("desk"));*/
        /*LocalDate s=LocalDate.of(2022,11,01);
        LocalDate e=LocalDate.of(2023,01,01);*/
        LocalDate s=LocalDate.parse("2022-11-17", DateTimeFormatter.ISO_DATE);
        LocalDate e=LocalDate.parse("2022-11-24", DateTimeFormatter.ISO_DATE);
        RecPostForm form=new RecPostForm();
        List<PostController.CategoryName> list=new ArrayList<>();
        list.add(new PostController.CategoryName("chair"));
        list.add(new PostController.CategoryName("desk"));
        form.setCategoryNames(list);
        form.setStartDate(s);
        form.setEndDate(e);

        Post post=postService.recommendOne(form);
        System.out.println("추천한 게시물: "+post.getId());
    }
}