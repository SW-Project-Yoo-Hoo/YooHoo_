package swproject.yoohoo.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import swproject.yoohoo.domain.Photo;

import javax.persistence.EntityManager;
import java.util.List;


@Repository
@RequiredArgsConstructor
public class PhotoRepository {
    private final EntityManager em;

    public void save(Photo photo){
        if(photo.getId()==null){
            em.persist(photo);
        }else {
            em.merge(photo);
        }
    }

    public Photo findOne(Long id){
        return em.find(Photo.class,id);
    }

    public List<Photo> findAll(){
        return em.createQuery("select p from Photo p",Photo.class).getResultList();
    }
}
