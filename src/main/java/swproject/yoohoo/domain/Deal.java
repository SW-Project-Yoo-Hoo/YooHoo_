package swproject.yoohoo.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;


import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter @Setter
@Slf4j
public class Deal {
    @Id @GeneratedValue
    @JoinColumn(name = "deal_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member member;

    @Enumerated(EnumType.STRING)
    private DealStatus status; //거래상태 [PRE,IN,POST]

    private LocalDate startDate;
    private LocalDate returnDate;
    private int return_quantity;
    private int total_price; //총 대여 가격

    private boolean returnP;
    private boolean returnU;



    //==생성 메서드==//
    @Builder
    public Deal(Post post, Request request) {
        this.post = post;
        this.member = request.getMember();
        if(request.getStartDate().isEqual(LocalDate.now())){
            this.status=DealStatus.IN;
        }else {
            this.status=DealStatus.PRE;
        }
        this.startDate=request.getStartDate();
        this.returnDate=request.getReturnDate();
        this.return_quantity=request.getRental_quantity();
        this.total_price=request.getTotal_price();
        this.returnP=false;
        this.returnU=false;
    }

    public Deal() {

    }


    //==연관관계 메서드==//
    public void setPost(Post post){
        this.post=post;
        post.getDeals().add(this);
    }
    public void setMember(Member member){
        this.member=member;
        member.getDeals().add(this);
    }

    //==비즈니스 로직==//
    public void agreeU(){
        this.returnU=true;
    }

    public void agreeP(){
        this.returnP=true;
    }

    public void startDeal(){
        this.setStatus(DealStatus.IN);
    }



}
