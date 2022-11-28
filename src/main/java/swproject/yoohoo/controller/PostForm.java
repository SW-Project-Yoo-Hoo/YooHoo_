package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter @Setter
public class PostForm {
    private String title; //제목
    private String rental_unit; //대여 단위
    private int rental_price; //대여 가격
    private int quantity; //수량
    private String explain; //내용
    private List<MultipartFile> photos; //사진들
    private List<PostController.CategoryName> categories; //카테고리들
}
