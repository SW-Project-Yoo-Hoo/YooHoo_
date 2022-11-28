package swproject.yoohoo.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import swproject.yoohoo.domain.*;
import swproject.yoohoo.login.Login;
import swproject.yoohoo.service.DealService;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequiredArgsConstructor
@Slf4j
public class DealController {
    private final DealService dealService;

    @GetMapping("/my/myPreDeals")
    public ResultVO myPreDeal(@Login Member loginMember){
        List<Deal> deals=dealService.findMyPreDeal(loginMember.getId());

        for (Deal dealDTO : deals) {
            log.info("찾은 거래={}",dealDTO);
        }
        List<DealDTO> dtoList=deals.stream()
                .map(m->new DealDTO(m))
                .sorted(Comparator.comparing(DealDTO::getStartDate))
                .collect(Collectors.toList());

        return new ResultVO(200,"거래 대기 조회 성공",dtoList);
    }

    @GetMapping("/my/myInDeals")
    public ResultVO myInDeal(@Login Member loginMember){
        List<Deal> deals=dealService.findMyInDeal(loginMember.getId());
        List<DealINDTO> dtoList=deals.stream()
                .map(m->new DealINDTO(m, loginMember.getId()))
                .collect(Collectors.toList());
        return new ResultVO(200,"거래 중 조회 성공",dtoList);
    }

    @GetMapping("/my/myPostDeals")
    public ResultVO myPostDeal(@Login Member loginMember){
        List<Deal> deals=dealService.findMyPostDeal(loginMember.getId());
        List<DealDTO> dtoList=deals.stream()
                .map(m->new DealDTO(m))
                .collect(Collectors.toList());
        return new ResultVO(200,"거래 완료 조회 성공",dtoList);
    }

    @PatchMapping("/Deals/{id}")
    public ResultVO returnRequest(@PathVariable Long id, @Login Member loginMember){
        dealService.agree(id, loginMember.getId());
        return new ResultVO(200,"반납 처리 성공",null);
    }


    @Getter
    public class DealINDTO{//거래 조회 DTO(거래 대기, 거래 중, 거래 완료)
        private Long deal_id; //거래 id
        private Long post_id; //게시글 id
        private String title; //제목
        private String unit; //대여 단위
        private int price; //대여 가격
        private String image; //대표 사진
        private int total_price; //총 대여 가격
        private LocalDate startDate; //시작 날짜
        private LocalDate returnDate; //반납 날짜

        private DealReturnStatus status; //반납 상태 [REQUEST,ON,ACCEPT]: 요청하기/요청중/수락하기

        public DealINDTO(Deal deal,Long loginId) {
            this.deal_id=deal.getId();
            Post post=deal.getPost();
            this.post_id = post.getId();
            this.title = post.getTitle();
            this.unit = post.getRental_unit();
            this.price = post.getRental_price();
            this.image = post.getPhotos().get(0).getFilePath();
            this.total_price = deal.getTotal_price();
            this.startDate = deal.getStartDate();
            this.returnDate = deal.getReturnDate();

            if(!deal.isReturnU()&&!deal.isReturnP()) this.status=DealReturnStatus.REQUEST;
            else if(loginId==deal.getMember().getId()){//내가 요청자
                if(deal.isReturnU()) this.status=DealReturnStatus.ON; //내가 요청 중
                else this.status=DealReturnStatus.ACCEPT;
            }
            else{//내가 제공자
                if(deal.isReturnP()) this.status=DealReturnStatus.ON; //내가 요청 중
                else this.status=DealReturnStatus.ACCEPT;
            }
            if(deal.getReturnDate().isAfter(LocalDate.now())){//조기반납요청
                if(this.status==DealReturnStatus.REQUEST) this.status=DealReturnStatus.EARLY_REQUEST;
                else if(this.status==DealReturnStatus.ON) this.status=DealReturnStatus.EARLY_ON;
                else this.status=DealReturnStatus.EARLY_ACCEPT;
            }
        }
    }

    @Getter
    public class DealDTO{//거래 조회 DTO(거래 대기, 거래 중, 거래 완료)
        private Long deal_id; //거래 id
        private Long post_id; //게시글 id
        private String title; //제목
        private String unit; //대여 단위
        private int price; //대여 가격
        private String image; //대표 사진
        private int total_price; //총 대여 가격
        private LocalDate startDate; //시작 날짜
        private LocalDate returnDate; //반납 날짜

        public DealDTO(Deal deal) {
            Post post=deal.getPost();

            this.deal_id=deal.getId();
            this.post_id = post.getId();
            this.title = post.getTitle();
            this.unit = post.getRental_unit();
            this.price = post.getRental_price();
            this.image = post.getPhotos().get(0).getFilePath();
            this.total_price = deal.getTotal_price();
            this.startDate = deal.getStartDate();
            this.returnDate = deal.getReturnDate();
        }
    }

}
