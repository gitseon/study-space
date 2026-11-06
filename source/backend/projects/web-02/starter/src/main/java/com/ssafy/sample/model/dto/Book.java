package com.ssafy.sample.model.dto;

/** 제공 코드입니다. 수정하지 않습니다. */
public class Book {
    private String code;
    private String name;
    private Integer price;
    private String author;
    private String category;

    public Book() {
    }

    public Book(String code, String name, Integer price, String author, String category) {
        this.code = code;
        this.name = name;
        this.price = price;
        this.author = author;
        this.category = category;
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

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Book [code=" + code + ", name=" + name + ", price=" + price + ", author=" + author + ", category=" + category + "]";
    }
}
