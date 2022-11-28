package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter @ToString
public class RecPostForm {

    @DateTimeFormat(pattern = "yyyy-MM-dd")//시작 날짜
    private LocalDate startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")//마지막 날짜
    private LocalDate endDate;

    private List<PostController.CategoryName> categoryNames; //카테고리 이름들

}
