package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import swproject.yoohoo.domain.Category;

import java.time.LocalDate;

@Getter @Setter
public class RecRequestForm {
    private Long post_id;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate; //시작 날짜

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate; //반납 날짜
}
