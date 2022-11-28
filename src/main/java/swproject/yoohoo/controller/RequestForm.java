package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter @Setter
public class RequestForm { //거래 등록 Form
    private Long post_id;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate; //시작 날짜

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate returnDate; //반납 날짜

    private int rental_quantity; //대여 수량
    private int total_price; //총 대여 가격
}
