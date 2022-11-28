package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import swproject.yoohoo.domain.Alarm;
import swproject.yoohoo.domain.Member;
import swproject.yoohoo.domain.ResultVO;
import swproject.yoohoo.login.Login;
import swproject.yoohoo.service.AlarmService;
import swproject.yoohoo.service.PostService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AlarmController {
    private final AlarmService alarmService;
    private final PostService postService;

    @GetMapping("/alarms")
    public ResultVO list(@Login Member loginMember){
        List<Alarm> alarms=alarmService.findbyMember(loginMember);
        List<alarmDTO> alarmDTOList=alarms.stream()
                .map(m->new alarmDTO(m))
                .sorted(Comparator.comparing(alarmDTO :: getAlarmDate).reversed())
                .collect(Collectors.toList());

        return new ResultVO(200,"알림 전체 조회 성공",alarmDTOList);
    }


    @Getter
    public class alarmDTO {
        private String title; //제목
        private String content; //내용
        private LocalDateTime alarmDate; //생성 날짜
        private String photo_dir; //게시글 대표 사진
        public alarmDTO(Alarm alarm) {
            this.title = alarm.getTitle();
            this.content = alarm.getContent();
            this.alarmDate = alarm.getAlarmDate();
            this.photo_dir=alarm.getPhoto_dir();
        }

    }
}
