package swproject.yoohoo.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import swproject.yoohoo.domain.Alarm;
import swproject.yoohoo.domain.Member;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class AlarmRepository {
    private final EntityManager em;

    public void save(Alarm alarm){
        if(alarm.getId()==null){
            em.persist(alarm);
        }else{
            em.merge(alarm);
        }
    }

    public Alarm findOne(Long id){
        return em.find(Alarm.class,id);
    }

    public List<Alarm> findAll(){
        return em.createQuery("select a from Alarm a",Alarm.class).getResultList();
    }

    public List<Alarm> findByMember(Member member){
        return em.createQuery("select a from Alarm a where a.member = :member",
                        Alarm.class)
                .setParameter("member",member)
                .getResultList();
    }
}
