package swproject.yoohoo.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Photo {
    @Id @GeneratedValue
    @Column(name = "photo_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
    private Post post;

    private String fileName; //사진파일 이름
    private String filePath; //사진파일 경로
    @Builder
    public Photo(String fileName, String filePath) {
        this.fileName = fileName;
        this.filePath = filePath;
    }

    public Photo() {

    }

    public void setPost(Post post){
        this.post=post;
        post.getPhotos().add(this);
    }


}
