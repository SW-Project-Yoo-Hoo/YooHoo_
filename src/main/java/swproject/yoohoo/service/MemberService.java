package swproject.yoohoo.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swproject.yoohoo.controller.EditForm;
import swproject.yoohoo.domain.Member;
import swproject.yoohoo.exception.AlreadyExistException;
import swproject.yoohoo.fileupload.FileStore;
import swproject.yoohoo.repository.MemberRepository;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;
    private final FileStore fileStore;

    /**
     * 회원가입
     */
    @Transactional //변경
    public Long join(Member member) {
        validateDuplicateMember(member);
        memberRepository.save(member);
        return member.getId();
    }
    private void validateDuplicateMember(Member member) {
        List<Member> findMembers =
                memberRepository.findByEmail(member.getEmail());
        if (!findMembers.isEmpty()) {
            throw new AlreadyExistException("이미 존재하는 회원입니다.");
        }
    }
    /**
     * 로그인
     */
    public Member login(String loginEmail,String pwd){
        return memberRepository.findByEmail(loginEmail).stream().findFirst()
                .filter(m->m.getPassword().equals(pwd)).orElse(null);
    }

    /** 회원 수정 */
    @Transactional //변경
    public Long updateMember(Long memberid, EditForm form) throws IOException {

        Member member= memberRepository.findOne(memberid);
        member.setCompany(form.getCompany());
        member.setAddress(form.getAddress());
        member.setContact(form.getContact());
        String photo_dir=fileStore.storeProfileImage(form.getPhoto());
        member.setPhoto_dir(photo_dir);
        return memberid;
    }

    /**
     * 전체 회원 조회
     */
    public List<Member> findMembers() {
        return memberRepository.findAll();
    }
    public Member findOne(Long memberId) {
        return memberRepository.findOne(memberId);
    }
}