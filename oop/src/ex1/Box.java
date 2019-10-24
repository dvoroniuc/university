package ex1;

public class Box {

    float height;
    float width;
    float depth;

    Box() {
        height = 1f;
        width = 1f;
        depth = 1f;
    }

    Box(float a) {
        height = a;
        width = a;
        depth = a;
    }

    Box(float width, float heigth, float depth) {
        this.depth = depth;
        this.width = width;
        this.height = heigth;
    }

    public float surface() {
        return width * height;
    }

    public float volume() {
        return depth * width * height;
    }
}
