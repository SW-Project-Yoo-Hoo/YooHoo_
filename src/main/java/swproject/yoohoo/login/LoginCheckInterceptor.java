package swproject.yoohoo.login;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import swproject.yoohoo.domain.SessionConst;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Slf4j
public class LoginCheckInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String requestMethod = request.getMethod();

        log.info("인증 체크 인터셉터 실행 {}",requestURI);
        log.info("메서드 방식 {}",requestMethod);
        HttpSession session = request.getSession(false);


        if(session==null||session.getAttribute(SessionConst.LOGIN_MEMBER)==null){//로그인X상태
            log.info("로그인X 사용자 요청");
            if(requestURI.equals("/posts")&&requestMethod.equals("GET")) return true;
            if(requestURI.equals("/members")&&requestMethod.equals("POST")) return true;

            log.info("미인증 사용자 요청");
            //로그인으로 redirect
            response.sendRedirect("/login?redirectURL="+requestURI);
//            return false;
        }
        return true;
    }

}
