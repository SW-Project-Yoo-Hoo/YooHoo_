package swproject.yoohoo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import swproject.yoohoo.domain.ResultVO;
import swproject.yoohoo.exception.AlreadyExistException;

import java.io.IOException;

@Slf4j
@RestControllerAdvice
public class ApiExceptionController {


    @ResponseStatus(HttpStatus.UNAUTHORIZED) //401
    @ExceptionHandler(IllegalArgumentException.class)
    public ResultVO illegalExHandle(IllegalArgumentException e) {
        log.error("[exceptionHandle] ex", e);
        return new ResultVO(401, e.getMessage(),null);
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED) //401
    @ExceptionHandler(IllegalStateException.class)
    public ResultVO illegalExHandle(IllegalStateException e) {
        log.error("[exceptionHandle] ex", e);
        return new ResultVO(401, e.getMessage(),null);
    }

    @ResponseStatus(HttpStatus.CONFLICT)//409
    @ExceptionHandler(AlreadyExistException.class)
    public ResultVO AlreadyExistExHandle(AlreadyExistException e){
        log.error("[exceptionHandle] ex", e);
        return new ResultVO(409, e.getMessage(),null);
    }



    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) //500기본
    @ExceptionHandler
    public ResultVO exHandle(Exception e) {
        log.error("[exceptionHandle] ex", e);
        return new ResultVO(500, "내부 오류",null);
    }


}
