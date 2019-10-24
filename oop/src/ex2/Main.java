package ex2;

public class Main {
    public static void main(String[] args) {
        Queue queue1 = new Queue();
        Queue queue2 = new Queue(4);

        queue1.push(1);
        queue1.push(2);
        queue1.push(3);
        queue1.push(4);
        queue1.push(5);
        queue1.push(6);

        int number = queue1.pop();

        System.out.println("Popped number: " + number);
        System.out.println(queue1.isEmpty());
        System.out.println(queue1.isFull());

        System.out.println();

        queue2.push(4);
        queue2.push(3);
        queue2.push(2);
        queue2.push(1);
        queue2.push(5);

        number = queue2.pop();
        System.out.println("Popped number: " + number);

        System.out.println(queue2.isEmpty());
        System.out.println(queue2.isFull());
    }
}
