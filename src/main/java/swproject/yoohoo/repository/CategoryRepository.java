package swproject.yoohoo.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import swproject.yoohoo.domain.Alarm;
import swproject.yoohoo.domain.Category;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Slf4j
public class CategoryRepository {
    private final EntityManager em;

    public void save(Category category){
        if(category.getId()==null){
            em.persist(category);
        }else{
            em.merge(category);
        }
    }

    public Category findOne(Long id){
        return em.find(Category.class,id);
    }

    public Category findOnebyName(String name){
        log.info("Category찾을 name={}",name);
        Category category= em.createQuery("select c from Category c where c.name = :name",Category.class)
                .setParameter("name",name)
                .getSingleResult();
        log.info("DB에서 받아온 Category={}",category);
        return category;
    }

    public List<Category> findAll(){
        return em.createQuery("select c from Category c",Category.class).getResultList();
    }


}
