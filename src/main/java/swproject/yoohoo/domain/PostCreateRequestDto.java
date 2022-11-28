package swproject.yoohoo.domain;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PostCreateRequestDto {
    private String title;
    private String rental_unit;
    private int rental_price;
    private int quantity;
    private String explain;

    public PostCreateRequestDto(String title, String rental_unit, int rental_price, int quantity, String explain) {
        this.title = title;
        this.rental_unit = rental_unit;
        this.rental_price = rental_price;
        this.quantity = quantity;
        this.explain = explain;
    }
}
