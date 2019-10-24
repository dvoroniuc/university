package ex2;

import java.util.ArrayList;

public class Queue {
    private ArrayList<Integer> values = new ArrayList<>();
    private int maxSize = 0;

    public Queue(){}

    public Queue(int maxSize){
        this.maxSize = maxSize;
    }

    public ArrayList<Integer> getValues() {
        return values;
    }

    public void setValues(ArrayList<Integer> values) {
        this.values = values;
    }

    void push(int value) {
        if (maxSize == 0 || values.size() < maxSize) {
            values.add(0, value);
            System.out.println("Inserted " + value);
            System.out.println(values);
        } else {
            System.out.println("Queue is overloaded");
        }
    }

    int pop() {
        int number = values.get(values.size() - 1);
        values.remove(values.size() - 1);
        System.out.println(values);
        return number;
    }

    public boolean isEmpty() {
        return values.isEmpty();
    }

    public boolean isFull() {
        if (maxSize == 0) {
            System.out.println("This Queue cannot be full");
            return false;
        } else return values.size() >= maxSize;
    }
}
