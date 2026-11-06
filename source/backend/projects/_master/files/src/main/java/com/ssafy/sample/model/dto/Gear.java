package com.ssafy.sample.model.dto;

/** 제공 코드입니다. 수정하지 않습니다. */
public class Gear {
    private String code;
    private String name;
    private Integer price;
    private String brand;
    private String color;

    public Gear() {
    }

    public Gear(String code, String name, Integer price, String brand, String color) {
        this.code = code;
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.color = color;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "Gear [code=" + code + ", name=" + name + ", price=" + price + ", brand=" + brand + ", color=" + color + "]";
    }
}
