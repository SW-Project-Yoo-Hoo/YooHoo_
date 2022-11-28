package swproject.yoohoo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swproject.yoohoo.domain.Category;
import swproject.yoohoo.repository.CategoryRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public void saveCategory(Category category){
        categoryRepository.save(category);
    }

    public List<Category> findCategories(){
        return categoryRepository.findAll();
    }

    public Category findOne(Long categoryId){
        return categoryRepository.findOne(categoryId);
    }

    public Category findOnebyName(String categoryName){return categoryRepository.findOnebyName(categoryName);}
}
