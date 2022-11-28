package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinForm {
    private String email; //이메일
    private String password; //비밀번호
    private String company; //회사 이름
    private String address; //회사 주소
    private String contact; //회사 연락처
}
