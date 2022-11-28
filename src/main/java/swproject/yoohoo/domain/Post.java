package swproject.yoohoo.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Post {

    @Id @GeneratedValue
    @Column(name="post_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member; //연관관계 주인(외래키 가짐): Post

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private List<Photo> photos=new ArrayList<>();

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private List<Request> requests=new ArrayList<>();

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    List<Deal> deals=new ArrayList<>();

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private List<PostCategory> postCategories =new ArrayList<>();

    private String title; //제목
    private String rental_unit; //대여 단위
    private int rental_price; //대여 가격
    private int quantity; //수량
    @Column(length = 500)
    private String content; //설명
    @Enumerated(EnumType.STRING)
    private PostStatus status; //삭제관리 위한 상태 [POST,DELETED]: [포스트,삭제됨]
    private LocalDateTime postDate; //등록 날짜시간

    public Post() {

    }


    //==연관관계 메서드==//
    public void setMember(Member member){
        this.member=member;
        member.getPosts().add(this);
    }
    public void addPhoto(Photo photo){
        photos.add(photo);
        photo.setPost(this);
    }

    public void addRequest(Request request){
        requests.add(request);
        request.setPost(this);
    }

    public void addDeal(Deal deal){
        deals.add(deal);
        deal.setPost(this);
    }

    public void addPostCategory(PostCategory postCategory){
        postCategory.setPost(this);
        postCategories.add(postCategory);
    }

    //==생성 메서드==//
    @Builder
    public Post(Member member, String title, String rental_unit, int rental_price, int quantity, String content) {
        this.member = member;
        this.title = title;
        this.rental_unit = rental_unit;
        this.rental_price = rental_price;
        this.quantity = quantity;
        this.content = content;
        this.status=PostStatus.POST;
        this.postDate=LocalDateTime.now();
    }
}
