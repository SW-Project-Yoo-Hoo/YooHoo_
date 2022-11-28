package swproject.yoohoo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swproject.yoohoo.domain.Photo;
import swproject.yoohoo.repository.PhotoRepository;

import javax.persistence.EntityManager;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;

    @Transactional
    public void savePhoto(Photo photo){
        photoRepository.save(photo);
    }

    public List<Photo> findPhotos(){
        return photoRepository.findAll();
    }

    public Photo findOne(Long photoId){
        return photoRepository.findOne(photoId);
    }
}
