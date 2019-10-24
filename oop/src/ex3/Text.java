package ex3;

import java.util.*;

class Text {
    private static String text = "Vending machines kill 4 times as many people as sharks per year. Fredric Baur invented the Pringles can. When he passed away in 2008, his ashes were buried in one. Psychology is the brain trying to comprehend itself. The average four year-old child asks over four hundred questions a day. Humans shed 40 pounds of skin in their lifetime, completely replacing their outer skin every month.";
    private static String words = text.replaceAll("[^A-z| ]", "");


    static void printWordLength() {
        System.out.println(words);
        String[] wordList = words.split("\\s+");
        System.out.println("Number of words: " + wordList.length);
    }

    static int countSentences() {
        String[] sentences = text.split("[!?.;]+");
        return (sentences.length);
    }

    static int countLetters() {
        String letters = text.replaceAll("[^A-z]", "");
        return (letters.length());

    }

    static int[] countVowelsAndConsonants() {
        text = text.toLowerCase();
        int vowels = 0, consonants = 0, spaces = 0;
        for (int i = 0; i < text.length(); i++) {
            char character = text.charAt(i);
            if (character == 'a' || character == 'e' || character == 'i'
                    || character == 'o' || character == 'u') {
                vowels++;
            } else if ((character >= 'a' && character <= 'z')) {
                ++consonants;
            } else if (character == ' ') {
                ++spaces;
            }
        }

        return new int[]{ vowels, consonants, spaces};
    }

    static void repeatedWords() {

        String[] theSameWord = words.toLowerCase().split("\\s+");
        Map<String, Integer> wordCounts = new HashMap<String, Integer>();
        for (String word : theSameWord) {
            Integer count = wordCounts.get(word);
            if (count == null) {
                count = 0;
            }
            wordCounts.put(word, count + 1);
        }
        Map.Entry<String, Integer> maxEntry = null;

        for (Map.Entry<String, Integer> entry : wordCounts.entrySet()) {
            if (maxEntry == null || entry.getValue().compareTo(maxEntry.getValue()) > 0) {
                maxEntry = entry;
            }
        }
        System.out.println(maxEntry);
        System.out.println(wordCounts);

    }

    static void longestWord() {
        String[] longw = words.split(" ");
        String longword = " ";
        System.out.println(Arrays.toString(longw));
        for (String s : longw) {
            if (s.length() >= longword.length()) {
                longword = s;
            }

        }

        System.out.println(longword+" is longest word with "+longword.length()+" characters");
    }
    static void topFive(){
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        ArrayList<String> arrayList = new ArrayList(Arrays.asList(text.split(" ")));
        for (int i = 1; i < 6; i++) {
            int maxValue = 0;

            for (String word : arrayList) {
                Integer number = map.get(word);
                if (number == null) number = 1;
                else number = ++number;
                map.put(word, number);
            }

            for (Map.Entry<String, Integer> entry : map.entrySet()) {
                int value = entry.getValue();
                if (value > maxValue) {
                    maxValue = value;
                }
            }
            String key = getKeyFromValue(map, maxValue);
            System.out.println(" Top " + i + " = " + key);
            map.remove(key);
            arrayList.removeAll(Collections.singleton(key));
        }
    }

    private static String getKeyFromValue(Map<String, Integer> hashMap, Integer value) {
        for (String word : hashMap.keySet()) {
            if (hashMap.get(word).equals(value)) {
                return word;
            }
        }
        return null;
    }

}

