package swproject.yoohoo.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@Table(name="post_category")
public class PostCategory { //Post-Category 이어주는 역할

    @Id @GeneratedValue
    @Column(name = "post_category_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;

    public void setPost(Post post){
        this.post=post;
        post.getPostCategories().add(this);
    }

    public void setCategory(Category category){
        this.category=category;
        category.getPosts().add(this);
    }

    //==생성 메서드==//
    public static PostCategory createPostCategory(Category category){
        PostCategory postCategory=new PostCategory();
        postCategory.setCategory(category);
        return postCategory;
    }


}
