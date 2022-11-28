package swproject.yoohoo.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;
import swproject.yoohoo.domain.Member;
import swproject.yoohoo.repository.MemberRepository;

import javax.persistence.EntityManager;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class MemberServiceTest {

    @Autowired MemberService memberService;
    @Autowired
    MemberRepository memberRepository;
    @Autowired EntityManager em;

    @Test
    public void 회원가입() throws Exception {
        //given
        Member member = new Member();
        member.setEmail("object1997@naver.com");
        member.setPassword("qqq");
        member.setCompany("YooHoo Company");
        member.setAddress("부산시 낙동남로 1372-7");
        member.setContact("01074703965");
        member.setPhoto_dir("1111111111111");

        //when
        Long savedId = memberService.join(member);

        System.out.println("member: "+member);
        System.out.println("email: "+member.getEmail());

        //then
//        em.flush();
        assertEquals(member, memberRepository.findOne(savedId));
    }

    @Test(expected = IllegalStateException.class)
    public void 중복_회원_예외() throws Exception {
        //given
        Member member1 = new Member();
        member1.setEmail("object1997@naver.com");
        member1.setPassword("qqq");
        member1.setCompany("YooHoo Company");
        member1.setAddress("부산시 낙동남로 1372-7");
        member1.setContact("01074703965");
        member1.setPhoto_dir("1111111111111");

        Member member2 = new Member();
        member2.setEmail("object1997@naver.com");
        member2.setPassword("qqq");
        member2.setCompany("YooHoo Company");
        member2.setAddress("부산시 낙동남로 1372-7");
        member2.setContact("01074703965");
        member2.setPhoto_dir("1111111111111");

        //when
        memberService.join(member1);
        memberService.join(member2); //예외가 발생해야 한다!!!

        //then
        fail("예외가 발생해야 한다.");
    }

    @Test
    public void 시계_확인(){
        LocalDate date=LocalDate.parse("2022-12-11", DateTimeFormatter.ISO_LOCAL_DATE);
        System.out.println(date);
    }
}