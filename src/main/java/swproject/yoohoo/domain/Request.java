package swproject.yoohoo.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Request {
    @Id @GeneratedValue
    @Column(name = "request_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDate startDate;
    private LocalDate returnDate;
    private int rental_quantity;
    private int total_price; //총 대여 가격

    @Enumerated(EnumType.STRING)
    private RequestStatus status; //요청상태 [REQUEST,ACCEPTED, REJECTED,OVERTIME]: [요청중,수락됨,거절됨,거절X but 기간 지남]

    private LocalDateTime requestDate;
    //==생성 메서드==//
    public Request() {

    }
    @Builder
    public Request(Post post, Member member, LocalDate startDate, LocalDate returnDate, int rental_quantity, int total_price) {
        this.post = post;
        this.member = member;
        this.startDate = startDate;
        this.returnDate = returnDate;
        this.rental_quantity = rental_quantity;
        this.total_price = total_price;
        this.status=RequestStatus.REQUEST;
        this.requestDate=LocalDateTime.now();
    }

    //==연관관계 메서드==//
    public void setPost(Post post){
        this.post=post;
        post.getRequests().add(this);
    }

    public void setMember(Member member){
        this.member=member;
        member.getRequests().add(this);
    }

    //==비즈니스 로직==//
    /** 요청 거절 **/
    public void reject(){
        this.setStatus(RequestStatus.REJECTED);
    }

    public void accept(){
        if(startDate.isBefore(LocalDate.now())){//거래 시작날짜가 이미 지났으면
            throw new IllegalArgumentException("이미 기간이 지난 요청은 수락할 수 없습니다.");
        }
        this.setStatus(RequestStatus.ACCEPTED);
    }

    public void cancel(){
        this.setStatus(RequestStatus.DELETED);
    }



}
