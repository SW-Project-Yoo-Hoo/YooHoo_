package swproject.yoohoo.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultVO {
    private int code;
    private String message;
    private Object data;
}
