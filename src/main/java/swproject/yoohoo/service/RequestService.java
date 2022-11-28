package swproject.yoohoo.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swproject.yoohoo.controller.RecRequestForm;
import swproject.yoohoo.controller.RequestForm;
import swproject.yoohoo.domain.*;
import swproject.yoohoo.repository.AlarmRepository;
import swproject.yoohoo.repository.MemberRepository;
import swproject.yoohoo.repository.PostRepository;
import swproject.yoohoo.repository.RequestRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Math.min;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@EnableAsync
@Slf4j
public class RequestService {
    private final RequestRepository requestRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final AlarmRepository alarmRepository;

    @Transactional
    public void save(Long memberId, RequestForm form){
        Member member= memberRepository.findOne(memberId);
        Post post=postRepository.findOne(form.getPost_id());
        Member writer=post.getMember();
        if(writer.getId()==memberId){
            throw  new IllegalArgumentException("자신의 게시물에 요청할 수 없습니다.");
        }

        Request request = Request.builder()
                        .member(member).post(post)
                        .startDate(form.getStartDate()).returnDate(form.getReturnDate())
                        .rental_quantity(form.getRental_quantity())
                        .total_price(form.getTotal_price()).build();
        requestRepository.save(request);

        Alarm alarm = Alarm.builder()
                .member(writer)
                .title("거래 요청")
                .content("회원님의 게시물에 거래 요청이 들어왔어요. 거래를 수락해주세요!")
                .photo_dir(post.getPhotos().get(0).getFilePath()).build();
        alarmRepository.save(alarm);
    }

    @Transactional
    public void cancelRequest(Long requestId,Long loginId){
        Request request=requestRepository.findOne(requestId);
        Post post=request.getPost();//
        Member member=request.getMember();//요청자
        if(member.getId()==loginId){//요청자가 취소
            request.cancel();
        }
        else {//받은사람이 취소
            request.reject();

            Alarm alarm = Alarm.builder()
                    .member(member)
                    .title("거래 취소")
                    .content("거래가 취소 되었어요. 재요청을 하시겠습니까?")
                    .photo_dir(post.getPhotos().get(0).getFilePath()).build();
            alarmRepository.save(alarm);
        }
    }

    @Transactional
    public void acceptRequest(Long requestId){
        Request request=requestRepository.findOne(requestId);
        Post post=request.getPost();
        Member member=request.getMember();
        request.accept();

        Alarm alarm = Alarm.builder()
                .member(member)
                .title("거래 요청")
                .content("회원님이 요청이 수락되었습니다.")
                .photo_dir(post.getPhotos().get(0).getFilePath()).build();
        alarmRepository.save(alarm);
    }

