package swproject.yoohoo.controller;


import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import swproject.yoohoo.domain.*;
import swproject.yoohoo.login.Login;
import swproject.yoohoo.service.AlarmService;
import swproject.yoohoo.service.CategoryService;
import swproject.yoohoo.service.MemberService;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberController {
    private final MemberService memberService;
    private final AlarmService alarmService;
    private final CategoryService categoryService;

    @PostMapping("/members")
    public ResultVO create(@RequestBody JoinForm form){
        Member member = new Member();
        member.setEmail(form.getEmail());
        member.setPassword(form.getPassword());
        member.setCompany(form.getCompany());
        member.setAddress(form.getAddress());
        member.setContact(form.getContact());
        member.setPhoto_dir("");
        memberService.join(member);

        Alarm alarm = Alarm.builder()
                .member(member)
                .title("반갑습니다!")
                .content("회원님의 다양한 자원을 공유해보세요")
                .photo_dir("").build();
        alarmService.save(alarm);

        return new ResultVO(201,"가입 생성",null);
    }

    @GetMapping("/login")
    public ResultVO login(){
        log.info("로그인 리다이렉트 성공");
        return new ResultVO(200,"로그인 리다이렉트 성공",null);
    }


    @PostMapping("/login")
    public ResultVO login(@RequestBody LoginForm form, HttpServletRequest request){//검증 생략
        Member loginMember= memberService.login(form.getEmail(),form.getPassword());
        if(loginMember==null) throw new IllegalArgumentException("아이디와 비밀번호가 일치하지 않습니다");
        //로그인 성공

        HttpSession session=request.getSession();
        session.setAttribute(SessionConst.LOGIN_MEMBER,loginMember);
        //세션 생성, 세션에 회원 정보 보관

        return new ResultVO(200,"로그인 성공",null);
    }

    @GetMapping("/isLogin")
    public ResultVO loginCheck(@Login Member loginMember){
        if(loginMember==null) return new ResultVO(200,"로그인 되어있지 않습니다.",false);
        return new ResultVO(200,"로그인 되어있습니다.",true);
    }

    @GetMapping("/my")
    public ResultVO myPage(@Login Member loginMember){
        myDTO myDTO = new myDTO(loginMember);
        log.info("마이페이지 이동 성공");
        return new ResultVO(200,"마이페이지 이동 성공",myDTO);
    }


    @PostMapping("/logout")
    public ResultVO logout(HttpServletRequest request, @Login Member loginMember){
        HttpSession session=request.getSession(false);
        if(session!=null) session.invalidate();

        return new ResultVO(200,"로그아웃 성공",null);
    }

    @GetMapping("/members/my/myInfo")
    public ResultVO editForm(@Login Member loginMember){
        return new ResultVO(200,null,new EditDTO(loginMember));
    }

    @PutMapping("/members")
    public ResultVO edit(EditForm form, @Login Member loginMember, HttpServletRequest request) throws IOException {
        Member member=memberService.findOne(memberService.updateMember(loginMember.getId(), form));
        EditDTO newform= new EditDTO(member);

        HttpSession session = request.getSession(false);
        session.setAttribute(SessionConst.LOGIN_MEMBER,member);
        return new ResultVO(200,null, newform);
    }

    @GetMapping("/admin/members") //테스트용이라 dto따로 사용X
    public ResultVO list(){
        List<Member> members = memberService.findMembers();
        return new ResultVO(200,null,members);
    }

    @Getter
    static class EditDTO {
        private String company; //회사 이름
        private String address; //회사 주소
        private String contact; //회사 연락처
        private String photo_dir; //프로필 사진 경로
        public EditDTO(Member member) {
            this.company = member.getCompany();
            this.address = member.getAddress();
            this.contact = member.getContact();
            this.photo_dir = member.getPhoto_dir();
        }
    }

    @Getter
    static class myDTO{
        private String company; //회사 이름
        private String address; //회사 주소
        private String contact; //회사 연락처
        private String photo_dir; //프로필 사진 경로

        public myDTO(Member member) {
            this.company = member.getCompany();
            this.address = member.getAddress();
            this.contact = member.getContact();
            this.photo_dir = member.getPhoto_dir();
        }
    }

    @PostConstruct
    public void createCategory(){
        if(categoryService.findCategories().isEmpty()){
            Category category1 = new Category();
            category1.setName("desk");
            categoryService.saveCategory(category1);

            Category category2 = new Category();
            category2.setName("chair");
            categoryService.saveCategory(category2);

            Category category3 = new Category();
            category3.setName("faxMachine");
            categoryService.saveCategory(category3);

            Category category4 = new Category();
            category4.setName("copyMachine");
            categoryService.saveCategory(category4);

            Category category5 = new Category();
            category5.setName("coffeeMachine");
            categoryService.saveCategory(category5);

            Category category6 = new Category();
            category6.setName("mouse");
            categoryService.saveCategory(category6);

            Category category7 = new Category();
            category7.setName("computer");
            categoryService.saveCategory(category7);

        }

    }

    @PostConstruct
    public void firstJoin(){
        if(memberService.findMembers().isEmpty()){
            Member member = new Member();
            member.setEmail("object1997@naver.com");
            member.setPassword("qqq");
            member.setCompany("YooHoo");
            member.setAddress("낙동남로 1372-7");
            member.setContact("010-7470-3965");
            member.setPhoto_dir("");
            memberService.join(member);

            Alarm alarm = Alarm.builder()
                    .member(member)
                    .title("반갑습니다!")
                    .content("회원님의 다양한 자원을 공유해보세요")
                    .photo_dir("").build();
            alarmService.save(alarm);
            //회원1 회원가입

            Member member2 = new Member();
            member2.setEmail("object19972@naver.com");
            member2.setPassword("qqq");
            member2.setCompany("YooHoo");
            member2.setAddress("낙동남로 1372-7");
            member2.setContact("010-7470-3965");
            member2.setPhoto_dir("");
            memberService.join(member2);

            Alarm alarm2 = Alarm.builder()
                    .member(member2)
                    .title("반갑습니다!")
                    .content("회원님의 다양한 자원을 공유해보세요")
                    .photo_dir("").build();
            alarmService.save(alarm2);
            //회원2 회원가입
        }
    }
}
