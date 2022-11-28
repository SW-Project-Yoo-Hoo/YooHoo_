package swproject.yoohoo.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import swproject.yoohoo.domain.Deal;
import swproject.yoohoo.domain.DealStatus;
import swproject.yoohoo.domain.Member;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DealRepository {
    private final EntityManager em;

    public void save(Deal deal){
        if(deal.getId()==null){
            em.persist(deal);
        }else{
            em.merge(deal);
        }
    }

    public Deal findOne(Long id){return em.find(Deal.class,id);}

    public List<Deal> findByStatusReturnDate(DealStatus status,LocalDate date){
        return em.createQuery("select d from Deal d where d.status=:status and d.returnDate = :date",
                        Deal.class)
                .setParameter("status",status)
                .setParameter("date",date)
                .getResultList();
    }

    public List<Deal> findByStatusAfterReturnDate(DealStatus status,LocalDate date){
        return em.createQuery("select d from Deal d where d.status=:status and d.returnDate < :date",
                        Deal.class)
                .setParameter("status",status)
                .setParameter("date",date)
                .getResultList();
    }

    public List<Deal> findByStatusStartDate(DealStatus status, LocalDate date){
        return em.createQuery("select d from Deal d where d.status=:status and d.startDate >= :date",
                        Deal.class)
                .setParameter("status",status)
                .setParameter("date",date)
                .getResultList();
    }

    public List<Deal> findByMemberStatus(Member member, DealStatus status){
        return em.createQuery("select d from Deal d where (d.member=:member " +
                                "or d.post.member=:member) " +
                                "and d.status=:status",
                Deal.class)
                .setParameter("member",member)
                .setParameter("status",status)
                .getResultList();
    }
}