    public List<Request> recommendRequests(RecRequestForm form){
        Post post=postRepository.findOne(form.getPost_id());
        LocalDate startDate=form.getStartDate();
        LocalDate endDate=form.getEndDate();
        List<Request> list=requestRepository.findByPostPeriod(post,RequestStatus.REQUEST,startDate,endDate);
        if(list.isEmpty()) return null;

        int N=list.size();
        int M=post.getQuantity();
        int[][] dp=new int[N+1][M+1];
        pii[][] pick=new pii[N+1][M+1]; //되추적 용
        List<LocalDate> e;
        Collections.sort(list, new Comparator<Request>() {
            @Override
            public int compare(Request o1, Request o2) {
                LocalDate s1=o1.getStartDate(),s2=o2.getStartDate();
                LocalDate e1=o1.getReturnDate(),e2=o2.getReturnDate();
                if(e1.isEqual(e2)){
                    return s1.compareTo(s2);//s1<s2일때 -1,바꾸지않음
                }
                else return e1.compareTo(e2);
            }
        });
        e=list.stream().map(m->m.getReturnDate()).collect(Collectors.toList());
        int q0=list.get(0).getRental_quantity();
        for(int i=0;i<q0;i++){
            dp[0][i]=0;
            pick[0][i]=new pii(-1,-1,0);
        }
        for(int i=q0;i<=M;i++){
            dp[0][i]=list.get(0).getTotal_price();
            pick[0][i]=new pii(0,0,1);
        }
        for(int i=1;i<N;i++){
            /*int t=lowerBound(e,0,i,list.get(i).getStartDate());*/
            int q=list.get(i).getRental_quantity();
            LocalDate si=list.get(i).getStartDate();
            int pi=list.get(i).getTotal_price();
            boolean isOverlap=true;
            if(list.get(i-1).getReturnDate().compareTo(si)<0) isOverlap=false; //겹치지 않음
            int jq=list.get(i-1).getRental_quantity();
            for(int j=0;j<=M;j++) {
                if (j < q) {
          /*          dp[i][j] = 0;
                    pick[i][j] = new pii(-1, -1);
                } else if (j < q) {*/
                    if (isOverlap == false) {//선택X
                        dp[i][j] = dp[i - 1][M];
                        pick[i][j] = new pii(i - 1, M,0);
                    } else {
                        dp[i][j] = dp[i - 1][j];//선택X
                        pick[i][j] = new pii(i - 1, j,0);
                    }

                } else if (j >= q) {//dp[i][j] = min(dp[i - 1][j], dp[i][j - q] + pi);
                    if (isOverlap == false) {//선택O
                        dp[i][j] = dp[i - 1][M] + pi;
                        pick[i][j] = new pii(i - 1, M,1);
                    }else{
                        if (dp[i-1][j] < dp[i - 1][j-q]+pi) {//선택O
                            dp[i][j] = dp[i - 1][j-q]+pi;
                            pick[i][j] = new pii(i - 1, j-q,1);
                        }else{
                            dp[i][j] = dp[i - 1][j];//선택X
                            pick[i][j] = new pii(i - 1, j,0);
                        }
                    }

                }
            }
        }
        int maxPrice=0;
        int xx=-1, yy=N-1;
        for(int i=0;i<=M;i++){
            if(dp[N-1][i]>maxPrice){
                maxPrice=dp[N-1][i];
                xx=i;
            }
        }

        List<Request> comb=new ArrayList<>();//id값만 담기
        while(yy>=0){
            if(yy==0&&xx<q0) break;
            int ny=pick[yy][xx].f, nx=pick[yy][xx].s;
            if(ny==-1||pick[yy][xx].o==1){
                comb.add(list.get(yy));
            }
            yy=ny;
            xx=nx;
        }
        return comb;
    }
    @Getter @Setter
    @RequiredArgsConstructor
    class pii{
        int f;
        int s;
        int o;
        public pii(int f, int s,int o) {
            this.f = f;
            this.s = s;
            this.o=o;
        }
    }

    public List<Request> findRequests(){
        return requestRepository.findAll();
    }

    public Request findOne(Long requestid){
        return requestRepository.findOne(requestid);
    }

    public List<Request> findbyWriter(Long memberId){
        Member member= memberRepository.findOne(memberId);
        RequestStatus status=RequestStatus.REQUEST;
        return requestRepository.findByRequester(member,status);
    }

    public List<Request> findbyPostwriter(Long memberId){
        Member member= memberRepository.findOne(memberId);
        RequestStatus status=RequestStatus.REQUEST;
        return requestRepository.findByProvider(member,status);
    }

    @Transactional
    public void deleteOVERTIMERequest(){
        log.info("기간지난 삭제 시작");
        LocalDate now = LocalDate.now();
        requestRepository.deleteByStatusStartBeforeDate(RequestStatus.REQUEST, now);//요청 중이고 시작날짜 지난 요청 삭제

        log.info("기간지난 삭제 끝");
    }

    @Transactional
    public void deleteDELETERequest(){
        log.info("취소된 요청 삭제 시작");
        requestRepository.deleteByStatus(RequestStatus.DELETED); //요청취소해서 DELETE인 요청 삭제
        log.info("취소된 요청 삭제 끝");
    }

    private static int upperBound(int[] data, int begin, int end, int target) {

        while(begin < end) {
            int mid = (begin + end) / 2;

            if(data[mid]>target) {
                end = mid;
            }
            else {
                begin = mid + 1;
            }
        }
        return end;
    }
}
