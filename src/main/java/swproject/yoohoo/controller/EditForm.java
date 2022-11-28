package swproject.yoohoo.controller;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Builder
public class EditForm {
    private String company; //회사 이름
    private String address; //회사 주소
    private String contact; //회사 연락처
    private MultipartFile photo; //프로필 사진 경로
}
