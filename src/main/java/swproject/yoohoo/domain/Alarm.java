package swproject.yoohoo.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Alarm {
    @Id @GeneratedValue
    @Column(name = "alarm_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Enumerated(EnumType.STRING)
    private AlarmStatus status; //알람상태 [ALARM, DELETE]: [알람,삭제]

    private String title; //제목
    private String content; //내용
    private String photo_dir; //게시글 대표 사진
    private LocalDateTime alarmDate; //알림 생성 날짜&시간

    //==생성 메서드==//
    @Builder
    public Alarm(Member member, String title, String content, String photo_dir) {
        this.member = member;
        this.status=AlarmStatus.ALARM;
        this.title = title;
        this.content = content;
        this.photo_dir = photo_dir;
        this.alarmDate=LocalDateTime.now();
    }


    public Alarm() {

    }
}
