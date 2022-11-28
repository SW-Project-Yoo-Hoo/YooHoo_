package swproject.yoohoo.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import swproject.yoohoo.service.DealService;
import swproject.yoohoo.service.RequestService;

@Component
@EnableAsync
@Slf4j
@RequiredArgsConstructor
public class Schedule {
    private final DealService dealService;
    private final RequestService requestService;

//    @Scheduled(cron = "0 27 10 * * *") //매일 10시 27분에 실행
//    @Scheduled(fixedDelay = 20000) //20초마다
    @Scheduled(cron = "0 0 0 * * *") //매일 0시에 실행
    public void scheduleDeal(){
        long now = System.currentTimeMillis() / 1000;
        log.info("schedule tasks using cron jobs - {}", now);

        dealService.PREtoIN();
        dealService.ReturnAfterWeek();
        dealService.ReturnToday();
        dealService.ReturnLastDay();
        requestService.deleteOVERTIMERequest();
        requestService.deleteDELETERequest();
    }
}
