package swproject.yoohoo.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import swproject.yoohoo.domain.Category;
import swproject.yoohoo.domain.Member;
import swproject.yoohoo.domain.Post;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.List;


@Repository
@RequiredArgsConstructor
public class PostRepository {
    private final EntityManager em;

    public void save(Post post){
        em.persist(post);
    }

    public Post findOne(Long id){
        return em.find(Post.class,id);
    }

    public List<Post> findAll(){
        return em.createQuery("select m from Post m",Post.class)
                .getResultList();
    }

    public List<Post> findByTitle(String title){
        return em.createQuery("select p from Post p where p.title = :title",
                Post.class)
                .setParameter("title",title)
                .getResultList();
    }

    public List<Post> findByWriter(Member member){
        return em.createQuery("select p from Post p where p.member = :member",
                Post.class)
                .setParameter("member",member)
                .getResultList();
    }

    public List<Post> findByCategoriesUnit(List<Category> categoryList,List<String> unitList){
        /*if(true) {
            return em.createQuery("select p from Post p left join PostCategory pc on p=pc.post where (pc.category=:category1 or pc.category=:category2) group by pc.post having COUNT(pc.category)=2",
                            Post.class)
                    .setParameter("category1", categoryList.get(0))
                    .setParameter("category2",categoryList.get(1))
                    .getResultList();
        }*/

        String jpql="select p from Post p left join PostCategory pc on p=pc.post";
        boolean isFirstCondition=true;
        boolean isSecondCondition=true;

        for (String unit : unitList) {
            if(isFirstCondition){
                jpql+=" where (";
                isFirstCondition=false;
            }else{
                jpql+=" or";
            }
            jpql+=" p.rental_unit = :"+unit+"unit";
        }
        if(isFirstCondition==false) jpql+=")";

//        동적으로 카테고리 조건문 추가
        for (Category category : categoryList) {
            if(isSecondCondition){
                jpql+=" and (";
                isSecondCondition=false;
            }else{
                jpql+=" or";
            }
            jpql+=" pc.category = :"+category.getName()+"category";
        }
        if (isSecondCondition==false) jpql+=")";

        jpql+=" group by pc.post having COUNT(pc.category)="+categoryList.size();


        System.out.println("jpql: "+ jpql);

        TypedQuery<Post> query=em.createQuery(jpql,Post.class)
                .setMaxResults(1000); //최대 1000건
        for (Category category : categoryList) {
            query=query.setParameter(category.getName()+"category",category );
        }
        for (String unit : unitList) {
            System.out.println("unit: "+unit);
            query=query.setParameter(unit+"unit",unit);
        }

        return query.getResultList();
    }
}
