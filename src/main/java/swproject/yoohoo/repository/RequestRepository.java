package swproject.yoohoo.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import swproject.yoohoo.domain.*;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class RequestRepository {
    private final EntityManager em;

    public void save(Request request){
        if(request.getId()==null){
            em.persist(request);
        }else{
            em.merge(request);
        }
    }

    public Request findOne(Long id){
        return em.find(Request.class,id);
    }

    public List<Request> findAll(){
        return em.createQuery("select r from Request r",Request.class).getResultList();
    }

    public List<Request> findByRequester(Member member, RequestStatus status){//요청자
        return em.createQuery("select a from Request a where a.member = :member and a.status=:status",
                        Request.class)
                .setParameter("member",member)
                .setParameter("status",status)
                .getResultList();
    }

    public List<Request> findByProvider(Member member,RequestStatus status){//게시글 작성자
        return em.createQuery("select a from Request a where a.post.member = :member and a.status=:status",
                        Request.class)
                .setParameter("member",member)
                .setParameter("status",status)
                .getResultList();
    }

    public List<Request> findByPostPeriod(Post post,RequestStatus status, LocalDate startDate,LocalDate endDate){
        return em.createQuery("select a from Request a where (a.post=:post and a.status=:status) and a.startDate between :startDate and :endDate",
                Request.class)
                .setParameter("post",post)
                .setParameter("status",status)
                .setParameter("startDate",startDate)
                .setParameter("endDate",endDate)
                .getResultList();
    }

    public void deleteByStatusStartBeforeDate(RequestStatus status, LocalDate date){
        em.createQuery("delete from Request r where r.status =:status and r.startDate <:date")
                .setParameter("status",status)
                .setParameter("date",date)
                .executeUpdate();
    }

    public void deleteByStatus(RequestStatus status){
        em.createQuery("delete from Request r where r.status=:status")
                .setParameter("status",status)
                .executeUpdate();
    }

}
