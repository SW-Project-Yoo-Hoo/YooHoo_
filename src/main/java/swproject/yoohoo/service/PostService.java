package swproject.yoohoo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import swproject.yoohoo.controller.PostController;
import swproject.yoohoo.controller.RecPostForm;
import swproject.yoohoo.domain.*;
import swproject.yoohoo.fileupload.FileStore;
import swproject.yoohoo.repository.CategoryRepository;
import swproject.yoohoo.repository.MemberRepository;
import swproject.yoohoo.repository.PhotoRepository;
import swproject.yoohoo.repository.PostRepository;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final PhotoRepository photoRepository;
    private final FileStore fileStore;

    @Transactional
    public Long savePost(Long memberId, PostCreateRequestDto requestDto,List<MultipartFile> files,List<PostController.CategoryName> categoryNames) throws IOException {
        //엔티티 조회
        Member member = memberRepository.findOne(memberId);

        Post post = new Post(
                member,
                requestDto.getTitle(),
                requestDto.getRental_unit(),
                requestDto.getRental_price(),
                requestDto.getQuantity(),
                requestDto.getExplain()
        );

        List<Photo> photoList=fileStore.storeFiles(files);
        if(!photoList.isEmpty()){
            for (Photo photo : photoList) {
                photoRepository.save(photo);
                post.addPhoto(photoRepository.findOne(photo.getId()));
            }
        }

        for (PostController.CategoryName categoryName : categoryNames) {
            Category category=categoryRepository.findOnebyName(categoryName.getName());
            log.info("찾은 카테고리={}",category);
            PostCategory postCategory=PostCategory.createPostCategory(category);
            post.addPostCategory(postCategory);
        }

        postRepository.save(post);
        return post.getId();
    }

    public List<Post> findMyPosts(Long loginId){
        Member member= memberRepository.findOne(loginId);
        return postRepository.findByWriter(member);
    }

    public List<Post> findPosts(){
        return postRepository.findAll();
    }

    public Post findOne(Long postId){
        return postRepository.findOne(postId);
    }

    public Post recommendOne(RecPostForm form){
        List<PostController.CategoryName> categoryNames=form.getCategoryNames();
        LocalDate startDate=form.getStartDate();
        LocalDate endDate=form.getEndDate();

        int gapDays = (int)ChronoUnit.DAYS.between(startDate, endDate)+1;
        System.out.println("날짜 차이: "+gapDays);
        List<Category> categories=new ArrayList<>();
        for (PostController.CategoryName categoryName : categoryNames) {
            Category category=categoryRepository.findOnebyName(categoryName.getName());
            categories.add(category);
        }
        List<String> unitList=new ArrayList<>();
        unitList.add("일");
        if (gapDays%7==0) unitList.add("주");
        if(gapDays%30==0) unitList.add("월");
        if (gapDays%365==0) unitList.add("년");

        List<Post> list = postRepository.findByCategoriesUnit(categories,unitList);
        if(list.isEmpty()) return null;


        HashMap<String,Integer> unitToDay=new HashMap<>();
        unitToDay.put("일",1);
        unitToDay.put("주",7);
        unitToDay.put("월",30);
        unitToDay.put("년",365);
        Post post=Collections.min(list, new Comparator<Post>() {
            @Override
            public int compare(Post o1, Post o2) {
                int price1=o1.getRental_price()*(gapDays/unitToDay.get(o1.getRental_unit()));
                int price2=o2.getRental_price()*(gapDays/unitToDay.get(o2.getRental_unit()));
                return price1-price2;
            }
        });
        return post;
    }
}
