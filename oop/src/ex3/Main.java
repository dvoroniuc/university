package ex3;

public class Main {
    public static void main(String[] args) {


        Text.printWordLength();
        System.out.println("Sentences: " + Text.countSentences());
        System.out.println("Letters: " + Text.countLetters());
        System.out.println("Vowels: "+ Text.countVowelsAndConsonants()[0]);
        System.out.println("Consonants: "+ Text.countVowelsAndConsonants()[1]);
        System.out.println("Spaces: "+ Text.countVowelsAndConsonants()[2]);
        Text.repeatedWords();
        Text.longestWord();
        Text.topFive();
    }

}