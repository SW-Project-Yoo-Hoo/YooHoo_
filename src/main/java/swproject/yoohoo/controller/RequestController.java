package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swproject.yoohoo.domain.*;
import swproject.yoohoo.login.Login;
import swproject.yoohoo.service.DealService;
import swproject.yoohoo.service.PostService;
import swproject.yoohoo.service.RequestService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequiredArgsConstructor
public class RequestController {
    private final RequestService requestService;
    private final DealService dealService;

    @PostMapping("/requests")
    public ResultVO create(@RequestBody RequestForm form, @Login Member loginMember){
        requestService.save(loginMember.getId(), form);
        //요청 등록

        return new ResultVO(201,"거래요청 등록 성공",null);
    }

    @GetMapping("/my/requests")
    public ResultVO mylist(@Login Member loginMember){
        List<Request> requests=requestService.findbyWriter(loginMember.getId());
        List<RequestsDTO> dtoList=requests.stream()
                .map(m->new RequestsDTO(m))
                .collect(Collectors.toList());
        return new ResultVO(200,"대기 요청 조회 성공",dtoList);
    }

    @GetMapping("/my/requests_received")
    public ResultVO list(@Login Member loginMember){
        List<Request> requests=requestService.findbyPostwriter(loginMember.getId());
        List<RequestsDTO> dtoList=requests.stream()
                .map(m->new RequestsDTO(m))
                .collect(Collectors.toList());
        return new ResultVO(200,"받은 요청 조회 성공",dtoList);
    }

    @PutMapping("/requests/{id}")
    public ResultVO cancel(@PathVariable Long id,@Login Member loginMember){
        requestService.cancelRequest(id,loginMember.getId());
        return new ResultVO(200,"요청 취소/거절 성공",null);
    }

    @PostMapping("/requests/{id}")
    public ResultVO accept(@PathVariable Long id){
        requestService.acceptRequest(id); //요청 수락
        dealService.save(id); //거래 생성

        return new ResultVO(201,"거래 수락 성공",null);
    }

    @PostMapping("/my/recommended_request")
    public ResultVO recommend(@RequestBody RecRequestForm form){
        List<Request> requests=requestService.recommendRequests(form);
        if(requests==null) {
            return new ResultVO(200,"해당 조합이 없음",null);
        }

        List<RequestIdDTO> dtoList=requests.stream()
                .map(m->new RequestIdDTO(m))
                .collect(Collectors.toList());
        return new ResultVO(200,"요청 조합 추천 성공",dtoList);
    }

    @Getter
    public class RequestsDTO{//거래요청 전체보기 DTO
        private Long request_id; //거래요청 id
        private Long post_id; //게시글 id
        private Image image; //대표 사진
        private String title; //제목
        private LocalDate startDate; //시작 날짜
        private LocalDate returnDate; //반납 날짜

        public RequestsDTO(Request request) {
            this.request_id = request.getId();
            this.post_id=request.getPost().getId();
            this.image = new Image(request.getPost().getPhotos().get(0));
            this.title = request.getPost().getTitle();
            this.startDate = request.getStartDate();
            this.returnDate = request.getReturnDate();
        }
    }

    @Getter
    public class RequestIdDTO{//요청 조합 DTO
        private Long request_id; //요청 아이디

        public RequestIdDTO(Request request) {
            this.request_id = request.getId();
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
