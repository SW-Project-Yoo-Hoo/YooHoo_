package swproject.yoohoo.controller;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swproject.yoohoo.domain.*;
import swproject.yoohoo.login.Login;
import swproject.yoohoo.service.MemberService;
import swproject.yoohoo.service.PostService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;
    private final MemberService memberService;


    @PostMapping("/posts")
    public ResultVO create(PostForm form, @Login Member loginMember, HttpServletResponse response) throws IOException {
        PostCreateRequestDto requestDto=new PostCreateRequestDto(
                form.getTitle(),
                form.getRental_unit(),
                form.getRental_price(),
                form.getQuantity(),
                form.getExplain());
        Long postId=postService.savePost(loginMember.getId(), requestDto,form.getPhotos(),form.getCategories());

//        String uri="/posts/"+postId;
//        response.sendRedirect(uri);

        return new ResultVO(201,"게시물 등록 성공",postId);
    }

    @GetMapping("/posts/{id}")
    public ResultVO detail(@PathVariable Long id) {
        Post post=postService.findOne(id);
        Member member= memberService.findOne(post.getMember().getId());

        PostDTO request=new PostDTO(member,post);
        return new ResultVO(200,"게시물 조회 성공",request);
    }

    @GetMapping("/posts")
    public ResultVO list(){
        List<Post> posts = postService.findPosts();
        List<PostsDTO> postlist=posts.stream()
                .map(m->new PostsDTO(m))
                .collect(Collectors.toList());

        return new ResultVO(200,"게시물 전체 조회 성공",postlist);
    }

    @GetMapping("/my/myPosts")
    public ResultVO myList(@Login Member loginMember){
        List<Post> posts=postService.findMyPosts(loginMember.getId());
        List<PostsDTO> dtoList=posts.stream()
                .map(m->new PostsDTO(m))
                .collect(Collectors.toList());

        return new ResultVO(200,"내 게시물 조회 성공",dtoList);
    }

    @PostMapping("/my/recommended_post")
    public ResultVO recommendPost(@RequestBody RecPostForm form){
        System.out.println("폼: "+form);
        Post post=postService.recommendOne(form);
        if(post==null) return new ResultVO(200,"추천할 게시물이 없음",null);
        PostIdDTO dto=new PostIdDTO(post);
        return new ResultVO(200,"게시물 추천 성공",dto);
    }

    @Getter
    public class PostsDTO{ //게시글 전체보기 DTO
        private Long post_id; //게시글 id
        private String title; //제목
        private String unit; //대여 단위
        private int price; //대여 가격
        private Image image; //대표 사진

        public PostsDTO(Post post) {
            this.post_id=post.getId();
            this.title = post.getTitle();
            this.unit = post.getRental_unit();
            this.price = post.getRental_price();
            if(post.getPhotos().isEmpty()){
                log.info("post: {}",post);
            }else{
                this.image=new Image(post.getPhotos().get(0));
            }
        }

    }

    @Getter
    @AllArgsConstructor
    public class PostDTO{ //게시글 상세보기 DTO
        private String company; //작성자 회사이름
        private String address; //작성자 주소
        private String photo_dir; //작성자 프로필 사진 경로

        private String title; //제목
        private String rental_unit; //대여 단위
        private int rental_price; //대여 가격
        private int quantity; //수량
        private String explain; //내용
        private List<Image> photos; //사진 리스트
        private List<CategoryName> categories; //카테고리 리스트

        //카테고리 담기
        public PostDTO (Member member, Post post){//Enity->DTO
            log.info("postDTO생성- member={},post={}",member,post);

            this.company= member.getCompany();
            this.address= member.getAddress();
            this.photo_dir= member.getPhoto_dir();

            this.title=post.getTitle();
            this.rental_unit=post.getRental_unit();
            this.rental_price=post.getRental_price();
            this.quantity= post.getQuantity();
            this.explain=post.getContent();
            this.photos=post.getPhotos().stream()
                    .map(m->new Image(m))
                    .collect(Collectors.toList());

            this.categories=post.getPostCategories().stream()
                    .map(m->new CategoryName(m.getCategory().getName()))
                    .collect(Collectors.toList());

            log.info("postDTO 생성: {}",this);
        }
    }

    @Getter
    @AllArgsConstructor
    public class PostIdDTO{
        private Long post_id;

        public PostIdDTO(Post post) {
            this.post_id = post.getId();
        }
    }


    @Data
    public static class CategoryName{ //카테고리 DTO
        private String name; //카테고리 이름
        public CategoryName(String name) {
            this.name = name;
        }
    }

    @Getter
    public static class Image{ //사진 DTO
        private String name; //사진 저장 이름
        private String dir; //사진 경로

        public Image(Photo photo) {
            this.name = photo.getFileName();
            this.dir = photo.getFilePath();
        }
    }
}
