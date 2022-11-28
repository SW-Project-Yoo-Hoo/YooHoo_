package swproject.yoohoo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swproject.yoohoo.domain.Alarm;
import swproject.yoohoo.domain.Member;
import swproject.yoohoo.repository.AlarmRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AlarmService {
    private final AlarmRepository alarmRepository;

    @Transactional
    public void save(Alarm alarm){
        alarmRepository.save(alarm);
    }

    public List<Alarm> findAlarms(){
        return alarmRepository.findAll();
    }

    public Alarm findOne(Long alarmid){
        return alarmRepository.findOne(alarmid);
    }

    public List<Alarm> findbyMember(Member member){
        return alarmRepository.findByMember(member);
    }
}
